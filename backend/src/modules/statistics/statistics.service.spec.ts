import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { StatisticsService } from './statistics.service';
import { ProjectsService } from '../projects/projects.service';
import { User } from 'src/entities/user.entity';
import { Sample } from 'src/entities/sample.entity';
import { Disease } from 'src/entities/disease.entity';
import { Project } from 'src/entities/project.entity';
import { Scope } from 'src/common/enums/scope.enum';
import { TenantScopeService } from 'src/common/authorization/tenant-scope.service';

// System scope, resolved the way `resolveTenantScope`/`getUserScopeFromRole`
// actually resolve it: from the authoritative `role.scope` column on each
// `UserRole.role`, not from a denormalized `permissions[].scope` copy. A
// fixture that only set the latter would silently exercise the non-System
// (fail-closed, `1 = 0`) path instead of the System (unrestricted) path,
// and the "scopes X to the selected projectId" assertions below would never
// actually run through the branch they claim to test.
const systemAdminUser = {
  id: 'super-admin-id',
  roles: [{ role: { scope: Scope.System, permissions: [] } }],
} as unknown as User;

describe('StatisticsService', () => {
  let service: StatisticsService;
  let queryBuilderMock: any;
  let sampleRepositoryMock: any;
  let userRepositoryMock: any;
  let diseaseRepositoryMock: any;
  let dataSourceMock: any;

  beforeEach(async () => {
    queryBuilderMock = {
      leftJoin: jest.fn().mockReturnThis(),
      addCommonTableExpression: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      clone: jest.fn(() => queryBuilderMock),
      andWhere: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      setParameters: jest.fn().mockReturnThis(),
      setParameter: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      addGroupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue({}),
      getRawMany: jest.fn().mockResolvedValue([]),
    };

    sampleRepositoryMock = {
      createQueryBuilder: jest.fn(() => queryBuilderMock),
    };

    userRepositoryMock = {
      // Super admin: not tied to a single project, system scope.
      findOne: jest.fn().mockResolvedValue({
        id: 'super-admin-id',
        project: null,
        roles: [],
      }),
    };

    diseaseRepositoryMock = {
      find: jest.fn().mockResolvedValue([]),
    };

    // `this.dataSource.getRepository(Project)` is still used directly by
    // `getHomeLast30Days`, independent of tenant-scope resolution.
    // `createQueryBuilder` builds the per-site query over the per-sample CTE
    // in `getSiteWiseAnalysis`.
    dataSourceMock = {
      getRepository: jest.fn().mockReturnValue({
        find: jest.fn().mockResolvedValue([]),
      }),
      createQueryBuilder: jest.fn(() => queryBuilderMock),
    };

    // `TenantScopeService.forUser` delegates to `resolveTenantScope`, which
    // takes a `Repository<Project>` (to expand a workspace role to its
    // projects). That argument is evaluated eagerly regardless of which
    // branch resolveTenantScope takes internally, so even the System-scope
    // tests - which never touch the repository - need this mocked or the
    // call throws before resolveTenantScope's body ever runs. `find` is the
    // only method it calls, so an empty-result stub is enough.
    const projectRepositoryMock = {
      find: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsService,
        TenantScopeService,
        { provide: DataSource, useValue: dataSourceMock },
        { provide: ProjectsService, useValue: {} },
        { provide: getRepositoryToken(User), useValue: userRepositoryMock },
        { provide: getRepositoryToken(Sample), useValue: sampleRepositoryMock },
        {
          provide: getRepositoryToken(Disease),
          useValue: diseaseRepositoryMock,
        },
        {
          provide: getRepositoryToken(Project),
          useValue: projectRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<StatisticsService>(StatisticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('project filter scoping (super admin)', () => {
    it('scopes monitor dashboard stats to the selected projectId', async () => {
      await service.getMonitorDashboardStats(
        { projectId: 'project-123' },
        systemAdminUser,
      );

      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'project.id IN (:...projectIds)',
        { projectIds: ['project-123'] },
      );
    });

    it('scopes site-wise analysis to the selected projectId', async () => {
      await service.getSiteWiseAnalysis(
        { projectId: 'project-123' },
        systemAdminUser,
      );

      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'project.id IN (:...projectIds)',
        { projectIds: ['project-123'] },
      );
    });

    it('scopes disease-wise analysis to the selected projectId', async () => {
      await service.getDiseaseWiseAnalysis(
        { projectId: 'project-123' },
        systemAdminUser,
      );

      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'project.id IN (:...projectIds)',
        { projectIds: ['project-123'] },
      );
    });

    it('scopes sample-wise analysis to the selected projectId', async () => {
      await service.getSampleWiseAnalysis(
        { projectId: 'project-123' },
        systemAdminUser,
      );

      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'project.id IN (:...projectIds)',
        { projectIds: ['project-123'] },
      );
    });

    it('does NOT scope to the selected projectId for a non-System caller who cannot reach it (regression guard)', async () => {
      const projectScopedUser = {
        id: 'project-user-id',
        roles: [{ role: { scope: Scope.Project, permissions: [] } }],
      } as unknown as User;

      await service.getMonitorDashboardStats(
        { projectId: 'project-123' },
        projectScopedUser,
      );

      expect(queryBuilderMock.andWhere).not.toHaveBeenCalledWith(
        'project.id IN (:...projectIds)',
        { projectIds: ['project-123'] },
      );
    });
  });

  describe('getSiteWiseAnalysis - one status bucket per sample', () => {
    it('buckets each sample exactly once, in priority order positive > unclear > negative > pending', async () => {
      await service.getSiteWiseAnalysis({}, { id: 'super-admin-id' } as User);

      const addSelectCalls = queryBuilderMock.addSelect.mock.calls;
      const positiveCall = addSelectCalls.find(
        ([, alias]) => alias === 'positiveSamples',
      );
      const unclearCall = addSelectCalls.find(
        ([, alias]) => alias === 'unclearSamples',
      );
      const negativeCall = addSelectCalls.find(
        ([, alias]) => alias === 'negativeSamples',
      );
      const pendingCall = addSelectCalls.find(
        ([, alias]) => alias === 'pendingSamples',
      );

      expect(positiveCall).toBeDefined();
      expect(unclearCall).toBeDefined();
      expect(negativeCall).toBeDefined();
      expect(pendingCall).toBeDefined();

      // All four buckets must be driven by the SAME per-sample status
      // expression, so a sample with multiple diseases/lab tests can only
      // ever land in one bucket instead of being counted in several.
      const statusExpr = positiveCall[0].split("= 'positive'")[0];
      expect(statusExpr.length).toBeGreaterThan(0);
      expect(unclearCall[0].startsWith(statusExpr)).toBe(true);
      expect(negativeCall[0].startsWith(statusExpr)).toBe(true);
      expect(pendingCall[0].startsWith(statusExpr)).toBe(true);

      expect(unclearCall[0]).toContain("= 'unclear'");
      expect(negativeCall[0]).toContain("= 'negative'");
      expect(pendingCall[0]).toContain("= 'pending'");
    });

    it('maps unclearSamples from the raw query result alongside the other counts', async () => {
      queryBuilderMock.getRawMany.mockResolvedValueOnce([
        {
          siteId: 'site-1',
          siteName: 'Site 1',
          totalSamples: '4',
          positiveSamples: '1',
          unclearSamples: '1',
          negativeSamples: '1',
          pendingSamples: '1',
          totalSites: '1',
        },
      ]);

      const result = await service.getSiteWiseAnalysis({}, {
        id: 'super-admin-id',
      } as User);

      expect(result.data[0]).toMatchObject({
        totalSamples: 4,
        positiveSamples: 1,
        unclearSamples: 1,
        negativeSamples: 1,
        pendingSamples: 1,
      });
    });

    it('computes the status once per sample, from all of its lab tests, in priority order', async () => {
      await service.getSiteWiseAnalysis(
        { projectId: 'project-123' },
        systemAdminUser,
      );

      const statusCall = queryBuilderMock.addSelect.mock.calls.find(
        ([, alias]) => alias === 'status',
      );
      expect(statusCall).toBeDefined();
      const statusExpr: string = statusCall[0];
      const order = ['positive', 'unclear', 'negative'].map((result) =>
        statusExpr.indexOf(
          `BOOL_OR(lt_status."testResult" = '${result}') THEN '${result}'`,
        ),
      );
      expect(order.every((i) => i >= 0)).toBe(true);
      expect([...order].sort((a, b) => a - b)).toEqual(order);
      expect(statusExpr).toMatch(/ELSE 'pending'\s+END$/);

      // Status comes from ALL of the sample's lab tests, grouped per sample.
      expect(queryBuilderMock.leftJoin).toHaveBeenCalledWith(
        'sample.labTests',
        'lt_status',
      );
      expect(queryBuilderMock.groupBy).toHaveBeenCalledWith('sample.id');

      // The buckets only read the per-sample status; no lab-test lookups.
      for (const alias of [
        'positiveSamples',
        'unclearSamples',
        'negativeSamples',
        'pendingSamples',
      ]) {
        const [expr] = queryBuilderMock.addSelect.mock.calls.find(
          ([, a]) => a === alias,
        );
        expect(expr).toContain('per_sample.status');
        expect(expr).not.toMatch(/lab_tests|SELECT|DISTINCT/);
      }
    });

    it('does not fan samples out by joining diseases or lab tests for filtering', async () => {
      await service.getSiteWiseAnalysis(
        {
          projectId: 'project-123',
          diseaseId: 'disease-1',
          testResult: 'positive',
        },
        systemAdminUser,
      );

      expect(queryBuilderMock.leftJoin).not.toHaveBeenCalledWith(
        'sample.diseases',
        'disease',
      );
      expect(queryBuilderMock.leftJoin).not.toHaveBeenCalledWith(
        'sample.labTests',
        'labtest',
      );
    });

    it('applies the disease filter as an EXISTS on the sample', async () => {
      await service.getSiteWiseAnalysis(
        { diseaseId: ['disease-1', 'disease-2'] },
        systemAdminUser,
      );

      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        `EXISTS (SELECT 1 FROM samples_diseases_diseases sd_filter WHERE sd_filter."samplesId" = sample.id AND sd_filter."diseasesId" IN (:...diseaseIds))`,
        { diseaseIds: ['disease-1', 'disease-2'] },
      );
      expect(queryBuilderMock.andWhere).not.toHaveBeenCalledWith(
        'disease.id IN (:...diseaseIds)',
        expect.anything(),
      );
    });

    it('requires testResult and variant to match the same lab test (one EXISTS)', async () => {
      await service.getSiteWiseAnalysis(
        { testResult: 'positive', variant: ['H5', 'H9'] },
        systemAdminUser,
      );

      const labTestFilters = queryBuilderMock.andWhere.mock.calls.filter(
        ([sql]) => typeof sql === 'string' && sql.includes('lab_tests'),
      );
      expect(labTestFilters).toEqual([
        [
          `EXISTS (SELECT 1 FROM lab_tests lt_filter WHERE lt_filter."sampleId" = sample.id AND lt_filter."testResult" IN (:...testResults) AND (lt_filter.variant ILIKE :variant0 OR lt_filter.variant ILIKE :variant1))`,
          { testResults: ['positive'], variant0: '%H5%', variant1: '%H9%' },
        ],
      ]);
      const joinedLabTestFilters = queryBuilderMock.andWhere.mock.calls.filter(
        ([sql]) => typeof sql === 'string' && sql.includes('labtest.'),
      );
      expect(joinedLabTestFilters).toEqual([]);
    });

    it('keeps the rows in site-id order', async () => {
      await service.getSiteWiseAnalysis({}, systemAdminUser);

      expect(queryBuilderMock.orderBy).toHaveBeenCalledWith(
        'per_sample."siteId"',
        'ASC',
      );
    });

    it('reads the total off the page itself, without a second count query', async () => {
      queryBuilderMock.getRawMany.mockResolvedValueOnce([
        { siteId: 'site-1', totalSamples: '2', totalSites: '42' },
      ]);

      const result = await service.getSiteWiseAnalysis(
        { page: 1, limit: 10 },
        systemAdminUser,
      );

      expect(result).toMatchObject({ total: 42, totalPages: 5 });
      expect(result.data[0]).not.toHaveProperty('totalSites');
      expect(queryBuilderMock.getRawOne).not.toHaveBeenCalled();
    });

    it('counts the sites separately when the page is past the last one', async () => {
      queryBuilderMock.getRawMany.mockResolvedValueOnce([]);
      queryBuilderMock.getRawOne.mockResolvedValueOnce({ total: '32' });

      const result = await service.getSiteWiseAnalysis(
        { page: 99, limit: 10 },
        systemAdminUser,
      );

      expect(queryBuilderMock.select).toHaveBeenCalledWith(
        'COUNT(DISTINCT site.id)',
        'total',
      );
      expect(result).toMatchObject({ data: [], total: 32, totalPages: 4 });
    });
  });

  describe('other dashboards keep filtering through the disease / lab-test joins', () => {
    it('still filters monitor dashboard stats on the joined disease and labtest rows', async () => {
      await service.getMonitorDashboardStats(
        { diseaseId: 'disease-1', testResult: 'positive', variant: 'H5' },
        systemAdminUser,
      );

      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'disease.id IN (:...diseaseIds)',
        { diseaseIds: ['disease-1'] },
      );
      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'labtest."testResult" IN (:...testResults)',
        { testResults: ['positive'] },
      );
      expect(
        queryBuilderMock.andWhere.mock.calls.some(
          ([sql]) => typeof sql === 'string' && sql.includes('EXISTS'),
        ),
      ).toBe(false);
    });
  });
});
