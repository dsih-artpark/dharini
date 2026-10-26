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
import { ProjectComparisonData } from "@/src/types/statistics";
import { colorAt } from "./colors";

interface Props {
  data: ProjectComparisonData["perProjectTrend"];
  projects: ProjectComparisonData["projects"];
}

const monthLabel = (month: string) =>
  new Date(`${month}-01T00:00:00`).toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });

export default function ProjectTrendLine({ data, projects }: Props) {
  const rows = useMemo(
    () =>
      data.map((point) => ({
        label: monthLabel(point.month),
        ...point.byProject,
      })),
    [data],
  );

  if (!data.length) {
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
          margin={{ top: 16, right: 16, left: 0, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E6E8EB" />
          <XAxis dataKey="label" tick={{ fill: "#687076", fontSize: 12 }} />
          <YAxis
            tick={{ fill: "#687076", fontSize: 12 }}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip formatter={(v: number) => `${v}%`} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {projects.map((project, index) => (
            <Line
              key={project.id}
              type="monotone"
              dataKey={project.id}
              name={project.name}
              stroke={colorAt(index)}
              strokeWidth={2}
              dot={{ r: 3 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
