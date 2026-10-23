import { StatusType } from '../../common/enums/status.enum';
import { ProjectsService } from './projects.service';

/**
 * Regression cover for the collector dropdown listing only one name.
 *
 * `Team.members` is `@OneToMany(User, user => user.team)` - it reflects only
 * the singular, deliberately immutable `users.teamId` FK. Members added via
 * addTeamMember get a `user_roles` row and never touch that FK, so reading
 * membership off `team.members` returned just the user the team was created
 * around. Membership has to come from `user_roles`.
 *
 * Built by calling the constructor directly: `getMembers` touches only the
 * team and user-role repositories out of 22 injected dependencies.
 */
describe('ProjectsService.getMembers', () => {
  const PROJECT_ID = 'project-1';

  const samplePermission = { action: 'create', subject: 'sample' };
  const collectorRole = {
    role: { permissions: [samplePermission] },
  };

  // A caller holding `manage all`, i.e. a super admin.
  const CALLER = {
    id: 'caller-1',
    roles: [{ role: { permissions: [{ action: 'manage', subject: 'all' }] } }],
  };

  const collector = (id: string, firstName: string) => ({
    id,
    firstName,
    lastName: 'X',
    email: `${id}@example.com`,
    roles: [collectorRole],
  });

  let teamRepository: { find: jest.Mock };
  let userRoleRepository: { find: jest.Mock };
  let service: ProjectsService;

  const buildService = (
    teams: unknown[],
    userRoles: unknown[],
  ): ProjectsService => {
    teamRepository = { find: jest.fn().mockResolvedValue(teams) };
    userRoleRepository = { find: jest.fn().mockResolvedValue(userRoles) };

    const noop = {} as never;
    return new ProjectsService(
      noop,
      noop,
      noop,
      noop,
      noop,
      noop,
      noop,
      noop,
      noop,
      teamRepository as never, // 10: teamRepository
      noop,
      noop,
      noop,
      userRoleRepository as never, // 14: userRoleRepository
      noop,
      noop,
      noop,
      noop,
      noop,
      noop,
      noop,
      noop,
    );
  };

  it('returns members that exist only as user_roles rows', async () => {
    // The team lead is the sole holder of the `users.teamId` FK; the two
    // collectors were added later and exist only as user_roles.
    service = buildService(
      [{ id: 'team-1', members: [collector('lead-1', 'Teamlead')] }],
      [
        { user: collector('collector-1', 'Collector One') },
        { user: collector('collector-2', 'Collector Two') },
      ],
    );

    const members = await service.getMembers(PROJECT_ID, CALLER as never);

    expect(members.map((m) => m.firstName).sort()).toEqual([
      'Collector One',
      'Collector Two',
      'Teamlead',
    ]);
  });

  it('scopes the user_roles lookup to this project and active rows', async () => {
    service = buildService([{ id: 'team-1', members: [] }], []);

    await service.getMembers(PROJECT_ID, CALLER as never);

    expect(userRoleRepository.find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          project: PROJECT_ID,
          status: StatusType.ACTIVE,
        }),
      }),
    );
  });

  it('does not list the same person twice when both sources hold them', async () => {
    const both = collector('user-1', 'Only Once');
    service = buildService(
      [{ id: 'team-1', members: [both] }],
      [{ user: both }],
    );

    const members = await service.getMembers(PROJECT_ID, CALLER as never);

    expect(members).toHaveLength(1);
    expect(members[0].id).toBe('user-1');
  });

  // Note: a `manage all` caller does not itself hold `create sample`, so this
  // takes the exclusion branch rather than the collector-only one. That means
  // the list a super admin sees is "everyone on the team except other super
  // admins", not "collectors only" - pre-existing behaviour, unchanged here.
  it('still filters out other super admins', async () => {
    service = buildService(
      [{ id: 'team-1', members: [] }],
      [
        { user: collector('collector-1', 'Collector One') },
        {
          user: {
            id: 'superadmin-1',
            firstName: 'Super',
            lastName: 'Admin',
            email: 'super@example.com',
            roles: [
              { role: { permissions: [{ action: 'manage', subject: 'all' }] } },
            ],
          },
        },
      ],
    );

    const members = await service.getMembers(PROJECT_ID, CALLER as never);

    expect(members.map((m) => m.id)).toEqual(['collector-1']);
  });

  it('returns only sample-collecting members when the caller is a collector', async () => {
    const collectorCaller = {
      id: 'caller-2',
      roles: [collectorRole],
      team: { id: 'team-1' },
    };

    service = buildService(
      [{ id: 'team-1', members: [] }],
      [
        { user: collector('collector-1', 'Collector One') },
        {
          user: {
            id: 'labadmin-1',
            firstName: 'Lab',
            lastName: 'Admin',
            email: 'lab@example.com',
            roles: [
              {
                role: {
                  permissions: [{ action: 'read', subject: 'sample' }],
                },
              },
            ],
          },
        },
      ],
    );

    const members = await service.getMembers(
      PROJECT_ID,
      collectorCaller as never,
    );

    expect(members.map((m) => m.id)).toEqual(['collector-1']);
  });

  it('skips the user_roles query entirely when no team is in scope', async () => {
    service = buildService([], []);

    const members = await service.getMembers(PROJECT_ID, CALLER as never);

    expect(members).toEqual([]);
    expect(userRoleRepository.find).not.toHaveBeenCalled();
  });
});
