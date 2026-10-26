"use client";

import { useMemo, useState } from "react";
import { MonitorDashboardTrendPoint } from "@/src/types/statistics";

interface HeatmapTrendProps {
  data: MonitorDashboardTrendPoint[];
}

type SortMode = "samples-desc" | "samples-asc" | "alpha";

function getColorForValue(value: number, maxValue: number): string {
  if (value === 0 || maxValue === 0) return "#f8f9fa";
  const ratio = value / maxValue;
  if (ratio < 0.1) return "#dbeafe";
  if (ratio < 0.2) return "#bfdbfe";
  if (ratio < 0.35) return "#93c5fd";
  if (ratio < 0.5) return "#60a5fa";
  if (ratio < 0.65) return "#3b82f6";
  if (ratio < 0.8) return "#2563eb";
  return "#1d4ed8";
}

export default function HeatmapTrend({ data }: HeatmapTrendProps) {
  const [sortMode, setSortMode] = useState<SortMode>("samples-desc");
  const [hoveredCell, setHoveredCell] = useState<{
    site: string;
    period: string;
    value: number;
    x: number;
    y: number;
  } | null>(null);

  const { grid, sites, periods, maxValue, siteTotals } = useMemo(() => {
    const siteTotals: Record<string, number> = {};
    const periodSet = new Set<string>();

    data.forEach((point) => {
      if (point.siteName) {
        siteTotals[point.siteName] =
          (siteTotals[point.siteName] || 0) + point.totalSamples;
        periodSet.add(point.period);
      }
    });

    const allSites = Object.keys(siteTotals);

    // Sort sites based on mode
    let sortedSites: string[];
    switch (sortMode) {
      case "samples-desc":
        sortedSites = allSites.sort((a, b) => siteTotals[b] - siteTotals[a]);
        break;
      case "samples-asc":
        sortedSites = allSites.sort((a, b) => siteTotals[a] - siteTotals[b]);
        break;
      case "alpha":
        sortedSites = allSites.sort((a, b) => a.localeCompare(b));
        break;
      default:
        sortedSites = allSites;
    }

    const sortedPeriods = Array.from(periodSet).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    );

    const periodLabels = sortedPeriods.map((p) =>
      new Date(p).toLocaleString("en-US", { month: "short", year: "2-digit" }),
    );

    const grid: Record<string, Record<string, number>> = {};
    let maxVal = 0;

    sortedSites.forEach((site) => {
      grid[site] = {};
      sortedPeriods.forEach((period) => {
        grid[site][period] = 0;
      });
    });

    data.forEach((point) => {
      if (point.siteName && grid[point.siteName]) {
        grid[point.siteName][point.period] = point.totalSamples;
        if (point.totalSamples > maxVal) maxVal = point.totalSamples;
      }
    });

    return {
      grid,
      sites: sortedSites,
      periods: sortedPeriods.map((p, i) => ({
        key: p,
        label: periodLabels[i],
      })),
      maxValue: maxVal,
      siteTotals,
    };
  }, [data, sortMode]);

  if (!data.length || !sites.length) {
    return (
      <div className="h-[340px] flex items-center justify-center text-grey-60 text-sm">
        No site data available
      </div>
    );
  }

  const cellSize = 44;
  const labelWidth = 200;
  const totalWidth = 56;
  const maxHeight = 520;

  return (
    <div className="self-stretch w-full flex-col justify-start items-start gap-4 inline-flex">
      <div className="flex items-center gap-2">
        <span className="text-xs text-grey-60">Sort:</span>
        <select
          value={sortMode}
          onChange={(e) => setSortMode(e.target.value as SortMode)}
          className="text-xs border border-grey-20 rounded px-2 py-1 bg-white text-grey-80 focus:outline-none focus:ring-1 focus:ring-blue-400"
        >
          <option value="samples-desc">Most Samples</option>
          <option value="samples-asc">Least Samples</option>
          <option value="alpha">Alphabetical</option>
        </select>
        <span className="text-xs text-grey-50 ml-1">{sites.length} sites</span>
      </div>
      <div
        className="self-stretch overflow-auto relative"
        style={{ maxHeight }}
      >
        {/* Tooltip */}
        {hoveredCell && (
          <div
            className="absolute z-50 bg-grey-90 text-white px-3 py-2 rounded-lg text-xs shadow-lg pointer-events-none"
            style={{ left: hoveredCell.x + 10, top: hoveredCell.y - 40 }}
          >
            <div className="font-semibold">{hoveredCell.site}</div>
            <div>
              {new Date(hoveredCell.period).toLocaleString("en-US", {
                month: "long",
                year: "numeric",
              })}
              : <span className="font-bold">{hoveredCell.value}</span> samples
            </div>
          </div>
        )}

        <table
          className="border-collapse"
          style={{
            minWidth: labelWidth + totalWidth + periods.length * cellSize,
          }}
        >
          <thead className="sticky top-0 z-20 bg-white">
            <tr>
              <th
                className="text-left text-xs font-medium text-grey-60 px-2 py-2 sticky left-0 bg-white z-30 border-b border-grey-10"
                style={{ width: labelWidth, minWidth: labelWidth }}
              >
                Site
              </th>
              {periods.map((p) => (
                <th
                  key={p.key}
                  className="text-center text-xs font-medium text-grey-60 px-1 py-2 border-b border-grey-10"
                  style={{ width: cellSize, minWidth: cellSize }}
                >
                  {p.label}
                </th>
              ))}
              <th
                className="text-center text-xs font-semibold text-grey-70 px-1 py-2 border-b border-grey-10 border-l border-grey-20"
                style={{ width: totalWidth, minWidth: totalWidth }}
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {sites.map((site) => (
              <tr key={site} className="hover:bg-blue-50/30 transition-colors">
                <td
                  className="text-xs text-grey-80 px-2 py-0.5 truncate sticky left-0 bg-white z-10 border-r border-grey-10"
                  style={{ maxWidth: labelWidth }}
                  title={site}
                >
                  {site}
                </td>
                {periods.map((p) => {
                  const value = grid[site]?.[p.key] || 0;
                  return (
                    <td
                      key={p.key}
                      className="px-0.5 py-0.5"
                      onMouseEnter={(e) => {
                        const rect = (
                          e.target as HTMLElement
                        ).getBoundingClientRect();
                        const parent = (e.target as HTMLElement)
                          .closest(".overflow-auto")
                          ?.getBoundingClientRect();
                        setHoveredCell({
                          site,
                          period: p.key,
                          value,
                          x: rect.left - (parent?.left || 0) + rect.width / 2,
                          y: rect.top - (parent?.top || 0),
                        });
                      }}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <div
                        className="rounded-sm flex items-center justify-center text-[10px] font-medium transition-all cursor-default"
                        style={{
                          width: cellSize - 4,
                          height: 28,
                          backgroundColor: getColorForValue(value, maxValue),
                          color: value / maxValue > 0.5 ? "white" : "#374151",
                        }}
                      >
                        {value > 0 ? value : ""}
                      </div>
                    </td>
                  );
                })}
                <td className="px-1 py-0.5 border-l border-grey-20">
                  <div
                    className="text-center text-[11px] font-semibold text-grey-80"
                    style={{ width: totalWidth - 8 }}
                  >
                    {siteTotals[site]}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-grey-10 sticky bottom-0 bg-white z-10">
          <span className="text-xs text-grey-60">Less</span>
          {[0, 0.1, 0.2, 0.35, 0.5, 0.65, 0.8, 1].map((ratio, i) => (
            <div
              key={i}
              className="rounded-sm"
              style={{
                width: 16,
                height: 16,
                backgroundColor: getColorForValue(ratio * maxValue, maxValue),
              }}
            />
          ))}
          <span className="text-xs text-grey-60">More</span>
          <span className="text-xs text-grey-50 ml-2">(max: {maxValue})</span>
        </div>
      </div>
    </div>
  );
}
