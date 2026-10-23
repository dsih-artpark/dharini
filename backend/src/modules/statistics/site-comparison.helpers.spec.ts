import {
  buildSiteSampleTypeMatrix,
  buildSiteTrend,
} from './site-comparison.helpers';

describe('buildSiteSampleTypeMatrix', () => {
  const siteIds = ['siteA', 'siteB'];
  const rows = [
    {
      siteId: 'siteA',
      sampleTypeId: 's1',
      sampleTypeName: 'Drinking Water',
      totalSamples: 100,
      positiveSamples: 28,
    },
    {
      siteId: 'siteB',
      sampleTypeId: 's1',
      sampleTypeName: 'Drinking Water',
      totalSamples: 100,
      positiveSamples: 16,
    },
    {
      siteId: 'siteA',
      sampleTypeId: 's2',
      sampleTypeName: 'Soil',
      totalSamples: 50,
      positiveSamples: 6,
    },
  ];

  it('pivots rows into per-site rates per sample type', () => {
    const matrix = buildSiteSampleTypeMatrix(rows, siteIds);
    const dw = matrix.find((m) => m.sampleTypeId === 's1')!;
    expect(dw.bySite).toEqual({ siteA: 28, siteB: 16 });
  });

  it('fills missing site with null and keeps both columns', () => {
    const matrix = buildSiteSampleTypeMatrix(rows, siteIds);
    const soil = matrix.find((m) => m.sampleTypeId === 's2')!;
    expect(soil.bySite).toEqual({ siteA: 12, siteB: null });
  });

  it('sorts sample types by name', () => {
    const matrix = buildSiteSampleTypeMatrix(rows, siteIds);
    expect(matrix.map((m) => m.name)).toEqual(['Drinking Water', 'Soil']);
  });
});

describe('buildSiteTrend', () => {
  it('buckets by YYYY-MM with rate and positiveCount per site, sorted asc', () => {
    const out = buildSiteTrend([
      {
        period: '2024-02-01T00:00:00.000Z',
        siteId: 'siteA',
        totalSamples: 10,
        positiveSamples: 3,
      },
      {
        period: '2024-01-01T00:00:00.000Z',
        siteId: 'siteA',
        totalSamples: 10,
        positiveSamples: 2,
      },
      {
        period: '2024-01-01T00:00:00.000Z',
        siteId: 'siteB',
        totalSamples: 20,
        positiveSamples: 2,
      },
    ]);
    expect(out.map((p) => p.month)).toEqual(['2024-01', '2024-02']);
    expect(out[0].bySite).toEqual({
      siteA: { rate: 20, positiveCount: 2 },
      siteB: { rate: 10, positiveCount: 2 },
    });
    expect(out[1].bySite).toEqual({
      siteA: { rate: 30, positiveCount: 3 },
    });
  });
});
