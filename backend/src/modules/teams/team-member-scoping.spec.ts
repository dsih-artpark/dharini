import { StatusType } from '../../common/enums/status.enum';
import { RoleType } from '../../common/enums/user-type.enum';
import { TeamsService } from './teams.service';

/**
 * Regression cover for "Team member not found" when editing a member.
 *
 * `Team.members` is @OneToMany(User, user => user.team) and so reflects only
 * the singular `users.teamId` FK, which addTeamMember deliberately leaves
 * alone. Membership must come from the (project, team, user) triple in
 * `user_roles` - the user row carries no project or team scope now that one
 * person can belong to several of each.
 */
describe('TeamsService - team member scoping', () => {
  const PROJECT = 'PRHG5Z';
  const TEAM = 'team-1';
  const MEMBER = 'user-1';

  const ROLE = { id: 'role-1', name: RoleType.COLLECTOR_ADMIN };
  const MEMBER_USER = {
    id: MEMBER,
    firstName: 'collectoradmin',
    lastName: '2',
    email: 'collectoradmin@yopmail.com',
    contactNumber: null,
  };

  let userRoleRepository: {
    findOne: jest.Mock;
    find: jest.Mock;
    save: jest.Mock;
    create: jest.Mock;
  };
  let userRepository: { findOne: jest.Mock; save: jest.Mock };
  let teamRepository: { findOne: jest.Mock; save: jest.Mock; manager: unknown };
  let entityManager: {
    findOne: jest.Mock;
    find: jest.Mock;
    remove: jest.Mock;
    update: jest.Mock;
    save: jest.Mock;
  };

  const build = ({
    membership = null,
    legacyUser = null,
    emailClash = null,
    scopedRoles = [],
  }: {
    membership?: unknown;
    legacyUser?: unknown;
    emailClash?: unknown;
    scopedRoles?: unknown[];
  } = {}) => {
    userRoleRepository = {
      findOne: jest.fn().mockResolvedValue(membership),
      find: jest.fn().mockResolvedValue(scopedRoles),
      save: jest.fn(async (r) => r),
      create: jest.fn((r) => ({ ...r })),
    };

    userRepository = {
      findOne: jest.fn(async (opts: { where: Record<string, unknown> }) => {
        const where = opts.where ?? {};
        if ('email' in where || 'contactNumber' in where) return emailClash;
        // legacy primary-team FK lookup
        if ('team' in where) return legacyUser;
        return MEMBER_USER;
      }),
      save: jest.fn(async (u) => u),
    };

    entityManager = {
      findOne: jest.fn(async (entity: { name: string }) =>
        entity?.name === 'User' ? legacyUser : { id: TEAM },
      ),
      find: jest.fn().mockResolvedValue(scopedRoles),
      remove: jest.fn(),
      update: jest.fn(),
      save: jest.fn(),
    };

    teamRepository = {
      findOne: jest.fn().mockResolvedValue({ id: TEAM, teamName: 'team2' }),
      save: jest.fn(),
      manager: entityManager,
    };

    const noop = {} as never;
    return new TeamsService(
      noop,
      userRoleRepository as never,
      noop,
      teamRepository as never,
      userRepository as never,
      noop,
      { findOne: jest.fn().mockResolvedValue(ROLE) } as never,
      noop,
      noop,
      noop,
      noop,
      { delByPrefix: jest.fn() } as never,
    );
  };

  const dto = (over: Record<string, unknown> = {}) => ({
    projectId: PROJECT,
    teamId: TEAM,
    memberId: MEMBER,
    email: 'collectoradmin@yopmail.com',
    contactNumber: null,
    ...over,
  });

  describe('updateTeamMember', () => {
    it('finds a member that exists only as a user_roles row', async () => {
      const service = build({
        membership: {
          id: 'ur-1',
          user: MEMBER_USER,
          team: TEAM,
          project: PROJECT,
        },
      });

      await expect(
        service.updateTeamMember(dto() as never),
      ).resolves.toBeDefined();

      // Scoped to this exact membership, not "any role this user holds".
      expect(userRoleRepository.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            user: { id: MEMBER },
            team: TEAM,
            project: PROJECT,
            status: StatusType.ACTIVE,
          }),
        }),
      );
    });

    it("does not reject the edit when the email is the member's own", async () => {
      const service = build({
        membership: { id: 'ur-1', user: MEMBER_USER },
        emailClash: MEMBER_USER, // the lookup finds the member themselves
      });

      await expect(
        service.updateTeamMember(dto() as never),
      ).resolves.toBeDefined();
    });

    it('still rejects an email belonging to someone else', async () => {
      const service = build({
        membership: { id: 'ur-1', user: MEMBER_USER },
        emailClash: { id: 'someone-else', email: 'collectoradmin@yopmail.com' },
      });

      await expect(service.updateTeamMember(dto() as never)).rejects.toThrow(
        /Email already exist/,
      );
    });

    it('persists the edited fields on the user row', async () => {
      const service = build({
        membership: { id: 'ur-1', user: { ...MEMBER_USER } },
      });

      await service.updateTeamMember(
        dto({ firstName: 'Collector', lastName: 'Admin' }) as never,
      );

      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: MEMBER,
          firstName: 'Collector',
          lastName: 'Admin',
        }),
      );
    });

    it('never writes back through the team members collection', async () => {
      const service = build({
        membership: { id: 'ur-1', user: { ...MEMBER_USER } },
      });

      await service.updateTeamMember(dto() as never);

      // Saving team.members rewrites user.team for everyone in the array.
      expect(teamRepository.save).not.toHaveBeenCalled();
    });

    it('falls back to the legacy primary-team FK', async () => {
      const service = build({
        membership: null,
        legacyUser: { ...MEMBER_USER },
      });

      await expect(
        service.updateTeamMember(dto() as never),
      ).resolves.toBeDefined();
    });

    it('reports not found when neither source has the member', async () => {
      const service = build({ membership: null, legacyUser: null });

      await expect(service.updateTeamMember(dto() as never)).rejects.toThrow(
        /Team member not found/,
      );
    });
  });

  describe('removeTeamMember', () => {
    it('removes only this project+team membership', async () => {
      const scoped = [{ id: 'ur-1', team: TEAM, project: PROJECT }];
      const service = build({ scopedRoles: scoped });

      await service.removeTeamMember({
        projectId: PROJECT,
        teamId: TEAM,
        memberId: MEMBER,
      });

      // The query must carry team + project; without them this removed
      // every UserRole the user held, in every project.
      expect(entityManager.find).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          where: expect.objectContaining({
            user: { id: MEMBER },
            team: TEAM,
            project: PROJECT,
          }),
        }),
      );
      expect(entityManager.remove).toHaveBeenCalledWith(scoped);
      expect(entityManager.save).not.toHaveBeenCalled();
    });

    it('reports not found when the member has no membership here', async () => {
      const service = build({ scopedRoles: [], legacyUser: null });

      await expect(
        service.removeTeamMember({
          projectId: PROJECT,
          teamId: TEAM,
          memberId: MEMBER,
        }),
      ).rejects.toThrow(/does not exist/);
    });
  });
});
