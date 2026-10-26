export type SequencingRecordStatus =
  "completed" | "in_progress" | "queued" | "failed" | "cancelled";
export type SourceType = "lab" | "ncbi" | "manual";

/**
 * The pipeline's status vocabulary, emitted by GET /sequencing/jobs/:id/progress
 * from both its branches and by POST /sequencing/jobs/submit. Note SUCCEEDED,
 * not COMPLETED — "completed" is the local SequencingJob["status"] value and
 * never appears on these endpoints.
 */
export type SequencingJobLiveStatus =
  "QUEUED" | "RUNNING" | "SUCCEEDED" | "FAILED" | "CANCELLED";

// ---------------------------------------------------------------------------
// JSON Schema (Draft 2020-12) — trimmed to the subset the params form needs.
// ---------------------------------------------------------------------------
export type JsonSchemaPrimitiveType =
  "string" | "number" | "integer" | "boolean" | "array" | "object";

export interface JsonSchemaProperty {
  type?: JsonSchemaPrimitiveType | JsonSchemaPrimitiveType[];
  title?: string;
  description?: string;
  default?: unknown;
  enum?: (string | number)[];
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  items?: JsonSchemaProperty;
  [key: string]: unknown;
}

export interface JsonSchema {
  type?: "object";
  properties?: Record<string, JsonSchemaProperty>;
  required?: string[];
  [key: string]: unknown;
}

export interface PipelineExtraInput {
  /** Also the key to send this file's object key under in extraInputKeys. */
  name: string;
  /** Filename the pipeline renames this upload to server-side, e.g. "primers.bed". */
  filename: string | null;
  extensions: string[];
  required: boolean;
  title: string;
  description: string | null;
  /**
   * Dot-path conditions (relative to the params root) this input must
   * satisfy to be in use, e.g. {"primer.enabled": true, "primer.tool":
   * "align_trim"} — every path's value must equal the given one. `{}` means
   * always in use, which is also what the backend maps an older pipeline
   * that doesn't send `when` to. `required` applies only while in use — see
   * isExtraInputInUse in submission-relevance-map.ts.
   */
  when: Record<string, string | number | boolean>;
}

export interface SequencingPipeline {
  id: string;
  version: string;
  /** Human-facing name, e.g. "Oxford Nanopore — LSDV". Falls back to id. */
  displayName: string | null;
  description: string | null;
  stages: string[];
  paramsSchema: JsonSchema;
  acceptedExtensions: string[];
  extraInputs: PipelineExtraInput[];
}

// ---------------------------------------------------------------------------
// Presigned upload
// ---------------------------------------------------------------------------
export interface PresignedUploadResponse {
  key: string;
  uploadUrl: string;
  contentType: string;
  expiresIn: number;
}

// ---------------------------------------------------------------------------
// Job submission
// ---------------------------------------------------------------------------
// File format, library type, platform and sequencing method are deliberately
// absent: the chosen pipeline determines all four, and the backend derives
// them at submit time (format from the filename, platform from the pipeline's
// display name). Sending them from here would let the form disagree with the
// pipeline that actually ran.
export interface SubmitSequencingJobPayload {
  sourceType: SourceType;
  labTestId?: string;
  ncbiAccession?: string;
  manualSampleBarcode?: string;
  manualSiteName?: string;
  projectId?: string;
  pipelineId: string;
  inputKey: string | null;
  inputFilename?: string;
  extraInputKeys?: Record<string, string>;
  params?: Record<string, unknown>;
}

export interface SubmitSequencingJobResponse {
  submissionId: string;
  jobId: string;
  seqId: string;
  externalId: string;
  runId: string;
  status: SequencingJobLiveStatus;
  queuePosition: number | null;
  estimatedStartS: number | null;
}

/**
 * What the modal hands back on a successful submit, used to show an optimistic
 * row until the refetch lands. Carries the pipeline rather than file format or
 * sequencing method: those are derived server-side now, so the client cannot
 * know them at submit time and would only be able to supply empty strings.
 */
export interface SubmittedSequenceJob {
  sampleId: string;
  fileNames: string[];
  pipelineId: string;
  pipelineLabel: string;
}

// ---------------------------------------------------------------------------
// Live progress + queue
// ---------------------------------------------------------------------------
export interface JobStageStatus {
  name: string;
  status: string;
  durationS: number | null;
}

export interface JobProgress {
  status: SequencingJobLiveStatus;
  stage: string | null;
  stageIndex: number | null;
  stageTotal: number | null;
  stageElapsedS: number | null;
  stageTypicalS: number | null;
  heartbeatAgeS: number | null;
  etaS: number | null;
  queuePosition: number | null;
  estimatedStartS: number | null;
  stages: JobStageStatus[];
}

