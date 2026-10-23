import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.entity';
import { User } from 'src/entities/user.entity';
import { UserRole } from 'src/entities/user-role.entity';
import { Workspace } from 'src/entities/workspace.entity';
import { In, Repository } from 'typeorm';
import { UpdateAccessDto } from './dto/update-access.dto';
import { RedisCacheService } from '../../common/cache/redis-cache.service';
import { USER_AUTH_CACHE_PREFIX } from '../../common/cache/cache-keys';
import { Scope } from 'src/common/enums/scope.enum';
import { getUserScopeFromRole } from 'src/common/functions/get-user-role';
import { TenantScopeService } from '../../common/authorization/tenant-scope.service';

@Injectable()
export class AccessService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
    private readonly cacheService: RedisCacheService,
    private readonly tenantScopeService: TenantScopeService,
  ) {}

  // FIX-PLAN A13: GET /access/:id used to return ANY user's full
  // role/permission record to ANY authenticated caller with 'read user'
  // (broadly seeded) - the route has no :projectId/:workspaceId for
  // AbilityFactory to scope by. Require the caller to share a project or
  // workspace with the target (via TenantScopeService.forUser), or hold
  // System scope, or be looking up their own record.
  async findOne(query: any, currentUser?: any): Promise<User> {
    try {
      const targetUser = await this.userRepository.findOne({
        where: query,
        relations: ['roles', 'roles.permissions', 'roles.workspace'],
      });
      if (!targetUser) {
        throw new NotFoundException(`UserRole with query ${query} not found`);
      }

      if (currentUser && currentUser.id !== targetUser.id) {
        const tenant = await this.tenantScopeService.forUser(currentUser);
        if (!tenant.isSystem) {
          const targetWorkspaceIds = new Set(
            (targetUser.roles ?? [])
              .map((userRole) => userRole.workspace?.id)
              .filter((id): id is string => !!id),
          );
          const targetProjectIds = new Set(
            (targetUser.roles ?? [])
              .map((userRole) => userRole.project)
              .filter((id): id is string => !!id),
          );
          const sharesTenant =
            tenant.workspaceIds.some((id) => targetWorkspaceIds.has(id)) ||
            tenant.projectIds.some((id) => targetProjectIds.has(id));
          if (!sharesTenant) {
            throw new ForbiddenException(
              'You do not share a project or workspace with this user',
            );
          }
        }
      }

      return targetUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new NotFoundException(`UserRole with ID ${query} not found`);
    }
  }

  async update(
    userId: string,
    updateUserRoleDto: UpdateAccessDto,
    currentUser: any,
  ): Promise<User> {
    const { roles, workspaceId } = updateUserRoleDto;
    const callerScope = getUserScopeFromRole(currentUser?.roles ?? []);

    // Belt-and-suspenders alongside the route's
    // @CheckPolicies(Manage, 'user' || 'workspace-member'): only System scope
    // (super-admin) or Workspace scope (workspace-admin) may reassign roles
    // through this endpoint at all.
    if (callerScope !== Scope.System && callerScope !== Scope.Workspace) {
      throw new ForbiddenException(
        "Only system-scope or workspace-scope users can reassign a user's roles",
      );
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.workspace'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const roleList = await this.roleRepository.find({
      where: { id: In(roles) },
    });
    if (roleList.length === 0) {
      await this.cacheService.delByPrefix(USER_AUTH_CACHE_PREFIX);
      return this.userRepository.findOne({
        where: { id: userId },
        relations: ['roles', 'roles.role', 'roles.role.permissions'],
      });
    }

    if (callerScope === Scope.System) {
      // Full unscoped replacement — matches the original (broken) "user.roles
      // = roleList" intent, just done via the actual join entity instead of
      // assigning Role[] directly to a UserRole[] relation. Only super-admin
      // can reach this branch, and can assign ANY role (including
      // system/workspace-scoped ones).
      if (user.roles?.length) {
        await this.userRoleRepository.remove(user.roles);
      }
      const newUserRoles = roleList.map((role) =>
        this.userRoleRepository.create({ user, role }),
      );
      await this.userRoleRepository.save(newUserRoles);
    } else {
      // Workspace-admin path: may ONLY grant workspace-scoped roles (never
      // super-admin/system roles), and only within a workspace they
      // themselves directly administer. Unlike the System branch, this only
      // replaces the target user's role(s) FOR THAT WORKSPACE, leaving any
      // other project/team/workspace roles the user has elsewhere untouched.
      if (!workspaceId) {
        throw new BadRequestException(
          'workspaceId is required to assign a workspace role',
        );
      }
      if (roleList.some((role) => role.scope !== Scope.Workspace)) {
        throw new ForbiddenException(
          'Workspace admins may only assign workspace-scoped roles',
        );
      }

      // @CheckPolicies only confirms the caller has a workspace-admin-shaped
      // role SOMEWHERE (this route has no :workspaceId param for
      // AbilityFactory to match against) — this explicit check is what
      // actually confirms they administer THIS specific workspace. Same
      // class of bug as FIX-PLAN A5 (InvitesService.sendWorkspaceInvite):
      // checking for ANY role tied to the workspace would let a plain
      // member reassign roles (including granting themselves/others
      // workspace-admin) in a workspace they merely belong to.
      if (
        !this.tenantScopeService.administersWorkspace(currentUser, workspaceId)
      ) {
        throw new ForbiddenException('You do not administer this workspace');
      }

      const workspace = await this.workspaceRepository.findOne({
        where: { id: workspaceId },
      });
      if (!workspace) {
        throw new NotFoundException('Workspace not found');
      }

      const existingWorkspaceRoles = (user.roles ?? []).filter(
        (userRole) => userRole.workspace?.id === workspaceId,
      );
      if (existingWorkspaceRoles.length) {
        await this.userRoleRepository.remove(existingWorkspaceRoles);
      }
      const newUserRoles = roleList.map((role) =>
        this.userRoleRepository.create({ user, role, workspace }),
      );
      await this.userRoleRepository.save(newUserRoles);
    }

    await this.cacheService.delByPrefix(USER_AUTH_CACHE_PREFIX);

    return this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.role', 'roles.role.permissions'],
    });
  }
}
