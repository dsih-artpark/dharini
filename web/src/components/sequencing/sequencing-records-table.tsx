import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  StopCircle,
  Upload,
} from "lucide-react";
import { Fragment } from "react";
import type { ReactNode } from "react";
import type {
  JobProgress,
  QueueStatus,
  SequencingProcessingJob,
  SequencingRecord,
  SequencingRecordStatus,
} from "@/src/app/(dashboard)/sequencing/sequencing-processing-types";
import SequencingRecordDetailPanel from "./sequencing-record-detail-panel";

type Props = {
  records: SequencingRecord[];
  jobsById: Record<string, SequencingProcessingJob>;
  /** Live /progress per job id, from the section's single shared poll. */
  progressByJobId: Record<string, JobProgress>;
  /** Global queue snapshot, fetched once by the dashboard. */
  queue: QueueStatus | null;
  expandedIds: Record<string, boolean>;
  onToggleExpand: (id: string) => void;
  /** True only when there are zero records before any filter is applied. */
  isTrulyEmpty: boolean;
  onUploadClick: () => void;
  /** Resets the status filter back to "all" — offered from the "filtered to zero" empty state. */
  onClearFilter: () => void;
  /** Forwarded to each detail panel — called after a successful retry. */
  onRefetchNeeded: () => void;
};

const COLUMN_COUNT = 9;

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-40 focus-visible:ring-offset-2";

// `box-shadow`-based rings can get clipped by neighbouring cells on a
// `border-collapse` table row, so the expandable row uses a real outline
// instead, drawn inside the row so it doesn't get cut by adjacent rows.
const ROW_FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-40";

const statusConfig: Record<
  SequencingRecordStatus,
  { label: string; className: string; icon: ReactNode }
