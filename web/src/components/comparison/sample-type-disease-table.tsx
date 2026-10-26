"use client";

import { SampleTypeComparisonData } from "@/src/types/statistics";
import { PAIR_COLORS } from "./colors";
import { useSortableRows, SortHeader } from "./sortable-table";

interface Props {
  diseaseComparison: SampleTypeComparisonData["diseaseComparison"];
  sampleTypes: SampleTypeComparisonData["sampleTypes"];
  summary: SampleTypeComparisonData["summary"];
}

type DiseaseRow = SampleTypeComparisonData["diseaseComparison"][number];

const higherIndex = (a: number, b: number): 0 | 1 | null => {
  if (a > b) return 0;
  if (b > a) return 1;
  return null;
};

function HigherBadge({
  types,
  idx,
}: {
  types: SampleTypeComparisonData["sampleTypes"];
  idx: 0 | 1 | null;
}) {
  if (idx === null) return <span className="text-grey-50 text-xs">—</span>;
  const color = PAIR_COLORS[idx];
  return (
    <span
      className="px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap"
      style={{ color, backgroundColor: `${color}1A` }}
    >
      {types[idx].name}
    </span>
  );
}

function CountCell({
  count,
  percentage,
  color,
}: {
  count: number;
  percentage: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 justify-end">
      <span className="text-sm text-grey-80 tabular-nums whitespace-nowrap">
        {count.toLocaleString()} ({percentage.toFixed(1)}%)
      </span>
      <div className="w-20 h-2 rounded bg-grey-20 overflow-hidden shrink-0">
        <div
          className="h-2 rounded"
          style={{
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

export default function SampleTypeDiseaseTable({
  diseaseComparison,
  sampleTypes,
  summary,
}: Props) {
  const id1 = sampleTypes[0]?.id;
  const id2 = sampleTypes[1]?.id;

  const accessors: Record<string, (row: DiseaseRow) => number | string | null> =
    {
      name: (r) => r.name,
      t1: (r) => (id1 ? (r.byType[id1]?.positiveCount ?? 0) : null),
      t2: (r) => (id2 ? (r.byType[id2]?.positiveCount ?? 0) : null),
      higher: (r) =>
        id1 && id2
          ? higherIndex(
              r.byType[id1]?.percentage ?? 0,
              r.byType[id2]?.percentage ?? 0,
            )
          : null,
    };

  const { sortedRows, sortKey, sortDir, toggle } = useSortableRows(
    diseaseComparison,
    accessors,
  );

  if (sampleTypes.length < 2) return null;

  const [t1, t2] = sampleTypes;
  const total1 = summary[t1.id]?.positiveSamples ?? 0;
  const total2 = summary[t2.id]?.positiveSamples ?? 0;

  return (
    <div className="overflow-auto max-h-[440px]">
      <table className="w-full">
        <thead className="bg-grey-10 border-b border-grey-20 sticky top-0 z-10 [&>tr>th]:bg-grey-10">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-grey-70 uppercase tracking-wide">
              <SortHeader
                label="Disease"
                columnKey="name"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={toggle}
              />
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-grey-70 uppercase tracking-wide whitespace-nowrap">
              <SortHeader
                label={`${t1.name} — Positives (%)`}
                columnKey="t1"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={toggle}
                align="right"
              />
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-grey-70 uppercase tracking-wide whitespace-nowrap">
              <SortHeader
                label={`${t2.name} — Positives (%)`}
                columnKey="t2"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={toggle}
                align="right"
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-grey-70 uppercase tracking-wide">
              <SortHeader
                label="Higher Positivity"
                columnKey="higher"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={toggle}
              />
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-grey-20">
          {sortedRows.map((row) => {
            const a = row.byType[t1.id] ?? { positiveCount: 0, percentage: 0 };
            const b = row.byType[t2.id] ?? { positiveCount: 0, percentage: 0 };
            return (
              <tr key={row.diseaseId} className="hover:bg-grey-5">
                <td className="px-6 py-4 text-sm font-medium text-grey-80 whitespace-nowrap">
                  {row.name}
                  {row.shortName ? (
                    <span className="text-grey-50"> ({row.shortName})</span>
                  ) : null}
                </td>
                <td className="px-6 py-4">
                  <CountCell
                    count={a.positiveCount}
                    percentage={a.percentage}
                    color={PAIR_COLORS[0]}
                  />
                </td>
                <td className="px-6 py-4">
                  <CountCell
                    count={b.positiveCount}
                    percentage={b.percentage}
                    color={PAIR_COLORS[1]}
                  />
                </td>
                <td className="px-6 py-4">
                  <HigherBadge
                    types={sampleTypes}
                    idx={higherIndex(a.percentage, b.percentage)}
                  />
                </td>
              </tr>
            );
          })}
          <tr className="bg-grey-10 font-semibold">
            <td className="px-6 py-4 text-sm text-grey-90 whitespace-nowrap">
              Total Positive Samples
            </td>
            <td className="px-6 py-4 text-sm text-grey-90 text-center tabular-nums">
              {total1.toLocaleString()} (100%)
            </td>
            <td className="px-6 py-4 text-sm text-grey-90 text-center tabular-nums">
              {total2.toLocaleString()} (100%)
            </td>
            <td className="px-6 py-4">
              <span className="text-grey-50 text-xs">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
