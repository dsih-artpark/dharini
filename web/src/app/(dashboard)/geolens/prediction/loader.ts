import { isAxiosError } from "axios";
import apiClient from "@/src/libs/apiClient";

// ── Bird forecasts ───────────────────────────────────────────────────────
// Dharini's backend relays /ml/* to the dharini-ml service (/api/v1/* there,
// documented at https://ml.dharini.artpark.ai/docs) and adds its API key.

export interface BirdModelInfo {
  model_version: string | null;
  ebird_release: string | null;
  n_species: number;
  trained_at: string | null;
  /** eBird's terms require this wherever the predictions are shown. */
  citation: string;
  notes: string;
}

/** Resolves when this server has ML predictions turned on; 404 when not. */
export async function getMlStatus(): Promise<void> {
  await apiClient.get("/ml/status");
}

export async function getBirdModelInfo(): Promise<BirdModelInfo> {
  const { data } = await apiClient.get<BirdModelInfo>("/ml/birds/about");
  return data;
}

/** A modelled species. */
export interface BirdSpecies {
  key: string;
  /** eBird common name */
  name: string;
  /** Species group, e.g. "Waterfowl" */
  guild: string;
}

/** Every modelled species: the names and groups of the keys the place
 *  endpoints use. */
export async function getBirdSpecies(): Promise<BirdSpecies[]> {
  const { data } = await apiClient.get<BirdSpecies[]>("/ml/birds/species");
  return data;
}

// ── Place forecasts (POST /ml/birds/place/*) ─────────────────────────────

/** The chance of each species at each sample point, for the weeks asked
 *  for (up to 13; Compare asks for one at a time). */
export interface PlaceAllSpecies {
  /** Species keys: the species axis of each week's `presence_pct`. */
  species: string[];
  /** Distance between neighbouring cells, km (never below 2). */
  spacing_km: number;
  /** [lat, lon] of each cell centre: the cell axis of `presence_pct`. */
  cells: [number, number][];
  weeks: {
    week: number;
    /** Base64 of one byte per cell and species (0-100, percent), cell by cell. */
    presence_pct: string;
  }[];
}

/** `place/all-species` for a circle around a point, given as centre +
 *  radius (the service samples its own grid for it, unlike a boundary). */
export async function getPlaceAllSpeciesAround(
  lat: number,
  lng: number,
  radiusKm: number,
  weeks: number[],
  signal?: AbortSignal,
): Promise<PlaceAllSpecies> {
  const { data } = await apiClient.post<PlaceAllSpecies>(
    "/ml/birds/place/all-species",
    { center: { lat, lon: lng }, radius_km: radiusKm, weeks },
    { signal },
  );
  return data;
}

/** `place/summary`: every species around a place, all 52 weeks (the fields
 *  Compare's species card uses). */
export interface PlaceSummary {
  /** The 52 weeks, week 1 first, with their dates, e.g. "12 Nov". */
  weeks: { week: number; start: string; end: string }[];
  species: PlaceSummarySpecies[];
}

export interface PlaceSummarySpecies {
  key: string;
  /** 52 values, week 1 first: the chance it's in the area that week, at the
   *  better spots (90th percentile of the sample points), 0-1. */
  presence: number[];
  /** Like `presence`: the chance one standard walk (1 hour, 1 km, 07:00)
   *  records it. */
  visit: number[];
  /** Week of the highest `presence`, 1-52, and that value. */
  peak_week: number;
  peak: number;
  /** First and last week of its season here; null when it's present all
   *  year, or when `peak` is below 5%. */
  arrival_week: number | null;
  departure_week: number | null;
}

/** `place/summary` for a circle around a point, given as centre + radius. */
export async function getPlaceSummaryAround(
  lat: number,
  lng: number,
  radiusKm: number,
  signal?: AbortSignal,
): Promise<PlaceSummary> {
  const { data } = await apiClient.post<PlaceSummary>(
    "/ml/birds/place/summary",
    { center: { lat, lon: lng }, radius_km: radiusKm },
    { signal },
  );
  return data;
}

export async function getPlaceAllSpecies(
  boundary: PlaceBoundary,
  weeks: number[],
  signal?: AbortSignal,
): Promise<PlaceAllSpecies> {
  const { data } = await apiClient.post<PlaceAllSpecies>(
    "/ml/birds/place/all-species",
    { boundary, weeks },
    { signal },
  );
  return data;
}

// ── Boundaries ───────────────────────────────────────────────────────────

/** GeoJSON-style boundary the place endpoints accept; positions are [lon, lat]. */
export interface PlaceBoundary {
  type: "Polygon" | "MultiPolygon";
  coordinates: number[][][] | number[][][][];
}

/** A circle as a closed GeoJSON ring of [lon, lat] positions. */
function circleRing(
  lat: number,
  lng: number,
  radiusKm: number,
  points = 36,
): number[][] {
  const dLat = radiusKm / 110.574;
  const dLng = radiusKm / (111.32 * Math.cos((lat * Math.PI) / 180));
  const ring = Array.from({ length: points }, (_, i) => {
    const angle = (2 * Math.PI * i) / points;
    return [
      +(lng + dLng * Math.cos(angle)).toFixed(5),
      +(lat + dLat * Math.sin(angle)).toFixed(5),
    ];
  });
  ring.push(ring[0]);
  return ring;
}

