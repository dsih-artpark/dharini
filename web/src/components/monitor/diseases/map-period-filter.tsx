"use client";
import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";

// year === null -> overall; month === null -> whole year
export type PeriodSelection = { year: number | null; month: number | null };

// Without a main Start/End range, only the latest few years get a tab; the
// API itself accepts any year
const YEAR_TAB_COUNT = 3;
const CURRENT_YEAR = new Date().getFullYear();
const DEFAULT_YEARS = Array.from(
  { length: YEAR_TAB_COUNT },
  (_, i) => CURRENT_YEAR - YEAR_TAB_COUNT + 1 + i,
);

// Earlier years are taken as unfinished input: the date input reports
// partial years (0002, 0020, 0202, ...) while a year is being typed
const MIN_RANGE_YEAR = 2000;

export type DateRange = { startDate: string; endDate: string };

// The main Start/End dates as a usable range, or null when either is
// missing, malformed, implausible or reversed. Years are read from the text,
// not via `new Date()`, which parses "2025-01-01" as UTC and so gives 2024
// west of UTC.
export const parseDateRange = (
  startDate?: string,
  endDate?: string,
): DateRange | null => {
  const isDate = (d?: string): d is string =>
    !!d && /^\d{4}-\d{2}-\d{2}$/.test(d);
  if (!isDate(startDate) || !isDate(endDate)) return null;
  if (Number(startDate.slice(0, 4)) < MIN_RANGE_YEAR) return null;
  if (startDate > endDate) return null;
  return { startDate, endDate };
};

// Year tabs for the map: every year the range touches (partial years
// included), or the default latest years when there's no usable range.
// Capped to the range's latest YEAR_TAB_COUNT years: more tabs don't fit the
// bar on a 320px phone (4 overflow there, 5 on most phones).
export const getMapYearOptions = (range: DateRange | null): number[] => {
  if (!range) return DEFAULT_YEARS;
  const firstYear = Number(range.startDate.slice(0, 4));
  const lastYear = Number(range.endDate.slice(0, 4));
  const from = Math.max(firstYear, lastYear - YEAR_TAB_COUNT + 1);
  return Array.from({ length: lastYear - from + 1 }, (_, i) => from + i);
};

// First and last month (1-12) the map offers for a year
export type MonthBounds = { first: number; last: number };
const ALL_MONTHS: MonthBounds = { first: 1, last: 12 };

