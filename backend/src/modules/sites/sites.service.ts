import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { DateTime } from 'luxon';
import { NearbySiteResponseData } from 'src/common/dto/response/site.response';
import { Scope } from 'src/common/enums/scope.enum';
import { TestResultType } from 'src/common/enums/test-result.enum';
import { getUserScope } from 'src/common/functions/get-user-role';
import { applyProjectScope } from 'src/common/functions/tenant-scope';
import { CreateCollectionPlanObj } from 'src/common/types/create-collectionplan-obj.type';
import { CreateSiteObj } from 'src/common/types/create-site-obj.type';
import { Disease } from 'src/entities/disease.entity';
import { LabTest } from 'src/entities/lab-test.entity';
import { Media } from 'src/entities/media.entity';
import { Project } from 'src/entities/project.entity';
import { Sample } from 'src/entities/sample.entity';
import { Site } from 'src/entities/site.entity';
import { User } from 'src/entities/user.entity';
import { Visit } from 'src/entities/visit.entity';
import { Brackets, EntityManager, In, Repository } from 'typeorm';
import { StatusType } from '../../common/enums/status.enum';
import { VisitStatus } from '../../common/enums/visitStatus.enum';
import { FINAL_TEST_RESULTS } from '../data-import/data-import.types';
import { LocationService } from '../location/location.service';
import { MulterConfigService } from '../media/media.service';
import { RegionService } from '../region/region.service';
import { UserService } from '../users/users.service';
import { CronJobProcessor } from '../visits/visit-schedule-job-processor';
import {
  calculateAllCollectionDates,
  calculateNextCollectionDate,
} from 'src/common/functions/site-collection';
import { TenantScopeService } from '../../common/authorization/tenant-scope.service';
import {
  noUpcomingVisitsError,
  previewScheduleEdit,
  startsWithinPastMonth,
  startTooFarBackError,
  upcomingCollectionDates,
} from './collection-plan-edit';

// A plan edit replaces only the future visits nobody has touched, which
// mirrors VisitService's hasNoVisitData. Anything recorded on a visit or
// pointing at it keeps it: samples and lab tests would block the delete, and
// animal metadata would be deleted along with it.
const UNTOUCHED_VISIT_SQL = `
  "visitStartedAt" IS NULL AND "visitedAt" IS NULL AND "visitedById" IS NULL
  AND COALESCE("comment", '') = ''
  AND COALESCE(cardinality("photos"), 0) = 0
  AND COALESCE("suspectedPositives", '[]'::jsonb) = '[]'::jsonb
  AND "diseaseQuestionnaireData" IS NULL
  AND "environmentalQuestionnaireData" IS NULL
  AND "completedAtCoordinates" IS NULL
  AND NOT EXISTS (SELECT 1 FROM "samples" s WHERE s."visitId" = "visits"."id")
  AND NOT EXISTS (SELECT 1 FROM "animal_metadata" a WHERE a."visit_id" = "visits"."id")
  AND NOT EXISTS (SELECT 1 FROM "lab_tests" l WHERE l."visitId" = "visits"."id")`;

@Injectable()
export class SitesService {
  constructor(
    private readonly mediaService: MulterConfigService,
    private readonly userService: UserService,
    private readonly locationService: LocationService,
    private readonly regionService: RegionService,
    private readonly process: CronJobProcessor,
    @InjectRepository(Site)
    private readonly siteRepository: Repository<Site>,
    @InjectRepository(Visit)
    private readonly visitRepository: Repository<Visit>,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    @InjectRepository(Disease)
    private readonly diseaseRepository: Repository<Disease>,
    @InjectRepository(Sample)
    private readonly sampleRepository: Repository<Sample>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(LabTest)
    private readonly labTestRepository: Repository<LabTest>,
    private readonly tenantScopeService: TenantScopeService,
  ) {}

  async findAll(query: any, user: any): Promise<Site[]> {
    const {
      project,
      testResult,
      disease,
      siteType,
      startDate,
      endDate,
      filterBy,
      farmType,
      search,
      latitude,
      longitude,
    } = query;
    const baseQuery = this.siteRepository
      .createQueryBuilder('site')
      .leftJoinAndSelect('site.project', 'project')
      .leftJoinAndSelect('project.createdBy', 'projectCreatedBy')
      .leftJoinAndSelect('site.diseases', 'diseases')
      .leftJoinAndSelect('site.visits', 'visits')
      .leftJoinAndSelect('visits.team', 'team')
      .leftJoinAndSelect('site.location', 'location')
      .leftJoinAndSelect('location.region', 'region')
      .leftJoinAndSelect('region.parentRegion', 'parentRegion')
      .leftJoinAndSelect('site.collectionCollector', 'collectionCollector')
      .leftJoinAndSelect('collectionCollector.team', 'collectionCollectorTeam')
      .leftJoinAndSelect('site.createdBy', 'createdBy')
      .leftJoinAndSelect('createdBy.team', 'createdByTeam')
      .andWhere('site.status = :status', { status: StatusType.ACTIVE });

    // `user` is req.user, already eager-loaded by UserService.findOne with
    // team/project/roles/roles.role/roles.role.permissions/roles.workspace -
    // re-fetching it here was a redundant query.
    const userData = user;
    // Resolve the caller's real tenant scope from `user_roles` (System /
    // Workspace -> its projects / Project / Team), falling back to `1 = 0`
    // when they reach zero projects. This used to be a raw
    // `if (userData?.project?.id)` check, which is only ever populated for
    // legacy single-project users - it was silently skipped (no predicate
    // at all) for workspace-admins and any other role without that legacy
    // FK, returning every site in every workspace. See FINDINGS.md §21e.
    const tenant = await this.tenantScopeService.forUser(userData);
    applyProjectScope(baseQuery, tenant, 'project.id');
    // Super-admins (System scope) can see all sites - no createdBy filter

    if (project) {
      baseQuery.andWhere('project.id = :project', { project });
    } else if (query?.workspaceId) {
      baseQuery.andWhere('project.workspace_id = :workspaceId', {
        workspaceId: query.workspaceId,
      });
    }

    if (disease) {
      baseQuery.andWhere('diseases.id = :disease', { disease });
    }

    if (siteType) {
      baseQuery.andWhere('site.siteType = :siteType', { siteType });
    }

    if (startDate && endDate) {
      baseQuery.andWhere(
        'DATE(site.createdAt) BETWEEN :startDate AND :endDate',
        {
          startDate,
          endDate,
        },
      );
    }

    if (filterBy === 'newest') {
      baseQuery.orderBy('site.createdAt', 'DESC');
    } else if (filterBy === 'nearest' && latitude && longitude) {
      baseQuery.andWhere(
        `ST_Distance(ST_Transform(site.locations.coordinates, 4326)::geography,
          ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography
        )`,
      );
    } else if (Object.values(StatusType).includes(filterBy)) {
      baseQuery.andWhere('site.status = :status', { status: filterBy });
      baseQuery.orderBy('site.createdAt', 'DESC');
    }

    if (farmType) {
      const farmTypeArr = farmType.split(',');
      baseQuery.andWhere('site.farmType IN (:...farmTypes)', {
        farmTypes: farmTypeArr,
      });
    }

    if (search) {
      baseQuery.andWhere('site.name ILIKE :search', { search: `%${search}%` });
    }

    const sites = await baseQuery
      .orderBy('site.createdAt', 'DESC')
      .orderBy('site.createdAt', 'DESC')
      .getMany();
    const resultSites = [];
    for (const site of sites) {
      if (testResult && disease) {
        const tr = await this.getSiteStatusByDiseases(disease, site.id);
        if (tr.status === testResult) {
          site.testResult = tr.status;
          resultSites.push(site);
        }
      } else {
        if (disease) {
          const tr = await this.getSiteStatusByDiseases(disease, site.id);
          site['testResult'] = tr.status;
        }
        resultSites.push(site);
      }
    }

    // Batch-fetch every site's photos in a single query instead of one
    // mediaRepository lookup + N signed-URL calls per site.
    const allPhotoIds = resultSites.flatMap((site) =>
      site.photos ? site.photos : [],
    );
    const allPhotos = allPhotoIds.length
      ? await this.mediaRepository.findBy({ id: In(allPhotoIds) })
      : [];
    const photosById = new Map(allPhotos.map((photo) => [photo.id, photo]));

    await Promise.all(
      resultSites.map(async (site) => {
        const photoIds = site.photos ? site.photos : [];
        const photos = photoIds
          .map((id) => photosById.get(id))
          .filter((photo): photo is Media => Boolean(photo));
        let filteredPhotos = photos;

        if (photos.length > 1) {
          filteredPhotos = photos.filter(
            (photo) => !photo.key.includes(process.env.DEFAULT_IMAGE_THUMBNAIL),
          );
        }

        site.photos = await Promise.all(
          filteredPhotos.map(async (photo) =>
            this.mediaService.getSignedFileUrl(photo.key),
          ),
        );
      }),
    );

    return resultSites;
  }

