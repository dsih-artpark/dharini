import { useState } from "react";
import { AlertCircle } from "lucide-react";

import type {
  DiseaseGroup,
  ImportTemplate,
  RowError,
} from "@/src/app/(dashboard)/project-onboarding/actions";
import {
  SECTION_LABELS,
  diseaseGroupLabel,
} from "@/src/components/project-onboarding/upload-data/import-options";

// Problems listed before "Show all"; row ranges listed per problem before
// the rest are counted.
const COLLAPSED_PROBLEM_COUNT = 5;
const MAX_ROW_RANGES = 6;

type ProblemGroup = { message: string; rows: number[] };

type ImportErrorSummaryProps = {
  errors: RowError[];
  selected: ImportTemplate;
  // The disease groups this project can take. A detected template for any
  // other group is named, but not offered as a switch.
  availableDiseaseGroups: DiseaseGroup[];
  onSwitchTemplate: (template: ImportTemplate) => void;
};

/**
 * Errors from a rejected upload, grouped so the list stays short however
 * many rows fail: one line per distinct problem with the rows it affects
 * ("Rows 5–124"). Problems with the whole file come first, without a row.
 */
export default function ImportErrorSummary({
  errors,
  selected,
  availableDiseaseGroups,
  onSwitchTemplate,
}: ImportErrorSummaryProps) {
  const [showAll, setShowAll] = useState(false);

  const wrongTemplate = errors.find((error) => error.detectedTemplate);
  if (wrongTemplate?.detectedTemplate) {
    const detected = wrongTemplate.detectedTemplate;
    const canSwitch = availableDiseaseGroups.includes(detected.diseaseGroup);
    return (
      <div
        role="alert"
        className="self-stretch flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex min-w-0 items-start gap-3">
          <AlertCircle
            className="mt-0.5 h-5 w-5 shrink-0 text-red-600"
            aria-hidden="true"
          />
          <div className="flex min-w-0 flex-col gap-1">
            <p className="text-sm font-semibold text-red-600">
              Wrong template. Nothing was imported.
            </p>
            <p className="text-sm text-grey-80">{wrongTemplate.message}</p>
            {!canSwitch && (
              <p className="text-sm text-grey-80">
                This project isn&apos;t set up for{" "}
                {diseaseGroupLabel(detected.diseaseGroup)}.
              </p>
            )}
          </div>
        </div>
        {canSwitch && (
          <button
            type="button"
            className="shrink-0 self-start rounded-lg bg-blue-40 px-4 py-2.5 text-sm text-white sm:self-center"
            onClick={() => onSwitchTemplate(detected)}
          >
            Switch to {templateDifference(detected, selected)}
          </button>
        )}
      </div>
    );
  }

  const fileErrors = errors.filter((error) => error.row <= 0);
  const groups = groupByMessage(errors.filter((error) => error.row > 0));
  const rowCount = new Set(groups.flatMap((group) => group.rows)).size;
  const problemCount = fileErrors.length + groups.length;
  const visibleGroups = showAll
    ? groups
    : groups.slice(0, COLLAPSED_PROBLEM_COUNT);

  return (
    <div
      role="alert"
      className="self-stretch flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-4"
    >
      <div className="flex items-start gap-3">
        <AlertCircle
          className="mt-0.5 h-5 w-5 shrink-0 text-red-600"
          aria-hidden="true"
        />
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-sm font-semibold text-red-600">
            Nothing was imported
            {rowCount > 0 &&
              ` — ${plural(problemCount, "problem")} in ${plural(rowCount, "row")}`}
          </p>
          <p className="text-sm text-grey-80">
            Fix {problemCount === 1 ? "this" : "these"} in the file and upload
            again.
            {rowCount > 0 &&
              " Rows with problems are marked in red in the preview above."}
          </p>
        </div>
      </div>

      {fileErrors.map((error, index) => (
        <p
          key={index}
          className="rounded-md border border-red-200 bg-white px-3 py-2.5 text-sm text-grey-90"
        >
          {error.message}
        </p>
      ))}

      {groups.length > 0 && (
        <ul
          className={`flex flex-col divide-y divide-red-100 rounded-md border border-red-200 bg-white ${
            showAll ? "max-h-80 overflow-y-auto" : ""
          }`}
        >
          {visibleGroups.map((group) => (
            <li
              key={group.message}
              className="flex flex-col gap-1 px-3 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <p className="min-w-0 break-words text-sm text-grey-90">
                {group.message}
              </p>
              <p className="shrink-0 text-xs font-semibold text-red-600 sm:max-w-[45%] sm:text-right">
                {formatRows(group.rows)}
              </p>
            </li>
          ))}
        </ul>
      )}

      {groups.length > COLLAPSED_PROBLEM_COUNT && (
        <button
          type="button"
          aria-expanded={showAll}
          className="self-start text-sm font-semibold text-blue-40 hover:underline"
          onClick={() => setShowAll((value) => !value)}
        >
          {showAll ? "Show fewer" : `Show all ${groups.length} problems`}
        </button>
      )}
    </div>
  );
}

// Same message on many rows becomes one problem, in order of first row.
function groupByMessage(errors: RowError[]): ProblemGroup[] {
  const rowsByMessage = new Map<string, Set<number>>();
  for (const error of errors) {
    const rows = rowsByMessage.get(error.message) ?? new Set<number>();
    rows.add(error.row);
    rowsByMessage.set(error.message, rows);
  }
  return [...rowsByMessage]
    .map(([message, rows]) => ({
      message,
      rows: [...rows].sort((a, b) => a - b),
    }))
    .sort((a, b) => a.rows[0] - b.rows[0]);
}

// [5, 6, 7, 9, 12, 13] -> "Rows 5–7, 9, 12–13"
function formatRows(rows: number[]): string {
  const ranges: [number, number][] = [];
  for (const row of rows) {
    const last = ranges[ranges.length - 1];
    if (last && row === last[1] + 1) last[1] = row;
    else ranges.push([row, row]);
  }
  const listed = ranges
    .slice(0, MAX_ROW_RANGES)
    .map(([start, end]) => (start === end ? `${start}` : `${start}–${end}`))
    .join(", ");
  const unlistedRows = ranges
    .slice(MAX_ROW_RANGES)
    .reduce((count, [start, end]) => count + end - start + 1, 0);
  return `${rows.length === 1 ? "Row" : "Rows"} ${listed}${
    unlistedRows > 0 ? ` and ${unlistedRows} more` : ""
  }`;
}

// Names only what the user has to change: the section, the disease, or both.
function templateDifference(
  detected: ImportTemplate,
  selected: ImportTemplate
): string {
  const section = SECTION_LABELS[detected.section];
  const disease = diseaseGroupLabel(detected.diseaseGroup);
  if (detected.diseaseGroup === selected.diseaseGroup) return section;
  if (detected.section === selected.section) return disease;
  return `${disease} ${section}`;
}

function plural(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}
