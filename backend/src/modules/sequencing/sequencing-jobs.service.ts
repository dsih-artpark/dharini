import { randomUUID } from 'crypto';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  PayloadTooLargeException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  SequencingSubmission,
  SourceType,
  SubmissionStatus,
} from '../../entities/sequencing-submission.entity';
import { SequencingJob, JobStatus } from '../../entities/sequencing-job.entity';
import { PipelineVariant } from '../../entities/pipeline-variant.entity';
import { Project } from '../../entities/project.entity';
import { TenantScopeService } from '../../common/authorization/tenant-scope.service';
import { SubmitSequencingJobDto } from './dto/submit-sequencing-job.dto';
import { LabSamplesSearchService } from './lab-samples-search.service';
import { NcbiService } from './ncbi.service';
import { SequencingUploadsService } from './sequencing-uploads.service';
import { PipelineApiService } from './pipeline/pipeline-api.service';
import {
  PipelineInputTooLargeError,
  PipelineNotFoundError,
  PipelineValidationError,
} from './pipeline/pipeline-api.types';
import { deriveFileFormat } from './sequencing-field-derivation.util';

export interface SubmitJobResult {
  submissionId: string;
  jobId: string;
  seqId: string;
  externalId: string;
  runId: string | null;
  status: JobStatus;
  queuePosition: number | null;
  estimatedStartS: number | null;
}

export interface JobProgressResult {
  status: string;
  stage: string | null;
  stageIndex: number | null;
  stageTotal: number | null;
  stageElapsedS: number | null;
  stageTypicalS: number | null;
  heartbeatAgeS: number | null;
  etaS: number | null;
  queuePosition: number | null;
  estimatedStartS: number | null;
  stages: { name: string; status: string; durationS?: number | null }[];
}

export interface JobVariantResult {
  chrom: string | null;
  pos: number | null;
  ref: string | null;
  alt: string | null;
  effect: string | null;
  impact: string | null;
  gene: string | null;
  hgvsP: string | null;
  depth: number | null;
  alleleFreq: number | null;
}

/**
 * Who is asking. Sequencing results are genomic data, so every read is scoped:
 * a run is visible to the person who submitted it and to their projects, and
 * to nobody else. `JwtAuthGuard` on the controller only proves the caller is
 * logged in — it says nothing about whether this run is theirs.
 *
 * This carries the caller's FULL reachable project set, not a single
 * `user.project.id`. That singular column is the legacy "primary membership":
 * it is null for workspace admins and arbitrary for anyone in more than one
 * project, so scoping by it hid a multi-project user's own runs and left a
 * workspace admin able to see only what they had personally submitted.
 * `TenantScopeService.forUser` expands workspace roles into their projects,
 * which is what makes both cases work.
 */
export interface SequencingAccessContext {
  userId: string;
  /** Every project the caller can reach, already narrowed if a workspace was requested. */
  projectIds: string[];
  /** System scope with no workspace filter applied — sees everything. */
  unrestricted: boolean;
  /**
   * False once a specific workspace was requested. The "you can always see
   * what you submitted" fallback is suspended then, so the workspace switcher
   * actually narrows the list instead of leaking the caller's own runs from
   * every other workspace back into it.
   */
  ownerFallback: boolean;
}

export interface JobArtifactResult {
  kind: string;
  label: string;
  filename: string;
  sizeBytes: number | null;
  contentType: string | null;
}

/** Local JobStatus expressed in the pipeline's status vocabulary. */
const LOCAL_STATUS_AS_RUN_STATUS: Record<JobStatus, string> = {
  [JobStatus.SUBMITTED]: 'QUEUED',
  [JobStatus.PROCESSING]: 'RUNNING',
  [JobStatus.COMPLETED]: 'SUCCEEDED',
  [JobStatus.FAILED]: 'FAILED',
  [JobStatus.CANCELLED]: 'CANCELLED',
};

function asString(value: unknown): string | null {
  if (value == null) return null;
  return typeof value === 'string' ? value : String(value);
}

