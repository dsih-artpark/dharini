import { StatusType } from '../../common/enums/status.enum';
import { ProjectsService } from './projects.service';

/**
 * Regression cover for the team-progress screens showing only one member per
 * team.
 *
 * `teamMemberActivity` (/:projectId/team-member-activity) and
 * `teamMemberProgress` (/:projectId/team-member-progress) both built their
 * member list with `teams.flatMap(team => team.members)`. `Team.members` is
 * @OneToMany(User, user => user.team), so it reflects only the singular
 * `users.teamId` FK that addTeamMember deliberately never sets - the list was
 * just the user each team was created around.
 *
 * Both now go through resolveProjectTeamMembers, which reads `user_roles`.
 */
describe('ProjectsService.resolveProjectTeamMembers', () => {
  const PROJECT = 'PRHG5Z';

  const user = (id: string, firstName: string) => ({
    id,
    firstName,
    lastName: 'X',
    email: `${id}@example.com`,
  });

  let teamRepository: { find: jest.Mock };
  let userRoleRepository: { find: jest.Mock };
  let service: ProjectsService;

  const build = (teams: unknown[], userRoles: unknown[]) => {
    teamRepository = { find: jest.fn().mockResolvedValue(teams) };
    userRoleRepository = { find: jest.fn().mockResolvedValue(userRoles) };

    const noop = {} as never;
    service = new ProjectsService(
      noop,
      noop,
      noop,
      noop,
      noop,
      noop,
      noop,
      noop,
      noop,
      teamRepository as never, // 10
      noop,
      noop,
      noop,
      userRoleRepository as never, // 14
      noop,
      noop,
      noop,
      noop,
      noop,
      noop,
      noop,
      noop,
    );
    // Private by design - this is the seam the two public methods share.
    return (projectId: string) =>
      (
        service as unknown as {
          resolveProjectTeamMembers: (p: string) => Promise<{
            members: { id: string; firstName?: string }[];
            memberTeamMap: Map<string, string>;
          }>;
        }
      ).resolveProjectTeamMembers(projectId);
  };

  it('includes members that exist only as user_roles rows', async () => {
    const resolve = build(
      [{ id: 'team-1', members: [user('lead-1', 'Teamlead')] }],
      [
        { user: user('collector-1', 'Collector One'), team: 'team-1' },
        { user: user('collector-2', 'Collector Two'), team: 'team-1' },
      ],
    );

    const { members } = await resolve(PROJECT);

    expect(members.map((m) => m.firstName).sort()).toEqual([
      'Collector One',
      'Collector Two',
      'Teamlead',
    ]);
  });

  it('scopes the user_roles lookup to this project and active rows', async () => {
    const resolve = build([{ id: 'team-1', members: [] }], []);

    await resolve(PROJECT);

    expect(userRoleRepository.find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          project: PROJECT,
          status: StatusType.ACTIVE,
        }),
      }),
    );
  });

  it('maps each member to the team their membership belongs to', async () => {
    const resolve = build(
      [
        { id: 'team-1', members: [] },
        { id: 'team-2', members: [] },
      ],
      [
        { user: user('a', 'A'), team: 'team-1' },
        { user: user('b', 'B'), team: 'team-2' },
      ],
    );

    const { memberTeamMap } = await resolve(PROJECT);

    expect(memberTeamMap.get('a')).toBe('team-1');
    expect(memberTeamMap.get('b')).toBe('team-2');
  });

  it('does not list the same person twice when both sources hold them', async () => {
    const shared = user('user-1', 'Only Once');
    const resolve = build(
      [{ id: 'team-1', members: [shared] }],
      [{ user: shared, team: 'team-1' }],
    );

    const { members } = await resolve(PROJECT);

    expect(members).toHaveLength(1);
  });

  it('keeps legacy FK-only members', async () => {
    const resolve = build(
      [{ id: 'team-1', members: [user('legacy-1', 'Legacy')] }],
      [],
    );

    const { members, memberTeamMap } = await resolve(PROJECT);

    expect(members.map((m) => m.id)).toEqual(['legacy-1']);
    expect(memberTeamMap.get('legacy-1')).toBe('team-1');
  });

  it('skips the user_roles query when the project has no teams', async () => {
    const resolve = build([], []);

    const { members } = await resolve(PROJECT);

    expect(members).toEqual([]);
    expect(userRoleRepository.find).not.toHaveBeenCalled();
  });
});
