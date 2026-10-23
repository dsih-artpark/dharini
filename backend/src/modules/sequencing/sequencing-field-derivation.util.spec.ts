import { deriveFileFormat } from './sequencing-field-derivation.util';

describe('deriveFileFormat', () => {
  it.each([
    ['reads.fasta', 'FASTA'],
    ['reads.fa', 'FASTA'],
    ['reads.fna', 'FASTA'],
    ['reads.fastq', 'FASTQ'],
    ['reads.fq', 'FASTQ'],
  ])('maps %s -> %s from the filename extension', (filename, expected) => {
    expect(deriveFileFormat(filename, [])).toBe(expected);
  });

  it.each([
    ['reads.fasta.gz', 'FASTA'],
    ['reads.fa.gz', 'FASTA'],
    ['reads.fastq.gz', 'FASTQ'],
    ['reads.fq.gz', 'FASTQ'],
    ['reads.FASTQ.GZ', 'FASTQ'],
  ])('tolerates a trailing .gz: %s -> %s', (filename, expected) => {
    expect(deriveFileFormat(filename, [])).toBe(expected);
  });

  it('returns null for an unrecognised extension, even with a filename present', () => {
    expect(deriveFileFormat('reads.bam', ['.fastq', '.fq'])).toBeNull();
  });

  it('returns null for a filename with no extension at all', () => {
    expect(deriveFileFormat('reads', ['.fastq'])).toBeNull();
  });

  it('falls back to the pipeline accepted extensions when there is no filename', () => {
    expect(
      deriveFileFormat(undefined, ['.fastq', '.fq', '.fastq.gz', '.fq.gz']),
    ).toBe('FASTQ');
    expect(
      deriveFileFormat(null, ['.fasta', '.fa', '.fna', '.fasta.gz', '.fa.gz']),
    ).toBe('FASTA');
    expect(deriveFileFormat('', ['.fasta'])).toBe('FASTA');
  });

  it('returns null when accepted extensions mix formats and there is no filename to disambiguate', () => {
    expect(deriveFileFormat(undefined, ['.fasta', '.fastq'])).toBeNull();
  });

  it('returns null when there is neither a filename nor any accepted extensions', () => {
    expect(deriveFileFormat(undefined, [])).toBeNull();
    expect(deriveFileFormat(undefined)).toBeNull();
  });
});
