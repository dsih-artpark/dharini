import {
  computeRate,
  buildSampleTypeMatrix,
  buildPerProjectTrend,
  buildPerProjectDiseaseTrend,
  buildPerDiseaseTrend,
  buildDiseaseDistribution,
  buildSampleTypeDistribution,
} from './project-comparison.helpers';

describe('computeRate', () => {
  it('returns positive/total*100 rounded to 2dp', () => {
    expect(computeRate(1, 3)).toBe(33.33);
  });
  it('returns 0 when total is 0', () => {
    expect(computeRate(0, 0)).toBe(0);
  });
});

describe('buildSampleTypeMatrix', () => {
  const rows = [
    {
      projectId: 'p1',
      sampleTypeId: 's1',
      sampleTypeName: 'Drinking Water',
      totalSamples: 100,
      positiveSamples: 25,
    },
    {
      projectId: 'p2',
      sampleTypeId: 's1',
      sampleTypeName: 'Drinking Water',
      totalSamples: 100,
      positiveSamples: 15,
    },
    {
      projectId: 'p1',
      sampleTypeId: 's2',
      sampleTypeName: 'Soil',
      totalSamples: 50,
      positiveSamples: 5,
    },
  ];

  it('pivots rows into byProject rate/count per sample type', () => {
    const { matrix } = buildSampleTypeMatrix(rows);
    const dw = matrix.find((m) => m.sampleTypeId === 's1')!;
    expect(dw.byProject).toEqual({
      p1: { rate: 25, positiveCount: 25, totalCount: 100 },
      p2: { rate: 15, positiveCount: 15, totalCount: 100 },
    });
  });

  it('overallAverage is the mean of per-project rates', () => {
    const { matrix } = buildSampleTypeMatrix(rows);
    expect(matrix.find((m) => m.sampleTypeId === 's1')!.overallAverage).toBe(
      20,
    );
  });

  it('excludes projects with no samples of a type (null in byProject, not in mean)', () => {
    const { matrix } = buildSampleTypeMatrix(rows);
    const soil = matrix.find((m) => m.sampleTypeId === 's2')!;
    expect(soil.byProject.p2 ?? null).toBeNull();
    expect(soil.overallAverage).toBe(10);
  });

  it('sampleTypeAverages computes positivity rate as positive/total samples', () => {
    const { sampleTypeAverages } = buildSampleTypeMatrix(rows);
    const dw = sampleTypeAverages.find((s) => s.sampleTypeId === 's1')!;
    // s1: p1 {total:100, positive:25} + p2 {total:100, positive:15} => 40/200 = 20%
    expect(dw.avgPositivity).toBe(20);
  });

  it('sampleTypeAverages sums positive/total counts across projects', () => {
    const { sampleTypeAverages } = buildSampleTypeMatrix(rows);
    const dw = sampleTypeAverages.find((s) => s.sampleTypeId === 's1')!;
    // s1: p1 {total:100, positive:25} + p2 {total:100, positive:15}
    expect(dw.positiveCount).toBe(40);
    expect(dw.totalCount).toBe(200);

    const soil = sampleTypeAverages.find((s) => s.sampleTypeId === 's2')!;
    // s2: only p1 {total:50, positive:5}
    expect(soil.positiveCount).toBe(5);
    expect(soil.totalCount).toBe(50);
  });
});

describe('buildPerProjectTrend', () => {
  it('buckets by YYYY-MM and maps project rates, sorted ascending', () => {
    const out = buildPerProjectTrend([
      {
        period: '2024-02-01T00:00:00.000Z',
        projectId: 'p1',
        totalSamples: 10,
        positiveSamples: 2,
      },
      {
        period: '2024-01-01T00:00:00.000Z',
        projectId: 'p1',
        totalSamples: 10,
        positiveSamples: 1,
      },
      {
        period: '2024-01-01T00:00:00.000Z',
        projectId: 'p2',
        totalSamples: 4,
        positiveSamples: 1,
      },
    ]);
    expect(out.map((p) => p.month)).toEqual(['2024-01', '2024-02']);
    expect(out[0].byProject).toEqual({ p1: 10, p2: 25 });
    expect(out[1].byProject).toEqual({ p1: 20 });
  });
});

describe('buildPerProjectDiseaseTrend', () => {
  it('buckets by YYYY-MM and maps "projectId:diseaseId" rates, sorted ascending', () => {
    const out = buildPerProjectDiseaseTrend([
      {
        period: '2024-02-01T00:00:00.000Z',
        projectId: 'p1',
        diseaseId: 'd1',
        totalSamples: 10,
        positiveSamples: 2,
      },
      {
        period: '2024-01-01T00:00:00.000Z',
        projectId: 'p1',
        diseaseId: 'd1',
        totalSamples: 10,
        positiveSamples: 1,
      },
      {
        period: '2024-01-01T00:00:00.000Z',
        projectId: 'p1',
        diseaseId: 'd2',
        totalSamples: 4,
        positiveSamples: 1,
      },
    ]);
    expect(out.map((p) => p.month)).toEqual(['2024-01', '2024-02']);
    expect(out[0].byProjectDisease).toEqual({ 'p1:d1': 10, 'p1:d2': 25 });
    expect(out[1].byProjectDisease).toEqual({ 'p1:d1': 20 });
  });
});

