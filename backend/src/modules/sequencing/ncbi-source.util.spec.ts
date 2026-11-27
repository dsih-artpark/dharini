import {
  parseNcbiSourceFields,
  toFullCollectionDate,
} from './ncbi-source.util';

describe('parseNcbiSourceFields', () => {
  it('picks the fields from a real record (PP488413.1)', () => {
    expect(
      parseNcbiSourceFields(
        'isolate|host|country|isolation_source|collection_date',
        'NCL-BAIF-LSDV067|Cattle breed HFX|India: Padhegaon, Ahmednagar|Skin Scab|16-Aug-2023',
      ),
    ).toEqual({
      isolate: 'NCL-BAIF-LSDV067',
      strain: null,
      host: 'Cattle breed HFX',
      geoLocName: 'India: Padhegaon, Ahmednagar',
      collectionDate: '2023-08-16',
    });
  });

  it('reads the location under geo_loc_name as well as country', () => {
    expect(
      parseNcbiSourceFields('geo_loc_name', 'India: Karnataka').geoLocName,
    ).toBe('India: Karnataka');
  });

  it('keeps strain, and both isolate and strain when a record has both', () => {
    expect(
      parseNcbiSourceFields('strain', 'LSDV/Thailand/Sukhothai/CU30807/2022'),
    ).toMatchObject({
      isolate: null,
      strain: 'LSDV/Thailand/Sukhothai/CU30807/2022',
    });
    expect(parseNcbiSourceFields('isolate|strain', 'I-1|S-1')).toMatchObject({
      isolate: 'I-1',
      strain: 'S-1',
    });
  });

  it('returns null for every field the record does not have', () => {
    expect(parseNcbiSourceFields('note', 'patent sequence')).toEqual({
      isolate: null,
      strain: null,
      host: null,
      geoLocName: null,
      collectionDate: null,
    });
    expect(parseNcbiSourceFields(undefined, undefined)).toEqual({
      isolate: null,
      strain: null,
      host: null,
      geoLocName: null,
      collectionDate: null,
    });
  });

  it('trims values and ignores empty ones', () => {
    expect(parseNcbiSourceFields('isolate|host', ' I-1 |  ')).toMatchObject({
      isolate: 'I-1',
      host: null,
    });
  });

  it('saves nothing when the name and value lists differ in length', () => {
    // A value containing '|' shifts every later pair out of line.
    expect(
      parseNcbiSourceFields('isolate|host|country', 'I-1|Cattle|extra|India'),
    ).toEqual({
      isolate: null,
      strain: null,
      host: null,
      geoLocName: null,
      collectionDate: null,
    });
  });
});

describe('toFullCollectionDate', () => {
  it.each([
    ['16-Aug-2023', '2023-08-16'],
    ['01-jan-2024', '2024-01-01'],
    ['2025-10-17', '2025-10-17'],
    ['29-Feb-2024', '2024-02-29'],
  ])('converts full day %s -> %s', (value, expected) => {
    expect(toFullCollectionDate(value)).toBe(expected);
  });

  it.each([
    ['Aug-2023'],
    ['2023'],
    ['2023-08'],
    ['2021/2022'],
    ['16-Aug-2023/20-Aug-2023'],
    ['31-Feb-2023'],
    ['29-Feb-2023'],
    ['16-Foo-2023'],
    ['2023-13-01'],
    ['missing'],
    [''],
  ])('leaves %p empty (not a full, real day)', (value) => {
    expect(toFullCollectionDate(value)).toBeNull();
  });

  it('leaves a missing value empty', () => {
    expect(toFullCollectionDate(undefined)).toBeNull();
    expect(toFullCollectionDate(null)).toBeNull();
  });
});
