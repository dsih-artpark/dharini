"use client";

import {
  CheckCircle2,
  RotateCcw,
  TriangleAlert,
  Upload,
  X,
} from "lucide-react";
import { useState } from "react";

/** Normalizes pipeline-supplied extensions so both `<input accept>` and our
 *  own filename check agree on a leading dot (the backend may or may not
 *  send one). */
export function normalizeExtensions(extensions: string[]): string[] {
  return extensions.map((ext) => (ext.startsWith(".") ? ext : `.${ext}`));
}

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes;
  let unitIndex = -1;
  do {
    value /= 1024;
    unitIndex += 1;
  } while (value >= 1024 && unitIndex < units.length - 1);
  return `${value.toFixed(unitIndex === 0 || value >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}

/**
 * A file's background-upload state, reported by the parent (which owns the
 * presign + PUT lifecycle) so this component can render it — it never
 * starts, tracks, or aborts an upload itself.
 */
export type FileUploadStatus =
  | { phase: "idle" }
  | { phase: "uploading"; fraction: number }
  | { phase: "done" }
  | { phase: "error"; message: string };

type SubmissionFilePickerProps = {
  id: string;
  label: string;
  description?: string | null;
  required?: boolean;
  acceptedExtensions: string[];
  file: File | null;
  onSelect: (file: File | null) => void;
  /** Background upload state for `file`; defaults to idle. */
  uploadStatus?: FileUploadStatus;
  /** Retries a failed upload for the currently-selected file, without
   *  requiring the user to re-pick it. */
  onRetry?: () => void;
  disabled?: boolean;
  /** Copy shown on the empty dropzone before a file is picked, e.g. "Choose a reads file". */
  promptText?: string;
  /** Show a "this file is required" note — set after a failed submit attempt. */
  showMissingError?: boolean;
};

/**
 * A single file slot: empty-state dropzone (with accepted formats stated up
 * front) or a picked-file card showing size and live background-upload
 * status (uploading / uploaded / failed-with-retry). Used for both the main
 * reads file and every pipeline.extraInputs entry so the behavior (extension
 * checking, in-flight state, remove, retry) is identical everywhere it
 * appears.
 */
export default function SubmissionFilePicker({
  id,
  label,
  description,
  required,
  acceptedExtensions,
  file,
  onSelect,
  uploadStatus = { phase: "idle" },
  onRetry,
  disabled,
  promptText = "Choose a file to upload",
  showMissingError,
}: SubmissionFilePickerProps) {
  const [rejection, setRejection] = useState<string | null>(null);
  const normalizedExts = normalizeExtensions(acceptedExtensions);
  const isUploading = uploadStatus.phase === "uploading";

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const picked = event.target.files?.[0] ?? null;
    event.target.value = ""; // so picking the same filename again after removal still fires onChange
    if (!picked) return;
    const matches =
      normalizedExts.length === 0 ||
      normalizedExts.some((ext) =>
        picked.name.toLowerCase().endsWith(ext.toLowerCase()),
      );
    if (!matches) {
      setRejection(
        normalizedExts.length > 0
          ? `Only ${normalizedExts.join(", ")} files are accepted.`
          : "That file type isn't accepted.",
      );
      return;
    }
    setRejection(null);
    onSelect(picked);
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-grey-90 text-sm font-semibold">
        {label}
        {required && <span className="text-red-30"> *</span>}
      </label>
      {description && <p className="text-grey-70 text-xs">{description}</p>}

      {file ? (
        <div
          className={`rounded-lg border bg-white px-3 py-2.5 ${
            uploadStatus.phase === "error" ? "border-red-30" : "border-grey-20"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex items-center gap-2">
              <Upload
                className="h-4 w-4 shrink-0 text-blue-40"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="text-grey-90 text-sm truncate">{file.name}</p>
                <p className="text-grey-70 text-xs">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            {!isUploading && (
              <button
                type="button"
                className="w-6 h-6 flex items-center justify-center shrink-0 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-40 disabled:opacity-60"
                aria-label={`Remove ${file.name}`}
                onClick={() => onSelect(null)}
                disabled={disabled}
              >
                <X className="h-4 w-4 text-grey-70" />
              </button>
            )}
          </div>

          {uploadStatus.phase === "uploading" && (
            <div className="mt-2 flex flex-col gap-1">
              <div className="h-1.5 overflow-hidden rounded-full bg-grey-20">
                <div
                  className="h-full rounded-full bg-blue-40 transition-all duration-200 motion-reduce:transition-none"
                  style={{
                    width: `${Math.round(uploadStatus.fraction * 100)}%`,
                  }}
                />
              </div>
              <p className="text-grey-70 text-xs">
                Uploading in the background —{" "}
                {Math.round(uploadStatus.fraction * 100)}%
              </p>
            </div>
          )}

          {uploadStatus.phase === "done" && (
            <p className="mt-2 flex items-center gap-1.5 text-green-30 text-xs">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              Uploaded
            </p>
          )}

          {uploadStatus.phase === "error" && (
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="flex items-center gap-1.5 text-red-30 text-xs">
                <TriangleAlert
                  className="h-3.5 w-3.5 shrink-0"
                  aria-hidden="true"
                />
                {uploadStatus.message}
              </p>
              {onRetry && (
                <button
                  type="button"
                  className="shrink-0 inline-flex items-center gap-1 text-blue-40 text-xs font-semibold rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-40 disabled:opacity-60"
                  onClick={onRetry}
                  disabled={disabled}
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  Retry
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-xl p-4 text-center bg-white ${
            rejection || showMissingError ? "border-red-30" : "border-grey-20"
          }`}
        >
          <input
            type="file"
            accept={normalizedExts.join(",") || undefined}
            className="hidden"
            id={id}
            disabled={disabled}
            onChange={handleChange}
          />
          <label
            htmlFor={id}
            className={`flex flex-col items-center ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            <Upload className="h-6 w-6 text-grey-70" aria-hidden="true" />
            <p className="mt-1 text-grey-70 text-sm">{promptText}</p>
            <p className="mt-0.5 text-grey-50 text-xs">
              {normalizedExts.length > 0
                ? `Accepts ${normalizedExts.join(", ")}`
                : "Any file type"}
            </p>
          </label>
        </div>
      )}
      {rejection && <p className="text-red-30 text-xs">{rejection}</p>}
      {!rejection && showMissingError && (
        <p className="text-red-30 text-xs">This file is required.</p>
      )}
    </div>
  );
}