describe('buildPerDiseaseTrend', () => {
  it('pools positive/total across projects per disease per month, sorted ascending', () => {
    const out = buildPerDiseaseTrend([
      {
        period: '2024-01-01T00:00:00.000Z',
        projectId: 'p1',
        diseaseId: 'd1',
        totalSamples: 10,
        positiveSamples: 2,
      },
      {
        period: '2024-01-01T00:00:00.000Z',
        projectId: 'p2',
        diseaseId: 'd1',
        totalSamples: 10,
        positiveSamples: 3,
      },
      {
        period: '2024-01-01T00:00:00.000Z',
        projectId: 'p1',
        diseaseId: 'd2',
        totalSamples: 4,
        positiveSamples: 1,
      },
      {
        period: '2024-02-01T00:00:00.000Z',
        projectId: 'p1',
        diseaseId: 'd1',
        totalSamples: 10,
        positiveSamples: 5,
      },
    ]);
    expect(out.map((p) => p.month)).toEqual(['2024-01', '2024-02']);
    // d1 pooled across p1+p2 in Jan: (2+3)/(10+10) = 25%; d2: 1/4 = 25%
    expect(out[0].byDisease).toEqual({ d1: 25, d2: 25 });
    // Feb: only p1 for d1: 5/10 = 50%
    expect(out[1].byDisease).toEqual({ d1: 50 });
  });
});

describe('buildDiseaseDistribution', () => {
  it('computes each disease share of total positives (1dp), sorted by index', () => {
    const out = buildDiseaseDistribution([
      {
        diseaseId: 'd2',
        diseaseName: 'FMD',
        diseaseShortName: 'FMD',
        diseaseIndex: 2,
        positiveCount: 30,
        totalCount: 60,
      },
      {
        diseaseId: 'd1',
        diseaseName: 'Avian Influenza',
        diseaseShortName: 'AI',
        diseaseIndex: 1,
        positiveCount: 70,
        totalCount: 200,
      },
    ]);
    expect(out.map((d) => d.shortName)).toEqual(['AI', 'FMD']);
    expect(out[0].percentage).toBe(70);
    expect(out[1].percentage).toBe(30);
  });

  it('passes totalCount through alongside positiveCount', () => {
    const out = buildDiseaseDistribution([
      {
        diseaseId: 'd1',
        diseaseName: 'AI',
        diseaseShortName: 'AI',
        diseaseIndex: 1,
        positiveCount: 70,
        totalCount: 200,
      },
    ]);
    expect(out[0].positiveCount).toBe(70);
    expect(out[0].totalCount).toBe(200);
  });

  it('returns 0 percentages when there are no positives', () => {
    const out = buildDiseaseDistribution([
      {
        diseaseId: 'd1',
        diseaseName: 'AI',
        diseaseShortName: 'AI',
        diseaseIndex: 1,
        positiveCount: 0,
        totalCount: 50,
      },
    ]);
    expect(out[0].percentage).toBe(0);
    expect(out[0].totalCount).toBe(50);
  });
});

describe('buildSampleTypeDistribution', () => {
  it('computes each sample type share of total positives, sorted by count desc', () => {
    const out = buildSampleTypeDistribution([
      {
        sampleTypeId: 's1',
        sampleTypeName: 'Blood',
        positiveCount: 25,
        totalCount: 100,
      },
      {
        sampleTypeId: 's2',
        sampleTypeName: 'Skin Swab',
        positiveCount: 75,
        totalCount: 150,
      },
    ]);
    expect(out.map((s) => s.name)).toEqual(['Skin Swab', 'Blood']);
    expect(out[0].percentage).toBe(75);
    expect(out[1].percentage).toBe(25);
  });

  it('passes totalCount through alongside positiveCount', () => {
    const out = buildSampleTypeDistribution([
      {
        sampleTypeId: 's1',
        sampleTypeName: 'Blood',
        positiveCount: 25,
        totalCount: 100,
      },
    ]);
    expect(out[0].positiveCount).toBe(25);
    expect(out[0].totalCount).toBe(100);
  });

  it('returns 0 percentages when there are no positives', () => {
    const out = buildSampleTypeDistribution([
      {
        sampleTypeId: 's1',
        sampleTypeName: 'Blood',
        positiveCount: 0,
        totalCount: 40,
      },
    ]);
    expect(out[0].percentage).toBe(0);
    expect(out[0].totalCount).toBe(40);
  });
});
