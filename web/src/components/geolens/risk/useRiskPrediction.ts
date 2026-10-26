"use client";

import { isAxiosError } from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getDiseases,
  predictDiseaseRisk,
  riskErrorMessage,
} from "@/src/app/(dashboard)/geolens/prediction/loader";
import type { DiseaseInfo } from "@/src/app/(dashboard)/geolens/prediction/loader";
import type { PlaceSuggestion } from "../compare/PlaceSearch";
import type { PickableSite } from "../filters/useSurveillanceFilters";
import {
  getChildren,
  getOutline,
  getStates,
  type LgdRegion,
  type RegionLevel,
  type RegionOutline,
} from "./lgdRegions";
import { CELL_KM, cellAround, gridCells, type GridCell } from "./regionGrid";

/** Colours of the predicted point, on the map and in the panel. */
export const RISK_STATUS = {
  pending: { label: "Not predicted yet", color: "#3A11B6" },
  risk: { label: "High Risk Area", color: "#A1221B" },
  not_risk: { label: "No High Risk Area", color: "#107C10" },
  failed: { label: "No data", color: "#889096" },
} as const;
export type RiskStatus = keyof typeof RISK_STATUS;

export type DiseaseState =
  | { status: "loading" }
  | { status: "off" }
  | { status: "error"; message: string }
  | { status: "ready"; disease: DiseaseInfo };

/**
 * Where the risk is predicted. The region dropdowns, the site dropdown and
 * the place search each set it; the one used last wins.
 */
export interface RiskPlace {
  source: "region" | "site" | "place";
  name: string;
  /** Under the name, e.g. "Bengaluru Urban, Karnataka". */
  area?: string;
  lat: number;
  lng: number;
}

export interface RiskOutcome {
  /** Model probability, 0-1. */
  probability: number;
  atRisk: boolean;
  /** Probability at or above which a place is a risk zone (0-1). */
  threshold: number;
}

/** One prediction, for the place and date it was asked for. */
interface RiskRun {
  place: RiskPlace;
  date: string;
  status: "loading" | "done" | "error";
  outcome?: RiskOutcome;
  message?: string;
}

/** Today in the browser's time zone, as YYYY-MM-DD. */
export function todayIso(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Region predictions: cells per request (the API's limit), requests in
// flight at once, and tries per request
const BATCH_SIZE = 50;
const MAX_IN_FLIGHT = 2;
const MAX_TRIES = 3;

/** One cell's answer from the model. */
interface CellResult {
  probability: number;
  atRisk: boolean;
}

/** A region prediction in progress, or the last one, for its grid and date. */
interface GridRun {
  id: number;
  gridKey: string;
  /** Cells asked for (those not already known). */
  total: number;
  done: number;
  running: boolean;
  /** Why the API refused, when it did. */
  error?: string;
}

// Worth asking again: no answer (network), too many requests, or a server error
const isRetryable = (err: unknown) =>
  !isAxiosError(err) ||
  !err.response ||
  err.response.status === 429 ||
  err.response.status >= 500;

// Refused for the request as a whole (ML turned off, the date rejected), so
// every other batch would be refused too. A 422 that names the locations is
// about this batch's cells only, e.g. a centre out at sea.
const refusesEveryBatch = (err: unknown) => {
  if (!isAxiosError(err) || err.response?.status !== 422) return true;
  const detail = err.response.data?.detail;
  return !(
    Array.isArray(detail) &&
    detail.some((d) => Array.isArray(d?.loc) && d.loc.includes("locations"))
  );
};

function wait(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(signal.reason);
      },
      { once: true },
    );
  });
}

/** One request of up to 50 cell centres, retried when the server is busy
 *  (after its Retry-After, else 2 s, 4 s). */
async function predictBatch(
  disease: string,
  date: string,
  cells: GridCell[],
  signal: AbortSignal,
) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await predictDiseaseRisk(
        disease,
        date,
        cells.map((c) => ({ lat: c.lat, lon: c.lng, label: c.id })),
        signal,
      );
    } catch (err) {
      if (signal.aborted || !isRetryable(err) || attempt === MAX_TRIES) {
        throw err;
      }
      const retryAfter = isAxiosError(err)
        ? Number(err.response?.headers?.["retry-after"])
        : NaN;
      await wait(
        retryAfter > 0 ? Math.min(retryAfter, 30) * 1000 : 2000 * attempt,
        signal,
      );
    }
  }
}

