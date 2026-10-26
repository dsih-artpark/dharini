import { In, ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import { Project } from 'src/entities/project.entity';
import { Scope } from '../enums/scope.enum';
import { getUserScopeFromRole } from './get-user-role';

/**
 * The set of tenants the acting user may actually see, resolved from
 * `user_roles` rather than the legacy singular `users.project` / `users.team`
 * columns.
 *
 * Every list/aggregate query that has no `:projectId` in its route must build
 * its tenant predicate from this — never from `user.project?.id`, which is a
 * single "primary" project and is `null` for workspace admins and for anyone
 * who legitimately belongs to more than one project.
 */
export interface TenantScope {
  scope: Scope | null;
  /** System scope: unrestricted. `projectIds` is meaningless when true. */
  isSystem: boolean;
  /** Every project the user can reach, directly or via a workspace role. */
  projectIds: string[];
  teamIds: string[];
  workspaceIds: string[];
}

/**
 * Tenant ids carried on the user's `user_roles` rows.
 *
 * `UserRole.project` / `UserRole.team` are plain id columns, not relations;
 * `UserRole.workspace` is a relation and is eager-joined by
 * `UserService.findOne`, which is what populates `req.user`.
 *
 * The legacy `user.project` / `user.team` columns are folded in as a fallback
 * for rows written before the workspace migration. Both are due for removal in
 * the `Phase D` cleanup, at which point `includeLegacy` can go.
 */
export const collectRoleTenantIds = (user: any, includeLegacy = true) => {
  const projectIds = new Set<string>();
  const teamIds = new Set<string>();
  const workspaceIds = new Set<string>();

  for (const userRole of user?.roles ?? []) {
    if (userRole?.project) projectIds.add(userRole.project);
    if (userRole?.team) teamIds.add(userRole.team);
    if (userRole?.workspace?.id) workspaceIds.add(userRole.workspace.id);
  }

  if (includeLegacy) {
    if (user?.project?.id) projectIds.add(user.project.id);
    if (user?.team?.id) teamIds.add(user.team.id);
  }

  return {
    projectIds: [...projectIds],
    teamIds: [...teamIds],
    workspaceIds: [...workspaceIds],
  };
};

/**
 * Expand the user's roles into the concrete set of project ids they can reach.
 * A workspace-scoped role reaches every project in that workspace, so this
 * needs a repository lookup; project- and team-scoped roles name their project
 * directly.
 */
export const resolveTenantScope = async (
  user: any,
  projectRepository: Repository<Project>,
): Promise<TenantScope> => {
  const scope = getUserScopeFromRole(user?.roles ?? []);

  if (scope === Scope.System) {
    return {
      scope,
      isSystem: true,
      projectIds: [],
      teamIds: [],
      workspaceIds: [],
    };
  }

  const { projectIds, teamIds, workspaceIds } = collectRoleTenantIds(user);
  const reachable = new Set(projectIds);

  if (workspaceIds.length) {
    const workspaceProjects = await projectRepository.find({
      where: { workspace: { id: In(workspaceIds) } },
      select: ['id'],
    });
    for (const project of workspaceProjects) reachable.add(project.id);
  }

  return {
    scope,
    isSystem: false,
    projectIds: [...reachable],
    teamIds,
    workspaceIds,
  };
};

/**
 * Narrow an already-resolved scope to a client-supplied `?projectId=`, but only
 * if the caller can actually reach it. An unreachable id collapses the scope to
 * "nothing", so a foreign id returns no rows instead of every row.
 *
 * Returns `null` when the requested id is not reachable, so callers that would
 * rather 403 than return an empty page can tell the two apart.
 */
export const narrowToRequestedProject = (
  tenant: TenantScope,
  requested?: string | string[],
): string | null => {
  const requestedId = Array.isArray(requested) ? requested[0] : requested;
  if (!requestedId) return null;
  if (tenant.isSystem) return requestedId;
  return tenant.projectIds.includes(requestedId) ? requestedId : null;
};

/**
 * Apply the tenant predicate to a query builder.
 *
 * Note the failure mode this exists to prevent: an empty id list must become
 * `1 = 0`, never "no predicate". Passing an empty array to TypeORM's `IN
 * (:...ids)` throws, and omitting the `andWhere` returns the whole table — both
 * are worse than returning nothing.
 *
 * `projectColumn` is the aliased column holding the project id in the caller's
 * query, e.g. `'project.id'` or `'sample.project_id'`.
 */
export const applyProjectScope = <T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  tenant: TenantScope,
  projectColumn = 'project.id',
): SelectQueryBuilder<T> => {
  if (tenant.isSystem) return qb;
  if (!tenant.projectIds.length) return qb.andWhere('1 = 0');
  return qb.andWhere(`${projectColumn} IN (:...tenantProjectIds)`, {
    tenantProjectIds: tenant.projectIds,
  });
};

/** True when the caller may act on `projectId`. System scope may act on any. */
export const canReachProject = (
  tenant: TenantScope,
  projectId?: string | null,
): boolean => {
  if (tenant.isSystem) return true;
  if (!projectId) return false;
  return tenant.projectIds.includes(projectId);
};
