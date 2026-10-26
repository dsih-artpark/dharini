import { Scope } from '../enums/scope.enum';
import {
  administersProject,
  administersTeam,
  administersWorkspace,
  canInContext,
  confersProjectAdmin,
  confersTeamAdmin,
  confersWorkspaceAdmin,
  matchRolesForContext,
  permissionSatisfies,
  rolesForProject,
} from './role-matching';

const userRole = ({
  scope,
  name,
  permissions = [],
  project = null,
  team = null,
  workspace = null,
}: any) => ({
  role: { name, scope, permissions },
  project,
  team,
  workspace,
});

const read = (subject: string) => ({ action: 'read', subject });
const manage = (subject: string) => ({ action: 'manage', subject });

describe('permissionSatisfies (CASL semantics, defined once)', () => {
  it('matches an exact action/subject pair', () => {
    expect(permissionSatisfies(read('site'), 'read', 'site')).toBe(true);
  });

  it('treats manage as any action on that subject', () => {
    expect(permissionSatisfies(manage('site'), 'delete', 'site')).toBe(true);
  });

  it('treats manage-all as any action on any subject', () => {
    expect(permissionSatisfies(manage('all'), 'delete', 'sample')).toBe(true);
  });

  it('does not let read on one subject leak to another', () => {
    expect(permissionSatisfies(read('site'), 'read', 'sample')).toBe(false);
  });

  it('does not let read satisfy a write', () => {
    expect(permissionSatisfies(read('site'), 'update', 'site')).toBe(false);
  });
});

describe('matchRolesForContext', () => {
  // The case this design exists for: one user, two projects, a different role
  // in each. The grants of the project being acted on must apply, and the
  // grants of the other must not.
  const multiProjectUser = {
    roles: [
      userRole({
        scope: Scope.Project,
        project: 'p-alpha',
        permissions: [manage('site')],
      }),
      userRole({
        scope: Scope.Project,
        project: 'p-beta',
        permissions: [read('site')],
      }),
    ],
  };

  it('applies only the role belonging to the project being acted on', () => {
    expect(
      canInContext(multiProjectUser, 'delete', 'site', {
        projectId: 'p-alpha',
      }),
    ).toBe(true);
    expect(
      canInContext(multiProjectUser, 'delete', 'site', { projectId: 'p-beta' }),
    ).toBe(false);
    expect(
      canInContext(multiProjectUser, 'read', 'site', { projectId: 'p-beta' }),
    ).toBe(true);
  });

  it('grants nothing for a project the user holds no role in', () => {
    expect(
      canInContext(multiProjectUser, 'read', 'site', { projectId: 'p-gamma' }),
    ).toBe(false);
  });

  it('grants nothing when no context is supplied at all', () => {
    // Routes that legitimately have no tenant must opt in explicitly
    // (@TenantAgnostic / @ServiceScoped); the cascade itself denies.
    expect(canInContext(multiProjectUser, 'read', 'site', {})).toBe(false);
  });

  it('System scope ignores context entirely', () => {
    const superAdmin = {
      roles: [userRole({ scope: Scope.System, permissions: [manage('all')] })],
    };

    expect(matchRolesForContext(superAdmin.roles, {}).isSystem).toBe(true);
    expect(
      canInContext(superAdmin, 'delete', 'sample', { projectId: 'anything' }),
    ).toBe(true);
  });

  it('requires the team to match too when the route names one', () => {
    const teamUser = {
      roles: [
        userRole({
          scope: Scope.Team,
          project: 'p1',
          team: 't1',
          permissions: [read('sample')],
        }),
      ],
    };

    expect(
      canInContext(teamUser, 'read', 'sample', {
        projectId: 'p1',
        teamId: 't1',
      }),
    ).toBe(true);
    expect(
      canInContext(teamUser, 'read', 'sample', {
        projectId: 'p1',
        teamId: 't2',
      }),
    ).toBe(false);
  });

  describe('workspace roles', () => {
    const workspaceAdmin = {
      roles: [
        userRole({
          scope: Scope.Workspace,
          name: 'workspace-admin',
          workspace: { id: 'w1' },
          permissions: [manage('project'), manage('workspace-member')],
        }),
      ],
    };

    it('applies within the workspace it belongs to', () => {
      expect(
        canInContext(workspaceAdmin, 'create', 'project', {
          workspaceId: 'w1',
        }),
      ).toBe(true);
    });

    it('does not apply to a different workspace', () => {
      expect(
        canInContext(workspaceAdmin, 'create', 'project', {
          workspaceId: 'w2',
        }),
      ).toBe(false);
    });

    it('does not apply to a project whose workspace was not resolved', () => {
      // A workspace-scoped role has project === null. Treating that as "every
      // project" is exactly the bug the web hook had: it granted an admin of
      // workspace A rights over a project in workspace B.
      expect(
        canInContext(workspaceAdmin, 'create', 'project', {
          projectId: 'p-in-w2',
        }),
      ).toBe(false);
    });

    it('never widens a narrower project role the user also holds', () => {
      const both = {
        roles: [
          userRole({
            scope: Scope.Project,
            project: 'p1',
            permissions: [read('visit')],
          }),
          userRole({
            scope: Scope.Workspace,
            workspace: { id: 'w1' },
            permissions: [manage('visit')],
          }),
        ],
      };
      const context = { projectId: 'p1', workspaceId: 'w1' };

      expect(canInContext(both, 'read', 'visit', context)).toBe(true);
      expect(canInContext(both, 'delete', 'visit', context)).toBe(false);
    });

    it('falls back to the workspace role when no project role matches', () => {
      const both = {
        roles: [
          userRole({
            scope: Scope.Project,
            project: 'p-other',
            permissions: [read('visit')],
          }),
          userRole({
            scope: Scope.Workspace,
            workspace: { id: 'w1' },
            permissions: [manage('visit')],
          }),
        ],
      };

      expect(
        canInContext(both, 'delete', 'visit', {
          projectId: 'p1',
          workspaceId: 'w1',
        }),
      ).toBe(true);
    });
  });
});

