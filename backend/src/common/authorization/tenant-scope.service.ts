import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from 'src/entities/project.entity';
import { SCOPE_RANK, getUserScopeFromRole } from '../functions/get-user-role';
import {
  TenantScope,
  narrowToRequestedProject,
  resolveTenantScope,
} from '../functions/tenant-scope';
import {
  RoleContext,
  UserRoleLike,
  administersProject,
  administersTeam,
  administersWorkspace,
  canInContext,
  rolesForProject,
} from './role-matching';

type ActingUser = { id?: string; roles?: UserRoleLike[] } | null | undefined;

/**
 * The single entry point for "what may this user see and do".
 *
 * Two things this exists to fix:
 *
 * 1. **Repeated work.** `resolveTenantScope` runs a query to expand a
 *    workspace role into its projects. It was called from 35 sites, several of
 *    which run within one request (a controller and the service it delegates
 *    to), so the same query ran several times per request. Results are
 *    memoised per acting user, and because `req.user` is a fresh object per
 *    request (JwtStrategy rehydrates it from Redis), a WeakMap keyed on it is
 *    a per-request cache that needs no explicit invalidation and cannot leak
 *    between users.
 *
 * 2. **Duplicated predicates.** Four services each carried a private copy of
 *    `administersWorkspace`, with comments in each noting it duplicated
 *    another. They are one implementation now.
 */
@Injectable()
export class TenantScopeService {
  /**
   * Keyed on the acting-user object identity, so an entry dies with the
   * request that created it. Deliberately not keyed on user id: that would
   * outlive the request and serve a stale scope after a role change.
   */
  private readonly perRequestCache = new WeakMap<
    object,
    Promise<TenantScope>
  >();

  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  /** The projects, workspaces and teams this user can reach. */
  async forUser(user: ActingUser): Promise<TenantScope> {
    if (!user) {
      return {
        scope: null,
        isSystem: false,
        projectIds: [],
        teamIds: [],
        workspaceIds: [],
      };
    }

    const cached = this.perRequestCache.get(user as object);
    if (cached) return cached;

    const pending = resolveTenantScope(user, this.projectRepository);
    this.perRequestCache.set(user as object, pending);
    return pending;
  }

  async canReachProject(user: ActingUser, projectId?: string | null) {
    const tenant = await this.forUser(user);
    if (tenant.isSystem) return true;
    if (!projectId) return false;
    return tenant.projectIds.includes(projectId);
  }

  /** Throws rather than returning a boolean, for write paths. */
  async assertCanReachProject(
    user: ActingUser,
    projectId: string | null | undefined,
    resourceLabel = 'resource',
  ): Promise<void> {
    if (!(await this.canReachProject(user, projectId))) {
      throw new ForbiddenException(
        `You do not have access to this ${resourceLabel}`,
      );
    }
  }

  /**
   * Narrow to a client-supplied `?projectId=`, refusing one the caller cannot
   * reach. Returns null when unreachable so callers can choose between 403 and
   * an empty result — never widen the scope on an unknown id.
   */
  async narrowToRequested(
    user: ActingUser,
    requested?: string | string[],
  ): Promise<string | null> {
    return narrowToRequestedProject(await this.forUser(user), requested);
  }

  administersWorkspace(user: ActingUser, workspaceId?: string | null): boolean {
    return administersWorkspace(user, workspaceId);
  }

  assertAdministersWorkspace(
    user: ActingUser,
    workspaceId: string | null | undefined,
    action = 'perform this action on',
  ): void {
    if (this.isSystem(user)) return;
    if (!administersWorkspace(user, workspaceId)) {
      throw new ForbiddenException(
        `You do not administer the workspace you are trying to ${action}`,
      );
    }
  }

  /** Every role this user holds in one specific project. */
  rolesForProject(user: ActingUser, projectId?: string | null): UserRoleLike[] {
    return rolesForProject(user, projectId);
  }

