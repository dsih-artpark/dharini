import { ArrayContains, FindOperator } from 'typeorm';
import { VisitService } from './visits.service';

/**
 * The home screen's "my visits" counts. A site can have several collectors
 * and its visits are created under the first, so a collector's pending
 * visits are those they lead and every visit of a site they collect for. A
 * completed one counts only for who was at it: the visit lists them, or -
 * recorded before visits listed that - they led it.
 */
describe('VisitService.getVisitSummary', () => {
  const USER = 'u2';

  const build = () => {
    const visitRepository = { count: jest.fn().mockResolvedValue(3) };
    const entityManager = { count: jest.fn().mockResolvedValue(5) };
    const service = new VisitService(
      {} as any, // multerConfigService
      {} as any, // sampleService
      {} as any, // visitSchedulerQueue
      visitRepository as any,
      {} as any, // siteRepository
      {} as any, // projectRepository
      { findOne: jest.fn().mockResolvedValue({ id: USER }) } as any,
      {} as any, // diseaseRepository
      {} as any, // teamRepository
      {} as any, // mediaRepository
      entityManager as any,
      {
        forUser: jest.fn().mockResolvedValue({
          scope: 'project',
          projectIds: ['p1'],
          teamIds: [],
        }),
      } as any,
    );
    return { service, visitRepository, entityManager };
  };

  const mine = [
    { collector: { id: USER } },
    { site: { collectorIds: ArrayContains([USER]) } },
  ];
  const attended = [
    { visitedByIds: ArrayContains([USER]) },
    { collector: { id: USER }, visitedByIds: expect.any(FindOperator) },
  ];

  it('counts the pending visits of every site a collector collects for, and the completed ones they were at', async () => {
    const { service, visitRepository, entityManager } = build();

    const summary = await service.getVisitSummary(USER, 'p1', {
      startDate: '2026-10-01T00:00:00Z',
      endDate: '2026-10-31T23:59:59Z',
    });

    // overdue, pending, completed, then the caller's pending and completed.
    const [pendingMine, completedMine] = visitRepository.count.mock.calls
      .slice(3)
      .map(([options]) => options.where);
    expect(pendingMine).toEqual(
      mine.map((who) => expect.objectContaining(who)),
    );
    expect(completedMine).toEqual(
      attended.map((who) => expect.objectContaining(who)),
    );
    // Samples the caller collected on those visits.
    const [[, sampleOptions]] = entityManager.count.mock.calls;
    expect(sampleOptions.where).toEqual(
      mine.map((who) => ({
        collectedBy: { id: USER },
        visit: expect.objectContaining(who),
      })),
    );
    expect(summary).toMatchObject({
      visitCount: 3,
      pendingVisitsIndividual: 3,
      totalSampleCollected: 5,
    });
  });

  describe('with collectors from different teams', () => {
    // A site whose primary collector u1 is in team t1 and whose other
    // collector u3 is in team t2: its visits are u1's, under t1. u1 was at
    // one completed visit, u3 at another, and an older one lists nobody.
    const DAY = 24 * 60 * 60 * 1000;
    const now = Date.now();
    const site = { id: 's1', collectorIds: ['u1', 'u3'] };
    const visits = [
      {
        id: 'upcoming',
        site,
        project: { id: 'p1' },
        collector: { id: 'u1' },
        team: { id: 't1' },
        visitStatus: 'upcoming',
        isCompleted: false,
        visitScheduledAt: new Date(now + 3 * DAY),
        visitedAt: null,
      },
      {
        id: 'completed-by-u1',
        site,
        project: { id: 'p1' },
        collector: { id: 'u1' },
        team: { id: 't1' },
        visitStatus: 'completed',
        isCompleted: true,
        visitScheduledAt: new Date(now - 3 * DAY),
        visitedAt: new Date(now - 2 * DAY),
        visitedByIds: ['u1'],
      },
      {
        id: 'completed-by-u3',
        site,
        project: { id: 'p1' },
        collector: { id: 'u1' },
        team: { id: 't1' },
        visitStatus: 'completed',
        isCompleted: true,
        visitScheduledAt: new Date(now - 10 * DAY),
        visitedAt: new Date(now - 9 * DAY),
        visitedByIds: ['u3'],
      },
      {
        id: 'completed-before-visitedBy',
        site,
        project: { id: 'p1' },
        collector: { id: 'u1' },
        team: { id: 't1' },
        visitStatus: 'completed',
        isCompleted: true,
        visitScheduledAt: new Date(now - 17 * DAY),
        visitedAt: new Date(now - 16 * DAY),
        visitedByIds: [],
      },
      {
        id: 'elsewhere',
        site: { id: 's2', collectorIds: ['u9'] },
        project: { id: 'p1' },
        collector: { id: 'u9' },
        team: { id: 't9' },
        visitStatus: 'upcoming',
        isCompleted: false,
        visitScheduledAt: new Date(now + 3 * DAY),
        visitedAt: null,
      },
    ];

    // Evaluates the find conditions getVisitSummary builds against `visits`.
    const operatorMatches = (value: any, operator: FindOperator<any>) => {
      const operand: any = operator.value;
      switch (operator.type) {
        case 'and':
          return operand.every((inner: FindOperator<any>) =>
            operatorMatches(value, inner),
          );
        case 'moreThanOrEqual':
          return +value >= +operand;
        case 'lessThan':
          return +value < +operand;
        case 'lessThanOrEqual':
          return +value <= +operand;
        case 'between':
          return (
            value !== null && +value >= +operand[0] && +value <= +operand[1]
          );
        case 'arrayContains':
          return operand.every((id: string) => (value ?? []).includes(id));
        case 'raw': {
          const sql = (operator as any).getSql('col');
          if (sql === 'cardinality(col) = 0') return (value ?? []).length === 0;
          throw new Error(`Unhandled raw SQL ${sql}`);
        }
        default:
          throw new Error(`Unhandled operator ${operator.type}`);
      }
    };
    const matches = (row: any, where: any): boolean =>
      Object.entries(where).every(([key, condition]) => {
        if (condition instanceof FindOperator) {
          return operatorMatches(row?.[key], condition);
        }
        if (condition && typeof condition === 'object') {
          return matches(row?.[key], condition);
        }
        return row?.[key] === condition;
      });

    const countsFor = async (userId: string) => {
      const { service, visitRepository } = build();
      visitRepository.count.mockImplementation(
        async ({ where }) =>
          visits.filter((visit) =>
            (Array.isArray(where) ? where : [where]).some((w) =>
              matches(visit, w),
            ),
          ).length,
      );
      const summary = await service.getVisitSummary(userId, 'p1', {
        startDate: new Date(now - 30 * DAY).toISOString(),
        endDate: new Date(now + 30 * DAY).toISOString(),
      });
      return {
        pending: summary.pendingVisitsIndividual,
        completed: summary.visitCount,
      };
    };

    it('counts the pending visits for both collectors, and each completed one only for who was at it', async () => {
      // u1: the visit they were at, and the older one they led.
      expect(await countsFor('u1')).toEqual({ pending: 1, completed: 2 });
      expect(await countsFor('u3')).toEqual({ pending: 1, completed: 1 });
    });

    it('does not count them for someone who is not one of the site’s collectors', async () => {
      expect(await countsFor('u5')).toEqual({ pending: 0, completed: 0 });
    });
  });
});
