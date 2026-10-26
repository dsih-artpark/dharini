import { BadRequestException, NotFoundException } from '@nestjs/common';

import { SequencingJobsService } from './sequencing-jobs.service';
import {
  SequencingSubmission,
  SourceType,
  SubmissionStatus,
} from '../../entities/sequencing-submission.entity';
import { SequencingJob, JobStatus } from '../../entities/sequencing-job.entity';
import { SubmitSequencingJobDto } from './dto/submit-sequencing-job.dto';
import {
  PipelineApiError,
  PipelineValidationError,
} from './pipeline/pipeline-api.types';

const USER_ID = '11111111-1111-4111-8111-111111111111';
const ACTING_USER = { id: USER_ID, roles: [] as any[] };
const OWNED_KEY = `uploads/${USER_ID}/22222222-2222-4222-8222-222222222222/reads.fastq.gz`;
const OTHER_USERS_KEY = `uploads/99999999-9999-4999-8999-999999999999/33333333-3333-4333-8333-333333333333/reads.fastq.gz`;

function labDto(
  overrides: Partial<SubmitSequencingJobDto> = {},
): SubmitSequencingJobDto {
  return {
    sourceType: SourceType.LAB,
    labTestId: '44444444-4444-4444-8444-444444444444',
    fileFormat: 'FASTA',
    libraryType: 'Single End',
    platform: 'Illumina',
    sequencingMethod: 'WGS',
    pipelineId: 'ont-lsdv',
    inputKey: OWNED_KEY,
    ...overrides,
  } as SubmitSequencingJobDto;
}

