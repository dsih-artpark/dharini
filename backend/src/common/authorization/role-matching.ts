import { Scope } from '../enums/scope.enum';

/**
 * Structural shapes rather than the TypeORM entities.
 *
 * `req.user` is rehydrated from a Redis JSON blob (see JwtStrategy), so at
 * runtime these are plain objects, not entity instances. Typing against the
 * entities here would be a lie that `strictNullChecks: false` would not catch.
 */
export interface PermissionLike {
  action: string;
  subject: string;
}

export interface RoleLike {
  name?: string;
  scope?: string;
  permissions?: PermissionLike[];
}

export interface UserRoleLike {
  role?: RoleLike | null;
  /** Plain id columns on user_roles, not relations. */
  project?: string | null;
  team?: string | null;
  workspace?: { id: string } | null;
}

export interface RoleContext {
  projectId?: string | null;
  workspaceId?: string | null;
  teamId?: string | null;
}

export const WORKSPACE_ADMIN_ROLE = 'workspace-admin';

/**
 * The permission that defines workspace adminship.
 *
 * Checked in preference to the role's name so a re-seeded or renamed role
 * keeps working; the name is kept as a fallback for rows seeded before the
 * permission existed.
 */
const WORKSPACE_ADMIN_PERMISSION: PermissionLike = {
  action: 'manage',
  subject: 'workspace-member',
};

/** CASL semantics, in one place: `manage` means any action, `all` any subject. */
export const permissionSatisfies = (
  permission: PermissionLike,
  action: string,
  subject: string,
): boolean => {
  if (permission.action === 'manage' && permission.subject === 'all')
    return true;
  if (permission.subject !== subject && permission.subject !== 'all')
    return false;
  return permission.action === action || permission.action === 'manage';
};

export const rolesGrant = (
  roles: UserRoleLike[],
  action: string,
  subject: string,
): boolean =>
  roles.some((userRole) =>
    (userRole.role?.permissions ?? []).some((permission) =>
      permissionSatisfies(permission, action, subject),
    ),
  );

export const isSystemRole = (userRole: UserRoleLike): boolean =>
  userRole.role?.scope === Scope.System;

export const confersWorkspaceAdmin = (role?: RoleLike | null): boolean => {
  if (!role) return false;
  if (role.name === WORKSPACE_ADMIN_ROLE) return true;
  return (role.permissions ?? []).some(
    (permission) =>
      permission.action === WORKSPACE_ADMIN_PERMISSION.action &&
      permission.subject === WORKSPACE_ADMIN_PERMISSION.subject,
  );
};

/**
 * Does this user administer this specific workspace?
 *
 * Membership is not enough: before this was centralised, four services each
 * carried their own copy of this predicate and an earlier version of each
 * accepted *any* role tied to the workspace, which let a plain member rename
 * the workspace, invite people to it, and create projects in it.
 */
export const administersWorkspace = (
  user: { roles?: UserRoleLike[] } | null | undefined,
  workspaceId?: string | null,
): boolean => {
  if (!workspaceId) return false;
  return (user?.roles ?? []).some(
    (userRole) =>
      userRole.workspace?.id === workspaceId &&
      confersWorkspaceAdmin(userRole.role),
  );
};

/**
 * project-viewer is presently the only project-scoped role that exists, so
 * any Project-scope role confers admin at that tier by elimination - there
 * is no project-scoped "member" role to distinguish it from, unlike Team
 * scope below. Named and exported anyway (rather than inlined) so the
 * account-anonymization authorization check reads the same way at every
 * tier, and so this stays correct if a project-scoped non-admin role is ever
 * seeded.
 */
export const confersProjectAdmin = (role?: RoleLike | null): boolean =>
  role?.scope === Scope.Project;

/**
 * Team-tier roles split into admins (team-admin, collector-admin, lab-admin)
 * and plain members (collector, lab-member); `SCOPE_RANK` alone can't tell
 * them apart, since all five share Scope.Team. `delete` on `team-member` is
 * the existing permission that already separates them in the seed data
 * (src/seeder/data.ts), so it doubles as the "confers team admin" signal
 * here rather than hard-coding a second list of role names to keep in sync.
 */