// Mirrors GET /sequencing/queue -> data.running[], which proxies the
// pipeline's /v1/queue. Worker concurrency is 1, so this holds at most one
// entry in practice — a second submission genuinely waits for it to finish.
export interface QueueRunningEntry {
  runId: string;
  pipelineId: string;
  stage: string | null;
  etaS: number | null;
}

export interface QueueStatus {
  workerConcurrency: number;
  queued: number;
  estimatedWaitS: number | null;
  running: QueueRunningEntry[];
}

// ---------------------------------------------------------------------------
// Results: variants + artifacts
// ---------------------------------------------------------------------------
export interface SequencingVariant {
  chrom: string;
  pos: number;
  ref: string;
  alt: string;
  effect: string;
  impact: "HIGH" | "MODERATE" | "LOW" | "MODIFIER" | string;
  gene: string;
  hgvsP: string | null;
  depth: number | null;
  alleleFreq: number | null;
}

export interface SequencingArtifact {
  kind: string;
  label: string;
  filename: string;
  sizeBytes: number;
  contentType: string;
}

/**
 * GET /sequencing/jobs/:id/artifacts/:filename/url -> a presigned S3 GET
 * minted on demand for exactly one artifact. `inline=true` renders in the
 * browser (Content-Disposition: inline); omitting it downloads
 * (Content-Disposition: attachment). Expires in ~1 hour, so it's fetched
 * fresh right before use — never cached across an idle panel.
 */
export interface ArtifactUrlResponse {
  url: string;
  filename: string;
  contentType: string;
}

/**
 * A job's freeform `metrics` blob — shape isn't part of the rewritten
 * contract, so every field is optional and rendered defensively. Seen in
 * practice on a completed snippy-fasta run: variant/snp/indel counts plus
 * two open-ended breakdowns (by_impact keyed by SequencingVariant["impact"],
 * by_effect keyed by an arbitrary SnpEff effect name). Never assume any
 * particular by_effect key exists — render the top few by count.
 */
export interface SequencingJobMetrics {
  variant_count?: number;
  snp_count?: number;
  indel_count?: number;
  by_impact?: Partial<Record<"HIGH" | "MODERATE" | "LOW" | "MODIFIER", number>>;
  by_effect?: Record<string, number>;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Job / submission list entities (GET /sequencing/jobs, GET /sequencing)
// These endpoints were not part of the rewritten contract, so their shape is
// kept as-is minus the fields the contract explicitly retires.
// ---------------------------------------------------------------------------
export interface SequencingJob {
  id: string;
  submissionId: string;
  status: "submitted" | "processing" | "completed" | "failed" | "cancelled";
  externalJobId: string | null;
  apiResponse: Record<string, unknown>;
  apiStatus: string | null;
  runId: string | null;
  /** Set on both submit-time and pipeline-reported failures. */
  errorMessage: string | null;
  pipelineId: string | null;
  pipelineVersion: string | null;
  /** Name of the most recently known pipeline stage. */
  stage: string | null;
  durationS: number | null;
  finishedAt: string | null;
  /** Optional job metrics (e.g. variant_count, snp_count) — shape not specified by the contract, rendered defensively if present. */
  metrics?: SequencingJobMetrics | null;
  createdAt: string;
  updatedAt: string;
}

export interface SequencingProcessingJob {
  id: string;
  seqId: string; // SEQ-2026-001 — shown to user
  sampleId: string;
  fileName: string;
  status: SequencingJob["status"];
  startTime: string;
  runId?: string | null;
  errorMessage: string | null;
  metrics?: SequencingJobMetrics | null;
  /** Which pipeline ran this job — shown as a run fact once results are in. */
  pipelineId: string | null;
  pipelineVersion: string | null;
  durationS: number | null;
  finishedAt: string | null;
}

export interface SequencingRecord {
  id: string;
  sampleId: string;
  siteName: string;
  submissionDate: string;
  createdAt: string;
  status: SequencingRecordStatus;
  fileFormat: string;
  sequencingMethod: string;
  /** Which pipeline ran this record's job, e.g. pipelineId "ont-lsdv", pipelineVersion "1.2". Null until a job exists. */
  pipelineId: string | null;
  pipelineVersion: string | null;
  /** Variants called for this run (from the job's metrics blob). Null when genuinely unknown — never a fabricated 0. */
  variantCount: number | null;
  jobId?: string;
}

export interface SequencingSubmission {
  id: string;
  seqId: string;
  sourceType: "lab" | "ncbi" | "manual";
  sampleBarcode: string;
  siteName: string;
  diseaseName?: string;
  fileFormat: string;
  libraryType: string;
  platform: string;
  sequencingMethod: string;
  filePathR1: string;
  filePathR2?: string;
  ncbiAccession?: string;
  status: "pending" | "submitted" | "processing" | "completed" | "failed";
  submissionDate: string;
  createdAt: string;
  updatedAt: string;
}
