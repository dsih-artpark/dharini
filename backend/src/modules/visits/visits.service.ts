import { InjectQueue } from '@nestjs/bullmq';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { configDotenv } from 'dotenv';
import { DateTime } from 'luxon';
import { Scope } from 'src/common/enums/scope.enum';
import { StatusType } from 'src/common/enums/status.enum';
import { VisitStatus } from 'src/common/enums/visitStatus.enum';
import { toCollectionDay } from 'src/common/functions/site-collection';
import { applyProjectScope } from 'src/common/functions/tenant-scope';
import { TenantScopeService } from 'src/common/authorization/tenant-scope.service';
import { AnimalMetadata } from 'src/entities/animal-metadata.entity';
import { Disease } from 'src/entities/disease.entity';
import { LabTest } from 'src/entities/lab-test.entity';
import { Media } from 'src/entities/media.entity';
import { Project } from 'src/entities/project.entity';
import { Sample } from 'src/entities/sample.entity';
import { Site } from 'src/entities/site.entity';
import { Team } from 'src/entities/team.entity';
import { User } from 'src/entities/user.entity';
import { Visit } from 'src/entities/visit.entity';
import {
  And,
  Between,
  EntityManager,
  In,
  LessThan,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { MulterConfigService } from '../media/media.service';
import { SamplesService } from '../samples/samples.service';
import { computeVisitRoundsForSites } from '../../common/utils/visit-rounds.util';
import { CreateVisitDto } from './dto/create-visit.dto';
import { RescheduleVisitDto } from './dto/reschedule-visit.dto';
import { SubmitVisitDto } from './dto/submit-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';

configDotenv();

// The zone collectors' phones are in. A request's calendar day is read in it,
// as the mobile app reads the day a queued visit was collected on.
const COLLECTION_ZONE = 'Asia/Kolkata';

// Nothing has been recorded on the visit row itself: not started, visited,
// rescheduled or deleted, and no comment, photos or questionnaire answers.
const hasNoVisitData = (visit: Visit) =>
  visit.status === StatusType.ACTIVE &&
  !visit.visitStartedAt &&
  !visit.visitedAt &&
  !visit.visitedBy &&
  !visit.rescheduledFrom &&
  !visit.comment &&
  !visit.photos?.length &&
  !visit.suspectedPositives?.length &&
  !visit.diseaseQuestionnaireData &&
  !visit.environmentalQuestionnaireData &&
  !visit.completedAtCoordinates;

@Injectable()
export class VisitService implements OnModuleInit {
  constructor(
    private readonly multerConfigService: MulterConfigService,
    private readonly sampleService: SamplesService,
    @InjectQueue(process.env.QUEUE) private visitSchedulerQueue: Queue,
    @InjectRepository(Visit)
    private readonly visitRepository: Repository<Visit>,
    @InjectRepository(Site)
    private readonly siteRepository: Repository<Visit>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly collectorRepository: Repository<User>,
    @InjectRepository(Disease)
    private readonly diseaseRepository: Repository<Disease>,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly tenantScopeService: TenantScopeService,
  ) {}

  async onModuleInit() {}
  async createVisit(createVisitDto: CreateVisitDto): Promise<Visit> {
    try {
      const {
        siteId,
        collectorId,
        projectId,
        questionSetId,
        visitScheduledAt,
        visitedAt,
      } = createVisitDto;

      const site = await this.siteRepository.findOneBy({ id: siteId });
      if (!site) throw new Error('Site not found');

      let project = {};
      if (projectId) {
        project = await this.projectRepository.findOneBy({ id: projectId });
        if (!project) throw new Error('Project not found');
      }

      let collector = null;
      let team = null;
      if (collectorId) {
        collector = await this.collectorRepository.findOne({
          where: {
            id: collectorId,
          },
          relations: ['team'],
        });
        if (!collector.team) {
          throw new BadRequestException(
            "You cannot create a visit because you don't have an assigned team.",
          );
        }
        team = await this.teamRepository.findOne({
          where: { id: collector.team.id },
        });
      }

      // A request that duplicates an untouched visit gets that visit back
      // instead of a second one for the same collection. A request recording
      // an already completed visit (visitedAt) always creates one, as before.
      if (!visitedAt) {
        const existing = await this.findReusableVisit(
          site as unknown as Site,
          createVisitDto,
        );
        if (existing) return existing;
      }

      const visitStatus = VisitStatus.UPCOMING;
      let isCompleted = false;
      if (visitedAt) {
        isCompleted = true;
      }

      const visit = this.visitRepository.create({
        site,
        collector,
        team,
        project,
        questionSetId,
        visitStatus,
        isCompleted,
        visitedAt: DateTime.fromISO(visitedAt, { zone: 'utc' }).toISO(),
        visitScheduledAt: DateTime.fromISO(visitScheduledAt, {
          zone: 'utc',
        }).toISO(),
      });

      return this.visitRepository.save(visit);
    } catch (error) {
      console.log('create visit error: ', error);
      throw error;
    }
  }

  /**
   * The untouched visit a create request duplicates, if there is one:
   * - the same request again, e.g. retried after its response was lost (same
   *   site and collector, exact visitScheduledAt); or
   * - the site's start-date visit, when the request falls on the start date.
   *   The mobile app queues a "visit now" request behind every site it
   *   creates. Current builds merge it into the generated start-date visit,
   *   but older builds and interrupted syncs still post it.
   * The request's day is its IST calendar day, so 03:00 IST on the day after
   * the start date (still the start date in UTC) is not matched to it. A
   * generated visit, stored at 00:00 UTC of its day, falls within that IST day.
   */
  private async findReusableVisit(
    site: Site,
    { collectorId, projectId, questionSetId, visitScheduledAt }: CreateVisitDto,
  ): Promise<Visit | null> {
    const requested = DateTime.fromISO(visitScheduledAt, { zone: 'utc' });
    if (!collectorId || !requested.isValid) return null;

    const day = requested.setZone(COLLECTION_ZONE).startOf('day');
    const isStartDay =
      !!site.collectionStartDate &&
      toCollectionDay(site.collectionStartDate).toISODate() === day.toISODate();

    const sameDayVisits = await this.visitRepository.find({
      where: {
        site: { id: site.id },
        collector: { id: collectorId },
        visitStatus: VisitStatus.UPCOMING,
        isCompleted: false,
        visitScheduledAt: Between(day.toJSDate(), day.endOf('day').toJSDate()),
      },
      relations: ['site', 'collector', 'team', 'project', 'visitedBy'],
      order: { visitScheduledAt: 'ASC', id: 'ASC' },
    });

    const isRetry = (visit: Visit) =>
      visit.visitScheduledAt.getTime() === requested.toMillis();
    const candidates = sameDayVisits
      .filter((visit) => isRetry(visit) || isStartDay)
      .filter((visit) => !projectId || visit.project?.id === projectId)
      .filter(
        (visit) => !questionSetId || visit.questionSetId === questionSetId,
      )
      .filter(hasNoVisitData)
      .sort((a, b) => Number(isRetry(b)) - Number(isRetry(a)));

    for (const visit of candidates) {
      if (!(await this.hasLinkedData(visit.id))) return visit;
    }
    return null;
  }

  // Samples, animal metadata and lab tests point at the visit from their own
  // tables, so they are counted separately.
  private async hasLinkedData(visitId: string): Promise<boolean> {
    const counts = await Promise.all([
      this.entityManager.count(Sample, { where: { visit: { id: visitId } } }),
      this.entityManager.count(AnimalMetadata, {
        where: { visit: { id: visitId } },
      }),
      this.entityManager.count(LabTest, { where: { visit: { id: visitId } } }),
    ]);
    return counts.some((count) => count > 0);
  }

  async getVisitSummary(userId: string, projectId: string, query: any) {
    try {
      console.log('visit-summary query: ', query);
      const { startDate, endDate } = query;
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      // Mirror the old JS-side comparisons: `visit.x >= new Date(startDate)` is
      // always false when startDate/endDate don't parse to a valid Date, so every
      // date-scoped count used to silently resolve to 0. Skip the SQL entirely in
      // that case rather than letting an Invalid Date reach the query params.
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      const isValidDateRange =
        !Number.isNaN(startDateObj.getTime()) &&
        !Number.isNaN(endDateObj.getTime());

      const userData = await this.collectorRepository.findOne({
        where: { id: userId },
        relations: [
          'team',
          'roles',
          'roles.role',
          'roles.role.permissions',
          'roles.workspace',
          'project',
        ],
      });
      const tenant = await this.tenantScopeService.forUser(userData);
      const userScope = tenant.scope;
      console.log(userScope);
      let visitWhereCondition: any = {};
      // Every team-scoped role the caller holds (possibly several), ANDed
      // with the projects they can reach - not the legacy singular
      // `userData.team.id`, which would have picked one arbitrary team (or
      // crashed) for anyone holding more than one team role. Empty either
      // side fails closed (scopeHasResults below), never an absent filter.
      // Every other scope (System, Project, and Workspace - workspace-admins
      // have no singular team of their own) falls back to the
      // already-authorized :projectId route param instead.
      let scopeHasResults = true;
      if (userScope === Scope.Team) {
        if (!tenant.teamIds.length || !tenant.projectIds.length) {
          scopeHasResults = false;
        } else {
          visitWhereCondition = {
            team: { id: In(tenant.teamIds) },
            project: { id: In(tenant.projectIds) },
          };
        }
      } else {
        visitWhereCondition = { project: { id: projectId } };
      }
      console.log('visitWhereCondition ---> ', visitWhereCondition);

      const individualVisitWhereCondition: any = { collector: { id: userId } };

      const [
        overdueVisits,
        pendingVisits,
        completedVisits,
        pendingVisitsIndividual,
        completedVisitsIndividual,
        totalSampleCollected,
      ] = isValidDateRange
        ? await Promise.all([
            // Scheduled in the past, still UPCOMING/not completed, within [startDate, endDate]
            // (the old `visitStatus !== COMPLETED` check is dropped: it's implied by
            // `visitStatus === UPCOMING`, since a visit can't be both at once)
            // scopeHasResults is false only when Team scope resolved to no
            // reachable team/project at all - fails closed to 0 rather than
            // building an empty `IN ()`, same as the individual-scoped
            // queries below are unaffected by it (those are keyed on the
            // collector id alone, not team/project reachability).
            !scopeHasResults
              ? Promise.resolve(0)
              : this.visitRepository.count({
                  where: {
                    ...visitWhereCondition,
                    visitStatus: VisitStatus.UPCOMING,
                    isCompleted: false,
                    visitScheduledAt: And(
                      LessThan(currentDate),
                      MoreThanOrEqual(startDateObj),
                      LessThanOrEqual(endDateObj),
                    ),
                  },
                }),
            // Scheduled today or later, still UPCOMING/not completed, within [startDate, endDate]
            !scopeHasResults
              ? Promise.resolve(0)
              : this.visitRepository.count({
                  where: {
                    ...visitWhereCondition,
                    visitStatus: VisitStatus.UPCOMING,
                    isCompleted: false,
                    visitScheduledAt: And(
                      MoreThanOrEqual(currentDate),
                      MoreThanOrEqual(startDateObj),
                      LessThanOrEqual(endDateObj),
                    ),
                  },
                }),
            // Completed, visitedAt within [startDate, endDate]
            !scopeHasResults
              ? Promise.resolve(0)
              : this.visitRepository.count({
                  where: {
                    ...visitWhereCondition,
                    isCompleted: true,
                    visitStatus: VisitStatus.COMPLETED,
                    visitedAt: Between(startDateObj, endDateObj),
                  },
                }),
            // Same as pendingVisits, scoped to this collector instead of team/project
            this.visitRepository.count({
              where: {
                ...individualVisitWhereCondition,
                visitStatus: VisitStatus.UPCOMING,
                isCompleted: false,
                visitScheduledAt: And(
                  MoreThanOrEqual(currentDate),
                  MoreThanOrEqual(startDateObj),
                  LessThanOrEqual(endDateObj),
                ),
              },
            }),
            // Same as completedVisits, scoped to this collector instead of team/project
            this.visitRepository.count({
              where: {
                ...individualVisitWhereCondition,
                isCompleted: true,
                visitStatus: VisitStatus.COMPLETED,
                visitedAt: Between(startDateObj, endDateObj),
              },
            }),
            // Count of samples (not visits) collected by this user, on visits led by
            // this collector, whose visitedAt falls within [startDate, endDate]
            this.entityManager.count(Sample, {
              where: {
                collectedBy: { id: userId },
                visit: {
                  ...individualVisitWhereCondition,
                  visitedAt: Between(startDateObj, endDateObj),
                },
              },
            }),
          ])
        : [0, 0, 0, 0, 0, 0];

      return {
        visitCount: completedVisitsIndividual, // total visit completed by the member
        totalSampleCollected, // total sample collected by the member
        pendingVisitsIndividual, // total visits pending for the member
        overdueVisits, // total visits overdue for the member or the team
        pendingVisits, // total visits pending for the member or the team
        completedVisits, // total visits completed by the member or the team
      };
    } catch (error) {
      console.log('visit summary error: ', error);
    }
  }

  async getFilteredVisits(user, filters) {
    const { page = 1, limit = 10 } = filters;
    try {
      const skip = (page - 1) * limit;
      let query = this.visitRepository
        .createQueryBuilder('visit')
        .leftJoinAndSelect('visit.site', 'site')
        .leftJoinAndSelect('visit.samples', 'samples')
        .leftJoinAndSelect('visit.team', 'team')
        .leftJoinAndSelect('visit.collector', 'collector')
        .leftJoinAndSelect('samples.sampleType', 'sampleType')
        .leftJoinAndSelect('site.project', 'project')
        .leftJoinAndSelect('project.createdBy', 'projectCreatedBy')
        .leftJoinAndSelect('site.diseases', 'disease')
        .leftJoinAndSelect('site.location', 'location')
        .leftJoinAndSelect('location.region', 'region')
        .leftJoinAndSelect('region.parentRegion', 'parentRegion');

      query = await this.applyFilters(query, user, filters);
      const assignedTo = filters.assignedTo;
      let cusLimit = limit;
      if (assignedTo === 'true') {
        const count = await query.getCount();
        cusLimit = count;
      }
      const [visits, total] = await query
        .skip(skip)
        .take(cusLimit)
        .getManyAndCount();

      const visitIds = visits.map((v) => v.id);

      if (visitIds.length === 0) {
        return {
          docs: [],
          total,
          page: Number(page),
          limit: Number(cusLimit) || Number(limit) || 10,
          totalPages: cusLimit > 0 ? Math.ceil(total / cusLimit) : 0,
        };
      }

      const siteIds = [
        ...new Set(visits.filter((v) => v.site).map((v) => v.site.id)),
      ];
      const visitRounds = await computeVisitRoundsForSites(
        this.visitRepository,
        siteIds,
      );

      const finalVisits = visits.map((v) => ({
        ...v,
        round: visitRounds.get(v.id),
        totalSamples: v.samples?.length ?? 0,
        // diseaseShortNames: diseaseMap[v.id] || [],
      }));

      return {
        docs: finalVisits,
        total,
        page: Number(page),
        limit: Number(cusLimit) || Number(limit) || 10,
        totalPages: cusLimit > 0 ? Math.ceil(total / cusLimit) : 1,
      };
    } catch (error) {
      console.error('Error fetching visits:', error);
      throw error;
    }
  }

  private async applyFilters(
    query,
    user,
    {
      projectId,
      siteId,
      disease,
      siteType,
      startDate,
      endDate,
      isCompleted,
      visitStatus,
    },
  ) {
    // `user` is req.user, already eager-loaded by UserService.findOne with
    // roles/roles.role/roles.role.permissions/roles.workspace/team/project -
    // re-fetching it here was a redundant query.
    const userData = user;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Tenant predicate resolved from the caller's actual memberships
    // (System / Workspace->projects / Project / Team), never from the legacy
    // `userData.project?.id` / `userData.team?.id`. Those are null for
    // workspace-admins and for anyone belonging to more than one
    // project/team, and a null legacy id used to mean neither branch fired
    // and this query returned every visit system-wide - see tenant-scope.ts.
    const tenant = await this.tenantScopeService.forUser(userData);
    query = applyProjectScope(query, tenant, 'project.id');

    // The tenant scope spans every project the caller can reach, so narrow
    // to the route's project when one is given.
    if (projectId)
      query = query.andWhere('project.id = :projectId', { projectId });
    if (siteId) query = query.andWhere('site.id = :siteId', { siteId });
    if (disease)
      query = query.andWhere('disease.id = :diseaseId', { diseaseId: disease });
    if (siteType)
      query = query.andWhere('site.siteType = :siteType', { siteType });

    console.log(isCompleted, visitStatus);
    if (isCompleted !== null && isCompleted !== undefined)
      query = query.andWhere('visit.isCompleted = :isCompleted', {
        isCompleted,
      });
    if (visitStatus !== null && visitStatus !== undefined)
      if (visitStatus === VisitStatus.COMPLETED) {
        // Completed visits
        query = query
          .andWhere('visit.isCompleted = true')
          .andWhere('visit.visitStatus = :completedStatus', {
            completedStatus: VisitStatus.COMPLETED,
          })
          .andWhere('visit.visitStatus != :skippedStatus', {
            skippedStatus: VisitStatus.SKIPPED,
          });
      } else if (visitStatus === VisitStatus.UPCOMING) {
        query = query
          .andWhere('visit.visitScheduledAt >= :currentDate', { currentDate })
          .andWhere('visit.visitStatus = :upcomingStatus', {
            upcomingStatus: VisitStatus.UPCOMING,
          })
          .andWhere('visit.isCompleted = false')
          .andWhere('visit.visitStatus != :skippedStatus', {
            skippedStatus: VisitStatus.SKIPPED,
          });
      } else if (visitStatus === VisitStatus.OVERDUE) {
        query = query
          .andWhere('visit.visitScheduledAt < :currentDate', { currentDate })
          .andWhere('visit.visitStatus != :completedStatus', {
            completedStatus: VisitStatus.COMPLETED,
          })
          .andWhere('visit.isCompleted = false')
          .andWhere('visit.visitStatus != :skippedStatus', {
            skippedStatus: VisitStatus.SKIPPED,
          });
      } else if (visitStatus === VisitStatus.SKIPPED) {
        query = query.andWhere('visit.visitStatus = :skippedStatus', {
          skippedStatus: VisitStatus.SKIPPED,
        });
      }

    if (startDate && endDate && visitStatus != VisitStatus.COMPLETED) {
      query = query.andWhere(
        'DATE(visit.visitScheduledAt) BETWEEN :startDate AND :endDate',
        {
          startDate,
          endDate,
        },
      );
    } else if (startDate && endDate && visitStatus === VisitStatus.COMPLETED) {
      query = query.andWhere(
        'DATE(visit.visitedAt) BETWEEN :startDate AND :endDate',
        {
          startDate,
          endDate,
        },
      );
    }

    if (visitStatus === VisitStatus.UPCOMING) {
      query = query
        .orderBy('visit.visitScheduledAt', 'ASC')
        .addOrderBy('visit.id', 'ASC');
    } else if (visitStatus === VisitStatus.OVERDUE) {
      query = query
        .orderBy('visit.visitScheduledAt', 'DESC')
        .addOrderBy('visit.id', 'ASC');
    } else if (visitStatus === VisitStatus.COMPLETED) {
      query = query
        .orderBy('visit.visitedAt', 'DESC')
        .addOrderBy('visit.visitScheduledAt', 'DESC')
        .addOrderBy('visit.id', 'ASC');
    } else {
      // A site's whole schedule is inserted in one transaction, so those
      // visits share createdAt. Without tie-breakers Postgres returns them in
      // arbitrary order, and the mobile client picked round 2 or round 5 as
      // a new site's "first" visit.
      query = query
        .orderBy('visit.createdAt', 'DESC')
        .addOrderBy('visit.visitScheduledAt', 'ASC')
        .addOrderBy('visit.id', 'ASC');
    }
    return query;
  }

  async updateSuspectedPositives(
    visitId: string,
    diseaseId: string,
    sampleCount: number,
    isSuspectedPositive: boolean,
  ) {
    const visit = await this.visitRepository.findOne({
      where: { id: visitId },
    });
    if (!visit) {
      throw new Error('Visit not found');
    }

    const disease = await this.diseaseRepository.findOne({
      where: { id: diseaseId },
    });
    if (!disease) {
      throw new Error('Disease not found');
    }
    // Find if the disease already exists in suspectedPositives
    const existingEntryIndex = visit.suspectedPositives.findIndex(
      (entry) => entry.disease.id === diseaseId,
    );

    if (existingEntryIndex !== -1) {
      // Update existing entry
      visit.suspectedPositives[existingEntryIndex].sampleCount = sampleCount;
      visit.suspectedPositives[existingEntryIndex].isSuspectedPositive =
        isSuspectedPositive;
    } else {
      // Add new entry
      visit.suspectedPositives.push({
        disease,
        sampleCount,
        isSuspectedPositive,
      });
    }
    return this.visitRepository.save(visit);
  }

  // A9: on the nested route `/projects/:projectId/visits/:visitId`, CASL only
  // validates that the caller belongs to `:projectId` - it never checks the
  // visit itself is that project's. Without `projectId` here, a member of
  // project A could read (and via `update`, overwrite) project B's visit by
  // pasting its id into A's URL. `projectId` is optional so existing callers
  // that don't yet thread the route param keep working; pass it whenever the
  // caller has a validated `:projectId` in scope.
  async findById(id: string, projectId?: string): Promise<Visit> {
    const visit = await this.visitRepository.findOne({
      where: projectId ? { id, project: { id: projectId } } : { id },
      relations: [
        'site',
        'project',
        'collector',
        'samples',
        'samples.testedBy',
        'samples.sampleType',
        'samples.originalSample',
      ],
    });
    if (!visit) {
      throw new NotFoundException(`Visit with ID ${id} not found.`);
    }
    // Transform samples to include originalSampleId
    if (visit.samples) {
      visit.samples = visit.samples.map((sample) => ({
        ...sample,
        originalSampleId: sample.originalSample?.id || null,
      }));
    }
    return visit;
  }

  async findByUserId(userId: string): Promise<Visit> {
    const visits = await this.visitRepository
      .createQueryBuilder('visit')
      .leftJoinAndSelect('visit.site', 'site') // Join the site
      .leftJoinAndSelect('site.collectionCollector', 'collector') // Join the collector associated with the site
      .where('collector.id = :userId', { userId }) // Filter by collector ID at the site level
      .getOneOrFail();
    return visits;
  }

  // A9: same leaf-vs-route binding as findById - see comment there.
  async update(
    id: string,
    updateVisitDto: UpdateVisitDto,
    projectId?: string,
  ): Promise<Visit> {
    const visit = await this.visitRepository.findOne({
      where: projectId ? { id, project: { id: projectId } } : { id },
      relations: ['site', 'project'],
    });
    let user = null;
    if (!visit) {
      throw new NotFoundException(`Visit with ID ${id} not found.`);
    }
    const { isCompleted, ...otherFields } = updateVisitDto;

    // Assign only the allowed fields
    Object.assign(visit, otherFields);
    const photoIds = [];
    if (updateVisitDto.photos) {
      for (const data of updateVisitDto.photos) {
        const key = data.split('/').pop();
        const file = this.mediaRepository.create({
          key: `${process.env.S3_FOLDER}/${process.env.NODE_ENV}/${key}`,
          path: data,
        });
        await this.mediaRepository.save(file); // Save each file one by one
        photoIds.push(file.id);
      }
    }
    if (photoIds && photoIds.length > 0) {
      visit.photos = photoIds;
    }
    const currentDate = new Date();
    if (
      updateVisitDto.visitStatus === VisitStatus.SKIPPED &&
      visit.isCompleted === false &&
      visit.visitStatus === VisitStatus.UPCOMING
    ) {
      if (visit.visitScheduledAt < currentDate) {
        visit.visitStatus = VisitStatus.SKIPPED;
      } else {
        throw Error("This visit can't be skipped");
      }
    } else if (updateVisitDto && isCompleted) {
      if (!updateVisitDto.visitedBy) {
        throw new Error('Visited by should not be empty');
      } else {
        user = await this.collectorRepository.findOne({
          where: { id: updateVisitDto.visitedBy },
        });
        visit.visitedBy = user;
      }
      if (isCompleted === true && visit.isCompleted === false) {
        visit.visitedAt = new Date();
        visit.isCompleted = true;
        // Promote from whatever status the visit currently holds, not just
        // UPCOMING — see the note in executeSubmissionOfCompleteVisit.
        visit.visitStatus = VisitStatus.COMPLETED;
      }
    }

    // console.log(visit);
    return this.visitRepository.save(visit);
  }

  async rescheduleVisit(
    id: string,
    rescheduleVisitDto: RescheduleVisitDto,
    projectId?: string,
  ): Promise<Visit> {
    const visit = await this.visitRepository.findOne({
      where: projectId ? { id, project: { id: projectId } } : { id },
      relations: ['site', 'project', 'collector', 'team'],
    });

    if (!visit) {
      throw new NotFoundException(`Visit with ID ${id} not found.`);
    }

    if (visit.isCompleted || visit.visitStatus === VisitStatus.SKIPPED) {
      throw new BadRequestException(
        'Cannot reschedule a completed or skipped visit.',
      );
    }

    const newDate = new Date(rescheduleVisitDto.newScheduledDate);
    if (isNaN(newDate.getTime())) {
      throw new BadRequestException('Invalid scheduled date provided.');
    }

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    if (newDate < currentDate) {
      throw new BadRequestException(
        'Cannot reschedule a visit to a past date.',
      );
    }

    // Keep track of the original scheduled date if this is the first reschedule
    if (!visit.rescheduledFrom) {
      visit.rescheduledFrom = visit.visitScheduledAt;
    }

    visit.visitScheduledAt = newDate;

    // If the new date is today or future, ensure visitStatus is UPCOMING
    if (newDate >= currentDate && visit.visitStatus === VisitStatus.OVERDUE) {
      visit.visitStatus = VisitStatus.UPCOMING;
    }

    // Note: The site collection plan is intentionally untouched.
    return this.visitRepository.save(visit);
  }

  // A9: same route-vs-leaf binding as findById/update - see comment there.
  // Unlike update, this method had no pre-existing not-found guard: a bare
  // "no row" used to fall through as if this were a first-time submission
  // and proceed to create samples / complete the visit anyway. So scoping to
  // projectId needs its own check below - otherwise a foreign visit id would
  // just silently re-run the submission instead of 404ing, and this write
  // transitions visit state (unlike findById's read-only leak).
  async submitVisit(
    id: string,
    submitVisit: SubmitVisitDto,
    projectId?: string,
  ) {
    const userData = await this.collectorRepository.findOne({
      where: { id: submitVisit.visitData.visitedBy },
      relations: ['team', 'project'],
    });
    if (!userData) {
      throw new Error(
        `User not found for visitedBy=${submitVisit.visitData.visitedBy}`,
      );
    }
    submitVisit.visitData.visitedBy = userData.id;
    submitVisit.visitData.teamId =
      userData.team?.id ?? submitVisit.visitData.teamId;
    if (!submitVisit.visitData.teamId) {
      throw new Error(`Team not found for user ${userData.id}`);
    }

    const existingVisit = await this.visitRepository.findOne({
      where: projectId ? { id, project: { id: projectId } } : { id },
      relations: ['samples'],
    });
    if (projectId && !existingVisit) {
      throw new NotFoundException(`Visit with ID ${id} not found.`);
    }
    // Deliberately does NOT require `visitStatus === COMPLETED`. The client
    // retries whenever a response is lost, and "this visit is already completed
    // and already has its samples" is the whole signal we need. Requiring the
    // status too meant any visit left with a stale status (see the promotion fix
    // in executeSubmissionOfCompleteVisit) fell through to sample creation and
    // failed forever on the duplicate-barcode check, permanently wedging the
    // submission in the phone's offline sync queue. Keeping the looser check
    // also heals rows already written in that state.
    if (
      existingVisit &&
      existingVisit.isCompleted &&
      existingVisit.samples &&
      existingVisit.samples.length > 0
    ) {
      console.log(
        `[submitVisit] Visit ${id} is already completed with ${existingVisit.samples.length} samples (status=${existingVisit.visitStatus}). Returning success (idempotent).`,
      );
      return;
    }

    return this.entityManager.transaction(
      async (transactionalEntityManager) => {
        try {
          console.log(
            `[submitVisit Service] Step 1: Creating samples for visitId=${id}`,
          );
          const samples = await this.sampleService.createMultipleSamples(
            submitVisit,
            id,
            submitVisit.visitData.siteId,
            submitVisit.visitData.projectId,
            submitVisit.visitData.teamId,
            submitVisit.visitData.visitedBy,
            transactionalEntityManager,
          );
          console.log(
            `[submitVisit Service] Step 1 ✅: Created ${samples.length} samples`,
          );

          console.log(
            `[submitVisit Service] Step 2: Getting signed URLs for samples`,
          );
          await Promise.all(
            samples.map(async (sample) => {
              const signedUrls =
                await this.sampleService.getSignedUrlForSampleFroVisitSubmit(
                  sample,
                  transactionalEntityManager,
                );
              sample.photos = signedUrls;
            }),
          );
          console.log(`[submitVisit Service] Step 2 ✅: Signed URLs obtained`);

          if (submitVisit.samples.length === samples.length) {
            console.log(
              `[submitVisit Service] Step 3: Executing visit completion for visitId=${id}`,
            );
            await this.executeSubmissionOfCompleteVisit(
              id,
              submitVisit.visitData,
              transactionalEntityManager,
            );
            console.log(
              `[submitVisit Service] Step 3 ✅: Visit marked as completed`,
            );
          } else {
            console.log(
              `[submitVisit Service] ❌ Sample count mismatch: expected=${submitVisit.samples.length}, got=${samples.length}`,
            );
            throw Error('Something went wrong');
          }
          console.log(
            `[submitVisit Service] ✅ Transaction about to commit for visitId=${id}`,
          );
        } catch (error) {
          console.log(
            `[submitVisit Service] ❌ Error in transaction for visitId=${id}:`,
            error?.message || error,
          );
          throw error;
        }
      },
    );
  }

  async executeSubmissionOfCompleteVisit(
    id: string,
    updateVisitDto: UpdateVisitDto,
    transactionalEntityManager: EntityManager,
  ): Promise<Visit> {
    // Use transactionalEntityManager instead of visitRepository
    const visit = await transactionalEntityManager.findOne(Visit, {
      where: { id },
      relations: ['site', 'project'],
    });
    if (!visit) {
      throw new NotFoundException(`Visit with ID ${id} not found.`);
    }

    let user = null;

    if (
      updateVisitDto.suspectDiseaseData &&
      updateVisitDto.suspectDiseaseData.length > 0
    ) {
      const updatePromises = updateVisitDto.suspectDiseaseData.map((data) => {
        let parsedData = data;
        if (typeof data === 'string') {
          try {
            parsedData = JSON.parse(data);
          } catch (e) {
            console.error('Error parsing suspectDiseaseData string', e);
          }
        }
        return this.updateSuspectedPositives(
          id,
          parsedData.diseaseId,
          parsedData.sampleCount,
          parsedData.isSuspectedPositive,
        );
      });

      await Promise.all(updatePromises);
    }

    const { isCompleted, latitude, longitude, ...otherFields } = updateVisitDto;

    // Convert latitude/longitude to PostGIS Point if both are provided
    if (latitude != null && longitude != null) {
      visit.completedAtCoordinates = {
        type: 'Point',
        coordinates: [longitude, latitude],
      } as any;
    }

    // Assign only the allowed fields
    Object.assign(visit, otherFields);
    const photoIds = [];
    if (updateVisitDto.photos) {
      for (const data of updateVisitDto.photos) {
        const key = data.split('/').pop();
        const file = this.mediaRepository.create({
          key: `${process.env.S3_FOLDER}/${process.env.NODE_ENV}/${key}`,
          path: data,
        });
        await this.mediaRepository.save(file); // Save each file one by one
        photoIds.push(file.id);
      }
    }
    if (photoIds && photoIds.length > 0) {
      visit.photos = photoIds;
    }
    if (isCompleted) {
      if (!updateVisitDto.visitedBy) {
        throw new Error('Visited by should not be empty');
      } else {
        user = await transactionalEntityManager.findOne(User, {
          where: { id: updateVisitDto.visitedBy },
        });
        visit.visitedBy = user;
      }

      if (isCompleted === true && visit.isCompleted === false) {
        visit.visitedAt = new Date();
        visit.isCompleted = true;
        // Promote from whatever the visit was scheduled as — not just UPCOMING.
        // The scheduling cron flips due visits to OVERDUE, so gating on UPCOMING
        // left them `isCompleted = true` with `visitStatus = 'overdue'`. That
        // defeats the idempotency guard in `submitVisit` (every retry fell
        // through to sample creation and died on the duplicate-barcode check
        // with a permanent 400) and hides the visit from COMPLETED-scoped counts.
        visit.visitStatus = VisitStatus.COMPLETED;
      }
    }

    if (visit.visitStatus === VisitStatus.UPCOMING) {
      visit.visitStatus = VisitStatus.COMPLETED;
    }

    // console.log(visit);

    // Save using transactional entity manager
    return transactionalEntityManager.save(visit);
  }

  async getSignedUrlForSample(sample) {
    const photoIds = sample?.photos ? sample.photos : [];
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
        return await this.multerConfigService.getSignedFileUrl(photo.key);
      }),
    );
    return signedUrlPaths;
  }

  async remove(id: string): Promise<void> {
    const visit = await this.visitRepository.findOne({ where: { id } });
    if (!visit) {
      throw new NotFoundException(`Visit with ID ${id} not found.`);
    }
    await this.visitRepository.remove(visit);
  }
}
