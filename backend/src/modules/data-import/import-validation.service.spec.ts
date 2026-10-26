import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { In } from 'typeorm';
import { Disease } from 'src/entities/disease.entity';
import { SampleType } from 'src/entities/sample-type.entity';
import { Sample } from 'src/entities/sample.entity';
import { LabTest } from 'src/entities/lab-test.entity';
import { StatusType } from 'src/common/enums/status.enum';
import { FINAL_TEST_RESULTS, RowError } from './data-import.types';
import { ImportValidationService } from './import-validation.service';

const PROJECT_ID = 'project-1';

type StoredSample = { id: string; barcode: string; collectedAt: Date };
type StoredLabTest = {
  sample: { id: string };
  disease: { shortName: string };
};

const fmdLsdLabRow = (row: number, overrides: Record<string, string> = {}) => ({
  __row: row,
  instituteSampleId: 'S-1',
  disease: 'FMD',
  sampleType: 'Blood',
  sampleReceivedDate: '2026-09-02',
  testResult: 'Positive',
  resultDate: '2026-09-03',
  testedBy: 'Lab Tech',
  ...overrides,
});

const aiLabRow = (row: number, overrides: Record<string, string> = {}) => ({
  __row: row,
  instituteSampleId: 'S-1',
  disease: 'AI',
  sampleType: 'Swab',
  sampleReceivedDate: '2026-09-02',
  virusIsolationPerformed: 'No',
  testResult: 'Negative',
  resultDate: '2026-09-03',
  testedBy: 'Lab Tech',
  ...overrides,
});

// Only the instituteSampleId business-rule errors; class-validator reports
// that field under its humanized "Sample ID" label instead.
const sampleIdErrors = (errors: RowError[]) =>
  errors.filter((error) => error.column === 'instituteSampleId');

