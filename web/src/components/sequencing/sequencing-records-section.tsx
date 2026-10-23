"use client";

import { Download } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import Select from "@/src/components/ui/select";
import { getJobProgressApi } from "@/src/app/(dashboard)/sequencing/loader";
import SequencingRecordsTable from "./sequencing-records-table";
import type {
  JobProgress,
  QueueStatus,
  SequencingJobLiveStatus,
  SequencingProcessingJob,
  SequencingRecord,
  SequencingRecordStatus,
} from "@/src/app/(dashboard)/sequencing/sequencing-processing-types";

type Props = {
  records: SequencingRecord[];
  jobs: SequencingProcessingJob[];
  queue: QueueStatus | null;
  onUploadClick: () => void;
  /** Ask the dashboard to refetch the submissions + jobs lists now. Called
   *  from here when the shared /progress poll below sees a job cross into
   *  a terminal state, and forwarded down to the detail panel for a
   *  successful retry — see the poll effect for the full design note. */
  onRefetchNeeded: () => void;
};

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-40 focus-visible:ring-offset-2";

const PAGE_SIZE = 10;
const POLL_INTERVAL_MS = 4000;

// Live /progress vocabulary -> the local record status the table badge
// speaks. Once the shared poll below has an answer for a job, it always
// wins over the jobs-list-derived status: that list is only refetched when
// something below flags it as stale (see the poll effect), so right after a
// run finishes — before that refetch lands — it can still read "Queued" for
// a moment. Preferring the live status here is the exact "row badge and
// panel disagree" bug this fixes.
const LIVE_STATUS_TO_RECORD_STATUS: Record<
  SequencingJobLiveStatus,
  SequencingRecordStatus
> = {
  QUEUED: "queued",
  RUNNING: "in_progress",
  SUCCEEDED: "completed",
  FAILED: "failed",
  CANCELLED: "cancelled",
};

function isTerminalLiveStatus(status: SequencingJobLiveStatus | undefined) {
  return (
    status === "SUCCEEDED" || status === "FAILED" || status === "CANCELLED"
  );
}

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "In progress", value: "in_progress" },
  { label: "Queued", value: "queued" },
  { label: "Failed", value: "failed" },
  { label: "Cancelled", value: "cancelled" },
];

function escapeCsvValue(value: unknown) {
  if (value == null) return '""';
  if (typeof value === "number" && !Number.isFinite(value)) return '""';
  const str = Array.isArray(value) ? value.join("; ") : String(value);
  return `"${str.replace(/"/g, '""')}"`;
}

