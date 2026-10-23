import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { Response } from 'express';
import { Parser } from 'json2csv';
import { LabTestResponseData } from 'src/common/dto/response/lab-test.response';
import { SampleStatus } from 'src/common/enums/sample-status.enum';
import { Scope } from 'src/common/enums/scope.enum';
import { beautifyHeader } from 'src/common/functions/format-csv-header';
import {
  applyProjectScope,
  canReachProject,
} from 'src/common/functions/tenant-scope';
import { TenantScopeService } from 'src/common/authorization/tenant-scope.service';
import { Disease } from 'src/entities/disease.entity';
import { LabTest } from 'src/entities/lab-test.entity';
import { Location } from 'src/entities/location.entity';
import { Media } from 'src/entities/media.entity';
import { Project } from 'src/entities/project.entity';
import { SampleAudit } from 'src/entities/sample-audit.entity';
import { SampleType } from 'src/entities/sample-type.entity';
import { Species } from 'src/entities/species.entity';
import { Sample } from 'src/entities/sample.entity';
import {
  buildAccessionPrefix,
  nextAccessionSequence,
} from './accession-id.helpers';
import { Site } from 'src/entities/site.entity';
import { Team } from 'src/entities/team.entity';
import { User } from 'src/entities/user.entity';
import { Visit } from 'src/entities/visit.entity';
import { AnimalMetadata } from 'src/entities/animal-metadata.entity';
import { Brackets, EntityManager, ILike, In, Repository } from 'typeorm';
import { StatusType } from '../../common/enums/status.enum';
import { TestResultType } from '../../common/enums/test-result.enum';
import { CreateLabTestDto } from '../lab-tests/dto/create-lab-test.dto';
import { UpdateMultipleLabTestDto } from '../lab-tests/dto/update-lab-test.dto';
import { MulterConfigService } from '../media/media.service';
import { CreateMultipleSampleDto } from './dto/create-multiple-sample.dto';
import { CreateSampleDto } from './dto/create-sample.dto';
import { UpdateCollectedSampleDetailsDto } from './dto/update-collected-sample-details.dto';
import { UpdateSampleDto } from './dto/update-sample.dto';
import { UpdateSampleStageDetailsDto } from './dto/update-sample-stage-details.dto';
import { computeVisitRoundsForSites } from '../../common/utils/visit-rounds.util';
import { shouldScopeToProject } from './sample-scope.util';

@Injectable()
export class SamplesService {
  constructor(
    @InjectRepository(Sample)
    private readonly sampleRepository: Repository<Sample>,
    @InjectRepository(Site)
    private readonly siteRepository: Repository<Site>,
    @InjectRepository(Visit)
    private readonly visitRepository: Repository<Visit>,
    @InjectRepository(SampleType)
    private readonly sampleTypeRepository: Repository<SampleType>,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    @InjectRepository(Disease)
    private readonly diseaseRepository: Repository<Disease>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(LabTest)
    private readonly labTestRepository: Repository<LabTest>,
    @InjectRepository(SampleAudit)
    private readonly sampleAuditRepository: Repository<SampleAudit>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(AnimalMetadata)
    private readonly animalMetadataRepository: Repository<AnimalMetadata>,
    private readonly multerService: MulterConfigService,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly tenantScopeService: TenantScopeService,
  ) {}

  async create(createSampleDto: CreateSampleDto): Promise<Sample> {
    try {
      const { team, site, diseases, sampleType, photos } = createSampleDto;

      // console.log('createSampleDto', createSampleDto);

      const teamData = team
        ? await this.teamRepository.findOne({ where: { id: team } })
        : null;
      if (team && !teamData) throw new BadRequestException('Team not found');

      // console.log('Team Data', team, teamData);
      const siteData = site
        ? await this.siteRepository.findOne({ where: { id: site } })
        : null;
      if (site && !siteData) throw new BadRequestException('Site not found');

      if (photos) {
        const filesArr = await Promise.all(
          photos.map(async (data) => {
            const key = data.split('/').pop();
            const file = this.mediaRepository.create({
              key: `${process.env.S3_FOLDER}/${process.env.NODE_ENV}/${key}`,
              path: data,
            });
            await this.mediaRepository.save(file);
            return file.id;
          }),
        );
        createSampleDto.photos = filesArr;
      }

      const sampleTypeQuery = isUUID(sampleType)
        ? { id: sampleType }
        : { name: ILike(`%${sampleType}%`) };
      const sampleTypeData = sampleType
        ? await this.sampleTypeRepository.findOne({ where: sampleTypeQuery })
        : null;
      if (sampleType && !sampleTypeData)
        throw new BadRequestException('Sample type not found');

      const speciesData = createSampleDto.species
        ? await this.entityManager.findOne(Species, {
            where: { id: createSampleDto.species },
          })
        : null;
      if (createSampleDto.species && !speciesData)
        throw new BadRequestException('Species not found');

      const diseaseData = await this.diseaseRepository.findBy({
        id: In(diseases),
      });
      if (!diseaseData.length)
        throw new BadRequestException('Diseases not found');

      let createdLocation = null;
      if (createSampleDto.latitude && createSampleDto.longitude) {
        const geoJSON = {
          type: 'Point',
          coordinates: [createSampleDto.longitude, createSampleDto.latitude],
        };
        const queryBuilder = this.locationRepository.createQueryBuilder();
        const result = await queryBuilder
          .insert()
          .into(Location)
          .values({
            coordinates: () =>
              `ST_GeomFromGeoJSON('${JSON.stringify(geoJSON)}')`,
          })
          .returning('*')
          .execute();
        const locationData = result.raw[0] as Location;
        createdLocation = await this.locationRepository.findOne({
          where: { id: locationData.id },
        });
      }
      const newSample = this.sampleRepository.create({
        ...createSampleDto,
        team: teamData,
        site: siteData,
        sampleType: sampleTypeData,
        species: speciesData,
        diseases: diseaseData,
        location: createdLocation,
      });

      if (createSampleDto.collectedBy) {
        const user = await this.userRepository.findOne({
          where: { id: createSampleDto.collectedBy },
        });
        if (!user) throw new BadRequestException('collected by user not found');
        newSample.collectedBy = user;
        newSample.collectedAt = new Date();
      }

      if (!newSample.accessionId) {
        newSample.accessionId = await this.generateAccessionId(
          this.entityManager,
          speciesData,
          sampleTypeData,
        );
      }

      await this.sampleRepository.save(newSample);

      if (newSample) {
        const sampleAuditPayload = {
          sample: newSample,
          user: newSample.collectedBy,
          currentChanges: newSample,
          previousChanges: null,
          event: 'sample-picked-up',
        };
        const sampleAudit =
          await this.sampleAuditRepository.create(sampleAuditPayload);

        await this.sampleAuditRepository.save(sampleAudit);
      }

      // for (const element of newSample.diseases) {
      //   const labTestPayload = {
      //     project: createSampleDto.project,
      //     site: siteData,
      //     sample: newSample,
      //     visit: newSample.visit,
      //     disease: element,
      //     team: teamData,
      //     testResult: TestResultType.UNCLEAR,
      //   };

      //   await this.labTestRepository.save(labTestPayload);
      // }

      return newSample;
    } catch (error) {
      console.error('Create sample error', error);
      throw error;
    }
  }

  async createLabTest(createLabTestDto: CreateLabTestDto): Promise<LabTest> {
    try {
      const { sample, disease } = createLabTestDto;

      // Validate Sample
      const sampleData = sample
        ? await this.sampleRepository.findOne({ where: { id: sample } })
        : null;
      if (sample && !sampleData)
        throw new BadRequestException('Sample not found');
      // console.log('createLabTestDto', createLabTestDto);

      const { team, site, visit, project } = sampleData;
      // Validate Team
      const teamData = team
        ? await this.teamRepository.findOne({ where: { id: team.id } })
        : null;
      if (team && !teamData) throw new BadRequestException('Team not found');

      // console.log('Team Data', team, teamData);

      // Validate Site
      const siteData = site
        ? await this.siteRepository.findOne({ where: { id: site.id } })
        : null;
      if (site && !siteData) throw new BadRequestException('Site not found');

      // Validate Visit
      const visitData = visit
        ? await this.visitRepository.findOne({ where: { id: visit.id } })
        : null;
      if (visit && !visitData) throw new BadRequestException('Visit not found');

      // Validate Project
      const projectData = project
        ? await this.projectRepository.findOne({ where: { id: project.id } })
        : null;
      if (project && !projectData)
        throw new BadRequestException('Project not found');

      // Validate Disease
      const diseaseData = disease
        ? await this.diseaseRepository.findOne({ where: { id: disease } })
        : null;
      if (disease && !diseaseData)
        throw new BadRequestException('Disease not found');

      const newLabTest = this.labTestRepository.create({
        project: project,
        site: siteData,
        sample: sampleData,
        visit: sampleData.visit,
        disease: diseaseData,
        team: teamData,
      });

      await this.labTestRepository.save(newLabTest);
      return newLabTest;
    } catch (error) {
      console.error('Create sample error', error);
      throw error;
    }
  }

  async updateLabTests(
    updateMultipleLabTestDto: UpdateMultipleLabTestDto,
  ): Promise<LabTestResponseData[]> {
    // console.log('UpdateMultipleLabTestDto', updateMultipleLabTestDto);

    const sampleData = updateMultipleLabTestDto.sample
      ? await this.sampleRepository.findOne({
          where: { id: updateMultipleLabTestDto.sample },
          relations: ['team', 'site', 'visit', 'project', 'pooledWith'],
        })
      : null;

    if (updateMultipleLabTestDto.sample && !sampleData) {
      throw new BadRequestException('Sample not found');
    }

    const { team, site, visit, project } = sampleData || {};

    if (
      !updateMultipleLabTestDto.labTests ||
      updateMultipleLabTestDto.labTests.length === 0
    ) {
      throw new BadRequestException('No lab tests provided for update');
    }

    // Retrieve existing lab test records
    const labTestIds = updateMultipleLabTestDto.labTests.map((lt) => lt.id);
    const existingLabTests = await this.labTestRepository.find({
      where: { id: In(labTestIds) },
      relations: ['disease', 'testedBy'],
    });

    if (existingLabTests.length !== updateMultipleLabTestDto.labTests.length) {
      throw new BadRequestException('One or more lab test records not found');
    }

    // Map and update records for the primary sample
    const updatedLabTests = updateMultipleLabTestDto.labTests
      .map((labTest) => {
        const existingLabTest = existingLabTests.find(
          (lt) => lt.id === labTest.id,
        );

        if (!existingLabTest) return null;

        return {
          ...existingLabTest,
          ...labTest, // Apply updates
          sample: sampleData || existingLabTest.sample, // Keep existing if not updated
          team: team || existingLabTest.team,
          site: site || existingLabTest.site,
          visit: visit || existingLabTest.visit,
          project: project || existingLabTest.project,
        };
      })
      .filter(Boolean);

    const savedLabTests = await this.labTestRepository.save(updatedLabTests);
    const diseaseByLabTestId = new Map(
      existingLabTests.map((labTest) => [labTest.id, labTest.disease]),
    );

    // Propagate test results to pooled samples
    if (sampleData?.pooledWith && sampleData.pooledWith.length > 0) {
      console.log(
        'Propagating test results to pooled samples:',
        sampleData.pooledWith.map((s) => s.id),
      );

      for (const pooledSample of sampleData.pooledWith) {
        // Get the pooled sample with its relationships
        const pooledSampleData = await this.sampleRepository.findOne({
          where: { id: pooledSample.id },
          relations: [
            'team',
            'site',
            'visit',
            'project',
            'labTests',
            'labTests.disease',
          ],
        });

        if (!pooledSampleData) continue;

        // For each updated lab test, create or update a corresponding lab test for the pooled sample
        for (const updatedLabTest of savedLabTests) {
          const disease =
            updatedLabTest.disease ?? diseaseByLabTestId.get(updatedLabTest.id);
          if (!disease) continue;

          // Find existing lab test for this disease on the pooled sample
          const existingPooledLabTest = pooledSampleData.labTests?.find(
            (lt) => lt.disease?.id === disease.id,
          );

          if (existingPooledLabTest) {
            // Update existing lab test with the same results
            await this.labTestRepository.save({
              ...existingPooledLabTest,
              testResult: updatedLabTest.testResult,
              ctValue: updatedLabTest.ctValue,
              variant: updatedLabTest.variant,
              kitOrProtocol: updatedLabTest.kitOrProtocol,
              testedBy: updatedLabTest.testedBy,
              testedAt: updatedLabTest.testedAt,
              resultDate: updatedLabTest.resultDate,
              resultComment: updatedLabTest.resultComment,
              labComment: updatedLabTest.labComment,
              testResultReport: updatedLabTest.testResultReport,
            });
          } else {
            // Create new lab test for the pooled sample with same results
            const newLabTest = this.labTestRepository.create({
              sample: pooledSampleData,
              disease,
              testResult: updatedLabTest.testResult,
              ctValue: updatedLabTest.ctValue,
              variant: updatedLabTest.variant,
              kitOrProtocol: updatedLabTest.kitOrProtocol,
              testedBy: updatedLabTest.testedBy,
              testedAt: updatedLabTest.testedAt,
              resultDate: updatedLabTest.resultDate,
              resultComment: updatedLabTest.resultComment,
              labComment: updatedLabTest.labComment,
              testResultReport: updatedLabTest.testResultReport,
              team: pooledSampleData.team,
              site: pooledSampleData.site,
              visit: pooledSampleData.visit,
              project: pooledSampleData.project,
            });
            await this.labTestRepository.save(newLabTest);
          }
        }
      }
    }

    return savedLabTests;
  }

