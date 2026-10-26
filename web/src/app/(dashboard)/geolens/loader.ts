import apiClient from "@/src/libs/apiClient";
import { fetchEbirdObservations, fetchWeather } from "./utils/api";
import type { WeatherData } from "./utils/api";
import type {
  BirdObservation,
  CattleMarket,
  CustomGeoJson,
  Disease,
  PoultryFarm,
  Site,
  ViewportBounds,
  Wetland,
} from "./types";

export type { WeatherData };

// Routed through apiClient (not a bare fetch) so every /geolens/* call
// carries the Bearer token — the backend now requires auth and scopes
// results (e.g. getSites()) to the caller's reachable projects. Keeps the
// same "swallow errors -> { success: false }" shape the callers below
// already expect, rather than letting axios throw.
const fetchJson = (url: string) =>
  apiClient
    .get(url)
    .then((r) => r.data)
    .catch(() => ({ success: false }));

export async function getInitialDashboardData(): Promise<{
  states: string[];
  sites: Site[];
  diseases: Disease[];
  indiaGeoJson: CustomGeoJson | null;
}> {
  const [statesRes, sitesRes, diseasesRes, indiaGeoJson] = await Promise.all([
    fetchJson(`/geolens/wetlands/states`),
    fetchJson(`/geolens/sites`),
    fetchJson(`/geolens/diseases`),
    fetch("/maps/india.geojson")
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null),
  ]);

  const states = statesRes && statesRes.success ? statesRes.data : [];
  return {
    states: states.map((s: string) => s.trim().toUpperCase()).sort(),
    sites:
      sitesRes && sitesRes.success
        ? sitesRes.data
        : Array.isArray(sitesRes)
          ? sitesRes
          : [],
    diseases:
      diseasesRes && diseasesRes.success
        ? diseasesRes.data
        : Array.isArray(diseasesRes)
          ? diseasesRes
          : [],
    indiaGeoJson,
  };
}

export async function getStateDashboardData(
  selectedState: string,
): Promise<{ wetlands: Wetland[]; poultry: PoultryFarm[] }> {
  const [wetlandsRes, poultryRes] = await Promise.all([
    fetchJson(
      `/geolens/wetlands/csv?state=${encodeURIComponent(selectedState)}`,
    ),
    fetchJson(
      `/geolens/poultry-farms?state=${encodeURIComponent(selectedState)}`,
    ),
  ]);

  const wetlandsData =
    wetlandsRes && wetlandsRes.success ? wetlandsRes.data : [];
  const poultryData = poultryRes && poultryRes.success ? poultryRes.data : [];

  const wetlands = parseWetlands(wetlandsData);

  const poultry: PoultryFarm[] = poultryData.map(
    (r: Record<string, unknown>, i: number) => {
      const state = String(r["state"] || selectedState)
        .trim()
        .toUpperCase();
      const district = r["city"]
        ? String(r["city"]).trim().toUpperCase()
        : state;
      const nameStr = r["name"] ? String(r["name"]).trim() : "";
      const name =
        nameStr !== "" && nameStr.toLowerCase() !== "unknown"
          ? nameStr
          : `Farm (${district})`;
      return {
        id: r["id"] ? String(r["id"]) : `p_${state}_${i}`,
        state,
        district,
        name,
        lat: parseFloat(String(r["lat"])) || 0,
        lng: parseFloat(String(r["lng"])) || 0,
      };
    },
  );

  return { wetlands, poultry };
}

function parseWetlands(rows: Record<string, unknown>[]): Wetland[] {
  return rows
    .filter((r: Record<string, unknown>) => r && r["State"])
    .map((r: Record<string, unknown>, i: number) => {
      const state = String(r["State"]).trim().toUpperCase();
      const district = r["District"]
        ? String(r["District"]).trim().toUpperCase()
        : state;
      const nameStr = r["Wetland Name"] ? String(r["Wetland Name"]).trim() : "";
      const name =
        nameStr !== "" && nameStr.toLowerCase() !== "unknown"
          ? nameStr
          : `Wetland (${district})`;
      const srNo = r["Sr. No."] ? String(r["Sr. No."]).trim() : "";
      const lat = parseFloat(String(r["Central Latitude (DD)"])) || 0;
      const lng = parseFloat(String(r["Central Longitude (DD)"])) || 0;

      return {
        id: srNo ? `w_${srNo}` : `w_${state}_${district}_${lat}_${lng}_${i}`,
        state,
        district,
        name,
        lat,
        lng,
        areaHa: parseFloat(String(r["Wetland Area (Ha)"])) || 0,
      };
    });
}

