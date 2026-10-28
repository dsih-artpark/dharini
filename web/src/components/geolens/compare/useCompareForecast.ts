"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  circlesBoundary,
  forecastCircles,
  getBirdModelInfo,
  getBirdSpecies,
  getMlStatus,
  getPlaceAllSpecies,
  getPlaceAllSpeciesAround,
  getPlaceSummaryAround,
  mlErrorMessage,
} from "@/src/app/(dashboard)/geolens/prediction/loader";
import type {
  BirdModelInfo,
  BirdSpecies,
  PlaceAllSpecies,
  PlaceSummary,
} from "@/src/app/(dashboard)/geolens/prediction/loader";
import type { Site } from "@/src/app/(dashboard)/geolens/types";
import { addDays, formatDay, modelWeekOf } from "../prediction/utils";
import type { ForecastGridLayerData } from "./forecastGrid";

/** The forecast horizon: this week and the next 12. */
export const FORECAST_WEEKS = 13;
export const DEFAULT_MIN_CHANCE = 25;
export const MIN_CHANCE_PRESETS = [25, 50, 70, 90];
// Map-grid weeks kept in memory (each is one week of one pair of sites).
const GRID_CACHE_MAX = 26;
const GRID_DEBOUNCE_MS = 250;
// Species-table weeks kept in memory (each is one week of one site).
const TABLE_CACHE_MAX = 26;
// Species-card seasons kept in memory (each is one site's whole year).
const SUMMARY_CACHE_MAX = 6;

export type MlState =
  | { status: "checking" }
  | { status: "off" }
  | { status: "error"; message: string }
  | { status: "ready"; info: BirdModelInfo };

export type CompareMapShows = "present" | "forecast";

export interface HorizonWeek {
  /** Model week, 1-52 (week 1 starts on 1 January). */
  week: number;
  start: Date;
  end: Date;
  /** e.g. "15 Oct – 21 Oct" */
  rangeLabel: string;
}

export interface ForecastSpeciesRow {
  key: string;
  name: string;
  guild: string;
  /** Chance of being in each site's area in the selected week (0-1);
   *  null when that site is not set. */
  chanceA: number | null;
  chanceB: number | null;
}

/** Each species' chance of being around one site in one week (0-1), by key. */
type SiteChances = Map<string, number>;

/** One site in one week: each species' chance there, and its chances at each
 *  of the site's sample points (percent, low to high), by key. */
interface SiteForecast {
  chances: SiteChances;
  spots: Map<string, Uint8Array>;
}

/**
 * Each species' chance around a site from its sample points: the highest of
 * its chances there, the chance at its best spot in the place.
 */
function siteForecast(data: PlaceAllSpecies, week: number): SiteForecast {
  const chances: SiteChances = new Map();
  const spots = new Map<string, Uint8Array>();
  const packed = data.weeks.find((w) => w.week === week)?.presence_pct;
  const nCells = data.cells.length;
  if (!packed || nCells === 0) return { chances, spots };
  const bytes = Uint8Array.from(atob(packed), (c) => c.charCodeAt(0));
  const nSpecies = data.species.length;
  data.species.forEach((key, s) => {
    const values = new Uint8Array(nCells);
    for (let c = 0; c < nCells; c++) values[c] = bytes[c * nSpecies + s];
    values.sort();
    chances.set(key, values[nCells - 1] / 100);
    spots.set(key, values);
  });
  return { chances, spots };
}

/** One site's column of the species card. */
export interface SpeciesCardSite {
  /** Chance in the selected week at its best spot (as the table), 0-1. */
  best: number;
  /** The same at a typical spot (the median sample point), 0-1. */
  typical: number;
  /** Share of the sample points at or above the minimum chance, 0-1. */
  area: number;
  /** The season here (`place/summary`); null until loaded, or if it failed. */
  season: {
    /** Chance one standard 1-hour walk records it in the selected week. */
    walk: number;
    /** Start dates ("8 Oct"); "All year" when it doesn't come and go, and
     *  null when it's too rare here to have a season. */
    arrives: string | null;
    peaks: string;
    leaves: string | null;
    /** 52 weekly chances, week 1 first, 0-1. */
    presence: number[];
  } | null;
}