// Months of `year` inside the main range, e.g. Nov 2024 - Feb 2026 offers
// Nov-Dec for 2024, all of 2025 and Jan-Feb for 2026. Every month when
// there's no usable range or no year.
export const getMapMonthBounds = (
  range: DateRange | null,
  year: number | null,
): MonthBounds => {
  if (!range || year === null) return ALL_MONTHS;
  return {
    first:
      year === Number(range.startDate.slice(0, 4))
        ? Number(range.startDate.slice(5, 7))
        : 1,
    last:
      year === Number(range.endDate.slice(0, 4))
        ? Number(range.endDate.slice(5, 7))
        : 12,
  };
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Wait for the slider to settle before refetching, so a drag across
// several months fires one request instead of one per step
const SLIDER_DEBOUNCE_MS = 400;

// How long each month stays on screen during playback, counted from when
// its data has finished loading
const PLAY_STEP_MS = 1500;

// Centre of step i on a range input with a 16px thumb, so the month labels
// and the track fill line up with the thumb positions
const stepPosition = (i: number) => `calc(8px + (100% - 16px) * ${i / 11})`;

export default function MapPeriodFilter({
  value,
  years,
  months,
  onChange,
  loading = false,
  error = false,
  className = "",
}: {
  value: PeriodSelection;
  // Year tabs to offer (see `getMapYearOptions`)
  years: number[];
  // Months to offer for the selected year (see `getMapMonthBounds`); the
  // rest stay on the slider but can't be picked
  months: MonthBounds;
  onChange: (value: PeriodSelection) => void;
  // Data for the current selection is still loading; playback waits for it
  loading?: boolean;
  // Data for the current selection failed to load; playback stops on it
  error?: boolean;
  className?: string;
}) {
  const { year, month } = value;
  // Thumb position while dragging; committed to `onChange` after the debounce
  const [draftMonth, setDraftMonth] = useState<number | null>(month);
  const [playing, setPlaying] = useState(false);

  // Playback: a single pass over the offered months that stops once the last
  // one is shown. Each step waits until the previous month's data has
  // loaded, so every month is actually shown.
  useEffect(() => {
    // A month that failed to load stops playback instead of being skipped,
    // and so does the year or month being cleared from outside (e.g. it fell
    // out of the main date range)
    if (playing && (error || year === null || month === null)) {
      setPlaying(false);
      return;
    }
    if (!playing || year === null || loading) return;
    if (month === months.last) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(
      () =>
        onChange({ year, month: month === null ? months.first : month + 1 }),
      PLAY_STEP_MS,
    );
    return () => clearTimeout(timer);
  }, [
    playing,
    year,
    month,
    months.first,
    months.last,
    loading,
    error,
    onChange,
  ]);

  const togglePlay = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    setPlaying(true);
    // From "all months" or the last offered month, start over at the first
    // offered month straight away
    if (year !== null && (month === null || month === months.last)) {
      onChange({ year, month: months.first });
    }
  };

  // Keeps slider picks on the offered months
  const clampMonth = (m: number) =>
    Math.min(months.last, Math.max(months.first, m));

  // Track fill edges, in `stepPosition` terms. With every month offered the
  // fill starts at the track's edge and, for "all months", runs to the other
  // edge, as before.
  const fillStart = months.first === 1 ? "0px" : stepPosition(months.first - 1);
  const fillEnd =
    draftMonth !== null
      ? stepPosition(draftMonth - 1)
      : months.last === 12
        ? "100%"
        : stepPosition(months.last - 1);

  // Follow the committed value (a year switch resets to all months)
  useEffect(() => {
    setDraftMonth(month);
  }, [year, month]);

  useEffect(() => {
    if (year === null || draftMonth === null || draftMonth === month) return;
    const timer = setTimeout(
      () => onChange({ year, month: draftMonth }),
      SLIDER_DEBOUNCE_MS,
    );
    return () => clearTimeout(timer);
  }, [draftMonth, month, year, onChange]);

  // Any manual change stops playback
  const selectYear = (y: number) => {
    setPlaying(false);
    onChange(
      y === year ? { year: null, month: null } : { year: y, month: null },
    );
  };

  const selectMonth = (m: number | null) => {
    setPlaying(false);
    setDraftMonth(m);
    if (year !== null && m !== month) onChange({ year, month: m });
  };

  // Below xl: years + actions on one line, slider underneath.
  // xl and up: years | slider | actions in a single row (`xl:contents`
  // lifts the first line's children into the outer row so `order` applies).
  return (
    <div
      className={`w-full rounded-xl border border-border bg-surface shadow-lg px-3 py-2.5 flex flex-col gap-2 xl:flex-row xl:items-center xl:gap-4 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-2 sm:gap-x-3 gap-y-2 xl:contents">
        {/* Year segments — clicking the active year again goes back to overall */}
        <div className="inline-flex shrink-0 rounded-lg border border-border-strong overflow-hidden divide-x divide-border-strong xl:order-1">
          {years.map((y) => (
            <button
              key={y}
              type="button"
              aria-pressed={y === year}
              onClick={() => selectYear(y)}
              className={`h-8 px-2 sm:px-3 text-sm font-medium transition-colors ${
                y === year
                  ? "bg-primary-50 text-primary-500"
                  : "bg-surface text-text-secondary hover:bg-surface-subtle"
              }`}
            >
              {y}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 shrink-0 xl:order-3">
          {year === null ? (
            <p className="text-xs text-text-muted">
              Select a year for month-wise view
            </p>
          ) : (
            // No separate clear button: clicking the active year goes back
            // to overall
            month !== null && (
              <button
                type="button"
                onClick={() => selectMonth(null)}
                aria-label="Show all months"
                className="h-7 px-2 rounded-md border border-border-strong text-xs text-text-primary hover:border-primary-500"
              >
                <span className="sm:hidden">All</span>
                <span className="hidden sm:inline">All months</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Play button + month slider — only once a year is picked */}
      {year !== null && (
        <div className="flex items-center gap-3 min-w-0 xl:flex-1 xl:order-2">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={
              playing ? "Pause month playback" : "Play through months"
            }
            title={playing ? "Pause" : "Play through months"}
            className="h-8 w-8 shrink-0 rounded-full bg-primary-500 text-text-inverse hover:bg-primary-700 inline-flex items-center justify-center"
          >
            {playing ? (
              <Pause size={14} fill="currentColor" />
            ) : (
              <Play size={14} fill="currentColor" className="ml-0.5" />
            )}
          </button>
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <div className="relative h-4">
              {MONTHS.map((name, i) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => selectMonth(i + 1)}
                  disabled={i + 1 < months.first || i + 1 > months.last}
                  style={{ left: stepPosition(i) }}
                  className={`absolute -translate-x-1/2 text-xs leading-4 ${
                    draftMonth === i + 1
                      ? "text-text-primary font-semibold"
                      : "font-medium text-text-secondary enabled:hover:text-text-primary disabled:font-normal disabled:text-text-disabled disabled:cursor-not-allowed"
                  }`}
                >
                  <span className="sm:hidden">{name[0]}</span>
                  <span className="hidden sm:inline">{name.slice(0, 3)}</span>
                </button>
              ))}
            </div>
            <div className="relative h-4">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-primary-100" />
              {/* Fill runs from the first offered month up to the thumb, or
                across every offered month for "all months" */}
              <div
                className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-primary-500"
                style={{
                  left: fillStart,
                  width: `calc(${fillEnd} - ${fillStart})`,
                }}
              />
              {/* !-prefixed thumb styles override the global range-thumb
                rules in geolens/index.css, which persist after visiting
                that page */}
              <input
                type="range"
                min={1}
                max={12}
                step={1}
                value={draftMonth ?? 12}
                onChange={(e) => {
                  setPlaying(false);
                  setDraftMonth(clampMonth(Number(e.target.value)));
                }}
                // Commit straight away on release; also covers clicking the
                // current value from the "all months" state (no change event)
                onPointerUp={(e) =>
                  selectMonth(clampMonth(Number(e.currentTarget.value)))
                }
                aria-label={`Month of ${year}`}
                aria-valuetext={
                  draftMonth === null
                    ? "All months"
                    : `${MONTHS[draftMonth - 1]} ${year}`
                }
                className={`absolute inset-0 w-full h-4 appearance-none bg-transparent cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:!h-4 [&::-webkit-slider-thumb]:!w-4
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:!bg-primary-500 [&::-webkit-slider-thumb]:!border-0
                [&::-webkit-slider-thumb]:!shadow-none [&::-webkit-slider-thumb]:!mt-0
                [&::-moz-range-thumb]:!h-4 [&::-moz-range-thumb]:!w-4 [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:!bg-primary-500 [&::-moz-range-thumb]:!border-0 [&::-moz-range-thumb]:!shadow-none
                [&::-moz-range-track]:bg-transparent ${
                  draftMonth === null
                    ? "[&::-webkit-slider-thumb]:opacity-0 [&::-moz-range-thumb]:opacity-0"
                    : ""
                }`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
