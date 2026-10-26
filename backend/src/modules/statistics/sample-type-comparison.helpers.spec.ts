import {
  buildTypeTrend,
  buildTypeProjectMatrix,
  buildTypeDiseaseComparison,
} from './sample-type-comparison.helpers';

describe('buildTypeTrend', () => {
  it('buckets by YYYY-MM with rate and positiveCount per type, sorted asc', () => {
    const out = buildTypeTrend([
      {
        period: '2024-02-01T00:00:00.000Z',
        sampleTypeId: 't1',
        totalSamples: 10,
        positiveSamples: 3,
      },
      {
        period: '2024-01-01T00:00:00.000Z',
        sampleTypeId: 't1',
        totalSamples: 10,
        positiveSamples: 2,
      },
      {
        period: '2024-01-01T00:00:00.000Z',
        sampleTypeId: 't2',
        totalSamples: 20,
        positiveSamples: 2,
      },
    ]);
    expect(out.map((p) => p.month)).toEqual(['2024-01', '2024-02']);
    expect(out[0].byType).toEqual({
      t1: { rate: 20, positiveCount: 2 },
      t2: { rate: 10, positiveCount: 2 },
    });
    expect(out[1].byType).toEqual({ t1: { rate: 30, positiveCount: 3 } });
  });
});

describe('buildTypeProjectMatrix', () => {
  const typeIds = ['t1', 't2'];
  const rows = [
    {
      projectId: 'p1',
      projectName: 'Project A',
      sampleTypeId: 't1',
      totalSamples: 100,
      positiveSamples: 24,
    },
    {
      projectId: 'p1',
      projectName: 'Project A',
      sampleTypeId: 't2',
      totalSamples: 100,
      positiveSamples: 14,
    },
    {
      projectId: 'p2',
      projectName: 'Project B',
      sampleTypeId: 't1',
      totalSamples: 50,
      positiveSamples: 10,
    },
  ];

  it('pivots per-project rates per sample type, sorted by name', () => {
    const out = buildTypeProjectMatrix(rows, typeIds);
    expect(out.map((p) => p.projectName)).toEqual(['Project A', 'Project B']);
    expect(out[0].byType).toEqual({ t1: 24, t2: 14 });
  });

  it('fills a missing type with null', () => {
    const out = buildTypeProjectMatrix(rows, typeIds);
    expect(out[1].byType).toEqual({ t1: 20, t2: null });
  });
});

describe('buildTypeDiseaseComparison', () => {
  const typeIds = ['t1', 't2'];
  const positivesByType = { t1: 1372, t2: 786 };
  const rows = [
    {
      diseaseId: 'd2',
      diseaseName: 'Foot-and-Mouth Disease',
      diseaseShortName: 'FMD',
      diseaseIndex: 2,
      sampleTypeId: 't1',
      positiveCount: 410,
    },
    {
      diseaseId: 'd1',
      diseaseName: 'Avian Influenza',
      diseaseShortName: 'AI',
      diseaseIndex: 1,
      sampleTypeId: 't1',
      positiveCount: 620,
    },
    {
      diseaseId: 'd1',
      diseaseName: 'Avian Influenza',
      diseaseShortName: 'AI',
      diseaseIndex: 1,
      sampleTypeId: 't2',
      positiveCount: 285,
    },
  ];

  it('computes per-type share of that type total positives, sorted by index', () => {
    const out = buildTypeDiseaseComparison(rows, typeIds, positivesByType);
    expect(out.map((d) => d.shortName)).toEqual(['AI', 'FMD']);
    expect(out[0].byType.t1).toEqual({ positiveCount: 620, percentage: 45.2 });
    expect(out[0].byType.t2).toEqual({ positiveCount: 285, percentage: 36.3 });
  });

  it('fills a missing type with zeroes', () => {
    const out = buildTypeDiseaseComparison(rows, typeIds, positivesByType);
    const fmd = out.find((d) => d.shortName === 'FMD')!;
    expect(fmd.byType.t2).toEqual({ positiveCount: 0, percentage: 0 });
  });
});
