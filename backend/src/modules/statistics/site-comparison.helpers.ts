import { computeRate } from './project-comparison.helpers';

export interface SiteMatrixRawRow {
  siteId: string;
  sampleTypeId: string;
  sampleTypeName: string;
  totalSamples: number;
  positiveSamples: number;
}

export interface SiteSampleTypeMatrixEntry {
  sampleTypeId: string;
  name: string;
  bySite: Record<string, number | null>;
}

export interface SiteTrendRawRow {
  period: string | Date;
  siteId: string;
  totalSamples: number;
  positiveSamples: number;
}

export interface SiteTrendPoint {
  month: string;
  bySite: Record<string, { rate: number; positiveCount: number }>;
}

export function buildSiteSampleTypeMatrix(
  rows: SiteMatrixRawRow[],
  siteIds: string[],
): SiteSampleTypeMatrixEntry[] {
  const byType = new Map<
    string,
    { name: string; bySite: Record<string, number | null> }
  >();

  for (const r of rows) {
    if (!r.sampleTypeId) continue;
    if (!byType.has(r.sampleTypeId)) {
      byType.set(r.sampleTypeId, { name: r.sampleTypeName, bySite: {} });
    }
    const entry = byType.get(r.sampleTypeId)!;
    const total = Number(r.totalSamples || 0);
    entry.bySite[r.siteId] =
      total > 0 ? computeRate(Number(r.positiveSamples || 0), total) : null;
  }

  return [...byType.entries()]
    .map(([sampleTypeId, e]) => {
      // Ensure every compared site is represented (null when it has no samples
      // of this type), so the table/chart always render both columns.
      const bySite: Record<string, number | null> = {};
      for (const sid of siteIds) bySite[sid] = e.bySite[sid] ?? null;
      return { sampleTypeId, name: e.name, bySite };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function buildSiteTrend(rows: SiteTrendRawRow[]): SiteTrendPoint[] {
  const byMonth = new Map<
    string,
    Record<string, { rate: number; positiveCount: number }>
  >();

  for (const r of rows) {
    const d = new Date(r.period);
    const month = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
    if (!byMonth.has(month)) byMonth.set(month, {});
    byMonth.get(month)![r.siteId] = {
      rate: computeRate(
        Number(r.positiveSamples || 0),
        Number(r.totalSamples || 0),
      ),
      positiveCount: Number(r.positiveSamples || 0),
    };
  }

  return [...byMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, bySite]) => ({ month, bySite }));
}
