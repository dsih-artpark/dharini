import { TeamsService } from './teams.service';

/**
 * A site can have several collectors, so a member's sites come from every
 * site listing them in `sites.collector_id`, not a user -> sites relation.
 */
describe('TeamsService - a member’s sites', () => {
  const collector = (id: string) => ({
    id,
    firstName: id,
    lastName: 'X',
    roles: [{ project: 'p1', role: { name: 'collector' } }],
  });

  const build = (sites: unknown[]) => {
    const siteQuery: any = {
      leftJoinAndSelect: jest.fn(() => siteQuery),
      where: jest.fn(() => siteQuery),
      getMany: jest.fn().mockResolvedValue(sites),
    };
    const dataSource = {
      getRepository: jest.fn(() => ({
        createQueryBuilder: jest.fn(() => siteQuery),
      })),
    };
    const userRoleRepository = {
      find: jest
        .fn()
        .mockResolvedValue([
          { user: collector('u1') },
          { user: collector('u2') },
        ]),
    };
    const teamRepository = {
      findOne: jest.fn().mockResolvedValue({ id: 'team-1' }),
    };
    const noop = {} as never;
    const service = new TeamsService(
      dataSource as never,
      userRoleRepository as never,
      noop, // userService
      teamRepository as never,
      noop, // userRepository
      noop, // projectRepository
      noop, // roleRepository
      noop, // sampleRepository
      noop, // mediaRepository
      noop, // mediaService
      noop, // mailerService
      noop, // cacheService
    );
    return { service, siteQuery };
  };

  it('counts a shared site for each of its collectors', async () => {
    const { service, siteQuery } = build([
      {
        id: 'shared',
        collectorIds: ['u1', 'u2'],
        visits: [{ visitedAt: new Date('2026-10-01T00:00:00Z') }],
      },
      {
        id: 'own',
        collectorIds: ['u2'],
        visits: [{ visitedAt: new Date('2026-10-05T00:00:00Z') }],
      },
    ]);

    const result = await service.getTeamMembersFieldView({
      team: 'team-1',
      projectId: 'p1',
    });

    expect(siteQuery.where).toHaveBeenCalledWith(
      'site.collectorIds && ARRAY[:...userIds]::uuid[]',
      { userIds: ['u1', 'u2'] },
    );
    expect(
      result.docs.map((member) => [
        member.id,
        member.siteCount,
        member.lastVisitedVisit,
      ]),
    ).toEqual([
      ['u1', 1, new Date('2026-10-01T00:00:00Z')],
      ['u2', 2, new Date('2026-10-05T00:00:00Z')],
    ]);
  });
});
