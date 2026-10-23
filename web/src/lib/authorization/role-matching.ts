/**
 * Client-side mirror of the backend's authorization cascade.
 *
 * Authority: `backend/src/common/authorization/role-matching.ts`. This file
 * exists because the client can no longer assume a user has one role in one
 * project — a user can hold different roles in different projects and
 * workspaces, and only the backend's precedence rules produce the right
 * answer. Keep the two in step: same CASL semantics, same cascade,
 * same precedence. If the backend file changes, check this one.
 *
 * Deliberately framework-free (no React/Jotai imports) so it can be unit
 * tested on its own and consumed from any hook.
 */

/** Structural shape of a permission row as delivered by the API. */
export interface PermissionLike {
  action: string;
  subject: string;
}

/** Structural shape of a role row as delivered by the API. */
export interface RoleLike {
  name?: string;
  scope?: string;
  permissions?: PermissionLike[];
}

/** Structural shape of a user_roles row as delivered by `/users/profile`. */
export interface UserRoleLike {
  role?: RoleLike | null;
  /** Plain id columns, not relations. */
  project?: string | null;
  team?: string | null;
  workspace?: { id: string } | null;
}

export interface RoleContext {
  projectId?: string | null;
  workspaceId?: string | null;
  teamId?: string | null;
}

/**
 * Mirrors the backend's `Scope` enum values (`backend/src/common/enums/scope.enum.ts`).
 * Kept as plain string constants, matching this codebase's convention of
 * avoiding TS enums.
 */
export const Scope = {
  System: "system",
  Workspace: "workspace",
  Project: "project",
  Team: "team",
} as const;

export const WORKSPACE_ADMIN_ROLE = "workspace-admin";

/**
 * The permission that defines workspace adminship.
 *
 * Checked in preference to the role's name so a re-seeded or renamed role
 * keeps working; the name is kept as a fallback for rows seeded before the
 * permission existed.
 */
const WORKSPACE_ADMIN_PERMISSION: PermissionLike = {
  action: "manage",
  subject: "workspace-member",
};

/** CASL semantics, in one place: `manage` means any action, `all` any subject. */
export const permissionSatisfies = (
  permission: PermissionLike,
  action: string,
  subject: string,
): boolean => {
  if (permission.action === "manage" && permission.subject === "all")
    return true;
  if (permission.subject !== subject && permission.subject !== "all")
    return false;
  return permission.action === action || permission.action === "manage";
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
 * Membership is not enough - a plain member of a workspace must not be
 * treated as its admin just because a role row happens to be tied to it.
 */
export const administersWorkspace = (
  user: { roles?: UserRoleLike[] | null } | null | undefined,
  workspaceId?: string | null,
): boolean => {
  if (!workspaceId) return false;
  return (user?.roles ?? []).some(
    (userRole) =>
      userRole.workspace?.id === workspaceId &&
      confersWorkspaceAdmin(userRole.role),
  );
};

/** Every role row this user holds *in this specific project*. */
export const rolesForProject = (
  user: { roles?: UserRoleLike[] | null } | null | undefined,
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
 * This is the one definition of the cascade on the client, mirroring the
 * backend's `AbilityFactory`/`canInContext` precedence so a UI gate and the
 * server it calls cannot disagree about who is allowed to do what.
 *
 * Precedence, highest first:
 *   1. System scope       - unrestricted, context ignored.
 *   2. Project/Team roles - must name this project, and this team when the
 *                           caller asks about a specific team.
 *   3. Workspace roles    - apply only when no project-level role matched,
 *                           so a narrower project role is never widened by a
 *                           workspace role the user also holds.
 *
 * Nothing matching yields an empty `effective` list, i.e. deny. A user with
 * different roles in different projects therefore gets exactly the grants of
 * the project being acted on, never the union across all of them. And with
 * no `projectId` in context, project/team roles can never match - the caller
 * falls straight through to workspace/system roles instead of guessing a
 * project.
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
 * Built from the same cascade as `matchRolesForContext` so the two cannot
 * drift - this is what `useHasPermission`/`usePermissions` call.
 */
export const canInContext = (
  user: { roles?: UserRoleLike[] | null } | null | undefined,
  action: string,
  subject: string,
  context: RoleContext,
): boolean => {
  const matched = matchRolesForContext(user?.roles, context);
  if (matched.isSystem) return true;
  return rolesGrant(matched.effective, action, subject);
};
