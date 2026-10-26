import { VisitService } from './visits.service';
import { VisitStatus } from '../../common/enums/visitStatus.enum';

/**
 * Pins the ordering of GET /projects/:projectId/visits. Creating a site inserts
 * its whole schedule in one transaction, so those visits share `createdAt`. The
 * mobile client reads this list to find a new site's first visit, and an
 * unbroken `createdAt` tie handed it round 2 or round 5 instead of round 1.
 */
describe('VisitService.getFilteredVisits ordering', () => {
  const makeService = () => {
    const calls: any[][] = [];
    const qb: any = {};
    for (const method of [
      'leftJoinAndSelect',
      'andWhere',
      'orderBy',
      'addOrderBy',
      'skip',
      'take',
    ]) {
      qb[method] = jest.fn((...args: any[]) => {
        calls.push([method, ...args]);
        return qb;
      });
    }
    // No rows, so getFilteredVisits returns before computing rounds.
    qb.getManyAndCount = jest.fn().mockResolvedValue([[], 0]);

    const visitRepository = { createQueryBuilder: jest.fn(() => qb) };
    const tenantScopeService = {
      forUser: jest.fn().mockResolvedValue({
        isSystem: true,
        projectIds: [],
        teamIds: [],
        workspaceIds: [],
        scope: null,
      }),
    };

    const service = new VisitService(
      {} as any, // multerConfigService
      {} as any, // sampleService
      {} as any, // visitSchedulerQueue
      visitRepository as any,
      {} as any, // siteRepository
      {} as any, // projectRepository
      {} as any, // collectorRepository
      {} as any, // diseaseRepository
      {} as any, // teamRepository
      {} as any, // mediaRepository
      {} as any, // entityManager
      tenantScopeService as any,
    );

    return { service, calls };
  };

  const ordering = (calls: any[][]) =>
    calls.filter(([method]) => method === 'orderBy' || method === 'addOrderBy');

  it('breaks the createdAt tie on schedule order, then id, when no status is given', async () => {
    const { service, calls } = makeService();

    await service.getFilteredVisits({}, { projectId: 'p1', siteId: 's1' });

    expect(ordering(calls)).toEqual([
      ['orderBy', 'visit.createdAt', 'DESC'],
      ['addOrderBy', 'visit.visitScheduledAt', 'ASC'],
      ['addOrderBy', 'visit.id', 'ASC'],
    ]);
  });

  it('serves upcoming visits earliest-first, so page 1 always holds round 1', async () => {
    const { service, calls } = makeService();

    await service.getFilteredVisits(
      {},
      { projectId: 'p1', siteId: 's1', visitStatus: VisitStatus.UPCOMING },
    );

    expect(calls).toContainEqual([
      'andWhere',
      'site.id = :siteId',
      { siteId: 's1' },
    ]);
    expect(calls).toContainEqual([
      'andWhere',
      'visit.visitStatus = :upcomingStatus',
      { upcomingStatus: VisitStatus.UPCOMING },
    ]);
    expect(calls).toContainEqual(['andWhere', 'visit.isCompleted = false']);
    expect(calls).toContainEqual([
      'andWhere',
      'visit.visitScheduledAt >= :currentDate',
      { currentDate: expect.any(Date) },
    ]);
    expect(ordering(calls)).toEqual([
      ['orderBy', 'visit.visitScheduledAt', 'ASC'],
      ['addOrderBy', 'visit.id', 'ASC'],
    ]);
    expect(calls).toContainEqual(['skip', 0]);
    expect(calls).toContainEqual(['take', 10]);
  });
});
