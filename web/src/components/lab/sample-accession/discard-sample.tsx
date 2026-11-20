"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useSetAtom } from "jotai";
import { toast } from "react-toastify";
import { ChevronDown, Info, Trash2, X } from "lucide-react";

import { discardSamplesApi } from "@/src/app/(dashboard)/lab/[sampleId]/actions";
import { getTeamMembersApi } from "@/src/app/(dashboard)/lab/[sampleId]/loader";
import Spinner from "@/src/components/ui/spinner";
import { useCurrentProjectResolver } from "@/src/hooks/use-current-project";
import { sampleAtom } from "@/src/store/sampleAtom";
import { selectedProcessableSamplesAtom } from "@/src/store/processableSamplesAtom";
import { User } from "@/src/types/global";
import { Sample } from "@/src/types/sample";
import {
  DISCARD_REASONS,
  DISCARD_REASON_OTHER,
  getDiscardStage,
  getDiscardStageLabel,
  getLastCompletedStep,
  getUserName,
} from "@/src/utils/discard";

const labelCls = "text-xs font-semibold uppercase tracking-wider text-grey-70";
const fieldCls =
  "w-full h-11 px-3.5 rounded-xl border border-grey-40 bg-white text-sm text-grey-80 outline-none transition-all focus:border-blue-40 focus:ring-2 focus:ring-blue-40/10";

const pad = (n: number) => String(n).padStart(2, "0");
const toLocalInputValue = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;

// One chip per sample, or one per pool: a pool is discarded as a whole.
type ChipGroup = { key: string; label: string; samples: Sample[] };

const groupSamples = (samples: Sample[]): ChipGroup[] => {
  const groups = new Map<string, ChipGroup>();
  samples.forEach((s) => {
    const poolId = s.isPooledSample ? s.details?.preprocessing?.pooledId : "";
    if (poolId) {
      const key = `pool:${poolId}`;
      if (!groups.has(key)) groups.set(key, { key, label: "", samples: [] });
      groups.get(key)!.samples.push(s);
    } else {
      groups.set(s.id, { key: s.id, label: "", samples: [s] });
    }
  });
  return Array.from(groups.values()).map((g) => {
    if (g.key.startsWith("pool:")) {
      const poolId = g.key.slice(5);
      return {
        ...g,
        label: `${poolId} · ${g.samples.length} sample${
          g.samples.length === 1 ? "" : "s"
        }`,
      };
    }
    const s = g.samples[0];
    const diseases = s.diseases?.map((d) => d.shortName).filter(Boolean);
    return {
      ...g,
      label: [s.barcode, diseases?.join(", ")].filter(Boolean).join(" · "),
    };
  });
};

interface DiscardSampleModalProps {
  isOpen: boolean;
  onClose: () => void;
  samples: Sample[];
  onDiscarded: (discarded: Sample[]) => void;
}

