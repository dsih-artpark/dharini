import {
  ChevronDown,
  ChevronUp,
  Download,
  Flame,
  Loader2,
  Map as MapIcon,
  Maximize2,
  Search,
  X,
} from "lucide-react";
import type React from "react";
import type {
  BirdObservation,
  PoultryFarm,
  Site,
  Wetland,
} from "@/src/app/(dashboard)/geolens/types";
import type { WeatherData } from "@/src/app/(dashboard)/geolens/loader";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { WeatherMiniCard } from "../WeatherCards";
import { CHANCE_BINS, gridColor } from "../compare/forecastGrid";
import type {
  CompareForecast,
  ForecastSpeciesRow,
  SpeciesCard,
} from "../compare/useCompareForecast";
import { formatPercent } from "../prediction/utils";
import { SITE_COLORS, shortSiteName } from "../tabs/CompareTab";
import { Hint } from "../tabs/controls";

/** The views inside "Site details". */
export type CompareTabKey = "overview" | "birds" | "farms";

interface SpeciesSummary {
  name: string;
  count: number;
  percentage: number;
}

interface NearestWetland {
  distKm: number;
  wetland: Wetland;
}

interface ComparisonResultsProps {
  /** Layout classes from the page (width, borders). */
  className?: string;
  compareTab: CompareTabKey;
  setCompareTab: (tab: CompareTabKey) => void;
  siteA: Site | null;
  siteB: Site | null;
  birdsA: BirdObservation[];
  birdsB: BirdObservation[];
  weatherA: WeatherData | null;
  weatherB: WeatherData | null;
  nearestA: NearestWetland | null;
  nearestB: NearestWetland | null;
  wetlandAreaA: number;
  wetlandAreaB: number;
  poultryDensityA: number;
  poultryDensityB: number;
  totalBirdsA: number;
  totalBirdsB: number;
  speciesListA: SpeciesSummary[];
  speciesListB: SpeciesSummary[];
  farmsA: PoultryFarm[];
  farmsB: PoultryFarm[];
  radius: number;
  downloadComparisonReport: () => void;
  forecast: CompareForecast;
}

const ICON_BUTTON =
  "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-grey-30 text-grey-70 hover:bg-grey-10";

/**
 * Compare's results, beside the map: species present and forecast at both
 * sites, then the site details (metrics, weather, birds, farms). The expand
 * button opens the same content in a larger dialog.
 */
