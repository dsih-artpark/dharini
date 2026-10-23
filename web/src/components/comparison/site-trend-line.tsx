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
import { SiteComparisonData } from "@/src/types/statistics";
import { SITE_COLORS } from "./colors";

interface Props {
  trend: SiteComparisonData["trend"];
  sites: SiteComparisonData["sites"];
}

const monthLabel = (month: string) =>
  new Date(`${month}-01T00:00:00`).toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });

export default function SiteTrendLine({ trend, sites }: Props) {
  const rows = useMemo(
    () =>
      trend.map((point) => {
        const row: Record<string, number | string> = {
          label: monthLabel(point.month),
        };
        sites.forEach((s) => {
          row[s.id] = point.bySite[s.id]?.rate ?? 0;
        });
        return row;
      }),
    [trend, sites],
  );

  if (!trend.length) {
    return (
      <div className="h-[300px] flex items-center justify-center text-grey-60 text-sm">
        No trend data
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={rows}
          margin={{ top: 16, right: 24, left: 0, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E6E8EB" />
          <XAxis dataKey="label" tick={{ fill: "#687076", fontSize: 12 }} />
          <YAxis
            tick={{ fill: "#687076", fontSize: 12 }}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip formatter={(v: number) => `${v}%`} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {sites.map((s, index) => (
            <Line
              key={s.id}
              type="monotone"
              dataKey={s.id}
              name={s.name}
              stroke={SITE_COLORS[index % SITE_COLORS.length]}
              strokeWidth={2.5}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
