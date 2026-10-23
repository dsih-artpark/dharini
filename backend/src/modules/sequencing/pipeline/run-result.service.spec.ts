import { BadRequestException, NotFoundException } from '@nestjs/common';

import {
  JobStatus,
  SequencingJob,
} from '../../../entities/sequencing-job.entity';
import { PipelineVariant } from '../../../entities/pipeline-variant.entity';
import {
  SequencingSubmission,
  SubmissionStatus,
} from '../../../entities/sequencing-submission.entity';
import { RunResultService, TerminalRunResult } from './run-result.service';

function makeJob(overrides: Partial<SequencingJob> = {}): SequencingJob {
  return {
    id: 'job-1',
    submissionId: 'sub-1',
    apiResponse: null,
    apiStatus: null,
    externalJobId: null,
    status: JobStatus.SUBMITTED,
    errorMessage: null,
    runId: null,
    visualizationPath: null,
    snpsVcfData: null,
    annotatedVcfData: null,
    externalId: 'ext-1',
    pipelineId: 'pl-1',
    pipelineVersion: '1.0.0',
    stage: null,
    metrics: null,
    stages: null,
    artifacts: null,
    artifactsUploaded: null,
    artifactsError: null,
    finishedAt: null,
    durationS: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    submission: undefined as any,
    ...overrides,
  } as SequencingJob;
}

function makeResult(
  overrides: Partial<TerminalRunResult> = {},
): TerminalRunResult {
  return {
    runId: 'run-1',
    externalId: 'ext-1',
    status: 'SUCCEEDED',
    durationS: 120,
    metrics: { variant_count: 2 },
    stages: [
      { name: 'align', status: 'SUCCEEDED' },
      { name: 'call', status: 'SUCCEEDED' },
    ],
    variants: [
      {
        chrom: 'chr1',
        pos: 100,
        ref: 'A',
        alt: 'T',
        gene: 'BRCA1',
        hgvs_p: 'p.Val1Leu',
        depth: 30,
        allele_freq: 0.5,
      },
    ],
    artifacts: [{ kind: 'vcf', bucket: 'dharini', key: 'runs/run-1/out.vcf' }],
    artifactsUploaded: true,
    artifactsError: null,
    ...overrides,
  };
}