  async getSiteStatusByDiseases(
    diseaseId: string,
    siteId: string,
  ): Promise<{ siteId: string; status: TestResultType }> {
    // Fetch lab tests with matching disease IDs
    const result = await this.sampleRepository
      .createQueryBuilder('sample')
      .innerJoin('sample.site', 'site')
      .select('site.id', 'siteId')
      .addSelect(
        `
      CASE
        WHEN EXISTS (
          SELECT 1 FROM samples s
          INNER JOIN lab_tests lt ON lt."sampleId" = s.id
          WHERE s."siteId" = site.id
            AND lt."diseaseId" = :diseaseId
            AND lt."testResult" = :positive
        ) THEN :positive
        WHEN EXISTS (
          SELECT 1 FROM samples s
          INNER JOIN lab_tests lt ON lt."sampleId" = s.id
          WHERE s."siteId" = site.id
            AND lt."diseaseId" = :diseaseId
            AND lt."testResult" = :negative
        ) THEN :negative
        ELSE :pending
      END
    `,
        'status',
      )
      .where('site.id = :siteId', { siteId })
      .setParameters({
        diseaseId,
        positive: TestResultType.POSITIVE,
        negative: TestResultType.NEGATIVE,
        pending: TestResultType.PENDING,
      })
      .getRawOne();

    if (!result) {
      return { siteId, status: TestResultType.PENDING };
    }
    return { siteId, status: result.status };
  }

  // A9: `query.projectId` is optional only because not every caller has
  // been threaded through to pass the route's `:projectId` yet - when it IS
  // supplied, the lookup is bound to it so a site id alone (from a foreign
  // project) can never be read or updated through here. See
  // FINDINGS.md §21a.
  async findOne(query: {
    id: string;
    projectId?: string;
    [key: string]: any;
  }): Promise<any> {
    // A malformed id used to fail inside Postgres and reach the client as a
    // 404 through a catch-all; keep the 404 without the round trip. Database
    // errors are no longer caught here, so a timeout is not reported as 404.
    if (!isUUID(query.id)) {
      throw new NotFoundException(`Site with query ${query.id} not found`);
    }

    const { projectId, ...rest } = query;
    const where: Record<string, any> = { ...rest };
    if (projectId) {
      where.project = { id: projectId };
    }
    const site = await this.siteRepository.findOne({
      where,
      relations: [
        'project',
        'diseases',
        'collectionCollector',
        'createdBy',
        'createdBy.team',
        'location',
        'location.region',
        'location.region.parentRegion',
      ],
    });
    if (!site) {
      throw new NotFoundException(`Site with query ${query.id} not found`);
    }

    // The one-to-many trees get their own queries. Joined into the query
    // above they multiplied each other (visits x their samples x site samples
    // x the creator's eager team members): 235k rows / ~1 GB for one busy
    // site, enough to hit the statement timeout.
    site.visits = await this.visitRepository.find({
      where: { site: { id: site.id } },
      relations: ['samples'],
    });
    site.samples = await this.sampleRepository.find({
      where: { site: { id: site.id } },
    });

    const signedUrlPaths = await this.getSignedUrlForSingleSite(site);

    // Sort the diseases array in-place
    if (site.diseases.length > 0) {
      site.diseases.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
    }

    let nextCollectionDate: string | null = null;
    if (site.visits && site.visits.length > 0) {
      const todayStart = DateTime.utc().startOf('day').toJSDate();
      const upcomingVisits = site.visits
        .filter(
          (v) =>
            !v.isCompleted &&
            v.visitStatus !== 'skipped' &&
            v.visitStatus !== 'completed' &&
            new Date(v.visitScheduledAt) >= todayStart,
        )
        .sort(
          (a, b) =>
            new Date(a.visitScheduledAt).getTime() -
            new Date(b.visitScheduledAt).getTime(),
        );

      if (upcomingVisits.length > 0) {
        nextCollectionDate = new Date(
          upcomingVisits[0].visitScheduledAt,
        ).toISOString();
      }
    }

    site.visits = (site.visits ?? []).map((visit) => ({
      ...visit,
      totalSamples: visit.samples?.length ?? 0,
    })) as any;

    return {
      site,
      photos: signedUrlPaths,
      nextCollectionDate,
    };
  }

  // Existence check for callers that only need to know the site belongs to
  // the project (e.g. visit creation). Unlike findOne() it loads no relations,
  // so a site with many visits/samples can't push it into the statement
  // timeout.
  async existsInProject(id: string, projectId: string): Promise<boolean> {
    // findOne() turned Postgres' invalid-uuid error into a 404; keep that
    // outcome for malformed ids instead of surfacing a 500.
    if (!isUUID(id)) return false;
    return this.siteRepository.existsBy({ id, project: { id: projectId } });
  }

  // The site's stored collection start date, or null when it has none. Plan
  // edits that leave the start date out keep this one.
  async getCollectionStartDate(
    id: string,
    projectId: string,
  ): Promise<Date | null> {
    if (!isUUID(id)) return null;
    const site = await this.siteRepository.findOne({
      where: { id, project: { id: projectId } },
      select: { id: true, collectionStartDate: true },
    });
    return site?.collectionStartDate ?? null;
  }

  async getSignedUrlForSingleSite(site) {
    const photoIds = site?.photos ? site.photos : [];
    const photos = photoIds.length
      ? await this.mediaRepository.findBy({ id: In(photoIds) })
      : [];

    let filteredPhotos = photos;

    // Exclude default thumbnail if there are multiple images
    if (photos.length > 1) {
      filteredPhotos = photos.filter(
        (photo) => !photo.key.includes(process.env.DEFAULT_IMAGE_THUMBNAIL),
      );
    }

    const signedUrlPaths = await Promise.all(
      filteredPhotos.map(async (photo) => {
        return await this.mediaService.getSignedFileUrl(photo.key);
      }),
    );
    return signedUrlPaths;
  }

  // A13: `projectId` is optional only because not every caller has been
  // threaded through to pass the route's `:projectId` yet - when it IS
  // supplied it's ANDed onto the tenant-scoped query below, narrowing it
  // further. See FINDINGS.md §21e.
  async getNearbySites(
    params: any,
    latitude: number,
    longitude: number,
    radius: number,
    user: any,
    assignedTo: string,
    projectId?: string,
  ): Promise<NearbySiteResponseData[]> {
    try {
      const baseQuery = this.siteRepository
        .createQueryBuilder('site')
        .leftJoinAndSelect('site.location', 'location') // Join the location table
        .select(['site', 'location']) // Select site and location data
        .leftJoinAndSelect('site.project', 'project')
        .leftJoinAndSelect('project.createdBy', 'projectCreatedBy')
        .leftJoinAndSelect('site.collectionCollector', 'collectionCollector')
        .leftJoinAndSelect(
          'collectionCollector.team',
          'collectionCollectorTeam',
        )
        .leftJoinAndSelect('site.createdBy', 'createdBy')
        .leftJoinAndSelect('site.updatedBy', 'updatedBy')
        .addSelect([
          `ST_Distance(
            ST_Transform(location.coordinates, 4326)::geography,
            ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography
          ) AS "distance"`,
        ])
        .where(
          `ST_DWithin(
            ST_Transform(location.coordinates, 4326)::geography,
            ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
            :radius
          )`,
          { latitude, longitude, radius },
        )
        .orderBy('distance', 'ASC'); // Sort by closest locations first
      // `user` is req.user, already eager-loaded by UserService.findOne with
      // team/project/roles/roles.role/roles.role.permissions/roles.workspace
      // - re-fetching it here was a redundant query.
      const userData = user;
      const tenant = await this.tenantScopeService.forUser(userData);
      // Super-admins (System scope) can see all projects - no filter needed
      if (assignedTo && tenant.scope === Scope.Team && userData?.team?.id) {
        baseQuery.andWhere('collectionCollector.team.id = :teamId', {
          teamId: userData.team.id,
        });
      } else {
        // Was `if (userData?.project?.id)` - a legacy single-project FK
        // that's null for workspace-admins, so the predicate was silently
        // skipped for them and every project's sites leaked through. Use
        // the fully-resolved tenant scope instead.
        applyProjectScope(baseQuery, tenant, 'project.id');
      }
      if (projectId) {
        baseQuery.andWhere('project.id = :routeProjectId', {
          routeProjectId: projectId,
        });
      }

      // Apply additional filters based on the request query
      if (params.filterBy === 'newest') {
        // Newest sites first (default)
        baseQuery.orderBy('site.createdAt', 'DESC');
      } else if (
        params.filterBy == 1 ||
        params.filterBy == 2 ||
        params.filterBy == 3
      ) {
        // Pending sites first (status is ACTIVE)
        baseQuery.andWhere('site.status = :status', {
          status: params.filterBy,
        });
        baseQuery.orderBy('site.createdAt', 'DESC'); // Still order by createdAt
      }

      // Filter by farm type (array of strings)
      if (params.farmType && Array.isArray(params.farmType)) {
        baseQuery.andWhere('site.farmType IN (:...farmTypes)', {
          farmTypes: params.farmType.map((farm) => farm),
        });
      }

      const sites = await baseQuery.orderBy('distance', 'ASC').getMany();
      const rawResults = await baseQuery.getRawMany();

      // Attach the computed distance to the site objects
      const nearbySites: NearbySiteResponseData[] = sites.map(
        (site, index) => ({
          ...site,
          distance: parseFloat(rawResults[index]?.distance) || 0, // Ensure distance is a number
        }),
      );
      // sites.forEach((site, index) => {
      //   (site as any).distance = parseFloat(rawResults[index]?.distance) || 0;
      // });

      for (const site of sites) {
        const photoIds = site.photos ? site.photos : [];
        const photos = photoIds.length
          ? await this.mediaRepository.findBy({ id: In(photoIds) })
          : [];
        let filteredPhotos = photos;
        // Exclude default thumbnail if there are multiple images
        if (photos.length > 1) {
          filteredPhotos = photos.filter(
            (photo) => !photo.key.includes(process.env.DEFAULT_IMAGE_THUMBNAIL),
          );
        }

        site.photos = await Promise.all(
          filteredPhotos.map(async (photo) =>
            this.mediaService.getSignedFileUrl(photo.key),
          ),
        );
      }

      return nearbySites;
    } catch (error) {
      throw new Error(error.message || 'Error retrieving nearby sites');
    }
  }

