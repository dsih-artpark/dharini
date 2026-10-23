import {
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DateTime } from 'luxon';
import { QueryFailedError } from 'typeorm';
import { SiteResponse } from 'src/common/dto/response/site.response';
import { SitesService } from '../sites/sites.service';
import { ProjectsController } from './projects.controller';

/**
 * GET /projects/:projectId/sites/:siteId used to answer every failure with a
 * 404, so a site that timed out looked like a site that does not exist. Only
 * a missing site is a 404 now; anything else is a generic 500 that keeps the
 * SQL and its parameters out of the response.
 */
describe('ProjectsController.findSite', () => {
  const SITE_ID = '4d60e8fc-604f-4c10-8da3-c79a65964832';
  const PROJECT_ID = 'P4TOD6';

  const makeSiteService = () => {
    const repos = {
      siteRepository: { findOne: jest.fn() },
      visitRepository: { find: jest.fn().mockResolvedValue([]) },
      sampleRepository: { find: jest.fn().mockResolvedValue([]) },
      mediaRepository: {
        findBy: jest
          .fn()
          .mockResolvedValue([{ id: 'm1', key: 'photos/a.jpg' }]),
      },
    };
    const siteService = new SitesService(
      {
        getSignedFileUrl: async (key: string) => `https://signed/${key}`,
      } as any,
      {} as any, // userService
      {} as any, // locationService
      {} as any, // regionService
      {} as any, // process
      repos.siteRepository as any,
      repos.visitRepository as any,
      repos.mediaRepository as any,
      {} as any, // diseaseRepository
      repos.sampleRepository as any,
      {} as any, // projectRepository
      {} as any, // userRepository
      {} as any, // labTestRepository
      {} as any, // tenantScopeService
    );
    return { siteService, repos };
  };

  const findSite = (siteService: SitesService) => {
    const logger = { error: jest.fn() };
    const result = ProjectsController.prototype.findSite.call(
      { siteService, logger },
      PROJECT_ID,
      SITE_ID,
      { user: { id: 'u1' } },
    );
    return { result, logger };
  };

  it('returns 404 for a missing site', async () => {
    const { siteService, repos } = makeSiteService();
    repos.siteRepository.findOne.mockResolvedValue(null);

    const error = (await findSite(siteService).result.catch(
      (e) => e,
    )) as HttpException;

    expect(error).toBeInstanceOf(HttpException);
    expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
    expect(error.message).toBe(`Site with query ${SITE_ID} not found`);
  });

  it('returns a generic 500 for a database timeout without exposing SQL or parameters', async () => {
    const { siteService, repos } = makeSiteService();
    repos.siteRepository.findOne.mockRejectedValue(
      new QueryFailedError(
        'SELECT "Site"."id" FROM "sites" "Site" WHERE "Site"."id" = $1',
        [SITE_ID, PROJECT_ID],
        Object.assign(
          new Error('canceling statement due to statement timeout'),
          { code: '57014' },
        ),
      ),
    );

    const { result, logger } = findSite(siteService);
    const error = (await result.catch((e) => e)) as HttpException;

    expect(error).toBeInstanceOf(HttpException);
    expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(error.message).toBe('An error occurred while fetching the site');
    const body = JSON.stringify(error.getResponse());
    expect(body).not.toContain('SELECT');
    expect(body).not.toContain(PROJECT_ID);
    expect(body).not.toContain(SITE_ID);
    expect(body).not.toContain('statement timeout');
    expect(logger.error).toHaveBeenCalledWith(
      `Failed to fetch site ${SITE_ID} in project ${PROJECT_ID}`,
      expect.stringContaining('canceling statement due to statement timeout'),
    );
  });

  it('keeps the serialized response keys and derived fields', async () => {
    const upcoming = DateTime.utc().plus({ days: 3 }).startOf('day').toJSDate();
    const user = (id: string, team: any = null) => ({
      id,
      firstName: 'First',
      lastName: 'Last',
      team,
    });
    const sample = { id: 'sa1', barcode: 'B1' };
    const { siteService, repos } = makeSiteService();
    repos.siteRepository.findOne.mockResolvedValue({
      id: SITE_ID,
      name: 'Farm',
      siteCode: '5000001',
      status: 'active',
      photos: ['m1'],
      project: { id: PROJECT_ID, name: 'Project' },
      diseases: [{ id: 'd1', name: 'Avian Influenza', index: 0 }],
      collectionCollector: user('u-col'),
      createdBy: user('u-cre', {
        id: 't1',
        teamName: 'Team',
        members: [user('m1'), user('m2')],
      }),
      location: {
        id: 'l1',
        region: { id: 'r1', parentRegion: { id: 'r0' } },
      },
    });
    repos.visitRepository.find.mockResolvedValue([
      {
        id: 'v1',
        isCompleted: false,
        visitStatus: 'upcoming',
        visitScheduledAt: upcoming,
        samples: [sample],
      },
    ]);
    repos.sampleRepository.find.mockResolvedValue([sample]);

    const response = await findSite(siteService).result;
    const serialized: any = new ClassSerializerInterceptor(
      new Reflector(),
    ).serialize(
      response as any,
      {
        type: SiteResponse,
        exposeDefaultValues: true,
      } as any,
    );

    expect(serialized.success).toBe(true);
    const data = serialized.data;
    expect(Object.keys(data).sort()).toEqual(
      [
        'id',
        'name',
        'siteCode',
        'status',
        'photos',
        'project',
        'diseases',
        'collectionCollector',
        'createdBy',
        'location',
        'visits',
        'samples',
        'nextCollectionDate',
      ].sort(),
    );
    expect(data.photos).toEqual(['https://signed/photos/a.jpg']);
    expect(data.nextCollectionDate).toBe(upcoming.toISOString());
    expect(data.visits[0]).toMatchObject({
      id: 'v1',
      totalSamples: 1,
      samples: [sample],
    });
    expect(data.samples).toEqual([sample]);
    expect(data.createdBy.team.id).toBe('t1');
    expect(data.createdBy.team.members).toHaveLength(2);
    expect(data.location.region.parentRegion.id).toBe('r0');
  });
});
