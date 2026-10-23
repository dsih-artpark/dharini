import { BadRequestException } from '@nestjs/common';
import { ProjectsService } from './projects.service';

describe('ProjectsService - Duplicate Project Name Validation', () => {
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

  let service: ProjectsService;
  let mockProjectRepository: any;
  let mockRegionRepository: any;
  let mockSurveillanceTypeRepository: any;
  let mockDiseaseRepository: any;
  let mockUserRepository: any;
  let mockTeamRepository: any;
  let mockRoleRepository: any;
  let mockUserRoleRepository: any;
  let mockWorkspaceRepository: any;
  let mockTenantScopeService: any;
  let mockCacheService: any;
  let mockDataSource: any;

  const createMockQueryBuilder = (result: any = null) => {
    const qb: any = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(result),
    };
    return qb;
  };

  beforeEach(() => {
    mockProjectRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn((dto) => ({ id: 'P12345', ...dto })),
      save: jest.fn(async (p) => p),
      preload: jest.fn(async (p) => p),
      createQueryBuilder: jest.fn(() => createMockQueryBuilder(null)),
    };

    mockRegionRepository = {
      findBy: jest.fn().mockResolvedValue([{ id: 'reg-1' }]),
    };
    mockSurveillanceTypeRepository = {
      findBy: jest.fn().mockResolvedValue([{ id: 'st-1' }]),
    };
    mockDiseaseRepository = {
      findBy: jest.fn().mockResolvedValue([{ id: 'dis-1' }]),
    };
    mockUserRepository = {
      findOne: jest.fn().mockResolvedValue({ id: ACTING_USER.id }),
      save: jest.fn(async (u) => u),
      create: jest.fn((u) => u),
    };
    mockTeamRepository = {
      save: jest.fn(async (t) => t),
      create: jest.fn((t) => t),
    };
    mockRoleRepository = {
      findOne: jest.fn().mockResolvedValue({ id: 'role-team-admin' }),
    };
    mockUserRoleRepository = {
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn((ur) => ur),
      save: jest.fn(async (ur) => ur),
    };
    mockWorkspaceRepository = {
      findOne: jest
        .fn()
        .mockResolvedValue({ id: WORKSPACE_1, name: 'Workspace 1' }),
    };

    mockTenantScopeService = {
      administersWorkspace: jest.fn().mockReturnValue(true),
    };

    mockCacheService = {
      delByPrefix: jest.fn().mockResolvedValue(undefined),
      del: jest.fn().mockResolvedValue(undefined),
    };

    const manager: any = {
      getRepository: jest.fn((entity: any) => {
        const name = entity?.name ?? '';
        if (name === 'Project') return mockProjectRepository;
        if (name === 'Region') return mockRegionRepository;
        if (name === 'SurveillanceType') return mockSurveillanceTypeRepository;
        if (name === 'Disease') return mockDiseaseRepository;
        if (name === 'User') return mockUserRepository;
        if (name === 'Otp') return { findOne: jest.fn() };
        if (name === 'Team') return mockTeamRepository;
        if (name === 'Role') return mockRoleRepository;
        if (name === 'UserRole') return mockUserRoleRepository;
        if (name === 'Workspace') return mockWorkspaceRepository;
        return {};
      }),
      save: jest.fn(async (_entity, val) => val),
    };

    mockDataSource = {
      transaction: jest.fn(async (cb) => cb(manager)),
    };

    const noop = {} as never;
    service = new ProjectsService(
      mockDataSource,
      mockProjectRepository,
      mockRegionRepository,
      mockSurveillanceTypeRepository,
      mockDiseaseRepository,
      noop, // userService
      noop, // siteService
      noop, // visitService
      noop, // locationService
      mockTeamRepository,
      mockUserRepository,
      noop, // siteRepository
      mockRoleRepository,
      mockUserRoleRepository,
      noop, // labTestRepository
      noop, // sampleTypeRepository
      noop, // sampleRepository
      noop, // mediaRepository
      noop, // visitRepository
      noop, // mediaService
      mockCacheService,
      mockTenantScopeService,
    );
  });

  describe('create() duplicate project name validation', () => {
    const baseCreateDto = {
      name: 'QA LSD 01',
      code: 'PLSD01',
      workspaceId: WORKSPACE_1,
      invitedBy: ACTING_USER,
      diseases: ['dis-1'],
      surveillanceTypes: ['st-1'],
      regions: ['reg-1'],
      teams: [
        {
          teamName: 'Team Alpha',
          email: 'alpha@example.com',
          firstName: 'Alpha',
          lastName: 'Lead',
          isProjectViewer: true,
        },
      ],
    };

    it('rejects duplicate project name in the same workspace', async () => {
      mockProjectRepository.findOne.mockResolvedValueOnce(null);

      const qb = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue({
          id: 'P99999',
          name: 'QA LSD 01',
          workspaceId: WORKSPACE_1,
        }),
      };
      mockProjectRepository.createQueryBuilder.mockReturnValueOnce(qb);

      await expect(service.create(baseCreateDto as any)).rejects.toThrow(
        BadRequestException,
      );

      expect(qb.where).toHaveBeenCalledWith(
        'project.workspace_id = :workspaceId',
        { workspaceId: WORKSPACE_1 },
      );
      expect(qb.andWhere).toHaveBeenCalledWith('project.name ILIKE :name', {
        name: 'QA LSD 01',
      });
    });

    it('rejects duplicate project name case-insensitively and trimmed', async () => {
      mockProjectRepository.findOne.mockResolvedValueOnce(null);

      const qb = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue({
          id: 'P99999',
          name: 'QA LSD 01',
          workspaceId: WORKSPACE_1,
        }),
      };
      mockProjectRepository.createQueryBuilder.mockReturnValueOnce(qb);

      await expect(
        service.create({
          ...baseCreateDto,
          name: '   qa lsd 01   ',
        } as any),
      ).rejects.toThrow(
        new BadRequestException({
          success: false,
          statusCode: 400,
          message:
            'Project with name "qa lsd 01" already exists in this workspace',
          timestamp: expect.any(String),
        }),
      );

      expect(qb.andWhere).toHaveBeenCalledWith('project.name ILIKE :name', {
        name: 'qa lsd 01',
      });
    });

    it('rejects empty project name', async () => {
      mockProjectRepository.findOne.mockResolvedValueOnce(null);

      await expect(
        service.create({
          ...baseCreateDto,
          name: '    ',
        } as any),
      ).rejects.toThrow(
        new BadRequestException({
          success: false,
          statusCode: 400,
          message: 'Project name is required',
          timestamp: expect.any(String),
        }),
      );
    });

    it('allows creating project if duplicate check in the workspace finds no match', async () => {
      mockProjectRepository.findOne.mockResolvedValueOnce(null); // code check

      const qb = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null), // no duplicate name found
      };
      mockProjectRepository.createQueryBuilder.mockReturnValueOnce(qb);

      const result = await service.create(baseCreateDto as any);

      expect(result).toBeDefined();
      expect(mockProjectRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'QA LSD 01',
        }),
      );
    });

    it('allows same project name in a different workspace', async () => {
      mockProjectRepository.findOne.mockResolvedValueOnce(null);
      mockWorkspaceRepository.findOne.mockResolvedValueOnce({
        id: '00000000-0000-4000-8000-000000000002',
        name: 'Workspace 2',
      });

      const qb = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null), // no project with that name in workspace 2
      };
      mockProjectRepository.createQueryBuilder.mockReturnValueOnce(qb);

      const result = await service.create({
        ...baseCreateDto,
        workspaceId: '00000000-0000-4000-8000-000000000002',
      } as any);

      expect(result).toBeDefined();
      expect(qb.where).toHaveBeenCalledWith(
        'project.workspace_id = :workspaceId',
        { workspaceId: '00000000-0000-4000-8000-000000000002' },
      );
    });
  });

  describe('update() duplicate project name validation', () => {
    const existingProject = {
      id: 'P11111',
      name: 'Original Project Name',
      workspaceId: WORKSPACE_1,
      workspace: { id: WORKSPACE_1 },
    };

    it('rejects renaming to an existing project name in the same workspace', async () => {
      mockProjectRepository.findOne.mockResolvedValueOnce(existingProject);

      const qb = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue({
          id: 'P22222',
          name: 'QA LSD 01',
          workspaceId: WORKSPACE_1,
        }),
      };
      mockProjectRepository.createQueryBuilder.mockReturnValueOnce(qb);

      await expect(
        service.update('P11111', { name: 'QA LSD 01' }),
      ).rejects.toThrow(
        new BadRequestException({
          success: false,
          statusCode: 400,
          message:
            'Project with name "QA LSD 01" already exists in this workspace',
          timestamp: expect.any(String),
        }),
      );

      expect(qb.where).toHaveBeenCalledWith('project.id != :id', {
        id: 'P11111',
      });
      expect(qb.andWhere).toHaveBeenCalledWith('project.name ILIKE :name', {
        name: 'QA LSD 01',
      });
      expect(qb.andWhere).toHaveBeenCalledWith(
        'project.workspace_id = :workspaceId',
        { workspaceId: WORKSPACE_1 },
      );
    });

    it('rejects empty name in update', async () => {
      mockProjectRepository.findOne.mockResolvedValueOnce(existingProject);

      await expect(service.update('P11111', { name: '   ' })).rejects.toThrow(
        new BadRequestException({
          success: false,
          statusCode: 400,
          message: 'Project name cannot be empty',
          timestamp: expect.any(String),
        }),
      );
    });

    it('allows updating when name is not duplicated by another project', async () => {
      mockProjectRepository.findOne
        .mockResolvedValueOnce(existingProject)
        .mockResolvedValueOnce({ ...existingProject, name: 'Unique New Name' });

      const qb = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      mockProjectRepository.createQueryBuilder.mockReturnValueOnce(qb);

      jest.spyOn(service, 'findOne').mockResolvedValueOnce({
        id: 'P11111',
        name: 'Unique New Name',
      } as any);

      const result = await service.update('P11111', {
        name: 'Unique New Name',
      });

      expect(result).toBeDefined();
      expect(mockProjectRepository.save).toHaveBeenCalled();
    });
  });
});
