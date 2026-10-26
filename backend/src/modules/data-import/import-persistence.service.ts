import { ConflictException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, ILike, In, IsNull, QueryFailedError } from 'typeorm';
import { Disease } from 'src/entities/disease.entity';
import { SampleType } from 'src/entities/sample-type.entity';
import { Sample } from 'src/entities/sample.entity';
import { Site } from 'src/entities/site.entity';
import { Location } from 'src/entities/location.entity';
import { Region } from 'src/entities/region.entity';
import { AnimalMetadata } from 'src/entities/animal-metadata.entity';
import { Species } from 'src/entities/species.entity';
import { Team } from 'src/entities/team.entity';
import { User } from 'src/entities/user.entity';
import { Visit } from 'src/entities/visit.entity';
import { LabTest } from 'src/entities/lab-test.entity';
import { Role } from 'src/entities/role.entity';
import { UserRole } from 'src/entities/user-role.entity';
import { VisitStatus } from 'src/common/enums/visitStatus.enum';
import { SampleStatus } from 'src/common/enums/sample-status.enum';
import { StatusType } from 'src/common/enums/status.enum';
import { TestResultType } from 'src/common/enums/test-result.enum';
import { RegionType } from 'src/common/enums/region.enum';
import { RoleType } from 'src/common/enums/user-type.enum';
import { DiseaseGroup, FINAL_TEST_RESULTS } from './data-import.types';
import { parseDiseaseList } from './config/parse-disease-list';

/**
 * Persists a fully-validated batch of collection or lab rows in a single
 * transaction. Only invoked after ImportValidationService reports zero
 * errors, and rolls back entirely on any unexpected failure so a file
 * either imports completely or not at all.
 */
