import { AbilityFactory } from './abitlity.factory';
import { Scope } from '../enums/scope.enum';
import { CacheKeys } from '../cache/cache-keys';

// Seeded roles carry `roles.scope`, and the seeder also denormalizes that
// value onto each Permission row. `role.scope` is now the single source of
// truth for both getUserScopeFromRole() and AbilityFactory; the permission
// copy survives only as a fallback for rows seeded before the column existed.
// Populate both here so these tests exercise the shape AbilityFactory really
// sees at runtime.
const makeUserRole = ({
  scope,
  permissions,
  project = null,
  team = null,
  workspace = null,
}: {
  scope: string;
  permissions: Array<{ action: string; subject: string }>;
  project?: string | null;
  team?: string | null;
  workspace?: { id: string } | null;
}) => ({
  role: {
    scope,
    permissions: permissions.map((p) => ({ ...p, scope })),
  },
  project,
  team,
  workspace,
});

describe('AbilityFactory.defineAbility', () => {
  let projectRepository: { findOne: jest.Mock };
  let cacheService: { get: jest.Mock; set: jest.Mock };
  let factory: AbilityFactory;

  beforeEach(() => {
    projectRepository = { findOne: jest.fn() };
    cacheService = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(undefined),
    };
    factory = new AbilityFactory(projectRepository as any, cacheService as any);
  });

  describe('System scope', () => {
    it('grants manage-all regardless of route params, without touching the DB', async () => {
      const req = {
        user: {
          id: 'u1',
          roles: [makeUserRole({ scope: Scope.System, permissions: [] })],
        },
        params: {},
      };

      const ability = await factory.defineAbility(req);

      expect(ability.can('manage', 'all')).toBe(true);
      expect(ability.can('delete', 'sample')).toBe(true);
      expect(projectRepository.findOne).not.toHaveBeenCalled();
    });
  });

  describe('context-less requests (no :projectId and no :workspaceId anywhere)', () => {
    const contextLessRequest = () => ({
      user: {
        id: 'u1',
        roles: [
          makeUserRole({
            scope: Scope.Team,
            permissions: [{ action: 'read', subject: 'disease' }],
          }),
        ],
      },
      params: {},
    });

    it('denies by default — a route that declares no opt-in gets nothing', async () => {
      // This is the hole that made every other cross-tenant finding
      // reachable: a route whose param simply wasn't named :projectId used to
      // fall through to "grant every permission the user holds anywhere".
      const ability = await factory.defineAbility(contextLessRequest());

      expect(ability.can('read', 'disease')).toBe(false);
      expect(ability.can('manage', 'all')).toBe(false);
    });

    it('grants exactly the permissions the user holds when the route is @TenantAgnostic()', async () => {
      const ability = await factory.defineAbility(contextLessRequest(), {
        tenantAgnostic: true,
      });

      expect(ability.can('read', 'disease')).toBe(true);
      expect(ability.can('create', 'disease')).toBe(false);
    });

    it('grants the same union when the route is @ServiceScoped() — the service does the filtering', async () => {
      const ability = await factory.defineAbility(contextLessRequest(), {
        serviceScoped: true,
      });

      expect(ability.can('read', 'disease')).toBe(true);
      expect(ability.can('create', 'disease')).toBe(false);
    });
  });

  describe('project-scoped role matching', () => {
    it('grants permissions when role.project matches :projectId and the user is a project member', async () => {
      projectRepository.findOne.mockResolvedValue({
        id: 'p1',
        members: [{ id: 'u1' }],
        workspace: null,
      });
      const req = {
        user: {
          id: 'u1',
          roles: [
            makeUserRole({
              scope: Scope.Project,
              project: 'p1',
              permissions: [{ action: 'read', subject: 'visit' }],
            }),
          ],
        },
        params: { projectId: 'p1' },
      };

      const ability = await factory.defineAbility(req);

      expect(ability.can('read', 'visit')).toBe(true);
    });

    it('denies when role.project does not match :projectId (fail-closed, not the old unconditional fallback)', async () => {
      projectRepository.findOne.mockResolvedValue({
        id: 'p1',
        members: [{ id: 'u1' }],
        workspace: null,
      });
      const req = {
        user: {
          id: 'u1',
          roles: [
            makeUserRole({
              scope: Scope.Project,
              project: 'p-other',
              permissions: [{ action: 'read', subject: 'visit' }],
            }),
          ],
        },
        params: { projectId: 'p1' },
      };

      const ability = await factory.defineAbility(req);

      expect(ability.can('read', 'visit')).toBe(false);
    });

    it('requires :teamId to also match for Team-scoped roles', async () => {
      projectRepository.findOne.mockResolvedValue({
        id: 'p1',
        members: [{ id: 'u1' }],
        workspace: null,
      });
      const req = {
        user: {
          id: 'u1',
          roles: [
            makeUserRole({
              scope: Scope.Team,
              project: 'p1',
              team: 't1',
              permissions: [{ action: 'read', subject: 'sample' }],
            }),
          ],
        },
        params: { projectId: 'p1', teamId: 't2' },
      };

      const ability = await factory.defineAbility(req);

      expect(ability.can('read', 'sample')).toBe(false);
    });

    it('matches a Team-scoped role when both :projectId and :teamId match', async () => {
      projectRepository.findOne.mockResolvedValue({
        id: 'p1',
        members: [{ id: 'u1' }],
        workspace: null,
      });
      const req = {
        user: {
          id: 'u1',
          roles: [
            makeUserRole({
              scope: Scope.Team,
              project: 'p1',
              team: 't1',
              permissions: [{ action: 'read', subject: 'sample' }],
            }),
          ],
        },
        params: { projectId: 'p1', teamId: 't1' },
      };

      const ability = await factory.defineAbility(req);

      expect(ability.can('read', 'sample')).toBe(true);
    });
  });

  describe('project membership is proved by the UserRole row, not by project.members', () => {
    // `Project.members` is a OneToMany derived from the singular legacy
    // `users.project` FK, so it names only a user's one "primary" project and
    // cannot represent anyone who legitimately belongs to several. A UserRole
    // row naming this exact project is the authoritative membership record, so
    // the old secondary gate against `members` was both unreachable (it only
    // fired when nothing had been granted anyway) and wrong in principle.
    it('grants on a matching project-scoped role even when project.members omits the user', async () => {
      projectRepository.findOne.mockResolvedValue({
        id: 'p1',
        members: [{ id: 'someone-else' }],
        workspace: null,
      });
      const req = {
        user: {
          id: 'u1',
          roles: [
            makeUserRole({
              scope: Scope.Project,
              project: 'p1',
              permissions: [{ action: 'read', subject: 'visit' }],
            }),
          ],
        },
        params: { projectId: 'p1' },
      };

      const ability = await factory.defineAbility(req);

      expect(ability.can('read', 'visit')).toBe(true);
    });

    it('denies on every HTTP method when no role names the project, even if project.members lists the user', async () => {
      projectRepository.findOne.mockResolvedValue({
        id: 'p1',
        members: [{ id: 'u1' }],
        workspace: null,
      });
      const req = {
        method: 'POST',
        user: {
          id: 'u1',
          roles: [
            makeUserRole({
              scope: Scope.Project,
              project: 'p-other',
              permissions: [{ action: 'create', subject: 'visit' }],
            }),
          ],
        },
        params: { projectId: 'p1' },
      };

      const ability = await factory.defineAbility(req);

      expect(ability.can('create', 'visit')).toBe(false);
    });
  });

  describe('workspace-scoped role resolution', () => {
    it('grants permissions via a direct :workspaceId route param match', async () => {
      const req = {
        user: {
          id: 'u1',
          roles: [
            makeUserRole({
              scope: Scope.Workspace,
              workspace: { id: 'w1' },
              permissions: [{ action: 'manage', subject: 'workspace-member' }],
            }),
          ],
        },
        params: { workspaceId: 'w1' },
      };

      const ability = await factory.defineAbility(req);

      expect(ability.can('manage', 'workspace-member')).toBe(true);
    });

    it('denies when the workspace-scoped role belongs to a different workspace', async () => {
      const req = {
        user: {
          id: 'u1',
          roles: [
            makeUserRole({
              scope: Scope.Workspace,
              workspace: { id: 'w-other' },
              permissions: [{ action: 'manage', subject: 'workspace-member' }],
            }),
          ],
        },
        params: { workspaceId: 'w1' },
      };

      const ability = await factory.defineAbility(req);

      expect(ability.can('manage', 'workspace-member')).toBe(false);
    });

    it('resolves the workspace via the target projects workspace relation when only :projectId is present', async () => {
      projectRepository.findOne.mockResolvedValue({
        id: 'p1',
        members: [],
        workspace: { id: 'w1' },
      });
      const req = {
        user: {
          id: 'u1',
          roles: [
            makeUserRole({
              scope: Scope.Workspace,
              workspace: { id: 'w1' },
              permissions: [{ action: 'create', subject: 'project' }],
            }),
          ],
        },
        params: { projectId: 'p1' },
      };

      const ability = await factory.defineAbility(req);

      expect(ability.can('create', 'project')).toBe(true);
    });

    it('lets a workspace-role holder bypass the literal project-membership gate', async () => {
      projectRepository.findOne.mockResolvedValue({
        id: 'p1',
        members: [{ id: 'someone-else' }],
        workspace: { id: 'w1' },
      });
      const req = {
        user: {
          id: 'u1',
          roles: [
            makeUserRole({
              scope: Scope.Workspace,
              workspace: { id: 'w1' },
              permissions: [{ action: 'read', subject: 'project' }],
            }),
          ],
        },
        params: { projectId: 'p1' },
      };

      const ability = await factory.defineAbility(req);

      expect(ability.can('read', 'project')).toBe(true);
    });

    it('a project-role match takes precedence over a matching workspace-role (workspace grant is skipped entirely)', async () => {
      projectRepository.findOne.mockResolvedValue({
        id: 'p1',
        members: [{ id: 'u1' }],
        workspace: { id: 'w1' },
      });
      const req = {
        user: {
          id: 'u1',
          roles: [
            makeUserRole({
              scope: Scope.Project,
              project: 'p1',
              permissions: [{ action: 'read', subject: 'visit' }],
            }),
            makeUserRole({
              scope: Scope.Workspace,
              workspace: { id: 'w1' },
              permissions: [{ action: 'manage', subject: 'visit' }],
            }),
          ],
        },
        params: { projectId: 'p1' },
      };

      const ability = await factory.defineAbility(req);

      // project-role's own (narrower) grant applies...
      expect(ability.can('read', 'visit')).toBe(true);
      // ...but the workspace role's broader grant is never applied, since a
      // project-role match already won the cascade.
      expect(ability.can('manage', 'visit')).toBe(false);
    });

    it('uses the cached project lookup instead of hitting the DB when available', async () => {
      cacheService.get.mockResolvedValue({ id: 'p1', workspaceId: 'w1' });
      const req = {
        user: {
          id: 'u1',
          roles: [
            makeUserRole({
              scope: Scope.Project,
              project: 'p1',
              permissions: [{ action: 'read', subject: 'visit' }],
            }),
          ],
        },
        params: { projectId: 'p1' },
      };

      const ability = await factory.defineAbility(req);

      expect(cacheService.get).toHaveBeenCalledWith(
        CacheKeys.projectTenant('p1'),
      );
      expect(projectRepository.findOne).not.toHaveBeenCalled();
      expect(ability.can('read', 'visit')).toBe(true);
    });
  });

  describe('fail-closed deny', () => {
    it('denies everything when neither a project-role nor a workspace-role matches, even with a :projectId param', async () => {
      projectRepository.findOne.mockResolvedValue({
        id: 'p1',
        members: [{ id: 'u1' }],
        workspace: null,
      });
      const req = {
        user: {
          id: 'u1',
          roles: [
            makeUserRole({
              scope: Scope.Project,
              project: 'p-other',
              permissions: [{ action: 'read', subject: 'visit' }],
            }),
          ],
        },
        params: { projectId: 'p1' },
      };

      const ability = await factory.defineAbility(req);

      expect(ability.can('read', 'visit')).toBe(false);
      expect(ability.can('manage', 'all')).toBe(false);
    });

    it('denies when :workspaceId is present but no role matches it (no unscoped fallback leaks through)', async () => {
      const req = {
        user: {
          id: 'u1',
          roles: [
            makeUserRole({
              scope: Scope.Team,
              permissions: [{ action: 'read', subject: 'disease' }],
            }),
          ],
        },
        params: { workspaceId: 'w1' },
      };

      const ability = await factory.defineAbility(req);

      expect(ability.can('read', 'disease')).toBe(false);
    });
  });
});
