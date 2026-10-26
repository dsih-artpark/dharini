import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  SequencingJob,
  JobStatus,
} from '../../../entities/sequencing-job.entity';
import { PipelineApiService } from './pipeline-api.service';
import { RunRecord, RunStatus } from './pipeline-api.types';
import { RunResultService, TerminalRunResult } from './run-result.service';

/** Jobs older than this with no terminal local status are considered stale and reconciled. */
/**
 * Default age before a non-terminal job is reconciled. An hour is right in
 * production, where the webhook is the primary path and this only covers
 * abandoned deliveries.
 *
 * Override with SEQUENCING_RECONCILE_AFTER_S for local development: the
 * pipeline runs on a public host and cannot deliver a webhook to localhost,
 * so the sweep is the ONLY way a run reaches a terminal state on a developer
 * machine. Set it to something like 60 rather than waiting an hour.
 */
const DEFAULT_RECONCILE_AFTER_MS = 60 * 60 * 1000;

const TERMINAL_PIPELINE_STATUSES: ReadonlySet<RunStatus> = new Set([
  'SUCCEEDED',
  'FAILED',
  'CANCELLED',
]);

/**
 * Sweeps sequencing jobs that were submitted more than an hour ago and are still sitting in a
 * non-terminal local status, re-fetches their run record from the pipeline, and applies any
 * terminal result via RunResultService.
 *
 * Why this exists: the pipeline's completion webhook has a finite retry budget. Once exhausted,
 * a delivery is ABANDONED and Dharini would never otherwise learn the run finished. This sweep
 * is also the only completion path during local development, since the pipeline runs on a
 * public host and cannot call a developer's localhost callback URL.
 */
@Injectable()
export class PipelineReconciliationService {
  private readonly logger = new Logger(PipelineReconciliationService.name);
  private readonly reconcileAfterMs: number;

  constructor(
    @InjectRepository(SequencingJob)
    private readonly jobRepo: Repository<SequencingJob>,
    private readonly pipelineApi: PipelineApiService,
    private readonly runResultService: RunResultService,
    private readonly configService: ConfigService,
  ) {
    const configured = Number(
      this.configService.get<string>('SEQUENCING_RECONCILE_AFTER_S'),
    );
    this.reconcileAfterMs =
      Number.isFinite(configured) && configured > 0
        ? configured * 1000
        : DEFAULT_RECONCILE_AFTER_MS;
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async reconcileStaleJobs(): Promise<void> {
    const candidates = await this.jobRepo.find({
      where: [
        { status: JobStatus.SUBMITTED },
        { status: JobStatus.PROCESSING },
      ],
    });

    const cutoff = Date.now() - this.reconcileAfterMs;
    const staleJobs = candidates.filter(
      (job) => job.createdAt.getTime() <= cutoff,
    );

    if (staleJobs.length === 0) return;

    this.logger.log(
      `[Reconciliation] Sweeping ${staleJobs.length} stale job(s)...`,
    );

    for (const job of staleJobs) {
      await this.reconcileJob(job);
    }
  }

  private async reconcileJob(job: SequencingJob): Promise<void> {
    const runId = this.getPipelineRunId(job);
    if (!runId) {
      this.logger.warn(
        `[Reconciliation] Job ${job.id} has no pipeline run id recorded, skipping`,
      );
      return;
    }

    try {
      const run = await this.pipelineApi.getRun(runId);

      if (!TERMINAL_PIPELINE_STATUSES.has(run.status)) {
        this.logger.log(
          `[Reconciliation] Run ${runId} still ${run.status}, leaving alone`,
        );
        return;
      }

      await this.runResultService.applyTerminalResult(
        this.toTerminalRunResult(run, job),
      );
      this.logger.log(
        `[Reconciliation] Applied terminal result for run ${runId} (${run.status})`,
      );
    } catch (error: any) {
      // A transport/typed-API error on one job must not abort the sweep for the rest.
      this.logger.error(
        `[Reconciliation] Failed to reconcile job ${job.id} (run ${runId}): ${error.message}`,
      );
    }
  }

  /**
   * ASSUMPTION: the submission flow (owned by another agent, in sequencing-jobs.service.ts,
   * being rewritten against POST /v1/runs) records the pipeline's `run_id` in
   * `job.externalJobId` — the same column that used to hold the old service's `job_id`, since
   * both play the same "identifier used to poll this job's status" role.
   *
   * If the real implementation instead lands the run_id in `job.runId` (previously populated
   * only on completion for the visualization endpoint), update this one accessor — nothing
   * else in this file needs to change.
   */
  private getPipelineRunId(job: SequencingJob): string | null {
    return job.runId;
  }

  /**
   * VERIFIED against the live service: GET /v1/runs/{run_id} does NOT return
   * `external_id` (only /progress does), and carries no `variants`,
   * `artifacts_uploaded` or `artifacts_error`. So `externalId` is taken from
   * the job row we already loaded rather than from the response — it is a
   * value Dharini generated and owns, and trusting the pipeline to echo it
   * back made every sweep throw "externalId is required", which silently
   * disabled reconciliation entirely.
   *
   * `variants` are absent here by design; they arrive inline on the webhook.
   * A run reconciled via this path therefore has metrics but no variant rows
   * until a webhook delivery lands.
   */
  private toTerminalRunResult(
    run: RunRecord,
    job: SequencingJob,
  ): TerminalRunResult {
    return {
      runId: run.runId,
      externalId: job.externalId ?? run.externalId,
      status: run.status as 'SUCCEEDED' | 'FAILED' | 'CANCELLED',
      durationS: run.durationS ?? null,
      error: run.error ?? run.errorMessage ?? null,
      metrics: run.metrics ?? null,
      stages: run.stages ?? null,
      variants: run.variants ?? null,
      artifacts: run.artifacts ?? null,
      // The run record has no artifacts_uploaded; it reports artifacts_purged.
      // Not-purged means the objects are still in S3 and presignable.
      artifactsUploaded:
        run.artifactsUploaded ??
        (run.artifactsPurged === undefined ? undefined : !run.artifactsPurged),
      artifactsError: run.artifactsError ?? null,
    };
  }
}
