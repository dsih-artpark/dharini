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
  data: ProjectComparisonData["perProjectDiseaseTrend"];
  perDiseaseTrend: ProjectComparisonData["perDiseaseTrend"];
  projects: ProjectComparisonData["projects"];
  diseases: ProjectComparisonData["diseasesInScope"];
}

const monthLabel = (month: string) =>
  new Date(`${month}-01T00:00:00`).toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });

export default function DiseaseProjectTrendLine({
  data,
  perDiseaseTrend,
  projects,
  diseases,
}: Props) {
  const rows = useMemo(() => {
    const byMonth = new Map<string, Record<string, number | string>>();

    for (const point of data) {
      const row = byMonth.get(point.month) ?? {
        label: monthLabel(point.month),
      };
      Object.assign(row, point.byProjectDisease);
      byMonth.set(point.month, row);
    }
    for (const point of perDiseaseTrend) {
      const row = byMonth.get(point.month) ?? {
        label: monthLabel(point.month),
      };
      for (const [diseaseId, rate] of Object.entries(point.byDisease)) {
        row[`aggDisease:${diseaseId}`] = rate;
      }
      byMonth.set(point.month, row);
    }

    return [...byMonth.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, row]) => row);
  }, [data, perDiseaseTrend]);

  if (!rows.length) {
    return (
      <div className="h-[300px] flex items-center justify-center text-grey-60 text-sm">
        No trend data
      </div>
    );
  }

  const multiProject = projects.length > 1;

  return (
    <div className="h-[340px]">
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
          {multiProject &&
            projects.flatMap((project) =>
              diseases.map((disease, dIndex) => (
                <Line
                  key={`${project.id}:${disease.id}`}
                  type="monotone"
                  dataKey={`${project.id}:${disease.id}`}
                  name={`${project.name} — ${disease.shortName || disease.name}`}
                  stroke={colorAt(dIndex)}
                  strokeOpacity={0.5}
                  strokeWidth={1.5}
                  dot={false}
                  connectNulls
                />
              )),
            )}
          {diseases.map((disease, dIndex) => (
            <Line
              key={`aggDisease:${disease.id}`}
              type="monotone"
              dataKey={`aggDisease:${disease.id}`}
              name={
                multiProject
                  ? `${disease.shortName || disease.name} (Overall)`
                  : disease.shortName || disease.name
              }
              stroke={colorAt(dIndex)}
              strokeWidth={3}
              dot={{ r: 3 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
