/**
 * Picks the GenBank "source" details Dharini keeps from an NCBI nuccore
 * esummary record. esummary sends them as two `|`-separated lists matched by
 * position, e.g.
 *
 *   subtype: "isolate|host|country|isolation_source|collection_date"
 *   subname: "NCL-BAIF-LSDV067|Cattle breed HFX|India: Padhegaon, Ahmednagar|Skin Scab|16-Aug-2023"
 *
 * Every field is optional: records vary (strain instead of isolate, no
 * collection date, and so on). Kept pure so the rules can be unit tested
 * without the NCBI call.
 */

export interface NcbiSourceFields {
  isolate: string | null;
  strain: string | null;
  host: string | null;
  /** GenBank /geo_loc_name. esummary labels it "country". */
  geoLocName: string | null;
  /** YYYY-MM-DD, only when NCBI gives a full day; otherwise null. */
  collectionDate: string | null;
}

const NO_SOURCE_FIELDS: NcbiSourceFields = {
  isolate: null,
  strain: null,
  host: null,
  geoLocName: null,
  collectionDate: null,
};

export function parseNcbiSourceFields(
  subtype?: string | null,
  subname?: string | null,
): NcbiSourceFields {
  const names = (subtype ?? '').split('|');
  const values = (subname ?? '').split('|');
  // Unequal lists mean a value contained '|', so every later pair would be
  // misaligned. Saving nothing is safer than saving values in the wrong field.
  if (names.length !== values.length) return { ...NO_SOURCE_FIELDS };

  const pairs = new Map<string, string>();
  names.forEach((name, i) => {
    const key = name.trim();
    const value = values[i].trim();
    if (key && value && !pairs.has(key)) pairs.set(key, value);
  });

  return {
    isolate: pairs.get('isolate') ?? null,
    strain: pairs.get('strain') ?? null,
    host: pairs.get('host') ?? null,
    geoLocName: pairs.get('geo_loc_name') ?? pairs.get('country') ?? null,
    collectionDate: toFullCollectionDate(pairs.get('collection_date')),
  };
}

const MONTHS: Record<string, number> = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};

/**
 * NCBI collection_date as YYYY-MM-DD, or null unless it names a full, real
 * day. Accepts DD-Mon-YYYY (16-Aug-2023) and YYYY-MM-DD; partial dates
 * (Aug-2023, 2023), ranges (2021/2022) and anything else give null.
 */
export function toFullCollectionDate(value?: string | null): string | null {
  const text = value?.trim();
  if (!text) return null;

  let year: number;
  let month: number | undefined;
  let day: number;
  const dayMonYear = /^(\d{2})-([A-Za-z]{3})-(\d{4})$/.exec(text);
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (dayMonYear) {
    day = Number(dayMonYear[1]);
    month = MONTHS[dayMonYear[2].toLowerCase()];
    year = Number(dayMonYear[3]);
  } else if (iso) {
    year = Number(iso[1]);
    month = Number(iso[2]);
    day = Number(iso[3]);
  } else {
    return null;
  }
  if (!month) return null;

  // Rejects impossible days such as 31-Feb-2023.
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${year}-${pad(month)}-${pad(day)}`;
}
