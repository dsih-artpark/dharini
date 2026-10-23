"use client";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { SequencingVariant } from "@/src/app/(dashboard)/sequencing/sequencing-processing-types";

type ImpactLevel = "HIGH" | "MODERATE" | "LOW" | "MODIFIER";

const IMPACT_ORDER: ImpactLevel[] = ["HIGH", "MODERATE", "LOW", "MODIFIER"];

const IMPACT_STYLES: Record<
  ImpactLevel,
  {
    label: string;
    badge: string;
    chipActive: string;
    chipIdle: string;
    dot: string;
  }
> = {
  HIGH: {
    label: "High",
    badge: "border-red-20 bg-red-10 text-red-30",
    chipActive: "border-red-30 bg-red-10 text-red-30 font-semibold shadow-sm",
    chipIdle:
      "border-grey-20 bg-white text-grey-70 hover:border-red-20 hover:text-red-30",
    dot: "bg-red-30",
  },
  MODERATE: {
    label: "Moderate",
    badge: "border-yellow-20 bg-yellow-10 text-yellow-30",
    chipActive:
      "border-yellow-30 bg-yellow-10 text-yellow-30 font-semibold shadow-sm",
    chipIdle:
      "border-grey-20 bg-white text-grey-70 hover:border-yellow-20 hover:text-yellow-30",
    dot: "bg-yellow-30",
  },
  LOW: {
    label: "Low",
    badge: "border-green-20 bg-green-10 text-green-30",
    chipActive:
      "border-green-30 bg-green-10 text-green-30 font-semibold shadow-sm",
    chipIdle:
      "border-grey-20 bg-white text-grey-70 hover:border-green-20 hover:text-green-30",
    dot: "bg-green-30",
  },
  MODIFIER: {
    label: "Modifier",
    badge: "border-blue-20 bg-blue-10 text-blue-40",
    chipActive:
      "border-blue-40 bg-blue-10 text-blue-40 font-semibold shadow-sm",
    chipIdle:
      "border-grey-20 bg-white text-grey-70 hover:border-blue-20 hover:text-blue-40",
    dot: "bg-blue-40",
  },
};

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-40 focus-visible:ring-offset-1";

function normalizeImpact(impact: string): ImpactLevel {
  const upper = (impact || "").toUpperCase();
  return (IMPACT_ORDER as string[]).includes(upper)
    ? (upper as ImpactLevel)
    : "MODIFIER";
}

function formatAlleleFreq(value: number | null): string {
  if (value == null || Number.isNaN(value)) return "—";
  return `${(value * 100).toFixed(1)}%`;
}

function escapeCsv(val: unknown): string {
  if (val == null) return '""';
  const str = String(val);
  return `"${str.replace(/"/g, '""')}"`;
}

type SortKey =
  "impact" | "position" | "gene" | "effect" | "depth" | "alleleFreq";
type SortDirection = "asc" | "desc";

const SORT_DEFAULT_DIRECTION: Record<SortKey, SortDirection> = {
  impact: "asc",
  position: "asc",
  gene: "asc",
  effect: "asc",
  depth: "desc",
  alleleFreq: "desc",
};