> = {
  completed: {
    label: "Completed",
    className: "bg-green-10 text-green-30 border-green-20",
    icon: <CheckCircle className="h-3.5 w-3.5" />,
  },
  in_progress: {
    label: "In progress",
    className: "bg-blue-10 text-blue-40 border-blue-20",
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  queued: {
    label: "Queued",
    className: "bg-grey-10 text-grey-70 border-grey-20",
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  failed: {
    label: "Failed",
    className: "bg-red-10 text-red-30 border-red-20",
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-grey-10 text-grey-70 border-grey-30",
    icon: <StopCircle className="h-3.5 w-3.5" />,
  },
};

function StatusBadge({ status }: { status: SequencingRecordStatus }) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}

// "Which pipeline ran" — one of the two facts this list can actually back
// with real data (see the brief). Renders a dash rather than nothing when
// a job hasn't been created yet, so the column always has a cell to scan.
function PipelineCell({
  pipelineId,
  pipelineVersion,
}: {
  pipelineId: string | null;
  pipelineVersion: string | null;
}) {
  if (!pipelineId) {
    return <span className="text-sm text-grey-60">—</span>;
  }
  return (
    <div className="flex flex-col">
      <span className="text-sm font-medium text-grey-90">{pipelineId}</span>
      {pipelineVersion && (
        <span className="text-xs text-grey-60">v{pipelineVersion}</span>
      )}
    </div>
  );
}

// "How many variants were called" — the other of the two facts. Coverage
// and read depth used to sit here rendering a hardcoded "0.0%"/"0", which
// next to an "In progress" badge read as a fabricated progress indicator.
// A genuinely absent count renders as a dash, never a 0.
function VariantsCell({ variantCount }: { variantCount: number | null }) {
  if (variantCount == null) {
    return <span className="text-sm text-grey-60">—</span>;
  }
  return (
    <span className="text-sm font-medium text-grey-90">
      {variantCount.toLocaleString()}
    </span>
  );
}

function EmptyState({
  isTrulyEmpty,
  onUploadClick,
  onClearFilter,
}: {
  isTrulyEmpty: boolean;
  onUploadClick: () => void;
  onClearFilter: () => void;
}) {
  if (!isTrulyEmpty) {
    return (
      <tr>
        <td colSpan={COLUMN_COUNT} className="px-6 py-10 text-center">
          <p className="text-base text-grey-70">
            No records match this filter.
          </p>
          <button
            type="button"
            onClick={onClearFilter}
            className={`mt-3 inline-flex h-9 items-center gap-1.5 rounded-lg border border-grey-20 bg-white px-4 text-sm font-semibold text-grey-90 ${FOCUS_RING}`}
          >
            Clear filter
          </button>
        </td>
      </tr>
    );
  }
  return (
    <tr>
      <td colSpan={COLUMN_COUNT} className="px-6 py-14 text-center">
        <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-10">
            <Upload className="h-6 w-6 text-teal-30" />
          </div>
          <p className="text-base font-semibold text-grey-90">
            No sequencing submissions yet
          </p>
          <p className="text-sm text-grey-70">
            Upload a sequence file from a lab sample, NCBI accession, or a
            manual entry to start tracking a run here.
          </p>
          <button
            type="button"
            onClick={onUploadClick}
            className={`mt-2 inline-flex h-10 items-center gap-2 rounded-lg bg-blue-40 px-4 text-sm font-semibold text-white ${FOCUS_RING}`}
          >
            <Upload className="h-4 w-4" />
            Upload sequence files
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function SequencingRecordsTable({
  records,
  jobsById,
  progressByJobId,
  queue,
  expandedIds,
  onToggleExpand,
  isTrulyEmpty,
  onUploadClick,
  onClearFilter,
  onRefetchNeeded,
}: Props) {
  return (
    // A size container, so the expanded panel below can be sized to this
    // box's visible width (100cqw) rather than to the table.
    <div className="overflow-x-auto rounded-b-xl border-x border-b border-grey-20 bg-white [container-type:inline-size]">
      <table className="w-full min-w-[840px] border-collapse">
        <thead>
          <tr className="border-b border-grey-20 bg-blue-10">
            {[
              "Seq ID",
              "Sample ID",
              "Site",
              "Format",
              "Method",
              "Pipeline",
              "Status",
              "Variants",
            ].map((h) => (
              <th
                key={h}
                scope="col"
                className="px-3.5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-grey-70 first:pl-6"
              >
                {h}
              </th>
            ))}
            <th
              scope="col"
              className="py-3 pl-3 pr-6 text-right text-xs font-semibold uppercase tracking-wider text-grey-70"
            >
              <span className="sr-only">Expand row</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {records.length > 0 ? (
            records.map((record) => {
              const isExpanded = Boolean(expandedIds[record.id]);
              return (
                <Fragment key={record.id}>
                  <tr
                    onClick={() => onToggleExpand(record.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onToggleExpand(record.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isExpanded}
                    className={`cursor-pointer border-b border-grey-20 transition-colors last:border-b-0 hover:bg-blue-10 ${ROW_FOCUS_RING}`}
                  >
                    <td className="py-3.5 pl-6 pr-3 font-mono text-xs font-semibold text-grey-90">
                      {record.id}
                    </td>
                    <td className="px-3.5 py-3.5 font-mono text-xs text-grey-70">
                      {record.sampleId}
                    </td>
                    <td className="px-3.5 py-3.5 text-xs font-semibold text-grey-90">
                      {record.siteName}
                    </td>
                    <td className="px-3.5 py-3.5">
                      <span className="rounded-full border border-grey-20 bg-grey-10 px-2.5 py-0.5 text-xs font-medium text-grey-70">
                        {record.fileFormat}
                      </span>
                    </td>
                    <td className="px-3.5 py-3.5">
                      <span className="rounded-full bg-teal-10 px-2.5 py-0.5 text-xs font-semibold text-teal-30">
                        {record.sequencingMethod}
                      </span>
                    </td>
                    <td className="px-3.5 py-3.5">
                      <PipelineCell
                        pipelineId={record.pipelineId}
                        pipelineVersion={record.pipelineVersion}
                      />
                    </td>
                    <td className="px-3.5 py-3.5">
                      <StatusBadge status={record.status} />
                    </td>
                    <td className="px-3.5 py-3.5">
                      <VariantsCell variantCount={record.variantCount} />
                    </td>
                    <td className="py-3.5 pl-3 pr-6 text-right">
                      {isExpanded ? (
                        <ChevronDown
                          className="ml-auto h-4 w-4 text-grey-70"
                          aria-hidden="true"
                        />
                      ) : (
                        <ChevronRight
                          className="ml-auto h-4 w-4 text-grey-70"
                          aria-hidden="true"
                        />
                      )}
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="border-b border-grey-20 bg-grey-10/70 last:border-b-0">
                      <td colSpan={COLUMN_COUNT} className="p-0">
                        {/* An auto-layout table grows to fit its widest
                            content, so the panel's wide parts (stage
                            tracker, variants table) used to stretch every
                            column past the screen. Sized to the container
                            instead, they scroll inside their own boxes. */}
                        <div className="w-[100cqw] px-4 py-4 sm:px-6 sm:py-5">
                          <SequencingRecordDetailPanel
                            record={record}
                            job={
                              record.jobId ? jobsById[record.jobId] : undefined
                            }
                            progress={
                              record.jobId
                                ? progressByJobId[record.jobId]
                                : undefined
                            }
                            queue={queue}
                            onRefetchNeeded={onRefetchNeeded}
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })
          ) : (
            <EmptyState
              isTrulyEmpty={isTrulyEmpty}
              onUploadClick={onUploadClick}
              onClearFilter={onClearFilter}
            />
          )}
        </tbody>
      </table>
    </div>
  );
}
