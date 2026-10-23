import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Scope } from 'src/common/enums/scope.enum';
import { StatusType } from 'src/common/enums/status.enum';
import {
  SCOPE_RANK,
  getUserScopeFromRole,
} from 'src/common/functions/get-user-role';
import { Project } from 'src/entities/project.entity';
import { Role } from 'src/entities/role.entity';
import { UserRole } from 'src/entities/user-role.entity';
import { Workspace } from 'src/entities/workspace.entity';
import { ProjectResponseData } from 'src/common/dto/response/project.response';
import { RedisCacheService } from '../../common/cache/redis-cache.service';
import {
  CacheKeys,
  USER_AUTH_CACHE_PREFIX,
} from '../../common/cache/cache-keys';
import { ProjectsService } from '../projects/projects.service';
import { TenantScopeService } from '../../common/authorization/tenant-scope.service';
import { confersWorkspaceAdmin } from '../../common/authorization/role-matching';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { CreateWorkspaceMemberDto } from './dto/create-workspace-member.dto';
import { CreateWorkspaceProjectDto } from './dto/create-workspace-project.dto';
import { UpdateWorkspaceMemberDto } from './dto/update-workspace-member.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly projectsService: ProjectsService,
    private readonly dataSource: DataSource,
    private readonly cacheService: RedisCacheService,
    private readonly tenantScopeService: TenantScopeService,
  ) {}

  private getProjectIdsFromRoles(roles: any[]): string[] {
    return (roles ?? [])
      .map((userRole) => userRole.project)
      .filter((id): id is string => !!id);
  }

  // FIX-PLAN C2: reject assigning a role whose scope outranks the acting
  // user's own scope, so workspace member management can never be used to
  // seed a system/super-admin-scoped role. Redundant today with the
  // `role.scope !== Scope.Workspace` check right below its call sites
  // (workspace-admin is currently the only workspace-scoped role, and that
  // check already excludes system-scoped roles) — but that check is an
  // equality-on-tag, not a rank comparison, so it stops protecting the
  // moment a *more* privileged workspace-scoped role is ever seeded
  // alongside 'workspace-admin'. This is the general-purpose guard.
  private assertRoleWithinActorRank(role: Role, actingUser: any): void {
    const actorScope = getUserScopeFromRole(actingUser?.roles ?? []);
    const roleRank = SCOPE_RANK[role.scope] ?? 0;
    const actorRank = actorScope ? (SCOPE_RANK[actorScope] ?? 0) : 0;
    if (roleRank > actorRank) {
      throw new ForbiddenException(
        'Cannot assign a role with greater scope than your own',
      );
    }
  }

  // FIX-PLAN C1: a workspace can never be left with zero admin-conferring
  // members via updateMember (demotion) or removeMember. `excludeMemberId`
  // is the UserRole row being changed/removed, so it doesn't count itself
  // as "remaining".
  private async assertNotLastWorkspaceAdmin(
    workspaceId: string,
    excludeMemberId: string,
  ): Promise<void> {
    const members = await this.userRoleRepository.find({
      where: { workspace: { id: workspaceId } },
      relations: ['role', 'role.permissions'],
    });
    const remainingAdmins = members.filter(
      (userRole) =>
        userRole.id !== excludeMemberId && confersWorkspaceAdmin(userRole.role),
    );
    if (remainingAdmins.length === 0) {
      throw new BadRequestException(
        'Cannot remove or demote the last workspace-admin of this workspace',
      );
    }
  }

  /**
   * Create a new workspace and automatically assign the calling user as
   * workspace-admin. Any authenticated user (system scope or existing
   * workspace-admin) may call this — the frontend only exposes this action
   * to workspace-admins and super-admins, but the service itself applies no
   * extra restriction beyond requiring a valid caller.
   *
   * FIX-PLAN B7: the workspace insert and its creator UserRole insert are
   * now one transaction (previously two independent saves — a crash between
   * them left a workspace with no admin at all), and a missing
   * 'workspace-admin' role row now throws instead of silently creating an
   * admin-less, permanently-locked-out workspace.
   */
  async create(
    createWorkspaceDto: CreateWorkspaceDto,
    user: any,
  ): Promise<Workspace> {
    const trimmedName = createWorkspaceDto.name?.trim();
    if (!trimmedName) {
      throw new BadRequestException({
        success: false,
        statusCode: 400,
        message: 'Workspace name is required',
        timestamp: new Date().toISOString(),
      });
    }

    const existingWorkspace = await this.workspaceRepository
      .createQueryBuilder('workspace')
      .where('workspace.name ILIKE :name', { name: trimmedName })
      .andWhere(
        '(workspace.status IS NULL OR workspace.status != :deletedStatus)',
        {
          deletedStatus: StatusType.DELETED,
        },
      )
      .getOne();

    if (existingWorkspace) {
      throw new BadRequestException({
        success: false,
        statusCode: 400,
        message: `Workspace with name "${trimmedName}" already exists`,
        timestamp: new Date().toISOString(),
      });
    }

    const workspaceAdminRole = await this.roleRepository.findOne({
      where: { name: 'workspace-admin' },
    });
    if (!workspaceAdminRole) {
      throw new BadRequestException(
        'The workspace-admin role is not seeded; cannot create a workspace',
      );
    }

    const savedWorkspace = await this.dataSource.transaction(
      async (manager) => {
        const workspace = manager.create(Workspace, {
          name: trimmedName,
          createdBy: { id: user.id },
        });
        const saved = await manager.save(Workspace, workspace);

        const userRole = manager.create(UserRole, {
          user: { id: user.id } as any,
          role: workspaceAdminRole,
          workspace: saved,
        });
        await manager.save(UserRole, userRole);

        return saved;
      },
    );

    // FIX-PLAN B3: this mints a new workspace-admin UserRole for the caller.
    await this.cacheService.delByPrefix(USER_AUTH_CACHE_PREFIX);

    return savedWorkspace;
  }

  /**
   * Workspaces the user "belongs to": either via a direct workspace-scoped
   * UserRole, or indirectly via membership in a project that itself belongs
   * to the workspace (project/team-scoped roles have no UserRole.workspace
   * of their own).
   */
  async findMine(user: any): Promise<Workspace[]> {
    const roles = user?.roles ?? [];
    const userScope = getUserScopeFromRole(roles);

    if (userScope === Scope.System) {
      return this.workspaceRepository.find();
    }

    const workspaceIds = new Set<string>();
    for (const userRole of roles) {
      if (userRole.workspace?.id) {
        workspaceIds.add(userRole.workspace.id);
      }
    }

    const projectIds = this.getProjectIdsFromRoles(roles);
    if (projectIds.length) {
      const projects = await this.projectRepository.find({
        where: { id: In(projectIds) },
        relations: ['workspace'],
      });
      for (const project of projects) {
        if (project.workspace?.id) {
          workspaceIds.add(project.workspace.id);
        }
      }
    }

    if (workspaceIds.size === 0) return [];

    return this.workspaceRepository.find({
      where: { id: In([...workspaceIds]) },
    });
  }

  /**
   * Custom, service-level authorization for a specific workspace. Not backed
   * by @CheckPolicies: AbilityFactory's cascading resolution only grants
   * permissions to a direct workspace-role match (or System scope) for a
   * :workspaceId-shaped request — it has no notion of "reachable via project
   * membership". This mirrors that same rule, plus the project-membership
   * case, so project/team members of a workspace's projects can still view
   * basic workspace info (e.g. for the web picker/breadcrumb).
   */
  async assertWorkspaceAccess(workspaceId: string, user: any): Promise<void> {
    const roles = user?.roles ?? [];
    const userScope = getUserScopeFromRole(roles);
    if (userScope === Scope.System) return;

    const hasDirectRole = roles.some(
      (userRole) => userRole.workspace?.id === workspaceId,
    );
    if (hasDirectRole) return;

    const projectIds = this.getProjectIdsFromRoles(roles);
    if (projectIds.length) {
      const memberProject = await this.projectRepository.findOne({
        where: { id: In(projectIds), workspace: { id: workspaceId } },
      });
      if (memberProject) return;
    }

    throw new ForbiddenException('You do not have access to this workspace');
  }

  async findOne(workspaceId: string, user: any): Promise<Workspace> {
    await this.assertWorkspaceAccess(workspaceId, user);
    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId },
    });
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }
    return workspace;
  }

  /**
   * 4.5: workspace rename. Deliberately stricter than assertWorkspaceAccess
   * (which also allows read-only project/team members) — renaming is a
   * write action, so it requires the caller to actually administer THIS
   * workspace, same "administers this workspace" check used by
   * InvitesService.sendWorkspaceInvite (and fixed the same way — see
   * TenantScopeService.administersWorkspace: membership alone is not enough).
   */
  async update(
    workspaceId: string,
    updateWorkspaceDto: UpdateWorkspaceDto,
    user: any,
  ): Promise<Workspace> {
    const callerScope = getUserScopeFromRole(user?.roles ?? []);
    if (
      callerScope !== Scope.System &&
      !this.tenantScopeService.administersWorkspace(user, workspaceId)
    ) {
      throw new ForbiddenException('You do not administer this workspace');
    }

    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId },
    });
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    if (updateWorkspaceDto.name !== undefined) {
      const trimmedName = updateWorkspaceDto.name?.trim();
      if (!trimmedName) {
        throw new BadRequestException({
          success: false,
          statusCode: 400,
          message: 'Workspace name cannot be empty',
          timestamp: new Date().toISOString(),
        });
      }

      const duplicateWorkspace = await this.workspaceRepository
        .createQueryBuilder('workspace')
        .where('workspace.id != :id', { id: workspaceId })
        .andWhere('workspace.name ILIKE :name', { name: trimmedName })
        .andWhere(
          '(workspace.status IS NULL OR workspace.status != :deletedStatus)',
          {
            deletedStatus: StatusType.DELETED,
          },
        )
        .getOne();

      if (duplicateWorkspace) {
        throw new BadRequestException({
          success: false,
          statusCode: 400,
          message: `Workspace with name "${trimmedName}" already exists`,
          timestamp: new Date().toISOString(),
        });
      }

      workspace.name = trimmedName;
    }

    return this.workspaceRepository.save(workspace);
  }

  async findProjects(workspaceId: string, user: any): Promise<Project[]> {
    await this.assertWorkspaceAccess(workspaceId, user);
    // Without an explicit order, Postgres is free to return these rows in a
    // different sequence on every call. Callers that default to "the first
    // project" (useCurrentProjectResolver()'s workspace fallback) would then
    // silently pin themselves to a different, effectively random project on
    // every refresh.
    return this.projectRepository.find({
      where: { workspace: { id: workspaceId } },
      order: { name: 'ASC' },
    });
  }

  async createProject(
    workspaceId: string,
    createProjectDto: CreateWorkspaceProjectDto,
    user: any,
  ): Promise<ProjectResponseData> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId },
    });
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    const project = await this.projectsService.create({
      ...createProjectDto,
      workspaceId,
      invitedBy: user,
    });

    // FIX-PLAN B3 (coordinator update): a brand-new project can't have a
    // stale project-tenant cache entry yet, but invalidate defensively in
    // case of id reuse in tests/fixtures — cheap, and matches "wherever a
    // project is created ... invalidate PROJECT_TENANT_CACHE_PREFIX".
    if (project?.id) {
      await this.cacheService.del(CacheKeys.projectTenant(project.id));
    }

    return project;
  }

  async findMembers(workspaceId: string): Promise<UserRole[]> {
    return this.userRoleRepository.find({
      where: { workspace: { id: workspaceId } },
      relations: ['user', 'role', 'role.permissions'],
    });
  }

  async addMember(
    workspaceId: string,
    createWorkspaceMemberDto: CreateWorkspaceMemberDto,
    actingUser: any,
  ): Promise<UserRole> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId },
    });
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    const role = await this.roleRepository.findOne({
      where: { id: createWorkspaceMemberDto.roleId },
      relations: ['permissions'],
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    if (role.scope !== Scope.Workspace) {
      throw new BadRequestException(
        'Only workspace-scoped roles can be assigned as a workspace member',
      );
    }
    this.assertRoleWithinActorRank(role, actingUser);

    const existing = await this.userRoleRepository.findOne({
      where: {
        workspace: { id: workspaceId },
        user: { id: createWorkspaceMemberDto.userId },
      },
    });
    if (existing) {
      throw new BadRequestException(
        'This user already has a role in this workspace',
      );
    }

    const userRole = this.userRoleRepository.create({
      user: { id: createWorkspaceMemberDto.userId } as any,
      role,
      workspace,
    });

    const saved = await this.userRoleRepository.save(userRole);
    // FIX-PLAN B3: a removed/added workspace member kept acting with stale
    // cached auth for up to USER_AUTH_CACHE_PREFIX's TTL otherwise.
    await this.cacheService.delByPrefix(USER_AUTH_CACHE_PREFIX);
    return saved;
  }

  async updateMember(
    workspaceId: string,
    memberId: string,
    updateWorkspaceMemberDto: UpdateWorkspaceMemberDto,
    actingUser: any,
  ): Promise<UserRole> {
    const userRole = await this.userRoleRepository.findOne({
      where: { id: memberId, workspace: { id: workspaceId } },
      relations: ['user', 'role', 'role.permissions'],
    });
    if (!userRole) {
      throw new NotFoundException('Workspace member not found');
    }

    const role = await this.roleRepository.findOne({
      where: { id: updateWorkspaceMemberDto.roleId },
      relations: ['permissions'],
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    if (role.scope !== Scope.Workspace) {
      throw new BadRequestException(
        'Only workspace-scoped roles can be assigned as a workspace member',
      );
    }
    this.assertRoleWithinActorRank(role, actingUser);

    // FIX-PLAN C1: block a demotion that would leave zero admins.
    const wasAdmin = confersWorkspaceAdmin(userRole.role);
    const willBeAdmin = confersWorkspaceAdmin(role);
    if (wasAdmin && !willBeAdmin) {
      await this.assertNotLastWorkspaceAdmin(workspaceId, memberId);
    }

    userRole.role = role;
    const saved = await this.userRoleRepository.save(userRole);
    await this.cacheService.delByPrefix(USER_AUTH_CACHE_PREFIX);
    return saved;
  }

  async removeMember(workspaceId: string, memberId: string): Promise<void> {
    const userRole = await this.userRoleRepository.findOne({
      where: { id: memberId, workspace: { id: workspaceId } },
      relations: ['role', 'role.permissions'],
    });
    if (!userRole) {
      throw new NotFoundException('Workspace member not found');
    }

    // FIX-PLAN C1: block removing the last admin-conferring member.
    if (confersWorkspaceAdmin(userRole.role)) {
      await this.assertNotLastWorkspaceAdmin(workspaceId, memberId);
    }

    await this.userRoleRepository.remove(userRole);
    await this.cacheService.delByPrefix(USER_AUTH_CACHE_PREFIX);
  }
}
