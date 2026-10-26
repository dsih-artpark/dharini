import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "react-toastify";
import type { SequencingJobMetrics } from "@/src/app/(dashboard)/sequencing/sequencing-processing-types";

export function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(
        label ? `${label} copied to clipboard` : "Copied to clipboard",
      );
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={label ? `Copy ${label}` : "Copy to clipboard"}
      className="inline-flex items-center justify-center rounded p-1 text-grey-60 hover:bg-grey-20 hover:text-grey-90 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-40"
      aria-label={label ? `Copy ${label}` : "Copy to clipboard"}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-30" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

type ImpactLevel = "HIGH" | "MODERATE" | "LOW" | "MODIFIER";

// Highest severity first — same ordering and colour convention as the
// per-variant impact chips in run-variants-table.tsx, so the two reinforce
// each other rather than inventing a second colour language.
const IMPACT_ORDER: ImpactLevel[] = ["HIGH", "MODERATE", "LOW", "MODIFIER"];

const IMPACT_META: Record<
  ImpactLevel,
  { label: string; bar: string; text: string }
> = {
  HIGH: { label: "High", bar: "bg-red-30", text: "text-red-30" },
  MODERATE: { label: "Moderate", bar: "bg-yellow-30", text: "text-yellow-30" },
  LOW: { label: "Low", bar: "bg-green-30", text: "text-green-30" },
  MODIFIER: { label: "Modifier", bar: "bg-blue-40", text: "text-blue-40" },
};

const TOP_EFFECTS_LIMIT = 5;

// The backing type says these are numbers, but `metrics` is a freeform blob
// the pipeline controls, not something this component can trust at runtime —
// this is what actually caused the "[object Object]" bug: a by_effect value
// that was itself a nested object sailed past a `!= null` check and hit
// `.toLocaleString()`, which Object.prototype happily answers with the
// literal string "[object Object]". Every value pulled from `metrics` is
// routed through this guard before it can reach JSX.
function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function formatDuration(
  totalSeconds: number | null | undefined,
): string | null {
  if (totalSeconds == null || Number.isNaN(totalSeconds)) return null;
  const seconds = Math.max(0, Math.round(totalSeconds));
  if (seconds < 60) return `${seconds}s`;
  const totalMinutes = Math.round(seconds / 60);
  if (totalMinutes < 60) return `${totalMinutes}m`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}

