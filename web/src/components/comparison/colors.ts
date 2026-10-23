// Shared categorical palette for the comparison dashboard charts/table.
export const COMPARISON_COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
  "#84cc16", // lime
  "#6366f1", // indigo
  "#14b8a6", // teal
];

export const colorAt = (i: number) =>
  COMPARISON_COLORS[i % COMPARISON_COLORS.length];

// Fixed identity colors for head-to-head comparisons (sites or sample types):
// entity 1 = blue, entity 2 = green (consistent across all charts + tables).
export const SITE_COLORS = ["#2563eb", "#10b981"];
export const PAIR_COLORS = SITE_COLORS;