export async function getAllWetlands(): Promise<Wetland[]> {
  const res = await fetchJson(`/geolens/wetlands/csv`);
  const data = res && res.success ? res.data : [];
  return parseWetlands(data);
}

export async function getWaterBoundaries(
  queryParams: string,
): Promise<CustomGeoJson | null> {
  const res = await fetchJson(
    `/geolens/water-boundaries/simplified${queryParams}`,
  );
  return res && res.success ? res.data : null;
}

export async function getBirdObservations(
  lat: number,
  lng: number,
  radius: number,
  back = 30,
): Promise<BirdObservation[]> {
  const data = await fetchEbirdObservations(lat, lng, radius, back);
  return Array.isArray(data) ? (data as BirdObservation[]) : [];
}

export function getBufferBounds(
  lat: number,
  lng: number,
  radiusKm: number,
): ViewportBounds {
  const deltaLat = radiusKm / 111;
  const deltaLng = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));
  return {
    minLat: lat - deltaLat,
    maxLat: lat + deltaLat,
    minLng: lng - deltaLng,
    maxLng: lng + deltaLng,
  };
}

export async function getWeatherData(
  lat: number,
  lng: number,
): Promise<WeatherData | null> {
  return fetchWeather(lat, lng);
}

/**
 * Fetch ALL cattle markets from the backend (no state filter).
 * Used when the Cattle markets layer is toggled on.
 */
export async function getAllCattleMarkets(): Promise<CattleMarket[]> {
  const res = await fetchJson(`/geolens/cattle-markets`);
  const data = res && res.success ? res.data : [];
  return data.map((r: Record<string, unknown>, i: number) => {
    const state = r["state"] ? String(r["state"]).trim().toUpperCase() : "";
    const district = r["district"]
      ? String(r["district"]).trim().toUpperCase()
      : state;
    const nameStr = r["name"] ? String(r["name"]).trim() : "";
    const name =
      nameStr !== "" && nameStr.toLowerCase() !== "unknown"
        ? nameStr
        : `Cattle Market (${district})`;
    const day = r["operatingDay"] ? String(r["operatingDay"]).trim() : "";
    return {
      id: r["id"] ? String(r["id"]) : `cm_ALL_${i}`,
      state,
      district,
      name,
      lat: parseFloat(String(r["lat"])) || 0,
      lng: parseFloat(String(r["lng"])) || 0,
      operatingDay: day !== "" ? day : null,
    };
  });
}

/**
 * Fetch ALL poultry farms from the backend (no state filter).
 * Used when the Poultry farms layer is toggled on.
 */
export async function getAllPoultryFarms(): Promise<PoultryFarm[]> {
  const res = await fetchJson(`/geolens/poultry-farms`);
  const data = res && res.success ? res.data : [];
  return data.map((r: Record<string, unknown>, i: number) => {
    const state = r["state"] ? String(r["state"]).trim().toUpperCase() : "";
    const city = r["city"] ? String(r["city"]).trim().toUpperCase() : state;
    const nameStr = r["name"] ? String(r["name"]).trim() : "";
    const name =
      nameStr !== "" && nameStr.toLowerCase() !== "unknown"
        ? nameStr
        : `Farm (${city})`;
    return {
      id: r["id"] ? String(r["id"]) : `p_ALL_${i}`,
      state,
      district: city,
      name,
      lat: parseFloat(String(r["lat"])) || 0,
      lng: parseFloat(String(r["lng"])) || 0,
    };
  });
}