export interface RegionList {
  items: LgdRegion[];
  loading: boolean;
  /** The list couldn't be loaded, even after retrying. */
  failed: boolean;
  retry: () => void;
}

/** One dropdown's regions (local LGD files): the states, or the children
 *  of `parentId`. Empty until there is a parent to list under. */
function useRegionList(
  level: RegionLevel,
  parentId: number | null,
  enabled: boolean,
): RegionList {
  const [list, setList] = useState({
    items: [] as LgdRegion[],
    loading: false,
    failed: false,
  });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!enabled || (level !== "state" && parentId === null)) {
      setList({ items: [], loading: false, failed: false });
      return;
    }
    const controller = new AbortController();
    setList({ items: [], loading: true, failed: false });
    (level === "state" || parentId === null
      ? getStates(controller.signal)
      : getChildren(parentId, level, controller.signal)
    )
      .then((items) => setList({ items, loading: false, failed: false }))
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.error(`Error loading ${level} list`, error);
        setList({ items: [], loading: false, failed: true });
      });
    return () => controller.abort();
  }, [level, parentId, enabled, attempt]);
  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...list, retry };
}

// How close the map flies to each kind of place
const ZOOM: Record<RegionLevel | "site", number> = {
  state: 6,
  district: 9,
  subdistrict: 10,
  site: 11,
};

/**
 * The Risk Map tab: the disease model (LSD today, from GET /ml/diseases),
 * State, District and Sub-district lists for all of India (LGD, see
 * lgdRegions.ts) with the picked region's outline, the place and date to
 * predict, and the prediction
 * itself (POST /ml/diseases/{key}/predict).
 * Nothing loads until the tab is first opened.
 */
