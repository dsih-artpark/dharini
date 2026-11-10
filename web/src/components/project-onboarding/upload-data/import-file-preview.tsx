import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

import type { RowError } from "@/src/app/(dashboard)/project-onboarding/actions";
import {
  ImportPreview,
  parseImportPreview,
} from "@/src/components/project-onboarding/upload-data/parse-import-preview";

// Enough to check a file by eye without rendering thousands of table cells.
const MAX_PREVIEW_ROWS = 200;
const NO_ERRORS: RowError[] = [];

type PreviewState =
  | { status: "loading" }
  | { status: "ready"; preview: ImportPreview }
  | { status: "error"; message: string };

type ImportFilePreviewProps = {
  file: File;
  // Errors from a rejected upload of this file, marked on the matching rows.
  errors?: RowError[];
};

export default function ImportFilePreview({
  file,
  errors = NO_ERRORS,
}: ImportFilePreviewProps) {
  const [state, setState] = useState<PreviewState>({ status: "loading" });

  useEffect(() => {
    // Picking another file while one is still being read must not let the
    // older read overwrite the newer preview.
    let cancelled = false;
    setState({ status: "loading" });
    parseImportPreview(file)
      .then((preview) => {
        if (!cancelled) setState({ status: "ready", preview });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setState({
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : "This file couldn't be read.",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [file]);

  const errorsByRow = useMemo(() => {
    const byRow = new Map<number, RowError[]>();
    for (const error of errors) {
      byRow.set(error.row, [...(byRow.get(error.row) ?? []), error]);
    }
    return byRow;
  }, [errors]);

  if (state.status === "loading") {
    return (
      <div className="flex items-center gap-2 border-t border-grey-20 px-3 py-3 text-sm text-grey-70">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        Reading file for preview...
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="flex items-start gap-2 border-t border-grey-20 bg-warning-50 px-3 py-3 text-sm text-warning-600">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <p>Can&apos;t show a preview. {state.message}</p>
      </div>
    );
  }

  const { preview } = state;
  if (preview.rows.length === 0) {
    return (
      <div className="border-t border-grey-20 px-3 py-3 text-sm text-grey-70">
        No data rows found below the header row.
      </div>
    );
  }

  const visibleRows = preview.rows.slice(0, MAX_PREVIEW_ROWS);
  const rowsWithIssues = preview.rows.filter((row) =>
    errorsByRow.has(row.rowNumber)
  ).length;

  return (
    <div className="flex flex-col border-t border-grey-20">
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
        <p className="text-xs text-grey-70">
          <span className="font-semibold text-grey-80">Preview</span>
          {" · "}
          {preview.rows.length} row{preview.rows.length === 1 ? "" : "s"}
          {" · "}
          {preview.headers.length} columns
          {" · "}
          Sheet &ldquo;{preview.sheetName}&rdquo;
        </p>
        {rowsWithIssues > 0 && (
          <p className="text-xs font-semibold text-red-600">
            {rowsWithIssues} row{rowsWithIssues === 1 ? "" : "s"} with issues
          </p>
        )}
      </div>

      <div
        className="max-h-[360px] overflow-auto border-t border-grey-20"
        role="region"
        aria-label={`Preview of ${file.name}`}
        tabIndex={0}
      >
        <table className="min-w-full border-separate border-spacing-0 text-left text-xs">
          <thead>
            <tr>
              <th
                scope="col"
                title="Row number in the spreadsheet"
                className="sticky left-0 top-0 z-30 border-b border-r border-grey-20 bg-grey-10 px-3 py-2 font-semibold text-grey-70"
              >
                Row
              </th>
              {preview.headers.map((header, index) => (
                <th
                  key={`${index}-${header}`}
                  scope="col"
                  className="sticky top-0 z-20 whitespace-nowrap border-b border-grey-20 bg-grey-10 px-3 py-2 font-semibold text-grey-80"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => {
              const rowErrors = errorsByRow.get(row.rowNumber);
              return (
                <tr key={row.rowNumber}>
                  <th
                    scope="row"
                    title={rowErrors?.map((error) => error.message).join("\n")}
                    className={`sticky left-0 z-10 border-b border-r border-grey-20 px-3 py-2 text-right tabular-nums ${
                      rowErrors
                        ? "bg-red-50 font-semibold text-red-600"
                        : "bg-white font-normal text-grey-70"
                    }`}
                  >
                    {row.rowNumber}
                  </th>
                  {row.cells.map((value, index) => {
                    const header = preview.headers[index];
                    const cellErrors = rowErrors?.filter(
                      (error) => (error.field ?? error.column) === header
                    );
                    const hasError = !!cellErrors?.length;
                    return (
                      <td
                        key={`${index}-${header}`}
                        title={
                          hasError
                            ? cellErrors.map((error) => error.message).join("\n")
                            : value || undefined
                        }
                        className={`border-b border-grey-20 px-3 py-2 ${
                          hasError ? "bg-red-50 text-red-600" : "text-grey-90"
                        }`}
                      >
                        <div className="max-w-[240px] truncate">{value}</div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {preview.rows.length > visibleRows.length && (
        <p className="border-t border-grey-20 px-3 py-2 text-xs text-grey-70">
          Showing the first {MAX_PREVIEW_ROWS} of {preview.rows.length} rows.
          All rows are checked on upload.
        </p>
      )}
    </div>
  );
}
