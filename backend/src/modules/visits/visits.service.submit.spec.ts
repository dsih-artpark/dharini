import { BadRequestException, NotFoundException } from '@nestjs/common';
import { VisitService } from './visits.service';
import { StatusType } from '../../common/enums/status.enum';
import { VisitStatus } from '../../common/enums/visitStatus.enum';
import { Team } from '../../entities/team.entity';
import { User } from '../../entities/user.entity';
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
    visitedByIds: [],
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
      expect(visit.visitedByIds).toEqual(['u1']);
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

    /**
     * submitVisit holds `FOR UPDATE` on the visit row. Writing suspected
     * positives through visitRepository went out on another pooled
     * connection, whose UPDATE waited on that lock until the statement
     * timeout failed the submission. They must go through the transaction,
     * in its one save of the visit.
     */
    describe('suspected positives', () => {
      const FMD = { id: 'd-fmd', shortName: 'FMD' };
      const LSD = { id: 'd-lsd', shortName: 'LSD' };

      const suspect = (
        diseaseId: string,
        sampleCount: number,
        isSuspectedPositive: boolean,
      ) => JSON.stringify({ diseaseId, sampleCount, isSuspectedPositive });

      const makeTemWithDiseases = (visit: any) => ({
        ...makeTem(visit),
        find: jest.fn(async (_entity: any, { where }: any) =>
          [FMD, LSD].filter((disease) => where.id.value.includes(disease.id)),
        ),
      });

      it('records every disease on the visit inside the transaction, never through visitRepository', async () => {
        const visit = makeVisit({ suspectedPositives: [] });
        const tem = makeTemWithDiseases(visit);
        const { service, deps } = makeService();

        await service.executeSubmissionOfCompleteVisit(
          'v1',
          {
            isCompleted: true,
            visitedBy: 'u1',
            suspectDiseaseData: [
              suspect(FMD.id, 0, false),
              suspect(LSD.id, 2, true),
            ],
          } as any,
          tem as any,
        );

        expect(deps.visitRepository.findOne).not.toHaveBeenCalled();
        expect(deps.visitRepository.save).not.toHaveBeenCalled();
        expect(tem.save).toHaveBeenCalledTimes(1);
        expect(tem.save.mock.calls[0][0].suspectedPositives).toEqual([
          { disease: FMD, sampleCount: 0, isSuspectedPositive: false },
          { disease: LSD, sampleCount: 2, isSuspectedPositive: true },
        ]);
      });

      it('updates a disease already on the visit instead of adding it twice', async () => {
        const visit = makeVisit({
          suspectedPositives: [
            { disease: FMD, sampleCount: 1, isSuspectedPositive: true },
          ],
        });
        const tem = makeTemWithDiseases(visit);
        const { service } = makeService();

        await service.executeSubmissionOfCompleteVisit(
          'v1',
          {
            isCompleted: true,
            visitedBy: 'u1',
            suspectDiseaseData: [suspect(FMD.id, 0, false)],
          } as any,
          tem as any,
        );

        expect(visit.suspectedPositives).toEqual([
          { disease: FMD, sampleCount: 0, isSuspectedPositive: false },
        ]);
      });

      it('refuses a disease that does not exist', async () => {
        const visit = makeVisit({ suspectedPositives: [] });
        const tem = makeTemWithDiseases(visit);
        const { service } = makeService();

        await expect(
          service.executeSubmissionOfCompleteVisit(
            'v1',
            {
              isCompleted: true,
              visitedBy: 'u1',
              suspectDiseaseData: [suspect('d-missing', 1, true)],
            } as any,
            tem as any,
          ),
        ).rejects.toThrow('Disease not found');
        expect(tem.save).not.toHaveBeenCalled();
      });
    });
  });

  /**
   * A site's collectors share its visits, so one visit can be submitted by
   * two of them at once, or by one of them long after another completed it
   * (offline), and a phone resends a submission whose response it lost.
   *
   * `makeDb` stands in for Postgres: a transaction's writes are seen by
   * others only once it commits, and `FOR UPDATE` (setLock) waits for the
   * transaction holding the row. Dropping the lock from submitVisit lets
   * both submissions read the visit as open and fails the concurrency test.
   */
  describe('submitVisit', () => {
    // A sample already on the visit: who collected it, and the original it is
    // a replicate of, by id.
    type CommittedSample = {
      id: string;
      barcode: string;
      collectedBy?: string;
      originalSample?: string;
    };

    // `users` and `projectTeams` answer resolveVisitedByIds' lookups of the
    // visitors a submission names and the project's teams.
    const makeDb = (
      visit: any,
      samples: CommittedSample[],
      {
        users = [] as any[],
        projectTeams = [] as string[],
      }: { users?: any[]; projectTeams?: string[] } = {},
    ) => {
      const db = { visit: visit && { ...visit }, samples: [...samples] };
      let queue = Promise.resolve();
      const lockRow = () => {
        let release!: () => void;
        const held = new Promise<void>((resolve) => (release = resolve));
        const turn = queue.then(() => release);
        queue = queue.then(() => held);
        return turn;
      };
      const locks: string[] = [];

      const transaction = jest.fn(async (work: (tem: any) => unknown) => {
        let unlock: (() => void) | null = null;
        const pending = { visit: null as any, samples: [] as any[] };
        const tem = {
          pending,
          createQueryBuilder: jest.fn((entity: unknown) => {
            let lockMode: string | null = null;
            let params: any = {};
            const qb: any = {
              setLock: jest.fn((mode: string) => {
                lockMode = mode;
                return qb;
              }),
              select: jest.fn(() => qb),
              leftJoinAndSelect: jest.fn(() => qb),
              leftJoin: jest.fn(() => qb),
              innerJoin: jest.fn(() => qb),
              where: jest.fn((_sql: string, where?: any) => {
                params = { ...params, ...where };
                return qb;
              }),
              andWhere: jest.fn(() => qb),
              getOne: jest.fn(async () => {
                if (lockMode) {
                  locks.push(lockMode);
                  unlock = await lockRow();
                }
                return entity === Visit && db.visit ? { ...db.visit } : null;
              }),
              getMany: jest.fn(async () =>
                entity === User
                  ? users.filter((user) => params.ids?.includes(user.id))
                  : db.samples.map(
                      ({ id, barcode, collectedBy, originalSample }) => ({
                        id,
                        barcode,
                        collectedBy: collectedBy ? { id: collectedBy } : null,
                        originalSample: originalSample
                          ? { id: originalSample }
                          : null,
                      }),
                    ),
              ),
              getRawMany: jest.fn(async () =>
                entity === Team ? projectTeams.map((id) => ({ id })) : [],
              ),
            };
            return qb;
          }),
          findOne: jest.fn(async (entity: unknown) =>
            entity === Visit ? { ...db.visit } : { id: 'u' },
          ),
          save: jest.fn(async (v: any) => {
            pending.visit = { ...v };
            return v;
          }),
          update: jest.fn(async (_entity: unknown, _id: string, patch: any) => {
            pending.visit = { ...(pending.visit ?? db.visit), ...patch };
          }),
        };
        try {
          const result = await work(tem);
          if (pending.visit) db.visit = pending.visit;
          db.samples.push(...pending.samples);
          return result;
        } finally {
          unlock?.();
        }
      });

      return { db, transaction, locks };
    };

    // Creates the samples inside the caller's transaction, yielding first so
    // a second submission gets the chance to interleave.
    const createSamples = jest.fn(
      async (
        dto: any,
        _visitId: string,
        _siteId: string,
        _projectId: string,
        _teamId: string,
        collectedBy: string,
        tem: any,
      ) => {
        await new Promise((resolve) => setImmediate(resolve));
        const created = dto.samples.map((sample: any) => ({
          id: `s-${sample.barcode}`,
          barcode: sample.barcode,
          collectedBy,
        }));
        tem.pending.samples.push(...created);
        return created;
      },
    );

    // `visitedBy` is a list, the submitter first, or one id as an app from
    // before visits had several visitors sends it.
    const submission = (visitedBy: string | string[], barcodes: string[]) =>
      ({
        visitData: {
          visitedBy,
          siteId: 'site1',
          projectId: 'p1',
          teamId: 't1',
          isCompleted: true,
          comment: `by ${[visitedBy].flat()[0]}`,
        },
        samples: barcodes.map((barcode) => ({ barcode })),
      }) as any;

    const setup = (
      visit: any,
      samples: CommittedSample[],
      dbOptions?: Parameters<typeof makeDb>[2],
    ) => {
      const { db, transaction, locks } = makeDb(visit, samples, dbOptions);
      createSamples.mockClear();
      const { service, deps } = makeService({
        sampleService: {
          createMultipleSamples: createSamples,
          getSignedUrlForSampleFroVisitSubmit: jest.fn().mockResolvedValue([]),
        },
        collectorRepository: {
          findOne: jest.fn(async ({ where }) => ({
            id: where.id,
            team: { id: 't1' },
          })),
        },
        entityManager: { transaction },
      });
      return { service, deps, db, locks };
    };

    it('locks the visit row before reading it', async () => {
      const { service, locks } = setup(makeVisit(), []);

      await service.submitVisit('v1', submission('u1', ['B-1']));

      expect(locks).toEqual(['pessimistic_write']);
    });

    it('completes a visit submitted by two collectors at once only once, adding the second one only its new samples', async () => {
      const { service, db } = setup(makeVisit(), []);

      await Promise.all([
        service.submitVisit('v1', submission('u1', ['B-1', 'B-2'])),
        service.submitVisit('v1', submission('u2', ['B-2', 'B-3'])),
      ]);

      // The first completes the visit; the second only adds B-3.
      expect(createSamples).toHaveBeenCalledTimes(2);
      expect(
        createSamples.mock.calls.map(([dto, , , , , collectedBy]) => [
          collectedBy,
          dto.samples.map((sample) => sample.barcode),
        ]),
      ).toEqual([
        ['u1', ['B-1', 'B-2']],
        ['u2', ['B-3']],
      ]);
      expect(db.samples.map((sample) => sample.barcode)).toEqual([
        'B-1',
        'B-2',
        'B-3',
      ]);
      expect(db.visit.isCompleted).toBe(true);
      expect(db.visit.visitStatus).toBe(VisitStatus.COMPLETED);
      expect(db.visit.comment).toBe('by u1');
      expect(db.visit.visitedByIds).toEqual(['u1', 'u2']);
    });

    it('adds a late offline submission’s new samples to the completed visit and keeps the visit’s details', async () => {
      const completed = makeVisit({
        isCompleted: true,
        visitStatus: VisitStatus.COMPLETED,
        comment: 'by u1',
        visitedByIds: ['u1'],
      });
      const { service, db } = setup(completed, [{ id: 's1', barcode: 'B-1' }]);

      await service.submitVisit('v1', submission('u2', ['B-1', 'B-9']));

      expect(createSamples).toHaveBeenCalledTimes(1);
      const [dto, visitId, , , , collectedBy] = createSamples.mock.calls[0];
      expect(visitId).toBe('v1');
      expect(collectedBy).toBe('u2');
      expect(dto.samples).toEqual([{ barcode: 'B-9' }]);
      expect(db.samples.map((sample) => sample.barcode)).toEqual([
        'B-1',
        'B-9',
      ]);
      expect(db.visit.comment).toBe('by u1');
      expect(db.visit.visitedByIds).toEqual(['u1', 'u2']);
    });

    it('adds nothing when a completed visit is sent again, even if visitStatus is stale', async () => {
      // The state a lost response leaves behind: samples committed, but the
      // status never promoted because the cron had marked the visit overdue.
      const { service, db } = setup(
        makeVisit({
          isCompleted: true,
          visitStatus: VisitStatus.OVERDUE,
          visitedByIds: ['u1'],
        }),
        [{ id: 's1', barcode: 'B-1' }],
      );

      await service.submitVisit('v1', submission('u1', ['B-1']));

      expect(createSamples).not.toHaveBeenCalled();
      expect(db.samples).toHaveLength(1);
      expect(db.visit.visitedByIds).toEqual(['u1']);
    });

    it('adds nothing when the first submitter resends after the lab corrected a barcode', async () => {
      // The response to u1's submission was lost; meanwhile the lab renamed
      // B-1 to B-1A. The resent B-1 is no longer on the visit by barcode.
      const { service, db } = setup(
        makeVisit({
          isCompleted: true,
          visitStatus: VisitStatus.COMPLETED,
          visitedByIds: ['u1'],
        }),
        [{ id: 's1', barcode: 'B-1A', collectedBy: 'u1' }],
      );

      await service.submitVisit('v1', submission('u1', ['B-1']));

      expect(createSamples).not.toHaveBeenCalled();
      expect(db.samples.map((sample) => sample.barcode)).toEqual(['B-1A']);
    });

    it('adds nothing when a later collector resends the samples they already added', async () => {
      const { service, db } = setup(
        makeVisit({
          isCompleted: true,
          visitStatus: VisitStatus.COMPLETED,
          visitedByIds: ['u1', 'u2'],
        }),
        [
          { id: 's1', barcode: 'B-1', collectedBy: 'u1' },
          { id: 's9', barcode: 'B-9A', collectedBy: 'u2' },
        ],
      );

      await service.submitVisit('v1', submission('u2', ['B-9']));

      expect(createSamples).not.toHaveBeenCalled();
      expect(db.samples).toHaveLength(2);
    });

    it('links a late replicate to its original already on the visit', async () => {
      const { service } = setup(
        makeVisit({
          isCompleted: true,
          visitStatus: VisitStatus.COMPLETED,
          visitedByIds: ['u1'],
        }),
        [
          { id: 's1', barcode: 'B-1', collectedBy: 'u1' },
          {
            id: 's2',
            barcode: 'B-1-R1',
            collectedBy: 'u1',
            originalSample: 's1',
          },
        ],
      );
      const late = submission('u2', []);
      late.samples = [
        { barcode: 'B-1' },
        { barcode: 'B-1-R2', originalSampleBarcode: 'B-1' },
      ];

      await service.submitVisit('v1', late);

      expect(createSamples).toHaveBeenCalledTimes(1);
      const [dto, , , , , collectedBy, , existingOriginals] = createSamples.mock
        .calls[0] as any[];
      expect(collectedBy).toBe('u2');
      expect(dto.samples).toEqual([
        { barcode: 'B-1-R2', originalSampleBarcode: 'B-1' },
      ]);
      // Only originals: a replicate isn't offered as one.
      expect(
        existingOriginals.map((sample: any) => [sample.id, sample.barcode]),
      ).toEqual([['s1', 'B-1']]);
    });

    it('refuses, rather than drops, late samples it cannot add', async () => {
      const { service, db } = setup(
        makeVisit({
          isCompleted: true,
          visitStatus: VisitStatus.COMPLETED,
          visitedByIds: ['u1'],
        }),
        [{ id: 's1', barcode: 'B-1' }],
      );
      createSamples.mockRejectedValueOnce(
        new BadRequestException(
          'Barcodes already exist in database. Duplicate Barcodes: B-7',
        ),
      );

      await expect(
        service.submitVisit('v1', submission('u2', ['B-7'])),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(db.samples.map((sample) => sample.barcode)).toEqual(['B-1']);
      expect(db.visit.visitedByIds).toEqual(['u1']);
    });

    it('still submits a visit that has no samples yet', async () => {
      const { service, db } = setup(
        makeVisit({ visitStatus: VisitStatus.OVERDUE }),
        [],
      );

      await service.submitVisit('v1', submission('u1', ['B-1']));

      expect(createSamples).toHaveBeenCalledTimes(1);
      expect(db.visit.visitStatus).toBe(VisitStatus.COMPLETED);
      expect(db.samples.map((sample) => sample.barcode)).toEqual(['B-1']);
      // A single id, as a submission queued by an older app sends it.
      expect(db.visit.visitedByIds).toEqual(['u1']);
    });

    it('records everyone ticked who is in a team of the project, the submitter first', async () => {
      const { service, db } = setup(makeVisit(), [], {
        projectTeams: ['t1'],
        users: [
          { id: 'u2', team: { id: 't1' }, roles: [] },
          // In the project through a role, not their own team.
          {
            id: 'u3',
            team: null,
            roles: [{ status: StatusType.ACTIVE, project: 'p1', team: 't1' }],
          },
          // A team outside the project.
          { id: 'u4', team: { id: 't9' }, roles: [] },
        ],
      });

      await service.submitVisit(
        'v1',
        submission(['u1', 'u4', 'u2', 'gone', 'u3', 'u2'], ['B-1']),
      );

      expect(db.visit.visitedByIds).toEqual(['u1', 'u2', 'u3']);
      // The samples are still the submitter's.
      const [, , , , , collectedBy] = createSamples.mock.calls[0];
      expect(collectedBy).toBe('u1');
    });

    it('keeps the submitter first even when the list names them later', async () => {
      const { service, db } = setup(makeVisit(), [], {
        projectTeams: ['t1'],
        users: [{ id: 'u2', team: { id: 't1' }, roles: [] }],
      });

      await service.submitVisit('v1', submission(['u1', 'u2', 'u1'], ['B-1']));

      expect(db.visit.visitedByIds).toEqual(['u1', 'u2']);
    });

    it('refuses a submission that names nobody', async () => {
      const { service } = setup(makeVisit(), []);

      await expect(
        service.submitVisit('v1', submission([], ['B-1'])),
      ).rejects.toThrow('User not found');
      expect(createSamples).not.toHaveBeenCalled();
    });

    it("returns 404 for a visit outside the route's project", async () => {
      const { service } = setup(makeVisit(), []);
      const { transaction } = makeDb(null, []);
      (service as any).entityManager = { transaction };

      await expect(
        service.submitVisit('v1', submission('u1', ['B-1']), 'p2'),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(createSamples).not.toHaveBeenCalled();
    });
  });
});
