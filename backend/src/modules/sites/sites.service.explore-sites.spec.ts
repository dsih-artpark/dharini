import { Scope } from 'src/common/enums/scope.enum';
import { SitesService } from './sites.service';

/**
 * GET /statistics/explore-sites lists positive sites per disease and the
 * disease-free sites. Each point carries its site id, so GeoLens Compare can
 * narrow its Site A/B list to the sites listed for its filters.
 */
describe('SitesService.exploreSites site ids', () => {
  const coords = (lng: number) => ({ type: 'Point', coordinates: [lng, 13] });
  // Per (disease, site), then per site - the two lab-test queries' rows
  const diseaseRows = [
    {
      diseaseId: 'hpai',
      siteId: 'site-pos',
      siteName: 'Positive Lake',
      farmType: 'farm',
      location_coordinates: coords(1),
      positiveSite: '1',
      totalPositiveSamples: '2',
      totalNegativeSamples: '0',
      totalUnclearSamples: '0',
      totalSampleCount: '2',
    },
    {
      diseaseId: 'hpai',
      siteId: 'site-neg',
      siteName: 'Negative Pond',
      farmType: 'farm',
      location_coordinates: coords(2),
      positiveSite: '0',
      totalPositiveSamples: '0',
      totalNegativeSamples: '3',
      totalUnclearSamples: '0',
      totalSampleCount: '3',
    },
  ];
  const siteRows = [
    {
      siteId: 'site-pos',
      siteName: 'Positive Lake',
      farmType: 'farm',
      diseaseShortName: 'HPAI',
      location_coordinates: coords(1),
      totalSampleCount: '2',
      totalPositiveSamples: '2',
      totalNegativeSamples: '0',
      totalUnclearSamples: '0',
      diseaseFreeSite: '0',
    },
    {
      siteId: 'site-neg',
      siteName: 'Negative Pond',
      farmType: 'farm',
      diseaseShortName: 'HPAI',
      location_coordinates: coords(2),
      totalSampleCount: '3',
      totalPositiveSamples: '0',
      totalNegativeSamples: '3',
      totalUnclearSamples: '0',
      diseaseFreeSite: '1',
    },
  ];

  const explore = () => {
    const qb: any = {};
    for (const method of [
      'leftJoin',
      'where',
      'andWhere',
      'select',
      'groupBy',
      'setParameter',
      'having',
    ]) {
      qb[method] = jest.fn(() => qb);
    }
    qb.getRawMany = jest
      .fn()
      .mockResolvedValueOnce(diseaseRows)
      .mockResolvedValueOnce(siteRows);

    const service = new SitesService(
      {} as any, // mediaService
      {} as any, // userService
      {} as any, // locationService
      {} as any, // regionService
      {} as any, // process
      {} as any, // siteRepository
      {} as any, // visitRepository
      {} as any, // mediaRepository
      {
        find: jest.fn().mockResolvedValue([
          {
            id: 'hpai',
            name: 'Avian influenza',
            shortName: 'HPAI',
            index: 1,
            sites: [],
          },
        ]),
      } as any, // diseaseRepository
      {} as any, // sampleRepository
      {} as any, // projectRepository
      {} as any, // userRepository
      { createQueryBuilder: jest.fn(() => qb) } as any, // labTestRepository
      {
        forUser: jest.fn().mockResolvedValue({
          scope: Scope.Project,
          isSystem: false,
          projectIds: ['p-1'],
          teamIds: [],
          workspaceIds: [],
        }),
      } as any, // tenantScopeService
    );
    return service.exploreSites({ user: { id: 'u1', roles: [] } } as any);
  };

  it('each positive site point carries its site id', async () => {
    const data: any = await explore();
    const hpai = data.siteData.find((d) => d.diseaseId === 'hpai');
    expect(hpai.positiveSitesCoordinates).toEqual([
      expect.objectContaining({
        siteId: 'site-pos',
        siteName: 'Positive Lake',
      }),
    ]);
  });

  it('each disease-free site point carries its site id', async () => {
    const data: any = await explore();
    expect(data.diseaseFreeSiteCount).toBe(1);
    expect(data.diseaseFreeSitesCoordinates).toEqual([
      expect.objectContaining({
        siteId: 'site-neg',
        siteName: 'Negative Pond',
      }),
    ]);
  });

  it('keeps the rest of each point as before', async () => {
    const data: any = await explore();
    expect(data.siteData[0].positiveSitesCoordinates[0]).toEqual({
      siteId: 'site-pos',
      coordinates: coords(1),
      totalPositiveSampleCount: 2,
      totalNegativeSampleCount: 0,
      totalUnclearSampleCount: 0,
      totalSampleCount: 2,
      siteName: 'Positive Lake',
      farmType: 'farm',
      shortName: 'HPAI',
    });
    expect(data.diseaseFreeSitesCoordinates[0]).toEqual({
      siteId: 'site-neg',
      coordinates: coords(2),
      totalPositiveSampleCount: 0,
      totalNegativeSampleCount: 3,
      totalUnclearSampleCount: 0,
      totalSampleCount: 3,
      siteName: 'Negative Pond',
      farmType: 'farm',
      shortName: 'HPAI',
    });
  });
});
