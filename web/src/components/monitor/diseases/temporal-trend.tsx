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

interface TemporalTrendProps {
  data: MonitorDashboardTrendPoint[];
}

export default function TemporalTrend({ data }: TemporalTrendProps) {
  const trendData = useMemo(() => {
    return (data || []).map((point) => ({
      ...point,
      label: new Date(point.period).toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      }),
    }));
  }, [data]);

  if (!data.length) {
    return (
      <div className="h-[340px] flex items-center justify-center text-grey-60 text-sm">
        No trend data available
      </div>
    );
  }

  return (
    <div className="self-stretch w-full">
      <div className="self-stretch h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E6E8EB" />
            <XAxis dataKey="label" tick={{ fill: "#687076" }} />
            <YAxis tick={{ fill: "#687076" }} />
            <Tooltip />
            <Legend />
            {[
              <Line
                key="totalSamples"
                type="monotone"
                dataKey="totalSamples"
                stroke="#228be6"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Total Samples"
              />,
              <Line
                key="positiveSamples"
                type="monotone"
                dataKey="positiveSamples"
                stroke="#E03131"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Positive Samples"
              />,
              <Line
                key="negativeSamples"
                type="monotone"
                dataKey="negativeSamples"
                stroke="#2F9E44"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Negative Samples"
              />,
            ]}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