  async getLabTest(id: string): Promise<LabTest> {
    try {
      const labTest = await this.labTestRepository.findOne({
        where: { id },
        relations: ['sample', 'project', 'team', 'disease', 'site', 'visit'],
      });

      return labTest;
    } catch (error) {
      console.error('Create sample error', error);
      throw error;
    }
  }

  async getLabTests(query: any): Promise<LabTest[]> {
    try {
      // A15: `query.sample` is optional on the caller side; if it's ever
      // missing, `{ sample: { id: undefined } }` would have TypeORM drop the
      // predicate entirely and return every lab test in the system. Fail
      // closed instead.
      if (!query?.sample) return [];

      const labTests = await this.labTestRepository.find({
        where: { sample: { id: query.sample } },
        relations: ['disease', 'testedBy'],
      });

      return labTests;
    } catch (error) {
      console.error('Create sample error', error);
      throw error;
    }
  }

  async createMultipleSamples(
    createMultipleSampleDto: CreateMultipleSampleDto,
    id: string,
    siteId: string,
    projectId: string,
    teamId: string,
    collectedBy: string,
    transactionalEntityManager?: EntityManager,
  ): Promise<Sample[]> {
    try {
      const manager =
        transactionalEntityManager || this.sampleRepository.manager;
      const createdSamples: Sample[] = [];
      const originalSampleMap: Map<string, Sample> = new Map(); // Map to store original samples by barcode

      // Cache to hold created/resolved AnimalMetadata records during this request
      const animalMetadataCache = new Map<string, AnimalMetadata>();

      interface AnimalMetadataPayload {
        selectedAnimalMetadataId?: string; // UUID of a previously-recorded animal
        animalTagId?: string;
        birdId?: string;
        localAnimalId?: string;
        species?: string;
        species_AI?: string;
        breed?: string;
        breed_AI?: string;
        ageYears?: number | string;
        ageMonths?: number | string;
        gender?: string;
        vaccinationStage?: string;
        vaccinationStage_AI?: string;
        diseaseHistory?: string[];
        averageMilkProductionPerDay_withinOneYear?: number | string;
        averageMilkProductionPerDay_beforeOneYear?: number | string;
        feverObserved?: boolean | string;
        firstNoticedDate?: string;
        vectors?: string[];
        dropInFeedIntake?: boolean | string;
        dropInWaterIntake?: boolean | string;
        dropInEggProduction?: boolean | string;
      }

      const parseBool = (val: boolean | string | undefined): boolean =>
        val === true || val === 'true';

      const resolveAnimalMetadata = async (
        details: Record<string, unknown> | undefined | null,
      ): Promise<AnimalMetadata | null> => {
        if (!details?.animalMetadata) return null;
        const payload = details.animalMetadata as AnimalMetadataPayload;

        // --- Fast path: user selected an existing animal from the site list ---
        const selectedId = payload.selectedAnimalMetadataId?.toString().trim();
        if (selectedId && isUUID(selectedId)) {
          const cachedById = animalMetadataCache.get(`id:${selectedId}`);
          if (cachedById) return cachedById;
          const existing = await manager.findOne(AnimalMetadata, {
            where: { id: selectedId },
          });
          if (existing) {
            animalMetadataCache.set(`id:${selectedId}`, existing);
            return existing;
          }
          // Fallen through means the ID is stale — continue to create/resolve below
        }

        // Derive stable deduplication keys
        const tag = payload.animalTagId?.toString().trim() || null;
        const bird = payload.birdId?.toString().trim() || null;
        const localId = payload.localAnimalId?.toString().trim() || null;

        // Priority: physical tag → bird ID → session-scoped local ID
        const cacheKey = tag
          ? `tag:${tag}`
          : bird
            ? `bird:${bird}`
            : localId
              ? `local:${localId}`
              : null;

        // In-memory deduplication within this request batch
        if (cacheKey && animalMetadataCache.has(cacheKey)) {
          return animalMetadataCache.get(cacheKey) as AnimalMetadata;
        }

        // DB lookup: only search by physical identifiers that persist across sessions.
        // localAnimalId is ephemeral (per device session) and cannot be used to
        // match records from a previous visit.
        // Filter by site_id directly (denormalized column) and order by
        // createdAt DESC so the most recently recorded entry wins when an
        // animal has been re-registered multiple times at the site.
        let animalMeta: AnimalMetadata | null = null;
        if ((tag || bird) && siteId) {
          if (tag) {
            animalMeta = await manager.findOne(AnimalMetadata, {
              where: { siteId, animalTagId: tag },
              order: { createdAt: 'DESC' },
            });
          } else if (bird) {
            animalMeta = await manager.findOne(AnimalMetadata, {
              where: { siteId, birdId: bird },
              order: { createdAt: 'DESC' },
            });
          }
        }

        if (!animalMeta) {
          const speciesName = (
            payload.species || payload.species_AI
          )?.toString();
          let speciesData: Species | null = null;
          if (speciesName) {
            if (isUUID(speciesName)) {
              speciesData = await manager.findOne(Species, {
                where: { id: speciesName },
              });
            } else {
              speciesData = await manager.findOne(Species, {
                where: { name: ILike(speciesName) },
              });
            }
          }

          animalMeta = manager.create(AnimalMetadata, {
            visit: { id } as Visit,
            site: { id: siteId } as Site,
            animalTagId: tag,
            birdId: bird,
            species: speciesData,
            breed: (payload.breed || payload.breed_AI)?.toString() || null,
            ageYears:
              payload.ageYears != null ? Number(payload.ageYears) : null,
            ageMonths:
              payload.ageMonths != null ? Number(payload.ageMonths) : null,
            gender: payload.gender?.toString() || null,
            vaccinationStage:
              (
                payload.vaccinationStage || payload.vaccinationStage_AI
              )?.toString() || null,
            diseaseHistory: Array.isArray(payload.diseaseHistory)
              ? payload.diseaseHistory.map(String)
              : null,
            averageMilkProductionPerDayWithinOneYear:
              payload.averageMilkProductionPerDay_withinOneYear != null
                ? Number(payload.averageMilkProductionPerDay_withinOneYear)
                : null,
            averageMilkProductionPerDayBeforeOneYear:
              payload.averageMilkProductionPerDay_beforeOneYear != null
                ? Number(payload.averageMilkProductionPerDay_beforeOneYear)
                : null,
            feverObserved: parseBool(payload.feverObserved),
            firstNoticedDate: (() => {
              if (!payload.firstNoticedDate) return null;
              const parsed = new Date(payload.firstNoticedDate);
              return Number.isNaN(parsed.getTime()) ? null : parsed;
            })(),
            vectors: Array.isArray(payload.vectors)
              ? payload.vectors.map(String)
              : null,
            dropInFeedIntake: parseBool(payload.dropInFeedIntake),
            dropInWaterIntake: parseBool(payload.dropInWaterIntake),
            dropInEggProduction: parseBool(payload.dropInEggProduction),
          });

          await manager.save(animalMeta);
        }

        if (cacheKey) {
          animalMetadataCache.set(cacheKey, animalMeta);
        }

        return animalMeta;
      };

      const barcodes = createMultipleSampleDto.samples
        .map((sample) => sample.barcode)
        .filter((barcode) => barcode); // Remove undefined/null values

      if (barcodes.length > 0) {
        // ✅ Step 2: Check for duplicates within the request
        const duplicateBarcodes = barcodes.filter(
          (barcode, index, self) => self.indexOf(barcode) !== index,
        );
        if (duplicateBarcodes.length > 0) {
          throw new BadRequestException(`Duplicate barcodes found`);
        }

        // ✅ Step 3: Check if any barcode already exists in the database
        const existingSamples = await this.sampleRepository.find({
          where: {
            barcode: In(barcodes),
            project: { id: projectId },
          },
        });

        const barcodeExistArray = existingSamples.map(
          (sample) => sample.barcode,
        );

        if (barcodeExistArray.length > 0) {
          throw new BadRequestException(
            `Barcodes already exist in database. Duplicate Barcodes: ${barcodeExistArray.join(', ')}`,
          );
        }
      }

      // ✅ Pre-fetch shared entities ONCE instead of per-sample
      const [teamData, siteData, collector] = await Promise.all([
        teamId ? manager.findOne(Team, { where: { id: teamId } }) : null,
        siteId ? manager.findOne(Site, { where: { id: siteId } }) : null,
        collectedBy
          ? manager.findOne(User, { where: { id: collectedBy } })
          : null,
      ]);

      if (teamId && !teamData) throw new BadRequestException('Team not found');
      if (siteId && !siteData) throw new BadRequestException('Site not found');
      if (collectedBy && !collector)
        throw new BadRequestException('Collector not found');

      // Pre-fetch all unique sample types needed
      const uniqueSampleTypeIds = [
        ...new Set(
          createMultipleSampleDto.samples
            .map((s) => s.sampleType)
            .filter(Boolean),
        ),
      ];
      const sampleTypeCache: Map<string, any> = new Map();
      if (uniqueSampleTypeIds.length > 0) {
        const sampleTypes = await manager.find(SampleType, {
          where: { id: In(uniqueSampleTypeIds) },
        });
        for (const st of sampleTypes) {
          sampleTypeCache.set(st.id, st);
        }
      }

      // Pre-fetch all unique species needed
      const uniqueSpeciesIds = [
        ...new Set(
          createMultipleSampleDto.samples.map((s) => s.species).filter(Boolean),
        ),
      ];
      const speciesCache: Map<string, any> = new Map();
      if (uniqueSpeciesIds.length > 0) {
        const species = await manager.find(Species, {
          where: { id: In(uniqueSpeciesIds as string[]) },
        });
        for (const sp of species) {
          speciesCache.set(sp.id, sp);
        }
      }

      // Pre-fetch all unique diseases needed
      const allDiseaseIds = [
        ...new Set(
          createMultipleSampleDto.samples.flatMap((s) => s.diseases || []),
        ),
      ];
      const diseaseDataMap: Map<string, any> = new Map();
      if (allDiseaseIds.length > 0) {
        const diseases = await manager.find(Disease, {
          where: { id: In(allDiseaseIds) },
        });
        for (const d of diseases) {
          diseaseDataMap.set(d.id, d);
        }
        if (diseases.length === 0)
          throw new BadRequestException('Diseases not found');
      }

      // Helper to create a single sample using pre-fetched data
      const createSampleFromPrefetched = async (
        createSampleDto: CreateSampleDto,
      ): Promise<Sample> => {
        const { diseases, sampleType, photos } = createSampleDto;

        const sampleTypeData = sampleType
          ? sampleTypeCache.get(sampleType) || null
          : null;
        if (sampleType && !sampleTypeData)
          throw new BadRequestException('Sample type not found');

        const speciesData = createSampleDto.species
          ? speciesCache.get(createSampleDto.species) || null
          : null;
        if (createSampleDto.species && !speciesData)
          throw new BadRequestException('Species not found');

        const diseaseData = (diseases || [])
          .map((dId) => diseaseDataMap.get(dId))
          .filter(Boolean);

        // Process photos
        const photoIds: string[] = [];
        if (photos && photos.length > 0) {
          for (const data of photos) {
            const key = data.split('/').pop();
            const file = manager.create(Media, {
              key: `${process.env.S3_FOLDER}/${process.env.NODE_ENV}/${key}`,
              path: data,
            });
            await manager.save(file);
            photoIds.push(file.id);
          }
        }

        let createdLocation = null;
        if (createSampleDto.latitude && createSampleDto.longitude) {
          const geoJSON = {
            type: 'Point',
            coordinates: [createSampleDto.longitude, createSampleDto.latitude],
          };
          const queryBuilder = this.locationRepository.createQueryBuilder();
          const result = await queryBuilder
            .insert()
            .into(Location)
            .values({
              coordinates: () =>
                `ST_GeomFromGeoJSON('${JSON.stringify(geoJSON)}')`,
            })
            .returning('*')
            .execute();
          const locationData = result.raw[0] as Location;
          createdLocation = await this.locationRepository.findOne({
            where: { id: locationData.id },
          });
        }

        const animalMeta = await resolveAnimalMetadata(createSampleDto.details);

        // animalMetadata is persisted in the dedicated AnimalMetadata table
        // (linked via FK), so strip it from the JSONB details column to avoid
        // duplicating the same payload on the sample row.
        let cleanedDetails: Record<string, unknown> | null = null;
        if (createSampleDto.details) {
          const detailsCopy = {
            ...(createSampleDto.details as Record<string, unknown>),
          };
          delete detailsCopy.animalMetadata;
          cleanedDetails =
            Object.keys(detailsCopy).length > 0 ? detailsCopy : null;
        }

        // Create and save the sample
        const newSample = manager.create(Sample, {
          ...createSampleDto,
          details: cleanedDetails,
          team: teamData,
          site: siteData,
          collectedBy: collector,
          sampleType: sampleTypeData,
          species: speciesData,
          diseases: diseaseData,
          photos: photoIds,
          location: createdLocation,
          animalMetadata: animalMeta,
        });

        if (collectedBy) {
          newSample.collectedBy = collector;
          newSample.collectedAt = new Date();
        }

        if (!newSample.accessionId) {
          newSample.accessionId = await this.generateAccessionId(
            manager,
            speciesData,
            sampleTypeData,
          );
        }

        await manager.save(newSample);

        if (newSample) {
          const sampleAuditPayload = {
            sample: newSample,
            user: collector,
            currentChanges: createSampleDto,
            previousChanges: null,
            event: 'sample-collected',
          };
          const sampleAudit = manager.create(SampleAudit, sampleAuditPayload);
          await manager.save(sampleAudit);
        }

        return newSample;
      };

      // First, save all original samples (those where barcode == originalSampleBarcode or no originalSampleBarcode)
      for (const createSampleDto of createMultipleSampleDto.samples) {
        if (
          !createSampleDto.originalSampleBarcode ||
          createSampleDto.barcode === createSampleDto.originalSampleBarcode
        ) {
          const originalSample = await createSampleFromPrefetched({
            ...createSampleDto,
            visit: id,
            site: siteId,
            project: projectId,
            team: teamId,
          });
          createdSamples.push(originalSample);

          // Store original sample in the map using its barcode
          if (originalSample.barcode) {
            originalSampleMap.set(originalSample.barcode, originalSample);
          }
        }
      }

      // Now, save replicate samples that reference an original sample
      for (const createSampleDto of createMultipleSampleDto.samples) {
        if (
          createSampleDto.originalSampleBarcode &&
          createSampleDto.barcode !== createSampleDto.originalSampleBarcode
        ) {
          const originalSample = originalSampleMap.get(
            createSampleDto.originalSampleBarcode,
          );

          if (!originalSample) {
            throw new BadRequestException(
              `Original sample with barcode ${createSampleDto.originalSampleBarcode} not found`,
            );
          }

          const replicateSample = await createSampleFromPrefetched({
            ...createSampleDto,
            visit: id,
            site: siteId,
            project: projectId,
            team: teamId,
          });
          replicateSample.originalSample = originalSample; // Link the original sample

          await manager.save(replicateSample);
          createdSamples.push(replicateSample);
        }
      }

      return createdSamples;
    } catch (error) {
      console.error('Create samples error', error);
      throw error;
    }
  }