export function useRiskPrediction({
  active,
  pickableSites,
  onLocate,
}: {
  active: boolean;
  pickableSites: PickableSite[];
  /** Move the map to a newly set place. */
  onLocate: (lat: number, lng: number, zoom: number) => void;
}) {
  const [opened, setOpened] = useState(active);
  useEffect(() => {
    if (active) setOpened(true);
  }, [active]);

  // ── Disease model ──
  const [diseaseState, setDiseaseState] = useState<DiseaseState>({
    status: "loading",
  });
  const [diseaseAttempt, setDiseaseAttempt] = useState(0);
  useEffect(() => {
    if (!opened) return;
    let live = true;
    setDiseaseState({ status: "loading" });
    getDiseases()
      .then((diseases) => {
        if (!live) return;
        // One model today (LSD); the first one is the one shown
        const disease = diseases[0];
        setDiseaseState(
          disease ? { status: "ready", disease } : { status: "off" },
        );
      })
      .catch((err) => {
        if (!live) return;
        setDiseaseState(
          isAxiosError(err) && err.response?.status === 404
            ? { status: "off" }
            : { status: "error", message: riskErrorMessage(err) },
        );
      });
    return () => {
      live = false;
    };
  }, [opened, diseaseAttempt]);
  const retryDisease = useCallback(() => setDiseaseAttempt((n) => n + 1), []);

  // ── Regions: every state, then the districts of the picked state and the
  // sub-districts of the picked district ──
  const [state, setState] = useState<LgdRegion | null>(null);
  const [district, setDistrict] = useState<LgdRegion | null>(null);
  const [subdistrict, setSubdistrict] = useState<LgdRegion | null>(null);
  const states = useRegionList("state", null, opened);
  const districts = useRegionList("district", state?.id ?? null, opened);
  const subdistricts = useRegionList(
    "subdistrict",
    district?.id ?? null,
    opened,
  );

  // ── The place to predict ──
  const [place, setPlace] = useState<RiskPlace | null>(null);

  /** Puts the place at the most specific region picked, or clears it. */
  const placeAtRegion = (
    level: RegionLevel,
    region: LgdRegion | null,
    area?: string,
  ) => {
    if (!region) {
      setPlace(null);
      return;
    }
    const { name, lat, lng } = region;
    setPlace({ source: "region", name, area, lat, lng });
    onLocate(lat, lng, ZOOM[level]);
  };

  const findIn = (list: RegionList, id: string) =>
    list.items.find((r) => String(r.id) === id) ?? null;

  const pickState = (id: string) => {
    const picked = findIn(states, id);
    setState(picked);
    setDistrict(null);
    setSubdistrict(null);
    placeAtRegion("state", picked);
  };

  // Clearing a district or sub-district goes back to the region above it
  const pickDistrict = (id: string) => {
    const picked = findIn(districts, id);
    setDistrict(picked);
    setSubdistrict(null);
    if (picked) placeAtRegion("district", picked, state?.name);
    else placeAtRegion("state", state);
  };

  const pickSubdistrict = (id: string) => {
    const picked = findIn(subdistricts, id);
    setSubdistrict(picked);
    if (picked) {
      placeAtRegion(
        "subdistrict",
        picked,
        [district?.name, state?.name].filter(Boolean).join(", "),
      );
    } else {
      placeAtRegion("district", district, state?.name);
    }
  };

  const clearRegions = () => {
    setState(null);
    setDistrict(null);
    setSubdistrict(null);
  };

  // The most specific region picked is outlined on the map; a site or a
  // searched place clears the regions, so has none
  const stateId = state?.id;
  const districtId = district?.id;
  const subdistrictId = subdistrict?.id;
  const [outline, setOutline] = useState<{
    key: string;
    geometry: RegionOutline;
  } | null>(null);
  // The region has no outline in the data, or it couldn't load
  const [outlineMissing, setOutlineMissing] = useState(false);
  useEffect(() => {
    setOutline(null);
    setOutlineMissing(false);
    if (stateId === undefined) return;
    const controller = new AbortController();
    const key = [stateId, districtId, subdistrictId].join("/");
    getOutline({ stateId, districtId, subdistrictId }, controller.signal)
      .then((geometry) => {
        if (geometry) setOutline({ key, geometry });
        else setOutlineMissing(true);
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.error("Error loading region outline", error);
        setOutlineMissing(true);
      });
    return () => controller.abort();
  }, [stateId, districtId, subdistrictId]);

  const pickSite = (siteId: string) => {
    const site = pickableSites.find((s) => s.id === siteId);
    if (!site) return;
    clearRegions();
    setPlace({ source: "site", name: site.name, lat: site.lat, lng: site.lng });
    onLocate(site.lat, site.lng, ZOOM.site);
  };

  const pickPlace = (p: PlaceSuggestion) => {
    clearRegions();
    setPlace({
      source: "place",
      name: p.name,
      area: p.area || undefined,
      lat: p.lat,
      lng: p.lng,
    });
    onLocate(p.lat, p.lng, ZOOM.site);
  };

  /** Clears a picked site or searched place (a region clears from its dropdowns). */
  const clearPlace = () => setPlace(null);

  // ── Date and prediction ──
  const [date, setDate] = useState(todayIso);
  const [run, setRun] = useState<RiskRun | null>(null);

  // Only a prediction for the current place and date is shown
  const current =
    run && place && run.place === place && run.date === date ? run : null;

  // How the place is predicted: a district or sub-district on its grid of
  // cells; a state not at all; a site, a searched place, or a region
  // without an outline at its one point
  const regionLevel: RegionLevel | null = subdistrict
    ? "subdistrict"
    : district
      ? "district"
      : state
        ? "state"
        : null;
  const mode: "grid" | "state" | "point" | null = !place
    ? null
    : place.source !== "region" || outlineMissing
      ? "point"
      : regionLevel === "state"
        ? "state"
        : "grid";

  const predictPoint = () => {
    if (diseaseState.status !== "ready" || !place || !date) return;
    const { disease } = diseaseState;
    const asked: RiskRun = { place, date, status: "loading" };
    setRun(asked);
    predictDiseaseRisk(disease.key, date, [
      { lat: place.lat, lon: place.lng, label: place.name },
    ])
      .then((res) => {
        const result = res.results[0];
        const probability = result?.probability;
        setRun((prev) =>
          prev !== asked
            ? prev
            : typeof probability === "number"
              ? {
                  ...asked,
                  status: "done",
                  outcome: {
                    probability,
                    atRisk: result.prediction === 1,
                    threshold: res.threshold,
                  },
                }
              : {
                  ...asked,
                  status: "error",
                  message: result?.error
                    ? `Couldn't get the weather for this place: ${result.error}`
                    : "The model returned no result for this place. Try again.",
                },
        );
      })
      .catch((err) => {
        setRun((prev) =>
          prev !== asked
            ? prev
            : { ...asked, status: "error", message: riskErrorMessage(err) },
        );
      });
  };

  // ── Region prediction, cell by cell ──
  const grid = useMemo(
    () => (mode === "grid" && outline ? gridCells(outline.geometry) : null),
    [mode, outline],
  );
  const gridKey = grid && outline ? `${outline.key}|${date}` : null;
  const keyPrefix = `${diseaseState.status === "ready" ? diseaseState.disease.key : ""}|${date}|`;

  // This session's cell answers by disease, date and cell, kept across
  // regions: cells shared by Hassan and Arkalgud are asked for once
  const [cellResults, setCellResults] = useState<Map<string, CellResult>>(
    () => new Map(),
  );
  // Cells whose prediction failed, shown as "No data" until asked again
  const [failedCells, setFailedCells] = useState<Set<string>>(() => new Set());
  const [gridRun, setGridRun] = useState<GridRun | null>(null);
  const gridRunAbort = useRef<AbortController | null>(null);
  const gridRunCount = useRef(0);

  // A new region or date stops the cells still being asked for the old one
  // (answers already back stay cached)
  useEffect(() => {
    setGridRun(null);
    return () => gridRunAbort.current?.abort();
  }, [gridKey]);

  const predictGrid = async () => {
    if (diseaseState.status !== "ready" || !grid || !gridKey) return;
    const { disease } = diseaseState;
    const keyOf = (cell: GridCell) => `${disease.key}|${date}|${cell.id}`;
    const todo = grid.filter((cell) => !cellResults.has(keyOf(cell)));
    if (todo.length === 0) return;

    gridRunAbort.current?.abort();
    const controller = new AbortController();
    gridRunAbort.current = controller;
    const id = ++gridRunCount.current;
    const update = (change: (run: GridRun) => GridRun) =>
      setGridRun((prev) => (prev?.id === id ? change(prev) : prev));
    setGridRun({ id, gridKey, total: todo.length, done: 0, running: true });
    const asked = new Set(todo.map(keyOf));
    setFailedCells((prev) => new Set([...prev].filter((k) => !asked.has(k))));
    const markFailed = (cells: GridCell[]) =>
      setFailedCells((prev) => new Set([...prev, ...cells.map(keyOf)]));

    const batches: GridCell[][] = [];
    for (let i = 0; i < todo.length; i += BATCH_SIZE) {
      batches.push(todo.slice(i, i + BATCH_SIZE));
    }
    let next = 0;
    // The API refused the request outright (e.g. a future date): the rest
    // would be refused too, so they aren't sent. A batch refused for its own
    // cells fails alone.
    let refused: string | undefined;
    const worker = async () => {
      while (next < batches.length && !refused) {
        const batch = batches[next++];
        try {
          const res = await predictBatch(
            disease.key,
            date,
            batch,
            controller.signal,
          );
          if (controller.signal.aborted) return;
          // Results come back in request order
          const answered = new Map<string, CellResult>();
          const noAnswer: GridCell[] = [];
          batch.forEach((cell, i) => {
            const r = res.results[i];
            if (typeof r?.probability === "number") {
              answered.set(keyOf(cell), {
                probability: r.probability,
                atRisk: r.prediction === 1,
              });
            } else {
              noAnswer.push(cell);
            }
          });
          setCellResults((prev) => new Map([...prev, ...answered]));
          if (noAnswer.length > 0) markFailed(noAnswer);
        } catch (err) {
          if (controller.signal.aborted) return;
          markFailed(batch);
          if (!isRetryable(err) && refusesEveryBatch(err)) {
            refused = riskErrorMessage(err);
          }
        }
        update((run) => ({ ...run, done: run.done + batch.length }));
      }
    };
    await Promise.all(
      Array.from({ length: Math.min(MAX_IN_FLIGHT, batches.length) }, worker),
    );
    if (controller.signal.aborted) return;
    if (refused) markFailed(batches.slice(next).flat());
    update((run) => ({ ...run, running: false, error: refused }));
  };

  const predict = () => {
    if (mode === "grid") void predictGrid();
    else if (mode === "point") predictPoint();
  };

  const cells = useMemo(
    () =>
      grid?.map((cell) => {
        const result = cellResults.get(keyPrefix + cell.id);
        const cellStatus: RiskStatus = result
          ? result.atRisk
            ? "risk"
            : "not_risk"
          : failedCells.has(keyPrefix + cell.id)
            ? "failed"
            : "pending";
        return {
          ...cell,
          status: cellStatus,
          probability: result?.probability,
        };
      }) ?? null,
    [grid, cellResults, failedCells, keyPrefix],
  );

  const regionRun = gridRun?.gridKey === gridKey ? gridRun : null;
  const regionGrid = cells
    ? (() => {
        const counts = { risk: 0, not_risk: 0, failed: 0, pending: 0 };
        let maxProbability: number | null = null;
        for (const cell of cells) {
          counts[cell.status as keyof typeof counts] += 1;
          if (cell.probability !== undefined) {
            maxProbability = Math.max(maxProbability ?? 0, cell.probability);
          }
        }
        const toAsk = counts.pending + counts.failed;
        return {
          cellKm: CELL_KM,
          total: cells.length,
          counts,
          maxProbability,
          /** Requests the next "Predict risk" makes (known cells are skipped). */
          requests: Math.ceil(toAsk / BATCH_SIZE),
          toAsk,
          running: regionRun?.running ?? false,
          progress: regionRun
            ? { done: regionRun.done, total: regionRun.total }
            : null,
          error: regionRun?.error ?? null,
        };
      })()
    : null;

  const status: RiskStatus | null = place
    ? current?.outcome
      ? current.outcome.atRisk
        ? "risk"
        : "not_risk"
      : "pending"
    : null;

  const mapPoint = useMemo(
    () =>
      mode === "point" && place && status
        ? {
            lat: place.lat,
            lng: place.lng,
            name: place.name,
            status,
            probability: current?.outcome?.probability,
          }
        : null,
    [mode, place, status, current?.outcome?.probability],
  );

  // The cells the map draws: a region's grid, or the one cell a site or a
  // searched place is predicted for. The same object until an answer
  // changes, so the map redraws the cells only then.
  const mapGrid = useMemo(() => {
    if (cells && gridKey) return { key: gridKey, cells };
    if (!mapPoint) return null;
    const { lat, lng, status: pointStatus, probability } = mapPoint;
    return {
      key: `point|${lat},${lng}`,
      cells: [
        {
          id: "point",
          lat,
          lng,
          bounds: cellAround(lat, lng),
          status: pointStatus,
          probability,
        },
      ],
    };
  }, [cells, gridKey, mapPoint]);

  // What the map draws for the Risk Map, for its legend
  const legendStatuses: RiskStatus[] = regionGrid
    ? (["risk", "not_risk", "failed", "pending"] as const).filter(
        (s) => regionGrid.counts[s] > 0,
      )
    : mapPoint
      ? [mapPoint.status]
      : [];

  return {
    diseaseState,
    retryDisease,
    regions: {
      states,
      districts,
      subdistricts,
      stateId: state ? String(state.id) : "",
      districtId: district ? String(district.id) : "",
      subdistrictId: subdistrict ? String(subdistrict.id) : "",
      pickState,
      pickDistrict,
      pickSubdistrict,
    },
    place,
    pickableSites,
    pickSite,
    pickPlace,
    clearPlace,
    date,
    setDate,
    maxDate: todayIso(),
    mode,
    predict,
    predicting:
      mode === "grid"
        ? (regionGrid?.running ?? false)
        : current?.status === "loading",
    outcome: current?.outcome ?? null,
    predictError:
      current?.status === "error" ? (current.message ?? null) : null,
    status,
    mapPoint,
    outline,
    /** District / sub-district prediction: counts, progress, summary. */
    regionGrid,
    /** The cells to draw, with their status. */
    mapGrid,
    legendStatuses,
  };
}

export type RiskPrediction = ReturnType<typeof useRiskPrediction>;
export type RiskMapPoint = NonNullable<RiskPrediction["mapPoint"]>;
export type RiskOutline = NonNullable<RiskPrediction["outline"]>;
export type RiskMapGrid = NonNullable<RiskPrediction["mapGrid"]>;