const TEAM_ADMIN_PERMISSION: PermissionLike = {
  action: 'delete',
  subject: 'team-member',
};

export const confersTeamAdmin = (role?: RoleLike | null): boolean => {
  if (!role) return false;
  return (role.permissions ?? []).some(
    (permission) =>
      permission.action === TEAM_ADMIN_PERMISSION.action &&
      permission.subject === TEAM_ADMIN_PERMISSION.subject,
  );
};

/** Does this user administer this specific project (not merely belong to it)? */
export const administersProject = (
  user: { roles?: UserRoleLike[] } | null | undefined,
  projectId?: string | null,
): boolean => {
  if (!projectId) return false;
  return (user?.roles ?? []).some(
    (userRole) =>
      userRole.project === projectId && confersProjectAdmin(userRole.role),
  );
};

/** Does this user administer this specific team (not merely belong to it)? */
export const administersTeam = (
  user: { roles?: UserRoleLike[] } | null | undefined,
  teamId?: string | null,
): boolean => {
  if (!teamId) return false;
  return (user?.roles ?? []).some(
    (userRole) => userRole.team === teamId && confersTeamAdmin(userRole.role),
  );
};

/** Every role row this user holds *in this specific project*. */
export const rolesForProject = (
  user: { roles?: UserRoleLike[] } | null | undefined,
  projectId?: string | null,
): UserRoleLike[] => {
  if (!projectId) return [];
  return (user?.roles ?? []).filter(
    (userRole) => userRole.project === projectId,
  );
};

export interface MatchedRoles {
  /** Roles whose grants apply in this context. Empty means deny. */
  effective: UserRoleLike[];
  matchedProjectRole: boolean;
  matchedWorkspaceRole: boolean;
  isSystem: boolean;
}

/**
 * Resolve which of a user's roles actually apply in a given tenant context.
 *
 * This is the one definition of the cascade, shared by `AbilityFactory` (which
 * turns it into a CASL ability for the guard) and by services that need the
 * same answer without building an ability. Two implementations of "what may
 * this user do here" is how a guard and a service come to disagree.
 *
 * Precedence, highest first:
 *   1. System scope       - unrestricted, context ignored.
 *   2. Project/Team roles - must name this project, and this team when the
 *                           route carries a :teamId.
 *   3. Workspace roles    - apply only when no project-level role matched,
 *                           so a narrower project role is never widened by a
 *                           workspace role the user also holds.
 *
 * Nothing matching yields an empty `effective` list, i.e. deny. A user with
 * different roles in different projects therefore gets exactly the grants of
 * the project being acted on, never the union across all of them.
 */
export const matchRolesForContext = (
  roles: UserRoleLike[] | null | undefined,
  context: RoleContext,
): MatchedRoles => {
  const all = roles ?? [];

  if (all.some(isSystemRole)) {
    return {
      effective: all.filter(isSystemRole),
      matchedProjectRole: false,
      matchedWorkspaceRole: false,
      isSystem: true,
    };
  }

  const { projectId, workspaceId, teamId } = context;

  const projectRoles = all.filter((userRole) => {
    const scope = userRole.role?.scope;
    return (
      (scope === Scope.Project || scope === Scope.Team) &&
      !!projectId &&
      userRole.project === projectId &&
      (!teamId || userRole.team === teamId)
    );
  });

  const workspaceRoles = all.filter(
    (userRole) =>
      userRole.role?.scope === Scope.Workspace &&
      !!workspaceId &&
      userRole.workspace?.id === workspaceId,
  );

  return {
    effective: projectRoles.length ? projectRoles : workspaceRoles,
    matchedProjectRole: projectRoles.length > 0,
    matchedWorkspaceRole: workspaceRoles.length > 0,
    isSystem: false,
  };
};

/**
 * Can this user take `action` on `subject` within `context`?
 *
 * The service-layer counterpart to the CASL check the guard runs, built from
 * the same cascade so the two cannot drift.
 */
export const canInContext = (
  user: { roles?: UserRoleLike[] } | null | undefined,
  action: string,
  subject: string,
  context: RoleContext,
): boolean => {
  const matched = matchRolesForContext(user?.roles, context);
  if (matched.isSystem) return true;
  return rolesGrant(matched.effective, action, subject);
};