  async validateSampleBarcode(
    projectId: string,
    barcode: string,
  ): Promise<boolean> {
    // try {
    const existingSamples = await this.sampleRepository.find({
      where: {
        barcode,
        project: { id: projectId },
      },
    });

    if (existingSamples.length > 0) {
      return false;
    }
    return true;
    // } catch (error) {
    //   throw new Error(error.message);
    // }
  }

  /**
   * Create a single sample from the given `CreateSampleDto`, and store it in the database.
   * @param createSampleDto The sample data to save.
   * @param collectedBy The user ID of the person who collected the sample.
   * @param manager The entity manager to use for the database operations.
   * @returns The newly created sample.
   * @throws `BadRequestException` if the sample data is invalid, or if the collector, team, site, sample type, or diseases are not found.
   */
  private async createSingleSample(
    createSampleDto: CreateSampleDto,
    collectedBy: string,
    manager: EntityManager,
  ): Promise<Sample> {
    const { team, site, diseases, sampleType, photos } = createSampleDto;

    const teamData = team
      ? await manager.findOne(Team, { where: { id: team } })
      : null;
    if (team && !teamData) throw new BadRequestException('Team not found');

    const siteData = site
      ? await manager.findOne(Site, { where: { id: site } })
      : null;
    if (site && !siteData) throw new BadRequestException('Site not found');

    const collector = collectedBy
      ? await manager.findOne(User, { where: { id: collectedBy } })
      : null;
    if (collectedBy && !collector)
      throw new BadRequestException('Collector not found');

    const sampleTypeData = sampleType
      ? await manager.findOne(SampleType, { where: { id: sampleType } })
      : null;
    if (sampleType && !sampleTypeData)
      throw new BadRequestException('Sample type not found');

    const speciesData = createSampleDto.species
      ? await manager.findOne(Species, {
          where: {
            id: createSampleDto.species,
          },
        })
      : null;
    if (createSampleDto.species && !speciesData)
      throw new BadRequestException('Species not found');

    const diseaseData = await manager.find(Disease, {
      where: { id: In(diseases) },
    });
    if (!diseaseData.length)
      throw new BadRequestException('Diseases not found');

    // Process photos
    const photoIds: string[] = [];
    if (photos) {
      for (const data of photos) {
        const key = data.split('/').pop();
        const file = manager.create(Media, {
          key: `${process.env.S3_FOLDER}/${process.env.NODE_ENV}/${key}`,
          path: data,
        });
        await manager.save(file);
        photoIds.push(file.id);
      }
    }

    let createdLocation = null;
    if (createSampleDto.latitude && createSampleDto.longitude) {
      const geoJSON = {
        type: 'Point',
        coordinates: [createSampleDto.longitude, createSampleDto.latitude],
      };
      const queryBuilder = this.locationRepository.createQueryBuilder();
      const result = await queryBuilder
        .insert()
        .into(Location)
        .values({
          coordinates: () => `ST_GeomFromGeoJSON('${JSON.stringify(geoJSON)}')`,
        })
        .returning('*')
        .execute();
      const locationData = result.raw[0] as Location;
      createdLocation = await this.locationRepository.findOne({
        where: { id: locationData.id },
      });
    }
    // Create and save the sample
    const newSample = manager.create(Sample, {
      ...createSampleDto,
      team: teamData,
      site: siteData,
      collectedBy: collector,
      sampleType: sampleTypeData,
      species: speciesData,
      diseases: diseaseData,
      photos: photoIds,
      location: createdLocation,
    });

    if (createSampleDto.collectedBy) {
      const user = await manager.findOne(User, {
        where: { id: createSampleDto.collectedBy },
      });
      if (!user) throw new BadRequestException('Collected by user not found');
      newSample.collectedBy = user;
      newSample.collectedAt = new Date();
    }

    await manager.save(newSample);

    if (newSample) {
      const sampleAuditPayload = {
        sample: newSample,
        user: createSampleDto.collectedBy,
        currentChanges: createSampleDto,
        previousChanges: null,
        event: 'sample-collected',
      };
      const sampleAudit = await manager.create(SampleAudit, sampleAuditPayload);

      await manager.save(sampleAudit);
    }

    // ✅ Create LabTests for each disease
    // for (const disease of diseaseData) {
    //   const labTestPayload = {
    //     project: createSampleDto.project,
    //     site: siteData,
    //     sample: newSample,
    //     visit: newSample.visit,
    //     disease: disease,
    //     team: teamData,
    //     testResult: TestResultType.UNCLEAR,
    //   };

    //   await manager.save(LabTest, labTestPayload);
    // }

    return newSample;
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
        return await this.multerService.getSignedFileUrl(photo.key);
      }),
    );
    return signedUrlPaths;
  }

  async getSignedUrlForSampleFroVisitSubmit(
    sample,
    transactionManager: EntityManager,
  ) {
    const photoIds = sample?.photos ? sample.photos : [];

    // Fetch photos using transaction manager
    const photos = photoIds.length
      ? await transactionManager.find(Media, {
          where: { id: In(photoIds) },
        })
      : [];
    let filteredPhotos = photos;

    // Exclude default thumbnail if there are multiple images
    if (photos.length > 1) {
      filteredPhotos = photos.filter(
        (photo) => !photo.key.includes(process.env.DEFAULT_IMAGE_THUMBNAIL),
      );
    }

    const signedUrlPaths: string[] = [];

    // Using for-of loop instead of Promise.all
    for (const photo of filteredPhotos) {
      const signedUrl = await this.multerService.getSignedFileUrl(photo.key);
      signedUrlPaths.push(signedUrl);
    }

    return signedUrlPaths;
  }

  async getSampleStatLogistics(query, user: any): Promise<any> {
    try {
      // A11/B4: this route (`/statistics/disease-wise-sample-stat`) carries no
      // `:projectId`/`:workspaceId`, so the tenant predicate must come from the
      // caller's real memberships (`resolveTenantScope`), never from the legacy
      // singular `user.project`/`user.team` columns, which are `null` for
      // workspace-admins and self-serve signup users - that null previously
      // skipped the `if` below entirely and let the aggregate run with no
      // tenant filter at all, across every project in the system.
      const tenant = await this.tenantScopeService.forUser(user);

      let teamIds: string[] = [];

      if (!tenant.isSystem) {
        if (tenant.scope === Scope.Team) {
          // Team-scoped: restrict to the caller's own team(s), resolved from
          // `user_roles` rather than the possibly-null `user.team.id`.
          teamIds = tenant.teamIds;
        } else if (tenant.projectIds.length) {
          // Project/Workspace-scoped: every team under a project the caller
          // can reach.
          const teams = await this.teamRepository.find({
            where: { projects: { id: In(tenant.projectIds) } },
            select: { id: true },
          });
          teamIds = teams.map((team) => team.id);
        }

        // Fail closed - an empty id list must return nothing, never fall
        // through to "no filter".
        if (!teamIds.length) {
          return [];
        }
      }

      const diseases = await this.diseaseRepository.find({
        where: { status: StatusType.ACTIVE },
      });

      const diseaseIds = diseases.map((d) => d.id);

      if (!diseaseIds.length) {
        return [];
      }
      const sampleQuery = this.sampleRepository
        .createQueryBuilder('sample')
        .leftJoin('sample.diseases', 'disease')
        .select('disease.name', 'name')
        .addSelect(
          `COUNT(DISTINCT CASE 
            WHEN sample.sampleStatus = :collectedStatus THEN sample.id 
            END)`,
          'totalCollected',
        )
        .addSelect(
          `COUNT(DISTINCT CASE 
            WHEN (sample.sampleStatus = :testedStatus OR sample.sampleStatus = 'test-report-generated') AND EXISTS (
              SELECT 1 FROM lab_tests lab 
              WHERE lab."sampleId" = sample.id AND (sample.sampleStatus = :testedStatus OR sample.sampleStatus = 'test-report-generated') AND lab."testResult" = :unclearStatus
            ) THEN sample.id 
            END)`,
          'totalUnclear',
        )
        .addSelect(
          `COUNT(DISTINCT CASE 
            WHEN (sample.sampleStatus = :testedStatus OR sample.sampleStatus = 'test-report-generated') AND EXISTS (
              SELECT 1 FROM lab_tests lab 
              WHERE lab."sampleId" = sample.id AND (sample.sampleStatus = :testedStatus OR sample.sampleStatus = 'test-report-generated') AND lab."testResult" = :negativeStatus
            ) THEN sample.id 
            END)`,
          'totalNegative',
        )
        .addSelect(
          `COUNT(DISTINCT CASE 
            WHEN (sample.sampleStatus = :testedStatus OR sample.sampleStatus = 'test-report-generated') AND EXISTS (
              SELECT 1 FROM lab_tests lab 
              WHERE lab."sampleId" = sample.id AND (sample.sampleStatus = :testedStatus OR sample.sampleStatus = 'test-report-generated') AND lab."testResult" = :positiveStatus
            ) THEN sample.id 
            END)`,
          'totalPositive',
        )
        .where('disease.id IN (:...diseaseIds)', { diseaseIds })
        .groupBy('disease.name')
        .setParameters({
          collectedStatus: SampleStatus.PICKED_UP,
          testedStatus: SampleStatus.TESTED,
          unclearStatus: TestResultType.UNCLEAR,
          positiveStatus: TestResultType.POSITIVE,
          negativeStatus: TestResultType.NEGATIVE,
        });

      // System scope is unrestricted (`teamIds` stays empty and is meaningless
      // here); every other scope was already returned early above when it
      // resolved to no reachable teams, so `teamIds` is non-empty here.
      if (!tenant.isSystem) {
        sampleQuery.andWhere('sample."teamId" IN (:...teamIds)', {
          teamIds,
        });
      }

      // // Apply BETWEEN only if both are present
      // if (startDate && endDate) {
      //   sampleQuery.andWhere('sample."createdAt" BETWEEN :startDate AND :endDate', {
      //     startDate,
      //     endDate,
      //   });
      // }

      // if (diseaseId) {
      //   sampleQuery.andWhere('disease.id = :diseaseId', { diseaseId });
      // }

      const results = await sampleQuery.getRawMany();

      return results.map((item) => {
        return {
          ...item,
          totalCollected: Number(item.totalCollected),
          totalPositive: Number(item.totalPositive),
          totalNegative: Number(item.totalNegative),
          totalUnclear: Number(item.totalUnclear),
        };
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll(query: any, user?: User) {
    const {
      projectId,
      visitId,
      siteId,
      diseaseId,
      sampleTypeId,
      sampleStatus,
      sort = 'createdAt',
      sortOrder = 'DESC',
      startDate,
      endDate,
      page = 1,
      limit = 10,
      search,
      referenceBatchId,
      accessionId,
      stateId,
      round,
      testResult,
      workspaceId,
    } = query;

    // `user` is req.user, already eager-loaded by UserService.findOne with
    // team/project/roles/roles.role/roles.role.permissions/roles.workspace -
    // re-fetching it here was a redundant query, and the previous refetch's
    // relations list omitted `roles.workspace`, which would silently break
    // workspace-role expansion in `tenantScopeService.forUser` below.
    const userData = user;
    const tenant = await this.tenantScopeService.forUser(userData);
    const userScope = tenant.scope;

    const siteQuery = this.sampleRepository
      .createQueryBuilder('sample')
      .leftJoinAndSelect('sample.site', 'site')
      .leftJoinAndSelect('site.location', 'location')
      .leftJoinAndSelect('location.region', 'region')
      .leftJoinAndSelect('region.parentRegion', 'parentRegion')
      .leftJoinAndSelect('sample.visit', 'visit')
      .leftJoinAndSelect('site.collectionCollector', 'collectionCollector')
      .leftJoinAndSelect('visit.visitedBy', 'visitedBy')
      .leftJoinAndSelect('sample.diseases', 'disease') // Diseases relation
      .leftJoinAndSelect('sample.receivedBy', 'receivedBy')
      .leftJoinAndSelect('sample.extractedBy', 'extractedBy')
      .leftJoinAndSelect('sample.collectedBy', 'collectedBy')
      .leftJoinAndSelect('sample.team', 'team')
      .leftJoinAndSelect('sample.reportGeneratedBy', 'reportGeneratedBy')
      .leftJoinAndSelect('sample.sampleType', 'sampleType')
      .leftJoinAndSelect('sample.species', 'species')
      .leftJoinAndSelect('sample.labTests', 'labTests')
      .leftJoinAndSelect('labTests.testedBy', 'labTestedBy')
      .leftJoinAndSelect('labTests.disease', 'labDisease')
      .leftJoinAndSelect('visit.project', 'project')
      .leftJoin('sample.project', 'sampleProject')
      // .select([
      //   'sample',
      //   'site.id',
      //   'site.name',
      //   'site.farmType',
      //   'location',
      //   'region',
      //   'visit.id',
      //   'project.id',
      //   'project.name',
      //   'sampleType.id',
      //   'sampleType.name',
      //   'disease.name',
      //   'disease.id',
      //   'disease.shortName',
      //   'disease.index',
      // ])
      .where('sample.status = :status', { status: StatusType.ACTIVE }); // Filter by status

    // Apply role-based conditions. System-scope (super-admin) users may view a
    // single project or, via the "all" sentinel, every project at once.
    if (userScope === Scope.System) {
      if (shouldScopeToProject(projectId)) {
        siteQuery.andWhere('sample.projectId = :projectId', { projectId });
      } else if (workspaceId) {
        siteQuery.andWhere('sampleProject.workspace_id = :workspaceId', {
          workspaceId,
        });
      }
    } else if (userScope === Scope.Team) {
      // Every team-scoped role the caller holds (possibly several),
      // restricted to the projects they can reach - not the legacy singular
      // `userData.team.id`, which silently picked one arbitrary team (or
      // matched nothing) for anyone holding more than one team role.
      applyProjectScope(siteQuery, tenant, 'sample.projectId');
      if (!tenant.teamIds.length) {
        siteQuery.andWhere('1 = 0');
      } else {
        siteQuery.andWhere('sample.teamId IN (:...tenantTeamIds)', {
          tenantTeamIds: tenant.teamIds,
        });
      }
    } else {
      // Project/Workspace scope (project-viewer, workspace-admin) have no
      // singular team of their own - this endpoint is always called in a
      // specific-project context (:projectId route param, already CASL-
      // authorized), so scope by that instead of crashing on `.team.id` of
      // null.
      if (shouldScopeToProject(projectId)) {
        siteQuery.andWhere('sample.projectId = :projectId', { projectId });
      }
    }
    // if (userScope === Scope.LAB_ADMIN) {
    //   siteQuery.andWhere('sample.teamId = :teamId', { teamId: user.team.id });
    // } else {
    //   siteQuery.andWhere('sample.collectedById = :userId', { userId: user.id });
    // }

    // Additional filters
    if (diseaseId) siteQuery.andWhere('disease.id = :diseaseId', { diseaseId });
    if (visitId) siteQuery.andWhere('visit.id = :visitId', { visitId });
    if (siteId) siteQuery.andWhere('site.id = :siteId', { siteId });
    if (sampleTypeId)
      siteQuery.andWhere('sampleType.id = :sampleTypeId', { sampleTypeId });
    if (sampleStatus)
      siteQuery.andWhere('sample.sampleStatus = :sampleStatus', {
        sampleStatus,
      });

    if (stateId) {
      siteQuery.andWhere(
        new Brackets((qb) => {
          qb.where('region.id = :stateId', { stateId }).orWhere(
            'parentRegion.id = :stateId',
            { stateId },
          );
        }),
      );
    }

    if (referenceBatchId)
      siteQuery.andWhere('sample.referenceBatchId ILIKE :referenceBatchId', {
        referenceBatchId: `%${referenceBatchId}%`,
      });

    if (accessionId)
      siteQuery.andWhere('sample.accessionId ILIKE :accessionId', {
        accessionId: `%${accessionId}%`,
      });

    if (testResult) {
      const testResults = (
        Array.isArray(testResult)
          ? testResult
          : String(testResult)
              .split(',')
              .map((result) => result.trim())
      ).filter(Boolean);

      if (testResults.length > 0) {
        siteQuery.andWhere(
          `EXISTS (
            SELECT 1
            FROM lab_tests lab
            WHERE lab."sampleId" = sample.id
              AND lab."testResult" IN (:...testResults)
          )`,
          { testResults },
        );
      }
    }

    // Search logic
    if (search) {
      siteQuery.andWhere(
        'sample.barcode ILIKE :search',
        { search: `%${search}%` },
        // new Brackets((qb) => {
        //   qb.where('sample.sampleCode ILIKE :search', { search: `%${search}%` })
        //     .orWhere('sample.barcode ILIKE :search', { search: `%${search}%` })
        //     .orWhere('site.name ILIKE :search', { search: `%${search}%` })
        //     .orWhere('sampleType.name ILIKE :search', { search: `%${search}%` })
        //     .orWhere('disease.name ILIKE :search', { search: `%${search}%` })
        //     .orWhere('disease.shortName ILIKE :search', {
        //       search: `%${search}%`,
        //     });
        // }),
      );
    }

    if (startDate || endDate) {
      const dateFieldMap: Partial<Record<SampleStatus, string>> = {
        [SampleStatus.PICKED_UP]: 'collectedAt',
        [SampleStatus.RECEIVED]: 'receivedAt',
        [SampleStatus.PRE_PROCESSED]: 'preprocessingDate',
        [SampleStatus.EXTRACTED]: 'extractionDateTime',
        [SampleStatus.TESTED]: 'testedAt',
        [SampleStatus.REJECTED]: 'rejectedAt',
        [SampleStatus.TEST_REPORT_GENERATED]: 'reportGeneratedAt',
      };

      const dateField = dateFieldMap[sampleStatus];
      if (dateField) {
        if (startDate) {
          siteQuery.andWhere(`sample.${dateField} >= :startDate`, {
            startDate,
          });
        }
        if (endDate) {
          const formattedEndDate =
            endDate.length === 10 ? `${endDate}T23:59:59.999Z` : endDate;
          siteQuery.andWhere(`sample.${dateField} <= :endDate`, {
            endDate: formattedEndDate,
          });
        }
      }
    }
    // Group the list the way the lab reads it: a site's samples sit together,
    // in the site's visit order, with one sample type at a time — instead of
    // scattering the same type across the page. visitScheduledAt is what the
    // ROUND column is derived from (see assignRoundsBySite), so ordering by it
    // reproduces round order without needing the derived value in SQL.
    siteQuery
      .orderBy('site.name', 'ASC')
      .addOrderBy('visit.visitScheduledAt', 'ASC')
      .addOrderBy('sampleType.name', 'ASC');

    // The LAST ACTIVITY toggle now orders within a group rather than across the
    // whole page.
    if (sort && sortOrder)
      siteQuery.addOrderBy(`sample.${sort}`, sortOrder.toUpperCase());

    // The activity-date columns the lab table sorts on (reportGeneratedAt,
    // testedAt, ...) are bulk-assigned, so every sample in a batch shares one
    // timestamp. On a single sort key those ties come back in plan-dependent
    // order — and because the one-to-many joins above force pagination through
    // a DISTINCT subquery, the same request can return different rows per page.
    // Accession ID orders tied rows into collection sequence; id is a final
    // tiebreaker for rows with no accession ID yet (it's only minted at
    // RECEIVED, so the Collected tab is entirely null here).
    siteQuery
      .addOrderBy('sample.accessionId', 'ASC')
      .addOrderBy('sample.id', 'ASC');

    // Round isn't a stored column — it's derived per-site from visit order —
    // so it can't be a WHERE clause directly. Resolve it to a concrete set of
    // visit IDs first (scoped to whatever sites already match every other
    // filter above) and apply that as a real predicate *before* pagination,
    // so total/totalPages stay accurate instead of only reflecting whichever
    // samples happened to land on the current page.
    let visitRounds: Map<string, number> | undefined;

    if (round) {
      const siteRows = await siteQuery
        .clone()
        .orderBy(undefined)
        .select('DISTINCT site.id', 'siteId')
        .getRawMany();
      const scopedSiteIds = siteRows.map((r) => r.siteId).filter(Boolean);

      visitRounds = await computeVisitRoundsForSites(
        this.visitRepository,
        scopedSiteIds,
      );

      const matchingVisitIds = [...visitRounds.entries()]
        .filter(([, r]) => r === Number(round))
        .map(([visitId]) => visitId);

      if (matchingVisitIds.length > 0) {
        siteQuery.andWhere('visit.id IN (:...matchingVisitIds)', {
          matchingVisitIds,
        });
      } else {
        siteQuery.andWhere('1 = 0');
      }
    }

    siteQuery.skip((page - 1) * limit).take(limit);

    const [samples, total] = await siteQuery.getManyAndCount();

    // Batch-fetch every sample's photos in a single query instead of one
    // mediaRepository lookup + N signed-URL calls per sample.
    const allPhotoIds = samples.flatMap((sample) =>
      sample.photos ? sample.photos : [],
    );
    const allPhotos = allPhotoIds.length
      ? await this.mediaRepository.findBy({ id: In(allPhotoIds) })
      : [];
    const photosById = new Map(allPhotos.map((photo) => [photo.id, photo]));

    await Promise.all(
      samples.map(async (sample) => {
        const photoIds = sample.photos ? sample.photos : [];
        const photos = photoIds
          .map((id) => photosById.get(id))
          .filter((photo): photo is Media => Boolean(photo));
        let filteredPhotos = photos;

        // Exclude default thumbnail if there are multiple images
        if (photos.length > 1) {
          filteredPhotos = photos.filter(
            (photo) => !photo.key.includes(process.env.DEFAULT_IMAGE_THUMBNAIL),
          );
        }

        sample.photos = await Promise.all(
          filteredPhotos.map(async (photo) =>
            this.multerService.getSignedFileUrl(photo.key),
          ),
        );
      }),
    );

    const sampleIds = samples.map((sample) => sample.id);
    const siteIds = [
      ...new Set(samples.filter((s) => s.site).map((s) => s.site.id)),
    ];

    // Reuse the rounds already computed above when a round filter was
    // applied — the current page's sites are a subset of that scope.
    if (!visitRounds) {
      visitRounds = await computeVisitRoundsForSites(
        this.visitRepository,
        siteIds,
      );
    }

    let AISampleIds = new Set<string>();
    if (sampleIds.length > 0) {
      const AIRows = await this.labTestRepository
        .createQueryBuilder('lt')
        .leftJoin('lt.disease', 'disease')
        .select('lt.sampleId', 'sampleId')
        .where('lt.sampleId IN (:...sampleIds)', { sampleIds })
        .andWhere('disease.shortName = :shortName', { shortName: 'AI' })
        .getRawMany();
      AISampleIds = new Set(AIRows.map((row) => row.sampleid ?? row.sampleId));
    }

    const sampleList = samples.map((sample) => {
      if (sample.diseases && Array.isArray(sample.diseases)) {
        sample.diseases.sort((a, b) => (a.index || 0) - (b.index || 0));
      }
      (sample as any).hasAI = AISampleIds.has(sample.id);
      if (sample.visit) {
        sample.visit.round = visitRounds!.get(sample.visit.id);
      }
      return sample;
    });

    return {
      docs: sampleList,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    };
  }

  async sampleBreakDown(query, user) {
    const { region, disease, startDate, endDate } = query;
    // A11 follow-up: same root cause just fixed in getSampleStatLogistics.
    // This route carries no `:projectId`/`:workspaceId`, so the tenant
    // predicate must come from the caller's real memberships
    // (resolveTenantScope), never the legacy singular `user.project` column.
    // That column is `null` for every workspace-admin and self-serve signup
    // user (they got an empty breakdown instead of their real numbers), and
    // for anyone who legitimately belongs to more than one project it
    // silently reported just one arbitrary project's numbers.
    const tenant = await this.tenantScopeService.forUser(user);

    const queryBuilder = this.siteRepository
      .createQueryBuilder('site')
      .leftJoin('site.samples', 'sample')
      .leftJoin('sample.diseases', 'disease')
      .leftJoinAndSelect('site.location', 'location')
      .leftJoin('site.project', 'project')
      .leftJoin('project.createdBy', 'createdBy')
      .leftJoinAndSelect('location.region', 'region')
      .leftJoinAndSelect('region.parentRegion', 'parentRegion')
      .select([
        'site.id AS id',
        'site.name AS name',
        'site.siteCode AS code',
        'site.photos AS photos',
        'location.id AS locationId',
        'parentRegion.name AS state',
        'region.name AS district',
      ])
      .addSelect('COUNT(DISTINCT sample.id)', 'totalSampleCount')
      .addSelect(
        `COUNT(DISTINCT CASE 
          WHEN EXISTS (
            SELECT 1 FROM lab_tests lab 
            WHERE lab."sampleId" = sample.id 
            AND (sample.sampleStatus = 'tested' OR sample.sampleStatus = 'test-report-generated')
            AND lab."testResult" = :positive
          ) THEN sample.id 
          ELSE NULL 
        END)`,
        'positiveSampleCount',
      )
      .addSelect(
        `COUNT(DISTINCT CASE 
          WHEN EXISTS (
            SELECT 1 FROM lab_tests lab 
            WHERE lab."sampleId" = sample.id 
            AND (sample.sampleStatus = 'tested' OR sample.sampleStatus = 'test-report-generated')
            AND lab."testResult" = :negative
          ) THEN sample.id 
          ELSE NULL 
        END)`,
        'negativeSampleCount',
      )
      .addSelect(
        `COUNT(DISTINCT CASE 
          WHEN EXISTS (
            SELECT 1 FROM lab_tests lab 
            WHERE lab."sampleId" = sample.id 
            AND (sample.sampleStatus = 'tested' OR sample.sampleStatus = 'test-report-generated')
            AND lab."testResult" = :unclear
          ) THEN sample.id 
          ELSE NULL 
        END)`,
        'unclearSampleCount',
      )
      .setParameters({
        positive: TestResultType.POSITIVE,
        negative: TestResultType.NEGATIVE,
        unclear: TestResultType.UNCLEAR,
      })
      .groupBy(
        'site.id, site.name, site.siteCode, location.id, parentRegion.name, region.name',
      );

    // **Apply role-based filtering**
    // Super-admins (System scope) can see all projects - no filter needed.
    // Fail closed (1 = 0) whenever the resolved id set is empty, never fall
    // through to "no filter".
    if (!tenant.isSystem) {
      if (tenant.scope === Scope.Team) {
        if (tenant.teamIds.length) {
          queryBuilder.andWhere('sample."teamId" IN (:...teamIds)', {
            teamIds: tenant.teamIds,
          });
        } else {
          queryBuilder.andWhere('1 = 0');
        }
      } else if (tenant.projectIds.length) {
        queryBuilder.andWhere('project.id IN (:...tenantProjectIds)', {
          tenantProjectIds: tenant.projectIds,
        });
      } else {
        queryBuilder.andWhere('1 = 0');
      }
    }

    // **Apply additional filters**
    if (disease) {
      queryBuilder.andWhere('disease.id = :disease', { disease });
    }

    if (region) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('region.id = :region', { region }).orWhere(
            'region.parentRegion.id = :region',
            { region },
          );
        }),
      );
    }

    if (startDate || endDate) {
      if (startDate) {
        queryBuilder.andWhere('DATE(site.createdAt) >= :startDate', {
          startDate,
        });
      }
      if (endDate) {
        queryBuilder.andWhere('DATE(site.createdAt) <= :endDate', {
          endDate,
        });
      }
    }

    const results = await queryBuilder.getRawMany();

    // Batch-fetch every site's photos in a single query instead of one
    // mediaRepository lookup + N signed-URL calls per site.
    const allPhotoIds = results.flatMap((site) =>
      site.photos ? site.photos : [],
    );
    const allPhotos = allPhotoIds.length
      ? await this.mediaRepository.findBy({ id: In(allPhotoIds) })
      : [];
    const photosById = new Map(allPhotos.map((photo) => [photo.id, photo]));

    await Promise.all(
      results.map(async (site) => {
        const photoIds = site.photos ? site.photos : [];
        const photos = photoIds
          .map((id) => photosById.get(id))
          .filter((photo): photo is Media => Boolean(photo));
        let filteredPhotos = photos;
        // Exclude default thumbnail if there are multiple images
        if (photos.length > 1) {
          filteredPhotos = photos.filter(
            (photo) => !photo.key.includes(process.env.DEFAULT_IMAGE_THUMBNAIL),
          );
        }

        site.photos = await Promise.all(
          filteredPhotos.map(async (photo) =>
            this.multerService.getSignedFileUrl(photo.key),
          ),
        );
      }),
    );
    // **Execute the query**
    return results.map((item) => {
      return {
        ...item,
        totalSampleCount: Number(item.totalSampleCount),
        positiveSampleCount: Number(item.positiveSampleCount),
        negativeSampleCount: Number(item.negativeSampleCount),
        unclearSampleCount: Number(item.unclearSampleCount),
      };
    });
  }

  async generateCsv(projects: any[]): Promise<string> {
    const fields = [
      'id',
      'name',
      'code',
      'state',
      'district',
      'totalSampleCount',
      'positiveSampleCount',
      'unclearSampleCount',
      'negativeSampleCount',
    ];

    const cleanData = projects.map((project) => ({
      ...project,
      region: `${project.district}, ${project.state}`,
      positive: project.positiveSampleCount,
      negative: project.negativeSampleCount,
      unclear: project.unclearSampleCount,
      total: project.totalSampleCount,
      district: project.district,
      state: project.state,
    }));

    const parser = new Parser({
      fields: fields.map((field) => ({
        label: beautifyHeader(field),
        value: field,
      })),
    });
    return parser.parse(cleanData);
  }

  sendCsv(res: Response, csvContent: string, filename: string): void {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    // console.log('csvContent', csvContent);
    res.send(csvContent);
  }

  // A9: `projectId` - when supplied - binds the lookup to the route's
  // `:projectId` so a caller who is genuinely a member of project A cannot
  // read project B's sample by pasting its id into A's URL. Optional (and a
  // no-op when omitted) only because this method is also used by callers
  // that have no route-level project context (e.g. System-scope tooling);
  // every request-driven caller should pass it.
  async findOne(query: any, projectId?: string): Promise<Sample> {
    try {
      const qb = this.sampleRepository
        .createQueryBuilder('sample')
        .leftJoinAndSelect('sample.site', 'site')
        .leftJoinAndSelect('site.location', 'location')
        .leftJoinAndSelect('location.region', 'region')
        .leftJoinAndSelect('sample.visit', 'visit')
        .leftJoinAndSelect('site.collectionCollector', 'collectionCollector')
        .leftJoinAndSelect('visit.visitedBy', 'visitedBy')
        .leftJoinAndSelect('sample.diseases', 'disease')
        .leftJoinAndSelect('sample.receivedBy', 'receivedBy')
        .leftJoinAndSelect('sample.extractedBy', 'extractedBy')
        .leftJoinAndSelect('sample.collectedBy', 'collectedBy')
        .leftJoinAndSelect('sample.testedBy', 'testedBy')
        .leftJoinAndSelect(
          'sample.preprocessingPerformedBy',
          'preprocessingPerformedBy',
        )
        .leftJoinAndSelect('sample.team', 'team')
        .leftJoinAndSelect('sample.reportGeneratedBy', 'reportGeneratedBy')
        .leftJoinAndSelect('sample.sampleType', 'sampleType')
        .leftJoinAndSelect('sample.pooledWith', 'pooledWith')
        .leftJoinAndSelect('visit.project', 'project')
        .leftJoinAndSelect('visit.collector', 'visitCollector')
        // Sample's own `project` FK, independent of `visit` - bound below
        // instead of the `project` alias above (joined via `visit.project`)
        // so this still fails closed if a sample's visit is ever missing.
        .leftJoin('sample.project', 'sampleProject')
        .where(query);

      if (shouldScopeToProject(projectId)) {
        qb.andWhere('sampleProject.id = :projectId', { projectId });
      }

      const sampleData = await qb.getOne();

      if (!sampleData) {
        throw new NotFoundException('Sample not found');
      }

      const signedUrls = await this.getSignedUrlForSample(sampleData);
      sampleData.photos = signedUrls;

      // Sort the diseases array in-place
      if (sampleData.diseases && sampleData.diseases.length > 0) {
        sampleData.diseases.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
      }

      // Compute hasAI flag
      const aiDisease = sampleData.diseases?.find(
        (d) => d.shortName?.toUpperCase() === 'AI',
      );
      (sampleData as any).hasAI = !!aiDisease;

      return sampleData;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new Error(error.message);
    }
  }

  // A9: same binding as `findOne` above - `projectId` from the route, not
  // just the leaf sample id, so a member of project A cannot overwrite
  // project B's sample (disease results, collector, status) by pasting B's
  // sample id into A's URL.
  async update(
    id: string,
    updateSampleDto: UpdateSampleDto,
    user?: User,
    projectId?: string,
  ): Promise<Sample> {
    const userData = await this.userRepository.findOne({
      where: { id: user.id },
    });

    const sample = await this.sampleRepository.findOne({
      where: {
        id,
        ...(shouldScopeToProject(projectId)
          ? { project: { id: projectId } }
          : {}),
      },
      relations: [
        'collectedBy',
        'labTests',
        'labTests.testedBy',
        'pooledWith',
        'sampleType',
        'species',
      ],
    });

    if (!sample) {
      throw new NotFoundException('Sample not found');
    }

    // if (!sample) {
    //   // If the sample does not exist, create a new one
    //   const newSample = this.sampleRepository.create({
    //     id,
    //     ...updateSampleDto,
    //   });
    //   return this.sampleRepository.save(newSample);
    // }

    switch (updateSampleDto.sampleStatus) {
      case SampleStatus.RECEIVED:
        if (!updateSampleDto.receivedBy) {
          updateSampleDto.receivedBy = userData;
        }

        // Generate Accession ID if not already present
        if (!sample.accessionId) {
          updateSampleDto.accessionId = await this.generateAccessionId(
            this.entityManager,
            sample.species,
            sample.sampleType,
          );
        }
        break;
      case SampleStatus.PRE_PROCESSED:
        if (!updateSampleDto.preprocessingPerformedBy) {
          updateSampleDto.preprocessingPerformedBy = userData;
        }
        break;
      case SampleStatus.EXTRACTED:
        if (!updateSampleDto.extractedBy) {
          updateSampleDto.extractedBy = userData;
        }
        break;
      case SampleStatus.TESTED:
        if (!updateSampleDto.testedBy) {
          updateSampleDto.testedBy = userData;
        }
        break;
      case SampleStatus.TEST_REPORT_GENERATED:
        if (!updateSampleDto.reportGeneratedBy) {
          updateSampleDto.reportGeneratedBy = userData;
        }
        break;
      default:
        break;
    }

    const pooledSampleIds = updateSampleDto.pooledSampleIds;
    if (pooledSampleIds !== undefined) {
      const uniquePoolIds = [...new Set(pooledSampleIds)].filter(
        (poolId) => poolId && poolId !== id,
      );
      const pooledSamples = uniquePoolIds.length
        ? await this.sampleRepository.findBy({ id: In(uniquePoolIds) })
        : [];

      if (pooledSamples.length !== uniquePoolIds.length) {
        throw new BadRequestException('One or more pooled samples not found');
      }

      const existingPoolIds = sample.pooledWith?.map((pool) => pool.id) ?? [];
      const removedPoolIds = existingPoolIds.filter(
        (poolId) => !uniquePoolIds.includes(poolId),
      );
      const addedPoolIds = uniquePoolIds.filter(
        (poolId) => !existingPoolIds.includes(poolId),
      );

      updateSampleDto.pooledWith = pooledSamples;

      if (addedPoolIds.length > 0) {
        await this.sampleRepository.update(
          { id: In(addedPoolIds) },
          { isPooledSample: true },
        );
      }

      if (removedPoolIds.length > 0) {
        await this.sampleRepository.update(
          { id: In(removedPoolIds) },
          { isPooledSample: false },
        );
      }
    }

    delete updateSampleDto.pooledSampleIds;
    const mergeDeep = (base: any, patch: any): any => {
      if (patch === null || patch === undefined) return base;
      if (typeof patch !== 'object' || Array.isArray(patch)) return patch;
      const output = { ...(base || {}) };
      Object.keys(patch).forEach((key) => {
        output[key] = mergeDeep(base?.[key], patch[key]);
      });
      return output;
    };

    const existingDetails = sample?.details || {};
    const receivedStorageTemperature = (updateSampleDto as any)
      .receivedStorageTemperature;
    const hasReceivingStorage =
      receivedStorageTemperature || updateSampleDto.receivedLabStorageDetails;
    const hasPreprocessingStorage =
      updateSampleDto.preprocessingStorageTemperature ||
      updateSampleDto.preprocessingStorageDetails;
    const hasExtractionStorage =
      updateSampleDto.details?.extraction?.storageTemperature ||
      updateSampleDto.details?.extraction?.storageDetails;

    if (
      hasReceivingStorage ||
      hasPreprocessingStorage ||
      hasExtractionStorage ||
      updateSampleDto.details
    ) {
      const storagePatch: any = updateSampleDto.details
        ? { ...updateSampleDto.details }
        : {};

      if (hasReceivingStorage) {
        storagePatch.receiving = {
          ...storagePatch.receiving,
          storageTemperature: receivedStorageTemperature || undefined,
          storageDetails:
            updateSampleDto.receivedLabStorageDetails || undefined,
        };
      }

      if (hasPreprocessingStorage) {
        storagePatch.preprocessing = {
          ...storagePatch.preprocessing,
          storageTemperature:
            updateSampleDto.preprocessingStorageTemperature || undefined,
          storageDetails:
            updateSampleDto.preprocessingStorageDetails || undefined,
        };
      }

      updateSampleDto.details = mergeDeep(existingDetails, storagePatch);
    }

    updateSampleDto = Object.assign(sample, updateSampleDto);

    if (updateSampleDto.collectedBy) {
      const user = await this.userRepository.findOne({
        where: { id: updateSampleDto.collectedBy.id },
      });
      updateSampleDto.collectedBy = user;
      updateSampleDto.testDate = new Date();
    }
    if (updateSampleDto.testDate) {
      updateSampleDto.testDate = updateSampleDto.testDate;
    }

    let createdLocation = null;
    if (updateSampleDto.latitude && updateSampleDto.longitude) {
      const geoJSON = {
        type: 'Point',
        coordinates: [updateSampleDto.longitude, updateSampleDto.latitude],
      };
      const queryBuilder = this.locationRepository.createQueryBuilder();
      const result = await queryBuilder
        .insert()
        .into(Location)
        .values({
          coordinates: () => `ST_GeomFromGeoJSON('${JSON.stringify(geoJSON)}')`,
        })
        .returning('*')
        .execute();
      const locationData = result.raw[0] as Location;
      createdLocation = await this.locationRepository.findOne({
        where: { id: locationData.id },
      });
    }
    // If the sample exists, update the existing sample
    const updatedSample = await this.sampleRepository.save({
      ...updateSampleDto,
      location: createdLocation,
    });

    if (updatedSample) {
      const sampleAuditPayload = {
        sample: sample,
        user: updatedSample.collectedBy,
        currentChanges: updatedSample,
        previousChanges: sample,
        event: `sample-${updateSampleDto.sampleStatus}`,
      };
      const sampleAudit =
        await this.sampleAuditRepository.create(sampleAuditPayload);

      await this.sampleAuditRepository.save(sampleAudit);
    }

    // Propagate status and related fields to pooled samples
    if (
      sample.pooledWith &&
      sample.pooledWith.length > 0 &&
      updateSampleDto.sampleStatus === SampleStatus.TEST_REPORT_GENERATED
    ) {
      console.log(
        'Propagating sample status to pooled samples:',
        sample.pooledWith.map((s) => s.id),
      );

      const pooledSampleIds = sample.pooledWith.map((s) => s.id);
      await this.sampleRepository.update(
        { id: In(pooledSampleIds) },
        {
          sampleStatus: SampleStatus.TEST_REPORT_GENERATED,
          reportGeneratedBy: updateSampleDto.reportGeneratedBy,
          reportGeneratedAt: new Date(),
        },
      );
    }

    return this.findOne({ id }, projectId);
  }

  async updateCollectedSampleDetails(
    projectId: string,
    id: string,
    dto: UpdateCollectedSampleDetailsDto,
    user?: User,
  ): Promise<Sample> {
    return this.updateSampleStageDetails(projectId, id, 'picked-up', dto, user);
  }

  async updateSampleStageDetails(
    projectId: string,
    id: string,
    stage: string,
    dto: UpdateSampleStageDetailsDto,
    user?: User,
  ): Promise<Sample> {
    if (!user?.id) {
      throw new ForbiddenException('User not found');
    }
    // Kept as an alias (rather than inlining `user` below) purely for the
    // audit-trail write further down, which records who made the edit.
    const userData = user;

    // The role-name check below needs the sample's *actual* owning project,
    // not the (possibly absent) route `projectId`, so the sample has to be
    // fetched before authorization can be decided.
    const sample = await this.sampleRepository.findOne({
      where: { id },
      relations: [
        'collectedBy',
        'receivedBy',
        'preprocessingPerformedBy',
        'extractedBy',
        'testedBy',
        'reportGeneratedBy',
        'project',
        'project.workspace',
        'labTests',
        'labTests.testedBy',
      ],
    });

    if (!sample) {
      throw new NotFoundException('Sample not found');
    }

    if (shouldScopeToProject(projectId) && sample.project?.id !== projectId) {
      throw new NotFoundException('Sample not found in this project');
    }

    // A-cross-tenant: holding a role *named* project-viewer/lab-admin
    // somewhere used to be enough, regardless of which project it was for -
    // a lab-admin of project A could edit project B's sample stage details.
    // The qualifying role must now belong to *this* sample's own project
    // (`rolesForProject`, which matches on the role row's own `.project`
    // column - project- and team-scoped roles both carry one). System scope
    // bypasses outright. workspace-admin is itself a workspace-scoped role
    // with no `.project` of its own, so it can never show up in
    // `rolesForProject` - checked separately via `administersWorkspace`
    // against the sample's own project's workspace, which is what keeps a
    // workspace-admin able to edit any sample in a project they actually
    // administer, and nothing outside it.
    //
    // `user` is req.user, already eager-loaded with
    // roles/roles.role/roles.workspace by UserService.findOne - the previous
    // re-fetch here used relations ['roles','roles.role'] only, which never
    // included `roles.workspace` and so could never have satisfied an
    // administersWorkspace-based check anyway.
    const allowedRoleNames = new Set([
      'project-viewer',
      'lab-admin',
      'super-admin',
      'workspace-admin',
    ]);

    let canEditSampleDetails = this.tenantScopeService.isSystem(user);

    if (!canEditSampleDetails) {
      const projectRoles = this.tenantScopeService.rolesForProject(
        user,
        sample.project?.id,
      );
      const hasQualifyingProjectRole = projectRoles.some((userRole) =>
        allowedRoleNames.has(userRole.role?.name),
      );
      const administersOwningWorkspace =
        this.tenantScopeService.administersWorkspace(
          user,
          sample.project?.workspace?.id,
        );
      canEditSampleDetails =
        hasQualifyingProjectRole || administersOwningWorkspace;
    }

    if (!canEditSampleDetails) {
      throw new ForbiddenException(
        'You are not allowed to edit sample details',
      );
    }

    const normalizedStage =
      stage === 'tested' ? SampleStatus.TEST_REPORT_GENERATED : stage;
    const allowedStatusByStage: Record<string, SampleStatus[]> = {
      [SampleStatus.PICKED_UP]: [SampleStatus.PICKED_UP],
      [SampleStatus.RECEIVED]: [SampleStatus.RECEIVED],
      [SampleStatus.VIRUS_ISOLATION]: [SampleStatus.VIRUS_ISOLATION],
      [SampleStatus.PRE_PROCESSED]: [SampleStatus.PRE_PROCESSED],
      [SampleStatus.EXTRACTED]: [SampleStatus.EXTRACTED],
      [SampleStatus.TEST_REPORT_GENERATED]: [
        SampleStatus.TESTED,
        SampleStatus.TEST_REPORT_GENERATED,
      ],
    };

    const allowedStatuses = allowedStatusByStage[normalizedStage];
    if (!allowedStatuses) {
      throw new BadRequestException('Unsupported sample details stage');
    }

    if (!allowedStatuses.includes(sample.sampleStatus)) {
      throw new BadRequestException(
        `Only ${normalizedStage} sample details can be edited from this stage`,
      );
    }

    const mergeDeep = (base: any, patch: any): any => {
      if (patch === null || patch === undefined) return base;
      if (typeof patch !== 'object' || Array.isArray(patch)) return patch;
      const output = { ...(base || {}) };
      Object.keys(patch).forEach((key) => {
        output[key] = mergeDeep(base?.[key], patch[key]);
      });
      return output;
    };

    const resolveUser = async (
      userId: string | undefined,
      fieldName: string,
    ): Promise<User | undefined> => {
      if (userId === undefined) return undefined;
      const resolvedUser = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!resolvedUser)
        throw new BadRequestException(`${fieldName} not found`);
      return resolvedUser;
    };

    const previousChanges = {
      stage: normalizedStage,
      barcode: sample.barcode,
      collectedBy: sample.collectedBy,
      collectionTime: sample.collectionTime,
      receivedAt: sample.receivedAt,
      receivedBy: sample.receivedBy,
      receivedVolumeValue: sample.receivedVolumeValue,
      receivedVolumeUnit: sample.receivedVolumeUnit,
      receivedStorageTemperature: sample.receivedStorageTemperature,
      receivedLabStorageDetails: sample.receivedLabStorageDetails,
      referenceBatchId: sample.referenceBatchId,
      batchReferenceDocument: sample.batchReferenceDocument,
      accessionId: sample.accessionId,
      preprocessingDate: sample.preprocessingDate,
      preprocessingPerformedBy: sample.preprocessingPerformedBy,
      preprocessingSteps: sample.preprocessingSteps,
      extractionDateTime: sample.extractionDateTime,
      extractedBy: sample.extractedBy,
      extractionSampleUsedValue: sample.extractionSampleUsedValue,
      extractionSampleUsedUnit: sample.extractionSampleUsedUnit,
      extractionSampleRemainingValue: sample.extractionSampleRemainingValue,
      extractionSampleRemainingUnit: sample.extractionSampleRemainingUnit,
      extractionComments: sample.extractionComments,
      testedAt: sample.testedAt,
      testedBy: sample.testedBy,
      reportGeneratedAt: sample.reportGeneratedAt,
      reportGeneratedBy: sample.reportGeneratedBy,
      details: sample.details,
      labTests: sample.labTests,
    };

    switch (normalizedStage) {
      case SampleStatus.PICKED_UP:
        if (dto.barcode !== undefined) sample.barcode = dto.barcode;
        if (dto.collectionTime !== undefined) {
          sample.collectionTime = new Date(dto.collectionTime);
        }
        sample.collectedBy =
          (await resolveUser(dto.collectedBy, 'Collected by user')) ??
          sample.collectedBy;
        break;
      case SampleStatus.RECEIVED:
        if (dto.receivedAt !== undefined)
          sample.receivedAt = new Date(dto.receivedAt);
        if (dto.receivedVolumeValue !== undefined)
          sample.receivedVolumeValue = dto.receivedVolumeValue;
        if (dto.receivedVolumeUnit !== undefined)
          sample.receivedVolumeUnit = dto.receivedVolumeUnit;
        if (dto.receivedStorageTemperature !== undefined)
          sample.receivedStorageTemperature = dto.receivedStorageTemperature;
        if (dto.receivedLabStorageDetails !== undefined)
          sample.receivedLabStorageDetails = dto.receivedLabStorageDetails;
        if (dto.referenceBatchId !== undefined)
          sample.referenceBatchId = dto.referenceBatchId;
        if (dto.batchReferenceDocument !== undefined)
          sample.batchReferenceDocument = dto.batchReferenceDocument;
        if (dto.accessionId !== undefined) sample.accessionId = dto.accessionId;
        sample.receivedBy =
          (await resolveUser(dto.receivedBy, 'Received by user')) ??
          sample.receivedBy;
        sample.details = dto.details
          ? mergeDeep(sample.details, {
              receiving: dto.details.receiving ?? dto.details,
            })
          : sample.details;
        break;
      case SampleStatus.VIRUS_ISOLATION:
        sample.details = mergeDeep(sample.details, {
          virusIsolation:
            dto.details?.virusIsolation !== undefined
              ? dto.details.virusIsolation
              : dto.details,
        });
        break;
      case SampleStatus.PRE_PROCESSED:
        if (dto.preprocessingDate !== undefined) {
          sample.preprocessingDate = new Date(dto.preprocessingDate);
        }
        if (dto.preprocessingSteps !== undefined) {
          sample.preprocessingSteps = dto.preprocessingSteps;
        }
        sample.preprocessingPerformedBy =
          (await resolveUser(
            dto.preprocessingPerformedBy,
            'Preprocessing user',
          )) ?? sample.preprocessingPerformedBy;
        sample.details = dto.details
          ? mergeDeep(sample.details, {
              preprocessing: dto.details.preprocessing ?? dto.details,
            })
          : sample.details;
        break;
      case SampleStatus.EXTRACTED:
        if (dto.extractionDateTime !== undefined)
          sample.extractionDateTime = new Date(dto.extractionDateTime);
        if (dto.extractionSampleUsedValue !== undefined)
          sample.extractionSampleUsedValue = dto.extractionSampleUsedValue;
        if (dto.extractionSampleUsedUnit !== undefined)
          sample.extractionSampleUsedUnit = dto.extractionSampleUsedUnit;
        if (dto.extractionSampleRemainingValue !== undefined)
          sample.extractionSampleRemainingValue =
            dto.extractionSampleRemainingValue;
        if (dto.extractionSampleRemainingUnit !== undefined)
          sample.extractionSampleRemainingUnit =
            dto.extractionSampleRemainingUnit;
        if (dto.extractionComments !== undefined)
          sample.extractionComments = dto.extractionComments;
        sample.extractedBy =
          (await resolveUser(dto.extractedBy, 'Extracted by user')) ??
          sample.extractedBy;
        sample.details = dto.details
          ? mergeDeep(sample.details, {
              extraction: dto.details.extraction ?? dto.details,
            })
          : sample.details;
        break;
      case SampleStatus.TEST_REPORT_GENERATED:
        if (dto.testedAt !== undefined)
          sample.testedAt = new Date(dto.testedAt);
        if (dto.reportGeneratedAt !== undefined)
          sample.reportGeneratedAt = new Date(dto.reportGeneratedAt);
        sample.testedBy =
          (await resolveUser(dto.testedBy, 'Tested by user')) ??
          sample.testedBy;
        sample.reportGeneratedBy =
          (await resolveUser(
            dto.reportGeneratedBy,
            'Report generated by user',
          )) ?? sample.reportGeneratedBy;

        if (dto.labTests?.length) {
          for (const labTestPatch of dto.labTests) {
            if (!labTestPatch.id) continue;
            const labTest = await this.labTestRepository.findOne({
              where: { id: labTestPatch.id, sample: { id } },
              relations: ['testedBy'],
            });
            if (!labTest) {
              throw new BadRequestException('Lab test not found');
            }
            const labTestTestedBy = await resolveUser(
              labTestPatch.testedBy,
              'Lab test tested by user',
            );
            Object.assign(labTest, {
              kitOrProtocol:
                labTestPatch.kitOrProtocol !== undefined
                  ? labTestPatch.kitOrProtocol
                  : labTest.kitOrProtocol,
              testResult:
                labTestPatch.testResult !== undefined
                  ? labTestPatch.testResult
                  : labTest.testResult,
              ctValue:
                labTestPatch.ctValue !== undefined
                  ? labTestPatch.ctValue
                  : labTest.ctValue,
              variant:
                labTestPatch.variant !== undefined
                  ? labTestPatch.variant
                  : labTest.variant,
              viralLoad:
                labTestPatch.viralLoad !== undefined
                  ? labTestPatch.viralLoad
                  : labTest.viralLoad,
              testedAt:
                labTestPatch.testedAt !== undefined
                  ? new Date(labTestPatch.testedAt)
                  : labTest.testedAt,
              resultDate:
                labTestPatch.resultDate !== undefined
                  ? new Date(labTestPatch.resultDate)
                  : labTest.resultDate,
              resultComment:
                labTestPatch.resultComment !== undefined
                  ? labTestPatch.resultComment
                  : labTest.resultComment,
              testResultReport:
                labTestPatch.testResultReport !== undefined
                  ? labTestPatch.testResultReport
                  : labTest.testResultReport,
              labComment:
                labTestPatch.labComment !== undefined
                  ? labTestPatch.labComment
                  : labTest.labComment,
              details:
                labTestPatch.details !== undefined
                  ? mergeDeep(labTest.details, labTestPatch.details)
                  : labTest.details,
              testedBy: labTestTestedBy ?? labTest.testedBy,
            });
            await this.labTestRepository.save(labTest);
          }
        }
        break;
      default:
        throw new BadRequestException('Unsupported sample details stage');
    }

    const updatedSample = await this.sampleRepository.save(sample);
    await this.sampleAuditRepository.save(
      this.sampleAuditRepository.create({
        sample: updatedSample,
        user: userData,
        previousChanges,
        currentChanges: {
          stage: normalizedStage,
          barcode: updatedSample.barcode,
          collectedBy: updatedSample.collectedBy,
          collectionTime: updatedSample.collectionTime,
          receivedAt: updatedSample.receivedAt,
          receivedBy: updatedSample.receivedBy,
          receivedVolumeValue: updatedSample.receivedVolumeValue,
          receivedVolumeUnit: updatedSample.receivedVolumeUnit,
          receivedStorageTemperature: updatedSample.receivedStorageTemperature,
          receivedLabStorageDetails: updatedSample.receivedLabStorageDetails,
          referenceBatchId: updatedSample.referenceBatchId,
          batchReferenceDocument: updatedSample.batchReferenceDocument,
          accessionId: updatedSample.accessionId,
          preprocessingDate: updatedSample.preprocessingDate,
          preprocessingPerformedBy: updatedSample.preprocessingPerformedBy,
          preprocessingSteps: updatedSample.preprocessingSteps,
          extractionDateTime: updatedSample.extractionDateTime,
          extractedBy: updatedSample.extractedBy,
          extractionSampleUsedValue: updatedSample.extractionSampleUsedValue,
          extractionSampleUsedUnit: updatedSample.extractionSampleUsedUnit,
          extractionSampleRemainingValue:
            updatedSample.extractionSampleRemainingValue,
          extractionSampleRemainingUnit:
            updatedSample.extractionSampleRemainingUnit,
          extractionComments: updatedSample.extractionComments,
          testedAt: updatedSample.testedAt,
          testedBy: updatedSample.testedBy,
          reportGeneratedAt: updatedSample.reportGeneratedAt,
          reportGeneratedBy: updatedSample.reportGeneratedBy,
          details: updatedSample.details,
        },
        event: `sample-details-edited:${normalizedStage}`,
      }),
    );

    return this.findOne({ id }, projectId);
  }

  async getPoolableSamples(
    projectId: string,
    sampleId: string,
  ): Promise<Sample[]> {
    try {
      // A13: bind the lookup to the route's `:projectId` - without this, a
      // foreign sample id (from another project) would seed the pooling
      // query below with that other project's site/sampleType/visit.
      const currentSample = await this.sampleRepository.findOne({
        where: {
          id: sampleId,
          ...(shouldScopeToProject(projectId)
            ? { project: { id: projectId } }
            : {}),
        },
        relations: ['site', 'sampleType', 'visit'],
      });

      if (!currentSample) {
        throw new BadRequestException('Sample not found');
      }

      // Find other samples with same site, sampleType, and visit
      // Exclude samples that are already pooled or the current sample
      const poolableSamples = await this.sampleRepository.find({
        where: {
          site: { id: currentSample.site.id },
          sampleType: { id: currentSample.sampleType.id },
          visit: { id: currentSample.visit.id },
          status: StatusType.ACTIVE,
          sampleStatus: In([SampleStatus.PICKED_UP]),
          isPooledSample: false,
        },
        relations: ['sampleType'],
      });

      // Filter out the current sample
      return poolableSamples.filter((sample) => sample.id !== sampleId);
    } catch (error) {
      console.error('Error fetching poolable samples:', error);
      throw error;
    }
  }

  async remove(id: number) {
    const sample = await this.findOne(id);
    await this.update(sample.id, { status: StatusType.DELETED });
  }

  async getSampleStatsForLab(
    query,
    user: any,
    projectId: string,
  ): Promise<any> {
    try {
      const { diseaseId, startDate, endDate, workspaceId } = query;

      // Super-admins operate in a selected project context and are not team-scoped.
      // Team-scoped lab users should continue to see only their own team's counts.
      //
      // `user` is req.user, already eager-loaded by UserService.findOne with
      // team/roles/roles.role/roles.role.permissions - re-fetching it here
      // was a redundant query.
      const userData = user;
      const tenant = await this.tenantScopeService.forUser(userData);
      const userScope = tenant.scope;
      const queryBuilder = this.sampleRepository
        .createQueryBuilder('sample')
        .select('COUNT(DISTINCT sample.id)', 'total')
        .addSelect(
          `COUNT(DISTINCT CASE WHEN sample.sampleStatus = :pickedUp THEN sample.id END)`,
          'totalCollected',
        )
        .addSelect(
          `COUNT(DISTINCT CASE WHEN sample.sampleStatus = :received THEN sample.id END)`,
          'totalReceived',
        )
        .addSelect(
          `COUNT(DISTINCT CASE WHEN sample.sampleStatus = :preProcessed THEN sample.id END)`,
          'totalPreprocessed',
        )
        .addSelect(
          `COUNT(DISTINCT CASE WHEN sample.sampleStatus = :rejected THEN sample.id END)`,
          'totalRejected',
        )
        .addSelect(
          `COUNT(DISTINCT CASE WHEN sample.sampleStatus = :extracted THEN sample.id END)`,
          'totalExtracted',
        )
        .addSelect(
          `COUNT(DISTINCT CASE WHEN sample.sampleStatus = :completed THEN sample.id END)`,
          'totalCompleted',
        )
        .innerJoin('sample.project', 'project')
        .leftJoin('sample.diseases', 'disease');

      // Scope to a single project unless a super-admin requested all projects.
      if (shouldScopeToProject(projectId)) {
        queryBuilder.andWhere('project.id = :projectId', { projectId });
      } else if (workspaceId) {
        queryBuilder.andWhere('project.workspace_id = :workspaceId', {
          workspaceId,
        });
      }
      if (userScope === Scope.Team) {
        // Every team-scoped role the caller holds (possibly several),
        // restricted to the projects they can reach - not the legacy
        // singular `userData.team.id`, which threw for anyone without that
        // column set (even if they held team roles via user_roles) and
        // would otherwise have picked one arbitrary team for anyone holding
        // more than one.
        if (!tenant.teamIds.length) {
          throw new BadRequestException(
            'There is no associated team for the lab user',
          );
        }

        applyProjectScope(queryBuilder, tenant, 'project.id');
        queryBuilder.andWhere('sample.teamId IN (:...tenantTeamIds)', {
          tenantTeamIds: tenant.teamIds,
        });
      }
      // Project/Workspace scope (project-viewer, workspace-admin) have no
      // singular team - they're already scoped to `projectId` above via
      // `shouldScopeToProject()`, so no further team-based restriction is
      // needed (or possible, without crashing on `.team.id` of null).

      // Optional disease filter
      if (diseaseId) {
        queryBuilder.andWhere('disease.id = :diseaseId', { diseaseId });
      }

      // Apply Date Range Filter
      if (startDate && endDate) {
        queryBuilder.andWhere(
          'DATE(sample.collectedAt) BETWEEN :startDate AND :endDate',
          {
            startDate,
            endDate,
          },
        );
      }
      const result = await queryBuilder
        .setParameters({
          pending: SampleStatus.PENDING,
          pickedUp: SampleStatus.PICKED_UP,
          received: SampleStatus.RECEIVED,
          preProcessed: SampleStatus.PRE_PROCESSED,
          rejected: SampleStatus.REJECTED,
          extracted: SampleStatus.EXTRACTED,
          completed: SampleStatus.TEST_REPORT_GENERATED,
        })
        .getRawOne();

      return {
        totalPending: Number(result.totalPending || 0),
        totalCollected: Number(result.totalCollected || 0),
        totalReceived: Number(result.totalReceived || 0),
        totalPreprocessed: Number(result.totalPreprocessed || 0),
        totalRejected: Number(result.totalRejected || 0),
        totalExtracted: Number(result.totalExtracted || 0),
        totalCompleted: Number(result.totalCompleted || 0),
      };
    } catch (error) {
      console.error('Error fetching lab sample stats:', error);
      throw error;
    }
  }

  async sampleStatusScript() {
    const samples = await this.sampleRepository.find({});

    for (const element of samples) {
      await this.sampleRepository.update(
        { id: element.id },
        { sampleStatus: SampleStatus.PICKED_UP },
      );
    }
  }

  private async generateAccessionId(
    manager: EntityManager,
    species: Species,
    sampleType: SampleType,
  ): Promise<string> {
    const prefix = buildAccessionPrefix(
      species?.abbreviation,
      sampleType?.abbreviation,
      new Date(),
    );

    const lastSample = await manager.findOne(Sample, {
      where: {
        accessionId: ILike(`${prefix}%`),
      },
      order: {
        accessionId: 'DESC',
      },
    });

    return `${prefix}${nextAccessionSequence(lastSample?.accessionId)}`;
  }

  async getMaxRound(
    projectId?: string,
    user?: User,
    workspaceId?: string,
  ): Promise<number> {
    // Same root cause as the getSampleStatLogistics/sampleBreakDown fixes:
    // the legacy singular `user.team.id` is `null` for every workspace-admin
    // and self-serve signup user, so they always hit the `return 0` guard
    // below instead of getting their real max round. Resolve the team set
    // from `resolveTenantScope(...).teamIds` instead.
    const tenant = await this.tenantScopeService.forUser(user);

    const siteQuery = this.siteRepository
      .createQueryBuilder('site')
      .innerJoin('site.samples', 'sample')
      .select('DISTINCT site.id', 'id');

    if (tenant.isSystem) {
      if (shouldScopeToProject(projectId)) {
        siteQuery.where('sample.projectId = :projectId', { projectId });
      } else if (workspaceId) {
        siteQuery
          .innerJoin('sample.project', 'project')
          .where('project.workspace_id = :workspaceId', { workspaceId });
      }
    } else if (tenant.scope === Scope.Team) {
      if (!tenant.teamIds.length) return 0;
      siteQuery.where('sample.teamId IN (:...teamIds)', {
        teamIds: tenant.teamIds,
      });
      if (shouldScopeToProject(projectId)) {
        siteQuery.andWhere('sample.projectId = :projectId', { projectId });
      }
    } else {
      // Project/Workspace scope (project-viewer, workspace-admin) have no
      // singular team - the route's `:projectId` is already CASL-validated,
      // so scope to it directly. Only fall back to the caller's full
      // reachable project set if this is ever called without one.
      if (shouldScopeToProject(projectId)) {
        siteQuery.where('sample.projectId = :projectId', { projectId });
      } else if (tenant.projectIds.length) {
        siteQuery.where('sample.projectId IN (:...tenantProjectIds)', {
          tenantProjectIds: tenant.projectIds,
        });
      } else {
        return 0;
      }
    }

    const sites = await siteQuery.getRawMany();
    const siteIds = sites.map((s) => s.id);
    if (!siteIds.length) return 0;

    const result = await this.visitRepository
      .createQueryBuilder('visit')
      .innerJoin('visit.site', 'site')
      .select('site.id', 'siteId')
      .addSelect('COUNT(visit.id)', 'visitCount')
      .where('site.id IN (:...siteIds)', { siteIds })
      .groupBy('site.id')
      .orderBy('"visitCount"', 'DESC')
      .limit(1)
      .getRawOne();

    return result ? Number(result.visitCount) : 0;
  }

  /**
   * Returns all distinct AnimalMetadata records ever recorded for a site,
   * across all visits. Species is eagerly loaded for display purposes.
   * Results are ordered newest-first so the most recently seen animals
   * appear at the top of the selection list.
   */
  async getAnimalMetadataBySite(
    siteId: string,
    user?: any,
  ): Promise<AnimalMetadata[]> {
    // Reject non-UUID input early — TypeORM would otherwise let Postgres throw
    // `invalid input syntax for type uuid` for malformed path params.
    if (!siteId || !isUUID(siteId)) return [];

    // A13: this route carries no `:projectId` — verify the site belongs to a
    // project the caller can actually reach before returning anything for
    // it. Fails closed (empty list) for an unreachable or non-existent site,
    // same as the invalid-UUID guard above, so this doesn't leak whether the
    // site exists.
    const tenant = await this.tenantScopeService.forUser(user);
    if (!tenant.isSystem) {
      const site = await this.siteRepository.findOne({
        where: { id: siteId },
        relations: ['project'],
      });
      if (!site || !canReachProject(tenant, site.project?.id)) {
        return [];
      }
    }

    // Single-column filter on the denormalized site_id, eager-load species
    // for display (emoji + name).
    return this.animalMetadataRepository.find({
      where: { siteId },
      relations: ['species'],
      order: { createdAt: 'DESC' },
    });
  }
}
