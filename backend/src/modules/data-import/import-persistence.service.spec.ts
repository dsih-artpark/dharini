import { BadRequestException, ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { In, IsNull } from 'typeorm';
import { RegionType } from 'src/common/enums/region.enum';
import { StatusType } from 'src/common/enums/status.enum';
import { TestResultType } from 'src/common/enums/test-result.enum';
import { Disease } from 'src/entities/disease.entity';
import { LabTest } from 'src/entities/lab-test.entity';
import { Location } from 'src/entities/location.entity';
import { Region } from 'src/entities/region.entity';
import { Sample } from 'src/entities/sample.entity';
import { SampleType } from 'src/entities/sample-type.entity';
import { Site } from 'src/entities/site.entity';
import { Team } from 'src/entities/team.entity';
import { User } from 'src/entities/user.entity';
import { UserRole } from 'src/entities/user-role.entity';
import { Visit } from 'src/entities/visit.entity';
import { FINAL_TEST_RESULTS } from './data-import.types';
import { ImportPersistenceService } from './import-persistence.service';

const PROJECT_ID = 'project-1';

const labRow = {
  __row: 3,
  instituteSampleId: 'S-1',
  disease: 'FMD',
  sampleType: 'Blood',
  sampleReceivedDate: '2026-09-02',
  testResult: 'Positive',
  resultDate: '2026-09-03',
  testedBy: 'Lab Tech',
};

describe('ImportPersistenceService.persistLabRows', () => {
  let service: ImportPersistenceService;
  let manager: Record<string, jest.Mock>;
  let queryRunner: Record<string, jest.Mock | typeof manager>;

  beforeEach(async () => {
    manager = {
      query: jest.fn(),
      findOne: jest.fn(async (entity) => {
        if (entity === Sample) {
          return {
            id: 'sample-1',
            visit: { id: 'visit-1', suspectedPositives: [] },
            site: { id: 'site-1' },
            team: { id: 'team-1' },
          };
        }
        // No open LabTest unless a test sets one up.
        if (entity === LabTest) return null;
        return { id: 'user-1', firstName: 'Lab', lastName: 'Tech' };
      }),
      find: jest.fn(async (entity) =>
        entity === Disease ? [{ id: 'disease-fmd', shortName: 'FMD' }] : [],
      ),
      exists: jest.fn(async () => false),
      create: jest.fn((_entity, data) => data),
      save: jest.fn(async (_entity, data) => data),
    };
    queryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImportPersistenceService,
        {
          provide: getDataSourceToken(),
          useValue: { createQueryRunner: () => queryRunner },
        },
      ],
    }).compile();

    service = module.get(ImportPersistenceService);
  });

  it('serializes lab imports per project before reading any sample', async () => {
    await expect(
      service.persistLabRows([labRow], 'FMD_LSD', PROJECT_ID),
    ).resolves.toBe(1);

    expect(manager.query).toHaveBeenCalledWith(
      'SELECT pg_advisory_xact_lock(hashtext($1))',
      [`lab-import:${PROJECT_ID}`],
    );
    expect(manager.query.mock.invocationCallOrder[0]).toBeLessThan(
      manager.findOne.mock.invocationCallOrder[0],
    );
    expect(manager.exists).toHaveBeenCalledWith(LabTest, {
      where: expect.objectContaining({
        sample: { id: 'sample-1' },
        disease: { id: 'disease-fmd' },
        testResult: In(FINAL_TEST_RESULTS),
      }),
    });
    expect(queryRunner.commitTransaction).toHaveBeenCalled();
  });

  const savedLabTests = () =>
    manager.save.mock.calls
      .filter(([entity]) => entity === LabTest)
      .map(([, data]) => data);
  const savedVisit = () =>
    manager.save.mock.calls.find(([entity]) => entity === Visit)?.[1];

  it('creates a LabTest when the sample has no open test for the disease', async () => {
    await service.persistLabRows([labRow], 'FMD_LSD', PROJECT_ID);

    expect(manager.findOne).toHaveBeenCalledWith(LabTest, {
      where: [
        expect.objectContaining({
          sample: { id: 'sample-1' },
          disease: { id: 'disease-fmd' },
          status: StatusType.ACTIVE,
          testResult: IsNull(),
        }),
        expect.objectContaining({
          sample: { id: 'sample-1' },
          disease: { id: 'disease-fmd' },
          status: StatusType.ACTIVE,
          testResult: TestResultType.PENDING,
        }),
      ],
      order: { createdAt: 'DESC', id: 'DESC' },
    });
    expect(savedLabTests()).toEqual([
      expect.objectContaining({ testResult: 'positive' }),
    ]);
    expect(savedLabTests()[0].id).toBeUndefined();
    expect(savedVisit().suspectedPositives).toEqual([
      expect.objectContaining({ sampleCount: 1, isSuspectedPositive: true }),
    ]);
  });

  it('completes an open test in place instead of adding a second one', async () => {
    const openLabTest = {
      id: 'lab-test-open',
      testResult: TestResultType.PENDING,
      ctValue: '28.4',
      viralLoad: null,
      resultDate: null,
      testedAt: null,
      details: { labComment: 'awaiting confirmation', testResult: 'Pending' },
    };
    manager.findOne.mockImplementation(async (entity) => {
      if (entity === Sample) {
        return {
          id: 'sample-1',
          visit: {
            id: 'visit-1',
            // Counted when the open test was imported.
            suspectedPositives: [
              {
                disease: { id: 'disease-fmd' },
                sampleCount: 1,
                isSuspectedPositive: false,
              },
            ],
          },
          site: { id: 'site-1' },
          team: { id: 'team-1' },
        };
      }
      if (entity === LabTest) return openLabTest;
      return { id: 'user-1', firstName: 'Lab', lastName: 'Tech' };
    });

    await expect(
      service.persistLabRows([labRow], 'FMD_LSD', PROJECT_ID),
    ).resolves.toBe(1);

    expect(manager.create).not.toHaveBeenCalledWith(LabTest, expect.anything());
    expect(savedLabTests()).toEqual([
      expect.objectContaining({
        id: 'lab-test-open',
        testResult: 'positive',
        // Blank in the upload, so the open test's value is kept.
        ctValue: '28.4',
        resultDate: new Date('2026-09-03'),
        testedAt: new Date('2026-09-03'),
        testedBy: expect.objectContaining({ id: 'user-1' }),
        details: expect.objectContaining({
          labComment: 'awaiting confirmation',
          testResult: 'Positive',
        }),
      }),
    ]);
    expect(savedVisit().suspectedPositives).toEqual([
      expect.objectContaining({ sampleCount: 1, isSuspectedPositive: true }),
    ]);
    expect(queryRunner.commitTransaction).toHaveBeenCalled();
  });

  it('rolls back the whole file when a result appeared after validation', async () => {
    manager.exists.mockResolvedValue(true);

    await expect(
      service.persistLabRows([labRow], 'FMD_LSD', PROJECT_ID),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(manager.save).not.toHaveBeenCalledWith(LabTest, expect.anything());
    expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    expect(queryRunner.commitTransaction).not.toHaveBeenCalled();
    expect(queryRunner.release).toHaveBeenCalled();
  });
});

