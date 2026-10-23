import { ForbiddenException } from '@nestjs/common';
import { Scope } from '../enums/scope.enum';
import { TenantScopeService } from './tenant-scope.service';

const role = (scope: Scope, extras: Record<string, unknown> = {}) => ({
  role: { scope, permissions: [] },
  project: null,
  team: null,
  workspace: null,
  ...extras,
});

describe('TenantScopeService', () => {
  let projectRepository: { find: jest.Mock; findOne: jest.Mock };
  let service: TenantScopeService;

  beforeEach(() => {
    projectRepository = {
      find: jest.fn().mockResolvedValue([{ id: 'p1' }]),
      findOne: jest.fn().mockResolvedValue(null),
    };
    service = new TenantScopeService(projectRepository as any);
  });

  describe('per-request memoisation', () => {
    // `resolveTenantScope` had 35 call sites, several of which run inside one
    // request (a controller and the service it delegates to), so the same
    // workspace-expansion query ran repeatedly. The cache is keyed on the
    // acting-user object, which JwtStrategy rehydrates fresh per request.
    it('resolves once no matter how many times it is asked within a request', async () => {
      const user = {
        id: 'u1',
        roles: [role(Scope.Workspace, { workspace: { id: 'w1' } })],
      };

      await Promise.all([
        service.forUser(user),
        service.forUser(user),
        service.canReachProject(user, 'p1'),
        service.narrowToRequested(user, 'p1'),
      ]);

      expect(projectRepository.find).toHaveBeenCalledTimes(1);
    });

    it('does not share a resolution between two different users', async () => {
      // Two objects, same shape: the cache must key on identity, not content,
      // or one user's scope would answer another's request.
      const first = {
        id: 'u1',
        roles: [role(Scope.Workspace, { workspace: { id: 'w1' } })],
      };
      const second = {
        id: 'u1',
        roles: [role(Scope.Workspace, { workspace: { id: 'w1' } })],
      };

      await service.forUser(first);
      await service.forUser(second);

      expect(projectRepository.find).toHaveBeenCalledTimes(2);
    });

    it('never queries at all for a user with no workspace roles', async () => {
      // The common case - a project- or team-scoped field user. Their reachable
      // projects are named directly on their roles, so there is nothing to expand.
      const user = {
        id: 'u1',
        roles: [role(Scope.Project, { project: 'p9' })],
      };

      const tenant = await service.forUser(user);

      expect(projectRepository.find).not.toHaveBeenCalled();
      expect(tenant.projectIds).toEqual(['p9']);
    });

    it('never queries for a System-scope caller', async () => {
      const tenant = await service.forUser({
        id: 'u1',
        roles: [role(Scope.System)],
      });

      expect(projectRepository.find).not.toHaveBeenCalled();
      expect(tenant.isSystem).toBe(true);
    });
  });

  describe('reachability', () => {
    it('lets System scope reach any project', async () => {
      const user = { id: 'u1', roles: [role(Scope.System)] };
      await expect(service.canReachProject(user, 'anything')).resolves.toBe(
        true,
      );
    });

    it('refuses a project the caller holds no role in', async () => {
      const user = {
        id: 'u1',
        roles: [role(Scope.Project, { project: 'p1' })],
      };
      await expect(service.canReachProject(user, 'p2')).resolves.toBe(false);
    });

    it('treats a missing project id as unreachable rather than as a wildcard', async () => {
      const user = {
        id: 'u1',
        roles: [role(Scope.Project, { project: 'p1' })],
      };
      await expect(service.canReachProject(user, undefined)).resolves.toBe(
        false,
      );
    });

    it('assertCanReachProject throws for a foreign project', async () => {
      const user = {
        id: 'u1',
        roles: [role(Scope.Project, { project: 'p1' })],
      };
      await expect(
        service.assertCanReachProject(user, 'p2', 'sample'),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('narrowToRequested refuses an unreachable id instead of widening', async () => {
      const user = {
        id: 'u1',
        roles: [role(Scope.Project, { project: 'p1' })],
      };

      await expect(service.narrowToRequested(user, 'p1')).resolves.toBe('p1');
      await expect(
        service.narrowToRequested(user, 'p-foreign'),
      ).resolves.toBeNull();
    });
  });

  describe('a null user', () => {
    it('resolves to an empty scope rather than throwing', async () => {
      const tenant = await service.forUser(null);

      expect(tenant.isSystem).toBe(false);
      expect(tenant.projectIds).toEqual([]);
    });
  });

  describe('workspace adminship', () => {
    it('requires an admin-conferring role, not mere membership', () => {
      const member = {
        roles: [
          {
            role: {
              scope: Scope.Workspace,
              name: 'workspace-viewer',
              permissions: [],
            },
            workspace: { id: 'w1' },
          },
        ],
      };

      expect(service.administersWorkspace(member, 'w1')).toBe(false);
      expect(() => service.assertAdministersWorkspace(member, 'w1')).toThrow(
        ForbiddenException,
      );
    });

    it('lets System scope through the assertion', () => {
      const superAdmin = { roles: [role(Scope.System)] };

      expect(() =>
        service.assertAdministersWorkspace(superAdmin, 'w1'),
      ).not.toThrow();
    });
  });

  describe('canManageUser', () => {
    const teamAdminRole = {
      role: {
        scope: Scope.Team,
        name: 'team-admin',
        permissions: [{ action: 'delete', subject: 'team-member' }],
      },
      project: null,
      team: 't1',
      workspace: null,
    };
    const projectAdminRole = {
      role: { scope: Scope.Project, name: 'project-viewer', permissions: [] },
      project: 'p1',
      team: null,
      workspace: null,
    };
    const workspaceAdminRole = {
      role: {
        scope: Scope.Workspace,
        name: 'workspace-admin',
        permissions: [{ action: 'manage', subject: 'workspace-member' }],
      },
      project: null,
      team: null,
      workspace: { id: 'w1' },
    };

    it('a team-admin cannot manage a project-admin or a workspace-admin', async () => {
      const teamAdmin = { roles: [teamAdminRole] };

      await expect(
        service.canManageUser(teamAdmin, { roles: [projectAdminRole] }),
      ).resolves.toBe(false);
      await expect(
        service.canManageUser(teamAdmin, { roles: [workspaceAdminRole] }),
      ).resolves.toBe(false);
    });

    // Real UserRole rows for project/team-scoped roles never carry
    // `workspace` (only a genuinely workspace-scoped row does - see
    // user-role.entity.ts and how teams.service.ts/projects.service.ts
    // construct these rows), so reaching them from a workspace-admin actor
    // depends on the project -> workspace lookup, not a direct field match.
    // These fixtures reflect that: the target's role carries `project` only,
    // and `projectRepository.findOne` stands in for the real lookup.
    it('a workspace-admin can manage a team-scoped user inside a project within their own workspace', async () => {
      const workspaceAdmin = { roles: [workspaceAdminRole] };
      const teamMember = {
        roles: [
          {
            role: { scope: Scope.Team, name: 'collector', permissions: [] },
            project: 'p1',
            team: 't1',
            workspace: null,
          },
        ],
      };
      projectRepository.findOne.mockResolvedValue({
        id: 'p1',
        workspace: { id: 'w1' },
      });

      await expect(
        service.canManageUser(workspaceAdmin, teamMember),
      ).resolves.toBe(true);
    });

    it('a workspace-admin can manage a project-admin within their own workspace', async () => {
      // The case that was silently broken: canManageUser previously had no
      // way to bridge a project-scoped target role up to its parent
      // workspace, so a workspace-admin could never reach a project-admin
      // in their own workspace at all.
      const workspaceAdmin = { roles: [workspaceAdminRole] };
      const projectAdminInOwnWorkspace = {
        roles: [{ ...projectAdminRole, project: 'p1' }],
      };
      projectRepository.findOne.mockResolvedValue({
        id: 'p1',
        workspace: { id: 'w1' },
      });

      await expect(
        service.canManageUser(workspaceAdmin, projectAdminInOwnWorkspace),
      ).resolves.toBe(true);
    });

    it('a workspace-admin cannot manage a team-scoped user in an unrelated workspace', async () => {
      const workspaceAdmin = { roles: [workspaceAdminRole] };
      const foreignTeamMember = {
        roles: [
          {
            role: { scope: Scope.Team, name: 'collector', permissions: [] },
            project: 'p-foreign',
            team: 't-foreign',
            workspace: null,
          },
        ],
      };
      projectRepository.findOne.mockResolvedValue({
        id: 'p-foreign',
        workspace: { id: 'w-foreign' },
      });

      await expect(
        service.canManageUser(workspaceAdmin, foreignTeamMember),
      ).resolves.toBe(false);
    });

    it('two peers at the same scope cannot manage each other', async () => {
      const workspaceAdminA = { roles: [workspaceAdminRole] };
      const workspaceAdminB = {
        roles: [
          {
            ...workspaceAdminRole,
            workspace: { id: 'w1' },
          },
        ],
      };

      await expect(
        service.canManageUser(workspaceAdminA, workspaceAdminB),
      ).resolves.toBe(false);
    });

    it('System scope may manage anyone', async () => {
      const superAdmin = { roles: [role(Scope.System)] };

      await expect(
        service.canManageUser(superAdmin, { roles: [workspaceAdminRole] }),
      ).resolves.toBe(true);
    });

    it('an actor with no admin-tier role at all can manage no one', async () => {
      const noRoleUser = { roles: [] };

      await expect(
        service.canManageUser(noRoleUser, { roles: [teamAdminRole] }),
      ).resolves.toBe(false);
    });

    it('a target with no roles at all can be managed by any admin-tier actor', async () => {
      const teamAdmin = { roles: [teamAdminRole] };

      await expect(
        service.canManageUser(teamAdmin, { roles: [] }),
      ).resolves.toBe(true);
    });
  });
});
