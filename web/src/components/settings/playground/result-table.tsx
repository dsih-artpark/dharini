"use client";

import { useState } from "react";
import type { ProjectDetailsRecord } from "@/src/app/(dashboard)/settings/loader";

const PREVIEW_ROW_LIMIT = 100;

type ResultTableProps = {
  records: ProjectDetailsRecord[] | null;
  onDownloadCsv: () => Promise<void>;
};

function formatCell(value: string | number | boolean | null): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

export default function ResultTable({
  records,
  onDownloadCsv,
}: ResultTableProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!records) return null;

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await onDownloadCsv();
    } finally {
      setIsDownloading(false);
    }
  };

  if (!records.length) {
    return (
      <div className="w-full bg-grey-5/20 border border-dashed border-grey-20 rounded-xl p-8 text-center text-grey-50 text-sm">
        No records found for the selected project(s).
      </div>
    );
  }

  const columns = Object.keys(records[0]);
  const rows = records.slice(0, PREVIEW_ROW_LIMIT);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-grey-70 text-sm">
          {records.length > PREVIEW_ROW_LIMIT
            ? `Showing ${PREVIEW_ROW_LIMIT} of ${records.length} rows`
            : `${records.length} row${records.length === 1 ? "" : "s"}`}
        </span>
        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          className="text-blue-50 hover:text-blue-60 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading ? "Downloading..." : "Download full CSV"}
        </button>
      </div>
      <div className="w-full overflow-x-auto border border-grey-20 rounded-lg max-h-[500px] overflow-y-auto">
        <table className="min-w-full text-xs text-left border-collapse">
          <thead className="bg-grey-5 sticky top-0">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-3 py-2 font-semibold text-grey-70 whitespace-nowrap border-b border-grey-20"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="odd:bg-white even:bg-grey-5/30">
                {columns.map((col) => (
                  <td
                    key={col}
                    className="px-3 py-2 text-grey-80 whitespace-nowrap border-b border-grey-10"
                  >
                    {formatCell(row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