export function ComparisonResults(props: ComparisonResultsProps) {
  const {
    className = "",
    siteA,
    siteB,
    radius,
    downloadComparisonReport,
    forecast,
  } = props;
  // As the map's chip: the species table, or the grid when the map shows it
  const forecastLoading =
    forecast.loading ||
    (forecast.mapShows === "forecast" && forecast.grid.loading);
  const [expanded, setExpanded] = useState(false);
  const closeDialog = useCallback(() => setExpanded(false), []);

  const download = (
    <button
      type="button"
      onClick={downloadComparisonReport}
      disabled={!siteA && !siteB}
      title="Download report (PDF)"
      aria-label="Download report (PDF)"
      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-40 text-white hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Download size={15} />
    </button>
  );

  return (
    <section
      aria-label="Site comparison"
      className={`flex flex-col overflow-hidden rounded-xl border border-grey-20 bg-white shadow-sm ${className}`}
    >
      <div className="flex flex-shrink-0 items-center gap-x-4 gap-y-2 border-b border-grey-20 px-3.5 py-2.5">
        {/* Wraps: beside the map there's no room for the loader on one line */}
        <div className="mr-auto flex min-w-0 flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
          <h3 className="text-[15px] font-bold text-grey-80">
            Site comparison
          </h3>
          <span className="whitespace-nowrap text-xs text-grey-60">
            {radius} km radius
          </span>
          <span role="status">
            {forecastLoading && (
              <span className="flex items-center gap-1 whitespace-nowrap text-xs font-medium text-blue-40">
                <Loader2
                  size={12}
                  aria-hidden="true"
                  className="animate-spin"
                />
                Loading forecast…
              </span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {download}
          <button
            type="button"
            onClick={() => setExpanded(true)}
            aria-haspopup="dialog"
            aria-label="Open larger view"
            title="Open larger view"
            className={ICON_BUTTON}
          >
            <Maximize2 size={15} />
          </button>
        </div>
      </div>
      {/* relative: the rows' sr-only labels are absolutely positioned, and
          without it they'd be placed against the page, below this list,
          making the whole page scroll */}
      <div className="relative min-h-0 flex-1 overflow-y-auto px-3.5 py-3">
        <ComparisonBody {...props} wide={false} />
      </div>

      {expanded && (
        <ComparisonDialog
          onClose={closeDialog}
          subtitle={`${radius} km radius`}
          actions={download}
        >
          <ComparisonBody {...props} wide />
        </ComparisonDialog>
      )}
    </section>
  );
}

function ComparisonDialog({
  onClose,
  subtitle,
  actions,
  children,
}: {
  onClose: () => void;
  subtitle: string;
  actions: React.ReactNode;
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Focus moves into the dialog and back to the expand button on close.
    const opener = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-grey-80/40 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="geolens-comparison-dialog-title"
        tabIndex={-1}
        className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-xl outline-none"
      >
        <div className="flex flex-shrink-0 items-center gap-x-4 border-b border-grey-20 px-5 py-3">
          <div className="mr-auto flex items-baseline gap-2.5">
            <h3
              id="geolens-comparison-dialog-title"
              className="text-[15px] font-bold text-grey-80"
            >
              Site comparison
            </h3>
            <span className="text-xs text-grey-60">{subtitle}</span>
          </div>
          <div className="flex items-center gap-2">
            {actions}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              title="Close"
              className={ICON_BUTTON}
            >
              <X size={15} />
            </button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function ComparisonBody(props: ComparisonResultsProps & { wide: boolean }) {
  const { siteA, siteB, forecast, wide } = props;

  if (!siteA && !siteB) {
    return (
      <p className="py-6 text-center text-xs text-grey-60">
        Pick Site A and Site B in the side panel, or click the map, to compare
        what&apos;s recorded around them now and which birds are forecast.
      </p>
    );
  }

  // Present: what's recorded around the sites now, the details being all
  // there is, so they stay open. Forecast: the species likely there.
  if (forecast.mapShows === "present") {
    return <SiteDetails {...props} open onToggle={null} />;
  }

  const { ml } = forecast;
  return ml.status === "ready" ? (
    <SpeciesForecastTable
      forecast={forecast}
      siteA={siteA}
      siteB={siteB}
      wide={wide}
    />
  ) : ml.status === "off" ? (
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
    <p className="py-2 text-xs text-grey-60">Checking bird forecasts…</p>
  );
}

function DensityBadge({ birds }: { birds: BirdObservation[] }) {
  if (birds.length > 50)
    return (
      <span className="rounded-full bg-red-10 px-2 py-0.5 text-[11px] font-bold text-red-30">
        High
      </span>
    );
  if (birds.length > 10)
    return (
      <span className="rounded-full bg-yellow-10 px-2 py-0.5 text-[11px] font-bold text-yellow-30">
        Med
      </span>
    );
  return (
    <span className="rounded-full bg-green-10 px-2 py-0.5 text-[11px] font-bold text-green-30">
      Low
    </span>
  );
}

function NearestCell({
  site,
  nearest,
  color,
}: {
  site: Site | null;
  nearest: NearestWetland | null;
  color: string;
}) {
  if (!site || !nearest) return <>0.0 km</>;
  return (
    <span className="flex items-center gap-1.5">
      {nearest.distKm.toFixed(1)} km
      <a
        href={`https://www.google.com/maps/dir/?api=1&origin=${site.end[0]},${site.end[1]}&destination=${nearest.wetland.lat},${nearest.wetland.lng}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Get Directions"
        aria-label="Get directions to the nearest wetland"
      >
        <MapIcon size={14} style={{ color }} />
      </a>
    </span>
  );
}

function SiteHeader({
  slot,
  site,
  withName,
}: {
  slot: "A" | "B";
  site: Site | null;
  withName: boolean;
}) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
        style={{ background: SITE_COLORS[slot] }}
      />
      <span className="truncate normal-case" title={site?.name}>
        Site {slot}
        {withName && site ? ` · ${shortSiteName(site.name)}` : ""}
      </span>
    </span>
  );
}

const DETAIL_TABS: CompareTabKey[] = ["overview", "birds", "farms"];

/** The comparison as it was before the forecast: metrics, birds, farms. */
function SiteDetails(
  props: ComparisonResultsProps & {
    wide: boolean;
    open: boolean;
    /** null when the details can't be folded away. */
    onToggle: (() => void) | null;
  },
) {
  const {
    open,
    onToggle,
    wide,
    compareTab,
    setCompareTab,
    siteA,
    siteB,
    birdsA,
    birdsB,
    weatherA,
    weatherB,
    nearestA,
    nearestB,
    wetlandAreaA,
    wetlandAreaB,
    poultryDensityA,
    poultryDensityB,
    totalBirdsA,
    totalBirdsB,
    speciesListA,
    speciesListB,
    farmsA,
    farmsB,
    radius,
  } = props;

  const rows: [string, React.ReactNode, React.ReactNode][] = [
    [
      "Bird Density",
      siteA ? <DensityBadge birds={birdsA} /> : "N/A",
      siteB ? <DensityBadge birds={birdsB} /> : "N/A",
    ],
    [
      "Species Count",
      siteA ? new Set(birdsA.map((b) => b.comName)).size : 0,
      siteB ? new Set(birdsB.map((b) => b.comName)).size : 0,
    ],
    [
      "Total Bird Count",
      siteA ? totalBirdsA.toLocaleString() : 0,
      siteB ? totalBirdsB.toLocaleString() : 0,
    ],
    [
      "Nearest Wetland",
      <NearestCell
        key="a"
        site={siteA}
        nearest={nearestA}
        color={SITE_COLORS.A}
      />,
      <NearestCell
        key="b"
        site={siteB}
        nearest={nearestB}
        color={SITE_COLORS.B}
      />,
    ],
    [
      `Total Wetland Area (${radius}km)`,
      siteA ? `${wetlandAreaA.toFixed(1)} Ha` : "0.0 Ha",
      siteB ? `${wetlandAreaB.toFixed(1)} Ha` : "0.0 Ha",
    ],
    [
      `Poultry Farms (${radius}km)`,
      siteA ? poultryDensityA : 0,
      siteB ? poultryDensityB : 0,
    ],
  ];
  const columns = wide
    ? "grid grid-cols-2 gap-3.5"
    : "grid grid-cols-1 gap-3.5";

  const title = "Site details";
  return (
    <section aria-label={title} className="border-t border-grey-20 pt-3">
      {onToggle ? (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-2 text-left text-[13px] font-bold text-grey-80"
        >
          {title}
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-grey-30 text-grey-70 hover:bg-grey-10"
          >
            {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </span>
        </button>
      ) : (
        <h4 className="text-[13px] font-bold text-grey-80">{title}</h4>
      )}

      {open && (
        <div className="mt-3 flex flex-col gap-3">
          <div
            role="tablist"
            aria-label={title}
            className="flex gap-0.5 self-start rounded-lg border border-grey-20 bg-grey-10 p-[3px]"
          >
            {DETAIL_TABS.map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={compareTab === t}
                onClick={() => setCompareTab(t)}
                className={`min-h-7 rounded-md px-3 text-xs font-semibold capitalize ${
                  compareTab === t
                    ? "bg-white text-blue-40 shadow-sm"
                    : "text-grey-60 hover:text-grey-80"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {compareTab === "overview" && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[13px]">
                  <thead>
                    <tr className="border-b border-grey-20 text-left text-[11px] font-semibold uppercase tracking-wide text-grey-60">
                      <th className="py-1.5 pr-2">Metric</th>
                      <th className="px-2 py-1.5">
                        <SiteHeader slot="A" site={siteA} withName={wide} />
                      </th>
                      <th className="px-2 py-1.5">
                        <SiteHeader slot="B" site={siteB} withName={wide} />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(([label, a, b]) => (
                      <tr key={label} className="border-b border-grey-20">
                        <td className="py-2 pr-2 text-xs font-semibold text-grey-70">
                          {label}
                        </td>
                        <td className="px-2 py-2 tabular-nums text-grey-80">
                          {a}
                        </td>
                        <td className="px-2 py-2 tabular-nums text-grey-80">
                          {b}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={columns}>
                {(
                  [
                    ["A", siteA, weatherA],
                    ["B", siteB, weatherB],
                  ] as const
                ).map(([slot, site, weather]) => (
                  <div key={slot}>
                    <h5
                      className="mb-1.5 text-[11px] font-bold uppercase"
                      style={{ color: SITE_COLORS[slot] }}
                    >
                      Site {slot} Weather
                    </h5>
                    {site && weather ? (
                      <WeatherMiniCard weather={weather} />
                    ) : (
                      <div className="rounded-lg bg-grey-10 p-2 text-center text-[11px] text-grey-60">
                        Weather unavailable
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {compareTab === "birds" && (
            <div className={columns}>
              <SpeciesColumn slot="A" speciesList={speciesListA} />
              <SpeciesColumn slot="B" speciesList={speciesListB} />
            </div>
          )}

          {compareTab === "farms" && (
            <div className={columns}>
              <FarmColumn slot="A" farms={farmsA} radius={radius} />
              <FarmColumn slot="B" farms={farmsB} radius={radius} />
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function ColumnTitle({
  slot,
  label,
  count,
}: {
  slot: "A" | "B";
  label: string;
  count: number;
}) {
  return (
    <h5
      className="mb-2 flex justify-between border-b-2 pb-1 text-[11px] font-bold uppercase"
      style={{ color: SITE_COLORS[slot], borderColor: SITE_COLORS[slot] }}
    >
      Site {slot} {label} <span>{count}</span>
    </h5>
  );
}

function SpeciesColumn({
  slot,
  speciesList,
}: {
  slot: "A" | "B";
  speciesList: SpeciesSummary[];
}) {
  return (
    <div>
      <ColumnTitle slot={slot} label="Species" count={speciesList.length} />
      {speciesList.length === 0 ? (
        <div className="py-6 text-center text-xs text-grey-60">
          No bird data recorded for this site.
        </div>
      ) : (
        speciesList.map((item) => (
          <div
            key={item.name}
            className="grid grid-cols-[minmax(0,1fr)_48px_52px] gap-2 border-b border-grey-20 py-1 text-xs"
          >
            <span className="text-grey-80">{item.name}</span>
            <span className="text-right font-mono text-grey-70">
              {item.count}
            </span>
            <span className="text-right font-mono text-grey-60">
              {item.percentage.toFixed(1)}%
            </span>
          </div>
        ))
      )}
    </div>
  );
}

function FarmColumn({
  slot,
  farms,
  radius,
}: {
  slot: "A" | "B";
  farms: PoultryFarm[];
  radius: number;
}) {
  return (
    <div>
      <ColumnTitle slot={slot} label="Farms" count={farms.length} />
      {farms.length === 0 ? (
        <div className="py-6 text-center text-xs text-grey-60">
          No poultry farms within {radius}km.
        </div>
      ) : (
        farms.map((f) => (
          <div
            key={f.id}
            className="flex items-center gap-1.5 border-b border-grey-20 py-1.5 text-xs text-grey-80"
          >
            <Flame size={12} style={{ color: SITE_COLORS[slot] }} />
            {f.name}
          </div>
        ))
      )}
    </div>
  );
}

function ChanceCell({
  chance,
  threshold,
}: {
  chance: number | null;
  threshold: number;
}) {
  if (chance === null) return <span className="text-grey-50">—</span>;
  // Chances that clear the minimum get the highlight pill.
  return (
    <span
      className={`inline-block min-w-11 rounded-md px-1.5 py-0.5 text-center text-xs font-bold tabular-nums ${
        chance >= threshold ? "bg-blue-10 text-blue-40" : "text-grey-60"
      }`}
    >
      {formatPercent(chance)}
    </span>
  );
}

/** Forecast per species: its chance of being around each site in the
 *  selected week. */
/** How likely a chance (0-1) is, in words. */
function likelihood(chance: number): string {
  if (chance >= 0.9) return "Very likely";
  if (chance >= 0.6) return "Likely";
  if (chance >= 0.3) return "Possible";
  return "Unlikely";
}

/**
 * The picked species at Site A and Site B, side by side: its chance in the
 * selected week at its best spot, at a typical spot, on a one-hour walk
 * and over the area, and its season here, ending in a 52-week bar.
 */
function SpeciesForecastCard({
  card,
  siteA,
  siteB,
  minChance,
  weekIdx,
  onClose,
  onRetrySeason,
}: {
  card: SpeciesCard;
  siteA: Site | null;
  siteB: Site | null;
  minChance: number;
  /** Index of the selected week in the horizon (0: this week). */
  weekIdx: number;
  onClose: () => void;
  onRetrySeason: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  // Picked further down the table: bring the card into view
  useEffect(() => {
    ref.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [card.key]);

  const columns = (["A", "B"] as const).flatMap((slot, i) => {
    const site = i === 0 ? siteA : siteB;
    return site ? [{ slot, site, data: card.sites[i] }] : [];
  });
  // The season's values: "…" while it loads, "—" when there's none
  const seasonValue = (value: string | null | undefined) =>
    card.seasonLoading ? "…" : (value ?? "—");

  return (
    <section
      ref={ref}
      aria-label={`${card.name} at the sites`}
      className="flex flex-col gap-3 rounded-xl bg-grey-10 p-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="text-base font-bold leading-tight text-grey-80">
            {card.name}
          </h4>
          {card.guild && (
            <p className="text-xs capitalize text-grey-60">{card.guild}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close, and show all species on the map"
          title="Close, and show all species on the map"
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-grey-60 hover:bg-black/5 hover:text-grey-80"
        >
          <X size={15} />
        </button>
      </div>

      <div className={`grid gap-3 ${columns.length > 1 ? "grid-cols-2" : ""}`}>
        {columns.map(({ slot, site, data }) => (
          // A size container: its figures sit in two columns when it's wide
          // enough (one site, or the larger view), else one under the other
          <div
            key={slot}
            className="flex min-w-0 flex-col gap-3 [container-type:inline-size]"
          >
            <span className="flex min-w-0 items-center gap-1.5 text-[11px] font-semibold text-grey-70">
              <span
                aria-hidden="true"
                className="h-2 w-2 flex-shrink-0 rounded-full"
                style={{ background: SITE_COLORS[slot] }}
              />
              <span className="truncate">
                {slot} · {shortSiteName(site.name)}
              </span>
            </span>
            {data ? (
              <>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-4xl font-bold leading-none tabular-nums text-grey-80">
                    {formatPercent(data.best)}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold text-grey-80">
                      {likelihood(data.best)}
                    </span>
                    <span className="block text-[11px] text-grey-60">
                      {weekIdx === 0
                        ? "Best area this week"
                        : `Best area in week ${weekIdx + 1}`}
                    </span>
                  </span>
                </div>
                {/* This week's figures, then the season's */}
                <div className="grid gap-x-6 text-xs [@container(min-width:280px)]:grid-cols-2">
                  {[
                    [
                      ["Typical spot", formatPercent(data.typical)],
                      [
                        "One-hour walk",
                        data.season
                          ? formatPercent(data.season.walk)
                          : seasonValue(null),
                      ],
                      [`Area at ${minChance}%+`, formatPercent(data.area)],
                    ],
                    [
                      ["Arrives", seasonValue(data.season?.arrives)],
                      ["Peaks", seasonValue(data.season?.peaks)],
                      ["Leaves", seasonValue(data.season?.leaves)],
                    ],
                  ].map((figures) => (
                    <dl key={figures[0][0]}>
                      {figures.map(([label, value]) => (
                        <div
                          key={label}
                          className="flex items-baseline justify-between gap-2 border-t border-grey-20 py-1.5"
                        >
                          <dt className="text-grey-60">{label}</dt>
                          <dd className="whitespace-nowrap font-semibold tabular-nums text-grey-80">
                            {value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  ))}
                </div>
                <SeasonBar
                  presence={data.season?.presence ?? null}
                  week={card.week}
                  minChance={minChance}
                  loading={card.seasonLoading}
                />
              </>
            ) : (
              <p className="text-xs text-grey-60">Not forecast at this site.</p>
            )}
          </div>
        ))}
      </div>

      {card.seasonError && (
        <p className="text-xs text-grey-70">
          {card.seasonError}{" "}
          <button
            type="button"
            onClick={onRetrySeason}
            className="font-semibold text-blue-40 hover:underline"
          >
            Retry
          </button>
        </p>
      )}
      <p className="flex items-center gap-1.5 text-[11px] text-grey-60">
        <MapIcon
          size={12}
          aria-hidden="true"
          className="flex-shrink-0 text-blue-40"
        />
        The map shows only this species.
      </p>
    </section>
  );
}

/**
 * A species' 52 weeks at a site, week 1 (January) first: the map's colours
 * where it clears the minimum chance, grey elsewhere, and a line on the
 * selected week.
 */
function SeasonBar({
  presence,
  week,
  minChance,
  loading,
}: {
  presence: number[] | null;
  /** Model week, 1-52. */
  week: number;
  minChance: number;
  loading: boolean;
}) {
  return (
    <div aria-hidden="true" className="relative">
      <div
        className={`flex h-2.5 overflow-hidden rounded-sm bg-grey-20 ${loading ? "animate-pulse" : ""}`}
      >
        {presence?.map((chance, i) => (
          <span
            key={i}
            className="flex-1"
            style={
              chance * 100 >= minChance
                ? { background: gridColor(chance * 100, CHANCE_BINS) }
                : undefined
            }
          />
        ))}
      </div>
      <span
        className="absolute -inset-y-1 w-0.5 -translate-x-1/2 rounded-full bg-grey-80"
        style={{ left: `${((week - 0.5) / 52) * 100}%` }}
      />
    </div>
  );
}

function SpeciesForecastTable({
  forecast,
  siteA,
  siteB,
  wide,
}: {
  forecast: CompareForecast;
  siteA: Site | null;
  siteB: Site | null;
  wide: boolean;
}) {
  const [search, setSearch] = useState("");
  const {
    speciesRows,
    horizon,
    weekIdx,
    minChance,
    loading,
    error,
    retry,
    // One species group on its own (a tab, shared with the map grid), or
    // null for all of them
    guild,
    setGuild,
  } = forecast;
  const week = horizon[weekIdx];

  const threshold = minChance / 100;
  const isLikely = (r: ForecastSpeciesRow) =>
    Math.max(r.chanceA ?? 0, r.chanceB ?? 0) >= threshold;
  const likely = speciesRows.filter(isLikely);
  // A tab for each group the sites have, in the species list's order
  const groups = forecast.guilds.filter((g) =>
    speciesRows.some((r) => r.guild === g),
  );
  const groupRows = guild
    ? speciesRows.filter((r) => r.guild === guild)
    : speciesRows;
  // The table lists the group's likely species; searching looks through all
  // of the group's.
  const query = search.trim().toLowerCase();
  const rows = query
    ? groupRows.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.guild.toLowerCase().includes(query),
      )
    : groupRows.filter(isLikely);

  if (error) {
    return (
      <p className="py-2 text-center text-xs text-grey-70">
        {error}{" "}
        <button
          type="button"
          onClick={retry}
          className="font-semibold text-blue-40 hover:underline"
        >
          Retry
        </button>
      </p>
    );
  }
  if (loading && speciesRows.length === 0) {
    return (
      <p className="py-2 text-center text-xs text-grey-60">
        Loading the forecast for both sites…
      </p>
    );
  }
  if (speciesRows.length === 0) {
    return (
      <p className="py-2 text-center text-xs text-grey-60">
        No forecast species for these sites.
      </p>
    );
  }

  const countA = siteA
    ? likely.filter((r) => (r.chanceA ?? 0) >= threshold).length
    : null;
  const countB = siteB
    ? likely.filter((r) => (r.chanceB ?? 0) >= threshold).length
    : null;

  // Wider cells in the dialog; tight ones beside the map.
  const cellX = wide ? "px-2.5" : "px-1.5";
  const headRow =
    "text-left text-[11px] font-semibold uppercase tracking-wide text-grey-60";
  // Beside the map, a row picks the one species the forecast map shows
  // (and switches the map to the forecast); the sightings map shows all
  const selectable = !wide;
  const selected =
    selectable && forecast.mapShows === "forecast"
      ? forecast.selectedSpecies
      : null;

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-grey-70">
        <span>
          <span className="font-semibold text-grey-80">Forecast</span> · likely
          species ≥ {minChance}%{countA !== null && <> A {countA}</>}
          {countB !== null && <> · B {countB}</>}
        </span>
      </div>

      <label className="flex h-9 items-center gap-2 rounded-lg border border-grey-30 bg-white px-2.5 focus-within:border-blue-40">
        <Search size={14} aria-hidden="true" className="text-grey-60" />
        <input
          type="search"
          aria-label="Search species"
          placeholder="Search species"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[13px] outline-none placeholder:text-grey-50"
        />
      </label>

      {groups.length > 1 && (
        <div
          role="group"
          aria-label="Species group"
          // Scrolls sideways (trackpad, or Shift + wheel) with no scrollbar:
          // a shown one sits over the tabs
          className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {[null, ...groups].map((g) => (
            <button
              key={g ?? "all"}
              type="button"
              aria-pressed={guild === g}
              onClick={() => setGuild(g)}
              className={`flex-shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
                guild === g
                  ? "border-grey-80 bg-grey-80 text-white"
                  : "border-grey-30 text-grey-70 hover:bg-grey-10"
              }`}
            >
              {g ?? "All"}
            </button>
          ))}
        </div>
      )}

      {/* Also when its row is filtered out (another week or threshold) */}
      {selected && forecast.speciesCard && (
        <SpeciesForecastCard
          card={forecast.speciesCard}
          siteA={siteA}
          siteB={siteB}
          minChance={minChance}
          weekIdx={weekIdx}
          onClose={() => forecast.selectSpecies(null)}
          onRetrySeason={forecast.retrySeason}
        />
      )}

      <div className="overflow-x-auto">
        <table
          className={`w-full border-collapse text-[13px] ${wide ? "min-w-[520px]" : ""}`}
        >
          <thead>
            <tr className={headRow}>
              <th
                rowSpan={2}
                scope="col"
                className={`border-b border-grey-20 py-1.5 pr-1.5 ${wide ? "pl-2.5" : "pl-0"}`}
              >
                Species
              </th>
              <th
                colSpan={2}
                scope="colgroup"
                className={`${cellX} pt-1.5 text-center`}
              >
                Forecast
              </th>
            </tr>
            <tr className={headRow}>
              {(["A", "B"] as const).map((slot) => (
                <th
                  key={slot}
                  scope="col"
                  className={`border-b border-grey-20 ${cellX} pb-1.5 text-center`}
                >
                  <span
                    className="mr-1 inline-block h-2 w-2 rounded-full align-baseline"
                    style={{ background: SITE_COLORS[slot] }}
                  />
                  {slot}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.key}
                // The name's button has no handler of its own: its clicks,
                // keyboard ones too, reach this one
                onClick={
                  selectable
                    ? () =>
                        forecast.selectSpecies(
                          r.key === selected ? null : r.key,
                        )
                    : undefined
                }
                className={`border-b border-grey-20 ${
                  r.key === selected
                    ? "bg-blue-10"
                    : selectable
                      ? "cursor-pointer hover:bg-grey-10"
                      : ""
                }`}
              >
                <td className={`py-1.5 pr-1.5 ${wide ? "pl-2.5" : "pl-0"}`}>
                  {selectable ? (
                    <button
                      type="button"
                      aria-pressed={r.key === selected}
                      title={
                        r.key === selected
                          ? "Show all species on the map"
                          : "Show only this species on the map"
                      }
                      className="text-left font-semibold text-grey-80 hover:text-blue-40"
                    >
                      {r.name}
                    </button>
                  ) : (
                    <span className="font-semibold text-grey-80">{r.name}</span>
                  )}
                  <span className="block text-[11px] capitalize text-grey-60">
                    {r.guild}
                  </span>
                </td>
                <td className={`${cellX} py-1.5 text-center`}>
                  <ChanceCell chance={r.chanceA} threshold={threshold} />
                </td>
                <td className={`${cellX} py-1.5 text-center`}>
                  <ChanceCell chance={r.chanceB} threshold={threshold} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="py-2 text-center text-xs text-grey-60">
            {query
              ? "No species match the search."
              : `No species${guild ? " in this group" : ""} reach ${minChance}% in this week.`}
          </p>
        )}
        {!query && groupRows.length > rows.length && (
          <p className="pt-1.5 text-[11px] text-grey-60">
            {groupRows.length - rows.length} more species are below {minChance}
            %; search to find one.
          </p>
        )}
      </div>

      <p className="text-[11px] text-grey-60">
        Forecast: chance a species is around each site in week {weekIdx + 1},{" "}
        {week.rangeLabel}, at its best spot, in a typical year.
        {selectable && " Click a species to show only it on the map."}
      </p>
      {forecast.ml.status === "ready" && (
        <p className="border-t border-grey-20 pt-1.5 text-[10px] text-grey-60">
          {forecast.ml.info.citation}
        </p>
      )}
    </div>
  );
}
