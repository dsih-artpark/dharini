"use client";

import {
  AlertTriangle,
  CheckCircle,
  Download,
  Eye,
  ExternalLink,
  FileText,
  Hourglass,
  Loader2,
  RefreshCw,
  Sparkles,
  StopCircle,
  WifiOff,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  getArtifactUrlApi,
  getJobArtifactsApi,
  getJobVariantsApi,
  retrySequencingJobApi,
} from "../../app/(dashboard)/sequencing/loader";
import type {
  JobProgress,
  JobStageStatus,
  QueueStatus,
  SequencingArtifact,
  SequencingJobLiveStatus,
  SequencingProcessingJob,
  SequencingRecord,
  SequencingVariant,
} from "../../app/(dashboard)/sequencing/sequencing-processing-types";
import RunMetricsSummary, { CopyButton } from "./run-metrics-summary";
import RunVariantsTable from "./run-variants-table";
import NativeGenomicVisualizerModal from "./native-genomic-visualizer-modal";

type Props = {
  record: SequencingRecord;
  job?: SequencingProcessingJob;
  /** Live progress for this job, from the records section's single shared poll. Undefined until the next tick picks it up. */
  progress?: JobProgress;
  /** Global queue snapshot, fetched once by the dashboard — not per panel. */
  queue: QueueStatus | null;
  /** Ask the dashboard to refetch the submissions + jobs lists now — used
   *  after a successful retry, since that mints a run this panel has no
   *  other way to learn about (it isn't a poll target until the list knows
   *  its job id). */
  onRefetchNeeded: () => void;
};

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-40 focus-visible:ring-offset-2";

// Formats a raw second count the way the rest of the panel needs it: "45s",
// "12m", "1h 5m". Never a fabricated percentage — see the "never fabricate
// progress" rule in the brief.
function formatDurationShort(totalSeconds: number | null | undefined): string {
  if (totalSeconds == null || Number.isNaN(totalSeconds)) return "—";
  const seconds = Math.max(0, Math.round(totalSeconds));
  if (seconds < 60) return `${seconds}s`;
  const totalMinutes = Math.round(seconds / 60);
  if (totalMinutes < 60) return `${totalMinutes}m`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes;
  let unitIndex = -1;
  do {
    value /= 1024;
    unitIndex++;
  } while (value >= 1024 && unitIndex < units.length - 1);
  return `${value.toFixed(1)} ${units[unitIndex]}`;
}

// The visualization ships as `kind: "report"` with an HTML content type —
// not `kind: "visualization"`. Matching on kind alone is one brittle
// equality check away from silently finding nothing, so this also accepts
// the content type and the well-known filename.
function isVisualizationArtifact(artifact: SequencingArtifact): boolean {
  return (
    artifact.kind === "report" ||
    artifact.kind === "visualization" ||
    artifact.contentType === "text/html" ||
    artifact.filename === "visualization.html"
  );
}

// Static variant — used only when there's no job at all to retry (the
// submission failed before a run could even be created).
function FailedBannerStatic({
  heading,
  body,
}: {
  heading: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-red-20 bg-red-10 p-4">
      <AlertTriangle className="h-5 w-5 shrink-0 text-red-30" />
      <div>
        <p className="text-sm font-semibold text-red-30">{heading}</p>
        <p className="mt-1 text-sm text-red-30">{body}</p>
        <p className="mt-1 text-sm text-red-30">
          Re-submit the file, or contact support if this keeps happening.
        </p>
      </div>
    </div>
  );
}

type RetryStatus = "idle" | "pending" | "error";