describe('ImportValidationService duplicate checks', () => {
  let service: ImportValidationService;
  let samples: StoredSample[];
  let labTests: StoredLabTest[];
  let sampleRepository: { find: jest.Mock };
  let labTestRepository: { find: jest.Mock };

  beforeEach(async () => {
    samples = [
      { id: 'sample-1', barcode: 'S-1', collectedAt: new Date('2026-09-01') },
      { id: 'sample-2', barcode: 'S-2', collectedAt: new Date('2026-09-01') },
    ];
    labTests = [];

    sampleRepository = {
      find: jest.fn(async ({ where }) =>
        samples.filter((sample) =>
          where.barcode.value.includes(sample.barcode),
        ),
      ),
    };
    labTestRepository = {
      find: jest.fn(async ({ where }) =>
        labTests.filter((labTest) =>
          where.sample.id.value.includes(labTest.sample.id),
        ),
      ),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImportValidationService,
        {
          provide: getRepositoryToken(Disease),
          useValue: {
            findOne: jest.fn(async ({ where }) => ({
              shortName: where.shortName,
            })),
          },
        },
        {
          provide: getRepositoryToken(SampleType),
          useValue: { findOne: jest.fn() },
        },
        { provide: getRepositoryToken(Sample), useValue: sampleRepository },
        { provide: getRepositoryToken(LabTest), useValue: labTestRepository },
      ],
    }).compile();

    service = module.get(ImportValidationService);
  });

  describe('lab rows', () => {
    it('rejects the same sample and disease twice in one file', async () => {
      const result = await service.validateLabRows(
        [fmdLsdLabRow(3), fmdLsdLabRow(4)],
        'FMD_LSD',
        PROJECT_ID,
      );

      expect(result.isValid).toBe(false);
      expect(result.errors).toEqual([
        {
          row: 4,
          column: 'instituteSampleId',
          message:
            'Duplicate FMD lab result for instituteSampleId "S-1" in this file (also on row 3)',
        },
      ]);
    });

    it('accepts separate FMD and LSD rows for the same sample', async () => {
      const result = await service.validateLabRows(
        [
          fmdLsdLabRow(3, { disease: 'FMD', testResult: 'Positive' }),
          fmdLsdLabRow(4, { disease: 'LSD', testResult: 'Negative' }),
        ],
        'FMD_LSD',
        PROJECT_ID,
      );

      expect(result.errors).toEqual([]);
      expect(result.isValid).toBe(true);
    });

    it('treats "FMD & LSD" as both diseases when looking for duplicates', async () => {
      const result = await service.validateLabRows(
        [
          fmdLsdLabRow(3, { disease: 'FMD & LSD' }),
          fmdLsdLabRow(4, { disease: 'FMD' }),
        ],
        'FMD_LSD',
        PROJECT_ID,
      );

      expect(sampleIdErrors(result.errors)).toEqual([
        expect.objectContaining({
          row: 4,
          message: expect.stringContaining('Duplicate FMD lab result'),
        }),
      ]);
    });

    it('does not treat the same disease on different samples as a duplicate', async () => {
      const result = await service.validateLabRows(
        [
          fmdLsdLabRow(3, { instituteSampleId: 'S-1' }),
          fmdLsdLabRow(4, { instituteSampleId: 'S-2' }),
        ],
        'FMD_LSD',
        PROJECT_ID,
      );

      expect(result.isValid).toBe(true);
    });

    it('rejects a disease that already has a lab result and points to Retest', async () => {
      labTests = [
        { sample: { id: 'sample-1' }, disease: { shortName: 'FMD' } },
      ];

      const result = await service.validateLabRows(
        [fmdLsdLabRow(3, { disease: 'FMD' })],
        'FMD_LSD',
        PROJECT_ID,
      );

      expect(result.errors).toEqual([
        {
          row: 3,
          column: 'instituteSampleId',
          message:
            'Lab result for FMD already exists for instituteSampleId "S-1". To record another result, use Retest on the Lab page.',
        },
      ]);
    });

    it('accepts a disease that has no lab result yet on an already-tested sample', async () => {
      labTests = [
        { sample: { id: 'sample-1' }, disease: { shortName: 'FMD' } },
      ];

      const result = await service.validateLabRows(
        [fmdLsdLabRow(3, { disease: 'LSD' })],
        'FMD_LSD',
        PROJECT_ID,
      );

      expect(result.isValid).toBe(true);
    });

    it('lists every already-tested disease of a multi-disease row in one error', async () => {
      labTests = [
        { sample: { id: 'sample-1' }, disease: { shortName: 'FMD' } },
        { sample: { id: 'sample-1' }, disease: { shortName: 'LSD' } },
      ];

      const result = await service.validateLabRows(
        [fmdLsdLabRow(3, { disease: 'FMD & LSD' })],
        'FMD_LSD',
        PROJECT_ID,
      );

      expect(sampleIdErrors(result.errors)).toEqual([
        expect.objectContaining({
          row: 3,
          message: expect.stringContaining(
            'Lab result for FMD & LSD already exists',
          ),
        }),
      ]);
    });

    it('applies the same checks to the AI template', async () => {
      labTests = [{ sample: { id: 'sample-2' }, disease: { shortName: 'AI' } }];

      const result = await service.validateLabRows(
        [
          aiLabRow(3, { instituteSampleId: 'S-1' }),
          aiLabRow(4, { instituteSampleId: 'S-1' }),
          aiLabRow(5, { instituteSampleId: 'S-2' }),
        ],
        'AI',
        PROJECT_ID,
      );

      expect(result.errors).toEqual([
        expect.objectContaining({
          row: 4,
          message: expect.stringContaining('Duplicate AI lab result'),
        }),
        expect.objectContaining({
          row: 5,
          message: expect.stringContaining('Lab result for AI already exists'),
        }),
      ]);
    });

    it('still reports rows with no matching collection sample', async () => {
      const result = await service.validateLabRows(
        [fmdLsdLabRow(3, { instituteSampleId: 'UNKNOWN' })],
        'FMD_LSD',
        PROJECT_ID,
      );

      expect(sampleIdErrors(result.errors)).toEqual([
        expect.objectContaining({
          row: 3,
          message: expect.stringContaining('No matching collection data found'),
        }),
      ]);
      expect(labTestRepository.find).not.toHaveBeenCalled();
    });

    it('looks up samples and existing results once per file, not per row', async () => {
      await service.validateLabRows(
        [
          fmdLsdLabRow(3, { instituteSampleId: 'S-1' }),
          fmdLsdLabRow(4, { instituteSampleId: 'S-2' }),
          fmdLsdLabRow(5, { instituteSampleId: 'S-1', disease: 'LSD' }),
        ],
        'FMD_LSD',
        PROJECT_ID,
      );

      expect(sampleRepository.find).toHaveBeenCalledTimes(1);
      expect(
        sampleRepository.find.mock.calls[0][0].where.barcode.value,
      ).toEqual(['S-1', 'S-2']);
      expect(labTestRepository.find).toHaveBeenCalledTimes(1);
      expect(labTestRepository.find.mock.calls[0][0].where).toEqual(
        expect.objectContaining({
          status: StatusType.ACTIVE,
          testResult: In(FINAL_TEST_RESULTS),
        }),
      );
    });
  });

  describe('collection rows', () => {
    const collectionRow = (row: number, instituteSampleId: string) => ({
      __row: row,
      instituteSampleId,
      disease: 'FMD',
    });

    it('rejects a sample ID that already exists in the project, per row', async () => {
      const result = await service.validateCollectionRows(
        [collectionRow(3, 'S-1'), collectionRow(4, 'NEW-1')],
        'FMD_LSD',
        PROJECT_ID,
      );

      expect(sampleIdErrors(result.errors)).toEqual([
        {
          row: 3,
          column: 'instituteSampleId',
          message: 'instituteSampleId "S-1" already exists in this project',
        },
      ]);
    });

    it('still rejects a sample ID repeated within the file', async () => {
      const result = await service.validateCollectionRows(
        [collectionRow(3, 'NEW-1'), collectionRow(4, 'NEW-1')],
        'FMD_LSD',
        PROJECT_ID,
      );

      expect(sampleIdErrors(result.errors)).toEqual([
        expect.objectContaining({
          row: 4,
          message: 'Duplicate instituteSampleId "NEW-1" in this file',
        }),
      ]);
    });
  });
});
