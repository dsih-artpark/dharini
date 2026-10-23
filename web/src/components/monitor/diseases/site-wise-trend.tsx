"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { MonitorDashboardTrendPoint } from "@/src/types/statistics";

const COLORS = [
  "#6ea8d9",
  "#e07878",
  "#6fbf82",
  "#e8a95f",
  "#9b8cd4",
  "#5bb8a5",
  "#d9856a",
  "#7a9fe0",
  "#c28dd4",
  "#d47a93",
  "#62bcc5",
  "#8fad50",
  "#a87ec0",
  "#d48a8a",
  "#8f7abf",
];

interface SiteLineTrendProps {
  data: MonitorDashboardTrendPoint[];
  topN?: number;
}

export default function SiteLineTrend({ data, topN = 5 }: SiteLineTrendProps) {
  const { chartData, allSites, siteTotals } = useMemo(() => {
    const siteTotals: Record<string, number> = {};
    const groupedByPeriod: Record<string, Record<string, string | number>> = {};

    data.forEach((point) => {
      if (point.siteName) {
        siteTotals[point.siteName] =
          (siteTotals[point.siteName] || 0) + point.totalSamples;
      }
    });

    const sorted = Object.entries(siteTotals)
      .sort(([, a], [, b]) => b - a)
      .map(([site]) => site);

    data.forEach((point) => {
      const periodKey = point.period;
      if (!groupedByPeriod[periodKey]) {
        groupedByPeriod[periodKey] = {
          period: periodKey,
          label: new Date(periodKey).toLocaleString("en-US", {
            month: "short",
            year: "numeric",
          }),
        };
      }
      if (point.siteName) {
        groupedByPeriod[periodKey][point.siteName] = point.totalSamples;
      }
    });

    return {
      chartData: Object.values(groupedByPeriod).sort(
        (a, b) => new Date(a.period).getTime() - new Date(b.period).getTime(),
      ),
      allSites: sorted,
      siteTotals,
    };
  }, [data]);
  console.log(siteTotals);

  // const [selectedSites, setSelectedSites] = useState<Set<string>>(new Set());

  // Initialize with top N on first render
  // const activeSites = useMemo(() => {
  //   if (selectedSites.size === 0) {
  //     return new Set(allSites.slice(0, topN));
  //   }
  //   return selectedSites;
  // }, [selectedSites, allSites, topN]);
  const activeSites = new Set(allSites.slice(0, topN));

  // const toggleSite = (site: string) => {
  //   setSelectedSites((prev) => {
  //     const next = new Set(prev.size === 0 ? allSites.slice(0, topN) : prev);
  //     if (next.has(site)) {
  //       next.delete(site);
  //     } else {
  //       next.add(site);
  //     }
  //     return next;
  //   });
  // };

  // const selectAll = () => setSelectedSites(new Set(allSites));
  // const selectNone = () => setSelectedSites(new Set(["__none__"])); // empty but non-zero size
  // const selectTop = (n: number) => setSelectedSites(new Set(allSites.slice(0, n)));

  if (!data.length) {
    return (
      <div className="h-[340px] flex items-center justify-center text-grey-60 text-sm">
        No site data available
      </div>
    );
  }

  return (
    <div className="self-stretch w-full flex-col justify-start items-start gap-4 inline-flex">
      <div className="self-stretch h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E6E8EB" />
            <XAxis dataKey="label" tick={{ fill: "#687076" }} />
            <YAxis tick={{ fill: "#687076" }} />
            <Tooltip />
            <Legend />
            {allSites
              .filter((site) => activeSites.has(site))
              .map((site) => (
                <Line
                  key={site}
                  type="monotone"
                  dataKey={site}
                  stroke={COLORS[allSites.indexOf(site) % COLORS.length]}
                  strokeWidth={1.5}
                  dot={{ r: 2 }}
                  name={site}
                  connectNulls
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
