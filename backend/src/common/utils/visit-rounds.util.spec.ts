import { assignRoundsBySite, RoundableVisitRow } from './visit-rounds.util';

describe('assignRoundsBySite', () => {
  it('numbers visits sequentially within a single site by date', () => {
    const rows: RoundableVisitRow[] = [
      { id: 'a', siteId: 's1', visitScheduledAt: '2026-01-01' },
      { id: 'b', siteId: 's1', visitScheduledAt: '2026-02-01' },
      { id: 'c', siteId: 's1', visitScheduledAt: '2026-03-01' },
    ];
    const result = assignRoundsBySite(rows);
    expect(result.get('a')).toBe(1);
    expect(result.get('b')).toBe(2);
    expect(result.get('c')).toBe(3);
  });

  it('resets the counter independently per site', () => {
    const rows: RoundableVisitRow[] = [
      { id: 'a', siteId: 's1', visitScheduledAt: '2026-01-01' },
      { id: 'b', siteId: 's2', visitScheduledAt: '2026-01-05' },
      { id: 'c', siteId: 's1', visitScheduledAt: '2026-02-01' },
      { id: 'd', siteId: 's2', visitScheduledAt: '2026-02-10' },
    ];
    const result = assignRoundsBySite(rows);
    expect(result.get('a')).toBe(1);
    expect(result.get('c')).toBe(2);
    expect(result.get('b')).toBe(1);
    expect(result.get('d')).toBe(2);
  });

  it('orders strictly by visitScheduledAt regardless of input order', () => {
    const rows: RoundableVisitRow[] = [
      { id: 'late', siteId: 's1', visitScheduledAt: '2026-03-01' },
      { id: 'early', siteId: 's1', visitScheduledAt: '2026-01-01' },
      { id: 'mid', siteId: 's1', visitScheduledAt: '2026-02-01' },
    ];
    const result = assignRoundsBySite(rows);
    expect(result.get('early')).toBe(1);
    expect(result.get('mid')).toBe(2);
    expect(result.get('late')).toBe(3);
  });

  it('returns an empty map for empty input', () => {
    expect(assignRoundsBySite([]).size).toBe(0);
  });
});
