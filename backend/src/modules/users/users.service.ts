import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invite } from 'src/entities/invite.entity';
import { Otp } from 'src/entities/otp.entity';
import { Project } from 'src/entities/project.entity';
import { UserRole } from 'src/entities/user-role.entity';
import { User } from 'src/entities/user.entity';
import { Brackets, DataSource, Repository } from 'typeorm';
import { StatusType } from '../../common/enums/status.enum';
import { RolesService } from '../roles/roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LookupUserDto, LookupUserResult } from './dto/lookup-user.dto';
import { Media } from 'src/entities/media.entity';
import { MulterConfigService } from '../media/media.service';
import { isUUID } from 'class-validator';
import { RoleType } from 'src/common/enums/user-type.enum';
import { RedisCacheService } from '../../common/cache/redis-cache.service';
import { USER_AUTH_CACHE_PREFIX } from '../../common/cache/cache-keys';
import { In } from 'typeorm';
import { TenantScopeService } from '../../common/authorization/tenant-scope.service';
import { confersWorkspaceAdmin } from '../../common/authorization/role-matching';
import { generateOtp } from '../../common/functions/generate-otp';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    private readonly roleService: RolesService,
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    private readonly mediaService: MulterConfigService,
    private readonly cacheService: RedisCacheService,
    private readonly tenantScopeService: TenantScopeService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const isUserExist = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (isUserExist) {
        throw new BadRequestException({
          success: false,
          statusCode: 400,
          message: 'User already exist',
          timestamp: new Date().toISOString(),
        });
      }
      const { role } = createUserDto;

      // Find role data
      const roleData = await this.roleService.findOne({ name: role });
      if (!roleData) {
        throw new BadRequestException({
          success: false,
          statusCode: 400,
          message: 'Role not found',
          timestamp: new Date().toISOString(),
        });
      }

      // Create user instance
      let user = this.userRepository.create(createUserDto);

      // Save user to database first
      user = await this.userRepository.save(user);

      // Save OTP
      const otpDataPayload = {
        id: user.id, // Only store necessary data
        otp: generateOtp(),
        status: StatusType.ACTIVE,
      };
      await this.otpRepository.save(otpDataPayload as any);

      // Create UserRole
      const userRole = this.userRoleRepository.create({
        user, // Pass the saved user
        role: roleData,
        team: createUserDto.team,
        project: createUserDto.project,
      });

      // Save UserRole
      await this.userRoleRepository.save(userRole);
      // console.log('userRole', userRole);

      return user;
    } catch (error) {
      console.error('Create user error', error);
      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });

      // const roleData = await this.roleService.findOne({
      //   name: updateUserDto.role,
      // });
      if (!user) {
        throw new BadRequestException({
          success: false,
          statusCode: 400,
          message: 'User not found',
          timestamp: new Date().toISOString(),
        });
      }

      if (updateUserDto.profilePicture) {
        const arr = updateUserDto.profilePicture.split('/');
        const key = arr[arr.length - 1];

        const file = await this.mediaRepository.create({
          key: `${process.env.S3_FOLDER}/${process.env.NODE_ENV}/${key}`,
          path: updateUserDto.profilePicture,
        });

        await this.mediaRepository.save(file);
        updateUserDto.profilePicture = file.id;
      }
      // const userRole = await this.userRoleRepository.create({
      //   user: user,
      //   role: roleData,
      // });

      // await this.userRoleRepository.save(userRole);
      // If the user exists, update the existing user.
      //
      // FIX-PLAN A6: this used to be `save({ ...user, ...updateUserDto })`,
      // a raw spread that let ANY key in the DTO land on the row - including
      // `status` (no DB trigger guards it at all) and `project`/`team`
      // (migration 1787's trigger only blocks non-null -> non-null changes,
      // so any user whose column is currently NULL - every self-serve
      // signup user, every workspace-admin - could set it ONCE to anything).
      // This method is shared by PATCH /users/profile (self-service, driven
      // by the deliberately narrow UpdateOwnProfileDto) and the admin-only
      // PATCH /users/:id and /users/super-admins/:id routes, so the
      // allow-list below is enforced regardless of which caller/DTO reached
      // here - `role`/`project`/`team`/`status` are deliberately excluded;
      // those belong to proper UserRole-management flows, not this method.
      const assignableFields: (keyof User)[] = [
        'firstName',
        'lastName',
        'email',
        'contactNumber',
        'designation',
        'profilePicture',
      ];
      const assignable: Partial<User> = {};
      const incomingFields = updateUserDto as unknown as Partial<User>;
      for (const field of assignableFields) {
        const incoming = incomingFields[field];
        if (incoming !== undefined) {
          (assignable as any)[field] = incoming;
        }
      }
      await this.userRepository.save({ id: user.id, ...assignable });

      return this.findOne({ id: user.id });
    } catch (error) {
      console.log('update user error', error);
      throw error;
    }
  }

  async findAll(query: any): Promise<User[]> {
    return this.userRepository.find({
      where: { ...query, status: StatusType.ACTIVE },
    });
  }

  async findSuperAdmins(actorUserId: string): Promise<User[]> {
    await this.assertSystemAdmin(actorUserId);

    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'userRoles')
      .leftJoinAndSelect('userRoles.role', 'role')
      .where('user.status = :status', { status: StatusType.ACTIVE })
      .andWhere('userRoles.status = :userRoleStatus', {
        userRoleStatus: StatusType.ACTIVE,
      })
      .andWhere('role.name = :roleName', { roleName: RoleType.SUPER_ADMIN })
      .orderBy('user.createdAt', 'ASC')
      .getMany();
  }

  async createSuperAdmin(
    actorUserId: string,
    createSuperAdminDto: CreateUserDto,
  ): Promise<User> {
    await this.assertSystemAdmin(actorUserId);

    const isUserExist = await this.userRepository.findOne({
      where: { email: createSuperAdminDto.email },
    });
    if (isUserExist) {
      throw new BadRequestException({
        success: false,
        statusCode: 400,
        message: 'User already exist',
        timestamp: new Date().toISOString(),
      });
    }

    const payload = {
      ...createSuperAdminDto,
      role: RoleType.SUPER_ADMIN,
    };

    return this.create(payload);
  }

  async updateSuperAdmin(
    actorUserId: string,
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    await this.assertSystemAdmin(actorUserId);
    await this.ensureSuperAdmin(id);
    return this.update(id, {
      ...updateUserDto,
      role: undefined,
      project: undefined,
      team: undefined,
    });
  }

  async removeSuperAdmin(id: string, actingUserId: string): Promise<void> {
    await this.assertSystemAdmin(actingUserId);

    const activeSuperAdminRoles = await this.userRoleRepository
      .createQueryBuilder('userRole')
      .leftJoinAndSelect('userRole.user', 'user')
      .leftJoinAndSelect('userRole.role', 'role')
      .where('userRole.status = :status', { status: StatusType.ACTIVE })
      .andWhere('user.status = :userStatus', { userStatus: StatusType.ACTIVE })
      .andWhere('role.name = :roleName', { roleName: RoleType.SUPER_ADMIN })
      .getMany();

    const targetRole = activeSuperAdminRoles.find(
      (userRole) => userRole.user?.id === id,
    );

    if (!targetRole) {
      throw new BadRequestException({
        success: false,
        statusCode: 400,
        message: 'Super admin not found',
        timestamp: new Date().toISOString(),
      });
    }

    if (activeSuperAdminRoles.length <= 1) {
      throw new BadRequestException({
        success: false,
        statusCode: 400,
        message: 'At least one super admin must remain active.',
        timestamp: new Date().toISOString(),
      });
    }

    if (actingUserId === id && activeSuperAdminRoles.length < 2) {
      throw new BadRequestException({
        success: false,
        statusCode: 400,
        message:
          'You cannot remove yourself unless another super admin exists.',
        timestamp: new Date().toISOString(),
      });
    }

    await this.userRoleRepository.remove(targetRole);
    await this.cacheService.delByPrefix(USER_AUTH_CACHE_PREFIX);
  }

  async findOneWithRolesAndPermissions(userId: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.permissions'],
    });
  }

  /**
   * Exact-match identity check used by every "add a user" form.
   *
   * The forms ask for an email or phone first, call this, and either
   * pre-populate the existing user's name (read-only) or reveal the fields to
   * collect a new user's details. That ordering is what stops an admin
   * re-typing a name for someone who already exists and silently renaming
   * them globally.
   *
   * Returns `{ exists: false }` rather than throwing when nothing matches —
   * "no such user" is the ordinary, expected answer here, not an error.
   *
   * Scope note: this is an existence oracle on an identifier, so it is
   * limited to exact matches and returns only a display name (see
   * LookupUserMatch). Any authenticated user can call it, which mirrors what
   * the add-member endpoints already leak: they reject a duplicate by
   * name/email in the error message anyway.
   */
  async lookupByIdentity(query: LookupUserDto): Promise<LookupUserResult> {
    const email = query.email?.trim();
    const contactNumber = query.contactNumber?.trim();

    if (!email && !contactNumber) {
      throw new BadRequestException({
        success: false,
        statusCode: 400,
        message: 'Provide an email or a contact number to look up.',
        timestamp: new Date().toISOString(),
      });
    }

    const qb = this.userRepository
      .createQueryBuilder('user')
      .where('user.status = :status', { status: StatusType.ACTIVE });

    // Only the identifier that was actually supplied is matched. Building
    // this with an OR over both would let a caller pass a known-good email
    // alongside a guessed phone and not be able to tell which one hit.
    if (email) {
      qb.andWhere('LOWER(user.email) = LOWER(:email)', { email });
    } else {
      qb.andWhere('user.contactNumber = :contactNumber', { contactNumber });
    }

    const user = await qb.getOne();

    if (!user) return { exists: false };

    return {
      exists: true,
      user: {
        id: user.id,
        firstName: user.firstName ?? null,
        lastName: user.lastName ?? null,
        email: user.email ?? null,
        contactNumber: user.contactNumber ?? null,
      },
    };
  }

  async findOne(query: any): Promise<User> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.roles', 'userRoles')
        .leftJoinAndSelect('userRoles.role', 'roles')
        .leftJoinAndSelect('roles.permissions', 'permissions')
        .leftJoinAndSelect('userRoles.workspace', 'userRoleWorkspace')
        .leftJoinAndSelect('user.project', 'project')
        .leftJoinAndSelect('user.team', 'team')
        .where(
          new Brackets((qb) => {
            qb.where('LOWER(user.email) = LOWER(:email)', {
              email: query.email,
            })
              .orWhere('user.contactNumber = :contactNumber', {
                contactNumber: query.contactNumber,
              })
              .orWhere('user.id = :userId', { userId: query.id });
          }),
        )
        .andWhere('user.status = :status', { status: StatusType.ACTIVE })
        .getOne();

      if (!user)
        throw new BadRequestException({
          success: false,
          statusCode: 400,
          message: 'User not found',
          timestamp: new Date().toISOString(),
        });

      const projectIds = [
        ...new Set(
          (user.roles ?? [])
            .map((userRole) => userRole.project)
            .filter((projectId): projectId is string => Boolean(projectId)),
        ),
      ];
      if (projectIds.length) {
        user.projects = await this.projectRepository.find({
          where: { id: In(projectIds) },
        });
      } else {
        user.projects = [];
      }

      let signedUrl = null;
      if (user.profilePicture && isUUID(user.profilePicture)) {
        const photo = await this.mediaRepository.findOne({
          where: { id: user.profilePicture },
        });
        if (!photo) {
          return { ...user, profilePicture: null };
        }

        signedUrl = await this.mediaService.getSignedFileUrl(photo.key);
      }

      return { ...user, profilePicture: signedUrl };
    } catch (error) {
      console.log('get user error', error);
      throw error;
    }
  }

  /**
   * Anonymize (never hard-delete) a user's account. PM decision: no record
   * is ever removed, and the person's name stays - only contact/identifying
   * detail is scrubbed. Admin-triggered only; the caller must genuinely
   * outrank and administer the target (see `TenantScopeService.canManageUser`).
   *
   * `findActiveUserWithRoles` already filters to `status = ACTIVE`, so
   * calling this twice on the same target naturally 404s the second time
   * rather than needing a separate idempotency guard.
   */
  async anonymize(targetId: string, actingUser: any): Promise<void> {
    const target = await this.findActiveUserWithRoles(targetId);
    if (!target) {
      throw new BadRequestException({
        success: false,
        statusCode: 400,
        message: 'User not found',
        timestamp: new Date().toISOString(),
      });
    }

    if (!(await this.tenantScopeService.canManageUser(actingUser, target))) {
      throw new ForbiddenException(
        'You are not allowed to manage this account',
      );
    }

    if (this.tenantScopeService.isSystem(actingUser)) {
      await this.assertNotLastActiveSuperAdmin(targetId);
    }

    const adminWorkspaceIds = new Set(
      (target.roles ?? [])
        .filter(
          (userRole) =>
            userRole.workspace?.id && confersWorkspaceAdmin(userRole.role),
        )
        .map((userRole) => userRole.workspace!.id),
    );
    for (const workspaceId of adminWorkspaceIds) {
      await this.assertNotLastActiveWorkspaceAdmin(targetId, workspaceId);
    }

    const mediaId =
      target.profilePicture && isUUID(target.profilePicture)
        ? target.profilePicture
        : null;
    const email = target.email;
    const contactNumber = target.contactNumber;

    await this.dataSource.transaction(async (manager) => {
      if (mediaId) {
        const media = await manager.findOne(Media, { where: { id: mediaId } });
        if (media) {
          await this.mediaService.deleteObject(media.key);
          await manager.delete(Media, { id: media.id });
        }
      }

      await manager.update(
        User,
        { id: targetId },
        {
          email: null,
          contactNumber: null,
          address: null,
          profilePicture: null,
          status: StatusType.DELETED,
        },
      );

      if (email) await manager.delete(Otp, { email });
      if (contactNumber) await manager.delete(Otp, { contactNumber });

      // Being invited is the normal onboarding path, so an anonymized
      // user's contact info otherwise survives, fully readable, in their
      // own old invites row. Scrub, don't delete - same principle already
      // applied to the User row itself above.
      if (email) await manager.update(Invite, { email }, { email: null });
      if (contactNumber) {
        await manager.update(
          Invite,
          { contactNumber },
          { contactNumber: null },
        );
      }
    });

    await this.cacheService.delByPrefix(USER_AUTH_CACHE_PREFIX);
  }

  /**
   * Same eager-loading as `findOne` (roles -> role -> permissions, plus
   * userRoles.workspace) so `canManageUser` sees the same shape it expects -
   * but without `findOne`'s profilePicture -> signed-URL substitution, since
   * `anonymize` needs the raw `Media` row id to delete the underlying object.
   */
  private async findActiveUserWithRoles(id: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'userRoles')
      .leftJoinAndSelect('userRoles.role', 'roles')
      .leftJoinAndSelect('roles.permissions', 'permissions')
      .leftJoinAndSelect('userRoles.workspace', 'userRoleWorkspace')
      .where('user.id = :id', { id })
      .andWhere('user.status = :status', { status: StatusType.ACTIVE })
      .getOne();
  }

  /** Mirrors the invariant `removeSuperAdmin` already enforces. */
  private async assertNotLastActiveSuperAdmin(targetId: string): Promise<void> {
    const activeSuperAdminRoles = await this.userRoleRepository
      .createQueryBuilder('userRole')
      .leftJoinAndSelect('userRole.user', 'user')
      .leftJoinAndSelect('userRole.role', 'role')
      .where('userRole.status = :status', { status: StatusType.ACTIVE })
      .andWhere('user.status = :userStatus', { userStatus: StatusType.ACTIVE })
      .andWhere('role.name = :roleName', { roleName: RoleType.SUPER_ADMIN })
      .getMany();

    const targetIsSuperAdmin = activeSuperAdminRoles.some(
      (userRole) => userRole.user?.id === targetId,
    );
    if (!targetIsSuperAdmin) return;

    if (activeSuperAdminRoles.length <= 1) {
      throw new BadRequestException({
        success: false,
        statusCode: 400,
        message: 'At least one super admin must remain active.',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Same invariant as `WorkspacesService`'s `assertNotLastWorkspaceAdmin`
   * (FIX-PLAN C1), but excludes by the target user's id rather than by a
   * specific `UserRole` row id - anonymize removes a person, not one role
   * assignment. Reuses the shared `confersWorkspaceAdmin` predicate; the
   * "count remaining and assert" wrapper is this method's own, matching how
   * `assertNotLastActiveSuperAdmin` above is also UserService's own (there
   * was nothing to reuse for that one either).
   */
  private async assertNotLastActiveWorkspaceAdmin(
    targetUserId: string,
    workspaceId: string,
  ): Promise<void> {
    const members = await this.userRoleRepository.find({
      where: { workspace: { id: workspaceId }, status: StatusType.ACTIVE },
      relations: ['role', 'role.permissions', 'user'],
    });

    const remainingAdmins = members.filter(
      (userRole) =>
        userRole.user?.id !== targetUserId &&
        userRole.user?.status === StatusType.ACTIVE &&
        confersWorkspaceAdmin(userRole.role),
    );

    if (remainingAdmins.length === 0) {
      throw new BadRequestException({
        success: false,
        statusCode: 400,
        message:
          'Cannot anonymize the last active workspace-admin of a workspace.',
        timestamp: new Date().toISOString(),
      });
    }
  }

  private async ensureSuperAdmin(id: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'userRoles')
      .leftJoinAndSelect('userRoles.role', 'role')
      .where('userRoles.status = :userRoleStatus', {
        userRoleStatus: StatusType.ACTIVE,
      })
      .andWhere('user.id = :id', { id })
      .andWhere('user.status = :status', { status: StatusType.ACTIVE })
      .andWhere('role.name = :roleName', { roleName: RoleType.SUPER_ADMIN })
      .getOne();

    if (!user) {
      throw new BadRequestException({
        success: false,
        statusCode: 400,
        message: 'Super admin not found',
        timestamp: new Date().toISOString(),
      });
    }

    return user;
  }

  private async assertSystemAdmin(actorUserId: string): Promise<void> {
    const activeSystemRole = await this.userRoleRepository
      .createQueryBuilder('userRole')
      .leftJoinAndSelect('userRole.user', 'user')
      .leftJoinAndSelect('userRole.role', 'role')
      .where('user.id = :actorUserId', { actorUserId })
      .andWhere('user.status = :userStatus', { userStatus: StatusType.ACTIVE })
      .andWhere('userRole.status = :roleStatus', {
        roleStatus: StatusType.ACTIVE,
      })
      .andWhere('role.name = :roleName', { roleName: RoleType.SUPER_ADMIN })
      .getOne();

    if (!activeSystemRole) {
      throw new ForbiddenException(
        'Only super admins can manage super admins.',
      );
    }
  }
}
