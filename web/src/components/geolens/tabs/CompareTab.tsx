import { ChevronDown, ChevronLeft, ChevronRight, Waves } from "lucide-react";
import type React from "react";
import { RadiusSlider } from "../RadiusSlider";
import {
  CompareSites,
  SITE_COLORS,
  type CompareSitesProps,
} from "../compare/CompareSites";
import {
  FORECAST_WEEKS,
  MIN_CHANCE_PRESETS,
} from "../compare/useCompareForecast";
import type { CompareForecast } from "../compare/useCompareForecast";
import { formatDay } from "../prediction/utils";
import { Hint, RangeField, Segmented, Step, Switch } from "./controls";

export { SITE_COLORS };

export function shortSiteName(name: string) {
  return name.split(",").slice(0, 2).join(",");
}

interface CompareTabProps {
  sites: CompareSitesProps;
  radius: number;
  setRadius: (value: number) => void;
  showBufferWetlands: boolean;
  setShowBufferWetlands: (value: boolean) => void;
  showBufferPoultry: boolean;
  setShowBufferPoultry: (value: boolean) => void;
  forecast: CompareForecast;
}

/**
 * Compare's side panel (the narrow one): the two sites and their buffer
 * radius, the forecast week and threshold, and what the map draws around
 * the sites.
 */
export function CompareTab(props: CompareTabProps) {
  const {
    sites,
    radius,
    setRadius,
    showBufferWetlands,
    setShowBufferWetlands,
    showBufferPoultry,
    setShowBufferPoultry,
    forecast,
  } = props;
  const { ml } = forecast;

  // Drawn inside the radius around each site; the hint is the row's tooltip.
  const layers: [
    string,
    React.ReactNode,
    string,
    boolean,
    (value: boolean) => void,
  ][] = [
    [
      "Wetlands",
      <Waves key="w" size={14} />,
      "Water bodies inside each buffer",
      showBufferWetlands,
      setShowBufferWetlands,
    ],
    [
      "Poultry farms",
      <span key="p" aria-hidden="true" className="text-[13px]">
        🐔
      </span>,
      "Farms inside each buffer",
      showBufferPoultry,
      setShowBufferPoultry,
    ],
  ];

  return (
    <>
      <Step title="Sites">
        <CompareSites {...sites} />
        <div className="mt-1">
          <RadiusSlider
            id="geolens-compare-radius"
            label="Buffer radius"
            value={radius}
            onChange={setRadius}
          />
        </div>
      </Step>

      {/* Always offered: the forecast is checked for only once picked, and
          Present is the way back if it turns out to be off */}
      <Step title="Map shows">
        <Segmented
          label="Map shows"
          value={forecast.mapShows}
          onChange={forecast.setMapShows}
          options={[
            {
              value: "present",
              label: "Present",
              title: "Bird density: eBird sightings from the last 30 days",
            },
            {
              value: "forecast",
              label: "Forecast",
              title: "Where species clear the minimum chance",
            },
          ]}
        />
      </Step>

      {/* The week and the minimum chance are the forecast's own settings */}
      {forecast.mapShows === "forecast" && (
        <Step title="Forecast">
          {ml.status === "off" ? (
            <Hint>Bird forecasts aren&apos;t turned on for this server.</Hint>
          ) : ml.status === "error" ? (
            <p className="text-xs text-grey-70">
              {ml.message}{" "}
              <button
                type="button"
                onClick={forecast.retry}
                className="font-semibold text-blue-40 hover:underline"
              >
                Retry
              </button>
            </p>
          ) : (
            <>
              <ForecastWeekPicker forecast={forecast} />
              <div className="mt-1">
                <RangeField
                  id="geolens-forecast-min-chance"
                  label="Minimum chance"
                  valueLabel={`≥ ${forecast.minChance}%`}
                  min={5}
                  max={95}
                  step={5}
                  value={forecast.minChance}
                  onChange={forecast.setMinChance}
                />
              </div>
              <div className="grid auto-cols-fr grid-flow-col gap-1">
                {MIN_CHANCE_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    aria-pressed={forecast.minChance === preset}
                    onClick={() => forecast.setMinChance(preset)}
                    className={`min-h-7 rounded-md border text-xs font-semibold tabular-nums ${
                      forecast.minChance === preset
                        ? "border-blue-40 bg-blue-10 text-blue-40"
                        : "border-grey-30 text-grey-70 hover:bg-grey-10"
                    }`}
                  >
                    {preset}%
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-grey-60">
                Species at or above this count as likely.
              </p>
            </>
          )}
        </Step>
      )}

      <Step title="Layers">
        <div className="divide-y divide-grey-20 rounded-lg border border-grey-20">
          {layers.map(([title, icon, hint, checked, set]) => (
            <div
              key={title}
              title={hint}
              className="flex items-center gap-2.5 px-2.5 py-2"
            >
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-grey-10 text-grey-70">
                {icon}
              </span>
              <span className="min-w-0 flex-1 truncate text-[13px] text-grey-80">
                {title}
              </span>
              <Switch label={title} checked={checked} onChange={set} />
            </div>
          ))}
        </div>
      </Step>
    </>
  );
}

/** ‹ Week 1 · 15 Oct › - steps wrap around the 13-week horizon. */
function ForecastWeekPicker({ forecast }: { forecast: CompareForecast }) {
  const { horizon, weekIdx, setWeekIdx } = forecast;
  const step = (by: number) =>
    setWeekIdx((weekIdx + by + FORECAST_WEEKS) % FORECAST_WEEKS);
  const arrow =
    "flex h-9 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-grey-30 text-grey-70 hover:bg-grey-10";

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="geolens-forecast-week" className="text-xs text-grey-60">
        Week
      </label>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous week"
          className={arrow}
        >
          <ChevronLeft size={14} />
        </button>
        {/* Our own chevron: the browser's sits flush against the border */}
        <div className="relative min-w-0 flex-1">
          <select
            id="geolens-forecast-week"
            aria-label="Forecast week"
            value={weekIdx}
            onChange={(e) => setWeekIdx(Number(e.target.value))}
            className="h-9 w-full min-w-0 appearance-none rounded-lg border border-grey-30 bg-white pl-2.5 pr-8 text-[13px] text-grey-80"
          >
            {horizon.map((h, i) => (
              <option key={h.week} value={i}>
                Week {i + 1} · {formatDay(h.start, false)}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            aria-hidden="true"
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-grey-60"
          />
        </div>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next week"
          className={arrow}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
