import {
  ACCESSION_SEQUENCE_START,
  buildAccessionPrefix,
  nextAccessionSequence,
} from './accession-id.helpers';

describe('buildAccessionPrefix', () => {
  const july2026 = new Date(2026, 6, 15);

  describe('slash form (environmental)', () => {
    it('uses the abbreviation as both segments and ignores the species', () => {
      expect(buildAccessionPrefix('CH', 'NA/EN', july2026)).toBe(
        'NA/EN/26-07/',
      );
    });

    it('gives Fecal its own prefix, separate from other environmental types', () => {
      expect(buildAccessionPrefix(null, 'NA/EN', july2026)).toBe(
        'NA/EN/26-07/',
      );
      expect(buildAccessionPrefix(null, 'NM/FE', july2026)).toBe(
        'NM/FE/26-07/',
      );
    });

    it('does not fall back to UK when the species is missing', () => {
      expect(buildAccessionPrefix(null, 'NA/EN', july2026)).not.toContain('UK');
    });
  });

  describe('plain form (clinical)', () => {
    it('combines species and sample type', () => {
      expect(buildAccessionPrefix('CH', 'CL', july2026)).toBe('CH/CL/26-07/');
    });

    it('falls back to UK for each missing segment independently', () => {
      expect(buildAccessionPrefix(null, 'CL', july2026)).toBe('UK/CL/26-07/');
      expect(buildAccessionPrefix('CH', null, july2026)).toBe('CH/UK/26-07/');
      expect(buildAccessionPrefix(null, null, july2026)).toBe('UK/UK/26-07/');
      expect(buildAccessionPrefix(undefined, undefined, july2026)).toBe(
        'UK/UK/26-07/',
      );
    });

    it('treats an empty abbreviation as missing', () => {
      expect(buildAccessionPrefix('', '', july2026)).toBe('UK/UK/26-07/');
    });
  });

  describe('date segment', () => {
    it('separates year and month with a hyphen', () => {
      expect(buildAccessionPrefix('CH', 'CL', july2026)).toContain('/26-07/');
    });

    it('zero-pads single-digit months', () => {
      expect(buildAccessionPrefix('CH', 'CL', new Date(2026, 0, 1))).toBe(
        'CH/CL/26-01/',
      );
    });

    it('handles December without rolling the year', () => {
      expect(buildAccessionPrefix('CH', 'CL', new Date(2026, 11, 31))).toBe(
        'CH/CL/26-12/',
      );
    });
  });
});

describe('nextAccessionSequence', () => {
  it('starts a new series when no prior accession ID exists', () => {
    expect(nextAccessionSequence(null)).toBe(ACCESSION_SEQUENCE_START);
    expect(nextAccessionSequence(undefined)).toBe(ACCESSION_SEQUENCE_START);
    expect(nextAccessionSequence('')).toBe(ACCESSION_SEQUENCE_START);
  });

  it('increments the trailing number of the previous ID', () => {
    expect(nextAccessionSequence('NA/EN/26-07/100001')).toBe(100002);
    expect(nextAccessionSequence('CH/CL/26-07/100042')).toBe(100043);
  });

  it('restarts the series when the trailing segment is not a number', () => {
    expect(nextAccessionSequence('NA/EN/26-07/')).toBe(
      ACCESSION_SEQUENCE_START,
    );
    expect(nextAccessionSequence('malformed')).toBe(ACCESSION_SEQUENCE_START);
  });
});
