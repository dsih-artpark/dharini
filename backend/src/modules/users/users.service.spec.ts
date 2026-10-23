import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { StatusType } from '../../common/enums/status.enum';
import { Invite } from '../../entities/invite.entity';
import { Media } from '../../entities/media.entity';
import { Otp } from '../../entities/otp.entity';
import { Project } from '../../entities/project.entity';
import { UserRole } from '../../entities/user-role.entity';
import { User } from '../../entities/user.entity';
import { RolesService } from '../roles/roles.service';
import { MulterConfigService } from '../media/media.service';
import { RedisCacheService } from '../../common/cache/redis-cache.service';
import { TenantScopeService } from '../../common/authorization/tenant-scope.service';
import { UserService } from './users.service';

jest.mock('../roles/roles.service', () => ({
  RolesService: class RolesService {},
}));

jest.mock('../media/media.service', () => ({
  MulterConfigService: class MulterConfigService {},
}));

// Chainable query-builder stub: every method but the terminal one returns
// itself, matching how findActiveUserWithRoles/assertNotLastActiveSuperAdmin
// build their queries.
function queryBuilderResolving(oneResult: unknown, manyResult: unknown[] = []) {
  const qb: any = {};
  ['leftJoinAndSelect', 'where', 'andWhere'].forEach((method) => {
    qb[method] = jest.fn(() => qb);
  });
  qb.getOne = jest.fn().mockResolvedValue(oneResult);
  qb.getMany = jest.fn().mockResolvedValue(manyResult);
  return qb;
}

