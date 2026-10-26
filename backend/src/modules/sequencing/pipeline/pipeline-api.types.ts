/**
 * Typed shapes for the rewritten external genomics pipeline service.
 *
 * The wire format is snake_case JSON; `PipelineApiService` is responsible for converting to/from
 * the camelCase domain shapes declared here. See that file for the field-by-field mapping.
 */

export type RunStatus =
  | 'QUEUED'
  | 'RUNNING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'CANCELLED';

export interface PipelineExtraInputSpec {
  /** The wire object's key. Also the key to use in extra_input_keys on submit. */
  name: string;
  /** Filename the pipeline expects to see, e.g. "primers.bed". */
  filename: string | null;
  extensions: string[];
  /** Only meaningful while the input is in use — see `when`. */
  required: boolean;
  title?: string;
  description?: string | null;
  /**
   * Condition for this input being "in use": each entry maps a dot path from
   * the params root to the scalar value it must equal there, and every entry
   * must hold. `{}` means always in use. The web client uses this to decide
   * which file picker to show.
   */
  when: Record<string, string | number | boolean>;
}

export interface PipelineDefinition {
  id: string;
  version: string;
  stages: string[];
  /** JSON Schema, draft 2020-12. Left untyped — it's consumer-defined and validated externally. */
  paramsSchema: Record<string, unknown>;
  acceptedExtensions: string[];
  /** Flattened from the wire's name-keyed object into a list. */
  extraInputs: PipelineExtraInputSpec[];
  displayName: string | null;
  description: string | null;
}

export interface SubmitRunPayload {
  pipelineId: string;
  externalId: string;
  ownerId: string;
  inputKey: string;
  inputFilename?: string;
  extraInputKeys?: Record<string, string>;
  params?: Record<string, unknown>;
  callbackUrl: string;
}

export interface SubmitRunResponse {
  runId: string;
  externalId: string;
  pipelineId: string;
  pipelineVersion: string;
  status: RunStatus;
  stages: string[];
  queuePosition: number | null;
  estimatedStartS: number | null;
}

export interface SubmitRunResult {
  run: SubmitRunResponse;
  /**
   * true when the service replied 200 — an idempotent replay of a run that already exists for
   * this `external_id`. false on a fresh 202 QUEUED response.
   */
  wasExisting: boolean;
}

export interface RunStageStatus {
  name: string;
  status: string;
  durationS?: number | null;
}

export interface RunRecord {
  runId: string;
  externalId: string;
  pipelineId: string;
  pipelineVersion?: string | null;
  status: RunStatus;
  stages?: unknown[] | null;
  params?: Record<string, unknown> | null;
  metrics?: Record<string, unknown> | null;
  stagePeakMemory?: Record<string, unknown> | null;
  artifacts?: unknown[] | null;
  webhookDeliveryState?: unknown | null;
  error?: string | null;
  durationS?: number | null;
  /**
   * These three are not explicitly named in the documented contract (which only says the full
   * record carries "artifacts" and "webhook delivery state"). Populated best-effort by
   * PipelineApiService — see the mapping-assumption note there. Consumers that need them
   * reliably should treat them as optional and fall back to `raw` if absent.
   */
  variants?: unknown[] | null;
  artifactsUploaded?: boolean;
  /** GET /v1/runs/{id} reports artifacts_purged, not artifacts_uploaded. */
  artifactsPurged?: boolean;
  /** GET /v1/runs/{id} reports error_message + error_stage, not `error`. */
  errorMessage?: string | null;
  errorStage?: string | null;
  artifactsError?: string | null;
  /** Untouched wire payload, for forward-compatibility with fields not modeled above. */
  raw: Record<string, unknown>;
}

export interface RunProgress {
  runId: string;
  externalId: string;
  status: RunStatus;
  stage: string | null;
  stageIndex: number | null;
  stageTotal: number | null;
  stageStartedAt: string | null;
  stageElapsedS: number | null;
  /** null when the pipeline has no history for this stage yet */
  stageTypicalS: number | null;
  /** null when the run is not currently RUNNING */
  heartbeatAgeS: number | null;
  etaS: number | null;
  etaAt: string | null;
  queuePosition: number | null;
  estimatedStartS: number | null;
  stages: RunStageStatus[];
}

export interface QueueRunningEntry {
  runId: string;
  pipelineId: string;
  stage: string;
  etaS: number | null;
}

export interface QueueStatus {
  workerConcurrency: number;
  queued: number;
  estimatedWaitS: number | null;
  running: QueueRunningEntry[];
}

/** The reupload contract doesn't specify a response body shape — treat it as an opaque ack. */
export type ReuploadArtifactsResult = Record<string, unknown>;

// ---- typed errors ----
//
// 404 / 413 / 422 must be distinguishable from a generic transport/server failure so callers
// (e.g. PipelineReconciliationService) can decide per-error-type whether to retry, skip, or
// surface to a human — never collapse these into one opaque 500.

export class PipelineApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly detail?: string,
  ) {
    super(message);
    this.name = 'PipelineApiError';
  }
}

export class PipelineNotFoundError extends PipelineApiError {
  constructor(detail?: string) {
    super(
      detail
        ? `Pipeline resource not found: ${detail}`
        : 'Pipeline resource not found',
      404,
      detail,
    );
    this.name = 'PipelineNotFoundError';
  }
}

export class PipelineInputTooLargeError extends PipelineApiError {
  constructor(detail?: string) {
    super(
      detail
        ? `Pipeline input too large: ${detail}`
        : 'Pipeline input too large',
      413,
      detail,
    );
    this.name = 'PipelineInputTooLargeError';
  }
}

export class PipelineValidationError extends PipelineApiError {
  constructor(detail?: string) {
    super(
      detail
        ? `Pipeline request rejected: ${detail}`
        : 'Pipeline request rejected',
      422,
      detail,
    );
    this.name = 'PipelineValidationError';
  }
}
