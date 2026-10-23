import { Scope } from '../enums/scope.enum';
import { RoleType } from '../enums/user-type.enum';

export const getUserRole = (user) => {
  if (!user || !user.roles) return null;

  let topRole = null;

  for (const role of user.roles) {
    let roleName;
    if (Array.isArray(role)) {
      roleName = role[0]?.name;
    } else if (typeof role === 'object') {
      roleName = role.role.name;
    }

    if (roleName) {
      if (topRole === RoleType.SUPER_ADMIN) return RoleType.SUPER_ADMIN;
      if (roleName === RoleType.SUPER_ADMIN) {
        topRole = RoleType.SUPER_ADMIN;
        return topRole;
      }
      if (roleName === RoleType.PROJECT_ADMIN) {
        topRole = RoleType.PROJECT_ADMIN;
        continue;
      }
      if (!topRole) topRole = roleName; // Keep the first non-null role
    }
  }

  return topRole;
};

export const checkUserPermissions = (user, permission) => {
  if (!user || !user.roles) return null;
  let flag = false;

  user.roles.forEach(({ role: { permissions } }) => {
    if (permissions) {
      for (const { action, subject } of permissions) {
        if (action === permission.action && subject === permission.subject) {
          flag = true;
          return;
        }
      }
    }
  });
  return flag;
};

// Precedence: System > Workspace > Project > Team.
export const SCOPE_RANK: Record<string, number> = {
  [Scope.System]: 4,
  [Scope.Workspace]: 3,
  [Scope.Project]: 2,
  [Scope.Team]: 1,
};

/**
 * A role's scope, from the authoritative `roles.scope` column.
 *
 * There were two sources of truth for this: `role.scope`, which AbilityFactory
 * reads, and the denormalized `permissions[].scope` copied onto each permission
 * at seed time, which these helpers used to read. When they disagree the two
 * halves of the authorization system disagree, so `role.scope` wins and the
 * permission copy is only a fallback for rows seeded before it was populated.
 */
const scopeOfRole = (roleObj: any): Scope | null => {
  const declared = roleObj?.role?.scope as Scope | undefined;
  if (declared) return declared;

  let fallback: Scope | null = null;
  for (const { scope } of roleObj?.role?.permissions ?? []) {
    if (!scope) continue;
    if (!fallback || SCOPE_RANK[scope] > SCOPE_RANK[fallback]) fallback = scope;
  }
  return fallback;
};

export const getUserScopeFromRole = (roles): Scope | null => {
  if (!roles) return null;

  let topScope: Scope | null = null;

  for (const roleObj of roles) {
    const scope = scopeOfRole(roleObj);
    if (!scope) continue;
    if (scope === Scope.System) return Scope.System;
    if (!topScope || SCOPE_RANK[scope] > SCOPE_RANK[topScope]) topScope = scope;
  }

  return topScope;
};

export const getUserScope = (user): Scope | null => {
  if (!user || !user.roles) return null;
  return getUserScopeFromRole(user.roles);
};
