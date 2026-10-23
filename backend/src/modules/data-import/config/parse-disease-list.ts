/**
 * Parses a disease cell that may name more than one disease (e.g. "FMD" or
 * "FMD & LSD") into a deduplicated, trimmed list — a single physical sample
 * can be relevant to more than one disease under FMD/LSD surveillance.
 * Uses "&" rather than "," as the multi-value separator because Excel/Numbers
 * list-validation formulae are themselves comma-delimited, so a "," inside
 * one list option (e.g. "FMD,LSD") gets misread as two separate options.
 */
export function parseDiseaseList(raw?: string): string[] {
  if (!raw) return [];
  const seen = new Set<string>();
  for (const part of raw.split(/[&,]/)) {
    const value = part.trim();
    if (value) seen.add(value);
  }
  return [...seen];
}
