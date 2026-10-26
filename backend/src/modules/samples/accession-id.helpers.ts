/**
 * Builds the non-sequential leading portion of an accession ID, i.e. everything
 * before the running number: `{head}/{YY}-{MM}/`.
 *
 * The head has two forms, distinguished by whether the sample type's
 * abbreviation contains a slash:
 *
 * - **Slash form** (`'NA/EN'`, `'NM/FE'`) — the abbreviation already carries
 *   both segments and the species segment is skipped entirely. Environmental
 *   samples have no animal, so their first segment is a placeholder rather than
 *   a real species: `NA` (Not Applicable) for environmental generally, `NM`
 *   (Not Mentioned) for Fecal.
 * - **Plain form** (`'CL'`) — combined with the species abbreviation as
 *   `{species}/{sampleType}`, the original behaviour for clinical samples.
 *
 * Either segment falls back to `UK` when its abbreviation is missing.
 */
export function buildAccessionPrefix(
  speciesAbbreviation: string | null | undefined,
  sampleTypeAbbreviation: string | null | undefined,
  now: Date,
): string {
  const head = sampleTypeAbbreviation?.includes('/')
    ? sampleTypeAbbreviation
    : `${speciesAbbreviation || 'UK'}/${sampleTypeAbbreviation || 'UK'}`;

  const yy = now.getFullYear().toString().slice(-2);
  const mm = (now.getMonth() + 1).toString().padStart(2, '0');

  return `${head}/${yy}-${mm}/`;
}

/** First number in a monthly series. */
export const ACCESSION_SEQUENCE_START = 100001;

/**
 * Derives the next running number from the highest existing accession ID
 * sharing a prefix, or starts a new series when there is none.
 */
export function nextAccessionSequence(
  lastAccessionId: string | null | undefined,
): number {
  if (!lastAccessionId) return ACCESSION_SEQUENCE_START;

  const parts = lastAccessionId.split('/');
  const lastSeq = parseInt(parts[parts.length - 1], 10);

  return isNaN(lastSeq) ? ACCESSION_SEQUENCE_START : lastSeq + 1;
}
