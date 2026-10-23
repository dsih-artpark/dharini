"use client";

import { CheckCircle2, RotateCcw, TriangleAlert } from "lucide-react";

export type SubmissionStepId = "sample" | "pipeline" | "files";

/** One row in the docked upload panel — one per file slot that has ever had
 *  a file picked (the main reads file, or one of pipeline.extraInputs). */
export type SubmissionUploadRow = {
  key: string;
  label: string;
  fileName: string;
  status: "uploading" | "done" | "error";
  /** 0-1, meaningful only while `status === "uploading"`. */
  fraction: number;
  errorMessage?: string;
  onRetry?: () => void;
};

type SubmissionSummaryProps = {
  currentStep: SubmissionStepId;
  sampleCaption: string | null;
  sampleBadge: string | null;
  pipelineCaption: string | null;
  uploads: SubmissionUploadRow[];
  /** Jump back to an already-completed step without losing anything entered
   *  on the way — only offered for steps behind the current one. */
  onStepClick?: (step: SubmissionStepId) => void;
};

const STEP_ORDER: SubmissionStepId[] = ["sample", "pipeline", "files"];
const STEP_LABELS: Record<SubmissionStepId, string> = {
  sample: "Sample",
  pipeline: "Pipeline",
  files: "Files & options",
};

/**
 * Stays mounted across all three submission steps: a compact stepper up top
 * (which step you're on, and a one-line recap of what you already chose)
 * plus, once at least one file has been picked, a docked panel of live
 * upload status — because uploads start the moment a file is chosen
 * (Task 3) and keep running in the background no matter which step the user
 * is looking at.
 */
export default function SubmissionSummary({
  currentStep,
  sampleCaption,
  sampleBadge,
  pipelineCaption,
  uploads,
  onStepClick,
}: SubmissionSummaryProps) {
  const currentIndex = STEP_ORDER.indexOf(currentStep);
  const captions: Record<SubmissionStepId, string | null> = {
    sample: sampleCaption,
    pipeline: pipelineCaption,
    files: null,
  };

  return (
    <div className="flex flex-col gap-3">
      <ol className="flex items-stretch gap-2" aria-label="Submission steps">
        {STEP_ORDER.map((step, index) => {
          const isDone = index < currentIndex;
          const isActive = step === currentStep;
          const caption = captions[step];
          const clickable = isDone && !!onStepClick;
          const Tag = clickable ? "button" : "div";
          return (
            <li key={step} className="flex-1 min-w-0">
              <Tag
                type={clickable ? "button" : undefined}
                onClick={clickable ? () => onStepClick?.(step) : undefined}
                aria-current={isActive ? "step" : undefined}
                className={`w-full h-full rounded-lg border px-3 py-2 flex items-center gap-2 text-left transition-colors duration-200 motion-reduce:transition-none ${
                  clickable
                    ? "cursor-pointer hover:border-teal-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-40"
                    : ""
                } ${isActive ? "border-teal-30 bg-teal-10" : isDone ? "border-grey-20 bg-grey-10" : "border-grey-20 bg-white"}`}
              >
                {isDone ? (
                  <CheckCircle2
                    className="h-4 w-4 shrink-0 text-teal-30"
                    aria-hidden="true"
                  />
                ) : (
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
                      isActive
                        ? "bg-teal-30 text-white"
                        : "bg-grey-20 text-grey-70"
                    }`}
                  >
                    {index + 1}
                  </span>
                )}
                <span className="min-w-0">
                  <span
                    className={`block text-xs font-semibold truncate ${isActive ? "text-teal-70" : "text-grey-80"}`}
                  >
                    {STEP_LABELS[step]}
                  </span>
                  {caption && (
                    <span className="block text-[11px] text-grey-70 truncate">
                      {caption}
                      {step === "sample" && sampleBadge
                        ? ` · ${sampleBadge}`
                        : ""}
                    </span>
                  )}
                </span>
              </Tag>
            </li>
          );
        })}
      </ol>

      {uploads.length > 0 && (
        <div className="flex flex-col gap-2.5 rounded-lg border border-grey-20 bg-grey-10 px-3 py-2.5">
          {uploads.map((upload) => (
            <div key={upload.key} className="min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-grey-90 truncate">
                  {upload.label}
                </p>
                <span className="text-[11px] text-grey-70 shrink-0">
                  {upload.status === "uploading" &&
                    `${Math.round(upload.fraction * 100)}%`}
                  {upload.status === "done" && "Uploaded"}
                  {upload.status === "error" && "Failed"}
                </span>
              </div>
              <p className="text-[11px] text-grey-70 truncate">
                {upload.fileName}
              </p>
              {upload.status === "uploading" && (
                <div className="mt-1 h-1 overflow-hidden rounded-full bg-grey-20">
                  <div
                    className="h-full rounded-full bg-blue-40 transition-all duration-200 motion-reduce:transition-none"
                    style={{ width: `${Math.round(upload.fraction * 100)}%` }}
                  />
                </div>
              )}
              {upload.status === "error" && (
                <div className="mt-1 flex items-center justify-between gap-2">
                  <p className="flex items-center gap-1 text-red-30 text-[11px]">
                    <TriangleAlert
                      className="h-3 w-3 shrink-0"
                      aria-hidden="true"
                    />
                    {upload.errorMessage || "Upload failed."}
                  </p>
                  {upload.onRetry && (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-blue-40 text-[11px] font-semibold rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-40"
                      onClick={upload.onRetry}
                    >
                      <RotateCcw className="h-3 w-3" aria-hidden="true" />
                      Retry
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
