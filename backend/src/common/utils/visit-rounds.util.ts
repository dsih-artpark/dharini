import { Repository } from 'typeorm';
import { Visit } from '../../entities/visit.entity';

export interface RoundableVisitRow {
  id: string;
  siteId: string;
  visitScheduledAt: Date | string;
}

/**
 * Assigns a 1-based "round" to each visit: sequential within a site, ordered by
 * visitScheduledAt ascending, resetting per site. Input may be in any order —
 * it is sorted internally. Returns Map<visitId, round>.
 */
export function assignRoundsBySite(
  rows: RoundableVisitRow[],
): Map<string, number> {
  const sorted = [...rows].sort((a, b) => {
    if (a.siteId !== b.siteId) return a.siteId < b.siteId ? -1 : 1;
    return (
      new Date(a.visitScheduledAt).getTime() -
      new Date(b.visitScheduledAt).getTime()
    );
  });

  const rounds = new Map<string, number>();
  let currentSite: string | null = null;
  let round = 1;
  for (const row of sorted) {
    if (row.siteId !== currentSite) {
      currentSite = row.siteId;
      round = 1;
    }
    rounds.set(row.id, round);
    round++;
  }
  return rounds;
}

/**
 * Loads every visit for the given site IDs and returns a Map<visitId, round>
 * using assignRoundsBySite. Computed across ALL of a site's visits so the round
 * is stable regardless of any filter/pagination applied by the caller.
 */
export async function computeVisitRoundsForSites(
  visitRepository: Repository<Visit>,
  siteIds: string[],
): Promise<Map<string, number>> {
  if (siteIds.length === 0) return new Map<string, number>();

  const rawSiteVisits = await visitRepository
    .createQueryBuilder('visit')
    .innerJoin('visit.site', 'site')
    .select([
      'visit.id AS id',
      'site.id AS "siteId"',
      'visit.visitScheduledAt AS "visitScheduledAt"',
    ])
    .where('site.id IN (:...siteIds)', { siteIds })
    .orderBy('site.id', 'ASC')
    .addOrderBy('visit.visitScheduledAt', 'ASC')
    .getRawMany();

  return assignRoundsBySite(rawSiteVisits as RoundableVisitRow[]);
}