describe('RunResultService', () => {
  let manager: {
    findOne: jest.Mock;
    save: jest.Mock;
    delete: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
  };
  let dataSource: { transaction: jest.Mock };
  let service: RunResultService;

  beforeEach(() => {
    manager = {
      findOne: jest.fn(),
      save: jest.fn(async (_entity, value) => value),
      delete: jest.fn(),
      update: jest.fn(),
      create: jest.fn((_entity, plain) => plain),
    };
    dataSource = {
      transaction: jest.fn(async (cb) => cb(manager)),
    };
    service = new RunResultService(dataSource as any);
  });

  it('applies a SUCCEEDED run: maps to completed and persists metrics, stages, artifacts', async () => {
    const job = makeJob();
    manager.findOne.mockResolvedValue(job);

    await service.applyTerminalResult(makeResult());

    expect(manager.save).toHaveBeenCalledWith(
      SequencingJob,
      expect.objectContaining({
        status: JobStatus.COMPLETED,
        runId: 'run-1',
        durationS: 120,
        metrics: { variant_count: 2 },
        stages: expect.any(Array),
        artifacts: expect.any(Array),
        artifactsUploaded: true,
        stage: 'call', // last stage in the stages array
        finishedAt: expect.any(Date),
      }),
    );
  });

  it('persists variants as rows, mapped from the wire snake_case shape', async () => {
    manager.findOne.mockResolvedValue(makeJob());

    await service.applyTerminalResult(makeResult());

    expect(manager.delete).toHaveBeenCalledWith(PipelineVariant, {
      jobId: 'job-1',
    });
    expect(manager.save).toHaveBeenCalledWith(
      PipelineVariant,
      expect.arrayContaining([
        expect.objectContaining({
          jobId: 'job-1',
          chrom: 'chr1',
          pos: 100,
          ref: 'A',
          alt: 'T',
          gene: 'BRCA1',
          hgvsP: 'p.Val1Leu',
          depth: 30,
          alleleFreq: 0.5,
        }),
      ]),
    );
  });

  it('maps FAILED to failed and records the error', async () => {
    manager.findOne.mockResolvedValue(makeJob());

    await service.applyTerminalResult(
      makeResult({
        status: 'FAILED',
        error: 'worker OOM',
        metrics: null,
        variants: null,
        stages: null,
      }),
    );

    expect(manager.save).toHaveBeenCalledWith(
      SequencingJob,
      expect.objectContaining({
        status: JobStatus.FAILED,
        errorMessage: 'worker OOM',
      }),
    );
  });

  it('maps CANCELLED to cancelled', async () => {
    manager.findOne.mockResolvedValue(makeJob());

    await service.applyTerminalResult(
      makeResult({ status: 'CANCELLED', variants: null }),
    );

    expect(manager.save).toHaveBeenCalledWith(
      SequencingJob,
      expect.objectContaining({ status: JobStatus.CANCELLED }),
    );
  });

  it('persists metrics and variants even when artifacts_uploaded is false, and does not mark the run failed', async () => {
    manager.findOne.mockResolvedValue(makeJob());

    await service.applyTerminalResult(
      makeResult({
        artifactsUploaded: false,
        artifactsError: 'worker unreachable',
      }),
    );

    expect(manager.save).toHaveBeenCalledWith(
      SequencingJob,
      expect.objectContaining({
        status: JobStatus.COMPLETED,
        artifactsUploaded: false,
        artifactsError: 'worker unreachable',
        metrics: { variant_count: 2 },
      }),
    );
    expect(manager.save).toHaveBeenCalledWith(
      PipelineVariant,
      expect.any(Array),
    );
  });

  it('is idempotent: a repeated terminal result for a job already in that status writes nothing', async () => {
    manager.findOne.mockResolvedValue(makeJob({ status: JobStatus.COMPLETED }));

    await service.applyTerminalResult(makeResult({ status: 'SUCCEEDED' }));

    expect(manager.save).not.toHaveBeenCalled();
    expect(manager.delete).not.toHaveBeenCalled();
  });

  it('throws NotFoundException when no job matches the externalId', async () => {
    manager.findOne.mockResolvedValue(null);

    await expect(service.applyTerminalResult(makeResult())).rejects.toThrow(
      NotFoundException,
    );
    expect(manager.save).not.toHaveBeenCalled();
  });

  it('throws BadRequestException when externalId is missing', async () => {
    await expect(
      service.applyTerminalResult(makeResult({ externalId: '' })),
    ).rejects.toThrow(BadRequestException);
    expect(dataSource.transaction).not.toHaveBeenCalled();
  });

  it('locks the job row for update within the transaction', async () => {
    manager.findOne.mockResolvedValue(makeJob());

    await service.applyTerminalResult(makeResult());

    expect(manager.findOne).toHaveBeenCalledWith(
      SequencingJob,
      expect.objectContaining({
        where: { externalId: 'ext-1' },
        lock: { mode: 'pessimistic_write' },
      }),
    );
  });

  it('advances the parent submission so a finished run stops reporting as in progress', async () => {
    manager.findOne.mockResolvedValue({
      id: 'job-1',
      submissionId: 'sub-1',
      externalId: 'ext-1',
      status: JobStatus.SUBMITTED,
    });

    await service.applyTerminalResult({
      runId: 'run-1',
      externalId: 'ext-1',
      status: 'SUCCEEDED',
    });

    expect(manager.update).toHaveBeenCalledWith(
      SequencingSubmission,
      { id: 'sub-1' },
      { status: SubmissionStatus.COMPLETED },
    );
  });

  it('leaves the submission alone when the job is already in its target status', async () => {
    manager.findOne.mockResolvedValue({
      id: 'job-1',
      submissionId: 'sub-1',
      externalId: 'ext-1',
      status: JobStatus.COMPLETED,
    });

    await service.applyTerminalResult({
      runId: 'run-1',
      externalId: 'ext-1',
      status: 'SUCCEEDED',
    });

    expect(manager.update).not.toHaveBeenCalled();
  });
});