function SortableHeader({
  label,
  sortKey,
  activeKey,
  direction,
  onSort,
  className = "",
}: {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey;
  direction: SortDirection;
  onSort: (key: SortKey) => void;
  className?: string;
}) {
  const isActive = sortKey === activeKey;

  return (
    <th scope="col" className={`px-3 py-2.5 text-left ${className}`}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-grey-70 hover:text-grey-90 ${FOCUS_RING}`}
      >
        {label}
        {isActive ? (
          direction === "asc" ? (
            <ArrowUp className="h-3 w-3 text-blue-40" />
          ) : (
            <ArrowDown className="h-3 w-3 text-blue-40" />
          )
        ) : (
          <ArrowUpDown className="h-3 w-3 text-grey-40 opacity-50" />
        )}
      </button>
    </th>
  );
}

type Props = { variants: SequencingVariant[] };

const PAGE_SIZE_OPTIONS = [10, 25, 50];

export default function RunVariantsTable({ variants }: Props) {
  const [impactFilter, setImpactFilter] = useState<ImpactLevel | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("impact");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const counts = useMemo(() => {
    const base: Record<ImpactLevel, number> = {
      HIGH: 0,
      MODERATE: 0,
      LOW: 0,
      MODIFIER: 0,
    };
    for (const variant of variants) base[normalizeImpact(variant.impact)]++;
    return base;
  }, [variants]);

  const filteredAndSortedRows = useMemo(() => {
    let list = variants;

    // 1. Impact filter
    if (impactFilter !== "ALL") {
      list = list.filter((v) => normalizeImpact(v.impact) === impactFilter);
    }

    // 2. Search query (gene, chrom:pos, effect, hgvsP)
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((v) => {
        const gene = (v.gene || "").toLowerCase();
        const pos = `${v.chrom}:${v.pos}`.toLowerCase();
        const change = `${v.ref}>${v.alt}`.toLowerCase();
        const effect = (v.effect || "").toLowerCase();
        const hgvs = (v.hgvsP || "").toLowerCase();
        return (
          gene.includes(q) ||
          pos.includes(q) ||
          change.includes(q) ||
          effect.includes(q) ||
          hgvs.includes(q)
        );
      });
    }

    // 3. Sorting
    return [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "impact") {
        cmp =
          IMPACT_ORDER.indexOf(normalizeImpact(a.impact)) -
          IMPACT_ORDER.indexOf(normalizeImpact(b.impact));
      } else if (sortKey === "position") {
        cmp =
          a.chrom === b.chrom ? a.pos - b.pos : a.chrom.localeCompare(b.chrom);
      } else if (sortKey === "gene") {
        cmp = (a.gene || "").localeCompare(b.gene || "");
      } else if (sortKey === "effect") {
        cmp = (a.effect || "").localeCompare(b.effect || "");
      } else if (sortKey === "depth") {
        cmp = (a.depth ?? -1) - (b.depth ?? -1);
      } else {
        cmp = (a.alleleFreq ?? -1) - (b.alleleFreq ?? -1);
      }
      return sortDirection === "asc" ? cmp : -cmp;
    });
  }, [variants, impactFilter, searchQuery, sortKey, sortDirection]);

  const totalRows = filteredAndSortedRows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * pageSize;
  const pageRows = filteredAndSortedRows.slice(
    startIndex,
    startIndex + pageSize,
  );

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDirection(SORT_DEFAULT_DIRECTION[key]);
  };

  const handleExportCsv = () => {
    const headers = [
      "Position",
      "Ref",
      "Alt",
      "Gene",
      "Effect",
      "HGVS.p",
      "Impact",
      "Depth",
      "Allele Frequency",
    ];
    const rows = filteredAndSortedRows.map((v) => [
      `${v.chrom}:${v.pos}`,
      v.ref,
      v.alt,
      v.gene || "",
      v.effect || "",
      v.hgvsP || "",
      normalizeImpact(v.impact),
      v.depth ?? "",
      v.alleleFreq != null ? `${(v.alleleFreq * 100).toFixed(1)}%` : "",
    ]);
    const csvContent = [headers, ...rows]
      .map((r) => r.map(escapeCsv).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `variants-export-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (variants.length === 0) {
    return (
      <div className="rounded-xl border border-grey-20 bg-white p-5">
        <h3 className="text-base font-semibold text-grey-90">Variants</h3>
        <p className="mt-1 text-sm text-grey-70">
          No variants were called for this run.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-grey-20 bg-white p-5 shadow-sm">
      {/* Header & Controls Toolbar */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-grey-90">
              Called Variants
            </h3>
            <span className="rounded-full bg-grey-10 px-2.5 py-0.5 text-xs font-semibold text-grey-70">
              {variants.length.toLocaleString()} total
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-grey-50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search gene, position, effect…"
                className={`h-8 w-52 rounded-lg border border-grey-20 bg-white pl-8 pr-7 text-xs text-grey-90 placeholder:text-grey-50 ${FOCUS_RING}`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-grey-40 hover:text-grey-70"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Export CSV Button */}
            <button
              type="button"
              onClick={handleExportCsv}
              title="Download filtered variants as CSV"
              className={`inline-flex h-8 items-center gap-1.5 rounded-lg border border-grey-20 bg-white px-2.5 text-xs font-semibold text-grey-70 hover:bg-grey-10 hover:text-grey-90 ${FOCUS_RING}`}
            >
              <Download className="h-3.5 w-3.5" />
              <span>CSV</span>
            </button>
          </div>
        </div>

        {/* Impact Filter Chips */}
        <div
          className="flex flex-wrap items-center gap-1.5"
          role="group"
          aria-label="Filter variants by impact"
        >
          <button
            type="button"
            onClick={() => {
              setImpactFilter("ALL");
              setCurrentPage(1);
            }}
            className={[
              "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
              impactFilter === "ALL"
                ? "border-teal-30 bg-teal-10 text-teal-30 font-semibold shadow-sm"
                : "border-grey-20 bg-white text-grey-70 hover:border-teal-20 hover:text-teal-30",
              FOCUS_RING,
            ].join(" ")}
          >
            All <span>({variants.length})</span>
          </button>
          {IMPACT_ORDER.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => {
                setImpactFilter((prev) => (prev === level ? "ALL" : level));
                setCurrentPage(1);
              }}
              className={[
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                impactFilter === level
                  ? IMPACT_STYLES[level].chipActive
                  : IMPACT_STYLES[level].chipIdle,
                FOCUS_RING,
              ].join(" ")}
            >
              <span
                className={`h-2 w-2 rounded-full ${IMPACT_STYLES[level].dot}`}
                aria-hidden="true"
              />
              {IMPACT_STYLES[level].label}{" "}
              <span className="text-[11px] opacity-80">({counts[level]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {totalRows === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-grey-20 p-6 text-center">
          <p className="text-sm text-grey-70">
            No variants match your{" "}
            {searchQuery ? `search "${searchQuery}"` : "filter"}.
          </p>
          {(searchQuery || impactFilter !== "ALL") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setImpactFilter("ALL");
                setCurrentPage(1);
              }}
              className={`mt-2 text-xs font-semibold text-blue-40 hover:underline ${FOCUS_RING}`}
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="mt-3 overflow-hidden rounded-lg border border-grey-20">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-grey-20 bg-grey-10">
                  <SortableHeader
                    label="Position"
                    sortKey="position"
                    activeKey={sortKey}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                  <th
                    scope="col"
                    className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-grey-70"
                  >
                    Change
                  </th>
                  <SortableHeader
                    label="Gene"
                    sortKey="gene"
                    activeKey={sortKey}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    label="Effect"
                    sortKey="effect"
                    activeKey={sortKey}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                  <th
                    scope="col"
                    className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-grey-70"
                  >
                    HGVS.p
                  </th>
                  <SortableHeader
                    label="Impact"
                    sortKey="impact"
                    activeKey={sortKey}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    label="Depth"
                    sortKey="depth"
                    activeKey={sortKey}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    label="Allele Freq"
                    sortKey="alleleFreq"
                    activeKey={sortKey}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                </tr>
              </thead>
              <tbody className="divide-y divide-grey-20 bg-white">
                {pageRows.map((variant, index) => {
                  const impact = normalizeImpact(variant.impact);
                  return (
                    <tr
                      key={`${variant.chrom}-${variant.pos}-${variant.alt}-${index}`}
                      className="transition-colors hover:bg-blue-10/50"
                    >
                      <td className="whitespace-nowrap px-3 py-2 font-mono text-xs font-medium text-grey-90">
                        {variant.chrom}:{variant.pos}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 font-mono text-xs text-grey-70">
                        <span className="font-semibold text-grey-90">
                          {variant.ref}
                        </span>
                        <span className="mx-0.5 text-grey-40">&gt;</span>
                        <span className="font-semibold text-blue-40">
                          {variant.alt}
                        </span>
                      </td>
                      <td className="px-3 py-2 font-semibold text-grey-90">
                        {variant.gene || (
                          <span className="font-normal text-grey-40">—</span>
                        )}
                      </td>
                      <td
                        className="max-w-[180px] truncate px-3 py-2 text-grey-70"
                        title={variant.effect || undefined}
                      >
                        {variant.effect
                          ? variant.effect.replace(/_/g, " ")
                          : "—"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 font-mono text-xs text-grey-70">
                        {variant.hgvsP || (
                          <span className="font-sans text-grey-40">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${IMPACT_STYLES[impact].badge}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${IMPACT_STYLES[impact].dot}`}
                          />
                          {IMPACT_STYLES[impact].label}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-grey-70">
                        {variant.depth ?? "—"}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs text-grey-70">
                        {formatAlleleFreq(variant.alleleFreq)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Compact Pagination Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-grey-20 bg-grey-10/50 px-4 py-2.5 text-xs text-grey-70">
            <div className="flex items-center gap-2">
              <span>
                Showing{" "}
                <strong className="text-grey-90">
                  {startIndex + 1}–{Math.min(startIndex + pageSize, totalRows)}
                </strong>{" "}
                of{" "}
                <strong className="text-grey-90">
                  {totalRows.toLocaleString()}
                </strong>
              </span>
              <span className="text-grey-40">|</span>
              <div className="flex items-center gap-1">
                <span>Per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded border border-grey-20 bg-white px-1.5 py-0.5 text-xs text-grey-80 focus:outline-none focus:ring-1 focus:ring-blue-40"
                >
                  {PAGE_SIZE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={validPage === 1}
                  className="inline-flex h-7 w-7 items-center justify-center rounded border border-grey-20 bg-white text-grey-70 hover:bg-grey-10 disabled:cursor-not-allowed disabled:opacity-40"
                  title="Previous page"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>

                <span className="px-2 font-medium text-grey-90">
                  Page {validPage} of {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={validPage === totalPages}
                  className="inline-flex h-7 w-7 items-center justify-center rounded border border-grey-20 bg-white text-grey-70 hover:bg-grey-10 disabled:cursor-not-allowed disabled:opacity-40"
                  title="Next page"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
