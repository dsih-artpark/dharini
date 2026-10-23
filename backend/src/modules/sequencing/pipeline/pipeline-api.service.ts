import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import {
  PipelineDefinition,
  PipelineExtraInputSpec,
  SubmitRunPayload,
  SubmitRunResponse,
  SubmitRunResult,
  RunRecord,
  RunProgress,
  RunStageStatus,
  QueueStatus,
  ReuploadArtifactsResult,
  RunStatus,
  PipelineApiError,
  PipelineNotFoundError,
  PipelineInputTooLargeError,
  PipelineValidationError,
} from './pipeline-api.types';

/** How long a fetched pipeline catalog is served from cache before refetching. */
const PIPELINES_CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * Typed client for the rewritten external genomics pipeline service.
 *
 * Env vars:
 *  - PIPELINE_URL: base URL of the pipeline service (required).
 *  - PIPELINE_API_KEY: optional. Auth is currently disabled service-side; per the confirmed
 *    contract we send the `X-API-Key` header only when this value is non-empty.
 */
@Injectable()
export class PipelineApiService {
  private readonly baseUrl: string;
  private readonly apiKey?: string;

  /**
   * `listPipelines()` is called on every sequencing submit (to derive
   * `platform`/`fileFormat`) as well as by `GET /sequencing/pipelines`, so
   * it's cached briefly here rather than re-fetched from the pipeline
   * service on every call.
   */
  private pipelinesCache: {
    data: PipelineDefinition[];
    expiresAt: number;
  } | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.baseUrl = this.configService.getOrThrow<string>('PIPELINE_URL');
    this.apiKey = this.configService.get<string>('PIPELINE_API_KEY');
  }

  async listPipelines(): Promise<PipelineDefinition[]> {
    if (this.pipelinesCache && this.pipelinesCache.expiresAt > Date.now()) {
      return this.pipelinesCache.data;
    }

    const data = await this.request<any[]>('get', '/v1/pipelines');
    const mapped = (data ?? []).map((p) => this.mapPipeline(p));
    this.pipelinesCache = {
      data: mapped,
      expiresAt: Date.now() + PIPELINES_CACHE_TTL_MS,
    };
    return mapped;
  }

  /**
   * Best-effort lookup for deriving submission metadata (`platform`,
   * `fileFormat`) at submit time. Unlike `listPipelines()`, this never
   * throws — a submission must not fail just because the pipeline catalog
   * was slow or unreachable, so a fetch failure resolves to `null` and
   * callers fall back accordingly (e.g. platform falls back to
   * `pipelineId`).
   */
  async findPipelineSafe(
    pipelineId: string,
  ): Promise<PipelineDefinition | null> {
    try {
      const pipelines = await this.listPipelines();
      return pipelines.find((p) => p.id === pipelineId) ?? null;
    } catch {
      return null;
    }
  }

  async submitRun(payload: SubmitRunPayload): Promise<SubmitRunResult> {
    const body = {
      pipeline_id: payload.pipelineId,
      external_id: payload.externalId,
      owner_id: payload.ownerId,
      input_key: payload.inputKey,
      input_filename: payload.inputFilename,
      extra_input_keys: payload.extraInputKeys,
      params: payload.params,
      callback_url: payload.callbackUrl,
    };

    const { data, status } = await this.rawRequest('post', '/v1/runs', body);
    return {
      run: this.mapSubmitResponse(data),
      // 202 = fresh run just queued; 200 = idempotent replay of a run already submitted
      // under this external_id.
      wasExisting: status === 200,
    };
  }

  async getRun(runId: string): Promise<RunRecord> {
    const data = await this.request<any>('get', `/v1/runs/${runId}`);
    return this.mapRunRecord(data);
  }

  async getRunProgress(runId: string): Promise<RunProgress> {
    const data = await this.request<any>('get', `/v1/runs/${runId}/progress`);
    return this.mapRunProgress(data);
  }

  async getQueue(): Promise<QueueStatus> {
    const data = await this.request<any>('get', '/v1/queue');
    return this.mapQueueStatus(data);
  }

  async reuploadArtifacts(runId: string): Promise<ReuploadArtifactsResult> {
    return this.request<ReuploadArtifactsResult>(
      'post',
      `/v1/runs/${runId}/reupload`,
    );
  }

  // ---- HTTP plumbing ----

  private authHeaders(): Record<string, string> {
    return this.apiKey ? { 'X-API-Key': this.apiKey } : {};
  }

  private async request<T>(
    method: 'get' | 'post',
    path: string,
    body?: unknown,
  ): Promise<T> {
    const { data } = await this.rawRequest(method, path, body);
    return data as T;
  }

  private async rawRequest(
    method: 'get' | 'post',
    path: string,
    body?: unknown,
  ): Promise<{ data: any; status: number }> {
    const url = `${this.baseUrl}${path}`;
    const headers = this.authHeaders();

    try {
      const response = await firstValueFrom(
        method === 'get'
          ? this.httpService.get(url, { headers })
          : this.httpService.post(url, body, { headers }),
      );
      return { data: response.data, status: response.status };
    } catch (err) {
      throw this.toTypedError(err as AxiosError, path);
    }
  }

  private toTypedError(err: AxiosError, path: string): Error {
    const status = err.response?.status;
    const responseBody = err.response?.data as { detail?: string } | undefined;
    const detail = responseBody?.detail;

    if (status === 404) return new PipelineNotFoundError(detail);
    if (status === 413) return new PipelineInputTooLargeError(detail);
    if (status === 422) return new PipelineValidationError(detail);

    return new PipelineApiError(
      `Pipeline API request to ${path} failed: ${detail ?? err.message}`,
      status,
      detail,
    );
  }

  // ---- wire (snake_case) -> domain (camelCase) mapping ----

  private mapPipeline(p: any): PipelineDefinition {
    // Keeps only string/number/boolean entries of a `when` condition object.
    // A missing, non-object or array `when` becomes {} ("always in use") and
    // a non-scalar entry is dropped, rather than throwing — matching
    // mapExtraInputs' general tolerance of malformed wire data. The pipeline's
    // own contract tests reject non-scalar conditions, so neither happens today.
    const mapWhen = (raw: any): Record<string, string | number | boolean> => {
      if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
        return {};
      }
      const when: Record<string, string | number | boolean> = {};
      for (const [key, value] of Object.entries(raw)) {
        if (
          typeof value === 'string' ||
          typeof value === 'number' ||
          typeof value === 'boolean'
        ) {
          when[key] = value;
        }
      }
      return when;
    };

    const mapExtraInputs = (raw: any): PipelineExtraInputSpec[] => {
      if (!raw) return [];
      const entries: [string, any][] = Array.isArray(raw)
        ? raw.map((e) => [e?.name, e])
        : Object.entries(raw);
      return entries
        .filter(([name]) => !!name)
        .map(([name, e]) => ({
          name,
          filename: e?.filename ?? null,
          extensions: e?.extensions ?? [],
          required: !!e?.required,
          title: e?.title ?? name,
          description: e?.description ?? null,
          when: mapWhen(e?.when),
        }));
    };

    return {
      id: p.id,
      version: p.version,
      stages: p.stages ?? [],
      paramsSchema: p.params_schema ?? {},
      acceptedExtensions: p.accepted_extensions ?? [],
      displayName: p.display_name ?? null,
      description: p.description ?? null,
      // The wire sends extra_inputs as an object keyed by input name
      // ({"primer_bed": {...}}), NOT an array — the key IS the name, and it is
      // also the key used in extra_input_keys on submit. An array is tolerated
      // too so a future contract change doesn't break this.
      extraInputs: mapExtraInputs(p.extra_inputs),
    };
  }

  private mapSubmitResponse(d: any): SubmitRunResponse {
    return {
      runId: d.run_id,
      externalId: d.external_id,
      pipelineId: d.pipeline_id,
      pipelineVersion: d.pipeline_version,
      status: d.status as RunStatus,
      stages: d.stages ?? [],
      queuePosition: d.queue_position ?? null,
      estimatedStartS: d.estimated_start_s ?? null,
    };
  }

  private mapRunRecord(d: any): RunRecord {
    return {
      runId: d.run_id,
      externalId: d.external_id,
      pipelineId: d.pipeline_id,
      pipelineVersion: d.pipeline_version ?? null,
      status: d.status as RunStatus,
      stages: d.stages ?? null,
      params: d.params ?? null,
      metrics: d.metrics ?? null,
      stagePeakMemory: d.stage_peak_memory ?? d.peak_memory_by_stage ?? null,
      artifacts: d.artifacts ?? null,
      webhookDeliveryState: d.webhook_delivery_state ?? d.webhook ?? null,
      error: d.error ?? d.error_message ?? null,
      errorStage: d.error_stage ?? null,
      durationS: d.duration_s ?? null,
      variants: d.variants ?? null,
      artifactsUploaded: d.artifacts_uploaded,
      artifactsError: d.artifacts_upload_error ?? d.artifacts_error ?? null,
      raw: d,
    };
  }

  private mapRunProgress(d: any): RunProgress {
    return {
      runId: d.run_id,
      externalId: d.external_id,
      status: d.status as RunStatus,
      stage: d.stage ?? null,
      stageIndex: d.stage_index ?? null,
      stageTotal: d.stage_total ?? null,
      stageStartedAt: d.stage_started_at ?? null,
      stageElapsedS: d.stage_elapsed_s ?? null,
      stageTypicalS: d.stage_typical_s ?? null,
      heartbeatAgeS: d.heartbeat_age_s ?? null,
      etaS: d.eta_s ?? null,
      etaAt: d.eta_at ?? null,
      queuePosition: d.queue_position ?? null,
      estimatedStartS: d.estimated_start_s ?? null,
      stages: (d.stages ?? []).map(
        (s: any): RunStageStatus => ({
          name: s.name,
          status: s.status,
          durationS: s.duration_s ?? null,
        }),
      ),
    };
  }

  private mapQueueStatus(d: any): QueueStatus {
    return {
      workerConcurrency: d.worker_concurrency,
      queued: d.queued,
      estimatedWaitS: d.estimated_wait_s ?? null,
      running: (d.running ?? []).map((r: any) => ({
        runId: r.run_id,
        pipelineId: r.pipeline_id,
        stage: r.stage,
        etaS: r.eta_s ?? null,
      })),
    };
  }
}
