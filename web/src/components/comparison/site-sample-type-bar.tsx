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
  matrix: SiteComparisonData["sampleTypeMatrix"];
  sites: SiteComparisonData["sites"];
}

export default function SiteSampleTypeBar({ matrix, sites }: Props) {
  const rows = useMemo(
    () =>
      matrix.map((m) => {
        const row: Record<string, number | string | null> = { name: m.name };
        sites.forEach((s) => {
          row[s.id] = m.bySite[s.id] ?? 0;
        });
        return row;
      }),
    [matrix, sites],
  );

  if (!matrix.length) {
    return (
      <div className="h-[300px] flex items-center justify-center text-grey-60 text-sm">
        No sample-type data
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
          <XAxis
            dataKey="name"
            tick={{ fill: "#687076", fontSize: 11 }}
            interval={0}
            angle={-15}
            textAnchor="end"
            height={56}
          />
          <YAxis
            tick={{ fill: "#687076", fontSize: 12 }}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.03)" }}
            formatter={(v: number) => `${v}%`}
          />
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
                formatter={(v: number) => (v ? `${v}%` : "")}
                style={{ fill: "#4b5563", fontSize: 10 }}
              />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
