"use client";

import { ProjectComparisonData } from "@/src/types/statistics";
import { useSortableRows, SortHeader } from "./sortable-table";

interface Props {
  matrix: ProjectComparisonData["matrix"];
  projects: ProjectComparisonData["projects"];
}

type MatrixRow = ProjectComparisonData["matrix"][number];

const fmtCell = (
  cell:
    | { rate: number; positiveCount: number; totalCount: number }
    | null
    | undefined,
) =>
  cell
    ? `${cell.positiveCount}/${cell.totalCount} (${cell.rate.toFixed(1)}%)`
    : "—";

export default function ComparisonMatrixTable({ matrix, projects }: Props) {
  const accessors: Record<string, (row: MatrixRow) => number | string | null> =
    {
      name: (r) => r.name,
      overall: (r) => r.overallAverage,
    };
  projects.forEach((p) => {
    accessors[`proj:${p.id}`] = (r) => r.byProject[p.id]?.rate ?? null;
  });

  const { sortedRows, sortKey, sortDir, toggle } = useSortableRows(
    matrix,
    accessors,
  );

  if (!matrix.length) {
    return (
      <div className="h-[160px] flex items-center justify-center text-grey-60 text-sm">
        No matrix data
      </div>
    );
  }

  return (
    <div className="overflow-auto max-h-[440px]">
      <table className="w-full">
        <thead className="bg-grey-10 border-b border-grey-20 sticky top-0 z-10 [&>tr>th]:bg-grey-10">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-grey-70 uppercase tracking-wide">
              <SortHeader
                label="Sample Type"
                columnKey="name"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={toggle}
              />
            </th>
            {projects.map((p) => (
              <th
                key={p.id}
                className="px-6 py-3 text-right text-xs font-semibold text-grey-70 uppercase tracking-wide whitespace-nowrap"
              >
                <SortHeader
                  label={p.name}
                  columnKey={`proj:${p.id}`}
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSort={toggle}
                  align="right"
                />
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-semibold text-grey-70 uppercase tracking-wide min-w-[180px]">
              <SortHeader
                label="Overall Average"
                columnKey="overall"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={toggle}
              />
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-grey-20">
          {sortedRows.map((row) => (
            <tr key={row.sampleTypeId} className="hover:bg-grey-5">
              <td className="px-6 py-4 text-sm font-medium text-grey-80 whitespace-nowrap">
                {row.name}
              </td>
              {projects.map((p) => (
                <td
                  key={p.id}
                  className="px-6 py-4 text-sm text-grey-70 text-right tabular-nums"
                >
                  {fmtCell(row.byProject[p.id])}
                </td>
              ))}
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded bg-grey-20 overflow-hidden min-w-[80px]">
                    <div
                      className="h-2 rounded bg-blue-40"
                      style={{
                        width: `${Math.min(row.overallAverage, 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-grey-80 tabular-nums w-14 text-right">
                    {row.overallAverage.toFixed(1)}%
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