  getNextVisitDate(site: any): DateTime | null {
    return calculateNextCollectionDate(site);
  }

  // `manager` runs the work inside a caller's transaction; without one it gets
  // its own. A day the site already has a visit on gets no other, nor does
  // the day a rescheduled visit was moved from. `replacing` names the days of
  // visits the caller just deleted to replace: those days get a visit again
  // even where a kept visit shares them.
  async generateAllVisitsForSite(
    site: Site,
    options?: {
      onlyFuture?: boolean;
      replacing?: Date[];
      manager?: EntityManager;
    },
  ): Promise<void> {
    let fullSite = site;
    if (!site.collectionCollector || !site.project) {
      fullSite = await this.siteRepository.findOne({
        where: { id: site.id },
        relations: ['collectionCollector', 'project', 'location', 'diseases'],
      });
      if (!fullSite) return;
    }

    if (
      !fullSite.collectionStartDate ||
      fullSite.collectionFrequencyInterval === null ||
      fullSite.collectionFrequencyInterval === undefined ||
      !fullSite.collectionCollector
    ) {
      return;
    }

    const fromDate = options?.onlyFuture
      ? DateTime.utc().startOf('day')
      : undefined;

    const scheduledDates = calculateAllCollectionDates(fullSite, { fromDate });
    if (!scheduledDates || scheduledDates.length === 0) {
      return;
    }

    const lastDate = scheduledDates[scheduledDates.length - 1];
    const lastScheduleDate = lastDate ? lastDate.toJSDate() : null;

    // Reads go through the same manager as the writes, so a caller's delete
    // in the same transaction is already visible.
    const schedule = async (manager: EntityManager) => {
      // Fetch collector's team once
      const collectorUser = await manager.findOne(User, {
        where: { id: fullSite.collectionCollector.id },
        relations: ['team'],
      });
      const teamData = collectorUser?.team;

      // Fetch all existing visits for this site to prevent duplicate dates
      const existingVisits = await manager.find(Visit, {
        where: { site: { id: fullSite.id } },
        select: ['id', 'visitScheduledAt', 'rescheduledFrom'],
      });

      const existingDateKeys = new Set<string>();
      for (const v of existingVisits) {
        if (v.visitScheduledAt) {
          const dKey = DateTime.fromJSDate(new Date(v.visitScheduledAt), {
            zone: 'utc',
          }).toISODate();
          if (dKey) existingDateKeys.add(dKey);
        }
        if (v.rescheduledFrom) {
          const fromKey = DateTime.fromJSDate(new Date(v.rescheduledFrom), {
            zone: 'utc',
          }).toISODate();
          if (fromKey) existingDateKeys.add(fromKey);
        }
      }
      for (const day of options?.replacing ?? []) {
        const replacedKey = DateTime.fromJSDate(new Date(day), {
          zone: 'utc',
        }).toISODate();
        if (replacedKey) existingDateKeys.delete(replacedKey);
      }

      const visitsToCreate: Visit[] = [];
      for (const visitDateTime of scheduledDates) {
        const dateKey = visitDateTime.toISODate();
        if (dateKey && !existingDateKeys.has(dateKey)) {
          existingDateKeys.add(dateKey);
          visitsToCreate.push(
            this.visitRepository.create({
              site: fullSite,
              collector: fullSite.collectionCollector,
              team: teamData,
              project: fullSite.project,
              questionSetId: 'qs-1',
              visitScheduledAt: visitDateTime.toJSDate(),
            }),
          );
        }
      }

      if (visitsToCreate.length > 0) {
        await manager.save(Visit, visitsToCreate, { chunk: 100 });
      }
      await manager.update(Site, fullSite.id, {
        collectionLastScheduleDate: lastScheduleDate,
      });
    };

    if (options?.manager) {
      await schedule(options.manager);
    } else {
      await this.siteRepository.manager.transaction(schedule);
    }

    fullSite.collectionLastScheduleDate = lastScheduleDate;
  }