/** The picked species, at each site, for the card above the table. */
export interface SpeciesCard {
  key: string;
  name: string;
  guild: string;
  /** Model week (1-52) the numbers are for. */
  week: number;
  /** Site A's column, then Site B's; null for a site not set. */
  sites: (SpeciesCardSite | null)[];
  seasonLoading: boolean;
  seasonError: string | null;
}

/**
 * Bird forecasts for the Compare tab: which species are likely around
 * Site A and Site B, week by week for the next 13 weeks, and the map grid
 * of how many species clear the minimum chance at each sample point.
 *
 * Compare opens on Present (what's recorded now). Nothing calls the ML
 * service until Forecast is picked with at least one site set, and only
 * while Forecast is on are the species table and the map grid fetched: for
 * the selected week only, kept in memory per site, radius and week.
 * Threshold changes never refetch.
 */
export function useCompareForecast(
  active: boolean,
  siteA: Site | null,
  siteB: Site | null,
  radius: number,
) {
  // Present (eBird sightings and site details) or Forecast
  const [mapShows, setMapShows] = useState<CompareMapShows>("present");

  // ── ML availability, checked once the feature is first needed ──────────
  const wanted =
    active && (siteA !== null || siteB !== null) && mapShows === "forecast";
  const [opened, setOpened] = useState(wanted);
  useEffect(() => {
    if (wanted) setOpened(true);
  }, [wanted]);

  const [ml, setMl] = useState<MlState>({ status: "checking" });
  const [mlAttempt, setMlAttempt] = useState(0);
  useEffect(() => {
    if (!opened) return;
    let live = true;
    setMl({ status: "checking" });
    getMlStatus()
      .then(() => getBirdModelInfo())
      .then((info) => {
        if (live) setMl({ status: "ready", info });
      })
      .catch((err: unknown) => {
        if (!live) return;
        const notEnabled =
          err !== null &&
          typeof err === "object" &&
          "response" in err &&
          (err as { response?: { status?: number } }).response?.status === 404;
        setMl(
          notEnabled
            ? { status: "off" }
            : { status: "error", message: mlErrorMessage(err) },
        );
      });
    return () => {
      live = false;
    };
  }, [opened, mlAttempt]);
  const mlReady = ml.status === "ready";
  // The forecast's data is fetched only while it's on show
  const forecastOn = mlReady && mapShows === "forecast";

  // ── Controls ───────────────────────────────────────────────────────────
  const [minChance, setMinChance] = useState(DEFAULT_MIN_CHANCE);
  const [weekIdx, setWeekIdx] = useState(0);
  // One species group the table and the map grid show on their own (a tab
  // above the table), or null for every group
  const [guild, setGuild] = useState<string | null>(null);
  // The species the map grid shows on its own (a species-table row), kept
  // with the sites it was picked for: changing Site A or B clears it
  const sitesKey = [siteA, siteB]
    .map((site) => (site ? site.end.join(",") : ""))
    .join("~");
  const [picked, setPicked] = useState<{
    key: string;
    sitesKey: string;
  } | null>(null);
  const selectedSpecies = picked?.sitesKey === sitesKey ? picked.key : null;
  /** Shows only this species on the map grid (null: all species again). */
  const selectSpecies = (key: string | null) => {
    setPicked(key ? { key, sitesKey } : null);
    if (key) setMapShows("forecast");
  };

  // This week and the next 12. Dates follow the model's calendar: week w
  // starts on 1 January + 7·(w-1) days, and week 52 runs to 31 December.
  const horizon = useMemo<HorizonWeek[]>(() => {
    const now = new Date();
    const firstWeek = modelWeekOf(now);
    return Array.from({ length: FORECAST_WEEKS }, (_, i) => {
      const wrapped = firstWeek - 1 + i >= 52;
      const week = ((firstWeek - 1 + i) % 52) + 1;
      const start = new Date(
        now.getFullYear() + (wrapped ? 1 : 0),
        0,
        1 + (week - 1) * 7,
      );
      const end =
        week === 52 ? new Date(start.getFullYear(), 11, 31) : addDays(start, 6);
      return {
        week,
        start,
        end,
        rangeLabel: `${formatDay(start, false)} – ${formatDay(end, false)}`,
      };
    });
  }, []);

  const selectedWeek = horizon[weekIdx].week;

  // ── Species names and groups (all-species gives keys only) ─────────────
  const [speciesInfo, setSpeciesInfo] = useState<Map<
    string,
    BirdSpecies
  > | null>(null);
  const [speciesInfoError, setSpeciesInfoError] = useState<string | null>(null);
  useEffect(() => {
    if (!mlReady || speciesInfo) return;
    let live = true;
    setSpeciesInfoError(null);
    getBirdSpecies()
      .then((list) => {
        if (live) setSpeciesInfo(new Map(list.map((s) => [s.key, s])));
      })
      .catch((err) => {
        if (live) setSpeciesInfoError(mlErrorMessage(err));
      });
    return () => {
      live = false;
    };
  }, [mlReady, speciesInfo]);
  // The species groups, in the order the species list first names them
  const guilds = useMemo(
    () =>
      speciesInfo
        ? [
            ...new Set(
              [...speciesInfo.values()].map((s) => s.guild).filter(Boolean),
            ),
          ]
        : [],
    [speciesInfo],
  );

  // ── The species table: one call per site, the selected week ────────────
  // Each site's own circle, as centre + radius: the circle place/summary
  // scored, so a site's chances are the same whether or not the other site
  // is set or overlaps it (the map grid merges overlapping circles).
  const tableKeyOf = (site: Site | null) =>
    forecastOn && site
      ? `${site.end[0]},${site.end[1]},${radius}|${selectedWeek}`
      : null;
  const tableKeyA = tableKeyOf(siteA);
  const tableKeyB = tableKeyOf(siteB);
  const tableKey =
    tableKeyA || tableKeyB ? `${tableKeyA ?? ""}~${tableKeyB ?? ""}` : null;
  const tableCache = useRef(new Map<string, SiteForecast>());
  const [table, setTable] = useState<{
    key: string | null;
    /** Site A's forecast, then Site B's; null for a site not set. */
    sites: (SiteForecast | null)[];
    loading: boolean;
    error: string | null;
  }>({ key: null, sites: [], loading: false, error: null });
  useEffect(() => {
    if (!tableKey) {
      setTable({ key: null, sites: [], loading: false, error: null });
      return;
    }
    const cache = tableCache.current;
    const slots = [tableKeyA, tableKeyB];
    if (slots.every((key) => !key || cache.has(key))) {
      setTable({
        key: tableKey,
        sites: slots.map((key) => (key ? cache.get(key)! : null)),
        loading: false,
        error: null,
      });
      return;
    }
    const controller = new AbortController();
    setTable({ key: tableKey, sites: [], loading: true, error: null });
    // The same pause as the grid's, so stepping through weeks asks only for
    // the one landed on.
    const timer = setTimeout(() => {
      // One request per place: two sites at the same spot share it
      const requests = new Map<string, Promise<SiteForecast> | SiteForecast>();
      const forecastFor = (key: string) => {
        if (!requests.has(key)) {
          const [lat, lng, radiusKm] = key.split("|")[0].split(",").map(Number);
          requests.set(
            key,
            cache.get(key) ??
              getPlaceAllSpeciesAround(
                lat,
                lng,
                radiusKm,
                [selectedWeek],
                controller.signal,
              ).then((data) => {
                const site = siteForecast(data, selectedWeek);
                if (cache.size >= TABLE_CACHE_MAX)
                  cache.delete(cache.keys().next().value!);
                cache.set(key, site);
                return site;
              }),
          );
        }
        return requests.get(key)!;
      };
      Promise.allSettled(
        slots.map((key) => (key ? forecastFor(key) : null)),
      ).then((results) => {
        if (controller.signal.aborted) return;
        // The table compares both sites, so it waits for both
        const failed = results.find(
          (r): r is PromiseRejectedResult => r.status === "rejected",
        );
        setTable({
          key: tableKey,
          sites: failed
            ? []
            : results.map((r) => (r.status === "fulfilled" ? r.value : null)),
          loading: false,
          error: failed ? mlErrorMessage(failed.reason) : null,
        });
      });
    }, GRID_DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [tableKey, tableKeyA, tableKeyB, selectedWeek]);

  // ── The map grid: one call per site, the selected week ─────────────────
  // Each site's circle is asked for on its own - the same request as when
  // it is the only site - so each gets the grid it gets alone, however far
  // apart they are, and adding or moving one site leaves the other's grid
  // in memory. Circles that overlap are asked for as one, so their cells
  // aren't drawn twice. Only the week on show is asked for.
  const areas = useMemo(
    () =>
      forecastOn
        ? forecastCircles(
            [siteA, siteB]
              .filter((s): s is Site => s !== null)
              .map((s) => ({ lat: s.end[0], lng: s.end[1] })),
            radius,
          ).map((circle) => ({
            ...circle,
            key: `${circle.lat},${circle.lng},${circle.radiusKm}|${selectedWeek}`,
          }))
        : [],
    [forecastOn, siteA, siteB, radius, selectedWeek],
  );
  const gridKey = areas.length ? areas.map((area) => area.key).join("~") : null;
  const areasRef = useRef(areas);
  areasRef.current = areas;
  const gridCache = useRef(new Map<string, PlaceAllSpecies>());

  type GridPart = { area: (typeof areas)[number]; data: PlaceAllSpecies };
  const [grid, setGrid] = useState<{
    key: string | null;
    parts: GridPart[];
    loading: boolean;
    error: string | null;
  }>({ key: null, parts: [], loading: false, error: null });
  useEffect(() => {
    if (!gridKey) {
      setGrid({ key: null, parts: [], loading: false, error: null });
      return;
    }
    const cache = gridCache.current;
    const wanted = areasRef.current;
    if (wanted.every((area) => cache.has(area.key))) {
      setGrid({
        key: gridKey,
        parts: wanted.map((area) => ({ area, data: cache.get(area.key)! })),
        loading: false,
        error: null,
      });
      return;
    }
    const controller = new AbortController();
    setGrid({ key: gridKey, parts: [], loading: true, error: null });
    // A short pause, so stepping through weeks asks only for the one
    // landed on.
    const timer = setTimeout(() => {
      Promise.allSettled(
        wanted.map(
          (area) =>
            cache.get(area.key) ??
            getPlaceAllSpecies(
              circlesBoundary([area], area.radiusKm),
              [selectedWeek],
              controller.signal,
            ).then((data) => {
              if (cache.size >= GRID_CACHE_MAX)
                cache.delete(cache.keys().next().value!);
              cache.set(area.key, data);
              return data;
            }),
        ),
      ).then((results) => {
        if (controller.signal.aborted) return;
        // Draw whichever sites loaded; say so if one didn't
        const failed = results.find(
          (r): r is PromiseRejectedResult => r.status === "rejected",
        );
        setGrid({
          key: gridKey,
          parts: results.flatMap((r, i) =>
            r.status === "fulfilled"
              ? [{ area: wanted[i], data: r.value }]
              : [],
          ),
          loading: false,
          error: failed ? mlErrorMessage(failed.reason) : null,
        });
      });
    }, GRID_DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [gridKey, selectedWeek]);

  // Cells of the selected week with at least one species (of the group, with
  // a tab picked) over the threshold, or, with a species picked, where that
  // species is over it (its chance).
  const gridLayer = useMemo<ForecastGridLayerData | null>(() => {
    const parts = grid.key === gridKey ? grid.parts : [];
    const cells: ForecastGridLayerData["cells"] = [];
    const areaSummaries: ForecastGridLayerData["areas"] = [];
    parts.forEach(({ area, data }) => {
      const packed = data.weeks.find(
        (w) => w.week === selectedWeek,
      )?.presence_pct;
      if (!packed) return;
      let maxCount = 0;
      const bytes = Uint8Array.from(atob(packed), (c) => c.charCodeAt(0));
      const nSpecies = data.species.length;
      // Not modelled in this area: none of its cells show
      const only = selectedSpecies
        ? data.species.indexOf(selectedSpecies)
        : null;
      const counted = data.species.map(
        (key) => !guild || speciesInfo?.get(key)?.guild === guild,
      );
      // The counted species over the threshold in the cell starting at `base`
      const speciesAt = (base: number) =>
        data.species
          .flatMap((key, s) =>
            counted[s] && bytes[base + s] >= minChance
              ? [
                  {
                    name: speciesInfo?.get(key)?.name ?? key,
                    chance: bytes[base + s],
                  },
                ]
              : [],
          )
          .sort((a, b) => b.chance - a.chance);
      data.cells.forEach(([lat, lon], cellIdx) => {
        const base = cellIdx * nSpecies;
        let count = 0;
        if (only === null) {
          for (let s = 0; s < nSpecies; s++) {
            if (counted[s] && bytes[base + s] >= minChance) count++;
          }
        } else if (only >= 0 && bytes[base + only] >= minChance) {
          count = bytes[base + only];
        }
        if (count > 0)
          cells.push({
            lat,
            lon,
            count,
            spacingKm: data.spacing_km,
            species: only === null ? () => speciesAt(base) : undefined,
          });
        maxCount = Math.max(maxCount, count);
      });
      areaSummaries.push({ lat: area.lat, lng: area.lng, maxCount });
    });
    if (parts.length === 0) return null;
    return {
      cells,
      spacingKm: parts[0].data.spacing_km,
      areas: areaSummaries,
      species: selectedSpecies
        ? {
            key: selectedSpecies,
            name: speciesInfo?.get(selectedSpecies)?.name ?? selectedSpecies,
          }
        : null,
      guild,
      minChance,
    };
  }, [
    grid.key,
    grid.parts,
    gridKey,
    selectedWeek,
    minChance,
    selectedSpecies,
    speciesInfo,
    guild,
  ]);

  // One row per species seen by either site, for the selected week.
  const tableReady = table.key === tableKey && !table.loading;
  const speciesRows = useMemo<ForecastSpeciesRow[]>(() => {
    if (!tableReady || !speciesInfo) return [];
    const rows = new Map<string, ForecastSpeciesRow>();
    table.sites.forEach((site, slot) => {
      site?.chances.forEach((chance, key) => {
        let row = rows.get(key);
        if (!row) {
          const info = speciesInfo.get(key);
          row = {
            key,
            name: info?.name ?? key,
            guild: info?.guild ?? "",
            chanceA: null,
            chanceB: null,
          };
          rows.set(key, row);
        }
        if (slot === 0) row.chanceA = chance;
        else row.chanceB = chance;
      });
    });
    return [...rows.values()].sort(
      (a, b) =>
        Math.max(b.chanceA ?? 0, b.chanceB ?? 0) -
          Math.max(a.chanceA ?? 0, a.chanceB ?? 0) ||
        a.name.localeCompare(b.name),
    );
  }, [tableReady, table.sites, speciesInfo]);

  // ── The picked species' card: its season at each site ─────────────────
  // One place/summary call per site (every species, all 52 weeks), made
  // when a species is first picked and kept per site and radius, so other
  // species and weeks need no new call.
  const summaryKeyOf = (site: Site | null) =>
    forecastOn && selectedSpecies && site
      ? `${site.end[0]},${site.end[1]},${radius}`
      : null;
  const summaryKeyA = summaryKeyOf(siteA);
  const summaryKeyB = summaryKeyOf(siteB);
  const summaryKey =
    summaryKeyA || summaryKeyB
      ? `${summaryKeyA ?? ""}~${summaryKeyB ?? ""}`
      : null;
  const summaryCache = useRef(new Map<string, PlaceSummary>());
  const [summaryAttempt, setSummaryAttempt] = useState(0);
  const [summary, setSummary] = useState<{
    key: string | null;
    /** Site A's summary, then Site B's; null for a site not set. */
    sites: (PlaceSummary | null)[];
    loading: boolean;
    error: string | null;
  }>({ key: null, sites: [], loading: false, error: null });
  useEffect(() => {
    if (!summaryKey) return;
    const cache = summaryCache.current;
    const slots = [summaryKeyA, summaryKeyB];
    if (slots.every((key) => !key || cache.has(key))) {
      setSummary({
        key: summaryKey,
        sites: slots.map((key) => (key ? cache.get(key)! : null)),
        loading: false,
        error: null,
      });
      return;
    }
    const controller = new AbortController();
    setSummary({ key: summaryKey, sites: [], loading: true, error: null });
    // One request per place: two sites at the same spot share it
    const requests = new Map<string, Promise<PlaceSummary> | PlaceSummary>();
    const summaryFor = (key: string) => {
      if (!requests.has(key)) {
        const [lat, lng, radiusKm] = key.split(",").map(Number);
        requests.set(
          key,
          cache.get(key) ??
            getPlaceSummaryAround(lat, lng, radiusKm, controller.signal).then(
              (data) => {
                if (cache.size >= SUMMARY_CACHE_MAX)
                  cache.delete(cache.keys().next().value!);
                cache.set(key, data);
                return data;
              },
            ),
        );
      }
      return requests.get(key)!;
    };
    Promise.allSettled(slots.map((key) => (key ? summaryFor(key) : null))).then(
      (results) => {
        if (controller.signal.aborted) return;
        const failed = results.find(
          (r): r is PromiseRejectedResult => r.status === "rejected",
        );
        setSummary({
          key: summaryKey,
          sites: results.map((r) =>
            r.status === "fulfilled" ? r.value : null,
          ),
          loading: false,
          error: failed ? mlErrorMessage(failed.reason) : null,
        });
      },
    );
    return () => controller.abort();
  }, [summaryKey, summaryKeyA, summaryKeyB, summaryAttempt]);

  const speciesCard = useMemo<SpeciesCard | null>(() => {
    if (!selectedSpecies || !tableReady) return null;
    const summaryReady = summary.key === summaryKey && !summary.loading;
    const info = speciesInfo?.get(selectedSpecies);
    const sites = table.sites.map((site, slot): SpeciesCardSite | null => {
      const best = site?.chances.get(selectedSpecies);
      const spots = site?.spots.get(selectedSpecies);
      if (best === undefined || !spots?.length) return null;
      const mid = (spots.length - 1) / 2;
      const typical =
        (spots[Math.floor(mid)] + spots[Math.ceil(mid)]) / 2 / 100;
      const area =
        spots.filter((percent) => percent >= minChance).length / spots.length;

      const place = summaryReady ? summary.sites[slot] : null;
      const species = place?.species.find((s) => s.key === selectedSpecies);
      const dateOf = (week: number) => place?.weeks[week - 1]?.start ?? "";
      // No arrival or departure week: present all year, unless it's too
      // rare here to have a season at all
      const allYear = species && species.peak >= 0.05 ? "All year" : null;
      return {
        best,
        typical,
        area,
        season: species
          ? {
              walk: species.visit[selectedWeek - 1] ?? 0,
              arrives:
                species.arrival_week !== null
                  ? dateOf(species.arrival_week)
                  : allYear,
              peaks: dateOf(species.peak_week),
              leaves:
                species.departure_week !== null
                  ? dateOf(species.departure_week)
                  : allYear,
              presence: species.presence,
            }
          : null,
      };
    });
    return {
      key: selectedSpecies,
      name: info?.name ?? selectedSpecies,
      guild: info?.guild ?? "",
      week: selectedWeek,
      sites,
      seasonLoading: !summaryReady,
      seasonError: summaryReady ? summary.error : null,
    };
  }, [
    selectedSpecies,
    tableReady,
    table.sites,
    summary,
    summaryKey,
    speciesInfo,
    minChance,
    selectedWeek,
  ]);

  return {
    ml,
    retry: () => setMlAttempt((n) => n + 1),
    minChance,
    setMinChance,
    mapShows,
    setMapShows,
    weekIdx,
    setWeekIdx,
    horizon,
    loading:
      tableKey !== null && (!tableReady || (!speciesInfo && !speciesInfoError)),
    error: tableKey
      ? ((tableReady ? table.error : null) ?? speciesInfoError)
      : null,
    speciesRows,
    guilds,
    guild,
    setGuild,
    selectedSpecies,
    selectSpecies,
    speciesCard,
    retrySeason: () => setSummaryAttempt((n) => n + 1),
    grid: { layer: gridLayer, loading: grid.loading, error: grid.error },
  };
}

export type CompareForecast = ReturnType<typeof useCompareForecast>;
