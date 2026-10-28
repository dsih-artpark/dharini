import type { MultiPolygon, Polygon } from "geojson";

/**
 * India's states, districts and sub-districts from the Local Government
 * Directory (LGD), as published by bharatlas (LGD_Subdistricts layer, CC0).
 * A saved copy in public/data, made once from that Parquet file with GDAL:
 *
 * - Ids are LGD codes. Sub-districts without a code are left out of the
 *   lists; rows split over one code are merged.
 * - District and state outlines are their sub-districts merged.
 * - Each region has a point inside it (lat/lng), which the Risk Map
 *   predicts at.
 * - Outlines are simplified to about 200 m (states: 500 m).
 *
 * Files: india-states.json ([region]), india-districts.json
 * ({stateId: [region]}), india-subdistricts.json ({districtId: [region]}) and
 * boundaries/<stateId>.json ({state, districts: {districtId: outline},
 * subdistricts: {districtId: {subdistrictId: outline}}}). Sub-district
 * outlines are keyed by district too: a few sub-districts lie partly in two
 * districts. The data predates some newer districts, which are missing.
 */

export type RegionLevel = "state" | "district" | "subdistrict";

export interface LgdRegion {
  /** LGD code. */
  id: number;
  name: string;
  lat: number;
  lng: number;
}

export type RegionOutline = Polygon | MultiPolygon;

interface StateOutlines {
  state: RegionOutline | null;
  districts: Record<string, RegionOutline>;
  subdistricts: Record<string, Record<string, RegionOutline>>;
}

const CHILDREN_URL = {
  district: "/data/india-districts.json",
  subdistrict: "/data/india-subdistricts.json",
};

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`${url} responded ${res.status}`);
  return res.json();
}

/** India's states and union territories. */
export function getStates(signal?: AbortSignal): Promise<LgdRegion[]> {
  return getJson("/data/india-states.json", signal);
}

/** The districts of a state, or the sub-districts of a district. */
export async function getChildren(
  parentId: number,
  level: Exclude<RegionLevel, "state">,
  signal?: AbortSignal,
): Promise<LgdRegion[]> {
  const byParent = await getJson<Record<string, LgdRegion[]>>(
    CHILDREN_URL[level],
    signal,
  );
  return byParent[parentId] ?? [];
}

/** One region's outline, or null when the data has none for it. */
export async function getOutline(
  ids: { stateId: number; districtId?: number; subdistrictId?: number },
  signal?: AbortSignal,
): Promise<RegionOutline | null> {
  const { stateId, districtId, subdistrictId } = ids;
  const file = await getJson<StateOutlines>(
    `/data/boundaries/${stateId}.json`,
    signal,
  );
  if (districtId === undefined) return file.state;
  if (subdistrictId === undefined) return file.districts[districtId] ?? null;
  return file.subdistricts[districtId]?.[subdistrictId] ?? null;
}