  async create(
    createSiteObj: CreateSiteObj,
    projectData: Project,
    diseasesData: Disease[],
    collectionObj: CreateCollectionPlanObj,
    createdBy: User,
    photos: any,
  ): Promise<Site> {
    // console.log('Create site obj');
    // console.log(createSiteObj);
    // console.log('Collection obj');
    // console.log(collectionObj);

    const duplicateSite = await this.siteRepository
      .createQueryBuilder('site')
      .innerJoinAndSelect('site.location', 'location')
      .innerJoinAndSelect('site.project', 'project')
      .where('project.id = :projectId', { projectId: projectData.id })
      .andWhere(
        new Brackets((qb) => {
          qb.where('site.name ILIKE :siteName', {
            siteName: createSiteObj.name,
          });
          // .orWhere(
          //   `ST_DWithin(
          //       ST_Transform(location.coordinates, 4326)::geography,
          //       ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
          //       :radius
          //     )`,
          //   {
          //     latitude: createSiteObj.latitude,
          //     longitude: createSiteObj.longitude,
          //     radius: 100,
          //   },
          // );
        }),
      )
      .getOne();

    if (duplicateSite) {
      console.warn(
        `[SitesService] Conflict: A site named "${createSiteObj.name}" already exists in project ID: ${projectData.id}. ` +
          `Existing site ID: ${duplicateSite.id}, SiteCode: ${duplicateSite.siteCode}, ` +
          `Requested SiteCode: ${createSiteObj.siteCode}`,
      );

      if (
        createSiteObj.siteCode &&
        duplicateSite.siteCode === createSiteObj.siteCode
      ) {
        const existingSite = await this.siteRepository.findOne({
          where: { id: duplicateSite.id },
          relations: [
            'collectionCollector',
            'diseases',
            'location',
            'project',
            'location.region',
            'location.region.parentRegion',
          ],
        });

        if (existingSite) {
          return existingSite;
        }
      }

      throw new ConflictException(
        `A site named "${createSiteObj.name}" already exists in this project.`,
      );
    }

    const location = await this.locationService.create({
      regionId: createSiteObj.regionId,
      latitude: createSiteObj.latitude,
      longitude: createSiteObj.longitude,
    });

    if (photos) {
      const filesArr = await Promise.all(
        photos.map(async (data) => {
          const arr = data.split('/');
          const key = arr[arr.length - 1];
          const file = await this.mediaRepository.create({
            key: `${process.env.S3_FOLDER}/${process.env.NODE_ENV}/${key}`,
            path: data,
          });
          await this.mediaRepository.save(file);
          return file.id; // Collect the file ID after saving
        }),
      );
      if (createSiteObj.photos && Array.isArray(createSiteObj.photos)) {
        createSiteObj.photos = [...createSiteObj.photos, ...filesArr];
      } else {
        createSiteObj.photos = filesArr;
      }
    }

    const queryBuilder = this.siteRepository.createQueryBuilder();
    const result = await queryBuilder
      .insert()
      .into(Site)
      .values({
        ...createSiteObj,
        project: projectData,
        location,
        ...collectionObj,
        createdBy,
        updatedBy: createdBy,
      })
      .returning('*')
      .execute();

    const siteData = result.raw[0] as Site;
    if (!siteData) {
      throw new Error('Failed to create site');
    }

    // ✅ Fix: Add Diseases explicitly using `.relation().add()`
    if (diseasesData.length > 0) {
      await queryBuilder
        .relation(Site, 'diseases') // Specify the relation
        .of(siteData.id) // Specify the site ID
        .add(diseasesData.map((disease) => disease.id)); // Add the disease IDs
    }

    // ✅ Maintain relation for collectionCollector
    console.log(collectionObj.collectionCollector);
    const user = collectionObj.collectionCollector;
    const userData = await this.userRepository.findOne({
      where: { id: user?.id },
      relations: [
        'team',
        'project',
        'roles',
        'roles.role',
        'roles.role.permissions',
      ],
    });

    const userScope = await getUserScope(userData);

    if (collectionObj.collectionCollector && userScope === Scope.System) {
      throw new Error('super-admin can not be collector');
    }
    if (user) {
      await queryBuilder
        .relation(Site, 'collectionCollector') // Specify the relation
        .of(siteData.id) // Specify the site ID
        .set(user.id); // Add the single user ID
    }

    const createdSite = await this.siteRepository.findOne({
      where: { id: siteData.id },
      relations: [
        'collectionCollector',
        'diseases',
        'location',
        'project',
        'location.region',
        'location.region.parentRegion',
      ], // Include related users & diseases
    });

    if (!createdSite) {
      throw new Error('Failed to retrieve the created site with collector');
    }

    if (
      createdSite.collectionStartDate &&
      createdSite.collectionFrequencyInterval !== null &&
      createdSite.collectionFrequencyInterval !== undefined &&
      createdSite.collectionCollector
    ) {
      await this.generateAllVisitsForSite(createdSite);
    }
    return createdSite;
  }

  // A9: `projectId` is optional only because not every caller has been
  // threaded through to pass the route's `:projectId` yet - when it IS
  // supplied, the lookup is bound to it so a caller who belongs to project A
  // cannot mutate a site id that actually belongs to project B. See
  // FINDINGS.md §21a.
  async update(
    id: string,
    collector: any, // Single collector instead of array
    updateSiteDto: any,
    collectionObj: CreateCollectionPlanObj,
    updatedBy: User,
    photos: any,
    projectId?: string,
  ): Promise<Site> {
    // console.log('Update site obj');
    // console.log(updateSiteDto);
    // console.log('Collection obj');
    // console.log(collectionObj);

    const existingSite = await this.siteRepository.findOne({
      where: projectId ? { id, project: { id: projectId } } : { id },
      relations: ['project', 'diseases', 'collectionCollector', 'location'],
    });

    if (!existingSite) {
      throw new NotFoundException(`Site with ID ${id} not found`);
    }

    const duplicateSite = await this.siteRepository
      .createQueryBuilder('site')
      .innerJoinAndSelect('site.location', 'location')
      .innerJoinAndSelect('site.project', 'project')
      .where('project.id = :projectId', { projectId: existingSite.project.id })
      .andWhere(
        new Brackets((qb) => {
          qb.where('site.name ILIKE :siteName', {
            siteName: updateSiteDto.name,
          });
        }),
      )
      .andWhere('site.id != :siteId', { siteId: id })
      .getOne();

    if (duplicateSite) {
      console.warn(
        `[SitesService] Conflict on Update: A site named "${updateSiteDto.name}" already exists in project ID: ${existingSite.project.id}. ` +
          `Existing site ID: ${duplicateSite.id}, SiteCode: ${duplicateSite.siteCode}, ` +
          `Updating site ID: ${id}`,
      );
      throw new ConflictException(
        `A site named "${updateSiteDto.name}" already exists in this project.`,
      );
    }

    // A site without a plan has no plan visits yet, so its first plan is
    // scheduled from its start date, overdue dates included.
    const isFirstPlan =
      !existingSite.collectionStartDate ||
      existingSite.collectionFrequencyInterval == null;

    // Check an edited plan before anything is written. A plan whose dates
    // change must still have an upcoming collection date, unless it starts
    // within the past month: it is scheduled from its start date, so its past
    // dates become overdue visits. An older plan that has ended is not
    // restarted on its own, but needs a new start date or a longer duration.
    const planEdit = previewScheduleEdit(existingSite, {
      collectionFrequencyInterval: updateSiteDto.collectionFrequencyInterval,
      collectionDayOfWeek: updateSiteDto.collectionDayOfWeek,
      collectionDuration: updateSiteDto.collectionDuration,
      collectionStartDate: collectionObj.collectionStartDate,
      collectionExpiryDate: collectionObj.collectionExpiryDate,
    });
    // Like the apps' start-date pickers, an edit may move an existing plan's
    // start date back at most a month.
    const movesStart = !isFirstPlan && planEdit.startChanged;
    if (movesStart && !startsWithinPastMonth(planEdit.schedule)) {
      throw startTooFarBackError(planEdit.schedule);
    }
    if (
      planEdit.changed &&
      (collector ?? existingSite.collectionCollector) &&
      planEdit.schedule.collectionStartDate &&
      planEdit.schedule.collectionFrequencyInterval != null &&
      upcomingCollectionDates(planEdit.schedule).length === 0 &&
      !startsWithinPastMonth(planEdit.schedule)
    ) {
      throw noUpcomingVisitsError(planEdit.schedule);
    }
    if (planEdit.keepsStoredDuration) {
      delete updateSiteDto.collectionDuration;
    }
    if (planEdit.keepsStoredExpiry) {
      delete collectionObj.collectionExpiryDate;
    }

    // Handle file uploads
    if (photos) {
      const filesArr = await Promise.all(
        photos.map(async (data) => {
          const arr = data.split('/');
          const key = arr[arr.length - 1];
          const file = await this.mediaRepository.create({
            key: `${process.env.S3_FOLDER}/${process.env.NODE_ENV}/${key}`,
            path: data,
          });
          await this.mediaRepository.save(file);
          return file.id;
        }),
      );

      // Append new photos to existing ones (preserve old photos)
      updateSiteDto.photos = existingSite.photos
        ? [...existingSite.photos, ...filesArr]
        : filesArr;
    }

    // Prepare GeoJSON object if latitude/longitude are provided
    let location = null;
    if (
      updateSiteDto.regionId &&
      updateSiteDto.latitude &&
      updateSiteDto.longitude
    ) {
      location = await this.locationService.update(existingSite.location.id, {
        regionId: updateSiteDto.regionId,
        latitude: updateSiteDto.latitude,
        longitude: updateSiteDto.longitude,
      });
    }

    delete updateSiteDto.latitude;
    delete updateSiteDto.longitude;
    delete updateSiteDto.regionId;
    // delete updateSiteDto.state;
    // Only allow keys that map to real Site columns/relations — unknown
    // client-side fields (e.g. UI-only helpers) must not reach the SQL
    // update, where TypeORM would throw EntityPropertyNotFoundError.
    const siteProperties = new Set<string>([
      ...this.siteRepository.metadata.columns.map((c) => c.propertyName),
      ...this.siteRepository.metadata.relations.map((r) => r.propertyName),
    ]);
    // Filter out undefined or null values (for partial update)
    const updateFields: Partial<Site> = {};
    for (const key in updateSiteDto) {
      if (!siteProperties.has(key)) {
        console.warn(
          `[SitesService] Ignoring unknown field "${key}" in site update payload`,
        );
        continue;
      }
      if (updateSiteDto[key] !== undefined && updateSiteDto[key] !== null) {
        updateFields[key] = updateSiteDto[key];
      }
    }

    // Update collection object only if values are provided
    for (const key in collectionObj) {
      if (collectionObj[key] !== undefined && collectionObj[key] !== null) {
        updateFields[key] = collectionObj[key];
      }
    }

    if (updatedBy) {
      updateFields.updatedBy = updatedBy;
    }
    const setObject: Record<string, any> = {};

    // Dynamic direct assignments
    for (const [key, value] of Object.entries(updateFields)) {
      if (value === undefined || value === null) continue;

      switch (key) {
        case 'collectionDayOfWeek':
          setObject.collectionDayOfWeek = () =>
            `ARRAY[${updateFields.collectionDayOfWeek.map((day: string) => `'${day}'::sites_collectiondayofweek_enum`).join(',')}]`;
          break;
        default:
          setObject[key] = value;
      }
    }

    // Add location and updatedBy if available
    if (location) {
      setObject.location = location;
    }
    if (updatedBy) {
      setObject.updatedBy = updatedBy;
    }
    // The null filters above can't clear a column, so a plan turned one-time
    // drops its old expiry here.
    if (planEdit.clearsExpiry) {
      setObject.collectionExpiryDate = null;
    }

    // The site row and its visits change together: a failure anywhere below
    // rolls the whole edit back, rather than leaving a new plan with the old
    // visits or deleted visits with no replacements.
    return this.siteRepository.manager.transaction(async (manager) => {
      const result = await manager
        .createQueryBuilder()
        .update(Site)
        .set(setObject)
        .where('id = :id', { id })
        .returning('*')
        .execute();
      const siteData = result.raw[0] as Site;
      if (!siteData) {
        throw new Error('Failed to update site');
      }
      // Handle collector (single user)
      if (collector) {
        await manager
          .createQueryBuilder()
          .relation(Site, 'collectionCollector')
          .of(id)
          .set(null); // Remove previous collectors

        await manager
          .createQueryBuilder()
          .relation(Site, 'collectionCollector')
          .of(id)
          .set(collector); // Add the single collector
      }

      // Fetch updated site with relations
      const updatedSite = await manager.findOne(Site, {
        where: { id: siteData.id },
        relations: ['collectionCollector', 'project'],
      });

      if (!updatedSite) {
        throw new Error('Failed to retrieve the updated site with collector');
      }

      // Trigger visit creation if collection dates/plan are updated OR if a collector is being assigned
      if (
        updateFields.collectionStartDate ||
        updateFields.collectionLastScheduleDate ||
        updateFields.collectionFrequencyInterval !== undefined ||
        updateFields.collectionDuration ||
        updateFields.collectionDayOfWeek ||
        collector
      ) {
        await this.replaceUpcomingVisits(
          manager,
          updatedSite,
          planEdit.changed,
          isFirstPlan,
        );
      }

      // The visits made again above go to the new collector, but the kept
      // overdue ones would stay with the old one.
      if (collector && collector.id !== existingSite.collectionCollector?.id) {
        await this.reassignOpenVisits(manager, id, collector);
      }

      return updatedSite;
    });
  }

