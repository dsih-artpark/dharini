import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { In, IsNull } from 'typeorm';
import { StatusType } from 'src/common/enums/status.enum';
import { TestResultType } from 'src/common/enums/test-result.enum';
import { Disease } from 'src/entities/disease.entity';
import { LabTest } from 'src/entities/lab-test.entity';
import { Sample } from 'src/entities/sample.entity';
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
