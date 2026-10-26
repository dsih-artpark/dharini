"use client";

import { Check, Layers, FileType2 } from "lucide-react";
import type { SequencingPipeline } from "@/src/app/(dashboard)/sequencing/sequencing-processing-types";
import { normalizeExtensions } from "./submission-file-picker";

type SubmissionPipelinePickerProps = {
  pipelines: SequencingPipeline[];
  selectedPipelineId: string;
  onSelect: (pipelineId: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
};

/**
 * Pipelines are backend-defined and expected to grow past the two that exist
 * today, so this renders as a scannable list of cards (displayName,
 * description, accepted file types, stage count) rather than a plain
 * dropdown — there's no room in a `<select>` option to show any of that, and
 * with ~6 pipelines a list reads faster than a dropdown anyway. This is the
 * most consequential choice in the submission flow (it determines every
 * field and file the rest of the form asks for), so it gets its own step
 * and the most prominent card treatment in the modal.
 */
export default function SubmissionPipelinePicker({
  pipelines,
  selectedPipelineId,
  onSelect,
  isLoading,
  disabled,
}: SubmissionPipelinePickerProps) {
  if (isLoading) {
    return <p className="text-grey-70 text-sm">Loading pipelines…</p>;
  }
  if (pipelines.length === 0) {
    return (
      <p className="text-grey-70 text-sm">
        No processing pipelines are available right now.
      </p>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Processing pipeline"
      className="flex flex-col gap-3"
    >
      {pipelines.map((pipeline) => {
        const isSelected = pipeline.id === selectedPipelineId;
        const extensions = normalizeExtensions(pipeline.acceptedExtensions);
        const stageCount = pipeline.stages.length;
        return (
          <button
            key={pipeline.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() => onSelect(pipeline.id)}
            className={`w-full text-left rounded-xl border px-5 py-4 flex items-start justify-between gap-4 transition-colors duration-200 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-40 disabled:opacity-60 disabled:cursor-not-allowed ${
              isSelected
                ? "border-teal-30 bg-teal-10"
                : "border-grey-20 bg-white hover:border-teal-20 hover:bg-teal-10/40"
            }`}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-grey-90 text-base font-semibold">
                  {pipeline.displayName || pipeline.id}
                </p>
                <span className="px-2 py-0.5 rounded-full bg-white border border-grey-20 text-grey-70 text-xs">
                  v{pipeline.version}
                </span>
              </div>
              {pipeline.description && (
                <p className="mt-1 text-grey-70 text-sm">
                  {pipeline.description}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                {extensions.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-grey-70 text-xs">
                    <FileType2
                      className="h-3.5 w-3.5 shrink-0"
                      aria-hidden="true"
                    />
                    Accepts {extensions.join(", ")}
                  </span>
                )}
                {stageCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-grey-70 text-xs">
                    <Layers
                      className="h-3.5 w-3.5 shrink-0"
                      aria-hidden="true"
                    />
                    {stageCount} stage{stageCount === 1 ? "" : "s"}
                  </span>
                )}
              </div>
            </div>
            <div
              className={`mt-0.5 w-5 h-5 rounded-full border shrink-0 flex items-center justify-center ${
                isSelected
                  ? "border-teal-30 bg-teal-30"
                  : "border-grey-40 bg-white"
              }`}
              aria-hidden="true"
            >
              {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
            </div>
          </button>
        );
      })}
    </div>
  );
}
