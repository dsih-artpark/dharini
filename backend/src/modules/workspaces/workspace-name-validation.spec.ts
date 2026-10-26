import { BadRequestException } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';

describe('WorkspacesService - Duplicate Workspace Name Validation', () => {
  const WORKSPACE_1 = '00000000-0000-4000-8000-000000000001';
  const ACTING_USER = {
    id: 'user-admin',
    roles: [
      {
        workspaceId: WORKSPACE_1,
        role: { name: 'workspace-admin', permissions: [] },
      },
    ],
  };

  let service: WorkspacesService;
  let mockWorkspaceRepository: any;
  let mockProjectRepository: any;
  let mockUserRoleRepository: any;
  let mockRoleRepository: any;
  let mockProjectsService: any;
  let mockDataSource: any;
  let mockCacheService: any;
  let mockTenantScopeService: any;

  const createMockQueryBuilder = (result: any = null) => {
    const qb: any = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(result),
    };
    return qb;
  };

  beforeEach(() => {
    mockWorkspaceRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn((dto) => ({ id: WORKSPACE_1, ...dto })),
      save: jest.fn(async (w) => w),
      createQueryBuilder: jest.fn(() => createMockQueryBuilder(null)),
    };

    mockProjectRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
    };

    mockUserRoleRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn((ur) => ur),
      save: jest.fn(async (ur) => ur),
    };

    mockRoleRepository = {
      findOne: jest
        .fn()
        .mockResolvedValue({ id: 'role-wa', name: 'workspace-admin' }),
    };

    mockProjectsService = {};

    mockCacheService = {
      delByPrefix: jest.fn().mockResolvedValue(undefined),
    };

    mockTenantScopeService = {
      administersWorkspace: jest.fn().mockReturnValue(true),
    };

    const manager: any = {
      create: jest.fn((_entity, val) => val),
      save: jest.fn(async (_entity, val) => ({ id: WORKSPACE_1, ...val })),
    };

    mockDataSource = {
      transaction: jest.fn(async (cb) => cb(manager)),
    };

    service = new WorkspacesService(
      mockWorkspaceRepository,
      mockProjectRepository,
      mockUserRoleRepository,
      mockRoleRepository,
      mockProjectsService,
      mockDataSource,
      mockCacheService,
      mockTenantScopeService,
    );
  });

  describe('create() duplicate workspace name validation', () => {
    it('rejects duplicate workspace name', async () => {
      const qb = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue({
          id: '00000000-0000-4000-8000-000000000099',
          name: 'NCDC Surveillance',
        }),
      };
      mockWorkspaceRepository.createQueryBuilder.mockReturnValueOnce(qb);

      await expect(
        service.create({ name: 'NCDC Surveillance' }, ACTING_USER),
      ).rejects.toThrow(
        new BadRequestException({
          success: false,
          statusCode: 400,
          message: 'Workspace with name "NCDC Surveillance" already exists',
          timestamp: expect.any(String),
        }),
      );

      expect(qb.where).toHaveBeenCalledWith('workspace.name ILIKE :name', {
        name: 'NCDC Surveillance',
      });
    });

    it('rejects duplicate workspace name case-insensitively and trimmed', async () => {
      const qb = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue({
          id: '00000000-0000-4000-8000-000000000099',
          name: 'NCDC Surveillance',
        }),
      };
      mockWorkspaceRepository.createQueryBuilder.mockReturnValueOnce(qb);

      await expect(
        service.create({ name: '   ncdc surveillance   ' }, ACTING_USER),
      ).rejects.toThrow(
        new BadRequestException({
          success: false,
          statusCode: 400,
          message: 'Workspace with name "ncdc surveillance" already exists',
          timestamp: expect.any(String),
        }),
      );

      expect(qb.where).toHaveBeenCalledWith('workspace.name ILIKE :name', {
        name: 'ncdc surveillance',
      });
    });

    it('rejects empty workspace name', async () => {
      await expect(
        service.create({ name: '   ' }, ACTING_USER),
      ).rejects.toThrow(
        new BadRequestException({
          success: false,
          statusCode: 400,
          message: 'Workspace name is required',
          timestamp: expect.any(String),
        }),
      );
    });

    it('allows creating workspace if name is unique', async () => {
      const qb = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      mockWorkspaceRepository.createQueryBuilder.mockReturnValueOnce(qb);

      const result = await service.create(
        { name: '  Unique Workspace  ' },
        ACTING_USER,
      );

      expect(result).toBeDefined();
      expect(result.name).toBe('Unique Workspace');
    });
  });

  describe('update() duplicate workspace name validation', () => {
    const existingWorkspace = {
      id: WORKSPACE_1,
      name: 'Existing Workspace',
    };

    it('rejects renaming to an existing workspace name', async () => {
      mockWorkspaceRepository.findOne.mockResolvedValueOnce(existingWorkspace);

      const qb = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue({
          id: '00000000-0000-4000-8000-000000000099',
          name: 'Other Workspace',
        }),
      };
      mockWorkspaceRepository.createQueryBuilder.mockReturnValueOnce(qb);

      await expect(
        service.update(WORKSPACE_1, { name: 'Other Workspace' }, ACTING_USER),
      ).rejects.toThrow(
        new BadRequestException({
          success: false,
          statusCode: 400,
          message: 'Workspace with name "Other Workspace" already exists',
          timestamp: expect.any(String),
        }),
      );

      expect(qb.where).toHaveBeenCalledWith('workspace.id != :id', {
        id: WORKSPACE_1,
      });
      expect(qb.andWhere).toHaveBeenCalledWith('workspace.name ILIKE :name', {
        name: 'Other Workspace',
      });
    });

    it('rejects empty name in update', async () => {
      mockWorkspaceRepository.findOne.mockResolvedValueOnce(existingWorkspace);

      await expect(
        service.update(WORKSPACE_1, { name: '   ' }, ACTING_USER),
      ).rejects.toThrow(
        new BadRequestException({
          success: false,
          statusCode: 400,
          message: 'Workspace name cannot be empty',
          timestamp: expect.any(String),
        }),
      );
    });

    it('allows updating when name is not duplicated by another workspace', async () => {
      mockWorkspaceRepository.findOne.mockResolvedValueOnce(existingWorkspace);

      const qb = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      mockWorkspaceRepository.createQueryBuilder.mockReturnValueOnce(qb);

      const result = await service.update(
        WORKSPACE_1,
        { name: '  Renamed Workspace  ' },
        ACTING_USER,
      );

      expect(result).toBeDefined();
      expect(result.name).toBe('Renamed Workspace');
      expect(mockWorkspaceRepository.save).toHaveBeenCalled();
    });
  });
});
