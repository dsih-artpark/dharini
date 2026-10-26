import { GeoLensService } from './geolens.service';

describe('GeoLensService.getSites', () => {
  const siteRows = [
    { id: 's1', name: 'Site 1', lat: 13.1, lng: 77.5, state: 'Karnataka' },
  ];
  const member = { isSystem: false, projectIds: ['p1', 'p2'] };
  const superAdmin = { isSystem: true, projectIds: [] };

  const build = (tenant: object, workspaceProjectIds: string[] = []) => {
    const siteRepo = { query: jest.fn().mockResolvedValue(siteRows) };
    const projectRepo = {
      find: jest
        .fn()
        .mockResolvedValue(workspaceProjectIds.map((id) => ({ id }))),
    };
    const tenantScopeService = {
      forUser: jest.fn().mockResolvedValue(tenant),
    };
    const unused = {} as any;
    const service = new GeoLensService(
      unused, // wetlands
      unused, // poultry farms
      unused, // water boundaries
      unused, // cattle markets
      siteRepo as any,
      unused, // diseases
      projectRepo as any,
      tenantScopeService as any,
    );
    return { service, siteRepo, projectRepo };
  };

  it('without a workspace, returns the sites of every reachable project', async () => {
    const { service, siteRepo, projectRepo } = build(member);

    await expect(service.getSites({})).resolves.toHaveLength(1);
    expect(projectRepo.find).not.toHaveBeenCalled();
    expect(siteRepo.query.mock.calls[0][1]).toEqual([['p1', 'p2']]);
  });

  it('narrows to the reachable projects of the selected workspace', async () => {
    const { service, siteRepo, projectRepo } = build(member, ['p2', 'p3']);

    await service.getSites({}, 'ws-1');

    expect(projectRepo.find).toHaveBeenCalledWith({
      where: { workspace: { id: 'ws-1' } },
      select: ['id'],
    });
    expect(siteRepo.query.mock.calls[0][1]).toEqual([['p2']]);
  });

  it('returns nothing for a workspace the caller has no projects in', async () => {
    const { service, siteRepo } = build(member, ['p9']);

    await expect(service.getSites({}, 'ws-other')).resolves.toEqual([]);
    expect(siteRepo.query).not.toHaveBeenCalled();
  });

  it('gives a super-admin every project in the selected workspace', async () => {
    const { service, siteRepo } = build(superAdmin, ['p3', 'p4']);

    await service.getSites({}, 'ws-1');

    const [sql, params] = siteRepo.query.mock.calls[0];
    expect(sql).toContain('WHERE s."projectId" = ANY($1::text[])');
    expect(params).toEqual([['p3', 'p4']]);
  });

  it('gives a super-admin every site when no workspace is selected', async () => {
    const { service, siteRepo } = build(superAdmin);

    await service.getSites({});

    const [sql, params] = siteRepo.query.mock.calls[0];
    expect(sql).not.toContain('WHERE');
    expect(params).toEqual([]);
  });
});