export function DiscardSampleModal({
  isOpen,
  onClose,
  samples,
  onDiscarded,
}: DiscardSampleModalProps) {
  const { resolveProjectId } = useCurrentProjectResolver();
  const projectId = resolveProjectId();

  const [excluded, setExcluded] = useState<Set<string>>(new Set());
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [discardedById, setDiscardedById] = useState("");
  const [discardedAt, setDiscardedAt] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const teamId = samples[0]?.team?.id;
  const stage = getDiscardStage(samples[0]?.sampleStatus);
  const stageLabel = getDiscardStageLabel(stage);
  const lastCompleted = getLastCompletedStep(samples[0]);
  const reasons = stage ? DISCARD_REASONS[stage] : [];

  const chips = useMemo(
    () => groupSamples(samples.filter((s) => !excluded.has(s.id))),
    [samples, excluded],
  );
  const selected = chips.flatMap((c) => c.samples);
  const isPlural = selected.length > 1;
  const hasPooled = selected.some((s) => s.isPooledSample);
  const commentRequired = reason === DISCARD_REASON_OTHER;

  const canSubmit =
    selected.length > 0 &&
    !!reason &&
    (!commentRequired || !!comment.trim()) &&
    !!discardedById &&
    !!discardedAt &&
    confirmed &&
    !submitting;

  // Fresh form each time it opens.
  useEffect(() => {
    if (!isOpen) return;
    setExcluded(new Set());
    setReason("");
    setComment("");
    setDiscardedById("");
    setDiscardedAt(toLocalInputValue(new Date()));
    setConfirmed(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !projectId || !teamId) return;
    setLoadingMembers(true);
    getTeamMembersApi(projectId, teamId)
      .then((response) => setTeamMembers(response.data || []))
      .catch(() => toast.error("Could not load team members."))
      .finally(() => setLoadingMembers(false));
  }, [isOpen, projectId, teamId]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, submitting, onClose]);

  const removeChip = (chip: ChipGroup) =>
    setExcluded((prev) => {
      const next = new Set(prev);
      chip.samples.forEach((s) => next.add(s.id));
      return next;
    });

  const handleSubmit = async () => {
    if (!canSubmit || !projectId) return;
    setSubmitting(true);
    try {
      const response = await discardSamplesApi(projectId, {
        sampleIds: selected.map((s) => s.id),
        reason,
        comment: comment.trim() || undefined,
        discardedBy: discardedById,
        discardedAt: new Date(discardedAt).toISOString(),
      });
      toast.success(response.message || "Sample discarded");
      onDiscarded(response.data || []);
      onClose();
    } catch (error) {
      toast.error((error as Error)?.message || "Failed to discard sample.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    // Stop mousedown here so a host modal's outside-click handler (the bulk
    // processing modal closes on any click outside itself) leaves it open.
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-[#1E1E1E4D] p-4"
      onMouseDown={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="discard-sample-title"
    >
      <div className="flex max-h-[92vh] w-full max-w-[600px] flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-start gap-4 border-b border-grey-20 px-6 pb-5 pt-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-10 text-red-30">
            <Trash2 size={22} strokeWidth={1.8} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h2
              id="discard-sample-title"
              className="text-xl font-semibold leading-tight text-grey-80"
            >
              Discard {isPlural ? `${selected.length} samples` : "sample"} at{" "}
              {stageLabel}
            </h2>
            <p className="text-sm leading-relaxed text-grey-70">
              {isPlural ? "The samples stop" : "The sample stops"} here and{" "}
              {isPlural ? "move" : "moves"} to the Sample Archive with the
              reason, who and when. The record is kept, not deleted.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="-mr-1 -mt-1 rounded-lg p-1.5 text-grey-60 transition-colors hover:bg-grey-10 hover:text-grey-80 disabled:opacity-50"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-5 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-2.5">
            <p className={labelCls}>
              {isPlural ? "Samples" : "Sample"} ({selected.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {chips.map((chip) => (
                <span
                  key={chip.key}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-grey-20 px-2.5 py-1.5 text-sm font-medium text-grey-80"
                >
                  {chip.label}
                  {chips.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeChip(chip)}
                      className="rounded text-grey-60 transition-colors hover:text-grey-80"
                      aria-label={`Remove ${chip.label}`}
                    >
                      <X size={14} />
                    </button>
                  )}
                </span>
              ))}
            </div>
            {hasPooled && (
              <p className="flex items-center gap-1.5 text-xs text-grey-70">
                <Info size={13} className="shrink-0" />
                Pooled samples are discarded together with the rest of their
                pool.
              </p>
            )}
          </div>

          <p className="text-sm text-grey-70">
            Stopped at:{" "}
            <span className="font-semibold text-grey-80">{stageLabel}</span>
            <span className="mx-1.5 text-grey-50">·</span>
            Last completed step:{" "}
            <span className="font-semibold text-grey-80">{lastCompleted}</span>
          </p>

          <div className="flex flex-col gap-2">
            <label htmlFor="discard-reason" className={labelCls}>
              Reason for discard <span className="text-red-30">*</span>
            </label>
            <div className="relative">
              <select
                id="discard-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className={`${fieldCls} cursor-pointer appearance-none pr-10 ${
                  reason ? "" : "text-grey-60"
                }`}
              >
                <option value="" disabled>
                  Select reason
                </option>
                {reasons.map((r) => (
                  <option key={r} value={r} className="text-grey-80">
                    {r}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-grey-60"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="discard-comment" className={labelCls}>
              Comments{" "}
              {commentRequired && <span className="text-red-30">*</span>}
            </label>
            <textarea
              id="discard-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              maxLength={2000}
              placeholder="What was observed? e.g. culture turbid at 48 h, yield 2 ng/µL"
              className={`${fieldCls} h-auto resize-y py-3 placeholder:text-grey-50`}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="discard-by" className={labelCls}>
                Discarded by <span className="text-red-30">*</span>
              </label>
              <div className="relative">
                <select
                  id="discard-by"
                  value={discardedById}
                  onChange={(e) => setDiscardedById(e.target.value)}
                  disabled={loadingMembers}
                  className={`${fieldCls} cursor-pointer appearance-none pr-10 disabled:cursor-wait disabled:bg-grey-10 ${
                    discardedById ? "" : "text-grey-60"
                  }`}
                >
                  <option value="" disabled>
                    {loadingMembers ? "Loading…" : "Select team member"}
                  </option>
                  {teamMembers.map((m) => (
                    <option key={m.id} value={m.id} className="text-grey-80">
                      {getUserName(m)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-grey-60"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="discard-at" className={labelCls}>
                Date &amp; time <span className="text-red-30">*</span>
              </label>
              <input
                id="discard-at"
                type="datetime-local"
                value={discardedAt}
                max={toLocalInputValue(new Date())}
                onChange={(e) => setDiscardedAt(e.target.value)}
                className={fieldCls}
              />
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-grey-20 bg-grey-10 px-4 py-3.5">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 h-[18px] w-[18px] shrink-0 cursor-pointer rounded border-2 border-grey-50 text-red-30 focus:ring-red-30 focus:ring-offset-0"
            />
            <span className="text-sm leading-relaxed text-grey-80">
              I confirm {isPlural ? "these samples" : "this sample"} will{" "}
              <strong className="font-semibold">not proceed</strong> to further
              steps. This acts as my sign-off.
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-grey-20 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-xl border border-grey-40 bg-white px-5 py-2.5 text-sm font-semibold text-grey-80 transition-colors hover:bg-grey-10 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="inline-flex items-center gap-2 rounded-xl bg-red-30 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-30/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting && <Spinner darkMode />}
            Discard &amp; move to Archive
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

interface DiscardSampleActionProps {
  // Footer: the samples the stage screen is working on. Row: that row's
  // sample, or every sample of a pooled row.
  samples: Sample[];
  // "footer" is the button on the single-sample page; "row" is the icon
  // button on one row of the bulk modal.
  variant?: "footer" | "row";
  // Row only: the ids actually discarded (a pool is discarded whole), so the
  // stage screen can drop those rows.
  onRowDiscarded?: (discardedIds: string[]) => void;
  disabled?: boolean;
  // Footer only: padding / text size, to match the screen's other buttons.
  sizeClassName?: string;
}

// "Discard" button for a stage screen (Pre-processing to Testing), plus the
// dialog and what happens after a discard.
export default function DiscardSampleAction({
  samples,
  variant = "footer",
  onRowDiscarded,
  disabled,
  sizeClassName = "px-5 py-2.5 text-sm font-semibold",
}: DiscardSampleActionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const setSample = useSetAtom(sampleAtom);
  const setSelectedProcessableSamples = useSetAtom(
    selectedProcessableSamplesAtom,
  );

  if (!samples.length || !getDiscardStage(samples[0]?.sampleStatus)) {
    return null;
  }

  const handleDiscarded = (discarded: Sample[]) => {
    const ids = new Set(
      (discarded.length ? discarded : samples).map((s) => s.id),
    );
    setSelectedProcessableSamples((prev) => prev.filter((s) => !ids.has(s.id)));
    if (variant === "row") {
      onRowDiscarded?.(Array.from(ids));
      return;
    }
    // The page shows the discarded state once the open sample is discarded.
    setSample((prev) => {
      const match = prev && discarded.find((s) => s.id === prev.id);
      if (!prev || !match) return prev;
      return {
        ...prev,
        discardReason: match.discardReason,
        discardComment: match.discardComment,
        discardedAt: match.discardedAt,
        discardedBy: match.discardedBy,
      };
    });
  };

  return (
    <>
      {variant === "row" ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          disabled={disabled}
          title={
            samples.length > 1 ? "Discard pooled samples" : "Discard sample"
          }
          aria-label={
            samples.length > 1
              ? `Discard pooled samples ${samples.map((s) => s.barcode).join(", ")}`
              : `Discard sample ${samples[0].barcode}`
          }
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-grey-20 bg-white text-grey-60 transition-colors hover:border-red-20 hover:bg-red-10 hover:text-red-30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 size={16} />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          disabled={disabled}
          className={`inline-flex items-center justify-center gap-2 rounded-xl border border-red-20 bg-white text-red-30 transition-colors hover:border-red-30 hover:bg-red-10 disabled:cursor-not-allowed disabled:opacity-50 ${sizeClassName}`}
        >
          <Trash2 size={14} />
          Discard
        </button>
      )}
      <DiscardSampleModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        samples={samples}
        onDiscarded={handleDiscarded}
      />
    </>
  );
}
