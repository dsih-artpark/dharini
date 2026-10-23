/**
 * Site category ("siteCategory" in the CSV, `farmType` in the DB) options per
 * disease, ported from mobile/lib/utils/disease_site_config.dart so the web
 * import uses the exact same vocabulary as the mobile app.
 *
 * Habitat (environmental sample matrix) is a separate, disease-agnostic list:
 * the sample CSVs show habitat describing the surrounding environment a
 * sample was actually drawn from, which is often NOT the same as the site's
 * own siteCategory (e.g. siteCategory="Cattle Farm" -> habitat="Wetland" for
 * an environmental sample taken near that farm). No habitat enum exists
 * anywhere else in the app, so this list is inferred from the example CSVs.
 */
export const SITE_CATEGORY_OPTIONS: Record<'AI' | 'FMD' | 'LSD', string[]> = {
  AI: [
    'Poultry Farm',
    'Wetland',
    'Slaughter House',
    'Zoo',
    'Sewage',
    'Live Bird Market',
    'Rescue Center',
    'Wildlife Sanctuary',
  ],
  FMD: [
    'Cattle Farm',
    'Cattle Market',
    'Buffalo Farm',
    'Slaughter House',
    'BMCC',
  ],
  LSD: [
    'Cattle Farm',
    'Cattle Market',
    'Buffalo Farm',
    'Slaughter House',
    'BMCC',
  ],
};

export const SITE_SUB_TYPE_OPTIONS_BY_CATEGORY: Record<string, string[]> = {
  'Poultry Farm': ['Broiler', 'Breeder', 'Layer', 'Backyard'],
};

// Shared across all diseases — describes the environmental matrix an
// Environmental-category sample was drawn from, independent of the site's
// own siteCategory.
export const HABITAT_OPTIONS: string[] = [
  'Wetland',
  'Water Body',
  'Live Bird Market',
  'Slaughter House',
  'Sewage',
  'Zoo',
  'Rescue Center',
  'Wildlife Sanctuary',
  'Farm Surroundings',
  'Other',
];

export function getSiteCategoryOptions(diseaseShortName: string): string[] {
  return SITE_CATEGORY_OPTIONS[diseaseShortName as 'AI' | 'FMD' | 'LSD'] ?? [];
}

export function getHabitatOptions(): string[] {
  return HABITAT_OPTIONS;
}
