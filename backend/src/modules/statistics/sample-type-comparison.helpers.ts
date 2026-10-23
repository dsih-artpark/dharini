import { computeRate } from './project-comparison.helpers';

export interface TypeTrendRawRow {
  period: string | Date;
  sampleTypeId: string;
  totalSamples: number;
  positiveSamples: number;
}

export interface TypeTrendPoint {
  month: string;
  byType: Record<string, { rate: number; positiveCount: number }>;
}

export interface TypeProjectRawRow {
  projectId: string;
  projectName: string;
  sampleTypeId: string;
  totalSamples: number;
  positiveSamples: number;
}

export interface TypeProjectEntry {
  projectId: string;
  projectName: string;
  byType: Record<string, number | null>;
}

export interface TypeDiseaseRawRow {
  diseaseId: string;
  diseaseName: string;
  diseaseShortName: string;
  diseaseIndex: number;
  sampleTypeId: string;
  positiveCount: number;
}

export interface TypeDiseaseEntry {
  diseaseId: string;
  name: string;
  shortName: string;
  byType: Record<string, { positiveCount: number; percentage: number }>;
}

const round1 = (n: number) => Math.round(n * 10) / 10;

export function buildTypeTrend(rows: TypeTrendRawRow[]): TypeTrendPoint[] {
  const byMonth = new Map<
    string,
    Record<string, { rate: number; positiveCount: number }>
  >();

  for (const r of rows) {
    const d = new Date(r.period);
    const month = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
    if (!byMonth.has(month)) byMonth.set(month, {});
    byMonth.get(month)![r.sampleTypeId] = {
      rate: computeRate(
        Number(r.positiveSamples || 0),
        Number(r.totalSamples || 0),
      ),
      positiveCount: Number(r.positiveSamples || 0),
    };
  }

  return [...byMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, byType]) => ({ month, byType }));
}

export function buildTypeProjectMatrix(
  rows: TypeProjectRawRow[],
  typeIds: string[],
): TypeProjectEntry[] {
  const byProject = new Map<
    string,
    { projectName: string; byType: Record<string, number | null> }
  >();

  for (const r of rows) {
    if (!r.projectId) continue;
    if (!byProject.has(r.projectId)) {
      byProject.set(r.projectId, { projectName: r.projectName, byType: {} });
    }
    const entry = byProject.get(r.projectId)!;
    const total = Number(r.totalSamples || 0);
    entry.byType[r.sampleTypeId] =
      total > 0 ? computeRate(Number(r.positiveSamples || 0), total) : null;
  }

  return [...byProject.entries()]
    .map(([projectId, e]) => {
      const byType: Record<string, number | null> = {};
      for (const tid of typeIds) byType[tid] = e.byType[tid] ?? null;
      return { projectId, projectName: e.projectName, byType };
    })
    .sort((a, b) => a.projectName.localeCompare(b.projectName));
}

export function buildTypeDiseaseComparison(
  rows: TypeDiseaseRawRow[],
  typeIds: string[],
  positivesByType: Record<string, number>,
): TypeDiseaseEntry[] {
  const byDisease = new Map<
    string,
    {
      name: string;
      shortName: string;
      index: number;
      counts: Record<string, number>;
    }
  >();

  for (const r of rows) {
    if (!r.diseaseId) continue;
    if (!byDisease.has(r.diseaseId)) {
      byDisease.set(r.diseaseId, {
        name: r.diseaseName,
        shortName: r.diseaseShortName,
        index: Number(r.diseaseIndex || 0),
        counts: {},
      });
    }
    byDisease.get(r.diseaseId)!.counts[r.sampleTypeId] = Number(
      r.positiveCount || 0,
    );
  }

  return [...byDisease.entries()]
    .sort(([, a], [, b]) => a.index - b.index)
    .map(([diseaseId, e]) => {
      const byType: Record<
        string,
        { positiveCount: number; percentage: number }
      > = {};
      for (const tid of typeIds) {
        const positiveCount = e.counts[tid] ?? 0;
        const denom = positivesByType[tid] || 0;
        byType[tid] = {
          positiveCount,
          percentage: denom > 0 ? round1((positiveCount / denom) * 100) : 0,
        };
      }
      return { diseaseId, name: e.name, shortName: e.shortName, byType };
    });
}
