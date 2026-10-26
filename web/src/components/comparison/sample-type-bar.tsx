"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
} from "recharts";
import { ProjectComparisonData } from "@/src/types/statistics";
import { colorAt } from "./colors";

type SampleTypeAverage = ProjectComparisonData["sampleTypeAverages"][number];

interface Props {
  data: SampleTypeAverage[];
  totalSamples: number;
}

function BarTooltip({
  active,
  payload,
  totalSamples,
}: {
  active?: boolean;
  payload?: { payload: SampleTypeAverage }[];
  totalSamples: number;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const share = totalSamples > 0 ? (d.totalCount / totalSamples) * 100 : 0;
  return (
    <div className="bg-white border border-grey-20 rounded-lg shadow-sm px-3 py-2 text-xs text-grey-80 space-y-1">
      <div className="font-semibold text-grey-90">{d.name}</div>
      <div>Positive: {d.positiveCount.toLocaleString()}</div>
      <div>Total: {d.totalCount.toLocaleString()}</div>
      <div>Share of all samples: {share.toFixed(1)}%</div>
      <div>Positivity rate: {d.avgPositivity}%</div>
    </div>
  );
}

export default function SampleTypeBar({ data, totalSamples }: Props) {
  const [minSharePct, setMinSharePct] = useState(5);

  // Sort highest positivity first so the most relevant bars are on top,
  // then drop sample types below the minimum share-of-total-samples threshold.
  const sorted = [...data]
    .sort((a, b) => b.avgPositivity - a.avgPositivity)
    .filter((d) =>
      totalSamples > 0
        ? (d.totalCount / totalSamples) * 100 >= minSharePct
        : true,
    );

  // Grow vertically with the number of categories so labels never overlap.
  const height = Math.max(260, sorted.length * 34);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-sm text-grey-70">
        <label htmlFor="min-share-pct">Min. share of total samples</label>
        <input
          id="min-share-pct"
          type="number"
          min={0}
          max={100}
          step={0.5}
          value={minSharePct}
          onChange={(e) => setMinSharePct(Number(e.target.value) || 0)}
          className="w-20 h-8 px-2 rounded-md border border-grey-40 text-grey-80 text-sm"
        />
        <span>%</span>
      </div>

      {!sorted.length ? (
        <div className="h-[280px] flex items-center justify-center text-grey-60 text-sm">
          No sample-type data
        </div>
      ) : (
        <div style={{ height }} className="w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sorted}
              layout="vertical"
              margin={{ top: 8, right: 56, left: 8, bottom: 8 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E6E8EB"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fill: "#687076", fontSize: 12 }}
                tickFormatter={(v) => `${v}%`}
                domain={[0, "dataMax"]}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={190}
                interval={0}
                tick={{ fill: "#687076", fontSize: 12 }}
                tickFormatter={(name: string) => {
                  const entry = sorted.find((s) => s.name === name);
                  return entry
                    ? `${name} (n=${entry.totalCount.toLocaleString()})`
                    : name;
                }}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                content={<BarTooltip totalSamples={totalSamples} />}
              />
              <Bar dataKey="avgPositivity" barSize={16} radius={[0, 4, 4, 0]}>
                <LabelList
                  dataKey="avgPositivity"
                  position="right"
                  formatter={(v: number) => `${v}%`}
                  style={{ fill: "#374151", fontSize: 11 }}
                />
                {sorted.map((entry, index) => (
                  <Cell key={entry.sampleTypeId} fill={colorAt(index)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
