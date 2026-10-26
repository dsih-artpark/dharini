"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { colorAt } from "./colors";

export interface DonutItem {
  id: string;
  label: string;
  positiveCount: number;
  totalCount: number;
  percentage: number;
}

interface Props {
  items: DonutItem[];
  centerSubLabel?: string;
}

export default function PositiveDonut({ items, centerSubLabel }: Props) {
  const totalPositive = items.reduce((a, d) => a + d.positiveCount, 0);
  const positives = items
    .filter((d) => d.positiveCount > 0)
    .map((d) => {
      // const ownRate = d.totalCount > 0 ? (d.positiveCount / d.totalCount) * 100 : 0;
      return {
        ...d,
        legend: `${d.label} — ${d.positiveCount}/${totalPositive} · ${d.percentage}% of all positives`,
      };
    });

  if (!positives.length) {
    return (
      <div className="h-[300px] flex items-center justify-center text-grey-60 text-sm">
        No positive samples
      </div>
    );
  }

  return (
    <div className="relative h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={positives}
            dataKey="positiveCount"
            nameKey="legend"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={2}
          >
            {positives.map((entry, index) => (
              <Cell key={entry.id} fill={colorAt(index)} />
            ))}
          </Pie>
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none -mt-6">
        <span className="text-grey-90 text-2xl font-bold leading-none">
          {totalPositive.toLocaleString()}
        </span>
        <span className="text-grey-60 text-xs mt-1 text-center px-6">
          {centerSubLabel ?? "Total Positive"}
        </span>
      </div>
    </div>
  );
}
