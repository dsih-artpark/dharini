import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import {
  SequencingJob,
  JobStatus,
} from '../../../entities/sequencing-job.entity';
import { PipelineApiService } from './pipeline-api.service';
import { PipelineReconciliationService } from './pipeline-reconciliation.service';
import { RunResultService, TerminalRunResult } from './run-result.service';
import { RunRecord } from './pipeline-api.types';

const ONE_HOUR_MS = 60 * 60 * 1000;

function makeJob(overrides: Partial<SequencingJob> = {}): SequencingJob {
  return {
    id: 'job-1',
    submissionId: 'sub-1',
    apiResponse: null,
    apiStatus: null,
    externalJobId: null, // retired: the pipeline run id lives in runId
    status: JobStatus.SUBMITTED,
    errorMessage: null,
    runId: 'run-1',
    visualizationPath: null,
    snpsVcfData: null,
    annotatedVcfData: null,
    createdAt: new Date(Date.now() - 2 * ONE_HOUR_MS),
    updatedAt: new Date(),
    submission: undefined as any,
    ...overrides,
  } as SequencingJob;
}

function makeRunRecord(overrides: Partial<RunRecord> = {}): RunRecord {
  return {
    runId: 'run-1',
    externalId: 'ext-1',
    pipelineId: 'p',
    status: 'SUCCEEDED',
    raw: {},
    ...overrides,
  } as RunRecord;
}