  // Hands a site's open visits nobody has touched, overdue ones included, to
  // its new collector and their team. Rescheduled visits and any with
  // something recorded on them stay with the collector who has them, as the
  // plan replacement keeps them.
  private async reassignOpenVisits(
    manager: EntityManager,
    siteId: string,
    collector: User,
  ): Promise<void> {
    const collectorUser = await manager.findOne(User, {
      where: { id: collector.id },
      relations: ['team'],
    });
    const team = collectorUser?.team;

    await manager
      .createQueryBuilder()
      .update(Visit)
      .set(team ? { collector, team } : { collector })
      .where('"siteId" = :siteId', { siteId })
      .andWhere('"visitStatus" IN (:...statuses)', {
        statuses: [VisitStatus.UPCOMING, VisitStatus.OVERDUE],
      })
      .andWhere('"isCompleted" = false')
      .andWhere('"rescheduledFrom" IS NULL')
      .andWhere(UNTOUCHED_VISIT_SQL)
      .execute();
  }

  // Replaces a site's untouched visits with ones from its saved plan. An
  // existing plan whose dates change is scheduled anew from its start date:
  // its untouched upcoming and overdue visits go, and every date of the new
  // plan gets a visit unless a kept one (completed, skipped, rescheduled or
  // started) already holds it. A first plan also gets its past dates; a save
  // that leaves the dates alone only replaces today's on.
  private async replaceUpcomingVisits(
    manager: EntityManager,
    site: Site,
    scheduleChanged: boolean,
    isFirstPlan: boolean,
  ): Promise<void> {
    // Only create visits if site has all required fields
    if (
      !site.collectionStartDate ||
      site.collectionFrequencyInterval === null ||
      site.collectionFrequencyInterval === undefined ||
      !site.collectionCollector
    ) {
      return;
    }

    if (upcomingCollectionDates(site).length === 0) {
      // An unchanged one, e.g. a new address on an ended plan, keeps its visits.
      if (!scheduleChanged) return;
      // A changed schedule was already checked before saving; refusing it
      // again here rolls the edit back if the saved row disagrees.
      if (!startsWithinPastMonth(site)) throw noUpcomingVisitsError(site);
    }

    const replacesPlan = scheduleChanged && !isFirstPlan;

    // Completed and skipped visits stay, as do rescheduled ones and any visit
    // with something recorded on it. A replaced plan's overdue (past) visits
    // go with its upcoming ones; otherwise they stay too.
    const deleteQuery = manager
      .createQueryBuilder()
      .delete()
      .from(Visit)
      .where('"siteId" = :siteId', { siteId: site.id });
    if (replacesPlan) {
      // An overdue visit is usually still stored as upcoming.
      deleteQuery.andWhere('"visitStatus" IN (:...statuses)', {
        statuses: [VisitStatus.UPCOMING, VisitStatus.OVERDUE],
      });
    } else {
      deleteQuery.andWhere('"visitStatus" = :status', {
        status: VisitStatus.UPCOMING,
      });
    }
    deleteQuery
      .andWhere('"isCompleted" = false')
      .andWhere('"rescheduledFrom" IS NULL');
    if (!replacesPlan) {
      const todayStart = DateTime.utc().startOf('day').toJSDate();
      deleteQuery.andWhere('"visitScheduledAt" >= :todayStart', {
        todayStart,
      });
    }
    const deleted = await deleteQuery
      .andWhere(UNTOUCHED_VISIT_SQL)
      .returning(['visitScheduledAt'])
      .execute();

    // Reset collectionLastScheduleDate so new visits are generated across the plan
    site.collectionLastScheduleDate = null;

    // A save that leaves the dates alone hands the deleted visits to the
    // site's collector. A day keeps its visit even where a kept one shares
    // it, as plan edits used to leave beside a completed visit.
    const replacedDays: Date[] = scheduleChanged
      ? []
      : (deleted.raw ?? [])
          .map((row: Partial<Visit>) => row.visitScheduledAt)
          .filter(Boolean);

    await this.generateAllVisitsForSite(site, {
      onlyFuture: !isFirstPlan && !replacesPlan,
      replacing: replacedDays,
      manager,
    });
  }

  async remove(id: string): Promise<any> {
    const deleteDto = {
      status: StatusType.DELETED,
    };
    const site = await this.siteRepository.preload({
      id: id,
      ...deleteDto,
    });

    // If the site exists, update the existing site
    return await this.siteRepository.save(site);
  }