function asNumber(value: unknown): number | null {
  if (value == null) return null;
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

@Injectable()
export class SequencingJobsService {
  private readonly logger = new Logger(SequencingJobsService.name);
  private readonly callbackUrl: string;

  constructor(
    @InjectRepository(SequencingSubmission)
    private submissionRepo: Repository<SequencingSubmission>,
    @InjectRepository(SequencingJob)
    private jobRepo: Repository<SequencingJob>,
    @InjectRepository(PipelineVariant)
    private variantRepo: Repository<PipelineVariant>,
    @InjectRepository(Project)
    private projectRepo: Repository<Project>,
    private tenantScope: TenantScopeService,
    private labSamplesService: LabSamplesSearchService,
    private ncbiService: NcbiService,
    private uploadsService: SequencingUploadsService,
    private pipelineApi: PipelineApiService,
    private configService: ConfigService,
  ) {
    this.callbackUrl = this.configService.getOrThrow<string>(
      'PIPELINE_CALLBACK_URL',
    );
  }

  /**
   * Submits a run to the pipeline. JSON only — the browser (for lab/manual
   * sources) has already PUT its bytes straight to S3 via a presigned URL
   * minted by SequencingUploadsService.createUploadTarget and hands back
   * only the key. Bytes never pass through this process on that path.
   *
   * NCBI has no browser upload: we fetch the FASTA ourselves and PUT it to
   * S3 server-side (SequencingUploadsService.putServerObject) before
   * submitting, since there is nothing for a browser to have uploaded.
   */
  async submitJob(
    user: any,
    dto: SubmitSequencingJobDto,
  ): Promise<SubmitJobResult> {
    const userId = user?.id;
    // Ownership checks come first — before resolveSource (which, for NCBI,
    // fetches from NCBI and writes to S3) or any DB write. The key comes
    // back from the browser (lab/manual), so this is what stops one user
    // submitting a run against another user's upload; doing it up front
    // also means a rejected submit leaves no wasted side effects behind.
    if (dto.sourceType !== SourceType.NCBI) {
      if (!dto.inputKey) {
        throw new BadRequestException(
          `inputKey required for ${dto.sourceType} source`,
        );
      }
      this.uploadsService.assertOwnedKey(userId, dto.inputKey);
    }
    for (const key of Object.values(dto.extraInputKeys ?? {})) {
      this.uploadsService.assertOwnedKey(userId, key);
    }

    const resolved = await this.resolveSource(userId, dto);

    // Tenancy of the new submission. For lab sources resolveSource has
    // already overridden this with the sample's own project.
    //
    // Only checked when a project is actually named: NCBI and manual
    // submissions may legitimately carry none, and those stay visible to
    // their submitter alone (see isAccessible's owner fallback). What this
    // does stop is naming a project you cannot reach — without it, any
    // authenticated user could plant a run in any tenant simply by sending
    // its project code.
    const projectId =
      resolved.submissionFields.projectId ?? dto.projectId ?? null;
    if (projectId) {
      await this.tenantScope.assertCanReachProject(user, projectId, 'project');
    }

    const derived = await this.deriveSubmissionFields(
      dto,
      resolved.inputFilename,
    );

    const externalId = randomUUID();
    const seqId = await this.generateSeqId();

    const submission = await this.submissionRepo.save(
      this.submissionRepo.create({
        seqId,
        sourceType: dto.sourceType,
        ...resolved.submissionFields,
        fileFormat: derived.fileFormat,
        libraryType: derived.libraryType,
        platform: derived.platform,
        sequencingMethod: derived.sequencingMethod,
        fileNameR1: resolved.inputFilename ?? null,
        filePathR1: resolved.inputKey,
        projectId,
        submittedBy: userId,
        status: SubmissionStatus.SUBMITTED,
        submissionDate: new Date().toISOString().split('T')[0],
      }),
    );

    // Persist the job row — with its externalId — BEFORE calling the
    // pipeline. If the submitRun call's response is lost after the pipeline
    // has already accepted it, externalId is the only handle the eventual
    // webhook (keyed on run.external_id) can use to find this job. Persist
    // after, and that run can never be correlated back.
    let job = await this.jobRepo.save(
      this.jobRepo.create({
        submissionId: submission.id,
        externalId,
        pipelineId: dto.pipelineId,
        status: JobStatus.SUBMITTED,
        submittedParams: dto.params ?? null,
        extraInputKeys: dto.extraInputKeys ?? null,
      }),
    );

    try {
      const { run } = await this.pipelineApi.submitRun({
        pipelineId: dto.pipelineId,
        externalId,
        ownerId: userId,
        inputKey: resolved.inputKey,
        inputFilename: resolved.inputFilename,
        extraInputKeys: dto.extraInputKeys,
        params: dto.params,
        callbackUrl: this.callbackUrl,
      });

      job.runId = run.runId;
      job.pipelineId = run.pipelineId;
      job.pipelineVersion = run.pipelineVersion;
      job.status = JobStatus.SUBMITTED;
      job = await this.jobRepo.save(job);

      return {
        submissionId: submission.id,
        jobId: job.id,
        seqId: submission.seqId,
        externalId,
        runId: job.runId,
        status: job.status,
        queuePosition: run.queuePosition,
        estimatedStartS: run.estimatedStartS,
      };
    } catch (error: any) {
      // A definitive rejection (bad params, oversized input, unknown
      // pipeline) means no run was created remotely — safe to mark FAILED.
      // Any other failure (timeout, 5xx, network) is ambiguous: the
      // pipeline may have accepted the run and its response to us was
      // simply lost. Leave the job SUBMITTED rather than falsely claiming
      // FAILED for a run that might still complete — externalId is already
      // persisted, so the webhook or the reconciliation sweep can still
      // correlate and correct the status later.
      const definitivelyRejected =
        error instanceof PipelineValidationError ||
        error instanceof PipelineInputTooLargeError ||
        error instanceof PipelineNotFoundError;

      if (definitivelyRejected) {
        job.status = JobStatus.FAILED;
        job.errorMessage = error.message;
        await this.jobRepo.save(job);
        submission.status = SubmissionStatus.FAILED;
        await this.submissionRepo.save(submission);
      } else {
        this.logger.warn(
          `submitRun for job ${job.id} (externalId ${externalId}) failed ambiguously ` +
            `(${error?.message}); leaving job SUBMITTED for later reconciliation`,
        );
      }

      throw this.toSubmitError(error);
    }
  }

  private toSubmitError(error: any): Error {
    if (error instanceof PipelineValidationError) {
      return new BadRequestException(error.message);
    }
    if (error instanceof PipelineNotFoundError) {
      return new BadRequestException(error.message);
    }
    if (error instanceof PipelineInputTooLargeError) {
      return new PayloadTooLargeException(error.message);
    }
    return error instanceof Error
      ? error
      : new Error('Failed to submit sequencing job');
  }

  private async resolveSource(
    userId: string,
    dto: SubmitSequencingJobDto,
  ): Promise<{
    inputKey: string;
    inputFilename?: string;
    submissionFields: Partial<SequencingSubmission>;
  }> {
    if (dto.sourceType === SourceType.LAB) {
      if (!dto.labTestId) {
        throw new BadRequestException('labTestId required for lab source');
      }
      if (!dto.inputKey) {
        throw new BadRequestException('inputKey required for lab source');
      }
      const labSample = await this.labSamplesService.findById(dto.labTestId);
      if (!labSample) throw new BadRequestException('Lab sample not found');

      return {
        inputKey: dto.inputKey,
        inputFilename: dto.inputFilename,
        submissionFields: {
          labTestId: dto.labTestId,
          sampleBarcode: labSample.barcode,
          siteName: labSample.siteName,
          diseaseName: labSample.diseaseName,
          // The sample owns the tenancy, so it wins over any projectId the
          // client sent. Otherwise a caller could file someone else's lab
          // sample under a project of their choosing and make the run visible
          // to the wrong tenant. submitJob still checks this is reachable.
          projectId: labSample.projectId ?? dto.projectId ?? null,
        },
      };
    }

    if (dto.sourceType === SourceType.NCBI) {
      if (!dto.ncbiAccession) {
        throw new BadRequestException('ncbiAccession required for NCBI source');
      }

      const ncbiData = await this.ncbiService.fetchSummary(dto.ncbiAccession);
      const fastaContent = await this.ncbiService.downloadFastaContent(
        dto.ncbiAccession,
      );
      const fastaFileName = dto.inputFilename ?? `${dto.ncbiAccession}.fasta`;

      // No browser upload for NCBI — fetch and PUT to S3 ourselves under the
      // same uploads/ layout, then submit that key. This is the one
      // legitimate server-side upload path; bytes still never pass through
      // Node on the browser (lab/manual) path.
      const { key } = await this.uploadsService.putServerObject({
        userId,
        filename: fastaFileName,
        body: Buffer.from(fastaContent, 'utf8'),
        contentType: 'text/plain',
      });

      return {
        inputKey: key,
        inputFilename: fastaFileName,
        submissionFields: {
          ncbiAccession: dto.ncbiAccession,
          ncbiTitle: ncbiData.title,
          ncbiOrganism: ncbiData.organism,
          ncbiLength: ncbiData.length,
          sampleBarcode: dto.ncbiAccession,
          siteName: ncbiData.organism,
        },
      };
    }

    // MANUAL
    if (!dto.manualSampleBarcode) {
      throw new BadRequestException(
        'manualSampleBarcode required for manual source',
      );
    }
    if (!dto.inputKey) {
      throw new BadRequestException('inputKey required for manual source');
    }

    return {
      inputKey: dto.inputKey,
      inputFilename: dto.inputFilename,
      submissionFields: {
        sampleBarcode: dto.manualSampleBarcode,
        siteName: dto.manualSiteName || 'Unknown',
      },
    };
  }

  /**
   * fileFormat/libraryType/platform/sequencingMethod are no longer
   * collected on the submission form — the selected pipeline determines
   * all four now. A value supplied in the DTO is always honoured as-is;
   * only omitted fields are derived (fileFormat, platform) or left null
   * (libraryType, sequencingMethod — there is nothing safe to default them
   * to, see the DTO's docs on each field).
   *
   * The pipeline lookup behind fileFormat/platform is best-effort
   * (PipelineApiService.findPipelineSafe never throws) and cached, so a
   * slow or unreachable pipeline catalog degrades gracefully rather than
   * failing the submission.
   */
  private async deriveSubmissionFields(
    dto: SubmitSequencingJobDto,
    inputFilename?: string,
  ): Promise<{
    fileFormat: string | null;
    libraryType: string | null;
    platform: string | null;
    sequencingMethod: string | null;
  }> {
    let fileFormat: string | null = dto.fileFormat ?? null;
    let platform: string | null = dto.platform ?? null;

    if (!fileFormat || !platform) {
      const pipeline = await this.pipelineApi.findPipelineSafe(dto.pipelineId);

      if (!fileFormat) {
        fileFormat = deriveFileFormat(
          inputFilename,
          pipeline?.acceptedExtensions ?? [],
        );
      }
      if (!platform) {
        platform = pipeline?.displayName ?? dto.pipelineId;
      }
    }

    return {
      fileFormat,
      platform,
      // Never defaulted — see the DTO field docs.
      libraryType: dto.libraryType ?? null,
      sequencingMethod: dto.sequencingMethod ?? null,
    };
  }

  /**
   * One past the highest number used this year. Not count() + 1: once a row
   * is deleted from the middle of the series the count lags behind the
   * highest ID, and every "next" ID collides with one already taken.
   *
   * The max is taken numerically — the 3-digit padding means SEQ-2026-1000
   * sorts below SEQ-2026-999 as a string.
   */
  private async generateSeqId(): Promise<string> {
    const prefix = `SEQ-${new Date().getFullYear()}-`;
    const row = await this.submissionRepo
      .createQueryBuilder('s')
      .select(`MAX(CAST(SPLIT_PART(s.seqId, '-', 3) AS INTEGER))`, 'max')
      .where('s.seqId ~ :pattern', { pattern: `^${prefix}[0-9]+$` })
      .getRawOne<{ max: number | null }>();
    const next = Number(row?.max ?? 0) + 1;
    return `${prefix}${String(next).padStart(3, '0')}`;
  }

  /** Jobs the caller may see. Scoping the single-job reads without scoping
   *  this one would be pointless — the list would leak every run anyway. */
  async findAllJobs(ctx: SequencingAccessContext): Promise<SequencingJob[]> {
    const jobs = await this.jobRepo.find({ relations: ['submission'] });
    return jobs.filter((job) => this.isAccessible(ctx, job.submission));
  }

  async findOneJob(
    ctx: SequencingAccessContext,
    id: string,
  ): Promise<SequencingJob | null> {
    const job = await this.jobRepo.findOne({
      where: { id },
      relations: ['submission'],
    });
    return job && this.isAccessible(ctx, job.submission) ? job : null;
  }

  async findAllSubmissions(
    ctx: SequencingAccessContext,
  ): Promise<SequencingSubmission[]> {
    const submissions = await this.submissionRepo.find({ relations: ['jobs'] });
    return submissions.filter((s) => this.isAccessible(ctx, s));
  }

  async findOneSubmission(
    ctx: SequencingAccessContext,
    id: string,
  ): Promise<SequencingSubmission | null> {
    const submission = await this.submissionRepo.findOne({
      where: { id },
      relations: ['jobs'],
    });
    return submission && this.isAccessible(ctx, submission) ? submission : null;
  }

  /**
   * Resolves who is asking into the concrete set of projects they can reach.
   *
   * Public because the controller builds the context once per request and
   * hands it down; `TenantScopeService` memoises the underlying lookup on the
   * `req.user` object, so calling this on several routes in one request costs
   * one query at most.
   *
   * `workspaceId` is the web app's workspace switcher. Narrowing intersects
   * the requested workspace's projects with what the caller can reach, so
   * asking for a workspace you are not in yields an empty set rather than an
   * error — and never widens scope.
   */
  async accessContext(
    user: any,
    workspaceId?: string,
  ): Promise<SequencingAccessContext> {
    const tenant = await this.tenantScope.forUser(user);

    if (!workspaceId) {
      return {
        userId: user?.id,
        projectIds: tenant.projectIds,
        unrestricted: tenant.isSystem,
        ownerFallback: true,
      };
    }

    const inWorkspace = (
      await this.projectRepo.find({
        where: { workspace: { id: workspaceId } },
        select: ['id'],
      })
    ).map((project) => project.id);

    return {
      userId: user?.id,
      projectIds: tenant.isSystem
        ? inWorkspace
        : inWorkspace.filter((id) => tenant.projectIds.includes(id)),
      unrestricted: false,
      ownerFallback: false,
    };
  }

  /**
   * Throws unless `ctx` may see this submission. Deliberately a 404 rather
   * than a 403: telling an unauthorised caller that a run exists is itself a
   * disclosure, and lets them enumerate ids.
   */
  private isAccessible(
    ctx: SequencingAccessContext,
    submission: SequencingSubmission | null | undefined,
  ): boolean {
    if (!submission) return false;
    if (ctx.unrestricted) return true;

    // Kept from the single-tenant version so submissions predating the
    // project_id backfill (project_id NULL) stay visible to whoever made
    // them — but suspended under an explicit workspace filter, or the
    // switcher would keep showing runs from workspaces you switched away
    // from.
    const isOwner =
      ctx.ownerFallback &&
      !!submission.submittedBy &&
      submission.submittedBy === ctx.userId;

    const inScope =
      !!submission.projectId && ctx.projectIds.includes(submission.projectId);

    return isOwner || inScope;
  }

  private assertSubmissionAccessible(
    ctx: SequencingAccessContext,
    submission: SequencingSubmission | null | undefined,
  ): void {
    if (!submission) throw new NotFoundException('Job not found');

    if (!this.isAccessible(ctx, submission)) {
      throw new NotFoundException('Job not found');
    }
  }

  /** Loads a job and verifies the caller may see it. */
  private async findAccessibleJob(
    ctx: SequencingAccessContext,
    id: string,
  ): Promise<SequencingJob> {
    const job = await this.jobRepo.findOne({
      where: { id },
      relations: ['submission'],
    });
    if (!job) throw new NotFoundException('Job not found');
    this.assertSubmissionAccessible(ctx, job.submission);
    return job;
  }

  /**
   * Mints a presigned URL for one artifact, on demand.
   *
   * Deliberately separate from the artifact listing: a presigned URL has a
   * fixed lifetime, so minting one for every artifact when the panel opens
   * both wastes work on files nobody downloads and risks handing the user a
   * URL that has already expired by the time they click it.
   *
   * `filename` is matched against the run's own recorded artifacts rather
   * than trusted, so it cannot be used to reach an arbitrary object.
   */
  async getArtifactUrl(
    ctx: SequencingAccessContext,
    id: string,
    filename: string,
    inline = false,
  ): Promise<{ url: string; filename: string; contentType: string | null }> {
    const job = await this.findAccessibleJob(ctx, id);

    const artifacts = Array.isArray(job.artifacts) ? job.artifacts : [];
    const match = artifacts
      .filter(
        (raw): raw is Record<string, unknown> =>
          !!raw && typeof raw === 'object',
      )
      .find((a) => {
        const explicitKey = asString(a.key);
        const name =
          asString(a.filename) ?? explicitKey?.split('/').pop() ?? null;
        return name === filename;
      });

    if (!match) {
      throw new NotFoundException(
        `No artifact named "${filename}" for this run`,
      );
    }

    const explicitKey = asString(match.key);
    const bucket = asString(match.bucket) ?? this.uploadsService.artifactBucket;
    const key =
      explicitKey ??
      (job.runId
        ? this.uploadsService.buildRunArtifactKey(job.runId, filename)
        : null);
    if (!key) {
      throw new NotFoundException('This artifact is no longer retrievable');
    }

    return {
      url: await this.uploadsService.presignArtifactDownload(
        bucket,
        key,
        filename,
        inline,
      ),
      filename,
      contentType: asString(match.content_type ?? match.contentType),
    };
  }

  /**
   * Re-runs a failed job against the same input and parameters.
   *
   * A NEW externalId is minted deliberately. externalId carries a unique
   * constraint on the pipeline, and resubmitting an existing one returns the
   * ORIGINAL run rather than starting a fresh one — that idempotency is what
   * makes a timeout-and-retry safe, but it means reusing the id here would
   * hand back the very failure the user is trying to escape.
   *
   * The retry becomes another job row on the same submission (they are
   * already one-to-many), so the submission keeps its identity and the
   * history of attempts stays visible rather than being overwritten.
   */
  async retryJob(
    ctx: SequencingAccessContext,
    jobId: string,
  ): Promise<SubmitJobResult> {
    const userId = ctx.userId;
    const job = await this.jobRepo.findOne({
      where: { id: jobId },
      relations: ['submission'],
    });
    if (!job) throw new NotFoundException('Job not found');
    this.assertSubmissionAccessible(ctx, job.submission);

    if (job.status !== JobStatus.FAILED && job.status !== JobStatus.CANCELLED) {
      throw new BadRequestException(
        `Only a failed or cancelled run can be retried; this one is ${job.status}.`,
      );
    }

    const submission = job.submission;
    const inputKey = submission?.filePathR1;
    if (!submission || !inputKey) {
      throw new BadRequestException(
        'The original input file for this run is no longer recorded, so it cannot be retried.',
      );
    }

    // The input object may have been swept by the bucket lifecycle rule since
    // the original attempt. Re-check ownership regardless: the stored key is
    // trusted less than the caller's identity.
    this.uploadsService.assertOwnedKey(userId, inputKey);

    const externalId = randomUUID();
    let retryJob = await this.jobRepo.save(
      this.jobRepo.create({
        submissionId: submission.id,
        externalId,
        pipelineId: job.pipelineId,
        status: JobStatus.SUBMITTED,
        submittedParams: job.submittedParams,
        extraInputKeys: job.extraInputKeys,
      }),
    );

    submission.status = SubmissionStatus.SUBMITTED;
    await this.submissionRepo.save(submission);

    try {
      const { run } = await this.pipelineApi.submitRun({
        pipelineId: job.pipelineId!,
        externalId,
        ownerId: userId,
        inputKey,
        inputFilename: submission.fileNameR1 ?? undefined,
        extraInputKeys: job.extraInputKeys ?? undefined,
        params: job.submittedParams ?? undefined,
        callbackUrl: this.callbackUrl,
      });

      retryJob.runId = run.runId;
      retryJob.pipelineVersion = run.pipelineVersion;
      retryJob = await this.jobRepo.save(retryJob);

      return {
        submissionId: submission.id,
        jobId: retryJob.id,
        seqId: submission.seqId,
        externalId,
        runId: retryJob.runId,
        status: retryJob.status,
        queuePosition: run.queuePosition,
        estimatedStartS: run.estimatedStartS,
      };
    } catch (error: any) {
      // Same reasoning as submitJob: only a definitive rejection proves no
      // run was created remotely. Anything ambiguous stays SUBMITTED so the
      // webhook or the sweep can still correct it.
      if (
        error instanceof PipelineValidationError ||
        error instanceof PipelineInputTooLargeError ||
        error instanceof PipelineNotFoundError
      ) {
        retryJob.status = JobStatus.FAILED;
        retryJob.errorMessage = error.message;
        await this.jobRepo.save(retryJob);
        submission.status = SubmissionStatus.FAILED;
        await this.submissionRepo.save(submission);
      }
      throw error instanceof PipelineInputTooLargeError
        ? new PayloadTooLargeException(error.message)
        : new BadRequestException(
            `Pipeline request rejected: ${error?.message ?? 'unknown error'}`,
          );
    }
  }

  /**
   * Proxies GET /v1/runs/{run_id}/progress. Before a run_id exists (submit
   * hasn't returned yet, or the earlier submitRun call failed ambiguously),
   * this returns the job's local status with everything else null instead
   * of erroring.
   *
   * `status` always uses the pipeline's vocabulary (QUEUED / RUNNING /
   * SUCCEEDED / FAILED / CANCELLED), including on the no-run_id branch where
   * the value originates locally. Leaking the local lowercase JobStatus here
   * would make the field's meaning depend on which branch fired, and callers
   * cannot tell which one that was.
   */
  async getJobProgress(
    ctx: SequencingAccessContext,
    id: string,
  ): Promise<JobProgressResult> {
    const job = await this.findAccessibleJob(ctx, id);

    const isTerminal =
      job.status === JobStatus.COMPLETED ||
      job.status === JobStatus.FAILED ||
      job.status === JobStatus.CANCELLED;

    // Fast path: if the job is already terminal in Dharini's database, or if
    // there is no runId, we already have the final state and stages locally.
    // Never hit the external pipeline for completed runs (which may also be
    // purged after retention).
    if (isTerminal || !job.runId) {
      const rawStages = Array.isArray(job.stages) ? (job.stages as any[]) : [];
      const stages = rawStages.map((s) => ({
        name: asString(s?.name) ?? '',
        status:
          asString(s?.status) ??
          (job.status === JobStatus.COMPLETED ? 'completed' : 'failed'),
        durationS:
          asNumber(s?.duration_s) ??
          asNumber(s?.durationS) ??
          asNumber(s?.elapsed_s) ??
          null,
      }));

      return {
        status: LOCAL_STATUS_AS_RUN_STATUS[job.status] ?? 'SUCCEEDED',
        stage:
          job.stage ??
          (stages.length > 0 ? stages[stages.length - 1].name : null),
        stageIndex: stages.length > 0 ? stages.length - 1 : null,
        stageTotal: stages.length > 0 ? stages.length : null,
        stageElapsedS: job.durationS ?? null,
        stageTypicalS: null,
        heartbeatAgeS: null,
        etaS: null,
        queuePosition: null,
        estimatedStartS: null,
        stages,
      };
    }

    try {
      const progress = await this.pipelineApi.getRunProgress(job.runId);
      return {
        status: progress.status,
        stage: progress.stage,
        stageIndex: progress.stageIndex,
        stageTotal: progress.stageTotal,
        stageElapsedS: progress.stageElapsedS,
        stageTypicalS: progress.stageTypicalS,
        heartbeatAgeS: progress.heartbeatAgeS,
        etaS: progress.etaS,
        queuePosition: progress.queuePosition,
        estimatedStartS: progress.estimatedStartS,
        stages: progress.stages,
      };
    } catch (err: any) {
      this.logger.warn(
        `Failed to fetch live progress for run ${job.runId}: ${err?.message}. Falling back to local job status.`,
      );
      return {
        status: LOCAL_STATUS_AS_RUN_STATUS[job.status] ?? 'RUNNING',
        stage: job.stage ?? null,
        stageIndex: null,
        stageTotal: null,
        stageElapsedS: job.durationS ?? null,
        stageTypicalS: null,
        heartbeatAgeS: null,
        etaS: null,
        queuePosition: null,
        estimatedStartS: null,
        stages: [],
      };
    }
  }

  /** Local rows only — never calls the pipeline. */
  async getJobVariants(
    ctx: SequencingAccessContext,
    id: string,
  ): Promise<JobVariantResult[]> {
    await this.findAccessibleJob(ctx, id);

    const rows = await this.variantRepo.find({ where: { jobId: id } });
    return rows.map((r) => ({
      chrom: r.chrom,
      pos: r.pos,
      ref: r.ref,
      alt: r.alt,
      effect: r.effect,
      impact: r.impact,
      gene: r.gene,
      hgvsP: r.hgvsP,
      depth: r.depth,
      alleleFreq: r.alleleFreq,
    }));
  }

  /**
   * `url` is a presigned GET minted from the {bucket, key} recorded in
   * job.artifacts by RunResultService. The pipeline serves no result files
   * itself (and deletes its local copies after 6 hours) — S3 is the durable
   * store, and bytes are never proxied through this service.
   */
  async getJobArtifacts(
    ctx: SequencingAccessContext,
    id: string,
  ): Promise<JobArtifactResult[]> {
    const job = await this.findAccessibleJob(ctx, id);

    // Only an explicit `false` means the files are stranded on the worker.
    // null/undefined just means we learned about this run from the
    // reconciliation sweep, whose run record carries no artifacts_uploaded
    // field at all — treating that as "no files" hid every artifact.
    if (job.artifactsUploaded === false) return [];

    const artifacts = Array.isArray(job.artifacts) ? job.artifacts : [];
    const results: JobArtifactResult[] = [];

    for (const raw of artifacts) {
      if (!raw || typeof raw !== 'object') continue;
      const a = raw as Record<string, unknown>;

      const explicitKey = asString(a.key);
      const filename =
        asString(a.filename) ?? explicitKey?.split('/').pop() ?? 'artifact';

      // Prefer what the webhook gave us; otherwise derive from the run id,
      // since the run record supplies only the pipeline's internal URL.
      // Resolvable to a real object? Listing does not presign — see
      // getArtifactUrl. A presigned URL expires, and minting one per artifact
      // at list time means it may already be dead by the time the user clicks.
      const bucket = asString(a.bucket) ?? this.uploadsService.artifactBucket;
      const key =
        explicitKey ??
        (job.runId
          ? this.uploadsService.buildRunArtifactKey(job.runId, filename)
          : null);
      if (!bucket || !key) continue;
      const kind = asString(a.kind) ?? 'file';

      results.push({
        kind,
        label: asString(a.label) ?? filename,
        filename,
        sizeBytes: asNumber(a.size_bytes ?? a.sizeBytes),
        contentType: asString(a.content_type ?? a.contentType),
      });
    }

    return results;
  }
}