describe('PipelineReconciliationService', () => {
  let service: PipelineReconciliationService;
  let jobRepo: { find: jest.Mock };
  let pipelineApi: { getRun: jest.Mock };
  let runResultService: { applyTerminalResult: jest.Mock };

  beforeEach(async () => {
    jobRepo = { find: jest.fn() };
    pipelineApi = { getRun: jest.fn() };
    runResultService = {
      applyTerminalResult: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PipelineReconciliationService,
        { provide: getRepositoryToken(SequencingJob), useValue: jobRepo },
        { provide: PipelineApiService, useValue: pipelineApi },
        { provide: RunResultService, useValue: runResultService },
        { provide: ConfigService, useValue: { get: () => undefined } },
      ],
    }).compile();

    service = module.get(PipelineReconciliationService);
  });

  it('leaves a run still RUNNING alone', async () => {
    jobRepo.find.mockResolvedValue([makeJob()]);
    pipelineApi.getRun.mockResolvedValue(makeRunRecord({ status: 'RUNNING' }));

    await service.reconcileStaleJobs();

    expect(runResultService.applyTerminalResult).not.toHaveBeenCalled();
  });

  it('leaves a run still QUEUED alone', async () => {
    jobRepo.find.mockResolvedValue([makeJob()]);
    pipelineApi.getRun.mockResolvedValue(makeRunRecord({ status: 'QUEUED' }));

    await service.reconcileStaleJobs();

    expect(runResultService.applyTerminalResult).not.toHaveBeenCalled();
  });

  it('applies a SUCCEEDED run exactly once', async () => {
    jobRepo.find.mockResolvedValue([makeJob()]);
    const run = makeRunRecord({
      status: 'SUCCEEDED',
      durationS: 42,
      metrics: { coverage: 30 },
    });
    pipelineApi.getRun.mockResolvedValue(run);

    await service.reconcileStaleJobs();

    expect(runResultService.applyTerminalResult).toHaveBeenCalledTimes(1);
    const applied: TerminalRunResult =
      runResultService.applyTerminalResult.mock.calls[0][0];
    expect(applied).toMatchObject({
      runId: 'run-1',
      externalId: 'ext-1',
      status: 'SUCCEEDED',
      durationS: 42,
      metrics: { coverage: 30 },
    });
  });

  it('applies a FAILED run exactly once, carrying the error', async () => {
    jobRepo.find.mockResolvedValue([makeJob()]);
    pipelineApi.getRun.mockResolvedValue(
      makeRunRecord({ status: 'FAILED', error: 'alignment step crashed' }),
    );

    await service.reconcileStaleJobs();

    expect(runResultService.applyTerminalResult).toHaveBeenCalledTimes(1);
    expect(runResultService.applyTerminalResult.mock.calls[0][0]).toMatchObject(
      {
        status: 'FAILED',
        error: 'alignment step crashed',
      },
    );
  });

  it('does not sweep a job younger than the 1-hour threshold', async () => {
    const youngJob = makeJob({
      id: 'job-young',
      runId: 'run-young',
      createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes old
    });
    jobRepo.find.mockResolvedValue([youngJob]);

    await service.reconcileStaleJobs();

    expect(pipelineApi.getRun).not.toHaveBeenCalled();
    expect(runResultService.applyTerminalResult).not.toHaveBeenCalled();
  });

  it('sweeps an old job but skips a young one in the same batch', async () => {
    const youngJob = makeJob({
      id: 'job-young',
      runId: 'run-young',
      createdAt: new Date(Date.now() - 5 * 60 * 1000),
    });
    const oldJob = makeJob({ id: 'job-old', runId: 'run-old' });
    jobRepo.find.mockResolvedValue([youngJob, oldJob]);
    pipelineApi.getRun.mockResolvedValue(
      makeRunRecord({ status: 'SUCCEEDED' }),
    );

    await service.reconcileStaleJobs();

    expect(pipelineApi.getRun).toHaveBeenCalledTimes(1);
    expect(pipelineApi.getRun).toHaveBeenCalledWith('run-old');
  });

  it('does not abort the sweep when one job fails transport, and still processes the rest', async () => {
    const failingJob = makeJob({ id: 'job-fail', runId: 'run-fail' });
    const okJob = makeJob({ id: 'job-ok', runId: 'run-ok' });
    jobRepo.find.mockResolvedValue([failingJob, okJob]);

    pipelineApi.getRun.mockImplementation(async (runId: string) => {
      if (runId === 'run-fail') {
        throw new Error('ECONNRESET');
      }
      return makeRunRecord({
        runId: 'run-ok',
        externalId: 'ext-ok',
        status: 'SUCCEEDED',
      });
    });

    await expect(service.reconcileStaleJobs()).resolves.not.toThrow();

    expect(runResultService.applyTerminalResult).toHaveBeenCalledTimes(1);
    expect(runResultService.applyTerminalResult.mock.calls[0][0]).toMatchObject(
      {
        runId: 'run-ok',
      },
    );
  });

  it('does nothing when there are no active jobs', async () => {
    jobRepo.find.mockResolvedValue([]);

    await service.reconcileStaleJobs();

    expect(pipelineApi.getRun).not.toHaveBeenCalled();
  });

  it('skips a job with no recorded pipeline run id', async () => {
    jobRepo.find.mockResolvedValue([makeJob({ runId: null })]);

    await service.reconcileStaleJobs();

    expect(pipelineApi.getRun).not.toHaveBeenCalled();
    expect(runResultService.applyTerminalResult).not.toHaveBeenCalled();
  });

  it('honours SEQUENCING_RECONCILE_AFTER_S so local runs reconcile without an hour wait', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PipelineReconciliationService,
        { provide: getRepositoryToken(SequencingJob), useValue: jobRepo },
        { provide: PipelineApiService, useValue: pipelineApi },
        { provide: RunResultService, useValue: runResultService },
        { provide: ConfigService, useValue: { get: () => '60' } },
      ],
    }).compile();
    const quickService = module.get<PipelineReconciliationService>(
      PipelineReconciliationService,
    );

    // Two minutes old: ignored under the 1-hour default, swept at 60s.
    const job = makeJob({ createdAt: new Date(Date.now() - 2 * 60 * 1000) });
    jobRepo.find.mockResolvedValue([job]);
    pipelineApi.getRun.mockResolvedValue(
      makeRunRecord({
        runId: 'run-1',
        externalId: 'ext-1',
        status: 'SUCCEEDED',
      }),
    );

    await quickService.reconcileStaleJobs();

    expect(runResultService.applyTerminalResult).toHaveBeenCalledTimes(1);
  });
});
