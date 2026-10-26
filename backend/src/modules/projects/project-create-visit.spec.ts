import { HttpException, HttpStatus } from '@nestjs/common';
import { SitesService } from '../sites/sites.service';
import { ProjectsController } from './projects.controller';

/**
 * Visit creation only needs to know that the site exists in the route's
 * project. It used to call SitesService.findOne(), which loads visits,
 * samples and team members in one join; on busy sites that query hit the
 * Postgres statement timeout (57014) and surfaced as a 404. These tests pin
 * the lightweight, project-scoped check that replaced it.
 */
describe('ProjectsController.createVisit site check', () => {
  const SITE_ID = '4d60e8fc-604f-4c10-8da3-c79a65964832';
  const MISSING_SITE_ID = '11111111-1111-4111-8111-111111111111';

  const makeSiteService = () => {
    const sites = [{ id: SITE_ID, project: { id: 'P4TOD6' } }];
    // Mirrors Repository.existsBy for the where shape existsInProject() uses.
    const siteRepository = {
      existsBy: jest.fn(async (where: any) =>
        sites.some(
          (site) =>
            site.id === where.id && site.project.id === where.project?.id,
        ),
      ),
    };
    const siteService = new SitesService(
      {} as any, // mediaService
      {} as any, // userService
      {} as any, // locationService
      {} as any, // regionService
      {} as any, // process
      siteRepository as any,
      {} as any, // visitRepository
      {} as any, // mediaRepository
      {} as any, // diseaseRepository
      {} as any, // sampleRepository
      {} as any, // projectRepository
      {} as any, // userRepository
      {} as any, // labTestRepository
      {} as any, // tenantScopeService
    );
    const findOne = jest.spyOn(siteService, 'findOne');
    return { siteService, siteRepository, findOne };
  };

  const createVisit = (
    siteService: SitesService,
    projectId: string,
    siteId: string,
  ) => {
    const visitService = {
      createVisit: jest.fn(async (dto: any) => ({ id: 'v1', ...dto })),
    };
    const dto = {
      siteId,
      collectorId: '3f3d4ae4-b6be-4bdc-ab8f-906bdd1f356f',
      visitScheduledAt: '2026-10-09T08:40:39.297Z',
      comment: 'New Visit',
    };
    const result = ProjectsController.prototype.createVisit.call(
      { siteService, visitService },
      projectId,
      dto as any,
    );
    return { result, visitService, dto };
  };

  const expectNotFound = async (promise: Promise<unknown>, siteId: string) => {
    const error = (await promise.catch((e) => e)) as HttpException;
    expect(error).toBeInstanceOf(HttpException);
    expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
    expect(error.message).toBe(`Site not found for siteId ${siteId}`);
  };

  it('creates the visit when the site exists in the project', async () => {
    const { siteService, siteRepository, findOne } = makeSiteService();
    const { result, visitService, dto } = createVisit(
      siteService,
      'P4TOD6',
      SITE_ID,
    );

    await expect(result).resolves.toMatchObject({ success: true });
    expect(siteRepository.existsBy).toHaveBeenCalledWith({
      id: SITE_ID,
      project: { id: 'P4TOD6' },
    });
    expect(visitService.createVisit).toHaveBeenCalledWith({
      ...dto,
      projectId: 'P4TOD6',
    });
    expect(findOne).not.toHaveBeenCalled();
  });

  it('returns 404 when the site does not exist', async () => {
    const { siteService, findOne } = makeSiteService();
    const { result, visitService } = createVisit(
      siteService,
      'P4TOD6',
      MISSING_SITE_ID,
    );

    await expectNotFound(result, MISSING_SITE_ID);
    expect(visitService.createVisit).not.toHaveBeenCalled();
    expect(findOne).not.toHaveBeenCalled();
  });

  it('returns 404 when the site belongs to a different project', async () => {
    const { siteService, siteRepository } = makeSiteService();
    const { result, visitService } = createVisit(
      siteService,
      'P88IUH',
      SITE_ID,
    );

    await expectNotFound(result, SITE_ID);
    expect(siteRepository.existsBy).toHaveBeenCalledWith({
      id: SITE_ID,
      project: { id: 'P88IUH' },
    });
    expect(visitService.createVisit).not.toHaveBeenCalled();
  });

  it('returns 404 for a malformed site id without querying the database', async () => {
    const { siteService, siteRepository } = makeSiteService();
    const { result, visitService } = createVisit(
      siteService,
      'P4TOD6',
      'local-1791522317127',
    );

    await expectNotFound(result, 'local-1791522317127');
    expect(siteRepository.existsBy).not.toHaveBeenCalled();
    expect(visitService.createVisit).not.toHaveBeenCalled();
  });
});
