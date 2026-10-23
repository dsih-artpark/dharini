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
import { SampleTypeComparisonData } from "@/src/types/statistics";
import { PAIR_COLORS } from "./colors";

interface Props {
  byProject: SampleTypeComparisonData["byProject"];
  sampleTypes: SampleTypeComparisonData["sampleTypes"];
}

export default function SampleTypeProjectBar({
  byProject,
  sampleTypes,
}: Props) {
  const rows = useMemo(
    () =>
      byProject.map((p) => {
        const row: Record<string, number | string> = { name: p.projectName };
        sampleTypes.forEach((t) => {
          row[t.id] = p.byType[t.id] ?? 0;
        });
        return row;
      }),
    [byProject, sampleTypes],
  );

  if (!byProject.length) {
    return (
      <div className="h-[300px] flex items-center justify-center text-grey-60 text-sm">
        No project data
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
          {sampleTypes.map((t, index) => (
            <Bar
              key={t.id}
              dataKey={t.id}
              name={t.name}
              fill={PAIR_COLORS[index % PAIR_COLORS.length]}
              barSize={18}
              radius={[4, 4, 0, 0]}
            >
              <LabelList
                dataKey={t.id}
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
