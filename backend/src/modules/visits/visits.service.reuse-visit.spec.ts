import { StatusType } from 'src/common/enums/status.enum';
import { VisitStatus } from 'src/common/enums/visitStatus.enum';
import { VisitService } from './visits.service';

/**
 * Creating a site generates a visit on its start date, and the mobile app
 * also queues a "visit now" request behind every site it creates. Older app
 * builds, interrupted syncs and retries after a lost response post that
 * request anyway. createVisit must hand back the untouched start-date visit
 * (or the visit the same request already created) instead of adding a
 * second one, and must never reuse a visit that holds any collected data.
 */
describe('VisitService.createVisit reuse of an untouched visit', () => {
  const SITE_ID = '4d60e8fc-604f-4c10-8da3-c79a65964832';
  const PROJECT_ID = 'P4TOD6';
  const COLLECTOR_ID = '3f3d4ae4-b6be-4bdc-ab8f-906bdd1f356f';

  // Saturday 2026-10-10, as node-postgres returns the stored start date.
  const site = { id: SITE_ID, collectionStartDate: new Date(2026, 9, 10) };

  const generatedVisit = (id: string, scheduledAt: string, overrides = {}) => ({
    id,
    site: { id: SITE_ID },
    collector: { id: COLLECTOR_ID },
    project: { id: PROJECT_ID },
    team: { id: 't1' },
    visitedBy: null,
    questionSetId: 'qs-1',
    visitScheduledAt: new Date(scheduledAt),
    visitStatus: VisitStatus.UPCOMING,
    isCompleted: false,
    status: StatusType.ACTIVE,
    visitedAt: null,
    visitStartedAt: null,
    rescheduledFrom: null,
    comment: null,
    photos: null,
    suspectedPositives: [],
    diseaseQuestionnaireData: null,
    environmentalQuestionnaireData: null,
    completedAtCoordinates: null,
    ...overrides,
  });

  const makeService = (
    visits: any[],
    linked: Record<string, Record<string, number>> = {},
  ) => {
    let inserted = 0;
    const deps = {
      visitRepository: {
        create: jest.fn((v) => v),
        save: jest.fn(async (v) => {
          const saved = {
            // Column defaults Postgres fills in on insert.
            status: StatusType.ACTIVE,
            suspectedPositives: [],
            visitedBy: null,
            ...v,
            id: `new-${++inserted}`,
            visitScheduledAt: new Date(v.visitScheduledAt),
          };
          visits.push(saved);
          return saved;
        }),
        // Mirrors the where/order shape findReusableVisit() queries with.
        find: jest.fn(async ({ where }) => {
          const [from, to] = where.visitScheduledAt.value;
          return visits
            .filter(
              (v) =>
                v.site.id === where.site.id &&
                v.collector.id === where.collector.id &&
                v.visitStatus === where.visitStatus &&
                v.isCompleted === where.isCompleted &&
                v.visitScheduledAt >= from &&
                v.visitScheduledAt <= to,
            )
            .sort(
              (a, b) =>
                a.visitScheduledAt.getTime() - b.visitScheduledAt.getTime() ||
                a.id.localeCompare(b.id),
            );
        }),
      },
      siteRepository: { findOneBy: jest.fn().mockResolvedValue(site) },
      projectRepository: {
        findOneBy: jest.fn().mockResolvedValue({ id: PROJECT_ID }),
      },
      collectorRepository: {
        findOne: jest
          .fn()
          .mockResolvedValue({ id: COLLECTOR_ID, team: { id: 't1' } }),
      },
      teamRepository: { findOne: jest.fn().mockResolvedValue({ id: 't1' }) },
      entityManager: {
        count: jest.fn(
          async (entity: { name: string }, { where }: any) =>
            linked[entity.name]?.[where.visit.id] ?? 0,
        ),
      },
    };

    const service = new VisitService(
      {} as any, // multerConfigService
      {} as any, // sampleService
      {} as any, // visitSchedulerQueue
      deps.visitRepository as any,
      deps.siteRepository as any,
      deps.projectRepository as any,
      deps.collectorRepository as any,
      {} as any, // diseaseRepository
      deps.teamRepository as any,
      {} as any, // mediaRepository
      deps.entityManager as any,
      {} as any, // tenantScopeService
    );

    return { service, deps, visits };
  };

  // The mobile app's "visit now" request, made at 10:00 IST on the start date.
  const visitNow = (overrides = {}) =>
    ({
      siteId: SITE_ID,
      collectorId: COLLECTOR_ID,
      projectId: PROJECT_ID,
      visitScheduledAt: '2026-10-10T04:30:12.345Z',
      comment: '',
      ...overrides,
    }) as any;

  const startDateVisit = () =>
    generatedVisit('g-start', '2026-10-10T00:00:00.000Z');
  const mondayVisit = () =>
    generatedVisit('g-monday', '2026-10-12T00:00:00.000Z');

  it('returns the generated start-date visit instead of creating a second one', async () => {
    const { service, deps } = makeService([startDateVisit(), mondayVisit()]);

    const visit = await service.createVisit(visitNow());

    expect(visit.id).toBe('g-start');
    expect(deps.visitRepository.save).not.toHaveBeenCalled();
  });

  it('returns the same start-date visit on every retry of the request', async () => {
    const { service, deps } = makeService([startDateVisit(), mondayVisit()]);

    const ids = [];
    for (let attempt = 0; attempt < 3; attempt++) {
      ids.push((await service.createVisit(visitNow())).id);
    }

    expect(ids).toEqual(['g-start', 'g-start', 'g-start']);
    expect(deps.visitRepository.save).not.toHaveBeenCalled();
  });

  it('returns the visit a lost-response request already created when it is retried', async () => {
    // 2026-10-11 has no generated visit, so the first request creates one.
    const { service, deps } = makeService([startDateVisit(), mondayVisit()]);
    const request = visitNow({ visitScheduledAt: '2026-10-11T06:00:00.123Z' });

    const first = await service.createVisit(request);
    const retried = await service.createVisit(request);

    expect(first.id).toBe('new-1');
    expect(retried.id).toBe('new-1');
    expect(deps.visitRepository.save).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['a day with no generated visit', '2026-10-11T04:30:00.000Z'],
    [
      'a generated plan day that is not the start date',
      '2026-10-12T04:30:00.000Z',
    ],
  ])('creates a new visit for %s', async (_, scheduledAt) => {
    const { service, deps } = makeService([startDateVisit(), mondayVisit()]);

    const visit = await service.createVisit(
      visitNow({ visitScheduledAt: scheduledAt }),
    );

    expect(visit.id).toBe('new-1');
    expect(deps.visitRepository.save).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['completed', { visitStatus: VisitStatus.COMPLETED, isCompleted: true }],
    ['skipped', { visitStatus: VisitStatus.SKIPPED }],
    ['overdue', { visitStatus: VisitStatus.OVERDUE }],
    ['started', { visitStartedAt: new Date('2026-10-10T03:00:00.000Z') }],
    ['visited', { visitedAt: new Date('2026-10-10T03:30:00.000Z') }],
    ['visited by someone', { visitedBy: { id: 'u2' } }],
    ['rescheduled', { rescheduledFrom: new Date('2026-10-09T00:00:00.000Z') }],
    ['deleted', { status: StatusType.DELETED }],
    ['commented', { comment: 'Gate locked' }],
    ['photographed', { photos: ['m1'] }],
    ['marked suspected positive', { suspectedPositives: [{ sampleCount: 1 }] }],
    ['answered (disease)', { diseaseQuestionnaireData: { q1: 'yes' } }],
    ['answered (environmental)', { environmentalQuestionnaireData: { q: 1 } }],
    ['located on completion', { completedAtCoordinates: { type: 'Point' } }],
  ])('never reuses a start-date visit that is %s', async (_, overrides) => {
    const original = generatedVisit(
      'g-start',
      '2026-10-10T00:00:00.000Z',
      overrides,
    );
    const snapshot = { ...original };
    const { service, deps } = makeService([original]);

    const visit = await service.createVisit(visitNow());

    expect(visit.id).toBe('new-1');
    expect(deps.visitRepository.save).toHaveBeenCalledTimes(1);
    expect(original).toEqual(snapshot); // left exactly as it was
  });

  it.each(['Sample', 'AnimalMetadata', 'LabTest'])(
    'never reuses a start-date visit with a linked %s',
    async (entity) => {
      const { service, deps } = makeService([startDateVisit()], {
        [entity]: { 'g-start': 1 },
      });

      const visit = await service.createVisit(visitNow());

      expect(visit.id).toBe('new-1');
      expect(deps.visitRepository.save).toHaveBeenCalledTimes(1);
    },
  );

  it('always creates a visit for a request that records a completed visit', async () => {
    const { service, deps } = makeService([startDateVisit()]);

    const visit = await service.createVisit(
      visitNow({ visitedAt: '2026-10-10T04:45:00.000Z' }),
    );

    expect(visit.id).toBe('new-1');
    expect(visit.isCompleted).toBe(true);
    expect(deps.visitRepository.save).toHaveBeenCalledTimes(1);
  });

  it('does not reuse another collector’s start-date visit', async () => {
    const { service, deps } = makeService([
      generatedVisit('g-start', '2026-10-10T00:00:00.000Z', {
        collector: { id: 'someone-else' },
      }),
    ]);

    await service.createVisit(visitNow());

    expect(deps.visitRepository.save).toHaveBeenCalledTimes(1);
  });

  it('does not reuse a start-date visit with a different question set', async () => {
    const { service, deps } = makeService([startDateVisit()]);

    await service.createVisit(visitNow({ questionSetId: 'qs-2' }));

    expect(deps.visitRepository.save).toHaveBeenCalledTimes(1);
  });

  describe('on the IST calendar day, as the mobile app matches days', () => {
    it.each([
      ['just after midnight IST', '2026-10-10T18:30:30.000Z'],
      ['03:00 IST, still the start date in UTC', '2026-10-10T21:30:00.000Z'],
    ])(
      'does not reuse the start-date visit the day after, %s',
      async (_, scheduledAt) => {
        const start = startDateVisit();
        const snapshot = { ...start };
        const { service, deps } = makeService([start, mondayVisit()]);

        const visit = await service.createVisit(
          visitNow({ visitScheduledAt: scheduledAt }),
        );

        expect(visit.id).toBe('new-1');
        expect(visit.visitScheduledAt.toISOString()).toBe(scheduledAt);
        expect(deps.visitRepository.save).toHaveBeenCalledTimes(1);
        expect(start).toEqual(snapshot);
      },
    );

    it.each([
      ['02:00 IST, the evening before in UTC', '2026-10-09T20:30:00.000Z'],
      ['10:00 IST', '2026-10-10T04:30:00.000Z'],
      ['23:59 IST', '2026-10-10T18:29:59.000Z'],
    ])(
      'reuses the start-date visit on the start date at %s',
      async (_, scheduledAt) => {
        const { service, deps } = makeService([
          startDateVisit(),
          mondayVisit(),
        ]);

        const visit = await service.createVisit(
          visitNow({ visitScheduledAt: scheduledAt }),
        );

        expect(visit.id).toBe('g-start');
        expect(deps.visitRepository.save).not.toHaveBeenCalled();
      },
    );

    it('returns the visit a request at 03:00 IST the day after created when it is retried', async () => {
      const { service, deps } = makeService([startDateVisit(), mondayVisit()]);
      const request = visitNow({
        visitScheduledAt: '2026-10-10T21:30:00.000Z',
      });

      const first = await service.createVisit(request);
      const retried = await service.createVisit(request);

      expect(first.id).toBe('new-1');
      expect(retried.id).toBe('new-1');
      expect(deps.visitRepository.save).toHaveBeenCalledTimes(1);
    });
  });
});
