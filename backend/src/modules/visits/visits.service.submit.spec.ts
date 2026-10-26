import { VisitService } from './visits.service';
import { VisitStatus } from '../../common/enums/visitStatus.enum';
import { Visit } from '../../entities/visit.entity';

/**
 * These tests pin the behaviour that submitting a visit the scheduling cron has
 * already flipped to OVERDUE must (a) still mark the visit COMPLETED and (b) be
 * idempotent when the offline-first mobile client re-sends it.
 *
 * `executeSubmissionOfCompleteVisit` used to promote `visitStatus` only when it
 * was still UPCOMING, so an overdue visit committed its samples while keeping
 * `visitStatus = 'overdue'`. The idempotency guard in `submitVisit` required
 * `visitStatus === COMPLETED`, so every retry fell through to sample creation
 * and died on the duplicate-barcode check with a permanent HTTP 400 — the
 * submission could never drain from the phone's sync queue.
 */
describe('VisitService visit submission', () => {
  const makeVisit = (overrides: any = {}) => ({
    id: 'v1',
    isCompleted: false,
    visitStatus: VisitStatus.UPCOMING,
    samples: [],
    site: { id: 'site1' },
    project: { id: 'p1' },
    ...overrides,
  });

  const makeTem = (visit: any) => ({
    findOne: jest.fn(async (entity: any) =>
      entity === Visit ? visit : { id: 'u1' },
    ),
    save: jest.fn(async (v: any) => v),
  });

  const makeService = (over: any = {}) => {
    const deps = {
      sampleService: {
        createMultipleSamples: jest.fn().mockResolvedValue([{ id: 's1' }]),
        getSignedUrlForSampleFroVisitSubmit: jest.fn().mockResolvedValue([]),
      },
      visitRepository: { findOne: jest.fn(), save: jest.fn(async (v) => v) },
      collectorRepository: {
        findOne: jest.fn().mockResolvedValue({ id: 'u1', team: { id: 't1' } }),
      },
      mediaRepository: { create: jest.fn(), save: jest.fn() },
      entityManager: { transaction: jest.fn() },
      tenantScopeService: {
        forUser: jest.fn().mockResolvedValue({
          isSystem: true,
          projectIds: [],
          teamIds: [],
          workspaceIds: [],
          scope: null,
        }),
      },
      ...over,
    };

    const service = new VisitService(
      {} as any, // multerConfigService
      deps.sampleService as any,
      {} as any, // visitSchedulerQueue
      deps.visitRepository as any,
      {} as any, // siteRepository
      {} as any, // projectRepository
      deps.collectorRepository as any,
      {} as any, // diseaseRepository
      {} as any, // teamRepository
      deps.mediaRepository as any,
      deps.entityManager as any,
      deps.tenantScopeService as any,
    );

    return { service, deps };
  };

  const submitDto = (over: any = {}) =>
    ({
      visitData: {
        visitedBy: 'u1',
        siteId: 'site1',
        projectId: 'p1',
        teamId: 't1',
        isCompleted: true,
        ...over,
      },
      samples: [{ barcode: 'B-1' }],
    }) as any;

  describe('executeSubmissionOfCompleteVisit', () => {
    it('marks an OVERDUE visit COMPLETED on submission', async () => {
      const visit = makeVisit({ visitStatus: VisitStatus.OVERDUE });
      const { service } = makeService();

      await service.executeSubmissionOfCompleteVisit(
        'v1',
        { isCompleted: true, visitedBy: 'u1' } as any,
        makeTem(visit) as any,
      );

      expect(visit.visitStatus).toBe(VisitStatus.COMPLETED);
      expect(visit.isCompleted).toBe(true);
    });

    it('still marks an UPCOMING visit COMPLETED on submission', async () => {
      const visit = makeVisit({ visitStatus: VisitStatus.UPCOMING });
      const { service } = makeService();

      await service.executeSubmissionOfCompleteVisit(
        'v1',
        { isCompleted: true, visitedBy: 'u1' } as any,
        makeTem(visit) as any,
      );

      expect(visit.visitStatus).toBe(VisitStatus.COMPLETED);
      expect(visit.isCompleted).toBe(true);
    });

    it('does not resurrect a SKIPPED visit that was not submitted', async () => {
      const visit = makeVisit({ visitStatus: VisitStatus.SKIPPED });
      const { service } = makeService();

      await service.executeSubmissionOfCompleteVisit(
        'v1',
        { isCompleted: false } as any,
        makeTem(visit) as any,
      );

      expect(visit.visitStatus).toBe(VisitStatus.SKIPPED);
      expect(visit.isCompleted).toBe(false);
    });
  });

  describe('submitVisit idempotency', () => {
    it('does not recreate samples when the visit already has them, even if visitStatus is stale', async () => {
      // The state a lost response leaves behind: samples committed, but the
      // status never promoted because the cron had marked the visit overdue.
      const existing = makeVisit({
        isCompleted: true,
        visitStatus: VisitStatus.OVERDUE,
        samples: [{ id: 's1', barcode: 'B-1' }],
      });
      const { service, deps } = makeService({
        visitRepository: {
          findOne: jest.fn().mockResolvedValue(existing),
          save: jest.fn(async (v: any) => v),
        },
      });

      await service.submitVisit('v1', submitDto());

      expect(deps.sampleService.createMultipleSamples).not.toHaveBeenCalled();
      expect(deps.entityManager.transaction).not.toHaveBeenCalled();
    });

    it('still submits a visit that has no samples yet', async () => {
      const existing = makeVisit({ visitStatus: VisitStatus.OVERDUE });
      const tem = makeTem(existing);
      const { service, deps } = makeService({
        visitRepository: {
          findOne: jest.fn().mockResolvedValue(existing),
          save: jest.fn(async (v: any) => v),
        },
        entityManager: {
          transaction: jest.fn(async (cb: any) => cb(tem)),
        },
      });

      await service.submitVisit('v1', submitDto());

      expect(deps.sampleService.createMultipleSamples).toHaveBeenCalled();
      expect(existing.visitStatus).toBe(VisitStatus.COMPLETED);
    });
  });
});