describe('ImportPersistenceService.persistCollectionRows location', () => {
  const BIHAR = {
    id: 'state-br',
    regionType: RegionType.STATE,
    name: 'Bihar',
    parentRegion: null,
  };
  const MAHARASHTRA = {
    id: 'state-mh',
    regionType: RegionType.STATE,
    name: 'Maharashtra',
    parentRegion: null,
  };
  // Same district name in two states.
  const AURANGABAD_BR = {
    id: 'district-aur-br',
    regionType: RegionType.DISTRICT,
    name: 'Aurangabad',
    parentRegion: BIHAR,
  };
  const AURANGABAD_MH = {
    id: 'district-aur-mh',
    regionType: RegionType.DISTRICT,
    name: 'Aurangabad',
    parentRegion: MAHARASHTRA,
  };
  const MASTER_REGIONS = [BIHAR, MAHARASHTRA, AURANGABAD_BR, AURANGABAD_MH];

  const collectionRow = (overrides: Record<string, string> = {}) => ({
    __row: 3,
    instituteSampleId: 'S-9',
    disease: 'FMD',
    sampleType: 'Blood',
    collectorEmail: 'collector@example.org',
    collectorName: 'Field Collector',
    siteName: 'New Farm',
    siteCategory: 'Dairy',
    state: 'maharashtra',
    district: ' Aurangabad ',
    visitOrCollectionDate: '2026-09-01',
    ...overrides,
  });

  let service: ImportPersistenceService;
  let manager: Record<string, jest.Mock>;
  let queryRunner: Record<string, jest.Mock | typeof manager>;

  beforeEach(async () => {
    const regionRepository = {
      find: jest.fn(async ({ where }) =>
        MASTER_REGIONS.filter(
          (region) =>
            region.regionType === where.regionType &&
            (!where.parentRegion ||
              where.parentRegion.id.value.includes(region.parentRegion?.id)),
        ),
      ),
    };
    manager = {
      getRepository: jest.fn((entity) =>
        entity === Region ? regionRepository : undefined,
      ),
      find: jest.fn(async (entity) => {
        if (entity === Team) return [{ id: 'team-1' }];
        if (entity === Disease)
          return [{ id: 'disease-fmd', shortName: 'FMD' }];
        return [];
      }),
      findOne: jest.fn(async (entity) => {
        if (entity === SampleType) return { id: 'sample-type-1' };
        if (entity === User) return { id: 'user-1' };
        if (entity === UserRole) return { team: 'team-1' };
        // New site, new visit.
        return null;
      }),
      create: jest.fn((_entity, data) => data),
      save: jest.fn(async (_entity, data) => data),
    };
    queryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImportPersistenceService,
        {
          provide: getDataSourceToken(),
          useValue: { createQueryRunner: () => queryRunner },
        },
      ],
    }).compile();

    service = module.get(ImportPersistenceService);
  });

  const savedOf = (entity: unknown) =>
    manager.save.mock.calls.find(([saved]) => saved === entity)?.[1];

  it("links a new site to the named district within the row's state", async () => {
    await expect(
      service.persistCollectionRows([collectionRow()], 'FMD_LSD', 'project-1'),
    ).resolves.toBe(1);

    expect(savedOf(Location).region).toBe(AURANGABAD_MH);
    expect(savedOf(Site).location.region).toBe(AURANGABAD_MH);
    expect(queryRunner.commitTransaction).toHaveBeenCalled();
  });

  it('rolls back the whole file instead of saving a site with no location', async () => {
    await expect(
      service.persistCollectionRows(
        [collectionRow({ district: 'Pune' })],
        'FMD_LSD',
        'project-1',
      ),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(manager.save).not.toHaveBeenCalledWith(Site, expect.anything());
    expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    expect(queryRunner.commitTransaction).not.toHaveBeenCalled();
  });
});
