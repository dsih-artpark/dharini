// Viridis, light (low) to dark (high)
const RAMP = ["#fde725", "#7ad151", "#22a884", "#2a788e", "#414487"] as const;

/** Colour bins for the forecast grid: how many species clear the minimum
 *  chance in a cell, highest first. Shared by the map layer and the legend,
 *  which labels the two ends. */
export const GRID_BINS = [
  { min: 6, label: "6+", color: RAMP[4] },
  { min: 5, label: "5", color: RAMP[3] },
  { min: 3, label: "3–4", color: RAMP[2] },
  { min: 2, label: "2", color: RAMP[1] },
  { min: 1, label: "1", color: RAMP[0] },
] as const;

/** The same ramp for one picked species: its chance in a cell, percent
 *  (below 10% shares the lowest colour). */
export const CHANCE_BINS = [
  { min: 90, label: "90%+", color: RAMP[4] },
  { min: 70, label: "70%", color: RAMP[3] },
  { min: 50, label: "50%", color: RAMP[2] },
  { min: 30, label: "30%", color: RAMP[1] },
  { min: 1, label: "10%", color: RAMP[0] },
] as const;

export function gridColor(
  value: number,
  bins: readonly { min: number; color: string }[] = GRID_BINS,
): string {
  for (const bin of bins) if (value >= bin.min) return bin.color;
  return "transparent";
}

/** One cell of the forecast grid at the selected week and threshold. */
export interface ForecastGridCell {
  lat: number;
  lon: number;
  /** Species with at least the minimum chance here, 1 or more; with a
   *  species picked, that species' chance here (percent). */
  count: number;
  /** This cell's size, km, when it differs from the layer's. */
  spacingKm?: number;
  /** All-species view: the species at or above the minimum chance here,
   *  most likely first, chance in percent. Built when asked for (on hover):
   *  every cell's list at once would be a lot to build. */
  species?: () => { name: string; chance: number }[];
}

/** One site's area of the grid, for when its cells are too small to see. */
export interface ForecastGridArea {
  lat: number;
  lng: number;
  /** The highest `count` of any of its cells. */
  maxCount: number;
}

export interface ForecastGridLayerData {
  cells: ForecastGridCell[];
  /** Cell size, km: draw squares this size, no finer. */
  spacingKm: number;
  areas: ForecastGridArea[];
  /** The picked species, when the grid shows only it. */
  species: { key: string; name: string } | null;
  /** The species group the counts are of (a tab), or null for every group. */
  guild: string | null;
  /** The minimum chance the cells clear, percent. */
  minChance: number;
}
