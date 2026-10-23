"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LabelList,
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

export default function SitePositiveCountBar({ trend, sites }: Props) {
  const rows = useMemo(
    () =>
      trend.map((point) => {
        const row: Record<string, number | string> = {
          label: monthLabel(point.month),
        };
        sites.forEach((s) => {
          row[s.id] = point.bySite[s.id]?.positiveCount ?? 0;
        });
        return row;
      }),
    [trend, sites],
  );

  if (!trend.length) {
    return (
      <div className="h-[300px] flex items-center justify-center text-grey-60 text-sm">
        No data
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={rows}
          margin={{ top: 20, right: 16, left: 0, bottom: 8 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#E6E8EB"
            vertical={false}
          />
          <XAxis dataKey="label" tick={{ fill: "#687076", fontSize: 12 }} />
          <YAxis
            tick={{ fill: "#687076", fontSize: 12 }}
            allowDecimals={false}
          />
          <Tooltip cursor={{ fill: "rgba(0,0,0,0.03)" }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {sites.map((s, index) => (
            <Bar
              key={s.id}
              dataKey={s.id}
              name={s.name}
              fill={SITE_COLORS[index % SITE_COLORS.length]}
              barSize={18}
              radius={[4, 4, 0, 0]}
            >
              <LabelList
                dataKey={s.id}
                position="top"
                formatter={(v: number) => (v ? `${v}` : "")}
                style={{ fill: "#4b5563", fontSize: 10 }}
              />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