describe('UserService', () => {
  let service: UserService;
  let userRepository: { save: jest.Mock; createQueryBuilder: jest.Mock };
  let userRoleRepository: {
    createQueryBuilder: jest.Mock;
    find: jest.Mock;
    remove: jest.Mock;
  };
  let tenantScopeService: { canManageUser: jest.Mock; isSystem: jest.Mock };
  let manager: { findOne: jest.Mock; update: jest.Mock; delete: jest.Mock };
  let dataSource: { transaction: jest.Mock };
  let mediaService: { deleteObject: jest.Mock };
  let mediaRepository: { findOne: jest.Mock };
  let cacheService: { delByPrefix: jest.Mock };

  beforeEach(async () => {
    userRepository = {
      save: jest.fn(),
      createQueryBuilder: jest.fn(() => queryBuilderResolving(null)),
    };
    userRoleRepository = {
      createQueryBuilder: jest.fn(() => queryBuilderResolving(null, [])),
      find: jest.fn().mockResolvedValue([]),
      remove: jest.fn(),
    };
    tenantScopeService = {
      canManageUser: jest.fn().mockReturnValue(true),
      isSystem: jest.fn().mockReturnValue(false),
    };
    manager = {
      findOne: jest.fn().mockResolvedValue(null),
      update: jest.fn(),
      delete: jest.fn(),
    };
    dataSource = {
      transaction: jest.fn(async (cb: any) => cb(manager)),
    };
    mediaService = { deleteObject: jest.fn() };
    mediaRepository = { findOne: jest.fn() };
    cacheService = { delByPrefix: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
        {
          provide: getRepositoryToken(UserRole),
          useValue: userRoleRepository,
        },
        {
          provide: RolesService,
          useValue: {},
        },
        {
          provide: getRepositoryToken(Otp),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Project),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Media),
          useValue: mediaRepository,
        },
        {
          provide: MulterConfigService,
          useValue: mediaService,
        },
        {
          provide: RedisCacheService,
          useValue: cacheService,
        },
        {
          provide: TenantScopeService,
          useValue: tenantScopeService,
        },
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('removeSuperAdmin', () => {
    const superAdminRole = (userId: string) => ({ user: { id: userId } });

    // The same query builder serves the acting-user check (getOne) and the
    // list of active super admins (getMany).
    const givenSuperAdmins = (actorIsSuperAdmin: boolean, ids: string[]) =>
      userRoleRepository.createQueryBuilder.mockReturnValue(
        queryBuilderResolving(
          actorIsSuperAdmin ? { id: 'actor-role' } : null,
          ids.map(superAdminRole),
        ),
      );

    it('blocks removing the last active super admin', async () => {
      givenSuperAdmins(true, ['sa-1']);

      await expect(
        service.removeSuperAdmin('sa-1', 'sa-1'),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(userRoleRepository.remove).not.toHaveBeenCalled();
    });

    it('removes the super admin role when another active super admin remains', async () => {
      givenSuperAdmins(true, ['sa-1', 'sa-2']);

      await service.removeSuperAdmin('sa-1', 'sa-2');

      expect(userRoleRepository.remove).toHaveBeenCalledWith(
        superAdminRole('sa-1'),
      );
      expect(cacheService.delByPrefix).toHaveBeenCalled();
    });

    it('rejects an acting user who is not an active super admin', async () => {
      givenSuperAdmins(false, ['sa-1', 'sa-2']);

      await expect(
        service.removeSuperAdmin('sa-1', 'someone-else'),
      ).rejects.toBeInstanceOf(ForbiddenException);
      expect(userRoleRepository.remove).not.toHaveBeenCalled();
    });
  });

  describe('anonymize', () => {
    const target = {
      id: 'target-1',
      email: 'target@example.com',
      contactNumber: '9876543210',
      profilePicture: null,
      status: StatusType.ACTIVE,
      roles: [],
    } as unknown as User;

    it('404s (as "not found") when the target is already anonymized or does not exist', async () => {
      userRepository.createQueryBuilder.mockReturnValue(
        queryBuilderResolving(null),
      );

      await expect(
        service.anonymize('missing', { id: 'admin-1', roles: [] }),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(dataSource.transaction).not.toHaveBeenCalled();
    });

    it('rejects when canManageUser denies', async () => {
      userRepository.createQueryBuilder.mockReturnValue(
        queryBuilderResolving(target),
      );
      tenantScopeService.canManageUser.mockReturnValue(false);

      await expect(
        service.anonymize('target-1', { id: 'admin-1', roles: [] }),
      ).rejects.toBeInstanceOf(ForbiddenException);
      expect(dataSource.transaction).not.toHaveBeenCalled();
    });

    it('blocks anonymizing the last active super admin', async () => {
      userRepository.createQueryBuilder.mockReturnValue(
        queryBuilderResolving(target),
      );
      tenantScopeService.canManageUser.mockReturnValue(true);
      tenantScopeService.isSystem.mockReturnValue(true);
      userRoleRepository.createQueryBuilder.mockReturnValue(
        queryBuilderResolving(null, [
          { user: { id: 'target-1' }, role: { name: 'super-admin' } },
        ]),
      );

      await expect(
        service.anonymize('target-1', { id: 'admin-1', roles: [] }),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(dataSource.transaction).not.toHaveBeenCalled();
    });

    it('nulls the PII fields, keeps the name untouched, and marks the account deleted', async () => {
      userRepository.createQueryBuilder.mockReturnValue(
        queryBuilderResolving(target),
      );
      tenantScopeService.canManageUser.mockReturnValue(true);

      await service.anonymize('target-1', { id: 'admin-1', roles: [] });

      expect(manager.update).toHaveBeenCalledWith(
        User,
        { id: 'target-1' },
        {
          email: null,
          contactNumber: null,
          address: null,
          profilePicture: null,
          status: StatusType.DELETED,
        },
      );
      // firstName/lastName are never referenced by the update payload above -
      // the whole point is that they're left alone.
      expect(manager.delete).toHaveBeenCalledWith(Otp, {
        email: 'target@example.com',
      });
      expect(manager.delete).toHaveBeenCalledWith(Otp, {
        contactNumber: '9876543210',
      });
      // An anonymized user's contact info would otherwise survive, fully
      // readable, in their own old invites row - scrubbed (not deleted),
      // same principle as the User row update above.
      expect(manager.update).toHaveBeenCalledWith(
        Invite,
        { email: 'target@example.com' },
        { email: null },
      );
      expect(manager.update).toHaveBeenCalledWith(
        Invite,
        { contactNumber: '9876543210' },
        { contactNumber: null },
      );
      expect(cacheService.delByPrefix).toHaveBeenCalled();
    });

    it('deletes the S3 object and Media row for an existing profile picture', async () => {
      const targetWithPhoto = {
        ...target,
        profilePicture: '11111111-1111-4111-8111-111111111111',
      } as unknown as User;
      userRepository.createQueryBuilder.mockReturnValue(
        queryBuilderResolving(targetWithPhoto),
      );
      tenantScopeService.canManageUser.mockReturnValue(true);
      manager.findOne.mockResolvedValue({
        id: 'media-1',
        key: 'some/s3/key.jpg',
      });

      await service.anonymize('target-1', { id: 'admin-1', roles: [] });

      expect(mediaService.deleteObject).toHaveBeenCalledWith('some/s3/key.jpg');
      expect(manager.delete).toHaveBeenCalledWith(Media, { id: 'media-1' });
    });

    it('does not touch S3/Media when there is no profile picture to anonymize', async () => {
      userRepository.createQueryBuilder.mockReturnValue(
        queryBuilderResolving(target),
      );
      tenantScopeService.canManageUser.mockReturnValue(true);

      await service.anonymize('target-1', { id: 'admin-1', roles: [] });

      expect(mediaService.deleteObject).not.toHaveBeenCalled();
      expect(manager.delete).not.toHaveBeenCalledWith(Media, expect.anything());
    });

    const workspaceAdminRole = {
      role: {
        name: 'workspace-admin',
        scope: 'workspace',
        permissions: [{ action: 'manage', subject: 'workspace-member' }],
      },
      workspace: { id: 'w1' },
    };

    it('rejects anonymizing the sole active workspace-admin of a workspace', async () => {
      const workspaceAdminTarget = {
        ...target,
        roles: [workspaceAdminRole],
      } as unknown as User;
      userRepository.createQueryBuilder.mockReturnValue(
        queryBuilderResolving(workspaceAdminTarget),
      );
      tenantScopeService.canManageUser.mockReturnValue(true);
      userRoleRepository.find.mockResolvedValue([
        {
          user: { id: 'target-1', status: StatusType.ACTIVE },
          role: workspaceAdminRole.role,
        },
      ]);

      await expect(
        service.anonymize('target-1', { id: 'admin-1', roles: [] }),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(dataSource.transaction).not.toHaveBeenCalled();
    });

    it('allows anonymizing a workspace-admin when another active one remains', async () => {
      const workspaceAdminTarget = {
        ...target,
        roles: [workspaceAdminRole],
      } as unknown as User;
      userRepository.createQueryBuilder.mockReturnValue(
        queryBuilderResolving(workspaceAdminTarget),
      );
      tenantScopeService.canManageUser.mockReturnValue(true);
      userRoleRepository.find.mockResolvedValue([
        {
          user: { id: 'target-1', status: StatusType.ACTIVE },
          role: workspaceAdminRole.role,
        },
        {
          user: { id: 'other-admin', status: StatusType.ACTIVE },
          role: workspaceAdminRole.role,
        },
      ]);

      await service.anonymize('target-1', { id: 'admin-1', roles: [] });

      expect(manager.update).toHaveBeenCalled();
    });
  });
});