  async exploreSites({
    regionId,
    disease,
    startDate,
    endDate,
    surveillanceType,
    siteId,
    sampleTypeId,
    testResult,
    variant,
    projectId,
    workspaceId,
    period,
    year,
    month,
    user,
  }) {
    // Resolved outside the try block: the catch below rethrows everything as
    // a plain Error (500), which would swallow the 400 for bad input.
    const periodWindow = this.resolveExplorePeriodWindow(period, year, month);

    try {
      // `user` is req.user, already eager-loaded by UserService.findOne
      // with team/team.projects/project/roles/roles.role/
      // roles.role.permissions - re-fetching it here was a redundant query.
      const userData = user;

      const tenant = await this.tenantScopeService.forUser(userData);

      // Normalise disease param: may be a single id, comma-separated, or already an array
      const diseaseIds: string[] = disease
        ? (Array.isArray(disease)
            ? disease
            : (disease as string).split(',').map((d) => d.trim())
          ).filter(Boolean)
        : [];

      // Normalise regionId param: may be single, comma-separated, or array
      const regionIds: string[] = regionId
        ? (Array.isArray(regionId)
            ? regionId
            : (regionId as string).split(',').map((r) => r.trim())
          ).filter(Boolean)
        : [];

      // Normalise siteId param
      const siteIds: string[] = siteId
        ? (Array.isArray(siteId)
            ? siteId
            : (siteId as string).split(',').map((s) => s.trim())
          ).filter(Boolean)
        : [];

      // Normalise sampleTypeId param
      const sampleTypeIds: string[] = sampleTypeId
        ? (Array.isArray(sampleTypeId)
            ? sampleTypeId
            : (sampleTypeId as string).split(',').map((s) => s.trim())
          ).filter(Boolean)
        : [];

      // Normalise testResult param
      const testResults: string[] = testResult
        ? (Array.isArray(testResult)
            ? testResult
            : (testResult as string).split(',').map((r) => r.trim())
          ).filter(Boolean)
        : [];

      const variants = Array.isArray(variant)
        ? variant
        : variant
          ? [variant]
          : [];

      // Disease where condition — supports multiple IDs
      const diseaseWhereCondition =
        diseaseIds.length > 0
          ? { id: In(diseaseIds), status: StatusType.ACTIVE }
          : { status: StatusType.ACTIVE };

      // Project scoping: resolved from `user_roles` via TenantScopeService
      // (System / Workspace -> its projects / Project / Team), not the
      // direct `user.project` / `user.team.projects` relations - those are
      // null or incomplete for workspace-admins and anyone whose access
      // comes from a project/team-scoped role rather than the legacy FKs.
      // Narrowed further to the currently-selected workspace and/or an
      // explicitly-selected project - same resolution pattern as
      // StatisticsService.getHomeLast30Days.
      let isSystem = tenant.isSystem;
      let scopedProjectIds = tenant.projectIds;

      if (workspaceId) {
        const wsProjects = await this.projectRepository.find({
          where: { workspace: { id: workspaceId } },
          select: ['id'],
        });
        const wsProjectIds = wsProjects.map((p) => p.id);
        scopedProjectIds = isSystem
          ? wsProjectIds
          : wsProjectIds.filter((id) => tenant.projectIds.includes(id));
        isSystem = false;
      }

      if (projectId) {
        // Explicitly filtering by a project (Monitor dashboard project selector)
        const ids = Array.isArray(projectId) ? projectId : [projectId];
        scopedProjectIds = isSystem
          ? ids
          : scopedProjectIds.filter((id) => ids.includes(id));
        isSystem = false;
      }

      let projectWhereCondition: Record<string, any> = {};
      if (!isSystem) {
        if (scopedProjectIds.length > 0) {
          projectWhereCondition = { id: In(scopedProjectIds) };
        }
        // If still empty the user has no accessible projects — return empty
        if (scopedProjectIds.length === 0) {
          return {
            siteData: [],
            diseaseFreeSiteCount: 0,
            diseaseFreeSitesCoordinates: [],
          };
        }
      }

      // Fetch all active diseases (scoped to accessible projects)
      let diseases = await this.diseaseRepository.find({
        where: {
          ...diseaseWhereCondition,
          ...(Object.keys(projectWhereCondition).length > 0
            ? { sites: { project: projectWhereCondition } }
            : {}),
        },
        relations: [
          'sites',
          'sites.project',
          'sites.project.surveillanceTypes',
          'sites.location',
          'sites.location.region',
        ],
      });

      const defaultDiseaseData = diseases.map((disease) => {
        return {
          diseaseId: disease.id,
          diseaseName: disease.name,
          diseaseIndex: disease.index,
          shortName: disease.shortName,
          totalSites: 0,
          positiveSites: 0,
          negativeSites: 0,
          positiveSitesCoordinates: [],
          negativeSitesCoordinates: [],
        };
      });

      // Apply Region Filter — collect sub-region IDs for all selected regions
      if (regionIds.length > 0) {
        const subRegionSets = await Promise.all(
          regionIds.map((rid) => this.regionService.findOne(rid)),
        );
        const allowedDistrictIds = new Set<string>(
          subRegionSets.flatMap((r) => r.subRegions.map((sr) => sr.id)),
        );
        // If a regionId is itself a leaf (district), also allow it directly
        regionIds.forEach((rid) => allowedDistrictIds.add(rid));

        diseases = diseases
          .map((disease) => ({
            ...disease,
            sites: disease.sites.filter((site) =>
              allowedDistrictIds.has(site.location?.region?.id),
            ),
          }))
          .filter((disease) => disease.sites.length > 0);
      }

      // Apply Site Filter on disease sites list
      if (siteIds.length > 0) {
        diseases = diseases
          .map((disease) => ({
            ...disease,
            sites: disease.sites.filter((site) => siteIds.includes(site.id)),
          }))
          .filter((disease) => disease.sites.length > 0);
      }

      // Apply Surveillance Type Filter
      if (surveillanceType) {
        diseases = diseases
          .map((disease) => ({
            ...disease,
            sites: disease.sites.filter((site) =>
              site.project.surveillanceTypes.some(
                (type) => type.id === surveillanceType,
              ),
            ),
          }))
          .filter((disease) => disease.sites.length > 0);
      }

      // Fetch LabTest results for disease-wise site stats
      const query = this.labTestRepository
        .createQueryBuilder('labTest')
        .leftJoin('labTest.project', 'projectDetail')
        .leftJoin(
          'projectDetail.sites',
          'siteDetail',
          'siteDetail.id = labTest.siteId',
        )
        .leftJoin('siteDetail.location', 'location')
        .leftJoin('location.region', 'region')
        // Joined once here for the date filters and the sample-type filter
        .leftJoin('labTest.sample', 'sample')
        .where('projectDetail.id = labTest.projectId')
        // Only completed, active tests. Pending tests (no result, or 'pending'
        // from an import) have no outcome yet, so they'd otherwise make a site
        // look like "no positive detection".
        .andWhere('labTest.testResult IN (:...finalTestResults)', {
          finalTestResults: FINAL_TEST_RESULTS,
        })
        .andWhere('labTest.status = :activeLabTestStatus', {
          activeLabTestStatus: StatusType.ACTIVE,
        });

      // Date a result belongs to: when its sample was collected, the same
      // date the rest of the Monitor page filters on.
      const collectionDateSql = 'sample.collectedAt';

      // Apply Role-Based Filtering — use the same resolved project scope
      // (`scopedProjectIds` / `isSystem`) computed above, which already
      // accounts for the tenant, the selected workspace, and an explicit
      // project filter. `scopedProjectIds` is guaranteed non-empty here when
      // `!isSystem` - the empty case returned early above.
      if (!isSystem) {
        query.andWhere('projectDetail.id IN (:...scopedProjectIds)', {
          scopedProjectIds,
        });
      }

      // Apply Disease Filter — support multiple IDs
      if (diseaseIds.length > 0) {
        query.andWhere('labTest.diseaseId IN (:...diseaseIds)', { diseaseIds });
      }

      // Apply Region Filter — support multiple regions (state or district level)
      if (regionIds.length > 0) {
        query.andWhere(
          new Brackets((qb) => {
            regionIds.forEach((rid, idx) => {
              const regionParam = `regionId_${idx}`;
              const parentParam = `parentRegionId_${idx}`;
              qb.orWhere(
                new Brackets((inner) => {
                  inner
                    .where(`region.id = :${regionParam}`, {
                      [regionParam]: rid,
                    })
                    .orWhere(`region.parentRegion.id = :${parentParam}`, {
                      [parentParam]: rid,
                    });
                }),
              );
            });
          }),
        );
      }

      // Apply Surveillance Type Filter
      if (surveillanceType) {
        query
          .leftJoin('projectDetail.surveillanceTypes', 'surveillanceType')
          .andWhere('surveillanceType.id = :surveillanceType', {
            surveillanceType,
          });
      }

      // Apply Site Filter
      if (siteIds.length > 0) {
        query.andWhere('labTest.siteId IN (:...siteIds)', { siteIds });
      }

      // Apply Sample Type Filter (labTest → sample → sampleType; `sample` is
      // already joined above)
      if (sampleTypeIds.length > 0) {
        query
          .leftJoin('sample.sampleType', 'sampleType')
          .andWhere('sampleType.id IN (:...sampleTypeIds)', { sampleTypeIds });
      }

      // Test Result filter is applied per site (HAVING below), not per row:
      // a site's positive / no-positive status must come from all its
      // results, or picking "Negative" would hide positives and make
      // positive sites look disease-free.
      const testResultHaving =
        testResults.length > 0
          ? 'COUNT(CASE WHEN labTest.testResult IN (:...testResults) THEN 1 END) > 0'
          : null;

      // Apply Variant Filter (substring match, e.g. H / N)
      if (variants.length > 0) {
        query.andWhere(
          new Brackets((qb) => {
            variants.forEach((v, idx) => {
              qb.orWhere(`labTest.variant ILIKE :variant_${idx}`, {
                [`variant_${idx}`]: `%${v}%`,
              });
            });
          }),
        );
      }

      // Apply Date Range Filter
      if (startDate && endDate) {
        query.andWhere(
          `DATE(${collectionDateSql}) BETWEEN :startDate AND :endDate`,
          {
            startDate,
            endDate,
          },
        );
      }

      // Apply Year / Month Period Filter (ANDed with the date range above).
      // Half-open window so the last day of the month is fully included.
      if (periodWindow) {
        query.andWhere(
          `${collectionDateSql} >= :periodStart AND ${collectionDateSql} < :periodEnd`,
          periodWindow,
        );
      }

      query
        .select([
          'labTest.diseaseId AS "diseaseId"',
          'siteDetail.id AS "siteId"',
          'siteDetail.name AS "siteName"',
          'siteDetail.farmType AS "farmType"',
          'location.coordinates',

          // ✅ Count total unique sites
          `COUNT(DISTINCT siteDetail.id) AS "totalSites"`,

          // ✅ Count total unique samples per site
          `COUNT(DISTINCT labTest.sampleId) AS "totalSampleCount"`,

          // ✅ Count total positive samples (samples where at least one test is positive)
          `COUNT(DISTINCT CASE 
            WHEN labTest.testResult = :positiveStatus 
            THEN labTest.sampleId 
            ELSE NULL 
          END) AS "totalPositiveSamples"`,

          // ✅ Count total negative samples
          `COUNT(DISTINCT CASE 
              WHEN labTest.testResult = :negativeStatus 
              THEN labTest.sampleId 
              ELSE NULL 
            END) AS "totalNegativeSamples"`,

          // ✅ Count total unclear samples
          `COUNT(DISTINCT CASE 
              WHEN labTest.testResult = :unclearStatus 
              THEN labTest.sampleId 
              ELSE NULL 
            END) AS "totalUnclearSamples"`,

          // ✅ Mark site as positive if any one of tests are positive
          `CASE 
              WHEN COUNT(CASE WHEN labTest.testResult = :positiveStatus THEN 1 END) > 0 
              THEN 1 
              ELSE 0 
            END AS "positiveSite"`,
        ])
        .groupBy(
          'labTest.diseaseId, siteDetail.id, siteDetail.name, siteDetail.farmType, location.coordinates',
        )
        .setParameter('positiveStatus', TestResultType.POSITIVE)
        .setParameter('negativeStatus', TestResultType.NEGATIVE)
        .setParameter('unclearStatus', TestResultType.UNCLEAR);

      if (testResultHaving) {
        query.having(testResultHaving, { testResults });
      }

      const labTestResults = await query.getRawMany();

      const diseaseData = diseases.map((disease) => {
        // Get sites related to the current disease
        const sites = labTestResults.filter(
          (result) => result.diseaseId === disease.id,
        );

        // If no matching sites, return default values
        if (sites.length === 0) {
          return {
            diseaseId: disease.id,
            diseaseName: disease.name,
            shortName: disease.shortName,
            diseaseIndex: disease.index,
            totalSites: 0,
            positiveSites: 0,
            negativeSites: 0,
            positiveSitesCoordinates: [],
            negativeSitesCoordinates: [],
          };
        }

        // Use reduce to calculate values in a single iteration
        let positiveSites = 0;
        const positiveSitesCoordinates = [];

        for (const site of sites) {
          if (site.positiveSite > 0) {
            positiveSites++;
            positiveSitesCoordinates.push({
              // Lets a client tell sites apart (GeoLens Compare narrows its
              // Site A/B list to the sites listed here)
              siteId: site.siteId,
              coordinates: site.location_coordinates,
              totalPositiveSampleCount: Number(site.totalPositiveSamples) || 0,
              totalNegativeSampleCount: Number(site.totalNegativeSamples) || 0,
              totalUnclearSampleCount: Number(site.totalUnclearSamples) || 0,
              totalSampleCount: Number(site.totalSampleCount) || 0,
              siteName: site.siteName,
              farmType: site.farmType,
              shortName: disease.shortName,
            });
          }
        }

        return {
          diseaseId: disease.id,
          diseaseName: disease.name,
          diseaseIndex: disease.index,
          shortName: disease.shortName,
          totalSites: sites.length,
          positiveSites,
          positiveSitesCoordinates,
        };
      });

      // Disease-free is decided per site across every disease in scope: a
      // site positive for one disease and negative for another is not
      // disease-free, and a site is counted once however many diseases it
      // was tested for. (The Test Result HAVING set above still applies.)
      const diseaseFreeResults = await query
        .select([
          `STRING_AGG(DISTINCT disease.shortName, ', ') AS "diseaseShortName"`,
          'siteDetail.id AS "siteId"',
          'siteDetail.name AS "siteName"',
          'siteDetail.farmType AS "farmType"',
          'location.coordinates',

          // ✅ Count total unique samples per site
          `COUNT(DISTINCT labTest.sampleId) AS "totalSampleCount"`,

          // ✅ Count total positive samples (samples where at least one test is positive)
          `COUNT(DISTINCT CASE 
          WHEN labTest.testResult = :positiveStatus 
          THEN labTest.sampleId 
          ELSE NULL 
        END) AS "totalPositiveSamples"`,

          // ✅ Count total negative samples
          `COUNT(DISTINCT CASE 
            WHEN labTest.testResult = :negativeStatus 
            THEN labTest.sampleId 
            ELSE NULL 
          END) AS "totalNegativeSamples"`,

          // ✅ Count total unclear samples
          `COUNT(DISTINCT CASE 
            WHEN labTest.testResult = :unclearStatus 
            THEN labTest.sampleId 
            ELSE NULL 
          END) AS "totalUnclearSamples"`,

          // ✅ Disease-Free Sites (Positive Tests === 0)
          `CASE 
            WHEN COUNT(DISTINCT CASE WHEN labTest.testResult = :positiveStatus THEN 1 END) = 0
            THEN 1 ELSE 0 
          END AS "diseaseFreeSite"`,
        ])
        .leftJoin('labTest.disease', 'disease')
        .groupBy(
          'siteDetail.id, siteDetail.name, siteDetail.farmType, location.coordinates',
        )
        .setParameter('positiveStatus', TestResultType.POSITIVE)
        .setParameter('negativeStatus', TestResultType.NEGATIVE)
        .setParameter('unclearStatus', TestResultType.UNCLEAR)
        .getRawMany(); // Get all results instead of just one

      // Process the results
      const diseaseFreeSites = diseaseFreeResults.filter(
        (site) => site.diseaseFreeSite > 0,
      );

      return {
        siteData: diseaseData.length > 0 ? diseaseData : defaultDiseaseData,
        diseaseFreeSiteCount: diseaseFreeSites.length,
        diseaseFreeSitesCoordinates: diseaseFreeSites.map((site) => {
          return {
            siteId: site.siteId,
            coordinates: site.location_coordinates,
            totalPositiveSampleCount: Number(site.totalPositiveSamples) || 0,
            totalNegativeSampleCount: Number(site.totalNegativeSamples) || 0,
            totalUnclearSampleCount: Number(site.totalUnclearSamples) || 0,
            totalSampleCount: Number(site.totalSampleCount) || 0,
            siteName: site.siteName,
            farmType: site.farmType,
            shortName: site.diseaseShortName,
          };
        }),
      };
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  // Maps the explore-sites `period` / `year` / `month` query params to a
  // [periodStart, periodEnd) date window. Returns null for `overall` (or no
  // period), meaning no time restriction.
  private resolveExplorePeriodWindow(
    period?: string,
    year?: string,
    month?: string,
  ): { periodStart: string; periodEnd: string } | null {
    if (!period || period === 'overall') return null;

    if (period !== 'year' && period !== 'month') {
      throw new BadRequestException(
        'period must be one of: overall, year, month',
      );
    }

    if (!/^\d{4}$/.test(String(year ?? ''))) {
      throw new BadRequestException(
        'year is required (YYYY) when period is year or month',
      );
    }
    const yearNum = Number(year);

    if (period === 'year') {
      const start = DateTime.utc(yearNum, 1, 1);
      return {
        periodStart: start.toISODate(),
        periodEnd: start.plus({ years: 1 }).toISODate(),
      };
    }

    const monthNum = Number(month);
    if (!Number.isInteger(monthNum) || monthNum < 1 || monthNum > 12) {
      throw new BadRequestException(
        'month is required (1-12) when period is month',
      );
    }

    const start = DateTime.utc(yearNum, monthNum, 1);
    return {
      periodStart: start.toISODate(),
      periodEnd: start.plus({ months: 1 }).toISODate(),
    };
  }

  async getSiteOnDisease(query, user) {
    try {
      const applyLastWeekFilter = true;
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);

      const userData = user;
      if (!userData) throw new Error('User not found');
      // Not part of the assigned task list, but the same §21c blind spot as
      // findAll(): this `if/else if` had no branch at all for Workspace
      // scope, so a workspace-admin fell through with no predicate applied
      // and saw every project's disease stats. Resolved via the same
      // tenant-scope helper used above.
      const tenant = await this.tenantScopeService.forUser(userData);

      // Build a base query joined to only ONE of the two independent
      // one-to-many collections off `project` (sites or visits), so the
      // two are never cross-joined together in the same result set.
      const buildBase = (
        joinAlias: 'siteDetails' | 'visitDetails',
        joinPath: 'project.sites' | 'project.visits',
      ) => {
        let qb = this.labTestRepository
          .createQueryBuilder('labTest')
          .leftJoin('labTest.sample', 'sample') // Ensure correct relation
          .leftJoin('labTest.project', 'project')
          .leftJoin(joinPath, joinAlias);

        // **Apply Role-Based Filtering**
        if (tenant.scope === Scope.Team && userData?.team?.id) {
          qb = qb.where('labTest.team = :teamId', {
            teamId: userData.team.id,
          });
        } else {
          // Covers Project and Workspace scope via `tenant.projectIds`; a
          // no-op for System scope.
          qb = applyProjectScope(qb, tenant, 'project.id');
        }
        return qb;
      };

      const sitesQuery = buildBase('siteDetails', 'project.sites');
      const visitsQuery = buildBase('visitDetails', 'project.visits');

      // **Apply Last Week Filter Dynamically**
      if (applyLastWeekFilter) {
        sitesQuery
          .select([
            'COUNT(DISTINCT siteDetails.id) AS totalPresentSites',
            `COUNT(DISTINCT CASE WHEN labTest.testResult = :positive AND labTest.testedAt >= :lastWeek THEN siteDetails.id ELSE NULL END) AS totalPresentPositiveSites`,
            `COUNT(DISTINCT CASE WHEN sample.createdAt >= :lastWeek THEN sample.id ELSE NULL END) AS totalPresentSamples`,
            `COUNT(DISTINCT CASE
              WHEN labTest.testResult != :unclear AND labTest.testedAt >= :lastWeek THEN sample.id
              ELSE NULL
            END) AS totalTestedSamples`,
          ])
          .setParameter('lastWeek', lastWeek)
          .setParameter('positive', TestResultType.POSITIVE)
          .setParameter('unclear', TestResultType.UNCLEAR);

        visitsQuery
          .select([
            `COUNT(DISTINCT CASE WHEN visitDetails.visitedAt >= :lastWeek THEN visitDetails.id ELSE NULL END) AS totalVisitedSites`,
            `COUNT(DISTINCT CASE WHEN labTest.testResult = :positive AND labTest.testedAt >= :lastWeek THEN visitDetails.id ELSE NULL END) AS totalVisitedPositiveSites`,
          ])
          .setParameter('lastWeek', lastWeek)
          .setParameter('positive', TestResultType.POSITIVE);
      } else {
        sitesQuery
          .select([
            'COUNT(DISTINCT siteDetails.id) AS totalPresentSites',
            `COUNT(DISTINCT CASE WHEN labTest.testResult = :positive THEN siteDetails.id ELSE NULL END) AS totalPresentPositiveSites`,
            'COUNT(DISTINCT sample.id) AS totalPresentSamples',
            `COUNT(DISTINCT CASE
              WHEN labTest.testResult != :unclear THEN sample.id
              ELSE NULL
            END) AS totalTestedSamples`,
          ])
          .setParameter('positive', TestResultType.POSITIVE)
          .setParameter('unclear', TestResultType.UNCLEAR);

        visitsQuery
          .select([
            'COUNT(DISTINCT visitDetails.id) AS totalVisitedSites',
            `COUNT(DISTINCT CASE WHEN labTest.testResult = :positive THEN visitDetails.id ELSE NULL END) AS totalVisitedPositiveSites`,
          ])
          .setParameter('positive', TestResultType.POSITIVE);
      }

      const [sitesResult, visitsResult] = await Promise.all([
        sitesQuery.getRawOne(),
        visitsQuery.getRawOne(),
      ]);
      const result = { ...sitesResult, ...visitsResult };

      return {
        sites: {
          totalPresent: Number(result.totalpresentsites) || 0,
          totalPositive: Number(result.totalpresentpositivesites) || 0,
        },
        visits: {
          totalPresent: Number(result.totalpresentsites) || 0, // Matches totalPresentSites
          totalVisited: Number(result.totalvisitedsites) || 0,
        },
        samples: {
          totalPresent: Number(result.totalpresentsamples) || 0,
          totalTested: Number(result.totaltestedsamples) || 0,
        },
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getMostPositive(query, user): Promise<any> {
    try {
      const { diseaseId, startDate, endDate } = query;

      // Ensure user is authenticated
      if (!user?.id) {
        throw new UnauthorizedException('User not authenticated');
      }

      // `user` is req.user, already eager-loaded by UserService.findOne
      // with team/project/roles/roles.role/roles.role.permissions -
      // re-fetching it here was a redundant query.
      const userData = user;

      const tenant = await this.tenantScopeService.forUser(userData);

      // Base query setup
      const queryBuilder = this.labTestRepository
        .createQueryBuilder('labTest')
        .innerJoin('labTest.site', 'siteDetails')
        .innerJoin('siteDetails.project', 'projectDetails')
        .innerJoin('siteDetails.location', 'location')
        .innerJoin('location.region', 'region')
        .leftJoin(
          (qb) => {
            return qb
              .subQuery()
              .select('projects.id', 'project_id')
              .addSelect('COUNT(DISTINCT sites.id)', 'total_sites')
              .from('projects', 'projects')
              .leftJoin('sites', 'sites', 'projects.id = sites."projectId"')
              .groupBy('projects.id');
          },
          'project_sites',
          'project_sites.project_id = projectDetails.id',
        )
        .select([
          'region.name AS district',
          'COUNT(DISTINCT CASE WHEN labTest.testResult = :positive THEN siteDetails.id END) AS "positiveCount"',
          'COUNT(DISTINCT siteDetails.id) AS "totalSiteCount"',
          `ROUND(
        (COUNT(DISTINCT CASE WHEN labTest.testResult = :positive THEN siteDetails.id END) * 100.0 / 
        NULLIF(COUNT(DISTINCT siteDetails.id), 0)
          ), 2) AS "positivePercentage"`,
        ])
        .groupBy('region.name')
        .having(
          'COUNT(DISTINCT CASE WHEN labTest.testResult = :positive THEN siteDetails.id END) > 0',
        )
        .orderBy('positivePercentage', 'DESC')
        .setParameter('positive', TestResultType.POSITIVE);

      // Role-based filtering
      // Super-admins (System scope) can see all projects - no filter needed.
      // Was `userData?.project?.id` - the legacy single-project FK, null for
      // workspace-admins and for anyone whose access comes from a Project/
      // Team-scoped user_role rather than that FK, which threw a 400 for
      // them and silently limited multi-project users to just one project.
      // Use the fully resolved tenant scope instead, matching
      // findAll()/getNearbySites() above.
      applyProjectScope(queryBuilder, tenant, 'projectDetails.id');

      // Optional filters
      if (diseaseId) {
        if (Array.isArray(diseaseId)) {
          queryBuilder.andWhere('labTest.diseaseId IN (:...diseaseId)', {
            diseaseId,
          });
        } else {
          queryBuilder.andWhere('labTest.diseaseId = :diseaseId', {
            diseaseId,
          });
        }
      }
      if (startDate) {
        queryBuilder.andWhere('labTest.testedAt >= :startDate', { startDate });
      }
      if (endDate) {
        queryBuilder.andWhere('labTest.testedAt <= :endDate', { endDate });
      }

      // Final execution
      const result = await queryBuilder
        .orderBy('"positiveCount"', 'DESC')
        .limit(5)
        .getRawMany();

      // Convert string counts to numbers
      const siteStats = result.map((item) => ({
        ...item,
        positiveCount: Number(item.positiveCount) || 0,
        totalSiteCount: Number(item.totalSiteCount) || 0,
      }));

      return { siteStats };
    } catch (error) {
      console.error('Error in getMostPositive:', error);
      throw new InternalServerErrorException(
        'Failed to fetch most positive site stats',
      );
    }
  }
}