@Injectable()
export class ImportPersistenceService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async persistCollectionRows(
    rows: Record<string, any>[],
    diseaseGroup: DiseaseGroup,
    projectId: string,
  ): Promise<number> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const manager = queryRunner.manager;
      // A project can have more than one team, so the batch can't pin every
      // row to a single arbitrarily-picked team — each row's collector needs
      // to land on their own team, or the team-member-progress stats (grouped
      // by team+site) silently exclude/miscount the imported visit.
      const projectTeams = await manager.find(Team, {
        where: { projects: { id: projectId } },
        order: { createdAt: 'ASC' },
      });
      if (projectTeams.length === 0) {
        throw new Error('No team is configured for this project yet');
      }

      const collectorCache = new Map<string, User>();
      const collectorTeamCache = new Map<string, Team>();
      let imported = 0;
      for (const row of rows) {
        const diseaseShortNames = parseDiseaseList(row['disease']);
        const diseases = await manager.find(Disease, {
          where: diseaseShortNames.map((shortName) => ({ shortName })),
        });
        const sampleType = await manager.findOne(SampleType, {
          where: { name: ILike(row['sampleType']) },
        });
        const collector = await this.resolveOrCreateCollectorByEmail(
          manager,
          collectorCache,
          projectTeams,
          projectId,
          row['collectorEmail'],
          row['collectorName'],
        );
        const collectorTeam = await this.resolveCollectorTeam(
          manager,
          collectorTeamCache,
          projectTeams,
          projectId,
          collector,
        );
        const siteAddress =
          [row['villageOrLocality'], row['district'], row['state']]
            .filter(Boolean)
            .join(', ') || null;

        let site = await manager.findOne(Site, {
          where: {
            project: { id: projectId },
            name: ILike(row['siteName']),
          },
          relations: ['diseases', 'location'],
        });
        if (!site) {
          const location = await this.createImportLocation(manager, row);
          site = manager.create(Site, {
            project: { id: projectId } as any,
            name: row['siteName'],
            farmType: row['siteCategory'],
            siteSubType: row['siteSubType'] ?? null,
            diseases,
            location,
            village: row['villageOrLocality'] ?? null,
            address: siteAddress,
          });
          site = await manager.save(Site, site);
        } else {
          const siteDiseaseIds = new Set(
            (site.diseases ?? []).map((disease) => disease.id),
          );
          site.diseases = [
            ...(site.diseases ?? []),
            ...diseases.filter((disease) => !siteDiseaseIds.has(disease.id)),
          ];
          if (!site.village && row['villageOrLocality']) {
            site.village = row['villageOrLocality'];
          }
          if (!site.address) {
            site.address = siteAddress;
          }
          await manager.save(Site, site);
        }

        const visitedAt = new Date(row['visitOrCollectionDate']);
        let visit = await manager.findOne(Visit, {
          where: {
            site: { id: site.id },
            visitScheduledAt: visitedAt,
          },
          relations: ['team'],
        });
        if (!visit) {
          visit = manager.create(Visit, {
            project: { id: projectId } as any,
            site,
            team: collectorTeam,
            collector: collector as any,
            visitedAt,
            visitScheduledAt: visitedAt,
            visitStatus: VisitStatus.COMPLETED,
            isCompleted: true,
          });
          visit = await manager.save(Visit, visit);
        } else if (
          visit.visitStatus !== VisitStatus.COMPLETED ||
          !visit.isCompleted
        ) {
          // A collection import always supplies completed collection data for
          // the visit it targets — a pre-existing visit (e.g. an UPCOMING one
          // created by the mobile app) must be promoted, or it stays stuck as
          // "Pending" in the team-member-progress stats despite having samples.
          visit.visitStatus = VisitStatus.COMPLETED;
          visit.isCompleted = true;
          visit = await manager.save(Visit, visit);
        }

        const animalMetadata = await this.createAnimalMetadata(
          manager,
          row,
          visit,
          site,
        );

        const sample = manager.create(Sample, {
          project: { id: projectId } as any,
          site,
          team: visit.team,
          visit,
          animalMetadata,
          barcode: row['instituteSampleId'],
          sampleType: sampleType as any,
          diseases,
          collectedBy: collector,
          collectedAt: visitedAt,
          collectionTime: visitedAt,
          habitat: row['habitat'] ?? null,
          quantity: row['sampleQuantity']
            ? Number(row['sampleQuantity'])
            : null,
          unit: row['unit'] ?? null,
          comment: row['remarks'] ?? null,
        });
        await manager.save(Sample, sample);
        imported += 1;
      }

      await queryRunner.commitTransaction();
      return imported;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.rethrowAsFriendlyError(error);
    } finally {
      await queryRunner.release();
    }
  }

  async persistLabRows(
    rows: Record<string, any>[],
    diseaseGroup: DiseaseGroup,
    projectId: string,
  ): Promise<number> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const manager = queryRunner.manager;
      // Validation reads outside this transaction, and lab_tests can't carry
      // a unique (sample, disease) index since Retest legitimately adds a
      // second result — so lab imports into a project are serialized here,
      // and the duplicate check is repeated below under the lock.
      await manager.query('SELECT pg_advisory_xact_lock(hashtext($1))', [
        `lab-import:${projectId}`,
      ]);
      const testedByCache = new Map<string, User>();
      let imported = 0;

      for (const row of rows) {
        const sample = await manager.findOne(Sample, {
          where: {
            project: { id: projectId },
            barcode: row['instituteSampleId'],
          },
          relations: ['visit', 'site', 'team'],
        });
        if (!sample) {
          // Guarded against by ImportValidationService, but re-checked here
          // since persistence runs after the validation pass reads a snapshot.
          throw new Error(
            `No collection sample found for instituteSampleId "${row['instituteSampleId']}"`,
          );
        }

        // A row can name more than one disease (e.g. "FMD & LSD") when the
        // same result applies to both — create one LabTest per disease.
        const diseaseShortNames = parseDiseaseList(row['disease']);
        const diseases = await manager.find(Disease, {
          where: diseaseShortNames.map((shortName) => ({ shortName })),
        });
        const testedBy = await this.resolveOrCreateTestedByName(
          manager,
          testedByCache,
          sample.team,
          projectId,
          row['testedBy'],
        );

        const details = { ...row };
        delete details.instituteSampleId;
        delete details.disease;
        delete details.sampleType;

        const suspectedPositives = [...(sample.visit.suspectedPositives ?? [])];

        for (const disease of diseases) {
          const sameTest = {
            sample: { id: sample.id },
            disease: { id: disease.id },
            status: StatusType.ACTIVE,
          };

          // Also sees LabTests inserted earlier in this same transaction.
          // Same rule as validation: only a final result blocks the row.
          const alreadyTested = await manager.exists(LabTest, {
            where: { ...sameTest, testResult: In(FINAL_TEST_RESULTS) },
          });
          if (alreadyTested) {
            throw new ConflictException(
              `Lab result for ${disease.shortName} already exists for instituteSampleId "${row['instituteSampleId']}" (another upload may have just imported it). Nothing was imported; re-upload to see the full list of issues.`,
            );
          }

          const isSuspectedPositive =
            String(row['testResult']).toLowerCase() === 'positive';
          const testResult = (row['testResult'] as string)?.toLowerCase();
          const resultDate = row['resultDate']
            ? new Date(row['resultDate'])
            : null;

          // A test still open for this sample and disease (imported as
          // 'Pending', or saved with no result) is the one this row reports,
          // so it is completed in place rather than left next to a new one.
          // Newest first, in case earlier imports left more than one.
          const openLabTest = await manager.findOne(LabTest, {
            where: [
              { ...sameTest, testResult: IsNull() },
              { ...sameTest, testResult: TestResultType.PENDING },
            ],
            order: { createdAt: 'DESC', id: 'DESC' },
          });

          if (openLabTest) {
            // Blank cells keep what the open test already had.
            await manager.save(LabTest, {
              ...openLabTest,
              testResult: testResult as TestResultType,
              ctValue: row['ctValue'] ?? openLabTest.ctValue ?? null,
              viralLoad: row['viralLoad'] ?? openLabTest.viralLoad ?? null,
              resultDate: resultDate ?? openLabTest.resultDate ?? null,
              testedAt: resultDate ?? openLabTest.testedAt ?? null,
              testedBy: testedBy as any,
              details: { ...(openLabTest.details ?? {}), ...details },
            });
          } else {
            const labTest = manager.create(LabTest, {
              project: { id: projectId } as any,
              sample,
              visit: sample.visit,
              team: sample.team,
              site: sample.site,
              disease: disease as any,
              testResult: testResult as any,
              ctValue: row['ctValue'] ?? null,
              viralLoad: row['viralLoad'] ?? null,
              resultDate,
              testedAt: resultDate,
              testedBy: testedBy as any,
              details,
            });
            await manager.save(LabTest, labTest);
          }

          const existingEntry = suspectedPositives.find(
            (entry) => entry.disease?.id === disease.id,
          );
          if (existingEntry) {
            // Completing an open test reports a sample already counted here.
            if (!openLabTest) existingEntry.sampleCount += 1;
            existingEntry.isSuspectedPositive =
              existingEntry.isSuspectedPositive || isSuspectedPositive;
          } else {
            suspectedPositives.push({
              disease,
              sampleCount: 1,
              isSuspectedPositive,
            });
          }
        }

        sample.visit.suspectedPositives = suspectedPositives;
        await manager.save(Visit, sample.visit);

        if (row['sampleReceivedDate']) {
          sample.receivedAt = new Date(row['sampleReceivedDate']);
        }
        sample.sampleStatus = SampleStatus.TEST_REPORT_GENERATED;
        sample.testedAt = row['resultDate']
          ? new Date(row['resultDate'])
          : new Date();
        sample.testedBy = testedBy as any;
        sample.reportGeneratedAt = sample.testedAt;
        sample.reportGeneratedBy = testedBy as any;
        await manager.save(Sample, sample);

        imported += 1;
      }

      await queryRunner.commitTransaction();
      return imported;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.rethrowAsFriendlyError(error);
    } finally {
      await queryRunner.release();
    }
  }

  // Postgres unique-violation errors otherwise reach the client verbatim
  // (e.g. `Key (barcode, "projectId")=(...) already exists.`) via the global
  // exception filters, which just forward `error.detail`.
  private rethrowAsFriendlyError(error: unknown): never {
    if (error instanceof QueryFailedError && (error as any).code === '23505') {
      throw new ConflictException(
        'One or more sample IDs already exist in this project. Check for duplicate instituteSampleId values and re-upload.',
      );
    }
    throw error;
  }

  private splitName(name: string): { firstName: string; lastName: string } {
    const [firstName, ...rest] = name.trim().split(' ');
    return { firstName, lastName: rest.join(' ') };
  }

  private async findUserByFuzzyName(
    manager: DataSource['manager'],
    name: string,
  ): Promise<User | null> {
    const { firstName, lastName } = this.splitName(name);
    return manager.findOne(User, {
      where: [
        {
          firstName: ILike(`%${firstName}%`),
          lastName: ILike(`%${lastName}%`),
        },
        { firstName: ILike(`%${name}%`) },
      ],
    });
  }

  private async createUserWithRole(
    manager: DataSource['manager'],
    team: Team,
    projectId: string,
    roleType: RoleType,
    name: string,
    email?: string,
  ): Promise<User> {
    const { firstName, lastName } = this.splitName(name);
    const role = await this.findRole(manager, roleType);
    const user = await manager.save(
      User,
      manager.create(User, {
        firstName,
        lastName,
        email: email ?? null,
        team,
      }),
    );
    await manager.save(
      UserRole,
      manager.create(UserRole, {
        user,
        role,
        team: team.id,
        project: projectId,
      }),
    );
    return user;
  }

  // A collector must be identity-verified via email: an existing account is
  // reused if the email matches, otherwise a new Collector account is
  // provisioned so the row always attributes to a real user. New accounts
  // are seeded onto the project's default (oldest) team; resolveCollectorTeam
  // is the source of truth for which team a row's data actually gets scoped
  // to, since an existing user may already belong to a different team.
  private async resolveOrCreateCollectorByEmail(
    manager: DataSource['manager'],
    cache: Map<string, User>,
    projectTeams: Team[],
    projectId: string,
    email: string,
    name: string,
  ): Promise<User> {
    const cacheKey = email.trim().toLowerCase();
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    let user = await manager.findOne(User, {
      where: { email: ILike(email.trim()) },
    });
    if (!user) {
      user = await this.createUserWithRole(
        manager,
        projectTeams[0],
        projectId,
        RoleType.COLLECTOR,
        name,
        email.trim(),
      );
    }
    cache.set(cacheKey, user);
    return user;
  }

  // team-member-progress groups visits by (team, site), keyed off each
  // member's own UserRole.team for this project — so a row's Visit/Sample
  // must be stamped with the collector's own team, not an arbitrary one.
  // Onboards the collector onto the project's default team if they aren't
  // already a member of any of its teams.
  private async resolveCollectorTeam(
    manager: DataSource['manager'],
    cache: Map<string, Team>,
    projectTeams: Team[],
    projectId: string,
    collector: User,
  ): Promise<Team> {
    const cached = cache.get(collector.id);
    if (cached) return cached;

    const projectTeamIds = projectTeams.map((projectTeam) => projectTeam.id);
    const existingRole = await manager.findOne(UserRole, {
      where: {
        user: { id: collector.id },
        project: projectId,
        team: In(projectTeamIds),
      },
    });
    const matchedTeam = existingRole
      ? projectTeams.find((projectTeam) => projectTeam.id === existingRole.team)
      : undefined;

    let team = matchedTeam;
    if (!team) {
      team = projectTeams[0];
      await manager.save(
        UserRole,
        manager.create(UserRole, {
          user: collector,
          role: await this.findRole(manager, RoleType.COLLECTOR),
          team: team.id,
          project: projectId,
        }),
      );
    }
    cache.set(collector.id, team);
    return team;
  }

  private async findRole(
    manager: DataSource['manager'],
    roleType: RoleType,
  ): Promise<Role> {
    const role = await manager.findOne(Role, { where: { name: roleType } });
    if (!role) {
      throw new Error(`Role "${roleType}" is not configured`);
    }
    return role;
  }

  // testedBy is name-only (no email on the Lab template): reuse a fuzzy name
  // match when one exists, otherwise provision a new Lab Technician account
  // so the field is never silently left blank.
  private async resolveOrCreateTestedByName(
    manager: DataSource['manager'],
    cache: Map<string, User>,
    team: Team,
    projectId: string,
    name: string,
  ): Promise<User> {
    const cacheKey = name.trim().toLowerCase();
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    let user = await this.findUserByFuzzyName(manager, name);
    if (!user) {
      user = await this.createUserWithRole(
        manager,
        team,
        projectId,
        RoleType.LAB_MEMBER,
        name,
      );
    }
    cache.set(cacheKey, user);
    return user;
  }

  private async createImportLocation(
    manager: DataSource['manager'],
    row: Record<string, any>,
  ): Promise<Location | null> {
    const state = row['state']
      ? await manager.findOne(Region, {
          where: {
            name: ILike(row['state']),
            regionType: RegionType.STATE,
          },
        })
      : null;
    const district = row['district']
      ? await manager.findOne(Region, {
          where: {
            name: ILike(row['district']),
            regionType: RegionType.DISTRICT,
            ...(state ? { parentRegion: { id: state.id } } : {}),
          },
        })
      : null;
    const region = district ?? state;
    if (!region && !row['latitude'] && !row['longitude']) return null;

    return manager.save(
      Location,
      manager.create(Location, {
        region: region ?? null,
        coordinates:
          row['latitude'] && row['longitude']
            ? {
                type: 'Point',
                coordinates: [
                  Number(row['longitude']),
                  Number(row['latitude']),
                ],
              }
            : null,
      }),
    );
  }

  private async createAnimalMetadata(
    manager: DataSource['manager'],
    row: Record<string, any>,
    visit: Visit,
    site: Site,
  ): Promise<AnimalMetadata | null> {
    if (row['sampleCategory'] !== 'Clinical') return null;

    const animalFields = [
      'animalIdentifier',
      'birdId',
      'species',
      'breed',
      'ageYears',
      'ageMonths',
      'gender',
      'vaccinationStatus',
      'diseaseHistory',
      'feverObserved',
      'firstNoticedDate',
      'vectors',
      'averageMilkProductionPerDayWithinOneYear',
      'averageMilkProductionPerDayBeforeOneYear',
      'dropInFeedIntake',
      'dropInWaterIntake',
      'dropInEggProduction',
    ];
    if (
      !animalFields.some(
        (field) => row[field] !== undefined && row[field] !== '',
      )
    ) {
      return null;
    }

    const species = row['species']
      ? await manager.findOne(Species, {
          where: { name: ILike(row['species']) },
        })
      : null;
    const toNumber = (value: unknown) =>
      value === undefined || value === '' ? null : Number(value);
    const toBoolean = (value: unknown) =>
      String(value ?? '').toLowerCase() === 'yes' || value === true;
    const toList = (value: unknown) =>
      value
        ? String(value)
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
        : null;

    return manager.save(
      AnimalMetadata,
      manager.create(AnimalMetadata, {
        visit,
        visitId: visit.id,
        site,
        siteId: site.id,
        animalTagId: row['animalIdentifier'] ?? null,
        birdId: row['birdId'] ?? null,
        species: species ?? null,
        breed: row['breed'] ?? null,
        ageYears: toNumber(row['ageYears']),
        ageMonths: toNumber(row['ageMonths']),
        gender: row['gender'] ?? null,
        vaccinationStage: row['vaccinationStatus'] ?? null,
        diseaseHistory: toList(row['diseaseHistory']),
        averageMilkProductionPerDayWithinOneYear: toNumber(
          row['averageMilkProductionPerDayWithinOneYear'],
        ),
        averageMilkProductionPerDayBeforeOneYear: toNumber(
          row['averageMilkProductionPerDayBeforeOneYear'],
        ),
        feverObserved: toBoolean(row['feverObserved']),
        firstNoticedDate: row['firstNoticedDate']
          ? new Date(row['firstNoticedDate'])
          : null,
        vectors: toList(row['vectors']),
        dropInFeedIntake: toBoolean(row['dropInFeedIntake']),
        dropInWaterIntake: toBoolean(row['dropInWaterIntake']),
        dropInEggProduction: toBoolean(row['dropInEggProduction']),
      }),
    );
  }
}