// The raw pipeline error used to be rendered verbatim here — useful for a
// developer, meaningless (or alarming) for the end user reading it. This
// shows a plain-language statement instead, keeps the technical string
// reachable but collapsed for anyone who does want it, and adds a way to
// actually act on the failure instead of just reading about it.
function FailedBanner({
  jobId,
  runId,
  errorMessage,
  onRefetchNeeded,
}: {
  jobId: string;
  runId?: string | null;
  errorMessage?: string | null;
  onRefetchNeeded: () => void;
}) {
  const [retryStatus, setRetryStatus] = useState<RetryStatus>("idle");
  const [retryErrorMessage, setRetryErrorMessage] = useState<string | null>(
    null,
  );
  const trimmedTechnicalDetail = errorMessage?.trim();

  const handleRetry = async () => {
    if (retryStatus === "pending") return;
    setRetryStatus("pending");
    setRetryErrorMessage(null);
    try {
      await retrySequencingJobApi(jobId);
      toast.success("A new run has started — this record will update shortly.");
      setRetryStatus("idle");
      onRefetchNeeded();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to retry this run.";
      setRetryStatus("error");
      setRetryErrorMessage(message);
      toast.error(message);
    }
  };

  return (
    <div className="flex items-start gap-3 rounded-lg border border-red-20 bg-red-10 p-4">
      <AlertTriangle className="h-5 w-5 shrink-0 text-red-30" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-red-30">This run failed</p>
          {runId && (
            <div className="flex items-center gap-1.5 rounded bg-red-20/40 px-2 py-0.5 text-xs text-red-30">
              <span className="font-medium">Run ID:</span>
              <span className="font-mono font-semibold">{runId}</span>
              <CopyButton text={runId} label="Run ID" />
            </div>
          )}
        </div>
        <p className="mt-1 text-sm text-red-30">
          Something went wrong before this run could finish.
        </p>
        <p className="mt-1 text-sm text-red-30">
          Re-submit the file, or contact support if this keeps happening.
        </p>

        {retryStatus === "error" && retryErrorMessage && (
          <p className="mt-2 text-sm font-medium text-red-30">
            {retryErrorMessage}
          </p>
        )}

        <button
          type="button"
          onClick={handleRetry}
          disabled={retryStatus === "pending"}
          className={`mt-3 inline-flex h-9 items-center gap-2 rounded-lg bg-red-30 px-3 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-70 ${FOCUS_RING}`}
        >
          {retryStatus === "pending" ? (
            <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {retryStatus === "pending"
            ? "Starting a new run…"
            : retryStatus === "error"
              ? "Retry run again"
              : "Retry run"}
        </button>

        {trimmedTechnicalDetail && (
          <details className="mt-3">
            <summary
              className={`w-fit cursor-pointer text-xs font-medium text-red-30 underline decoration-red-30/40 underline-offset-2 ${FOCUS_RING}`}
            >
              Technical details
            </summary>
            <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-red-20 bg-white p-3 text-xs text-grey-70">
              {trimmedTechnicalDetail}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

function CancelledBanner() {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-grey-30 bg-grey-10 p-4">
      <StopCircle className="h-5 w-5 shrink-0 text-grey-70" />
      <div>
        <p className="text-sm font-semibold text-grey-90">
          This run was cancelled
        </p>
        <p className="mt-1 text-sm text-grey-70">
          It was stopped before finishing. Re-submit the file to run it again.
        </p>
      </div>
    </div>
  );
}

// Queued-only banner. Worker concurrency is 1, so a second submission
// genuinely waits — the copy and the running[] context exist specifically
// so a queued run doesn't read as a broken one (the single most common
// misreading of this page per the brief).
function QueueBanner({
  progress,
  queue,
}: {
  progress: JobProgress;
  queue: QueueStatus | null;
}) {
  const runningNow = queue?.running?.[0] ?? null;
  return (
    <div className="rounded-lg border border-blue-20 bg-blue-10 p-4">
      <div className="flex items-center gap-2">
        <Hourglass className="h-4 w-4 text-blue-40" />
        <p className="text-sm font-semibold text-blue-40">Queued — not stuck</p>
      </div>
      <p className="mt-1 text-sm text-grey-70">
        {progress.queuePosition != null
          ? `Position ${progress.queuePosition} in line`
          : "Waiting for a worker to free up"}
        {progress.estimatedStartS != null &&
          ` · starts in about ${formatDurationShort(progress.estimatedStartS)}`}
      </p>
      {queue && (
        <p className="mt-2 text-xs text-grey-70">
          Only {queue.workerConcurrency} run
          {queue.workerConcurrency === 1 ? "s" : ""} at a time
          {queue.queued > 0 &&
            ` · ${queue.queued} job${queue.queued === 1 ? "" : "s"} ahead`}
          {queue.estimatedWaitS != null &&
            ` · typical wait about ${formatDurationShort(queue.estimatedWaitS)}`}
          .
        </p>
      )}
      {runningNow && (
        <p className="mt-1 text-xs text-grey-70">
          Currently running:{" "}
          {runningNow.stage ? `stage "${runningNow.stage}"` : "starting up"}
          {runningNow.etaS != null &&
            ` · about ${formatDurationShort(runningNow.etaS)} left`}
          .
        </p>
      )}
    </div>
  );
}

type StageTrackerProps = {
  stages: JobStageStatus[];
  stageIndex: number | null;
  stageTotal: number | null;
  overallStatus: SequencingJobLiveStatus;
  stageElapsedS: number | null;
  stageTypicalS: number | null;
  heartbeatStale: boolean;
  runId?: string | null;
};

// The signature element of this page: a rail driven entirely by the
// pipeline's own stages[] — any length, any names, no hardcoded step count.
// It never draws a percentage: the honest unit of progress here is "which
// named stage," not a fraction within one (minimap2/Clair3/Medaka emit
// nothing machine-readable for that).
function StageTracker({
  stages,
  stageIndex,
  stageTotal,
  overallStatus,
  stageElapsedS,
  stageTypicalS,
  heartbeatStale,
  runId,
}: StageTrackerProps) {
  const activeIndex = stageIndex ?? -1;
  const total = stageTotal ?? stages.length;

  if (stages.length === 0) {
    return (
      <div className="rounded-xl border border-grey-20 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-grey-90">
            Pipeline stages
          </h3>
          {runId && (
            <div className="flex items-center gap-1.5 rounded-md border border-grey-20 bg-grey-10 px-2 py-0.5 text-xs text-grey-70">
              <span className="font-medium text-grey-60">Run ID:</span>
              <span className="font-mono font-medium text-grey-90">
                {runId}
              </span>
              <CopyButton text={runId} label="Run ID" />
            </div>
          )}
        </div>
        <p className="mt-2 text-sm text-grey-70">
          Preparing this run — stages will appear here once it starts.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-grey-20 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-grey-90">
            Pipeline stages
          </h3>
          {runId && (
            <div className="flex items-center gap-1.5 rounded-md border border-grey-20 bg-grey-10 px-2 py-0.5 text-xs text-grey-70">
              <span className="font-medium text-grey-60">Run ID:</span>
              <span className="font-mono font-medium text-grey-90">
                {runId}
              </span>
              <CopyButton text={runId} label="Run ID" />
            </div>
          )}
        </div>
        {overallStatus === "SUCCEEDED" ? (
          <span className="text-xs font-medium text-teal-30">
            All {total} stages complete
          </span>
        ) : activeIndex >= 0 ? (
          <span className="text-xs font-medium text-grey-70">
            Stage {activeIndex + 1} of {total}
          </span>
        ) : null}
      </div>

      <div className="mt-5 overflow-x-auto pb-1">
        <div className="flex items-start">
          {stages.map((stage, index) => {
            const explicitStatus = (stage.status || "").toUpperCase();
            const isFailedStage =
              explicitStatus === "FAILED" ||
              (overallStatus === "FAILED" && index === activeIndex);
            const isCancelledStage =
              !isFailedStage &&
              overallStatus === "CANCELLED" &&
              index === activeIndex;
            const isDone =
              !isFailedStage &&
              !isCancelledStage &&
              (explicitStatus === "SUCCEEDED" ||
                overallStatus === "SUCCEEDED" ||
                index < activeIndex);
            const isActive =
              !isDone &&
              !isFailedStage &&
              !isCancelledStage &&
              index === activeIndex &&
              overallStatus === "RUNNING";
            const isStalled = isActive && heartbeatStale;

            return (
              <div key={`${stage.name}-${index}`} className="flex items-start">
                <div className="flex min-w-[84px] max-w-[104px] shrink-0 flex-col items-center gap-2 text-center">
                  <div
                    className={[
                      "flex h-11 w-11 items-center justify-center rounded-full border-[3px] text-sm font-semibold transition-colors motion-reduce:transition-none",
                      isFailedStage
                        ? "border-red-30 bg-red-30 text-white"
                        : isCancelledStage
                          ? "border-grey-60 bg-grey-20 text-grey-70"
                          : isDone
                            ? "border-teal-30 bg-teal-30 text-white"
                            : isStalled
                              ? "border-yellow-30 bg-yellow-10 text-yellow-30 ring-4 ring-yellow-30/20"
                              : isActive
                                ? "border-blue-40 bg-blue-10 text-blue-40 ring-4 ring-blue-40/20"
                                : "border-grey-30 bg-white text-grey-60",
                    ].join(" ")}
                  >
                    {isFailedStage ? (
                      <XCircle className="h-5 w-5" />
                    ) : isCancelledStage ? (
                      <StopCircle className="h-5 w-5" />
                    ) : isDone ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : isStalled ? (
                      <WifiOff className="h-5 w-5" />
                    ) : isActive ? (
                      <Loader2 className="h-5 w-5 animate-spin motion-reduce:animate-none" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span
                    className={[
                      "max-w-[100px] truncate text-sm font-medium leading-5",
                      isFailedStage
                        ? "text-red-30"
                        : isActive || isStalled
                          ? "text-blue-40"
                          : "text-grey-70",
                    ].join(" ")}
                    title={stage.name}
                  >
                    {stage.name}
                  </span>
                  {isDone && stage.durationS != null && (
                    <span className="text-xs text-grey-60">
                      {formatDurationShort(stage.durationS)}
                    </span>
                  )}
                  {isActive && !isStalled && (
                    <span className="text-xs text-grey-70">
                      {formatDurationShort(stageElapsedS)}
                      {stageTypicalS != null &&
                        ` / ~${formatDurationShort(stageTypicalS)}`}
                    </span>
                  )}
                  {isStalled && (
                    <span className="text-xs font-medium text-yellow-30">
                      No signal
                    </span>
                  )}
                  {isFailedStage && (
                    <span className="text-xs font-medium text-red-30">
                      Failed here
                    </span>
                  )}
                  {isCancelledStage && (
                    <span className="text-xs font-medium text-grey-70">
                      Stopped here
                    </span>
                  )}
                </div>
                {index < stages.length - 1 && (
                  <div
                    className={[
                      "mt-[22px] h-0.5 w-6 shrink-0 sm:w-10",
                      isDone ? "bg-teal-30" : "bg-grey-20",
                    ].join(" ")}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {heartbeatStale && overallStatus === "RUNNING" && (
        <p className="mt-4 text-xs text-grey-70">
          The sampler hasn&apos;t reported recently — this usually clears on its
          own and doesn&apos;t mean the run failed.
        </p>
      )}
    </div>
  );
}

type LinkStatus = "idle" | "pending" | "error";

// One row per downloadable artifact. Presigned URLs expire in ~1 hour and
// minting one per artifact when the panel opens would waste work on files
// nobody clicks (and risks handing back a URL that's gone dead by the time
// someone does) — so this mints its own URL on click, then triggers the
// download itself. Only the clicked row goes into a pending state; a
// failure lands as a retryable error on that row, never a silent no-op.
function ArtifactRow({
  jobId,
  artifact,
}: {
  jobId: string;
  artifact: SequencingArtifact;
}) {
  const [status, setStatus] = useState<LinkStatus>("idle");
  const sizeLabel = formatBytes(artifact.sizeBytes);

  const handleDownload = async () => {
    if (status === "pending") return;
    setStatus("pending");
    try {
      const response = await getArtifactUrlApi(jobId, artifact.filename);
      const url = response.data?.url;
      if (!url)
        throw new Error(`No download link came back for ${artifact.filename}.`);
      // Content-Disposition: attachment on this URL already forces the
      // download and names the file — clicking a plain link to it is
      // enough, and this only ever sends the small URL-minting request
      // through apiClient, never the artifact's bytes.
      const link = document.createElement("a");
      link.href = url;
      link.rel = "noreferrer";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setStatus("idle");
    } catch (error) {
      setStatus("error");
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to get a download link for ${artifact.filename}.`,
      );
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={status === "pending"}
      className={`flex items-center gap-3 rounded-lg border border-grey-20 bg-white px-3.5 py-2.5 text-left transition-colors hover:border-blue-20 hover:bg-blue-10/40 disabled:cursor-wait disabled:opacity-70 ${FOCUS_RING}`}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-10 text-teal-30">
        <FileText className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-grey-90">
          {artifact.label}
        </p>
        <p className="truncate text-[11px] text-grey-60">
          {status === "error" ? (
            <span className="font-medium text-red-30">
              Couldn&apos;t get a link — tap to retry
            </span>
          ) : (
            <>
              {artifact.filename}
              {sizeLabel && ` · ${sizeLabel}`}
            </>
          )}
        </p>
      </div>
      {status === "pending" ? (
        <Loader2
          className="h-4 w-4 shrink-0 animate-spin text-grey-60 motion-reduce:animate-none"
          aria-hidden="true"
        />
      ) : status === "error" ? (
        <RefreshCw
          className="h-4 w-4 shrink-0 text-red-30"
          aria-hidden="true"
        />
      ) : (
        <Download
          className="h-4 w-4 shrink-0 text-grey-50"
          aria-hidden="true"
        />
      )}
    </button>
  );
}

// Opens a blank tab synchronously, in direct response to the click, so
// browsers don't treat it as an unsolicited popup — then navigates it once
// a fresh inline (Content-Disposition: inline) URL comes back. Every call
// mints its own URL rather than reusing one fetched elsewhere: the whole
// point of minting on demand is that a URL sitting around risks going stale
// before it's used.
async function openArtifactInNewTab(
  jobId: string,
  filename: string,
  onError: (message: string) => void,
) {
  const newTab = window.open("", "_blank");
  if (newTab) {
    try {
      newTab.opener = null;
    } catch {
      /* best-effort hardening only */
    }
  }
  try {
    const response = await getArtifactUrlApi(jobId, filename, true);
    const url = response.data?.url;
    if (!url) throw new Error("No preview link came back for this file.");
    if (newTab) newTab.location.href = url;
    else window.open(url, "_blank", "noreferrer");
  } catch (error) {
    newTab?.close();
    onError(
      error instanceof Error
        ? error.message
        : "Failed to open the interactive plot.",
    );
  }
}

// A discriminated union rather than a couple of loose booleans, since
// "loading" here covers two genuinely different waits back to back:
// minting the presigned URL, then the iframe actually pulling in a ~5MB
// document. Keeping them as one state makes each step's own error/retry
// unambiguous instead of juggling isUrlLoading/isFrameLoading/error flags
// that could disagree with each other.
type PlotState =
  | { status: "closed" }
  | { status: "loading-url" }
  | { status: "loading-frame"; url: string }
  | { status: "ready"; url: string }
  | { status: "error"; message: string };

export default function SequencingRecordDetailPanel({
  record,
  job,
  progress,
  queue,
  onRefetchNeeded,
}: Props) {
  const [variants, setVariants] = useState<SequencingVariant[] | null>(null);
  const [artifacts, setArtifacts] = useState<SequencingArtifact[] | null>(null);
  const [isResultsLoading, setIsResultsLoading] = useState(false);

  const [isNativePlotOpen, setIsNativePlotOpen] = useState(false);
  const [plotState, setPlotState] = useState<PlotState>({ status: "closed" });
  const [isOpeningNewTab, setIsOpeningNewTab] = useState(false);
  // Bumped on every new "view plot" attempt and on close, so a URL-minting
  // response that lands after the user already dismissed the modal (or
  // clicked the button again) can't reopen it out from under them.
  const plotRequestRef = useRef(0);
  // Row collapse unmounts this panel outright (see sequencing-records-table)
  // — bump on unmount too, so a still-in-flight mint doesn't call setState
  // on a component that's already gone.
  useEffect(
    () => () => {
      plotRequestRef.current++;
    },
    [],
  );

  // Once the job reports SUCCEEDED, pull the results (one-shot, not a poll —
  // the record has finished changing by then). A run can succeed with its
  // artifacts stranded, so an empty artifacts list is handled separately
  // below rather than treated as an error.
  useEffect(() => {
    const jobId = job?.id;
    if (!jobId || progress?.status !== "SUCCEEDED") return;
    let cancelled = false;
    setIsResultsLoading(true);
    Promise.all([getJobVariantsApi(jobId), getJobArtifactsApi(jobId)])
      .then(([variantsResponse, artifactsResponse]) => {
        if (cancelled) return;
        setVariants(variantsResponse.data ?? []);
        setArtifacts(artifactsResponse.data ?? []);
      })
      .catch((error) => {
        if (!cancelled)
          toast.error(
            error instanceof Error ? error.message : "Failed to load results.",
          );
      })
      .finally(() => {
        if (!cancelled) setIsResultsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [job?.id, progress?.status]);

  // No job row at all (e.g. submission failed before a job was created) —
  // nothing to poll, so fall back to the record's own status. There's no
  // job id here, so no run to retry — this is a plain statement, not the
  // richer FailedBanner below.
  if (!job) {
    if (record.status === "failed") {
      return (
        <FailedBannerStatic
          heading="This submission failed"
          body="Something went wrong before a run could start."
        />
      );
    }
    if (record.status === "cancelled") return <CancelledBanner />;
    return (
      <div className="flex items-center gap-2 text-sm text-grey-70">
        <CheckCircle className="h-4 w-4 text-green-30" />
        {record.status === "completed"
          ? "Completed — no report details available."
          : "No live status available for this record yet."}
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="flex items-center gap-2 text-sm text-grey-70">
        <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" />
        Loading status…
      </div>
    );
  }

  const isSucceeded = progress.status === "SUCCEEDED";
  const heartbeatStale = (progress.heartbeatAgeS ?? 0) > 30;
  const visualizationArtifact =
    artifacts?.find(isVisualizationArtifact) ?? null;
  const downloadableArtifacts = (artifacts ?? []).filter(
    (a) => !isVisualizationArtifact(a),
  );
  const hasNoArtifacts =
    isSucceeded && !isResultsLoading && (artifacts?.length ?? 0) === 0;

  // Mints its own inline (renders-in-browser) URL and opens the modal —
  // loaded only now that the user actually asked for it. A ~5MB report
  // auto-loading into every expanded row would be exactly the kind of
  // hidden cost the brief calls out, so this never runs on expand.
  const handleViewPlot = async () => {
    if (!visualizationArtifact) return;
    const requestId = ++plotRequestRef.current;
    setPlotState({ status: "loading-url" });
    try {
      const response = await getArtifactUrlApi(
        job.id,
        visualizationArtifact.filename,
        true,
      );
      if (plotRequestRef.current !== requestId) return; // closed or superseded while this was in flight
      const url = response.data?.url;
      if (!url) throw new Error("No preview link came back for this file.");
      setPlotState({ status: "loading-frame", url });
    } catch (error) {
      if (plotRequestRef.current !== requestId) return;
      setPlotState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to load the interactive plot.",
      });
    }
  };

  const handleClosePlot = () => {
    plotRequestRef.current++;
    setPlotState({ status: "closed" });
  };

  const handleOpenInNewTab = () => {
    if (!visualizationArtifact || isOpeningNewTab) return;
    setIsOpeningNewTab(true);
    openArtifactInNewTab(job.id, visualizationArtifact.filename, (message) =>
      toast.error(message),
    ).finally(() => setIsOpeningNewTab(false));
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <StageTracker
          stages={progress.stages}
          stageIndex={progress.stageIndex}
          stageTotal={progress.stageTotal}
          overallStatus={progress.status}
          stageElapsedS={progress.stageElapsedS}
          stageTypicalS={progress.stageTypicalS}
          heartbeatStale={heartbeatStale}
          runId={job.runId}
        />

        {progress.status === "QUEUED" && (
          <QueueBanner progress={progress} queue={queue} />
        )}
        {progress.status === "FAILED" && (
          <FailedBanner
            jobId={job.id}
            runId={job.runId}
            errorMessage={job.errorMessage}
            onRefetchNeeded={onRefetchNeeded}
          />
        )}
        {progress.status === "CANCELLED" && <CancelledBanner />}

        {isSucceeded &&
          (isResultsLoading ? (
            <div className="flex items-center gap-2 border-t border-grey-20 pt-6 text-sm text-grey-70">
              <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" />
              Loading results…
            </div>
          ) : (
            <div className="flex flex-col gap-6 border-t border-grey-20 pt-6">
              {hasNoArtifacts && (
                <div className="flex items-start gap-3 rounded-lg border border-yellow-20 bg-yellow-10 p-4">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-yellow-30" />
                  <div>
                    <p className="text-sm font-semibold text-grey-90">
                      This run succeeded, but its result files aren&apos;t
                      retrievable
                    </p>
                    <p className="mt-1 text-sm text-grey-70">
                      The analysis itself completed — this isn&apos;t a failed
                      run, the artifacts just couldn&apos;t be found for
                      download.
                    </p>
                  </div>
                </div>
              )}

              {(visualizationArtifact || downloadableArtifacts.length > 0) && (
                <div className="rounded-xl border border-grey-20 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-grey-20 pb-4">
                    <div>
                      <h3 className="text-base font-semibold text-grey-90">
                        Analysis Results & Visualization
                      </h3>
                      <p className="text-xs text-grey-60">
                        Interactive plot and output artifacts
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        className={`inline-flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 text-xs font-semibold text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 transition ${FOCUS_RING}`}
                        onClick={() => setIsNativePlotOpen(true)}
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        NextGen Visualizer
                      </button>
                      {visualizationArtifact && (
                        <>
                          <button
                            type="button"
                            className={`inline-flex h-9 items-center gap-2 rounded-lg bg-blue-40 px-3.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-50 disabled:cursor-wait disabled:opacity-70 ${FOCUS_RING}`}
                            onClick={handleViewPlot}
                            disabled={plotState.status === "loading-url"}
                          >
                            {plotState.status === "loading-url" ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin motion-reduce:animate-none" />
                            ) : (
                              <Eye className="h-3.5 w-3.5" />
                            )}
                            View legacy plot
                          </button>
                          <button
                            type="button"
                            onClick={handleOpenInNewTab}
                            disabled={isOpeningNewTab}
                            title="Open plot in a new browser tab"
                            className={`inline-flex h-9 items-center gap-1.5 rounded-lg border border-grey-20 bg-white px-2.5 text-xs font-semibold text-grey-70 hover:bg-grey-10 hover:text-grey-90 disabled:cursor-wait disabled:opacity-70 ${FOCUS_RING}`}
                          >
                            {isOpeningNewTab ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin motion-reduce:animate-none" />
                            ) : (
                              <ExternalLink className="h-3.5 w-3.5" />
                            )}
                            Open in new tab
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {downloadableArtifacts.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-grey-60">
                        Generated Artifacts ({downloadableArtifacts.length})
                      </h4>
                      <div className="mt-2.5 grid gap-3 sm:grid-cols-2">
                        {downloadableArtifacts.map((artifact) => (
                          <ArtifactRow
                            key={`${artifact.kind}-${artifact.filename}`}
                            jobId={job.id}
                            artifact={artifact}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <RunMetricsSummary
                metrics={job.metrics}
                pipelineId={job.pipelineId}
                pipelineVersion={job.pipelineVersion}
                durationS={job.durationS}
                finishedAt={job.finishedAt}
                runId={job.runId}
              />

              <RunVariantsTable variants={variants ?? []} />
            </div>
          ))}
      </div>

      {plotState.status !== "closed" && visualizationArtifact && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4">
          <div className="flex h-[90vh] w-full max-w-6xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-grey-20 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-grey-90">
                  Interactive variant plot
                </h2>
                <p className="text-sm text-grey-70">
                  {job.seqId} — Sample: {job.sampleId}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenInNewTab}
                  disabled={isOpeningNewTab}
                  className={`inline-flex h-9 items-center gap-1.5 rounded-lg border border-grey-20 bg-white px-3 text-sm font-semibold text-grey-70 hover:bg-grey-10 disabled:cursor-wait disabled:opacity-70 ${FOCUS_RING}`}
                >
                  {isOpeningNewTab ? (
                    <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" />
                  ) : (
                    <ExternalLink className="h-4 w-4" />
                  )}
                  Open in new tab
                </button>
                <button
                  type="button"
                  onClick={handleClosePlot}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border border-grey-20 bg-white text-grey-70 hover:bg-grey-10 ${FOCUS_RING}`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="relative flex-1 overflow-hidden">
              {plotState.status === "loading-url" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm text-grey-70">
                  <Loader2 className="h-6 w-6 animate-spin motion-reduce:animate-none" />
                  Getting a link to the plot…
                </div>
              )}

              {plotState.status === "error" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                  <AlertTriangle className="h-6 w-6 text-red-30" />
                  <p className="max-w-sm text-sm text-grey-70">
                    {plotState.message}
                  </p>
                  <button
                    type="button"
                    onClick={handleViewPlot}
                    className={`inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-40 px-4 text-sm font-semibold text-white ${FOCUS_RING}`}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try again
                  </button>
                </div>
              )}

              {(plotState.status === "loading-frame" ||
                plotState.status === "ready") && (
                <>
                  {plotState.status === "loading-frame" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white text-sm text-grey-70">
                      <Loader2 className="h-6 w-6 animate-spin motion-reduce:animate-none" />
                      Loading the plot — this file is a few MB, so it can take a
                      moment…
                    </div>
                  )}
                  {/* Fetched directly from S3 via a presigned, inline URL
                      minted only now that the user asked for it — the
                      bytes go browser<->S3 and never touch apiClient.
                      `allow-same-origin` is intentionally omitted alongside
                      allow-scripts: together they'd let the report script
                      our origin instead of being sandboxed. */}
                  <iframe
                    key={plotState.url}
                    src={plotState.url}
                    title={`Interactive variant plot - ${job.seqId}`}
                    className="h-full w-full border-0"
                    sandbox="allow-scripts"
                    onLoad={() =>
                      setPlotState((prev) =>
                        prev.status === "loading-frame"
                          ? { status: "ready", url: prev.url }
                          : prev,
                      )
                    }
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {isNativePlotOpen && (
        <NativeGenomicVisualizerModal
          isOpen={isNativePlotOpen}
          onClose={() => setIsNativePlotOpen(false)}
          jobId={job.id}
          runId={job.runId}
          seqId={job.seqId}
          sampleId={job.sampleId}
          artifacts={artifacts}
          fallbackVariants={variants}
        />
      )}
    </>
  );
}