  /**
   * Service-layer permission check using the same cascade as the CASL guard,
   * for decisions the guard cannot make because they depend on a body or a
   * looked-up row rather than a route param.
   */
  can(
    user: ActingUser,
    action: string,
    subject: string,
    context: RoleContext,
  ): boolean {
    return canInContext(user, action, subject, context);
  }

  isSystem(user: ActingUser): boolean {
    return (user?.roles ?? []).some(
      (userRole) => userRole.role?.scope === 'system',
    );
  }

  administersProject(user: ActingUser, projectId?: string | null): boolean {
    return administersProject(user, projectId);
  }

  administersTeam(user: ActingUser, teamId?: string | null): boolean {
    return administersTeam(user, teamId);
  }

  /**
   * A project-scoped `UserRole` row never carries `workspace` (only a
   * genuinely workspace-scoped row does - see `user-role.entity.ts` and how
   * `teams.service.ts`/`projects.service.ts` construct these rows), so
   * reaching a project-scoped target from a workspace-admin actor needs this
   * lookup. Mirrors `AbilityFactory`'s private `resolveProjectWorkspace`,
   * without its Redis caching - this runs on a rare, human-triggered admin
   * action, not a hot path.
   */
  private async resolveProjectWorkspaceId(
    projectId: string,
  ): Promise<string | null> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['workspace'],
      select: { id: true },
    });
    return project?.workspace?.id ?? null;
  }

  /**
   * Can `actingUser` manage (e.g. anonymize) `targetUser`'s account?
   *
   * System scope may manage anyone here - the "don't anonymize the last
   * active super-admin" operational safeguard is a separate concern for the
   * caller (mirroring `UserService.removeSuperAdmin`'s own check), not a
   * scope/reach question this method can answer.
   *
   * Otherwise, both must hold:
   *  - the actor's own scope rank is strictly greater than the target's
   *    highest role scope (a team-admin can never reach a project- or
   *    workspace-admin, and two peers at the same tier can never reach each
   *    other - "roles that come under them" is read as strictly below, not
   *    including peers);
   *  - the actor genuinely administers - not merely belongs to - at least
   *    one workspace/project/team the target holds a role in, so rank alone
   *    can't reach into a tenant the actor has nothing to do with. A
   *    project-scoped target role that doesn't directly match also tries the
   *    project's parent workspace, so a workspace-admin can reach a
   *    project-admin or plain member within their own workspace, not just
   *    another workspace-scoped row.
   *
   * A target with no roles at all has nothing to rank or reach-check against,
   * so any admin-tier actor may act on them.
   */
  async canManageUser(
    actingUser: ActingUser,
    targetUser: { roles?: UserRoleLike[] } | null | undefined,
  ): Promise<boolean> {
    if (this.isSystem(actingUser)) return true;

    const actorScope = getUserScopeFromRole(actingUser?.roles ?? []);
    const actorRank = actorScope ? (SCOPE_RANK[actorScope] ?? 0) : 0;
    if (actorRank === 0) return false;

    const targetRoles = targetUser?.roles ?? [];
    const targetScope = getUserScopeFromRole(targetRoles);
    const targetRank = targetScope ? (SCOPE_RANK[targetScope] ?? 0) : 0;
    if (targetRank >= actorRank) return false;

    if (!targetRoles.length) return true;

    for (const userRole of targetRoles) {
      if (
        userRole.workspace?.id &&
        administersWorkspace(actingUser, userRole.workspace.id)
      ) {
        return true;
      }
      if (userRole.project) {
        if (administersProject(actingUser, userRole.project)) return true;
        const workspaceId = await this.resolveProjectWorkspaceId(
          userRole.project,
        );
        if (workspaceId && administersWorkspace(actingUser, workspaceId)) {
          return true;
        }
      }
      if (userRole.team && administersTeam(actingUser, userRole.team)) {
        return true;
      }
    }

    return false;
  }
}
