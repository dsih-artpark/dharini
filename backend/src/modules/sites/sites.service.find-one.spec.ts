import { NotFoundException } from '@nestjs/common';
import { DateTime } from 'luxon';
import { QueryFailedError } from 'typeorm';
import { SitesService } from './sites.service';

/**
 * Site details used to load the site, its visits, every visit's samples and
 * the site's samples in one join. The one-to-many trees multiplied each other
 * (235k rows / ~1 GB for one busy site), the query hit the Postgres statement
 * timeout (57014), and a catch-all turned that into a 404. These tests pin the
 * split loading and that only a genuinely missing site is a 404.
 */
describe('SitesService.findOne', () => {
  const SITE_ID = '4d60e8fc-604f-4c10-8da3-c79a65964832';
  const PROJECT_ID = 'P4TOD6';

  const makeService = (site: any) => {
    const deps = {
      mediaService: {
        getSignedFileUrl: jest.fn(
          async (key: string) => `https://signed/${key}`,
        ),
      },
      siteRepository: { findOne: jest.fn().mockResolvedValue(site) },
      visitRepository: { find: jest.fn() },
      sampleRepository: { find: jest.fn() },
      mediaRepository: {
        findBy: jest
          .fn()
          .mockResolvedValue([{ id: 'm1', key: 'photos/a.jpg' }]),
      },
    };

    const service = new SitesService(
      deps.mediaService as any,
      {} as any, // userService
      {} as any, // locationService
      {} as any, // regionService
      {} as any, // process
      deps.siteRepository as any,
      deps.visitRepository as any,
      deps.mediaRepository as any,
      {} as any, // diseaseRepository
      deps.sampleRepository as any,
      {} as any, // projectRepository
      {} as any, // userRepository
      {} as any, // labTestRepository
      {} as any, // tenantScopeService
    );

    return { service, deps };
  };

  const timeout = () =>
    new QueryFailedError(
      'SELECT "Site"."id" FROM "sites" "Site" WHERE "Site"."id" = $1',
      [SITE_ID, PROJECT_ID],
      Object.assign(new Error('canceling statement due to statement timeout'), {
        code: '57014',
      }),
    );

  it('loads visits and samples with their own queries instead of joining them into the site query', async () => {
    const upcoming = DateTime.utc().plus({ days: 3 }).startOf('day');
    const s1 = { id: 'sa1' };
    const s2 = { id: 'sa2' };
    const { service, deps } = makeService({
      id: SITE_ID,
      photos: ['m1'],
      diseases: [
        { id: 'd2', index: 2 },
        { id: 'd1', index: 1 },
      ],
    });
    deps.visitRepository.find.mockResolvedValue([
      {
        id: 'v1',
        isCompleted: false,
        visitStatus: 'upcoming',
        visitScheduledAt: upcoming.toJSDate(),
        samples: [s1, s2],
      },
      {
        id: 'v2',
        isCompleted: true,
        visitStatus: 'completed',
        visitScheduledAt: upcoming.minus({ days: 10 }).toJSDate(),
        samples: [],
      },
    ]);
    deps.sampleRepository.find.mockResolvedValue([s1, s2]);

    const result = await service.findOne({
      id: SITE_ID,
      projectId: PROJECT_ID,
    });

    expect(deps.siteRepository.findOne).toHaveBeenCalledWith({
      where: { id: SITE_ID, project: { id: PROJECT_ID } },
      relations: [
        'project',
        'diseases',
        'collectionCollector',
        'createdBy',
        'createdBy.team',
        'location',
        'location.region',
        'location.region.parentRegion',
      ],
    });
    expect(deps.visitRepository.find).toHaveBeenCalledWith({
      where: { site: { id: SITE_ID } },
      relations: ['samples'],
    });
    expect(deps.sampleRepository.find).toHaveBeenCalledWith({
      where: { site: { id: SITE_ID } },
    });

    expect(result.site.visits.map((v) => [v.id, v.totalSamples])).toEqual([
      ['v1', 2],
      ['v2', 0],
    ]);
    expect(result.site.visits[0].samples).toEqual([s1, s2]);
    expect(result.site.samples).toEqual([s1, s2]);
    expect(result.site.diseases.map((d) => d.id)).toEqual(['d1', 'd2']);
    expect(result.nextCollectionDate).toBe(upcoming.toJSDate().toISOString());
    expect(result.photos).toEqual(['https://signed/photos/a.jpg']);
  });

  it('returns 404 for a missing site without running the visit and sample queries', async () => {
    const { service, deps } = makeService(null);

    const error = await service
      .findOne({ id: SITE_ID, projectId: PROJECT_ID })
      .catch((e) => e);

    expect(error).toBeInstanceOf(NotFoundException);
    expect(error.getStatus()).toBe(404);
    expect(error.message).toBe(`Site with query ${SITE_ID} not found`);
    expect(deps.visitRepository.find).not.toHaveBeenCalled();
    expect(deps.sampleRepository.find).not.toHaveBeenCalled();
  });

  it('returns 404 for a malformed site id without querying the database', async () => {
    const { service, deps } = makeService(null);

    const error = await service
      .findOne({ id: 'local-1791522317127', projectId: PROJECT_ID })
      .catch((e) => e);

    expect(error).toBeInstanceOf(NotFoundException);
    expect(error.getStatus()).toBe(404);
    expect(deps.siteRepository.findOne).not.toHaveBeenCalled();
  });

  it.each([
    ['site', 'siteRepository', 'findOne'],
    ['visits', 'visitRepository', 'find'],
    ['site samples', 'sampleRepository', 'find'],
  ])(
    'lets a database timeout (57014) on the %s query propagate instead of reporting 404',
    async (_label, repo, method) => {
      const { service, deps } = makeService({
        id: SITE_ID,
        photos: [],
        diseases: [],
      });
      deps.visitRepository.find.mockResolvedValue([]);
      deps.sampleRepository.find.mockResolvedValue([]);
      const dbError = timeout();
      deps[repo][method].mockRejectedValue(dbError);

      const error = await service
        .findOne({ id: SITE_ID, projectId: PROJECT_ID })
        .catch((e) => e);

      expect(error).toBe(dbError);
      expect(error).not.toBeInstanceOf(NotFoundException);
    },
  );
});
