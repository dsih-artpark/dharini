import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';

import {
  JobStatus,
  SequencingJob,
} from '../../../entities/sequencing-job.entity';
import {
  SequencingSubmission,
  SubmissionStatus,
} from '../../../entities/sequencing-submission.entity';
import { PipelineVariant } from '../../../entities/pipeline-variant.entity';

/**
 * The single shape both the completion webhook and the reconciliation sweep
 * normalise their source data into before handing it to RunResultService.
 * Keeping this one interface (rather than each caller writing its own
 * partial update) is what lets the two delivery paths converge on one
 * idempotent place that applies a finished run.
 */
export interface TerminalRunResult {
  runId: string;
  externalId: string;
  status: 'SUCCEEDED' | 'FAILED' | 'CANCELLED';
  durationS?: number | null;
  error?: string | null;
  metrics?: Record<string, unknown> | null;
  stages?: unknown[] | null;
  variants?: unknown[] | null;
  artifacts?: unknown[] | null;
  artifactsUploaded?: boolean;
  artifactsError?: string | null;
}

const STATUS_MAP: Record<TerminalRunResult['status'], JobStatus> = {
  SUCCEEDED: JobStatus.COMPLETED,
  FAILED: JobStatus.FAILED,
  CANCELLED: JobStatus.CANCELLED,
};

/**
 * The parent submission mirrors its job's terminal state. Without this the
 * submission stays 'submitted' forever, so every consumer of
 * GET /sequencing — the records list, the CSV export — reports a finished
 * run as still in progress.
 */
const SUBMISSION_STATUS_MAP: Record<JobStatus, SubmissionStatus | null> = {
  [JobStatus.SUBMITTED]: null,
  [JobStatus.PROCESSING]: null,
  [JobStatus.COMPLETED]: SubmissionStatus.COMPLETED,
  [JobStatus.FAILED]: SubmissionStatus.FAILED,
  [JobStatus.CANCELLED]: SubmissionStatus.CANCELLED,
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

function lastStageName(stages: unknown[] | null | undefined): string | null {
  if (!Array.isArray(stages) || stages.length === 0) return null;
  const last = stages[stages.length - 1];
  if (
    last &&
    typeof last === 'object' &&
    'name' in (last as Record<string, unknown>)
  ) {
    return asString((last as Record<string, unknown>).name);
  }
  return null;
}

/**
 * Applies a finished pipeline run to persistent state. This is the ONE place
 * that writes a terminal run result — both PipelineWebhookService (the
 * webhook receiver) and PipelineReconciliationService (the periodic sweep
 * for runs whose webhook was never delivered or ran out of retries) call
 * this instead of writing to SequencingJob directly, so the two paths can't
 * disagree or double-apply a result.
 *
 * Idempotent: if the job is already in the target terminal status, calling
 * this again is a no-op. That is what makes it safe for the webhook and the
 * sweep to both deliver the same result, and for the webhook to call this a
 * second time on a delivery id it has not yet recorded (e.g. it crashed
 * after applying the result but before recording the delivery).
 */
@Injectable()
export class RunResultService {
  private readonly logger = new Logger(RunResultService.name);

  constructor(private readonly dataSource: DataSource) {}

  async applyTerminalResult(result: TerminalRunResult): Promise<void> {
    if (!result.externalId) {
      throw new BadRequestException('TerminalRunResult.externalId is required');
    }

    const targetStatus = STATUS_MAP[result.status];
    if (!targetStatus) {
      throw new BadRequestException(
        `Unrecognized terminal run status "${result.status}"`,
      );
    }

    await this.dataSource.transaction(async (manager) => {
      // Row-lock the job for the duration of the transaction so a concurrent
      // delivery of the same result (webhook and sweep racing, or two
      // retried webhook deliveries that both slipped past the dedup check)
      // serializes instead of both writing at once.
      const job = await manager.findOne(SequencingJob, {
        where: { externalId: result.externalId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!job) {
        throw new NotFoundException(
          `No sequencing job found for run externalId "${result.externalId}"`,
        );
      }

      if (job.status === targetStatus) {
        this.logger.debug(
          `Run ${result.externalId} is already ${targetStatus}; applyTerminalResult is a no-op`,
        );
        return;
      }

      job.status = targetStatus;
      job.runId = result.runId || job.runId;
      job.durationS = result.durationS ?? null;
      job.errorMessage = result.error ?? null;
      job.metrics = result.metrics ?? null;
      job.stages = result.stages ?? null;
      job.artifacts = result.artifacts ?? null;
      job.artifactsUploaded = result.artifactsUploaded ?? null;
      job.artifactsError = result.artifactsError ?? null;
      job.finishedAt = new Date();
      job.stage = lastStageName(result.stages) ?? job.stage;

      await manager.save(SequencingJob, job);

      // Advance the parent submission in the same transaction, so the job and
      // the submission can never disagree about whether the run finished.
      const submissionStatus = SUBMISSION_STATUS_MAP[targetStatus];
      if (submissionStatus && job.submissionId) {
        await manager.update(
          SequencingSubmission,
          { id: job.submissionId },
          { status: submissionStatus },
        );
      }

      // Variants are stored as rows (queryable by gene/impact/position),
      // not as a jsonb blob — replace this job's rows wholesale so a repeat
      // delivery (or a delivery that supersedes an earlier partial one)
      // ends in the same state rather than accumulating duplicates.
      await manager.delete(PipelineVariant, { jobId: job.id });

      if (Array.isArray(result.variants) && result.variants.length > 0) {
        const rows = result.variants
          .filter(
            (v): v is Record<string, unknown> => !!v && typeof v === 'object',
          )
          .map((v) =>
            manager.create(PipelineVariant, {
              jobId: job.id,
              chrom: asString(v.chrom),
              pos: asNumber(v.pos),
              ref: asString(v.ref),
              alt: asString(v.alt),
              effect: asString(v.effect),
              impact: asString(v.impact),
              gene: asString(v.gene),
              hgvsP: asString(v.hgvs_p),
              depth: asNumber(v.depth),
              alleleFreq: asNumber(v.allele_freq),
            }),
          );
        await manager.save(PipelineVariant, rows);
      }
    });
  }
}