describe('SequencingJobsService.submitJob', () => {
  let submissionRepo: {
    create: jest.Mock;
    save: jest.Mock;
    createQueryBuilder: jest.Mock;
  };
  // Stands in for the MAX(seq number) lookup in generateSeqId.
  let seqIdQuery: {
    select: jest.Mock;
    where: jest.Mock;
    getRawOne: jest.Mock;
  };
  let jobRepo: { create: jest.Mock; save: jest.Mock; findOne: jest.Mock };
  let variantRepo: { find: jest.Mock };
  let labSamplesService: { findById: jest.Mock };
  let ncbiService: { fetchSummary: jest.Mock; downloadFastaContent: jest.Mock };
  let uploadsService: {
    artifactBucket: string;
    buildRunArtifactKey: jest.Mock;
    assertOwnedKey: jest.Mock;
    putServerObject: jest.Mock;
    presignArtifactDownload: jest.Mock;
  };
  let pipelineApi: {
    submitRun: jest.Mock;
    getRunProgress: jest.Mock;
    findPipelineSafe: jest.Mock;
  };
  let configService: { getOrThrow: jest.Mock };
  let projectRepo: { find: jest.Mock };
  let tenantScope: {
    forUser: jest.Mock;
    canReachProject: jest.Mock;
    assertCanReachProject: jest.Mock;
  };
  let service: SequencingJobsService;

  beforeEach(() => {
    seqIdQuery = {
      select: jest.fn(() => seqIdQuery),
      where: jest.fn(() => seqIdQuery),
      getRawOne: jest.fn(async () => ({ max: null })),
    };
    submissionRepo = {
      create: jest.fn((x) => ({ ...x }) as SequencingSubmission),
      save: jest.fn(
        async (x) => ({ id: 'sub-1', ...x }) as SequencingSubmission,
      ),
      createQueryBuilder: jest.fn(() => seqIdQuery),
    };
    jobRepo = {
      create: jest.fn((x) => ({ ...x }) as SequencingJob),
      save: jest.fn(async (x) => ({ id: 'job-1', ...x }) as SequencingJob),
      findOne: jest.fn(),
    };
    variantRepo = { find: jest.fn(async () => []) };
    labSamplesService = {
      findById: jest.fn(async () => ({
        labTestId: '44444444-4444-4444-8444-444444444444',
        barcode: 'BARCODE-1',
        siteName: 'Site A',
        diseaseName: 'LSDV',
      })),
    };
    ncbiService = {
      fetchSummary: jest.fn(async () => ({
        accession: 'NC_000001',
        title: 'Some virus',
        organism: 'Some organism',
        length: 100,
      })),
      downloadFastaContent: jest.fn(async () => '>seq\nACGT\n'),
    };
    uploadsService = {
      artifactBucket: 'dharini',
      buildRunArtifactKey: jest.fn(
        (runId: string, filename: string) =>
          `SDS004-ES_App_Data/genomic-sequencing/runs/${runId}/${filename}`,
      ),
      assertOwnedKey: jest.fn((userId: string, key: string) => {
        if (!key.startsWith(`uploads/${userId}/`)) {
          throw new BadRequestException('Unknown or unauthorised upload key');
        }
      }),
      putServerObject: jest.fn(async ({ userId, filename }) => ({
        key: `uploads/${userId}/55555555-5555-4555-8555-555555555555/${filename}`,
      })),
      presignArtifactDownload: jest.fn(
        async () => 'https://s3.example/presigned',
      ),
    };
    pipelineApi = {
      submitRun: jest.fn(async () => ({
        run: {
          runId: 'run-1',
          externalId: 'will-be-overwritten',
          pipelineId: 'ont-lsdv',
          pipelineVersion: '1.0.0',
          status: 'QUEUED',
          stages: [],
          queuePosition: 3,
          estimatedStartS: 90,
        },
        wasExisting: false,
      })),
      getRunProgress: jest.fn(),
      // Real behaviour never returns undefined — null means "no match /
      // catalog unavailable" (see PipelineApiService.findPipelineSafe).
      findPipelineSafe: jest.fn(async () => null),
    };
    projectRepo = { find: jest.fn(async () => []) };
    // Permissive by default: the ownership/derivation assertions in this suite
    // are about upload keys and pipeline calls, not tenancy. The tenancy
    // behaviour has its own tests below.
    tenantScope = {
      forUser: jest.fn(async () => ({
        scope: null,
        isSystem: false,
        projectIds: ['PHJOLL'],
        teamIds: [],
        workspaceIds: [],
      })),
      canReachProject: jest.fn(async () => true),
      assertCanReachProject: jest.fn(async () => undefined),
    };
    configService = {
      getOrThrow: jest.fn((key: string) =>
        key === 'PIPELINE_CALLBACK_URL'
          ? 'https://dharini.example/sequencing/pipeline/webhook'
          : undefined,
      ),
    };

    service = new SequencingJobsService(
      submissionRepo as any,
      jobRepo as any,
      variantRepo as any,
      projectRepo as any,
      tenantScope as any,
      labSamplesService as any,
      ncbiService as any,
      uploadsService as any,
      pipelineApi as any,
      configService as any,
    );
  });

  describe('upload key ownership', () => {
    it('rejects a submission whose inputKey was not minted for the caller, before touching the DB or the pipeline', async () => {
      await expect(
        service.submitJob(ACTING_USER, labDto({ inputKey: OTHER_USERS_KEY })),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(submissionRepo.save).not.toHaveBeenCalled();
      expect(jobRepo.save).not.toHaveBeenCalled();
      expect(pipelineApi.submitRun).not.toHaveBeenCalled();
    });

    it('rejects a submission whose extraInputKeys value was not minted for the caller', async () => {
      await expect(
        service.submitJob(
          USER_ID,
          labDto({ extraInputKeys: { primer_bed: OTHER_USERS_KEY } }),
        ),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(submissionRepo.save).not.toHaveBeenCalled();
      expect(jobRepo.save).not.toHaveBeenCalled();
      expect(pipelineApi.submitRun).not.toHaveBeenCalled();
    });

    it('accepts a submission whose inputKey was minted for the caller', async () => {
      const result = await service.submitJob(ACTING_USER, labDto());
      expect(result.status).toBe(JobStatus.SUBMITTED);
      expect(pipelineApi.submitRun).toHaveBeenCalledTimes(1);
    });
  });

  describe('seqId generation', () => {
    const year = new Date().getFullYear();

    it('starts the year at 001 when no submission carries this year yet', async () => {
      await service.submitJob(ACTING_USER, labDto());

      expect(submissionRepo.create.mock.calls[0][0].seqId).toBe(
        `SEQ-${year}-001`,
      );
    });

    it('continues from the highest number used this year, not the row count, so deleted rows cannot cause a reused ID', async () => {
      // 001 and 006–025 present, 002–005 deleted: 21 rows, highest 025.
      // count() + 1 would hand out 022, which is already taken.
      seqIdQuery.getRawOne.mockResolvedValue({ max: 25 });

      await service.submitJob(ACTING_USER, labDto());

      expect(submissionRepo.create.mock.calls[0][0].seqId).toBe(
        `SEQ-${year}-026`,
      );
    });

    it('looks only at IDs carrying the current year', async () => {
      await service.submitJob(ACTING_USER, labDto());

      const [, params] = seqIdQuery.where.mock.calls[0];
      expect(params.pattern).toBe(`^SEQ-${year}-[0-9]+$`);
    });
  });

  describe('externalId / job persistence ordering', () => {
    it('persists the job row with a non-null externalId before calling the pipeline, using that same externalId', async () => {
      let externalIdAtCallTime: string | undefined;
      let jobSavedBeforeCall = false;

      pipelineApi.submitRun.mockImplementation(async (payload) => {
        // At the moment the pipeline is called, the job row must already be
        // persisted (jobRepo.save already invoked) carrying this exact
        // externalId — otherwise a lost response leaves an orphaned run
        // the webhook can never correlate back to a job.
        jobSavedBeforeCall = jobRepo.save.mock.calls.length > 0;
        externalIdAtCallTime = payload.externalId;
        return {
          run: {
            runId: 'run-1',
            externalId: payload.externalId,
            pipelineId: 'ont-lsdv',
            pipelineVersion: '1.0.0',
            status: 'QUEUED',
            stages: [],
            queuePosition: 0,
            estimatedStartS: 0,
          },
          wasExisting: false,
        };
      });

      const result = await service.submitJob(ACTING_USER, labDto());

      expect(jobSavedBeforeCall).toBe(true);
      expect(externalIdAtCallTime).toBeDefined();
      expect(externalIdAtCallTime).toBe(result.externalId);

      // The first jobRepo.save call (pre-pipeline-call) must already carry
      // the externalId that was subsequently sent to the pipeline.
      const firstSavedJob = jobRepo.save.mock.calls[0][0];
      expect(firstSavedJob.externalId).toBe(externalIdAtCallTime);
    });

    it('does not create a second job or submission row when the pipeline reports an idempotent replay (wasExisting: true)', async () => {
      pipelineApi.submitRun.mockResolvedValue({
        run: {
          runId: 'run-1',
          externalId: 'ext-1',
          pipelineId: 'ont-lsdv',
          pipelineVersion: '1.0.0',
          status: 'RUNNING',
          stages: [],
          queuePosition: null,
          estimatedStartS: null,
        },
        wasExisting: true,
      });

      await service.submitJob(ACTING_USER, labDto());

      expect(submissionRepo.create).toHaveBeenCalledTimes(1);
      expect(jobRepo.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('pipeline submission failure handling', () => {
    it('marks the job/submission FAILED for a definitive pipeline rejection', async () => {
      pipelineApi.submitRun.mockRejectedValue(
        new PipelineValidationError('unknown pipeline_id'),
      );

      await expect(
        service.submitJob(ACTING_USER, labDto()),
      ).rejects.toBeInstanceOf(BadRequestException);

      const lastSavedJob =
        jobRepo.save.mock.calls[jobRepo.save.mock.calls.length - 1][0];
      expect(lastSavedJob.status).toBe(JobStatus.FAILED);

      const lastSavedSubmission =
        submissionRepo.save.mock.calls[
          submissionRepo.save.mock.calls.length - 1
        ][0];
      expect(lastSavedSubmission.status).toBe(SubmissionStatus.FAILED);
    });

    it('leaves the job SUBMITTED (not FAILED) when the pipeline call fails ambiguously, since the run may have actually been accepted', async () => {
      pipelineApi.submitRun.mockRejectedValue(
        new PipelineApiError('connect ECONNRESET'),
      );

      await expect(service.submitJob(ACTING_USER, labDto())).rejects.toThrow();

      // Only one jobRepo.save call happened (the pre-pipeline-call persist);
      // nothing downgraded it to FAILED afterwards.
      expect(jobRepo.save).toHaveBeenCalledTimes(1);
      const savedJob = jobRepo.save.mock.calls[0][0];
      expect(savedJob.status).toBe(JobStatus.SUBMITTED);
      expect(savedJob.externalId).toBeDefined();
    });
  });

  describe('NCBI source', () => {
    it('fetches the FASTA and PUTs it to S3 itself, then submits that key (no browser upload, no ownership check needed)', async () => {
      const dto: SubmitSequencingJobDto = {
        sourceType: SourceType.NCBI,
        ncbiAccession: 'NC_000001',
        fileFormat: 'FASTA',
        libraryType: 'Single End',
        platform: 'Illumina',
        sequencingMethod: 'WGS',
        pipelineId: 'ont-lsdv',
        inputKey: null,
      } as SubmitSequencingJobDto;

      const result = await service.submitJob(ACTING_USER, dto);

      expect(uploadsService.putServerObject).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: USER_ID,
          filename: 'NC_000001.fasta',
        }),
      );
      const [[submittedPayload]] = pipelineApi.submitRun.mock.calls;
      expect(submittedPayload.inputKey).toContain(`uploads/${USER_ID}/`);
      expect(submittedPayload.inputKey).toContain('NC_000001.fasta');
      expect(result.status).toBe(JobStatus.SUBMITTED);
    });
  });

  describe('field derivation (fileFormat / libraryType / platform / sequencingMethod)', () => {
    const PIPELINE_DEFINITION = {
      id: 'ont-lsdv',
      version: '1.0.0',
      stages: [],
      paramsSchema: {},
      acceptedExtensions: ['.fastq', '.fq', '.fastq.gz', '.fq.gz'],
      extraInputs: [],
      displayName: 'Oxford Nanopore — LSDV',
      description: null,
    };

    it('derives fileFormat from the input filename extension when omitted', async () => {
      pipelineApi.findPipelineSafe.mockResolvedValue(PIPELINE_DEFINITION);

      await service.submitJob(
        ACTING_USER,
        labDto({
          fileFormat: undefined,
          inputFilename: 'reads.fastq.gz',
        } as any),
      );

      const savedSubmission = submissionRepo.create.mock.calls[0][0];
      expect(savedSubmission.fileFormat).toBe('FASTQ');
    });

    it('honours a supplied fileFormat instead of the derived one, and skips the pipeline lookup entirely', async () => {
      await service.submitJob(
        ACTING_USER,
        labDto({
          fileFormat: 'FASTA' as any,
          inputFilename: 'reads.fastq',
        } as any),
      );

      const savedSubmission = submissionRepo.create.mock.calls[0][0];
      expect(savedSubmission.fileFormat).toBe('FASTA');
      // Both fileFormat and platform were supplied by labDto()'s defaults,
      // so there is nothing left to derive.
      expect(pipelineApi.findPipelineSafe).not.toHaveBeenCalled();
    });

    it('stores libraryType as null rather than defaulting it to "Single End" when not supplied', async () => {
      await service.submitJob(
        ACTING_USER,
        labDto({ libraryType: undefined } as any),
      );

      const savedSubmission = submissionRepo.create.mock.calls[0][0];
      expect(savedSubmission.libraryType).toBeNull();
    });

    it('stores sequencingMethod as null rather than inventing a value when not supplied', async () => {
      await service.submitJob(
        ACTING_USER,
        labDto({ sequencingMethod: undefined } as any),
      );

      const savedSubmission = submissionRepo.create.mock.calls[0][0];
      expect(savedSubmission.sequencingMethod).toBeNull();
    });

    it('derives platform from the pipeline displayName when omitted', async () => {
      pipelineApi.findPipelineSafe.mockResolvedValue(PIPELINE_DEFINITION);

      await service.submitJob(
        ACTING_USER,
        labDto({ platform: undefined } as any),
      );

      const savedSubmission = submissionRepo.create.mock.calls[0][0];
      expect(savedSubmission.platform).toBe('Oxford Nanopore — LSDV');
    });

    it('falls back to pipelineId for platform when the pipeline catalog is unavailable', async () => {
      pipelineApi.findPipelineSafe.mockResolvedValue(null);

      await service.submitJob(
        ACTING_USER,
        labDto({ platform: undefined } as any),
      );

      const savedSubmission = submissionRepo.create.mock.calls[0][0];
      expect(savedSubmission.platform).toBe('ont-lsdv');
    });
  });
});

// Sequencing results are genomic data: every read is scoped to the submitter
// and their project. These fixtures are owned by CTX.userId.
const CTX = {
  userId: 'user-1',
  projectIds: ['PHJOLL'],
  unrestricted: false,
  ownerFallback: true,
};
const OWNED_SUBMISSION = { submittedBy: 'user-1', projectId: 'PHJOLL' } as any;

describe('SequencingJobsService read endpoints', () => {
  let jobRepo: { findOne: jest.Mock };
  let variantRepo: { find: jest.Mock };
  let uploadsService: {
    artifactBucket: string;
    buildRunArtifactKey: jest.Mock;
    presignArtifactDownload: jest.Mock;
  };
  let pipelineApi: { getRunProgress: jest.Mock };
  let service: SequencingJobsService;

  beforeEach(() => {
    jobRepo = { findOne: jest.fn() };
    variantRepo = { find: jest.fn(async () => []) };
    uploadsService = {
      artifactBucket: 'dharini',
      buildRunArtifactKey: jest.fn(
        (runId: string, filename: string) =>
          `SDS004-ES_App_Data/genomic-sequencing/runs/${runId}/${filename}`,
      ),
      presignArtifactDownload: jest.fn(
        async () => 'https://s3.example/presigned',
      ),
    };
    pipelineApi = { getRunProgress: jest.fn() };

    service = new SequencingJobsService(
      {} as any,
      jobRepo as any,
      variantRepo as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      uploadsService as any,
      pipelineApi as any,
      { getOrThrow: () => 'https://dharini.example/webhook' } as any,
    );
  });

  it("getJobProgress reports the local status in the pipeline's vocabulary, without calling the pipeline, when the job has no runId yet", async () => {
    jobRepo.findOne.mockResolvedValue({
      id: 'job-1',
      submission: OWNED_SUBMISSION,
      status: JobStatus.SUBMITTED,
      stage: null,
      runId: null,
    });

    const progress = await service.getJobProgress(CTX, 'job-1');

    expect(pipelineApi.getRunProgress).not.toHaveBeenCalled();
    // 'QUEUED', not the local 'submitted' — callers cannot tell which branch
    // produced the value, so both must speak the same vocabulary.
    expect(progress).toEqual({
      status: 'QUEUED',
      stage: null,
      stageIndex: null,
      stageTotal: null,
      stageElapsedS: null,
      stageTypicalS: null,
      heartbeatAgeS: null,
      etaS: null,
      queuePosition: null,
      estimatedStartS: null,
      stages: [],
    });
  });

  it('getJobProgress returns local terminal status without calling the pipeline for completed jobs', async () => {
    jobRepo.findOne.mockResolvedValue({
      id: 'job-1',
      submission: OWNED_SUBMISSION,
      status: JobStatus.COMPLETED,
      stage: 'Annotation',
      durationS: 42,
      runId: 'run-123',
      stages: [
        { name: 'Alignment', status: 'completed', duration_s: 12 },
        { name: 'Annotation', status: 'completed', duration_s: 30 },
      ],
    });

    const progress = await service.getJobProgress(CTX, 'job-1');

    expect(pipelineApi.getRunProgress).not.toHaveBeenCalled();
    expect(progress.status).toBe('SUCCEEDED');
    expect(progress.stage).toBe('Annotation');
    expect(progress.stageElapsedS).toBe(42);
    expect(progress.stages).toHaveLength(2);
  });

  it('getJobProgress falls back gracefully to local status when pipelineApi throws an error', async () => {
    jobRepo.findOne.mockResolvedValue({
      id: 'job-1',
      submission: OWNED_SUBMISSION,
      status: JobStatus.PROCESSING,
      stage: 'Alignment',
      runId: 'run-123',
    });
    pipelineApi.getRunProgress.mockRejectedValue(
      new Error('pipeline unreachable'),
    );

    const progress = await service.getJobProgress(CTX, 'job-1');

    expect(pipelineApi.getRunProgress).toHaveBeenCalledWith('run-123');
    expect(progress.status).toBe('RUNNING');
    expect(progress.stage).toBe('Alignment');
  });

  it('getJobProgress raises NotFoundException for an unknown job id', async () => {
    jobRepo.findOne.mockResolvedValue(null);
    await expect(service.getJobProgress(CTX, 'missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('getJobArtifacts returns [] without presigning anything when artifactsUploaded is false', async () => {
    jobRepo.findOne.mockResolvedValue({
      id: 'job-1',
      submission: OWNED_SUBMISSION,
      artifactsUploaded: false,
      artifacts: [
        { kind: 'vcf', bucket: 'dharini', key: 'runs/run-1/out.vcf' },
      ],
    });

    const artifacts = await service.getJobArtifacts(CTX, 'job-1');

    expect(artifacts).toEqual([]);
    expect(uploadsService.presignArtifactDownload).not.toHaveBeenCalled();
  });

  // Listing deliberately does NOT presign: a presigned URL expires, so minting
  // one per artifact when the panel opens can hand the user a dead link.
  it('getJobArtifacts lists artifact metadata without minting any URL', async () => {
    jobRepo.findOne.mockResolvedValue({
      id: 'job-1',
      submission: OWNED_SUBMISSION,
      artifactsUploaded: true,
      artifacts: [
        {
          kind: 'vcf',
          bucket: 'dharini',
          key: 'runs/run-1/out.vcf',
          filename: 'out.vcf',
        },
      ],
    });

    const artifacts = await service.getJobArtifacts(CTX, 'job-1');

    expect(uploadsService.presignArtifactDownload).not.toHaveBeenCalled();
    expect(artifacts).toEqual([
      {
        kind: 'vcf',
        label: 'out.vcf',
        filename: 'out.vcf',
        sizeBytes: null,
        contentType: null,
      },
    ]);
  });

  it('getArtifactUrl mints a URL on demand, inline when asked', async () => {
    jobRepo.findOne.mockResolvedValue({
      id: 'job-1',
      submission: OWNED_SUBMISSION,
      runId: 'run-1',
      artifacts: [
        {
          kind: 'report',
          filename: 'visualization.html',
          content_type: 'text/html',
        },
      ],
    });

    const result = await service.getArtifactUrl(
      CTX,
      'job-1',
      'visualization.html',
      true,
    );

    // inline=true — an attachment disposition would make the iframe download
    // the plot instead of rendering it.
    expect(uploadsService.presignArtifactDownload).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('visualization.html'),
      'visualization.html',
      true,
    );
    expect(result.contentType).toBe('text/html');
  });

  it('getArtifactUrl refuses a filename the run does not have', async () => {
    jobRepo.findOne.mockResolvedValue({
      id: 'job-1',
      submission: OWNED_SUBMISSION,
      runId: 'run-1',
      artifacts: [{ kind: 'vcf', filename: 'snps.vcf' }],
    });

    await expect(
      service.getArtifactUrl(CTX, 'job-1', '../../etc/passwd', false),
    ).rejects.toThrow(NotFoundException);
  });

  // IDOR guard: JwtAuthGuard proves the caller is logged in, not that the run
  // is theirs. A 404 (not 403) so an unauthorised caller cannot confirm the
  // run exists or enumerate ids.
  it('hides a run belonging to another user in another project', async () => {
    jobRepo.findOne.mockResolvedValue({
      id: 'job-1',
      runId: 'run-1',
      submission: { submittedBy: 'someone-else', projectId: 'OTHERPROJ' },
      artifacts: [{ kind: 'vcf', filename: 'snps.vcf' }],
    });

    await expect(service.getJobArtifacts(CTX, 'job-1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    await expect(
      service.getArtifactUrl(CTX, 'job-1', 'snps.vcf', false),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('allows a colleague in the same project to see the run', async () => {
    jobRepo.findOne.mockResolvedValue({
      id: 'job-1',
      runId: 'run-1',
      submission: { submittedBy: 'someone-else', projectId: 'PHJOLL' },
      artifacts: [{ kind: 'vcf', filename: 'snps.vcf' }],
    });

    await expect(service.getJobArtifacts(CTX, 'job-1')).resolves.toHaveLength(
      1,
    );
  });
});

/**
 * Tenancy of sequencing reads.
 *
 * The v1 service scoped every read to a single `req.user.project.id`. That is
 * the legacy "primary membership" column: null for workspace admins, and one
 * arbitrary entry for anyone in several projects. The result was not a leak —
 * it failed closed — but it hid a multi-project user's own runs and left a
 * workspace admin seeing only what they had personally submitted.
 *
 * These exercise `isAccessible` through the public read methods, which is the
 * single predicate every tenant-owned read funnels through.
 */
describe('SequencingJobsService tenancy', () => {
  const makeService = (opts: {
    projectIds: string[];
    isSystem?: boolean;
    projectsInWorkspace?: string[];
    submissions?: any[];
  }) => {
    const submissionRepo = {
      find: jest.fn(async () => opts.submissions ?? []),
    };
    const projectRepo = {
      find: jest.fn(async () =>
        (opts.projectsInWorkspace ?? []).map((id) => ({ id })),
      ),
    };
    const tenantScope = {
      forUser: jest.fn(async () => ({
        scope: null,
        isSystem: opts.isSystem ?? false,
        projectIds: opts.projectIds,
        teamIds: [],
        workspaceIds: [],
      })),
      assertCanReachProject: jest.fn(async () => undefined),
    };
    const service = new SequencingJobsService(
      submissionRepo as any,
      {} as any,
      {} as any,
      projectRepo as any,
      tenantScope as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      { getOrThrow: () => 'https://dharini.example/webhook' } as any,
    );
    return { service, tenantScope, projectRepo };
  };

  const sub = (seqId: string, projectId: string | null, submittedBy: string) =>
    ({ seqId, projectId, submittedBy, jobs: [] }) as any;

  it('shows a multi-project user runs from EVERY project they can reach, not just one', async () => {
    const { service } = makeService({
      projectIds: ['PROJ-A', 'PROJ-B', 'PROJ-C'],
      submissions: [
        sub('SEQ-A', 'PROJ-A', 'someone-else'),
        sub('SEQ-B', 'PROJ-B', 'someone-else'),
        sub('SEQ-Z', 'PROJ-Z', 'someone-else'),
      ],
    });

    const ctx = await service.accessContext({ id: 'user-1', roles: [] });
    const visible = await service.findAllSubmissions(ctx);

    expect(visible.map((s) => s.seqId)).toEqual(['SEQ-A', 'SEQ-B']);
  });

  it('shows a workspace admin their workspace’s runs, not only what they submitted themselves', async () => {
    // A workspace-scoped role has no user.project at all, so the old
    // single-project context reduced this list to the owner fallback alone.
    const { service } = makeService({
      projectIds: ['PROJ-A', 'PROJ-B'],
      submissions: [
        sub('SEQ-A', 'PROJ-A', 'another-user'),
        sub('SEQ-B', 'PROJ-B', 'another-user'),
      ],
    });

    const ctx = await service.accessContext({
      id: 'workspace-admin',
      roles: [],
    });
    const visible = await service.findAllSubmissions(ctx);

    expect(visible.map((s) => s.seqId)).toEqual(['SEQ-A', 'SEQ-B']);
  });

  it('narrows to the requested workspace, intersected with what the caller can reach', async () => {
    const { service, projectRepo } = makeService({
      projectIds: ['PROJ-A', 'PROJ-B'],
      projectsInWorkspace: ['PROJ-B', 'PROJ-OTHER'],
      submissions: [
        sub('SEQ-A', 'PROJ-A', 'x'),
        sub('SEQ-B', 'PROJ-B', 'x'),
        sub('SEQ-OTHER', 'PROJ-OTHER', 'x'),
      ],
    });

    const ctx = await service.accessContext(
      { id: 'user-1', roles: [] },
      'ws-1',
    );

    // PROJ-OTHER is in the workspace but not reachable; PROJ-A is reachable
    // but not in the workspace. Only the intersection survives.
    expect(ctx.projectIds).toEqual(['PROJ-B']);
    expect(projectRepo.find).toHaveBeenCalled();

    const visible = await service.findAllSubmissions(ctx);
    expect(visible.map((s) => s.seqId)).toEqual(['SEQ-B']);
  });

  it('suspends the owner fallback under a workspace filter, so the switcher actually narrows', async () => {
    const { service } = makeService({
      projectIds: ['PROJ-A'],
      projectsInWorkspace: ['PROJ-A'],
      submissions: [
        sub('SEQ-MINE-ELSEWHERE', 'PROJ-ELSEWHERE', 'user-1'),
        sub('SEQ-HERE', 'PROJ-A', 'another-user'),
      ],
    });

    const unfiltered = await service.accessContext({ id: 'user-1', roles: [] });
    expect(
      (await service.findAllSubmissions(unfiltered)).map((s) => s.seqId),
    ).toEqual(['SEQ-MINE-ELSEWHERE', 'SEQ-HERE']);

    const filtered = await service.accessContext(
      { id: 'user-1', roles: [] },
      'ws-1',
    );
    expect(
      (await service.findAllSubmissions(filtered)).map((s) => s.seqId),
    ).toEqual(['SEQ-HERE']);
  });

  it('gives System scope everything when no workspace is requested', async () => {
    const { service } = makeService({
      projectIds: [],
      isSystem: true,
      submissions: [sub('SEQ-A', 'PROJ-A', 'x'), sub('SEQ-ORPHAN', null, 'x')],
    });

    const ctx = await service.accessContext({ id: 'root', roles: [] });
    const visible = await service.findAllSubmissions(ctx);

    expect(visible.map((s) => s.seqId)).toEqual(['SEQ-A', 'SEQ-ORPHAN']);
  });
});
