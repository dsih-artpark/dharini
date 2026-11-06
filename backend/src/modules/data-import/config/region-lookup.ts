import { In, Repository } from 'typeorm';
import { Region } from 'src/entities/region.entity';
import { RegionType } from 'src/common/enums/region.enum';

// State and district cells are free text, so names match ignoring case and
// repeated spaces ("tamil  nadu" = "Tamil Nadu"). Compared in code rather than
// with ILike, which would treat a "%" or "_" typed in a cell as a wildcard.
export function normalizeRegionName(name: unknown): string {
  return typeof name === 'string'
    ? name.trim().replace(/\s+/g, ' ').toLowerCase()
    : '';
}

export interface RegionLookup {
  findState(name: unknown): Region | undefined;
  // Searched within one state only: district names repeat across states
  // (e.g. Aurangabad in Bihar and in Maharashtra).
  findDistrict(stateId: string, name: unknown): Region | undefined;
}

/**
 * Loads the states named in an upload, and their districts, from the
 * country-wide master list (`regions`, seeded from regions.sql) in two
 * queries per file. Validation and persistence both resolve rows through
 * this, so a row that passes validation saves against the same district.
 */
export async function loadRegionLookup(
  regionRepository: Repository<Region>,
  stateNames: unknown[],
): Promise<RegionLookup> {
  const wantedStates = new Set(
    stateNames.map(normalizeRegionName).filter(Boolean),
  );

  const statesByName = new Map<string, Region>();
  if (wantedStates.size > 0) {
    const allStates = await regionRepository.find({
      where: { regionType: RegionType.STATE },
    });
    for (const state of allStates) {
      const key = normalizeRegionName(state.name);
      if (wantedStates.has(key) && !statesByName.has(key)) {
        statesByName.set(key, state);
      }
    }
  }

  const districtsByKey = new Map<string, Region>();
  const stateIds = [...statesByName.values()].map((state) => state.id);
  if (stateIds.length > 0) {
    const districts = await regionRepository.find({
      where: {
        regionType: RegionType.DISTRICT,
        parentRegion: { id: In(stateIds) },
      },
      relations: { parentRegion: true },
    });
    for (const district of districts) {
      const parentId = district.parentRegion?.id;
      if (!parentId) continue;
      const key = districtKey(parentId, district.name);
      if (!districtsByKey.has(key)) districtsByKey.set(key, district);
    }
  }

  return {
    findState: (name) => statesByName.get(normalizeRegionName(name)),
    findDistrict: (stateId, name) =>
      districtsByKey.get(districtKey(stateId, name)),
  };
}

function districtKey(stateId: string, name: unknown): string {
  return `${stateId}::${normalizeRegionName(name)}`;
}