/**
 * One boundary covering a circle around each centre, so a single
 * `place/all-species` call samples one consistent grid across every site.
 * (Overlapping polygons would cancel out under the even-odd rule, so
 * overlapping circles are merged into their bounding circle instead.)
 */
/** The circles to ask about for these centres: one each, or a single
 *  circle covering both when two of them overlap. */
export function forecastCircles(
  centres: { lat: number; lng: number }[],
  radiusKm: number,
): { lat: number; lng: number; radiusKm: number }[] {
  const circles = centres.map((c) => ({ ...c, radiusKm }));
  if (circles.length === 2) {
    const [a, b] = circles;
    const dKm = Math.hypot(
      (a.lat - b.lat) * 110.574,
      (a.lng - b.lng) * 111.32 * Math.cos((a.lat * Math.PI) / 180),
    );
    if (dKm < 2 * radiusKm) {
      return [
        {
          lat: (a.lat + b.lat) / 2,
          lng: (a.lng + b.lng) / 2,
          radiusKm: dKm / 2 + radiusKm,
        },
      ];
    }
  }
  return circles;
}

export function circlesBoundary(
  centres: { lat: number; lng: number }[],
  radiusKm: number,
): PlaceBoundary {
  const circles = forecastCircles(centres, radiusKm);
  const rings = circles.map((c) => [circleRing(c.lat, c.lng, c.radiusKm)]);
  return circles.length === 1
    ? { type: "Polygon", coordinates: rings[0] }
    : { type: "MultiPolygon", coordinates: rings };
}

// ── Disease risk (/ml/diseases/*) ────────────────────────────────────────

/** A livestock disease model on the ML service (LSD today). */
export interface DiseaseInfo {
  /** Id used in URLs, e.g. "lsd". */
  key: string;
  code: string;
  name: string;
  /** Animals the disease affects. */
  hosts: string[];
  /** Probability at or above which a location is a risk zone (0-1). */
  threshold: number;
  /** The weather the model reads. */
  inputs: { source: string; window_days: number; variables: string[] };
}

export interface RiskLocation {
  lat: number;
  /** Longitude: the ML service calls it `lon`. */
  lon: number;
  /** Echoed back in the result. */
  label?: string;
}

export interface RiskResult {
  lat: number;
  lon: number;
  label?: string | null;
  /** Model probability of the disease here, 0-1; null when `error` is set. */
  probability?: number | null;
  /** 1 = risk zone (probability >= threshold), 0 = not. */
  prediction?: 0 | 1 | null;
  /** Set instead of a probability when this location's weather couldn't be fetched. */
  error?: string | null;
}

export interface RiskResponse {
  disease: string;
  date: string;
  threshold: number;
  /** One per requested location, in request order. */
  results: RiskResult[];
}

export async function getDiseases(): Promise<DiseaseInfo[]> {
  const { data } = await apiClient.get<DiseaseInfo[]>("/ml/diseases");
  return data;
}

/** Risk at 1-50 locations on `date` (YYYY-MM-DD, today or earlier), from the
 *  weather of the days before it. Can take up to 45 s. */
export async function predictDiseaseRisk(
  disease: string,
  date: string,
  locations: RiskLocation[],
  signal?: AbortSignal,
): Promise<RiskResponse> {
  const { data } = await apiClient.post<RiskResponse>(
    `/ml/diseases/${encodeURIComponent(disease)}/predict`,
    { date, locations },
    { signal },
  );
  return data;
}

/** What to tell the user when a disease risk call fails. */
export function riskErrorMessage(err: unknown): string {
  if (!isAxiosError(err)) return "Couldn't predict the risk. Try again.";
  switch (err.response?.status) {
    case 404:
      return "Disease risk isn't turned on for this server.";
    case 422: {
      // The ML service names the field it rejected, e.g. a future date
      const detail = err.response.data?.detail;
      const msg = Array.isArray(detail) ? detail[0]?.msg : undefined;
      return typeof msg === "string"
        ? msg.replace(/^Value error, /, "")
        : "The risk model can't use this location or date.";
    }
    case 429:
      return "Too many risk requests. Wait a minute and try again.";
    case 503:
      return "The risk service is busy or unavailable. Try again in a moment.";
    default:
      return "Couldn't predict the risk. Try again.";
  }
}

/** What to tell the user when an /ml call fails. */
export function mlErrorMessage(err: unknown): string {
  switch (isAxiosError(err) ? err.response?.status : undefined) {
    case 404:
      return "Bird forecasts aren't turned on for this server.";
    case 422:
      return "The forecast model doesn't cover this location.";
    case 429:
      return "Too many forecast requests. Wait a minute and try again.";
    case 503:
      return "The forecast service is busy or unavailable. Try again in a moment.";
    default:
      return "Couldn't load the forecast. Try again.";
  }
}
