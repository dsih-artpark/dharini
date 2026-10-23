"use client";

import { useMemo, useState } from "react";
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
import { SampleTypeTrendPoint } from "@/src/types/statistics";

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

const SOFT_COLORS = [
  "#dbeafe",
  "#fecaca",
  "#d1fae5",
  "#fed7aa",
  "#e0e7ff",
  "#ccfbf1",
  "#ffedd5",
  "#dbeafe",
  "#f3e8ff",
  "#fce7f3",
  "#cffafe",
  "#ecfccb",
  "#f3e8ff",
  "#fecaca",
  "#ede9fe",
];

const SOFT_TEXT = [
  "#1e40af",
  "#991b1b",
  "#166534",
  "#9a3412",
  "#4338ca",
  "#065f46",
  "#c2410c",
  "#1d4ed8",
  "#7e22ce",
  "#9d174d",
  "#155e75",
  "#3f6212",
  "#6b21a8",
  "#991b1b",
  "#5b21b6",
];

interface SampleTypeTrendProps {
  data: SampleTypeTrendPoint[];
}

export default function SampleTypeTrend({ data }: SampleTypeTrendProps) {
  const { chartData, allTypes, typeTotals } = useMemo(() => {
    const typeTotals: Record<string, number> = {};
    const groupedByPeriod: Record<string, Record<string, string | number>> = {};

    data.forEach((point) => {
      if (point.sampleTypeName) {
        typeTotals[point.sampleTypeName] =
          (typeTotals[point.sampleTypeName] || 0) + point.totalSamples;
      }
    });

    const sorted = Object.entries(typeTotals)
      .sort(([, a], [, b]) => b - a)
      .map(([name]) => name);

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
      if (point.sampleTypeName) {
        groupedByPeriod[periodKey][point.sampleTypeName] = point.totalSamples;
      }
    });

    return {
      chartData: Object.values(groupedByPeriod).sort(
        (a, b) => new Date(a.period).getTime() - new Date(b.period).getTime(),
      ),
      allTypes: sorted,
      typeTotals,
    };
  }, [data]);

  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());

  const activeTypes = useMemo(() => {
    if (selectedTypes.size === 0) {
      return new Set(allTypes);
    }
    return selectedTypes;
  }, [selectedTypes, allTypes]);

  const toggleType = (name: string) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev.size === 0 ? allTypes : prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const selectAll = () => setSelectedTypes(new Set());
  const selectNone = () => setSelectedTypes(new Set(["__none__"]));

  if (!data.length) {
    return (
      <div className="h-[340px] flex items-center justify-center text-grey-60 text-sm">
        No sample type data available
      </div>
    );
  }

  return (
    <div className="self-stretch w-full flex-col justify-start items-start gap-4 inline-flex">
      <div className="flex items-center gap-1.5">
        <button
          onClick={selectAll}
          className="text-xs px-2 py-1 rounded border border-grey-20 bg-white text-grey-70 hover:bg-grey-5 transition-colors"
        >
          All
        </button>
        <button
          onClick={selectNone}
          className="text-xs px-2 py-1 rounded border border-grey-20 bg-white text-grey-70 hover:bg-grey-5 transition-colors"
        >
          None
        </button>
      </div>

      {/* Type chips */}
      <div className="flex flex-wrap gap-1.5 max-h-[80px] overflow-y-auto w-full">
        {allTypes.map((name, index) => {
          const isActive = activeTypes.has(name);
          const bg = SOFT_COLORS[index % SOFT_COLORS.length];
          const text = SOFT_TEXT[index % SOFT_TEXT.length];
          return (
            <button
              key={name}
              onClick={() => toggleType(name)}
              className="text-[11px] px-2 py-0.5 rounded-full border transition-all cursor-pointer"
              style={{
                backgroundColor: isActive ? bg : "white",
                borderColor: isActive ? text + "33" : "#e0e0e0",
                color: isActive ? text : "#999",
              }}
              title={`${name} (${typeTotals[name]} total)`}
            >
              {name}
            </button>
          );
        })}
      </div>

      <div className="self-stretch h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E6E8EB" />
            <XAxis dataKey="label" tick={{ fill: "#687076" }} />
            <YAxis tick={{ fill: "#687076" }} />
            <Tooltip />
            <Legend
              content={({ payload }) => (
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
                  {payload?.map((entry) => {
                    const idx = allTypes.indexOf(entry.value);
                    const dotColor =
                      SOFT_TEXT[idx >= 0 ? idx % SOFT_TEXT.length : 0];
                    return (
                      <span
                        key={entry.value}
                        className="flex items-center gap-1 text-xs text-grey-70"
                      >
                        <span
                          className="inline-block w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: dotColor + "66" }}
                        />
                        {entry.value}
                      </span>
                    );
                  })}
                </div>
              )}
            />
            {allTypes
              .filter((name) => activeTypes.has(name))
              .map((name) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stroke={COLORS[allTypes.indexOf(name) % COLORS.length]}
                  strokeWidth={1.5}
                  dot={{ r: 2 }}
                  name={name}
                  connectNulls
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
