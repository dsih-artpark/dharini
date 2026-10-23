"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

export type SortDir = "asc" | "desc";
type Accessor<T> = (row: T) => number | string | null | undefined;

/**
 * Column-wise sorting for the small comparison tables. Keeps the bespoke row
 * markup untouched — it only reorders the row array. Nulls/"—" always sink to
 * the bottom; ties preserve the original order (stable).
 */
export function useSortableRows<T>(
  rows: T[],
  accessors: Record<string, Accessor<T>>,
) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const toggle = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  let sortedRows = rows;
  const acc = sortKey ? accessors[sortKey] : undefined;
  if (acc) {
    sortedRows = rows
      .map((r, i) => ({ r, i }))
      .sort((a, b) => {
        const av = acc(a.r);
        const bv = acc(b.r);
        const an = av === null || av === undefined;
        const bn = bv === null || bv === undefined;
        if (an && bn) return a.i - b.i;
        if (an) return 1; // nulls last, regardless of direction
        if (bn) return -1;
        let cmp: number;
        if (typeof av === "number" && typeof bv === "number") cmp = av - bv;
        else cmp = String(av).localeCompare(String(bv));
        if (cmp === 0) return a.i - b.i; // stable tie-break
        return sortDir === "asc" ? cmp : -cmp;
      })
      .map((x) => x.r);
  }

  return { sortedRows, sortKey, sortDir, toggle };
}

export function SortHeader({
  label,
  columnKey,
  sortKey,
  sortDir,
  onSort,
  align = "left",
}: {
  label: React.ReactNode;
  columnKey: string;
  sortKey: string | null;
  sortDir: SortDir;
  onSort: (key: string) => void;
  align?: "left" | "right";
}) {
  const active = sortKey === columnKey;
  return (
    <button
      type="button"
      onClick={() => onSort(columnKey)}
      className={`flex w-full items-center gap-1 select-none hover:text-grey-90 transition-colors ${
        align === "right" ? "justify-end" : "justify-start"
      }`}
    >
      <span>{label}</span>
      {active ? (
        sortDir === "asc" ? (
          <ChevronUp className="w-3.5 h-3.5 text-blue-40 shrink-0" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-blue-40 shrink-0" />
        )
      ) : (
        <ChevronsUpDown className="w-3.5 h-3.5 text-grey-40 shrink-0" />
      )}
    </button>
  );
}
