"use client";

import { Fragment, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, SkipForward, Trash2, X } from "lucide-react";

import { formatDate } from "@/src/utils";
import { DISEASE_COLOR_CODE } from "@/src/utils/constant";
import {
  DiscardStep,
  formatDateTime,
  getDiscardStage,
  getDiscardStageLabel,
  getDiscardSteps,
  getLastCompletedStep,
  getUserName,
} from "@/src/utils/discard";
import { getSampleActivityApi } from "@/src/app/(dashboard)/lab/loader";
import type {
  Sample,
  SampleActivity,
  SampleStatusType,
} from "@/src/types/sample";

type Tone = "green" | "blue" | "red" | "grey";

const TONE_DOT: Record<Tone, string> = {
  green: "bg-green-30 ring-green-20",
  blue: "bg-blue-40 ring-blue-20",
  red: "bg-red-30 ring-red-20",
  grey: "bg-grey-50 ring-grey-20",
};

// The lab step a sample is waiting at while it has this status.
const STEP_AT_STATUS: Record<string, string> = {
  "picked-up": "Receiving",
  received: "Pre-processing",
  "virus-isolation": "Virus Isolation",
  "pre-processed": "Extraction",
  extracted: "Testing",
};

// The step whose details were saved while the sample had this status.
const STEP_DONE_AT_STATUS: Record<string, string> = {
  "picked-up": "Collection",
  received: "Receiving",
  "virus-isolation": "Pre-processing",
  "pre-processed": "Pre-processing",
  extracted: "Extraction",
  tested: "Testing",
  "test-report-generated": "Testing",
};

const STATUS_ORDER = [
  "picked-up",
  "received",
  "virus-isolation",
  "pre-processed",
  "extracted",
  "tested",
  "test-report-generated",
];

const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

const humanize = (text: string) =>
  capitalize(text.replace(/^sample-/, "").replace(/[-:]/g, " "));

const withUnit = (value: string | null, unit: string | null) =>
  value ? `${value}${unit ? ` ${unit}` : ""}` : null;

// The status a sample has after this entry, or null if the entry didn't
// change it. Status changes are saved as `sample-<status>` (older rows:
// `<status>`).
const statusAfter = (entry: SampleActivity): string | null => {
  const event = entry.event ?? "";
  if (event === "sample-collected" || event === "sample-picked-up") {
    return "picked-up";
  }
  if (
    event === "sample-discarded" ||
    event.startsWith("sample-details-edited")
  ) {
    return null;
  }
  return (
    entry.status ??
    event
      .replace(/^sample-/, "")
      .replace(/^report-generated$/, "test-report-generated")
  );
};

// Turns one audit row into a log line: what happened, at which step, plus a
// short detail where the row carries one. `from` is the status before it,
// taken from the earlier entries.
function describeActivity(
  entry: SampleActivity,
  from: string | null,
): {
  title: string;
  tone: Tone;
  detail?: string;
} {
  const event = entry.event ?? "";
  const d = entry.details;

  if (event === "sample-discarded") {
    return {
      tone: "red",
      title: `Discarded · ${getDiscardStageLabel(
        getDiscardStage((entry.status ?? undefined) as SampleStatusType),
      )}`,
      detail:
        [d.discardReason, d.discardComment].filter(Boolean).join(" — ") ||
        undefined,
    };
  }
  if (event === "sample-collected" || event === "sample-picked-up") {
    return { tone: "grey", title: "Collected · Field" };
  }
  if (event.startsWith("sample-details-edited")) {
    const step = STEP_DONE_AT_STATUS[event.split(":")[1] ?? ""];
    return {
      tone: "grey",
      title: step ? `Details edited · ${step}` : "Details edited",
    };
  }

  const to = statusAfter(entry) ?? "";

  if (to === "received") {
    const volume = withUnit(d.receivedVolumeValue, d.receivedVolumeUnit);
    return {
      tone: "green",
      title: "Accepted · Receiving",
      detail: volume ? `Volume received: ${volume}` : undefined,
    };
  }
  if (to === "rejected") {
    return {
      tone: "red",
      title: "Rejected · Receiving",
      detail: d.rejectReason ?? undefined,
    };
  }
  if (to === "test-report-generated") {
    return { tone: "green", title: "Report generated · Testing" };
  }

  const next = STEP_AT_STATUS[to];
  if (from === to) {
    return {
      tone: "grey",
      title: `Updated · ${STEP_DONE_AT_STATUS[to] ?? humanize(to)}`,
    };
  }
  if (from && STATUS_ORDER.indexOf(to) < STATUS_ORDER.indexOf(from)) {
    return { tone: "grey", title: `Sent back · ${next ?? humanize(to)}` };
  }
  if (from === "virus-isolation" && to === "extracted") {
    return {
      tone: "grey",
      title: "Skipped · Virus Isolation",
      detail: "Next: Testing",
    };
  }

  const done = from ? STEP_AT_STATUS[from] : undefined;
  if (!done) {
    return { tone: "blue", title: next ? `Moved to ${next}` : humanize(to) };
  }
  const parts: string[] = [];
  if (done === "Pre-processing" && d.preprocessingMethods.length) {
    const methods = Array.from(new Set(d.preprocessingMethods.map(capitalize)));
    parts.push(`Methods: ${methods.join(", ")}`);
  }
  if (done === "Extraction") {
    const used = withUnit(
      d.extractionSampleUsedValue,
      d.extractionSampleUsedUnit,
    );
    const remaining = withUnit(
      d.extractionSampleRemainingValue,
      d.extractionSampleRemainingUnit,
    );
    if (used) parts.push(`Used: ${used}`);
    if (remaining) parts.push(`Remaining: ${remaining}`);
  }
  if (next) parts.push(`Next: ${next}`);
  return {
    tone: "blue",
    title: `Step completed · ${done}`,
    detail: parts.join(". ") || undefined,
  };
}

