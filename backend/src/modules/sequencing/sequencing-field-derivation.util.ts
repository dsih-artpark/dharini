/**
 * Derives submission metadata that the sequencing form used to collect
 * explicitly (fileFormat, platform) but that the selected pipeline now
 * determines. Kept pure and separate from SequencingJobsService so the
 * extension-matching rules can be unit tested without standing up the
 * whole submit flow.
 */

const FASTA_EXTENSIONS = new Set(['fasta', 'fa', 'fna']);
const FASTQ_EXTENSIONS = new Set(['fastq', 'fq']);

export type DerivedFileFormat = 'FASTA' | 'FASTQ' | null;

/** Strips a trailing `.gz` (case-insensitive) so `sample.fastq.gz` inspects as `sample.fastq`. */
function stripGzSuffix(value: string): string {
  return value.replace(/\.gz$/i, '');
}

/** Lowercased trailing `.ext` group, e.g. `fasta.gz` -> `gz`... handled via stripGzSuffix first. */
function trailingExtension(value: string): string | null {
  const match = /\.([A-Za-z0-9]+)$/.exec(stripGzSuffix(value.trim()));
  return match ? match[1].toLowerCase() : null;
}

function formatForExtension(ext: string | null): DerivedFileFormat {
  if (!ext) return null;
  if (FASTA_EXTENSIONS.has(ext)) return 'FASTA';
  if (FASTQ_EXTENSIONS.has(ext)) return 'FASTQ';
  return null;
}

/**
 * Derives FASTA/FASTQ from the uploaded filename's extension (a trailing
 * `.gz` is tolerated on either). When there is no filename to inspect,
 * falls back to the selected pipeline's own `acceptedExtensions`: if every
 * accepted extension implies the same format, that format is used. A
 * filename with an extension we don't recognise, or a pipeline whose
 * accepted extensions mix (or lack) formats, is genuinely undeterminable —
 * this returns null rather than guess.
 */
export function deriveFileFormat(
  filename: string | null | undefined,
  acceptedExtensions: string[] = [],
): DerivedFileFormat {
  if (filename && filename.trim()) {
    return formatForExtension(trailingExtension(filename));
  }

  const formats = new Set(
    acceptedExtensions
      .map((ext) => formatForExtension(trailingExtension(ext)))
      .filter((f): f is 'FASTA' | 'FASTQ' => f !== null),
  );
  return formats.size === 1 ? [...formats][0] : null;
}
