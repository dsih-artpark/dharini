"use client";

import { SiteComparisonData } from "@/src/types/statistics";
import { SITE_COLORS } from "./colors";
import { useSortableRows, SortHeader } from "./sortable-table";

interface Props {
  matrix: SiteComparisonData["sampleTypeMatrix"];
  sites: SiteComparisonData["sites"];
  summary: SiteComparisonData["summary"];
}

type MatrixRow = SiteComparisonData["sampleTypeMatrix"][number];

const fmtPct = (v: number | null | undefined) =>
  v === null || v === undefined ? "—" : `${v.toFixed(1)}%`;

const signedPct = (v: number | null) =>
  v === null ? "—" : `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;

// Returns the index (0 or 1) of the higher site, or null when undecidable.
const higherIndex = (
  a: number | null | undefined,
  b: number | null | undefined,
): 0 | 1 | null => {
  const av = a ?? null;
  const bv = b ?? null;
  if (av === null && bv === null) return null;
  if (av === null) return 1;
  if (bv === null) return 0;
  if (av > bv) return 0;
  if (bv > av) return 1;
  return null;
};

const diffOf = (a: number | null, b: number | null) =>
  a === null || b === null ? null : Math.round((a - b) * 10) / 10;

function HigherBadge({
  sites,
  idx,
}: {
  sites: SiteComparisonData["sites"];
  idx: 0 | 1 | null;
}) {
  if (idx === null) {
    return <span className="text-grey-50 text-xs">—</span>;
  }
  const color = SITE_COLORS[idx];
  return (
    <span
      className="px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap"
      style={{ color, backgroundColor: `${color}1A` }}
    >
      {sites[idx].name}
    </span>
  );
}

export default function SiteComparisonTable({ matrix, sites, summary }: Props) {
  const s1 = sites[0]?.id;
  const s2 = sites[1]?.id;

  const accessors: Record<string, (row: MatrixRow) => number | string | null> =
    {
      name: (r) => r.name,
      site1: (r) => (s1 ? (r.bySite[s1] ?? null) : null),
      site2: (r) => (s2 ? (r.bySite[s2] ?? null) : null),
      diff: (r) =>
        diffOf(
          s1 ? (r.bySite[s1] ?? null) : null,
          s2 ? (r.bySite[s2] ?? null) : null,
        ),
      higher: (r) =>
        s1 && s2 ? higherIndex(r.bySite[s1], r.bySite[s2]) : null,
    };

  const { sortedRows, sortKey, sortDir, toggle } = useSortableRows(
    matrix,
    accessors,
  );

  if (sites.length < 2) return null;

  const [site1, site2] = sites;
  const rate1 = summary[site1.id]?.positivityRate ?? null;
  const rate2 = summary[site2.id]?.positivityRate ?? null;

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
            <th className="px-6 py-3 text-right text-xs font-semibold text-grey-70 uppercase tracking-wide whitespace-nowrap">
              <SortHeader
                label={`${site1.name} (%)`}
                columnKey="site1"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={toggle}
                align="right"
              />
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-grey-70 uppercase tracking-wide whitespace-nowrap">
              <SortHeader
                label={`${site2.name} (%)`}
                columnKey="site2"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={toggle}
                align="right"
              />
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-grey-70 uppercase tracking-wide whitespace-nowrap">
              <SortHeader
                label="Difference"
                columnKey="diff"
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
            const r1 = row.bySite[site1.id];
            const r2 = row.bySite[site2.id];
            const diff = diffOf(r1 ?? null, r2 ?? null);
            return (
              <tr key={row.sampleTypeId} className="hover:bg-grey-5">
                <td className="px-6 py-4 text-sm font-medium text-grey-80 whitespace-nowrap">
                  {row.name}
                </td>
                <td className="px-6 py-4 text-sm text-grey-70 text-right tabular-nums">
                  {fmtPct(r1)}
                </td>
                <td className="px-6 py-4 text-sm text-grey-70 text-right tabular-nums">
                  {fmtPct(r2)}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-grey-80 text-right tabular-nums">
                  {signedPct(diff)}
                </td>
                <td className="px-6 py-4">
                  <HigherBadge sites={sites} idx={higherIndex(r1, r2)} />
                </td>
              </tr>
            );
          })}
          {/* Overall average row (always pinned at the bottom, not sorted) */}
          <tr className="bg-grey-10 font-semibold">
            <td className="px-6 py-4 text-sm text-grey-90 whitespace-nowrap">
              Overall Average
            </td>
            <td className="px-6 py-4 text-sm text-grey-90 text-right tabular-nums">
              {fmtPct(rate1)}
            </td>
            <td className="px-6 py-4 text-sm text-grey-90 text-right tabular-nums">
              {fmtPct(rate2)}
            </td>
            <td className="px-6 py-4 text-sm text-grey-90 text-right tabular-nums">
              {signedPct(diffOf(rate1, rate2))}
            </td>
            <td className="px-6 py-4">
              <HigherBadge sites={sites} idx={higherIndex(rate1, rate2)} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
