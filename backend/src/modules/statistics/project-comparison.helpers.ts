export interface MatrixRawRow {
  projectId: string;
  sampleTypeId: string;
  sampleTypeName: string;
  totalSamples: number;
  positiveSamples: number;
}

export interface SampleTypeMatrixEntry {
  sampleTypeId: string;
  name: string;
  byProject: Record<
    string,
    { rate: number; positiveCount: number; totalCount: number } | null
  >;
  overallAverage: number;
}

export interface TrendRawRow {
  period: string | Date;
  projectId: string;
  totalSamples: number;
  positiveSamples: number;
}

export interface DiseaseRawRow {
  diseaseId: string;
  diseaseName: string;
  diseaseShortName: string;
  diseaseIndex: number;
  positiveCount: number;
  totalCount: number;
}

export interface SampleTypeDistRawRow {
  sampleTypeId: string;
  sampleTypeName: string;
  positiveCount: number;
  totalCount: number;
}

const round = (n: number, dp: number): number => {
  const f = 10 ** dp;
  return Math.round(n * f) / f;
};

export function computeRate(positive: number, total: number): number {
  return total > 0 ? round((positive / total) * 100, 2) : 0;
}

export function buildSampleTypeMatrix(rows: MatrixRawRow[]): {
  matrix: SampleTypeMatrixEntry[];
  sampleTypeAverages: {
    sampleTypeId: string;
    name: string;
    avgPositivity: number;
    positiveCount: number;
    totalCount: number;
  }[];
} {
  const byType = new Map<
    string,
    {
      name: string;
      byProject: Record<
        string,
        { rate: number; positiveCount: number; totalCount: number } | null
      >;
      rates: number[];
    }
  >();

  for (const r of rows) {
    if (!r.sampleTypeId) continue;
    if (!byType.has(r.sampleTypeId)) {
      byType.set(r.sampleTypeId, {
        name: r.sampleTypeName,
        byProject: {},
        rates: [],
      });
    }
    const entry = byType.get(r.sampleTypeId)!;
    const total = Number(r.totalSamples || 0);
    if (total > 0) {
      const positiveCount = Number(r.positiveSamples || 0);
      const rate = computeRate(positiveCount, total);
      entry.byProject[r.projectId] = { rate, positiveCount, totalCount: total };
      entry.rates.push(rate);
    }
  }

  const matrix: SampleTypeMatrixEntry[] = [...byType.entries()]
    .map(([sampleTypeId, e]) => ({
      sampleTypeId,
      name: e.name,
      byProject: e.byProject,
      overallAverage: e.rates.length
        ? round(e.rates.reduce((a, b) => a + b, 0) / e.rates.length, 2)
        : 0,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const sampleTypeAverages = matrix.map((m) => {
    const cells = Object.values(m.byProject).filter(
      (c): c is { rate: number; positiveCount: number; totalCount: number } =>
        c !== null,
    );
    const positiveCount = cells.reduce((a, c) => a + c.positiveCount, 0);
    const totalCount = cells.reduce((a, c) => a + c.totalCount, 0);
    return {
      sampleTypeId: m.sampleTypeId,
      name: m.name,
      avgPositivity: computeRate(positiveCount, totalCount),
      positiveCount,
      totalCount,
    };
  });

  return { matrix, sampleTypeAverages };
}

export function buildPerProjectTrend(
  rows: TrendRawRow[],
): { month: string; byProject: Record<string, number> }[] {
  const byMonth = new Map<string, Record<string, number>>();

  for (const r of rows) {
    const d = new Date(r.period);
    const month = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
    if (!byMonth.has(month)) byMonth.set(month, {});
    byMonth.get(month)![r.projectId] = computeRate(
      Number(r.positiveSamples || 0),
      Number(r.totalSamples || 0),
    );
  }

  return [...byMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, byProject]) => ({ month, byProject }));
}

export function buildDiseaseDistribution(rows: DiseaseRawRow[]): {
  diseaseId: string;
  name: string;
  shortName: string;
  positiveCount: number;
  totalCount: number;
  percentage: number;
}[] {
  const total = rows.reduce((a, r) => a + Number(r.positiveCount || 0), 0);

  return [...rows]
    .sort((a, b) => Number(a.diseaseIndex) - Number(b.diseaseIndex))
    .map((r) => ({
      diseaseId: r.diseaseId,
      name: r.diseaseName,
      shortName: r.diseaseShortName,
      positiveCount: Number(r.positiveCount || 0),
      totalCount: Number(r.totalCount || 0),
      percentage:
        total > 0 ? round((Number(r.positiveCount || 0) / total) * 100, 1) : 0,
    }));
}

export function buildSampleTypeDistribution(rows: SampleTypeDistRawRow[]): {
  sampleTypeId: string;
  name: string;
  positiveCount: number;
  totalCount: number;
  percentage: number;
}[] {
  const total = rows.reduce((a, r) => a + Number(r.positiveCount || 0), 0);

  return [...rows]
    .map((r) => ({
      sampleTypeId: r.sampleTypeId,
      name: r.sampleTypeName,
      positiveCount: Number(r.positiveCount || 0),
      totalCount: Number(r.totalCount || 0),
      percentage:
        total > 0 ? round((Number(r.positiveCount || 0) / total) * 100, 1) : 0,
    }))
    .sort((a, b) => b.positiveCount - a.positiveCount);
}

export interface DiseaseTrendRawRow {
  period: string | Date;
  projectId: string;
  diseaseId: string;
  totalSamples: number;
  positiveSamples: number;
}

export function buildPerProjectDiseaseTrend(
  rows: DiseaseTrendRawRow[],
): { month: string; byProjectDisease: Record<string, number> }[] {
  const byMonth = new Map<string, Record<string, number>>();

  for (const r of rows) {
    const d = new Date(r.period);
    const month = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
    if (!byMonth.has(month)) byMonth.set(month, {});
    const key = `${r.projectId}:${r.diseaseId}`;
    byMonth.get(month)![key] = computeRate(
      Number(r.positiveSamples || 0),
      Number(r.totalSamples || 0),
    );
  }

  return [...byMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, byProjectDisease]) => ({ month, byProjectDisease }));
}

export function buildPerDiseaseTrend(
  rows: DiseaseTrendRawRow[],
): { month: string; byDisease: Record<string, number> }[] {
  const byMonth = new Map<
    string,
    Map<string, { positive: number; total: number }>
  >();

  for (const r of rows) {
    const d = new Date(r.period);
    const month = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
    if (!byMonth.has(month)) byMonth.set(month, new Map());
    const perDisease = byMonth.get(month)!;
    const prev = perDisease.get(r.diseaseId) ?? { positive: 0, total: 0 };
    perDisease.set(r.diseaseId, {
      positive: prev.positive + Number(r.positiveSamples || 0),
      total: prev.total + Number(r.totalSamples || 0),
    });
  }

  return [...byMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, perDisease]) => ({
      month,
      byDisease: Object.fromEntries(
        [...perDisease.entries()].map(([diseaseId, { positive, total }]) => [
          diseaseId,
          computeRate(positive, total),
        ]),
      ),
    }));
}