describe('workspace adminship', () => {
  const admin = userRole({
    scope: Scope.Workspace,
    name: 'workspace-admin',
    workspace: { id: 'w1' },
    permissions: [manage('workspace-member')],
  });
  const plainMember = userRole({
    scope: Scope.Workspace,
    name: 'workspace-viewer',
    workspace: { id: 'w2' },
    permissions: [read('project')],
  });

  it('recognises the seeded role by name', () => {
    expect(confersWorkspaceAdmin({ name: 'workspace-admin' })).toBe(true);
  });

  it('recognises an equivalent role by its permissions, not just its name', () => {
    expect(
      confersWorkspaceAdmin({
        name: 'renamed',
        permissions: [manage('workspace-member')],
      }),
    ).toBe(true);
  });

  it('rejects mere membership of the workspace', () => {
    // The bug four separate copies of this predicate originally shared: any
    // role tied to the workspace counted, so a plain member could rename it,
    // invite people to it, and create projects in it.
    expect(administersWorkspace({ roles: [plainMember] }, 'w2')).toBe(false);
  });

  it('is scoped to the specific workspace', () => {
    const user = { roles: [admin, plainMember] };

    expect(administersWorkspace(user, 'w1')).toBe(true);
    expect(administersWorkspace(user, 'w2')).toBe(false);
  });

  it('denies when no workspace is named at all', () => {
    expect(administersWorkspace({ roles: [admin] }, undefined)).toBe(false);
  });
});

describe('project adminship', () => {
  it('treats any Project-scope role as admin, since project-viewer is the only one seeded', () => {
    expect(confersProjectAdmin({ scope: Scope.Project })).toBe(true);
    expect(confersProjectAdmin({ scope: Scope.Team })).toBe(false);
    expect(confersProjectAdmin(null)).toBe(false);
  });

  it('is scoped to the specific project', () => {
    const user = {
      roles: [userRole({ scope: Scope.Project, project: 'p1' })],
    };

    expect(administersProject(user, 'p1')).toBe(true);
    expect(administersProject(user, 'p2')).toBe(false);
    expect(administersProject(user, undefined)).toBe(false);
  });
});

describe('team adminship', () => {
  const teamAdmin = userRole({
    scope: Scope.Team,
    name: 'team-admin',
    team: 't1',
    permissions: [{ action: 'delete', subject: 'team-member' }],
  });
  const plainCollector = userRole({
    scope: Scope.Team,
    name: 'collector',
    team: 't2',
    permissions: [{ action: 'read', subject: 'team-member' }],
  });

  it('distinguishes admin-tier team roles from plain members by the delete-team-member permission', () => {
    expect(confersTeamAdmin(teamAdmin.role)).toBe(true);
    expect(confersTeamAdmin(plainCollector.role)).toBe(false);
    expect(confersTeamAdmin(null)).toBe(false);
  });

  it('is scoped to the specific team', () => {
    const user = { roles: [teamAdmin, plainCollector] };

    expect(administersTeam(user, 't1')).toBe(true);
    expect(administersTeam(user, 't2')).toBe(false);
    expect(administersTeam(user, undefined)).toBe(false);
  });
});

describe('rolesForProject', () => {
  it('returns only the roles held in that project', () => {
    const user = {
      roles: [
        userRole({
          scope: Scope.Project,
          project: 'p1',
          name: 'project-viewer',
        }),
        userRole({
          scope: Scope.Team,
          project: 'p1',
          team: 't1',
          name: 'collector',
        }),
        userRole({ scope: Scope.Project, project: 'p2', name: 'lab-admin' }),
      ],
    };

    expect(rolesForProject(user, 'p1').map((r) => r.role.name)).toEqual([
      'project-viewer',
      'collector',
    ]);
  });

  it('returns nothing rather than everything when no project is named', () => {
    const user = { roles: [userRole({ scope: Scope.Project, project: 'p1' })] };
    expect(rolesForProject(user, undefined)).toEqual([]);
  });
});