function ActivityLog({
  projectId,
  sampleId,
}: {
  projectId: string;
  sampleId: string;
}) {
  const [entries, setEntries] = useState<SampleActivity[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setEntries(null);
    setError(false);
    getSampleActivityApi(projectId, sampleId)
      .then((response) => {
        if (!cancelled) setEntries(response.data ?? []);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [projectId, sampleId]);

  if (error) {
    return (
      <p className="text-sm text-grey-70">
        Couldn&apos;t load the activity log.
      </p>
    );
  }
  if (!entries) {
    return (
      <div className="flex flex-col gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex gap-3">
            <span className="mt-1 h-3 w-3 shrink-0 animate-pulse rounded-full bg-grey-20" />
            <div className="flex flex-1 flex-col gap-1.5">
              <span className="h-4 w-1/3 animate-pulse rounded bg-grey-20" />
              <span className="h-3 w-1/2 animate-pulse rounded bg-grey-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (!entries.length) {
    return <p className="text-sm text-grey-70">No activity recorded.</p>;
  }

  // Walk the log in order so each entry knows the status before it.
  let status: string | null = null;
  const lines = entries.map((entry) => {
    const line = describeActivity(entry, status);
    status = statusAfter(entry) ?? status;
    return { entry, ...line };
  });

  return (
    <ol className="flex flex-col">
      {lines.map(({ entry, title, tone, detail }, i) => {
        const isLast = i === lines.length - 1;
        return (
          <li key={entry.id} className="relative flex gap-3 pb-5 last:pb-0">
            {!isLast && (
              <span
                aria-hidden
                className="absolute bottom-0 left-[5px] top-4 w-0.5 bg-grey-20"
              />
            )}
            <span
              aria-hidden
              className={`relative mt-1 h-3 w-3 shrink-0 rounded-full ring-4 ${TONE_DOT[tone]}`}
            />
            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="text-sm font-semibold text-grey-80">{title}</p>
              <p className="text-xs text-grey-60">
                {[
                  formatDateTime(entry.createdAt),
                  entry.user && getUserName(entry.user),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              {detail && (
                <p className="mt-0.5 break-words text-sm text-grey-70">
                  {detail}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

const STEP_STATUS: Record<DiscardStep["state"], string> = {
  done: "Done",
  skipped: "Skipped",
  discarded: "Discarded here",
  pending: "Not done",
};

function StepIcon({ step, index }: { step: DiscardStep; index: number }) {
  const base =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full";
  switch (step.state) {
    case "done":
      return (
        <span className={`${base} bg-blue-40 text-white`}>
          <Check size={18} strokeWidth={2.5} />
        </span>
      );
    case "discarded":
      return (
        <span className={`${base} bg-red-30 text-white`}>
          <X size={18} strokeWidth={2.5} />
        </span>
      );
    case "skipped":
      return (
        <span
          className={`${base} border-2 border-dashed border-grey-40 text-grey-60`}
        >
          <SkipForward size={15} />
        </span>
      );
    default:
      return (
        <span
          className={`${base} border-2 border-grey-20 text-sm font-medium text-grey-50`}
        >
          {index + 1}
        </span>
      );
  }
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <dt className="text-grey-70">{label}</dt>
      <dd className="font-medium text-grey-80 break-words">{children}</dd>
    </>
  );
}

// Read-only side panel for a discarded sample, opened from the Sample Archive.
export default function DiscardedSampleDetail({
  sample,
  projectId,
  onClose,
}: {
  sample: Sample;
  projectId: string;
  onClose: () => void;
}) {
  const stageLabel = getDiscardStageLabel(getDiscardStage(sample.sampleStatus));
  const steps = getDiscardSteps(sample);
  const region = sample.site?.location?.region?.name;
  const collectedOn = sample.collectionTime || sample.collectedAt;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    // Right-side panel over a dimmed page; a click on the dimmed area closes it.
    <motion.div
      className="fixed inset-0 z-[1000] flex justify-end bg-[#1E1E1E4D]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="discarded-sample-title"
        className="flex h-full w-full max-w-[640px] flex-col bg-white shadow-xl"
      >
        {/* Header */}
        <div className="flex items-start gap-4 border-b border-grey-20 px-6 pb-5 pt-6">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2
                id="discarded-sample-title"
                className="mr-1 text-2xl font-semibold leading-tight text-grey-80"
              >
                {sample.barcode}
              </h2>
              {sample.diseases?.map((disease, i) => (
                <span
                  key={disease.id}
                  className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-grey-80 ${
                    DISEASE_COLOR_CODE.BG_COLOR[(disease.index ?? i) % 6]
                  }`}
                >
                  {disease.shortName}
                </span>
              ))}
              <span className="inline-flex rounded-md bg-red-10 px-2 py-0.5 text-xs font-semibold text-red-30">
                Discarded · {stageLabel}
              </span>
            </div>
            <p className="text-sm capitalize text-grey-70">
              {[sample.sampleType?.name, sample.accessionId]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="-mr-1 -mt-1 rounded-lg p-1.5 text-grey-60 transition-colors hover:bg-grey-10 hover:text-grey-80"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6">
          {/* Steps */}
          <ol className="flex flex-wrap items-center gap-x-3 gap-y-4 rounded-xl border border-grey-20 p-5">
            {steps.map((step, i) => {
              const next = steps[i + 1];
              return (
                <Fragment key={step.key}>
                  <li className="flex items-center gap-3">
                    <StepIcon step={step} index={i} />
                    <div className="flex flex-col">
                      <span
                        className={`text-sm font-medium ${
                          step.state === "discarded"
                            ? "text-red-30"
                            : step.state === "pending"
                              ? "text-grey-50"
                              : "text-grey-70"
                        }`}
                      >
                        {step.label}
                      </span>
                      <span
                        className={`text-xs ${
                          step.state === "done"
                            ? "text-green-30"
                            : step.state === "discarded"
                              ? "text-red-30"
                              : "text-grey-50"
                        }`}
                      >
                        {STEP_STATUS[step.state]}
                      </span>
                    </div>
                  </li>
                  {next && (
                    <li
                      aria-hidden
                      className={`h-0.5 w-6 rounded-full ${
                        next.state === "done" || next.state === "skipped"
                          ? "bg-blue-40"
                          : "bg-grey-20"
                      }`}
                    />
                  )}
                </Fragment>
              );
            })}
          </ol>

          {/* Discard record */}
          <div className="flex flex-col gap-4 rounded-xl border border-red-20 bg-red-10 p-5">
            <p className="flex items-center gap-2 text-lg font-semibold text-red-30">
              <Trash2 size={18} />
              Discarded at {stageLabel}
            </p>
            <dl className="grid grid-cols-[150px_1fr] gap-x-4 gap-y-2.5 text-sm">
              <Row label="Reason">{sample.discardReason || "—"}</Row>
              {sample.discardComment && (
                <Row label="Comments">{sample.discardComment}</Row>
              )}
              <Row label="Last completed step">
                {getLastCompletedStep(sample)}
              </Row>
              <Row label="Discarded by">
                {getUserName(sample.discardedBy)} ·{" "}
                {formatDateTime(sample.discardedAt)}
              </Row>
            </dl>
          </div>

          {/* Sample details */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-grey-70">
              Sample details
            </p>
            <dl className="grid grid-cols-[150px_1fr] gap-x-4 gap-y-2.5 text-sm">
              <Row label="Site">
                {[sample.site?.name, region].filter(Boolean).join(", ") || "—"}
              </Row>
              <Row label="Round">{sample.visit?.round ?? "—"}</Row>
              <Row label="Collected by">
                {[
                  sample.collectedBy && getUserName(sample.collectedBy),
                  collectedOn && formatDate(collectedOn),
                ]
                  .filter(Boolean)
                  .join(" · ") || "—"}
              </Row>
            </dl>
          </div>

          {/* Activity log */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-grey-70">
              Activity log for this sample
            </p>
            <ActivityLog projectId={projectId} sampleId={sample.id} />
          </div>
        </div>
      </motion.aside>
    </motion.div>
  );
}
