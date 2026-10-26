/** Brand accent (blue-40), used where Tailwind classes can't reach: Leaflet
 *  layers and inline gradients. */
export const ACCENT = "#3a11b6";

export function formatDay(date: Date, withYear = true): string {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    ...(withYear && { year: "numeric" }),
  });
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/** The model week a date falls in (1-52, week 1 starting 1 January). Week 52
 *  runs to 31 December, so it is 8 days long (9 in a leap year). */
export function modelWeekOf(date: Date): number {
  const dayOfYear = Math.round(
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
      Date.UTC(date.getFullYear(), 0, 1)) /
      86_400_000,
  );
  return Math.min(52, Math.floor(dayOfYear / 7) + 1);
}

/** A chance as a whole percent without the sign, e.g. "35" or "<1". */
export function percentNumber(prob: number): string {
  const percent = prob * 100;
  return percent > 0 && percent < 1 ? "<1" : String(Math.round(percent));
}

export function formatPercent(prob: number): string {
  return `${percentNumber(prob)}%`;
}
