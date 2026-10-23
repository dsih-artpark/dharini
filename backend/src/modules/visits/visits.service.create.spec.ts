import { BadRequestException } from '@nestjs/common';
import { VisitService } from './visits.service';

/**
 * A collector with no primary team (`users.teamId` NULL, e.g. a Super Admin
 * creating a visit for themselves) used to crash on `collector.team.id` with
 * a TypeError and surface as HTTP 500. It is now a 400 with a message the
 * mobile app can show as-is.
 */
describe('VisitService.createVisit collector team', () => {
  const makeService = (collector: any) => {
    const deps = {
      visitRepository: {
        create: jest.fn((v) => v),
        save: jest.fn(async (v) => v),
        find: jest.fn().mockResolvedValue([]), // no visit to reuse
      },
      siteRepository: { findOneBy: jest.fn().mockResolvedValue({ id: 's1' }) },
      projectRepository: {
        findOneBy: jest.fn().mockResolvedValue({ id: 'p1' }),
      },
      collectorRepository: { findOne: jest.fn().mockResolvedValue(collector) },
      teamRepository: { findOne: jest.fn().mockResolvedValue({ id: 't1' }) },
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
      {} as any, // entityManager
      {} as any, // tenantScopeService
    );

    return { service, deps };
  };

  const dto = {
    siteId: 's1',
    collectorId: 'u1',
    projectId: 'p1',
    visitScheduledAt: '2026-10-09T08:40:39.297Z',
    comment: 'New Visit',
  } as any;

  it('rejects with 400 when the collector has no assigned team', async () => {
    const { service, deps } = makeService({ id: 'u1', team: null });

    const error = await service.createVisit(dto).catch((e) => e);

    expect(error).toBeInstanceOf(BadRequestException);
    expect(error.getStatus()).toBe(400);
    expect(error.message).toBe(
      "You cannot create a visit because you don't have an assigned team.",
    );
    expect(deps.teamRepository.findOne).not.toHaveBeenCalled();
    expect(deps.visitRepository.save).not.toHaveBeenCalled();
  });

  it("creates the visit with the collector's team when one is assigned", async () => {
    const { service, deps } = makeService({ id: 'u1', team: { id: 't1' } });

    const visit = await service.createVisit(dto);

    expect(deps.teamRepository.findOne).toHaveBeenCalledWith({
      where: { id: 't1' },
    });
    expect(deps.visitRepository.save).toHaveBeenCalled();
    expect(visit).toMatchObject({
      collector: { id: 'u1', team: { id: 't1' } },
      team: { id: 't1' },
    });
  });
});