// "upstream_gene_variant" -> "Upstream gene variant". by_effect keys are an
// open-ended SnpEff vocabulary, never assumed to be any particular value.
function humanizeEffect(effect: string): string {
  const spaced = effect.replace(/_/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

type Props = {
  metrics?: SequencingJobMetrics | null;
  pipelineId?: string | null;
  pipelineVersion?: string | null;
  durationS?: number | null;
  finishedAt?: string | null;
  runId?: string | null;
};

// Every field here is optional in practice, so each block renders itself
// out entirely when its data is missing — never a zero or "undefined" in
// place of a value that was never actually there.
export default function RunMetricsSummary({
  metrics,
  pipelineId,
  pipelineVersion,
  durationS,
  finishedAt,
  runId,
}: Props) {
  const headlineStats = (
    [
      { label: "Variants", value: metrics?.variant_count },
      { label: "SNPs", value: metrics?.snp_count },
      { label: "Indels", value: metrics?.indel_count },
    ] as { label: string; value: unknown }[]
  ).filter((stat): stat is { label: string; value: number } =>
    isFiniteNumber(stat.value),
  );

  const impactEntries = IMPACT_ORDER.map((level) => ({
    level,
    count: metrics?.by_impact?.[level],
  })).filter((entry): entry is { level: ImpactLevel; count: number } =>
    isFiniteNumber(entry.count),
  );
  const impactTotal = impactEntries.reduce(
    (sum, entry) => sum + entry.count,
    0,
  );

  // by_effect is an open-ended map the pipeline controls — never assume a
  // key exists, and never assume a value that IS present is actually a
  // number (see isFiniteNumber above).
  const effectEntries =
    metrics?.by_effect && typeof metrics.by_effect === "object"
      ? Object.entries(metrics.by_effect)
          .filter((entry): entry is [string, number] =>
            isFiniteNumber(entry[1]),
          )
          .sort((a, b) => b[1] - a[1])
          .slice(0, TOP_EFFECTS_LIMIT)
      : [];
  const effectMax = effectEntries.reduce(
    (max, [, count]) => Math.max(max, count),
    0,
  );

  const durationLabel = formatDuration(durationS);
  const finishedLabel = finishedAt
    ? new Date(finishedAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;
  const runFacts = (
    [
      runId ? { label: "Run ID", value: runId, copyable: true } : null,
      pipelineId
        ? {
            label: "Pipeline",
            value: pipelineVersion
              ? `${pipelineId} v${pipelineVersion}`
              : pipelineId,
          }
        : null,
      durationLabel ? { label: "Duration", value: durationLabel } : null,
      finishedLabel ? { label: "Finished", value: finishedLabel } : null,
    ] as ({ label: string; value: string; copyable?: boolean } | null)[]
  ).filter(
    (fact): fact is { label: string; value: string; copyable?: boolean } =>
      fact != null,
  );

  const hasNothing =
    headlineStats.length === 0 &&
    impactEntries.length === 0 &&
    effectEntries.length === 0 &&
    runFacts.length === 0;
  if (hasNothing) return null;

  return (
    <div className="rounded-xl border border-grey-20 bg-white p-5 shadow-sm">
      {/* Top Header: Title & Metadata Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-grey-20 pb-4">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <h3 className="text-base font-semibold text-grey-90">Run Overview</h3>
          {runId && (
            <div className="flex min-w-0 items-center gap-1.5 rounded-md border border-grey-20 bg-grey-10 px-2 py-0.5 text-xs text-grey-70">
              <span className="font-medium text-grey-60">Run ID:</span>
              <span className="break-all font-mono font-semibold text-grey-90">
                {runId}
              </span>
              <CopyButton text={runId} label="Run ID" />
            </div>
          )}
        </div>

        {runFacts.filter((f) => f.label !== "Run ID").length > 0 && (
          <dl className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-grey-70">
            {runFacts
              .filter((f) => f.label !== "Run ID")
              .map((fact) => (
                <div key={fact.label} className="flex items-center gap-1">
                  <dt className="font-medium text-grey-60">{fact.label}:</dt>
                  <dd className="font-semibold text-grey-90">{fact.value}</dd>
                </div>
              ))}
          </dl>
        )}
      </div>

      {/* Main Content */}
      <div className="mt-4 flex flex-col gap-5">
        {/* Headline Stat Counters */}
        {headlineStats.length > 0 && (
          // Wraps instead of a fixed 3 columns, so tiles stack on a narrow
          // panel rather than squeezing their numbers out of the box.
          <div className="flex max-w-xl flex-wrap gap-3 sm:gap-4">
            {headlineStats.map((stat) => (
              <div
                key={stat.label}
                className="flex min-w-[7rem] flex-1 flex-col rounded-lg border border-grey-20 bg-grey-10/50 px-3.5 py-2.5 transition-colors hover:bg-grey-10"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-grey-60">
                  {stat.label}
                </span>
                <span className="mt-0.5 text-2xl font-bold tracking-tight text-grey-90">
                  {stat.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* 2-Column Analytics Grid: Impact Distribution & Top Effects */}
        {(impactEntries.length > 0 || effectEntries.length > 0) && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Impact Distribution Card */}
            {impactEntries.length > 0 && (
              <div className="rounded-lg border border-grey-20 bg-grey-10/30 p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-grey-70">
                    Impact Distribution
                  </h4>
                  <span className="text-xs text-grey-60">
                    {impactTotal.toLocaleString()} classified
                  </span>
                </div>
                <div className="mt-3 flex flex-col gap-2.5">
                  {impactEntries.map(({ level, count }) => {
                    const pct =
                      impactTotal > 0
                        ? Math.round((count / impactTotal) * 100)
                        : 0;
                    return (
                      <div
                        key={level}
                        className="flex items-center gap-2.5 text-xs"
                      >
                        <span
                          className={`w-18 shrink-0 font-medium ${IMPACT_META[level].text}`}
                        >
                          {IMPACT_META[level].label}
                        </span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-grey-20">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${IMPACT_META[level].bar}`}
                            style={{
                              width: `${Math.max(pct, count > 0 ? 2 : 0)}%`,
                            }}
                          />
                        </div>
                        <span className="w-16 shrink-0 text-right font-medium text-grey-80">
                          {count.toLocaleString()}{" "}
                          <span className="text-[11px] font-normal text-grey-60">
                            ({pct}%)
                          </span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Top Effects Card */}
            {effectEntries.length > 0 && (
              <div className="rounded-lg border border-grey-20 bg-grey-10/30 p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-grey-70">
                    Top Functional Effects
                  </h4>
                  <span className="text-xs text-grey-60">
                    Top {effectEntries.length}
                  </span>
                </div>
                <div className="mt-3 flex flex-col gap-2.5">
                  {effectEntries.map(([effect, count]) => (
                    <div
                      key={effect}
                      className="flex items-center gap-2.5 text-xs"
                    >
                      <span
                        className="w-24 shrink-0 truncate font-medium text-grey-80 sm:w-36"
                        title={humanizeEffect(effect)}
                      >
                        {humanizeEffect(effect)}
                      </span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-grey-20">
                        <div
                          className="h-full rounded-full bg-teal-30 transition-all duration-300"
                          style={{
                            width: `${
                              effectMax > 0
                                ? Math.max(
                                    Math.round((count / effectMax) * 100),
                                    2,
                                  )
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                      <span className="w-10 shrink-0 text-right font-medium text-grey-80">
                        {count.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