export default function SequencingRecordsSection({
  records,
  jobs,
  queue,
  onUploadClick,
  onRefetchNeeded,
}: Props) {
  const [statusFilter, setStatusFilter] = useState<
    SequencingRecordStatus | "all"
  >("all");
  const [page, setPage] = useState(1);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [progressByJobId, setProgressByJobId] = useState<
    Record<string, JobProgress>
  >({});

  const jobsById = useMemo(
    () => Object.fromEntries(jobs.map((job) => [job.id, job])),
    [jobs],
  );

  // Records with their status reconciled against whatever the shared poll
  // below already knows live — see LIVE_STATUS_TO_RECORD_STATUS above.
  const displayRecords = useMemo(() => {
    return records.map((record) => {
      const liveStatus = record.jobId
        ? progressByJobId[record.jobId]?.status
        : undefined;
      if (!liveStatus) return record;
      const mappedStatus = LIVE_STATUS_TO_RECORD_STATUS[liveStatus];
      return mappedStatus && mappedStatus !== record.status
        ? { ...record, status: mappedStatus }
        : record;
    });
  }, [records, progressByJobId]);

  // Seed a default open/closed state for newly-seen records only, so polling
  // refreshes never clobber a user's manual expand/collapse choice. At most
  // one row is ever auto-expanded — the first active (queued/in-progress)
  // run this component ever sees, which on first load is the newest one
  // since `records` arrives sorted latest-first. Auto-expanding every
  // active row (the previous behaviour) is what caused the request storm:
  // each expanded panel ran its own poll loop, so six queued rows meant six
  // independent timers. Every other record defaults to collapsed; the user
  // can always expand more manually.
  const hasAutoExpandedRef = useRef(false);
  useEffect(() => {
    setExpandedIds((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const record of records) {
        if (!(record.id in next)) {
          const shouldAutoExpand =
            !hasAutoExpandedRef.current &&
            (record.status === "in_progress" || record.status === "queued");
          next[record.id] = shouldAutoExpand;
          if (shouldAutoExpand) hasAutoExpandedRef.current = true;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [records]);

  // Single shared poll for every expanded row's live /progress, replacing
  // the old one-4s-loop-per-panel design. Refs hold the latest state so
  // this effect's own setTimeout chain never has to restart — restarting
  // every time `records` changes would defeat the point, since a refetch
  // (including the ones this very poll triggers below) always hands down a
  // brand new array reference.
  const expandedIdsRef = useRef(expandedIds);
  const recordsRef = useRef(records);
  const progressByJobIdRef = useRef(progressByJobId);
  const onRefetchNeededRef = useRef(onRefetchNeeded);
  useEffect(() => {
    expandedIdsRef.current = expandedIds;
  }, [expandedIds]);
  useEffect(() => {
    recordsRef.current = records;
  }, [records]);
  useEffect(() => {
    progressByJobIdRef.current = progressByJobId;
  }, [progressByJobId]);
  useEffect(() => {
    onRefetchNeededRef.current = onRefetchNeeded;
  }, [onRefetchNeeded]);

  // This is also the answer to "why not just refetch the full list on an
  // interval": the full submissions+jobs list only actually changes at one
  // moment in a run's life — when it finishes (SUCCEEDED/FAILED/CANCELLED).
  // Every other tick, this poll's own /progress responses are already the
  // freshest source of truth for an expanded row, and the dashboard's list
  // data for a still-running job (its stage, duration, etc.) is genuinely
  // unused while it's running — the detail panel reads live progress, not
  // the list. So: fetch the list once on mount, keep it around unless
  // something below tells it it's stale, and use this poll (already
  // running, already scoped to just the active jobs on screen) as that
  // "something changed" signal instead of adding a second timer next to it.
  // What goes stale in between, and for how long: a still-*running* job's
  // list-derived fields (variantCount, pipeline id/version on the row) sit
  // unrefreshed for the run's whole duration — the detail panel doesn't
  // need them, only the collapsed table row would show them if reopened,
  // and they don't exist yet on a running job anyway. A *new* row from
  // another user's submission also won't appear until something local
  // triggers a refetch (upload, retry, or a terminal transition elsewhere)
  // — worst case that's until the next natural refresh, which is an
  // acceptable tradeoff against reintroducing a blind 30s poll that refetches
  // the whole list even when nothing on screen has changed.
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const tick = async () => {
      const pollableJobIds = Array.from(
        new Set(
          recordsRef.current
            .filter(
              (record) => expandedIdsRef.current[record.id] && record.jobId,
            )
            .map((record) => record.jobId as string)
            .filter(
              (jobId) =>
                !isTerminalLiveStatus(
                  progressByJobIdRef.current[jobId]?.status,
                ),
            ),
        ),
      );

      if (pollableJobIds.length > 0) {
        const results = await Promise.allSettled(
          pollableJobIds.map((jobId) => getJobProgressApi(jobId)),
        );
        if (!cancelled) {
          const updates: Record<string, JobProgress> = {};
          let becameTerminal = false;
          results.forEach((result, index) => {
            if (result.status === "fulfilled" && result.value.data) {
              const jobId = pollableJobIds[index];
              const wasTerminal = isTerminalLiveStatus(
                progressByJobIdRef.current[jobId]?.status,
              );
              updates[jobId] = result.value.data;
              if (
                !wasTerminal &&
                isTerminalLiveStatus(result.value.data.status)
              )
                becameTerminal = true;
            }
          });
          if (Object.keys(updates).length > 0) {
            setProgressByJobId((prev) => ({ ...prev, ...updates }));
          }
          // A job just finished — this is the one moment the list's own
          // data (status, metrics, variant count on the row) has actually
          // gone stale, so ask the dashboard to refetch it.
          if (becameTerminal) onRefetchNeededRef.current();
        }
      }

      if (!cancelled) timer = setTimeout(tick, POLL_INTERVAL_MS);
    };

    tick();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  const handleToggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredRecords = useMemo(() => {
    if (statusFilter === "all") return displayRecords;
    return displayRecords.filter((r) => r.status === statusFilter);
  }, [displayRecords, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));
  const startIndex = (page - 1) * PAGE_SIZE;
  const visibleRecords = filteredRecords.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  // Reset to page 1 when filter changes
  const handleFilterChange = (value: string) => {
    setStatusFilter(value as SequencingRecordStatus | "all");
    setPage(1);
  };

  const handleDownloadCsv = () => {
    const headers = [
      "Seq ID",
      "Sample ID",
      "Site",
      "Submission date",
      "Status",
      "Format",
      "Method",
      "Pipeline",
      "Pipeline version",
      "Variants",
    ];
    const rows = filteredRecords.map((r) => [
      r.id,
      r.sampleId,
      r.siteName,
      r.submissionDate,
      r.status,
      r.fileFormat,
      r.sequencingMethod,
      r.pipelineId,
      r.pipelineVersion,
      r.variantCount,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsvValue).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sequencing-records.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="px-8 pb-10">
      <div className="rounded-xl border border-grey-20 bg-white shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-grey-20 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-[26px] font-semibold leading-8 text-grey-90">
              Sequencing records
            </h2>
            <p className="mt-1 text-base text-grey-70">
              Review submitted sequences, file formats, and processing status.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Select
              name="status"
              options={statusOptions}
              defaultValue={statusFilter}
              className="h-11 min-w-[180px] border-grey-20"
              isClearable={false}
              onChange={(e) => handleFilterChange(e.target.value)}
            />
            <button
              type="button"
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-grey-20 bg-white px-4 text-base font-semibold text-grey-90 ${FOCUS_RING}`}
              onClick={handleDownloadCsv}
            >
              <Download className="h-4 w-4" />
              Download CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <SequencingRecordsTable
          records={visibleRecords}
          jobsById={jobsById}
          progressByJobId={progressByJobId}
          queue={queue}
          expandedIds={expandedIds}
          onToggleExpand={handleToggleExpand}
          isTrulyEmpty={records.length === 0}
          onUploadClick={onUploadClick}
          onClearFilter={() => handleFilterChange("all")}
          onRefetchNeeded={onRefetchNeeded}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-grey-20 px-6 py-4">
            <span className="text-sm text-grey-70">
              Showing {startIndex + 1}–
              {Math.min(startIndex + PAGE_SIZE, filteredRecords.length)} of{" "}
              {filteredRecords.length} records
            </span>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  aria-current={p === page ? "page" : undefined}
                  className={[
                    "h-8 w-8 rounded-lg text-sm font-semibold transition-colors",
                    p === page
                      ? "bg-blue-40 text-white"
                      : "border border-grey-20 bg-white text-grey-70 hover:bg-grey-10",
                    FOCUS_RING,
                  ].join(" ")}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
