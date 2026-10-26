import { AbilityBuilder, AbilityClass, PureAbility } from '@casl/ability';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/entities/project.entity';
import { Repository } from 'typeorm';
import { getUserScopeFromRole } from '../functions/get-user-role';
import { Scope } from '../enums/scope.enum';
import { matchRolesForContext } from '../authorization/role-matching';
import { RedisCacheService } from '../cache/redis-cache.service';
import { CacheKeys } from '../cache/cache-keys';

export type Action = 'manage' | 'create' | 'read' | 'update' | 'delete';
export type Subject =
  | 'user'
  | 'workspace'
  | 'workspace-member'
  | 'project'
  | 'data-import'
  | 'team'
  | 'team-member'
  | 'site'
  | 'collection-plan'
  | 'visit'
  | 'sample'
  | 'sample-test'
  | 'disease'
  | 'region'
  | 'kit'
  | 'location'
  | 'media'
  | 'sequencing'
  | 'surveillance-type'
  | 'species'
  | 'all';

export type AppAbility = PureAbility<[string, string]>;

export const AppAbilityClass = PureAbility as AbilityClass<AppAbility>;

/**
 * Declared by `PoliciesGuard` from the route's `@TenantAgnostic()` /
 * `@ServiceScoped()` metadata. See `common/decorators/tenant-scope.decorator.ts`.
 */
export interface AbilityContext {
  /** Route serves global reference data owned by no tenant. */
  tenantAgnostic?: boolean;
  /** Route serves tenant data with no tenant param; the service filters. */
  serviceScoped?: boolean;
}

/** Minimal projection of a project, cached purely to resolve its workspace. */
interface ProjectTenant {
  id: string;
  workspaceId: string | null;
}

@Injectable()
export class AbilityFactory {
  private readonly logger = new Logger(AbilityFactory.name);

  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly cacheService: RedisCacheService,
  ) {}

  async defineAbility(req, context: AbilityContext = {}): Promise<AppAbility> {
    const { can, build } = new AbilityBuilder<AppAbility>(
      PureAbility as AbilityClass<AppAbility>,
    );

    const buildResult = () =>
      build({ detectSubjectType: (item: any) => item.constructor as Subject });

    try {
      // JwtStrategy already loaded roles -> role.permissions, project, team,
      // workspace onto req.user; no need to hit the DB again for the same
      // data.
      const roles = req.user?.roles ?? [];
      const userScope = getUserScopeFromRole(roles);

      if (userScope === Scope.System) {
        can('manage', 'all');
        return buildResult();
      }

      const { projectId, teamId, workspaceId: workspaceIdParam } = req.params;

      // Resolve the acting workspace: directly from a :workspaceId route
      // param when present, otherwise by looking up the target project's
      // workspace.
      let workspaceId: string | undefined = workspaceIdParam;

      if (projectId && !workspaceId) {
        workspaceId =
          (await this.resolveProjectWorkspace(projectId)) ?? undefined;
      }

      if (!projectId && !workspaceId) {
        // Nothing to scope against. This used to fall through to "grant every
        // permission the user holds anywhere", which is precisely how a
        // workspace-A admin reached workspace-B data through any route whose
        // param wasn't literally named :projectId.
        //
        // Now the permissive branch is an explicit, greppable opt-in and
        // everything else fails closed. `@TenantAgnostic()` promises the route
        // owns no tenant data; `@ServiceScoped()` promises the service filters
        // by the caller's own memberships (common/functions/tenant-scope.ts).
        if (!context.tenantAgnostic && !context.serviceScoped) {
          this.logger.warn(
            `Denied ${req.method ?? 'request'} ${req.route?.path ?? req.url ?? ''}: ` +
              'no :projectId/:workspaceId resolved and the route declares neither ' +
              '@TenantAgnostic() nor @ServiceScoped().',
          );
          return buildResult();
        }

        roles.forEach(({ role }) => {
          for (const { action, subject } of role?.permissions ?? []) {
            can(action, subject);
          }
        });
        return buildResult();
      }

      // Which of the user's roles apply here. The cascade itself lives in
      // common/authorization/role-matching.ts so that services asking the
      // same question through TenantScopeService.can() get the same answer -
      // a guard and a service that each implement "what may this user do
      // here" will eventually disagree, and the disagreement is a hole.
      //
      // A user holding different roles in different projects gets exactly the
      // grants of the project being acted on, never the union across all of
      // them.
      const matched = matchRolesForContext(roles, {
        projectId,
        workspaceId,
        teamId,
      });

      for (const { role } of matched.effective) {
        for (const { action, subject } of role?.permissions ?? []) {
          can(action, subject);
        }
      }

      return buildResult();
    } catch (error) {
      // Previously this swallowed the error and returned `undefined`, which
      // then blew up inside PoliciesGuard. Fail closed instead: an empty
      // ability denies everything, and the cause is logged rather than lost.
      this.logger.error(
        `Failed to build ability for user ${req?.user?.id ?? 'unknown'}; denying request`,
        error instanceof Error ? error.stack : String(error),
      );
      return buildResult();
    }
  }

  /**
   * Which workspace owns this project. Cached briefly because it is read on
   * every authenticated request that carries a :projectId.
   *
   * Only the workspace id is stored. The previous version cached the whole
   * project graph — `members`, `members.roles.role.permissions`, `teams`,
   * `teams.members` — to feed a membership gate that has since been removed as
   * dead code, at the cost of that join on every cache miss.
   */
  private async resolveProjectWorkspace(
    projectId: string,
  ): Promise<string | null> {
    const cacheKey = CacheKeys.projectTenant(projectId);
    const cached = await this.cacheService.get<ProjectTenant>(cacheKey);
    if (cached) return cached.workspaceId;

    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['workspace'],
      select: { id: true },
    });

    const resolved: ProjectTenant = {
      id: projectId,
      workspaceId: project?.workspace?.id ?? null,
    };
    await this.cacheService.set(cacheKey, resolved, 30);
    return resolved.workspaceId;
  }
}
