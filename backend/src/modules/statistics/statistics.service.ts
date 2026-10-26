import { ForbiddenException, Injectable } from '@nestjs/common';
import { ProjectDiseaseStatsResponseType } from 'src/common/dto/response/statastics.response';
import { User } from 'src/entities/user.entity';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { ProjectsService } from '../projects/projects.service';
import { getUserScope } from 'src/common/functions/get-user-role';
import { InjectRepository } from '@nestjs/typeorm';
import { Scope } from 'src/common/enums/scope.enum';
import {
  applyProjectScope,
  canReachProject,
  TenantScope,
} from 'src/common/functions/tenant-scope';
import { TenantScopeService } from 'src/common/authorization/tenant-scope.service';
import { Sample } from 'src/entities/sample.entity';
import { Disease } from 'src/entities/disease.entity';
import { Visit } from 'src/entities/visit.entity';
import { Project } from 'src/entities/project.entity';
import { Brackets } from 'typeorm';
import { StatusType } from 'src/common/enums/status.enum';
import { SampleStatus } from 'src/common/enums/sample-status.enum';
import { TestResultType } from 'src/common/enums/test-result.enum';
import { assignRoundsBySite } from 'src/common/utils/visit-rounds.util';
import {
  buildSampleTypeMatrix,
  buildPerProjectTrend,
  buildPerProjectDiseaseTrend,
  buildPerDiseaseTrend,
  buildDiseaseDistribution,
  buildSampleTypeDistribution,
  computeRate,
} from './project-comparison.helpers';
import {
  buildSiteSampleTypeMatrix,
  buildSiteTrend,
} from './site-comparison.helpers';
import {
  buildTypeTrend,
  buildTypeProjectMatrix,
  buildTypeDiseaseComparison,
} from './sample-type-comparison.helpers';
@Injectable()
export class StatisticsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly projectService: ProjectsService,
    @InjectRepository(Sample)
    private readonly sampleRepository: Repository<Sample>,
    @InjectRepository(Disease)
    private readonly diseaseRepository: Repository<Disease>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly tenantScopeService: TenantScopeService,
  ) {}

  private parseAnalyticsDate(value: any, fallback: Date): Date {
    if (!value) return fallback;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? fallback : date;
  }

  private startOfDay(date: Date): Date {
    const next = new Date(date);
    next.setHours(0, 0, 0, 0);
    return next;
  }

  private endOfDay(date: Date): Date {
    const next = new Date(date);
    next.setHours(23, 59, 59, 999);
    return next;
  }

  private addDays(date: Date, days: number): Date {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
  }

  private addMonths(date: Date, months: number): Date {
    const next = new Date(date);
    next.setMonth(next.getMonth() + months);
    return next;
  }

  private monthStart(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  private formatIsoDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private getAnalyticsTrendStepDays(selectedDays: number): number {
    if (selectedDays <= 30) return 1;
    if (selectedDays <= 180) return 7;
    return 30;
  }

  private getAnalyticsTrendWindows(startDate: Date, endDate: Date) {
    const selectedDays = Math.max(
      1,
      Math.ceil((endDate.getTime() - startDate.getTime()) / 86400000) + 1,
    );
    const stepDays = this.getAnalyticsTrendStepDays(selectedDays);
    const windows: { bucketStart: Date; bucketEnd: Date }[] = [];

    for (
      let cursor = this.startOfDay(startDate);
      cursor <= endDate;
      cursor = this.startOfDay(this.addDays(cursor, stepDays))
    ) {
      const bucketEnd = this.endOfDay(
        new Date(
          Math.min(
            this.addDays(cursor, stepDays - 1).getTime(),
            endDate.getTime(),
          ),
        ),
      );
      windows.push({ bucketStart: cursor, bucketEnd });
    }

    return windows;
  }

  private getUserActivityUnionSql(
    startParam?: string,
    endParam?: string,
  ): string {
    const dateFilter = (alias: string, column: string) =>
      startParam && endParam
        ? `AND ${alias}."${column}" BETWEEN ${startParam} AND ${endParam}`
        : '';

    return `
      SELECT sample."collectedById" AS "userId", sample."projectId" AS "projectId", sample."collectedAt" AS "activityAt"
      FROM samples sample
      WHERE sample.status = '${StatusType.ACTIVE}' AND sample."collectedById" IS NOT NULL AND sample."collectedAt" IS NOT NULL ${dateFilter('sample', 'collectedAt')}
      UNION ALL
      SELECT sample."receivedById" AS "userId", sample."projectId" AS "projectId", sample."receivedAt" AS "activityAt"
      FROM samples sample
      WHERE sample.status = '${StatusType.ACTIVE}' AND sample."receivedById" IS NOT NULL AND sample."receivedAt" IS NOT NULL ${dateFilter('sample', 'receivedAt')}
      UNION ALL
      SELECT sample."extractedById" AS "userId", sample."projectId" AS "projectId", sample."extractionDateTime" AS "activityAt"
      FROM samples sample
      WHERE sample.status = '${StatusType.ACTIVE}' AND sample."extractedById" IS NOT NULL AND sample."extractionDateTime" IS NOT NULL ${dateFilter('sample', 'extractionDateTime')}
      UNION ALL
      SELECT sample."testedById" AS "userId", sample."projectId" AS "projectId", sample."testedAt" AS "activityAt"
      FROM samples sample
      WHERE sample.status = '${StatusType.ACTIVE}' AND sample."testedById" IS NOT NULL AND sample."testedAt" IS NOT NULL ${dateFilter('sample', 'testedAt')}
      UNION ALL
      SELECT sample."reportGeneratedById" AS "userId", sample."projectId" AS "projectId", sample."reportGeneratedAt" AS "activityAt"
      FROM samples sample
      WHERE sample.status = '${StatusType.ACTIVE}' AND sample."reportGeneratedById" IS NOT NULL AND sample."reportGeneratedAt" IS NOT NULL ${dateFilter('sample', 'reportGeneratedAt')}
      UNION ALL
      SELECT visit."collectorId" AS "userId", visit."projectId" AS "projectId", visit."visitedAt" AS "activityAt"
      FROM visits visit
      WHERE visit.status = '${StatusType.ACTIVE}' AND visit."collectorId" IS NOT NULL AND visit."visitedAt" IS NOT NULL AND visit."isCompleted" = true ${dateFilter('visit', 'visitedAt')}
    `;
  }

  private async getActiveUserCount(
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const activitySql = this.getUserActivityUnionSql('$2', '$3');
    const rows = await this.dataSource.query(
      `
        SELECT COUNT(DISTINCT activity."userId") AS count
        FROM (${activitySql}) activity
        INNER JOIN users "user" ON "user".id = activity."userId"
        WHERE "user".status = $1
          AND activity."activityAt" BETWEEN $2 AND $3
      `,
      [StatusType.ACTIVE, startDate, endDate],
    );
    return Number(rows?.[0]?.count || 0);
  }

  private async getSummaryMetrics(startDate: Date, endDate: Date) {
    const pipelineStatuses = [
      SampleStatus.PENDING,
      SampleStatus.PICKED_UP,
      SampleStatus.RECEIVED,
      SampleStatus.PRE_PROCESSED,
      SampleStatus.VIRUS_ISOLATION,
      SampleStatus.EXTRACTED,
      SampleStatus.TESTED,
    ];

    const [usersRaw, samplesRaw, resultsRaw] = await Promise.all([
      this.userRepository
        .createQueryBuilder('user')
        .select('COUNT(DISTINCT user.id)', 'count')
        .where('user.status = :status', { status: StatusType.ACTIVE })
        .getRawOne(),
      this.sampleRepository
        .createQueryBuilder('sample')
        .select(
          `COUNT(DISTINCT CASE WHEN sample."collectedAt" BETWEEN :startDate AND :endDate THEN sample.id END)`,
          'samplesCollected',
        )
        .addSelect(
          `COUNT(DISTINCT CASE WHEN sample."sampleStatus" IN (:...pipelineStatuses) THEN sample.id END)`,
          'samplesInPipeline',
        )
        .where('sample.status = :status', { status: StatusType.ACTIVE })
        .setParameters({ startDate, endDate, pipelineStatuses })
        .getRawOne(),
      this.sampleRepository
        .createQueryBuilder('sample')
        .select('COUNT(DISTINCT sample.id)', 'count')
        .where('sample.status = :status', { status: StatusType.ACTIVE })
        .andWhere(
          'sample."reportGeneratedAt" BETWEEN :startDate AND :endDate',
          {
            startDate,
            endDate,
          },
        )
        .getRawOne(),
    ]);

    return {
      totalUsers: Number(usersRaw?.count || 0),
      samplesCollected: Number(samplesRaw?.samplesCollected || 0),
      samplesInPipeline: Number(samplesRaw?.samplesInPipeline || 0),
      resultsGenerated: Number(resultsRaw?.count || 0),
    };
  }

  private getDelta(current: number, previous: number): number {
    if (!previous) return current > 0 ? 100 : 0;
    return Number((((current - previous) / previous) * 100).toFixed(1));
  }

  async getSuperAdminAnalytics(query: any, user: User): Promise<any> {
    if (getUserScope(user) !== Scope.System) {
      throw new ForbiddenException('Only super admins can view analytics.');
    }

    const today = this.endOfDay(new Date());
    const defaultStart = this.startOfDay(this.addDays(today, -29));
    const startDate = this.startOfDay(
      this.parseAnalyticsDate(query.startDate, defaultStart),
    );
    const endDate = this.endOfDay(
      this.parseAnalyticsDate(query.endDate, today),
    );
    const selectedDays = Math.max(
      1,
      Math.ceil((endDate.getTime() - startDate.getTime()) / 86400000) + 1,
    );
    const previousEndDate = this.endOfDay(this.addDays(startDate, -1));
    const previousStartDate = this.startOfDay(
      this.addDays(previousEndDate, -(selectedDays - 1)),
    );

    const currentWeekStart = this.startOfDay(this.addDays(endDate, -6));
    const currentMonthStart = this.startOfDay(this.addDays(endDate, -29));
    const previousWeekEnd = this.endOfDay(this.addDays(currentWeekStart, -1));
    const previousWeekStart = this.startOfDay(
      this.addDays(previousWeekEnd, -6),
    );
    const previousMonthEnd = this.endOfDay(this.addDays(currentMonthStart, -1));
    const previousMonthStart = this.startOfDay(
      this.addDays(previousMonthEnd, -29),
    );

    const [
      currentSummary,
      previousSummary,
      wau,
      previousWau,
      mau,
      previousMau,
    ] = await Promise.all([
      this.getSummaryMetrics(startDate, endDate),
      this.getSummaryMetrics(previousStartDate, previousEndDate),
      this.getActiveUserCount(currentWeekStart, endDate),
      this.getActiveUserCount(previousWeekStart, previousWeekEnd),
      this.getActiveUserCount(currentMonthStart, endDate),
      this.getActiveUserCount(previousMonthStart, previousMonthEnd),
    ]);

    const activitySql = this.getUserActivityUnionSql('$4', '$3');
    const trendWindows = this.getAnalyticsTrendWindows(startDate, endDate);
    const trendValuesSql = trendWindows
      .map(
        (_, index) =>
          `($${index * 2 + 1}::timestamp, $${index * 2 + 2}::timestamp)`,
      )
      .join(', ');
    const trendWindowParams = trendWindows.flatMap(
      ({ bucketStart, bucketEnd }) => [bucketStart, bucketEnd],
    );
    const wauTrendActivityStart = this.startOfDay(
      this.addDays(trendWindows[0].bucketEnd, -6),
    );
    const mauTrendActivityStart = this.startOfDay(
      this.addDays(trendWindows[0].bucketEnd, -29),
    );

    const [wauTrend, mauTrend, samplesResultsTrend, projectRows] =
      await Promise.all([
        this.dataSource.query(
          `
            WITH windows("bucketStart", "bucketEnd") AS (
              VALUES ${trendValuesSql}
            ),
            activity AS (${this.getUserActivityUnionSql(
              `$${trendWindowParams.length + 1}`,
              `$${trendWindowParams.length + 2}`,
            )})
            SELECT windows."bucketStart"::date AS "weekStart",
              windows."bucketEnd"::date AS "weekEnd",
              COUNT(DISTINCT "user".id) AS "activeUsers"
            FROM windows
            LEFT JOIN activity
              ON activity."activityAt" BETWEEN windows."bucketEnd" - interval '6 days' AND windows."bucketEnd"
            LEFT JOIN users "user"
              ON "user".id = activity."userId"
             AND "user".status = $${trendWindowParams.length + 3}
            GROUP BY windows."bucketStart", windows."bucketEnd"
            ORDER BY windows."bucketStart"
          `,
          [
            ...trendWindowParams,
            wauTrendActivityStart,
            endDate,
            StatusType.ACTIVE,
          ],
        ),
        this.dataSource.query(
          `
            WITH windows("bucketStart", "bucketEnd") AS (
              VALUES ${trendValuesSql}
            ),
            activity AS (${this.getUserActivityUnionSql(
              `$${trendWindowParams.length + 1}`,
              `$${trendWindowParams.length + 2}`,
            )})
            SELECT windows."bucketStart"::date AS month,
              COUNT(DISTINCT "user".id) AS "activeUsers"
            FROM windows
            LEFT JOIN activity
              ON activity."activityAt" BETWEEN windows."bucketEnd" - interval '29 days' AND windows."bucketEnd"
            LEFT JOIN users "user"
              ON "user".id = activity."userId"
             AND "user".status = $${trendWindowParams.length + 3}
            GROUP BY windows."bucketStart", windows."bucketEnd"
            ORDER BY windows."bucketStart"
          `,
          [
            ...trendWindowParams,
            mauTrendActivityStart,
            endDate,
            StatusType.ACTIVE,
          ],
        ),
        this.dataSource.query(
          `
            WITH days AS (
              SELECT day::date AS date
              FROM generate_series($1::timestamp, $2::timestamp, interval '1 day') day
            ),
            collected_counts AS (
              SELECT sample."collectedAt"::date AS date,
                COUNT(DISTINCT sample.id) AS count
              FROM samples sample
              WHERE sample.status::text = $3
                AND sample."collectedAt" BETWEEN $1 AND $2
              GROUP BY sample."collectedAt"::date
            ),
            report_counts AS (
              SELECT sample."reportGeneratedAt"::date AS date,
                COUNT(DISTINCT sample.id) AS count
              FROM samples sample
              WHERE sample.status::text = $3
                AND sample."reportGeneratedAt" BETWEEN $1 AND $2
              GROUP BY sample."reportGeneratedAt"::date
            )
            SELECT days.date,
              COALESCE(collected_counts.count, 0) AS "samplesCollected",
              COALESCE(report_counts.count, 0) AS "resultsGenerated"
            FROM days
            LEFT JOIN collected_counts ON collected_counts.date = days.date
            LEFT JOIN report_counts ON report_counts.date = days.date
            ORDER BY days.date ASC
          `,
          [startDate, endDate, StatusType.ACTIVE],
        ),
        this.dataSource.query(
          `
            WITH activity AS (${activitySql}),
            activity_counts AS (
              SELECT activity."projectId",
                COUNT(DISTINCT activity."userId") FILTER (WHERE activity."activityAt" BETWEEN $2 AND $3) AS wau,
                COUNT(DISTINCT activity."userId") FILTER (WHERE activity."activityAt" BETWEEN $4 AND $3) AS mau
              FROM activity
              WHERE activity."activityAt" BETWEEN $4 AND $3
              GROUP BY activity."projectId"
            ),
            sample_counts AS (
              SELECT sample."projectId",
                COUNT(DISTINCT sample.id) FILTER (WHERE sample."collectedAt" BETWEEN $1 AND $3) AS "samplesCollected",
                COUNT(DISTINCT sample.id) FILTER (WHERE sample."sampleStatus" IN (${[
                  SampleStatus.PENDING,
                  SampleStatus.PICKED_UP,
                  SampleStatus.RECEIVED,
                  SampleStatus.PRE_PROCESSED,
                  SampleStatus.VIRUS_ISOLATION,
                  SampleStatus.EXTRACTED,
                  SampleStatus.TESTED,
                ]
                  .map((_, i) => `$${i + 5}`)
                  .join(', ')})) AS "samplesInPipeline",
                COUNT(DISTINCT sample.id) FILTER (WHERE sample."reportGeneratedAt" BETWEEN $1 AND $3) AS "resultsGenerated"
              FROM samples sample
              WHERE sample.status::text = $15
              GROUP BY sample."projectId"
            ),
            lab_counts AS (
              SELECT lab_test."projectId",
                COUNT(DISTINCT lab_test."sampleId") FILTER (WHERE lab_test."testResult" = $12) AS "positiveSamples",
                COUNT(DISTINCT lab_test."sampleId") FILTER (WHERE lab_test."testResult" IN ($12, $13, $14)) AS "processedSamples"
              FROM lab_tests lab_test
              WHERE lab_test.status::text = $15
                AND lab_test."testedAt" BETWEEN $1 AND $3
              GROUP BY lab_test."projectId"
            )
            SELECT project.id AS "projectId",
              project.name AS "projectName",
              COALESCE(activity_counts.wau, 0) AS wau,
              COALESCE(activity_counts.mau, 0) AS mau,
              COALESCE(sample_counts."samplesCollected", 0) AS "samplesCollected",
              COALESCE(sample_counts."samplesInPipeline", 0) AS "samplesInPipeline",
              COALESCE(sample_counts."resultsGenerated", 0) AS "resultsGenerated",
              COALESCE(lab_counts."positiveSamples", 0) AS "positiveSamples",
              COALESCE(lab_counts."processedSamples", 0) AS "processedSamples"
            FROM projects project
            LEFT JOIN activity_counts ON activity_counts."projectId" = project.id
            LEFT JOIN sample_counts ON sample_counts."projectId" = project.id
            LEFT JOIN lab_counts ON lab_counts."projectId" = project.id
            WHERE project.status::text = $15
            ORDER BY COALESCE(activity_counts.wau, 0) * 2 + COALESCE(activity_counts.mau, 0) DESC
            LIMIT 5
          `,
          [
            startDate,
            currentWeekStart,
            endDate,
            currentMonthStart,
            SampleStatus.PENDING,
            SampleStatus.PICKED_UP,
            SampleStatus.RECEIVED,
            SampleStatus.PRE_PROCESSED,
            SampleStatus.VIRUS_ISOLATION,
            SampleStatus.EXTRACTED,
            SampleStatus.TESTED,
            TestResultType.POSITIVE,
            TestResultType.NEGATIVE,
            TestResultType.UNCLEAR,
            StatusType.ACTIVE,
          ],
        ),
      ]);

    const mostActiveProjectRows = projectRows.map((row) => {
      const samplesCollected = Number(row.samplesCollected || 0);
      const samplesInPipeline = Number(row.samplesInPipeline || 0);
      const resultsGenerated = Number(row.resultsGenerated || 0);
      const projectWau = Number(row.wau || 0);
      const projectMau = Number(row.mau || 0);
      const processedSamples = Number(row.processedSamples || 0);
      const positiveSamples = Number(row.positiveSamples || 0);

      return {
        projectId: row.projectId,
        projectName: row.projectName,
        wau: projectWau,
        mau: projectMau,
        samplesCollected,
        samplesInPipeline,
        resultsGenerated,
        positivityRate: processedSamples
          ? Number(((positiveSamples / processedSamples) * 100).toFixed(1))
          : 0,
        activityScore: projectWau * 2 + projectMau,
      };
    });

    const topProjectIds = mostActiveProjectRows.map(
      (project) => project.projectId,
    );

    const trendRows = topProjectIds.length
      ? await this.dataSource.query(
          `
            WITH days AS (
              SELECT day::date AS date
              FROM generate_series($1::timestamp, $2::timestamp, interval '1 day') day
            ),
            project_days AS (
              SELECT project.id AS "projectId", days.date
              FROM projects project
              CROSS JOIN days
              WHERE project.status::text = $3
                AND project.id = ANY($4::text[])
            ),
            collected_counts AS (
              SELECT sample."projectId",
                sample."collectedAt"::date AS date,
                COUNT(DISTINCT sample.id) AS count
              FROM samples sample
              WHERE sample.status::text = $3
                AND sample."projectId" = ANY($4::text[])
                AND sample."collectedAt" BETWEEN $1 AND $2
              GROUP BY sample."projectId", sample."collectedAt"::date
            ),
            report_counts AS (
              SELECT sample."projectId",
                sample."reportGeneratedAt"::date AS date,
                COUNT(DISTINCT sample.id) AS count
              FROM samples sample
              WHERE sample.status::text = $3
                AND sample."projectId" = ANY($4::text[])
                AND sample."reportGeneratedAt" BETWEEN $1 AND $2
              GROUP BY sample."projectId", sample."reportGeneratedAt"::date
            )
            SELECT project_days."projectId",
              project_days.date,
              COALESCE(collected_counts.count, 0) + COALESCE(report_counts.count, 0) AS activity
            FROM project_days
            LEFT JOIN collected_counts
              ON collected_counts."projectId" = project_days."projectId"
             AND collected_counts.date = project_days.date
            LEFT JOIN report_counts
              ON report_counts."projectId" = project_days."projectId"
             AND report_counts.date = project_days.date
            ORDER BY project_days."projectId", project_days.date
          `,
          [
            this.startOfDay(this.addDays(endDate, -13)),
            endDate,
            StatusType.ACTIVE,
            topProjectIds,
          ],
        )
      : [];

    const trendByProject = new Map<string, number[]>();
    trendRows.forEach((row) => {
      const values = trendByProject.get(row.projectId) ?? [];
      values.push(Number(row.activity || 0));
      trendByProject.set(row.projectId, values);
    });

    const mostActiveProjects = mostActiveProjectRows.map((project) => ({
      ...project,
      last14DayTrend: trendByProject.get(project.projectId) ?? [],
    }));

    const formattedWauTrend = wauTrend.map((row) => ({
      weekStart: this.formatIsoDate(new Date(row.weekStart)),
      weekEnd: this.formatIsoDate(new Date(row.weekEnd)),
      activeUsers: Number(row.activeUsers || 0),
    }));
    const formattedMauTrend = mauTrend.map((row) => ({
      month: this.formatIsoDate(new Date(row.month)),
      activeUsers: Number(row.activeUsers || 0),
    }));

    return {
      dateRange: {
        startDate: this.formatIsoDate(startDate),
        endDate: this.formatIsoDate(endDate),
        previousStartDate: this.formatIsoDate(previousStartDate),
        previousEndDate: this.formatIsoDate(previousEndDate),
      },
      summary: {
        ...currentSummary,
        wau,
        mau,
      },
      comparisons: {
        totalUsersDelta: 0,
        wauDelta: this.getDelta(wau, previousWau),
        mauDelta: this.getDelta(mau, previousMau),
        samplesCollectedDelta: this.getDelta(
          currentSummary.samplesCollected,
          previousSummary.samplesCollected,
        ),
        samplesInPipelineDelta: this.getDelta(
          currentSummary.samplesInPipeline,
          previousSummary.samplesInPipeline,
        ),
        resultsGeneratedDelta: this.getDelta(
          currentSummary.resultsGenerated,
          previousSummary.resultsGenerated,
        ),
      },
      wauTrend: formattedWauTrend,
      mauTrend: formattedMauTrend,
      samplesResultsTrend: samplesResultsTrend.map((row) => ({
        date: this.formatIsoDate(new Date(row.date)),
        samplesCollected: Number(row.samplesCollected || 0),
        resultsGenerated: Number(row.resultsGenerated || 0),
      })),
      averages: {
        avgWau: formattedWauTrend.length
          ? Math.round(
              formattedWauTrend.reduce(
                (sum, item) => sum + item.activeUsers,
                0,
              ) / formattedWauTrend.length,
            )
          : 0,
        avgMau: formattedMauTrend.length
          ? Math.round(
              formattedMauTrend.reduce(
                (sum, item) => sum + item.activeUsers,
                0,
              ) / formattedMauTrend.length,
            )
          : 0,
      },
      mostActiveProjects,
    };
  }

  private applyDashboardFilters(
    qb,
    query: any,
    userData: User,
    tenant: TenantScope,
    // `relationFiltersAsExists`: for callers that do NOT join `sample.diseases`
    // as `disease` / `sample.labTests` as `labtest` (those joins fan a sample
    // out into one row per disease x lab test). The disease / test-result /
    // variant filters are then applied as EXISTS checks on the sample instead.
    options: {
      includeTestResult?: boolean;
      relationFiltersAsExists?: boolean;
    } = {},
  ) {
    const {
      diseaseId,
      siteId,
      sampleTypeId,
      testResult,
      startDate,
      endDate,
      stateId,
      districtId,
      subdistrictId,
      variant,
    } = query;

    // Tenant predicate resolved from the caller's actual memberships
    // (System / Workspace->projects / Project / Team), never from the legacy
    // `userData.project?.id`, which is null for workspace-admins and for
    // anyone belonging to more than one project - see tenant-scope.ts.
    applyProjectScope(qb, tenant, 'project.id');

    if (query?.workspaceId) {
      qb.andWhere('project.workspace_id = :filterWorkspaceId', {
        filterWorkspaceId: query.workspaceId,
      });
    }

    if (diseaseId) {
      const ids = Array.isArray(diseaseId) ? diseaseId : [diseaseId];
      if (ids.length > 0) {
        qb.andWhere(
          options.relationFiltersAsExists
            ? `EXISTS (SELECT 1 FROM samples_diseases_diseases sd_filter WHERE sd_filter."samplesId" = sample.id AND sd_filter."diseasesId" IN (:...diseaseIds))`
            : 'disease.id IN (:...diseaseIds)',
          { diseaseIds: ids },
        );
      }
    }

    if (siteId) {
      const ids = Array.isArray(siteId) ? siteId : [siteId];
      if (ids.length > 0) {
        qb.andWhere('site.id IN (:...siteIds)', { siteIds: ids });
      }
    }

    if (sampleTypeId) {
      const ids = Array.isArray(sampleTypeId) ? sampleTypeId : [sampleTypeId];
      if (ids.length > 0) {
        qb.andWhere('sampletype.id IN (:...sampleTypeIds)', {
          sampleTypeIds: ids,
        });
      }
    }

    if (options.relationFiltersAsExists) {
      // Both predicates go in ONE EXISTS: with the `labtest` join they had to
      // hold on the same joined lab-test row, i.e. the same lab test.
      const labTestConditions: string[] = [];
      const labTestParams: Record<string, unknown> = {};

      if (options.includeTestResult !== false && testResult) {
        const ids = Array.isArray(testResult) ? testResult : [testResult];
        if (ids.length > 0) {
          labTestConditions.push('lt_filter."testResult" IN (:...testResults)');
          labTestParams.testResults = ids;
        }
      }

      if (variant) {
        const variants = Array.isArray(variant) ? variant : [variant];
        if (variants.length > 0) {
          labTestConditions.push(
            `(${variants.map((_, i) => `lt_filter.variant ILIKE :variant${i}`).join(' OR ')})`,
          );
          variants.forEach((v, i) => {
            labTestParams[`variant${i}`] = `%${v}%`;
          });
        }
      }

      if (labTestConditions.length > 0) {
        qb.andWhere(
          `EXISTS (SELECT 1 FROM lab_tests lt_filter WHERE lt_filter."sampleId" = sample.id AND ${labTestConditions.join(' AND ')})`,
          labTestParams,
        );
      }
    }

    if (
      !options.relationFiltersAsExists &&
      options.includeTestResult !== false &&
      testResult
    ) {
      const ids = Array.isArray(testResult) ? testResult : [testResult];
      if (ids.length > 0) {
        qb.andWhere('labtest."testResult" IN (:...testResults)', {
          testResults: ids,
        });
      }
    }

    if (!options.relationFiltersAsExists && variant) {
      const variants = Array.isArray(variant) ? variant : [variant];
      if (variants.length > 0) {
        qb.andWhere(
          new Brackets((b) => {
            variants.forEach((v, i) => {
              b.orWhere(`labtest.variant ILIKE :variant${i}`, {
                [`variant${i}`]: `%${v}%`,
              });
            });
          }),
        );
      }
    }

    if (startDate && endDate) {
      qb.andWhere('sample."collectedAt" BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    if (stateId) {
      const ids = Array.isArray(stateId) ? stateId : [stateId];
      if (ids.length > 0) {
        qb.andWhere(
          new Brackets((queryBuilder) => {
            queryBuilder
              .where('parentregion.id IN (:...stateIds)', { stateIds: ids })
              .orWhere('grandparentregion.id IN (:...stateIds)', {
                stateIds: ids,
              })
              .orWhere('region.id IN (:...stateIds)', { stateIds: ids });
          }),
        );
      }
    }

    if (districtId) {
      const ids = Array.isArray(districtId) ? districtId : [districtId];
      if (ids.length > 0) {
        qb.andWhere(
          new Brackets((queryBuilder) => {
            queryBuilder
              .where('region.id IN (:...districtIds)', { districtIds: ids })
              .orWhere('parentregion.id IN (:...districtIds)', {
                districtIds: ids,
              });
          }),
        );
      }
    }

    if (subdistrictId) {
      const ids = Array.isArray(subdistrictId)
        ? subdistrictId
        : [subdistrictId];
      if (ids.length > 0) {
        qb.andWhere('region.id IN (:...subdistrictIds)', {
          subdistrictIds: ids,
        });
      }
    }

    return qb;
  }

  // Independent IDOR fix (A11): a client-supplied `?projectId=` must be
  // checked against the caller's real memberships before being used to widen
  // or narrow the query - never trusted outright. Unreachable ids are simply
  // dropped, so a foreign id collapses the result set instead of leaking it.
  private applyProjectFilter(qb, query: any, tenant: TenantScope) {
    if (query.projectId) {
      const requestedIds = Array.isArray(query.projectId)
        ? query.projectId
        : [query.projectId];
      const reachableIds = requestedIds.filter((id: string) =>
        canReachProject(tenant, id),
      );
      if (!reachableIds.length) {
        return qb.andWhere('1 = 0');
      }
      qb.andWhere('project.id IN (:...projectIds)', {
        projectIds: reachableIds,
      });
    }
    return qb;
  }

  async getMonitorDashboardStats(query: any, user: User): Promise<any> {
    const userData = user;
    const tenant = await this.tenantScopeService.forUser(userData);

    const testedStatuses = [
      SampleStatus.TESTED,
      SampleStatus.TEST_REPORT_GENERATED,
    ];

    const baseQuery = this.sampleRepository
      .createQueryBuilder('sample')
      .leftJoin('sample.project', 'project')
      .leftJoin('sample.site', 'site')
      .leftJoin('site.location', 'location')
      .leftJoin('location.region', 'region')
      .leftJoin('region.parentRegion', 'parentregion')
      .leftJoin('parentregion.parentRegion', 'grandparentregion')
      .leftJoin('sample.diseases', 'disease')
      .leftJoin('sample.sampleType', 'sampletype')
      .leftJoin('sample.labTests', 'labtest');

    const summaryQuery = this.applyProjectFilter(
      this.applyDashboardFilters(baseQuery.clone(), query, userData, tenant),
      query,
      tenant,
    );

    const summarySelect = summaryQuery
      .select('COUNT(DISTINCT sample.id)', 'totalSamples')
      .addSelect(
        `COUNT(DISTINCT CASE 
          WHEN sample."sampleStatus" IN (:...testedStatuses) THEN sample.id
        END)`,
        'processedSamples',
      )
      .addSelect(
        `COUNT(DISTINCT CASE 
          WHEN labtest."testResult" = :positive THEN sample.id
        END)`,
        'positiveSamples',
      )
      .addSelect(
        `COUNT(DISTINCT CASE 
          WHEN labtest."testResult" = :negative THEN sample.id
        END)`,
        'negativeSamples',
      )
      .addSelect(
        `COUNT(DISTINCT CASE 
          WHEN labtest."testResult" = :unclear THEN sample.id
        END)`,
        'inconclusiveSamples',
      )
      .setParameters({
        testedStatuses,
        positive: TestResultType.POSITIVE,
        negative: TestResultType.NEGATIVE,
        unclear: TestResultType.UNCLEAR,
      });

    let resultFocus = query.testResult;
    if (Array.isArray(resultFocus)) {
      resultFocus = resultFocus[0];
    }
    if (!resultFocus) {
      resultFocus = TestResultType.POSITIVE;
    }

    const positiveSitesQuery = this.applyProjectFilter(
      this.applyDashboardFilters(
        baseQuery.clone(),
        { ...query, testResult: undefined },
        userData,
        tenant,
        { includeTestResult: false },
      ),
      query,
      tenant,
    )
      .select('COUNT(DISTINCT site.id)', 'positiveSites')
      .andWhere('labtest."testResult" = :resultFocus', { resultFocus });

    if (query.diseaseId) {
      const ids = Array.isArray(query.diseaseId)
        ? query.diseaseId
        : [query.diseaseId];
      if (ids.length > 0) {
        positiveSitesQuery.andWhere('labtest."diseaseId" IN (:...diseaseIds)', {
          diseaseIds: ids,
        });
      }
    }

    const trendQuery = this.applyProjectFilter(
      this.applyDashboardFilters(baseQuery.clone(), query, userData, tenant),
      query,
      tenant,
    )
      .select(`DATE_TRUNC('month', sample."collectedAt")`, 'period')
      .addSelect('COUNT(DISTINCT sample.id)', 'totalSamples')
      .addSelect(
        `COUNT(DISTINCT CASE
          WHEN labtest."testResult" = :positive THEN sample.id
        END)`,
        'positiveSamples',
      )
      .addSelect(
        `COUNT(DISTINCT CASE 
          WHEN labtest."testResult" = :negative THEN sample.id
        END)`,
        'negativeSamples',
      )
      .setParameters({
        positive: TestResultType.POSITIVE,
        negative: TestResultType.NEGATIVE,
      })
      .groupBy('period')
      .orderBy('period', 'ASC');

    if (query.diseaseId) {
      const ids = Array.isArray(query.diseaseId)
        ? query.diseaseId
        : [query.diseaseId];
      if (ids.length > 0) {
        trendQuery.andWhere('labtest."diseaseId" IN (:...diseaseIds)', {
          diseaseIds: ids,
        });
      }
    }

    // Site-grouped trend query
    const siteTrendQuery = this.applyProjectFilter(
      this.applyDashboardFilters(baseQuery.clone(), query, userData, tenant),
      query,
      tenant,
    )
      .select(`DATE_TRUNC('month', sample."collectedAt")`, 'period')
      .addSelect('site.name', 'siteName')
      .addSelect('COUNT(DISTINCT sample.id)', 'totalSamples')
      .addSelect(
        `COUNT(DISTINCT CASE 
          WHEN labtest."testResult" = :positive THEN sample.id
        END)`,
        'positiveSamples',
      )
      .addSelect(
        `COUNT(DISTINCT CASE 
          WHEN labtest."testResult" = :negative THEN sample.id
        END)`,
        'negativeSamples',
      )
      .setParameters({
        positive: TestResultType.POSITIVE,
        negative: TestResultType.NEGATIVE,
      })
      .groupBy('period')
      .addGroupBy('site.name')
      .orderBy('period', 'ASC');

    if (query.diseaseId) {
      const ids = Array.isArray(query.diseaseId)
        ? query.diseaseId
        : [query.diseaseId];
      if (ids.length > 0) {
        siteTrendQuery.andWhere('labtest."diseaseId" IN (:...diseaseIds)', {
          diseaseIds: ids,
        });
      }
    }

    // Sample-type-grouped trend query
    const sampleTypeTrendQuery = this.applyProjectFilter(
      this.applyDashboardFilters(baseQuery.clone(), query, userData, tenant),
      query,
      tenant,
    )
      .select(`DATE_TRUNC('month', sample."collectedAt")`, 'period')
      .addSelect('sampletype.name', 'sampleTypeName')
      .addSelect('COUNT(DISTINCT sample.id)', 'totalSamples')
      .setParameters({
        positive: TestResultType.POSITIVE,
        negative: TestResultType.NEGATIVE,
      })
      .groupBy('period')
      .addGroupBy('sampletype.name')
      .orderBy('period', 'ASC');

    if (query.diseaseId) {
      const ids = Array.isArray(query.diseaseId)
        ? query.diseaseId
        : [query.diseaseId];
      if (ids.length > 0) {
        sampleTypeTrendQuery.andWhere(
          'labtest."diseaseId" IN (:...diseaseIds)',
          {
            diseaseIds: ids,
          },
        );
      }
    }

    const [
      summaryRaw,
      positiveSitesRaw,
      trendRaw,
      siteTrendRaw,
      sampleTypeTrendRaw,
      diseases,
    ] = await Promise.all([
      summarySelect.getRawOne(),
      positiveSitesQuery.getRawOne(),
      trendQuery.getRawMany(),
      siteTrendQuery.getRawMany(),
      sampleTypeTrendQuery.getRawMany(),
      this.diseaseRepository.find({
        where: { status: StatusType.ACTIVE },
        order: { index: 'ASC' },
      }),
    ]);

    const totalSamples = Number(summaryRaw?.totalSamples || 0);
    const processedSamples = Number(summaryRaw?.processedSamples || 0);
    const positiveSamples = Number(summaryRaw?.positiveSamples || 0);
    const negativeSamples = Number(summaryRaw?.negativeSamples || 0);
    const inconclusiveSamples = Number(summaryRaw?.inconclusiveSamples || 0);
    const positivityRate = processedSamples
      ? Number(((positiveSamples / processedSamples) * 100).toFixed(2))
      : 0;

    const trend = trendRaw.map((row) => ({
      period: row.period,
      totalSamples: Number(row.totalSamples || 0),
      positiveSamples: Number(row.positiveSamples || 0),
      negativeSamples: Number(row.negativeSamples || 0),
    }));

    const siteTrend = siteTrendRaw.map((row) => ({
      period: row.period,
      siteName: row.siteName,
      totalSamples: Number(row.totalSamples || 0),
      positiveSamples: Number(row.positiveSamples || 0),
      negativeSamples: Number(row.negativeSamples || 0),
    }));

    const sampleTypeTrend = sampleTypeTrendRaw.map((row) => ({
      period: row.period,
      sampleTypeName: row.sampleTypeName,
      totalSamples: Number(row.totalSamples || 0),
    }));

    const diseaseIds = query.diseaseId
      ? Array.isArray(query.diseaseId)
        ? query.diseaseId
        : [query.diseaseId]
      : diseases.map((d) => d.id);

    // Filter to ensure only valid disease IDs
    const validDiseaseIds = diseaseIds.filter((id) =>
      diseases.find((d) => d.id === id),
    );

    let diseasePositive: any[] = [];

    if (validDiseaseIds.length) {
      const diseaseQuery = this.applyProjectFilter(
        this.applyDashboardFilters(
          baseQuery.clone(),
          { ...query, testResult: undefined },
          userData,
          tenant,
          { includeTestResult: false },
        ),
        query,
        tenant,
      )
        .select('disease.id', 'diseaseId')
        .addSelect('disease.name', 'diseaseName')
        .addSelect('disease."shortName"', 'diseaseShortName')
        .addSelect('disease."index"', 'diseaseIndex')
        .addSelect(
          `COUNT(DISTINCT CASE
            WHEN labtest."testResult" = :resultFocus AND labtest."diseaseId" = disease.id THEN sample.id
          END)`,
          'resultCount',
        )
        .setParameters({ resultFocus })
        .andWhere('disease.id IN (:...validDiseaseIds)', { validDiseaseIds })
        .groupBy('disease.id')
        .addGroupBy('disease.name')
        .addGroupBy('disease."shortName"')
        .addGroupBy('disease."index"')
        .orderBy('disease."index"', 'ASC');

      diseasePositive = (await diseaseQuery.getRawMany()).map((row) => ({
        diseaseId: row.diseaseId,
        diseaseName: row.diseaseName,
        diseaseShortName: row.diseaseShortName,
        diseaseIndex: Number(row.diseaseIndex || 0),
        positiveSamples: Number(row.resultCount || 0),
      }));
    }

    return {
      summary: {
        totalSamples,
        processedSamples,
        positivityRate,
        positiveSamples,
        negativeSamples,
        positiveSites: Number(positiveSitesRaw?.positiveSites || 0),
        inconclusiveSamples,
      },
      trend,
      siteTrend,
      sampleTypeTrend,
      diseasePositive,
    };
  }

  async getProjectComparison(query: any, user: User): Promise<any> {
    const userData = user;
    const tenant = await this.tenantScopeService.forUser(userData);

    const baseQuery = this.sampleRepository
      .createQueryBuilder('sample')
      .leftJoin('sample.project', 'project')
      .leftJoin('sample.site', 'site')
      .leftJoin('site.location', 'location')
      .leftJoin('location.region', 'region')
      .leftJoin('region.parentRegion', 'parentregion')
      .leftJoin('parentregion.parentRegion', 'grandparentregion')
      .leftJoin('sample.diseases', 'disease')
      .leftJoin('sample.sampleType', 'sampletype')
      .leftJoin('sample.labTests', 'labtest');

    const scoped = (q) =>
      this.applyProjectFilter(
        this.applyDashboardFilters(baseQuery.clone(), q, userData, tenant),
        q,
        tenant,
      );

    // 1. Summary
    const summaryRaw = await scoped(query)
      .select('COUNT(DISTINCT sample.id)', 'totalSamples')
      .addSelect('COUNT(DISTINCT project.id)', 'totalProjects')
      .addSelect('COUNT(DISTINCT sampletype.id)', 'sampleTypeCount')
      .addSelect(
        `COUNT(DISTINCT CASE WHEN labtest."testResult" = :positive THEN sample.id END)`,
        'positiveSamples',
      )
      .setParameter('positive', TestResultType.POSITIVE)
      .getRawOne();

    const totalSamples = Number(summaryRaw?.totalSamples || 0);
    const positiveSamples = Number(summaryRaw?.positiveSamples || 0);

    // 2. Projects in scope (columns / legend)
    const projectsRaw = await scoped(query)
      .select('project.id', 'id')
      .addSelect('project.name', 'name')
      .addSelect('project.code', 'code')
      .andWhere('project.id IS NOT NULL')
      .groupBy('project.id')
      .addGroupBy('project.name')
      .addGroupBy('project.code')
      .orderBy('project.name', 'ASC')
      .getRawMany();

    // 3. Matrix: project x sample type
    const matrixRaw = await scoped(query)
      .select('project.id', 'projectId')
      .addSelect('sampletype.id', 'sampleTypeId')
      .addSelect('sampletype.name', 'sampleTypeName')
      .addSelect('COUNT(DISTINCT sample.id)', 'totalSamples')
      .addSelect(
        `COUNT(DISTINCT CASE WHEN labtest."testResult" = :positive THEN sample.id END)`,
        'positiveSamples',
      )
      .setParameter('positive', TestResultType.POSITIVE)
      .andWhere('sampletype.id IS NOT NULL')
      .groupBy('project.id')
      .addGroupBy('sampletype.id')
      .addGroupBy('sampletype.name')
      .getRawMany();

    // 4. Per-project monthly trend
    const trendRaw = await scoped(query)
      .select(`DATE_TRUNC('month', sample."collectedAt")`, 'period')
      .addSelect('project.id', 'projectId')
      .addSelect('COUNT(DISTINCT sample.id)', 'totalSamples')
      .addSelect(
        `COUNT(DISTINCT CASE WHEN labtest."testResult" = :positive THEN sample.id END)`,
        'positiveSamples',
      )
      .setParameter('positive', TestResultType.POSITIVE)
      .andWhere('project.id IS NOT NULL')
      .andWhere('sample."collectedAt" IS NOT NULL')
      .groupBy('period')
      .addGroupBy('project.id')
      .orderBy('period', 'ASC')
      .getRawMany();

    // 5. Disease distribution (positive samples per disease)
    const diseases = await this.diseaseRepository.find({
      where: { status: StatusType.ACTIVE },
      order: { index: 'ASC' },
    });
    const requestedDiseaseIds = query.diseaseId
      ? Array.isArray(query.diseaseId)
        ? query.diseaseId
        : [query.diseaseId]
      : diseases.map((d) => d.id);
    const validDiseaseIds = requestedDiseaseIds.filter((id) =>
      diseases.find((d) => d.id === id),
    );

    let diseaseRaw: any[] = [];
    if (validDiseaseIds.length) {
      diseaseRaw = await this.applyProjectFilter(
        this.applyDashboardFilters(
          baseQuery.clone(),
          { ...query, testResult: undefined },
          userData,
          tenant,
          { includeTestResult: false },
        ),
        query,
        tenant,
      )
        .select('disease.id', 'diseaseId')
        .addSelect('disease.name', 'diseaseName')
        .addSelect('disease."shortName"', 'diseaseShortName')
        .addSelect('disease."index"', 'diseaseIndex')
        .addSelect(
          `COUNT(DISTINCT CASE WHEN labtest."testResult" = :positive AND labtest."diseaseId" = disease.id THEN sample.id END)`,
          'positiveCount',
        )
        .addSelect(
          `COUNT(DISTINCT CASE WHEN labtest."diseaseId" = disease.id THEN sample.id END)`,
          'totalCount',
        )
        .setParameter('positive', TestResultType.POSITIVE)
        .andWhere('disease.id IN (:...validDiseaseIds)', { validDiseaseIds })
        .groupBy('disease.id')
        .addGroupBy('disease.name')
        .addGroupBy('disease."shortName"')
        .addGroupBy('disease."index"')
        .getRawMany();
    }

    // 6. Sample-type distribution of positive samples (scoped to the selected
    //    disease[s] when a disease filter is applied). Powers the donut when a
    //    single disease is selected.
    const sampleTypeDistQuery = scoped(query)
      .select('sampletype.id', 'sampleTypeId')
      .addSelect('sampletype.name', 'sampleTypeName')
      .andWhere('sampletype.id IS NOT NULL')
      .groupBy('sampletype.id')
      .addGroupBy('sampletype.name');

    if (query.diseaseId) {
      const ids = Array.isArray(query.diseaseId)
        ? query.diseaseId
        : [query.diseaseId];
      if (ids.length > 0) {
        sampleTypeDistQuery
          .addSelect(
            `COUNT(DISTINCT CASE WHEN labtest."testResult" = :positive AND labtest."diseaseId" IN (:...stDiseaseIds) THEN sample.id END)`,
            'positiveCount',
          )
          .addSelect(
            `COUNT(DISTINCT CASE WHEN labtest."diseaseId" IN (:...stDiseaseIds) THEN sample.id END)`,
            'totalCount',
          )
          .setParameter('positive', TestResultType.POSITIVE)
          .setParameter('stDiseaseIds', ids);
      }
    } else {
      sampleTypeDistQuery
        .addSelect(
          `COUNT(DISTINCT CASE WHEN labtest."testResult" = :positive THEN sample.id END)`,
          'positiveCount',
        )
        .addSelect('COUNT(DISTINCT sample.id)', 'totalCount')
        .setParameter('positive', TestResultType.POSITIVE);
    }

    const sampleTypeDistRaw = await sampleTypeDistQuery.getRawMany();

    // 7. Per-project, per-disease monthly trend (feeds the disease-wise trend chart)
    let diseaseTrendRaw: any[] = [];
    if (validDiseaseIds.length) {
      diseaseTrendRaw = await this.applyProjectFilter(
        this.applyDashboardFilters(
          baseQuery.clone(),
          { ...query, testResult: undefined },
          userData,
          tenant,
          { includeTestResult: false },
        ),
        query,
        tenant,
      )
        .select(`DATE_TRUNC('month', sample."collectedAt")`, 'period')
        .addSelect('project.id', 'projectId')
        .addSelect('disease.id', 'diseaseId')
        .addSelect(
          `COUNT(DISTINCT CASE WHEN labtest."testResult" = :positive AND labtest."diseaseId" = disease.id THEN sample.id END)`,
          'positiveSamples',
        )
        .addSelect(
          `COUNT(DISTINCT CASE WHEN labtest."diseaseId" = disease.id THEN sample.id END)`,
          'totalSamples',
        )
        .setParameter('positive', TestResultType.POSITIVE)
        .andWhere('disease.id IN (:...validDiseaseIds)', { validDiseaseIds })
        .andWhere('project.id IS NOT NULL')
        .andWhere('sample."collectedAt" IS NOT NULL')
        .groupBy('period')
        .addGroupBy('project.id')
        .addGroupBy('disease.id')
        .orderBy('period', 'ASC')
        .getRawMany();
    }

    const { matrix, sampleTypeAverages } = buildSampleTypeMatrix(matrixRaw);

    return {
      summary: {
        totalSamples,
        positiveSamples,
        positivityRate: computeRate(positiveSamples, totalSamples),
        totalProjects: Number(summaryRaw?.totalProjects || 0),
        sampleTypeCount: Number(summaryRaw?.sampleTypeCount || 0),
      },
      projects: projectsRaw.map((p) => ({
        id: p.id,
        name: p.name,
        code: p.code,
      })),
      sampleTypeAverages,
      perProjectTrend: buildPerProjectTrend(trendRaw),
      diseaseDistribution: buildDiseaseDistribution(diseaseRaw),
      sampleTypeDistribution: buildSampleTypeDistribution(sampleTypeDistRaw),
      matrix,
      diseasesInScope: diseases
        .filter((d) => validDiseaseIds.includes(d.id))
        .map((d) => ({
          id: d.id,
          name: d.name,
          shortName: d.shortName,
          index: d.index,
        })),
      perProjectDiseaseTrend: buildPerProjectDiseaseTrend(diseaseTrendRaw),
      perDiseaseTrend: buildPerDiseaseTrend(diseaseTrendRaw),
    };
  }

  async getSiteComparison(query: any, user: User): Promise<any> {
    const site1Id = query.site1Id;
    const site2Id = query.site2Id;

    // Both sites are required for a head-to-head comparison.
    if (!site1Id || !site2Id) {
      return {
        sites: [],
        summary: {},
        sampleTypesCompared: [],
        trend: [],
        sampleTypeMatrix: [],
      };
    }

    const siteIds = [site1Id, site2Id];

    const userData = user;
    const tenant = await this.tenantScopeService.forUser(userData);

    const baseQuery = this.sampleRepository
      .createQueryBuilder('sample')
      .leftJoin('sample.project', 'project')
      .leftJoin('sample.site', 'site')
      .leftJoin('site.location', 'location')
      .leftJoin('location.region', 'region')
      .leftJoin('region.parentRegion', 'parentregion')
      .leftJoin('parentregion.parentRegion', 'grandparentregion')
      .leftJoin('sample.diseases', 'disease')
      .leftJoin('sample.sampleType', 'sampletype')
      .leftJoin('sample.labTests', 'labtest');

    // Scope to the two chosen sites (+ project + user scope + date range).
    const scoped = () =>
      this.applyProjectFilter(
        this.applyDashboardFilters(
          baseQuery.clone(),
          { ...query, siteId: siteIds },
          userData,
          tenant,
        ),
        query,
        tenant,
      );

    // 1. Per-site summary
    const summaryRaw = await scoped()
      .select('site.id', 'siteId')
      .addSelect('site.name', 'siteName')
      .addSelect('COUNT(DISTINCT sample.id)', 'totalSamples')
      .addSelect(
        `COUNT(DISTINCT CASE WHEN labtest."testResult" = :positive THEN sample.id END)`,
        'positiveSamples',
      )
      .setParameter('positive', TestResultType.POSITIVE)
      .andWhere('site.id IS NOT NULL')
      .groupBy('site.id')
      .addGroupBy('site.name')
      .getRawMany();

    const nameById: Record<string, string> = {};
    const summary: Record<string, any> = {};
    for (const row of summaryRaw) {
      const total = Number(row.totalSamples || 0);
      const positive = Number(row.positiveSamples || 0);
      nameById[row.siteId] = row.siteName;
      summary[row.siteId] = {
        totalSamples: total,
        positiveSamples: positive,
        positivityRate: computeRate(positive, total),
      };
    }

    // 2. Per-site x sample-type matrix
    const matrixRaw = await scoped()
      .select('site.id', 'siteId')
      .addSelect('sampletype.id', 'sampleTypeId')
      .addSelect('sampletype.name', 'sampleTypeName')
      .addSelect('COUNT(DISTINCT sample.id)', 'totalSamples')
      .addSelect(
        `COUNT(DISTINCT CASE WHEN labtest."testResult" = :positive THEN sample.id END)`,
        'positiveSamples',
      )
      .setParameter('positive', TestResultType.POSITIVE)
      .andWhere('sampletype.id IS NOT NULL')
      .groupBy('site.id')
      .addGroupBy('sampletype.id')
      .addGroupBy('sampletype.name')
      .getRawMany();

    // 3. Per-site monthly trend (rate + positive count)
    const trendRaw = await scoped()
      .select(`DATE_TRUNC('month', sample."collectedAt")`, 'period')
      .addSelect('site.id', 'siteId')
      .addSelect('COUNT(DISTINCT sample.id)', 'totalSamples')
      .addSelect(
        `COUNT(DISTINCT CASE WHEN labtest."testResult" = :positive THEN sample.id END)`,
        'positiveSamples',
      )
      .setParameter('positive', TestResultType.POSITIVE)
      .andWhere('site.id IS NOT NULL')
      .andWhere('sample."collectedAt" IS NOT NULL')
      .groupBy('period')
      .addGroupBy('site.id')
      .orderBy('period', 'ASC')
      .getRawMany();

    const sampleTypeMatrix = buildSiteSampleTypeMatrix(matrixRaw, siteIds);
    const sampleTypesCompared = sampleTypeMatrix.map((m) => m.name);

    // Preserve the user's chosen order: [site1, site2].
    const sites = siteIds
      .filter((id) => nameById[id])
      .map((id) => ({ id, name: nameById[id] }));

    return {
      sites,
      summary,
      sampleTypesCompared,
      trend: buildSiteTrend(trendRaw),
      sampleTypeMatrix,
    };
  }

  async getSampleTypeComparison(query: any, user: User): Promise<any> {
    const type1Id = query.sampleType1Id;
    const type2Id = query.sampleType2Id;

    if (!type1Id || !type2Id) {
      return {
        sampleTypes: [],
        summary: {},
        trend: [],
        byProject: [],
        diseaseComparison: [],
      };
    }

    const typeIds = [type1Id, type2Id];

    const userData = user;
    const tenant = await this.tenantScopeService.forUser(userData);

    const baseQuery = this.sampleRepository
      .createQueryBuilder('sample')
      .leftJoin('sample.project', 'project')
      .leftJoin('sample.site', 'site')
      .leftJoin('site.location', 'location')
      .leftJoin('location.region', 'region')
      .leftJoin('region.parentRegion', 'parentregion')
      .leftJoin('parentregion.parentRegion', 'grandparentregion')
      .leftJoin('sample.diseases', 'disease')
      .leftJoin('sample.sampleType', 'sampletype')
      .leftJoin('sample.labTests', 'labtest');

    // Scope to the two chosen sample types (+ project + user scope + state + date).
    const scoped = () =>
      this.applyProjectFilter(
        this.applyDashboardFilters(
          baseQuery.clone(),
          { ...query, sampleTypeId: typeIds },
          userData,
          tenant,
        ),
        query,
        tenant,
      );

    // 1. Per-type summary
    const summaryRaw = await scoped()
      .select('sampletype.id', 'sampleTypeId')
      .addSelect('sampletype.name', 'sampleTypeName')
      .addSelect('COUNT(DISTINCT sample.id)', 'totalSamples')
      .addSelect(
        `COUNT(DISTINCT CASE WHEN labtest."testResult" = :positive THEN sample.id END)`,
        'positiveSamples',
      )
      .setParameter('positive', TestResultType.POSITIVE)
      .andWhere('sampletype.id IS NOT NULL')
      .groupBy('sampletype.id')
      .addGroupBy('sampletype.name')
      .getRawMany();

    const nameById: Record<string, string> = {};
    const summary: Record<string, any> = {};
    const positivesByType: Record<string, number> = {};
    for (const row of summaryRaw) {
      const total = Number(row.totalSamples || 0);
      const positive = Number(row.positiveSamples || 0);
      nameById[row.sampleTypeId] = row.sampleTypeName;
      positivesByType[row.sampleTypeId] = positive;
      summary[row.sampleTypeId] = {
        totalSamples: total,
        positiveSamples: positive,
        positivityRate: computeRate(positive, total),
      };
    }

    // 2. Per-type monthly trend (rate + positive count)
    const trendRaw = await scoped()
      .select(`DATE_TRUNC('month', sample."collectedAt")`, 'period')
      .addSelect('sampletype.id', 'sampleTypeId')
      .addSelect('COUNT(DISTINCT sample.id)', 'totalSamples')
      .addSelect(
        `COUNT(DISTINCT CASE WHEN labtest."testResult" = :positive THEN sample.id END)`,
        'positiveSamples',
      )
      .setParameter('positive', TestResultType.POSITIVE)
      .andWhere('sampletype.id IS NOT NULL')
      .andWhere('sample."collectedAt" IS NOT NULL')
      .groupBy('period')
      .addGroupBy('sampletype.id')
      .orderBy('period', 'ASC')
      .getRawMany();

    // 3. Per-project x type rates
    const byProjectRaw = await scoped()
      .select('project.id', 'projectId')
      .addSelect('project.name', 'projectName')
      .addSelect('sampletype.id', 'sampleTypeId')
      .addSelect('COUNT(DISTINCT sample.id)', 'totalSamples')
      .addSelect(
        `COUNT(DISTINCT CASE WHEN labtest."testResult" = :positive THEN sample.id END)`,
        'positiveSamples',
      )
      .setParameter('positive', TestResultType.POSITIVE)
      .andWhere('project.id IS NOT NULL')
      .andWhere('sampletype.id IS NOT NULL')
      .groupBy('project.id')
      .addGroupBy('project.name')
      .addGroupBy('sampletype.id')
      .getRawMany();

    // 4. Disease-wise positive counts per type
    const diseaseRaw = await scoped()
      .select('disease.id', 'diseaseId')
      .addSelect('disease.name', 'diseaseName')
      .addSelect('disease."shortName"', 'diseaseShortName')
      .addSelect('disease."index"', 'diseaseIndex')
      .addSelect('sampletype.id', 'sampleTypeId')
      .addSelect(
        `COUNT(DISTINCT CASE WHEN labtest."testResult" = :positive AND labtest."diseaseId" = disease.id THEN sample.id END)`,
        'positiveCount',
      )
      .setParameter('positive', TestResultType.POSITIVE)
      .andWhere('disease.id IS NOT NULL')
      .andWhere('sampletype.id IS NOT NULL')
      .groupBy('disease.id')
      .addGroupBy('disease.name')
      .addGroupBy('disease."shortName"')
      .addGroupBy('disease."index"')
      .addGroupBy('sampletype.id')
      .getRawMany();

    const sampleTypes = typeIds
      .filter((id) => nameById[id])
      .map((id) => ({ id, name: nameById[id] }));

    return {
      sampleTypes,
      summary,
      trend: buildTypeTrend(trendRaw),
      byProject: buildTypeProjectMatrix(byProjectRaw, typeIds),
      diseaseComparison: buildTypeDiseaseComparison(
        diseaseRaw,
        typeIds,
        positivesByType,
      ),
    };
  }

  async getDiseaseWiseSampleStatsByProject(
    query: any,
    user: User,
  ): Promise<ProjectDiseaseStatsResponseType> {
    const userData = user;
    const userScope = getUserScope(userData);
    const isSuperAdmin = userScope === Scope.System;

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    let whereClause = '';
    const params: any[] = [];

    if (isSuperAdmin) {
      whereClause = 'WHERE p."created_by" = $1';
      params.push(user.id);
    } else {
      whereClause = 'WHERE tm.id = $1';
      params.push(user.id);
    }

    // Step 1: Get paginated project IDs
    const projectIdsRaw = await this.projectService.findAll(query, user);

    const projectIds = projectIdsRaw.docs.map((row) => row.id);

    if (projectIds.length === 0) {
      return {
        page,
        limit,
        total: 0,
        totalPages: 0,
        docs: [],
      };
    }

    // Step 2: Fetch disease statistics for those projects
    const diseaseStatsRaw = await this.dataSource.query(
      `
      SELECT 
        p.id AS "projectId",
        p.name AS "name",
        d.id AS "diseaseId",
        d."shortName" AS "diseaseShortName",
        d."index" AS "diseaseIndex",
        COUNT(DISTINCT s.id) AS "totalSamples",
        COUNT(DISTINCT CASE WHEN lt."testResult" = 'positive' THEN s.id END) AS "positiveSamples"
      FROM projects p
      LEFT JOIN project_diseases pd ON pd."project_id" = p.id
      LEFT JOIN diseases d ON d.id = pd."disease_id"
      LEFT JOIN project_regions pr ON pr."project_id" = p.id
      LEFT JOIN regions r ON r.id = pr."region_id"
      LEFT JOIN regions parentRegion ON parentRegion.id = r."parentRegionId"
      LEFT JOIN sites si ON si."projectId" = p.id
      LEFT JOIN visits v ON v."siteId" = si.id
      LEFT JOIN samples s ON s."visitId" = v.id
      LEFT JOIN lab_tests lt ON lt."sampleId" = s.id
      WHERE p.id = ANY($1)
      GROUP BY p.id, d.id, d."shortName", d."index"
      ORDER BY p.name
      `,
      [projectIds],
    );

    // Step 3: Fetch site statistics for those projects
    const siteStatsRaw = await this.dataSource.query(
      `
      SELECT 
        p.id AS "projectId",
        p.name AS "name",
        json_agg(DISTINCT jsonb_build_object(
          'id', r.id,
          'name', r.name,
          'parentRegion', jsonb_build_object(
            'id', parentRegion.id,
            'name', parentRegion.name
          )
        )) FILTER (WHERE r.id IS NOT NULL) AS "regions",
        COUNT(DISTINCT si.id) AS "totalSiteCount",
        COUNT(DISTINCT CASE WHEN v."visitedAt" IS NOT NULL THEN si.id END) AS "visitedSites",
        COUNT(DISTINCT CASE WHEN v."visitedAt" IS NULL THEN si.id END) AS "notVisitedSites"
      FROM projects p
      LEFT JOIN project_regions pr ON pr."project_id" = p.id
      LEFT JOIN regions r ON r.id = pr."region_id"
      LEFT JOIN regions parentRegion ON parentRegion.id = r."parentRegionId"
      LEFT JOIN sites si ON si."projectId" = p.id
      LEFT JOIN visits v ON v."siteId" = si.id
      WHERE p.id = ANY($1)
      GROUP BY p.id
      ORDER BY p.name
      `,
      [projectIds],
    );

    // Step 4: Combine Results
    const projectMap = new Map<string, any>();

    for (const stat of siteStatsRaw) {
      projectMap.set(stat.projectId, {
        id: stat.projectId,
        name: stat.name,
        visitedSites: Number(stat.visitedSites || 0),
        notVisitedSites: Number(stat.notVisitedSites || 0),
        totalSiteCount: Number(stat.totalSiteCount || 0),
        regions: stat.regions || [],
        diseases: [],
        diseaseStatistics: [],
      });
    }

    diseaseStatsRaw.sort((a, b) => a.diseaseIndex - b.diseaseIndex);

    for (const stat of diseaseStatsRaw) {
      if (!stat.diseaseId) continue;

      if (!projectMap.has(stat.projectId)) {
        projectMap.set(stat.projectId, {
          id: stat.projectId,
          name: stat.name,
          visitedSites: 0,
          notVisitedSites: 0,
          totalSiteCount: 0,
          regions: [],
          diseases: [],
          diseaseStatistics: [],
        });
      }

      const project = projectMap.get(stat.projectId);

      if (!project.diseases.some((d) => d.id === stat.diseaseId)) {
        project.diseases.push({
          id: stat.diseaseId,
          index: stat.diseaseIndex,
          shortName: stat.diseaseShortName,
        });
      }

      project.diseaseStatistics.push({
        diseaseShortName: stat.diseaseShortName,
        diseaseIndex: stat.diseaseIndex,
        totalSamples: Number(stat.totalSamples || 0),
        positiveSamples: Number(stat.positiveSamples || 0),
      });
    }

    // Step 5: Total count (already correct)
    const totalCountResult = await this.dataSource.query(
      `
      SELECT COUNT(DISTINCT p.id) AS total
      FROM projects p
      LEFT JOIN project_diseases pd ON pd."project_id" = p.id
      LEFT JOIN diseases d ON d.id = pd."disease_id"
      LEFT JOIN project_regions pr ON pr."project_id" = p.id
      LEFT JOIN regions r ON r.id = pr."region_id"
      LEFT JOIN regions parentRegion ON parentRegion.id = r."parentRegionId"
      ${!isSuperAdmin ? 'INNER JOIN project_teams pt ON pt."project_id" = p.id' : ''}
      ${!isSuperAdmin ? 'INNER JOIN teams t ON t.id = pt."team_id"' : ''}
      ${!isSuperAdmin ? 'INNER JOIN users tm ON tm."teamId" = t.id' : ''}
      ${whereClause}
      `,
      params,
    );

    const total = Number(totalCountResult[0]?.total || 0);
    const totalPages = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPages,
      docs: Array.from(projectMap.values()),
    };
  }
  async getSiteWiseAnalysis(query: any, user: User): Promise<any> {
    const userData = user;
    const tenant = await this.tenantScopeService.forUser(userData);

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    // Only many-to-one joins, so this is exactly one row per sample. Joining
    // `sample.diseases` / `sample.labTests` here would fan every sample out
    // into one row per disease x lab test, so their filters are applied as
    // EXISTS checks instead (`relationFiltersAsExists`).
    const baseQuery = this.sampleRepository
      .createQueryBuilder('sample')
      .leftJoin('sample.project', 'project')
      .leftJoin('sample.site', 'site')
      .leftJoin('site.location', 'location')
      .leftJoin('location.region', 'region')
      .leftJoin('region.parentRegion', 'parentregion')
      .leftJoin('parentregion.parentRegion', 'grandparentregion')
      .leftJoin('sample.sampleType', 'sampletype');

    const filteredQuery = this.applyProjectFilter(
      this.applyDashboardFilters(baseQuery, query, userData, tenant, {
        relationFiltersAsExists: true,
      }),
      query,
      tenant,
    );

    // A sample can have multiple lab tests (one per disease). Its single status
    // looks at ALL of them, in priority order positive > unclear > negative >
    // pending (no lab tests, or only NULL results, falls through to pending),
    // so every sample lands in exactly one bucket. It is computed once per
    // sample by grouping that sample's lab tests below, not once per bucket.
    const sampleStatusExpr = `CASE
          WHEN BOOL_OR(lt_status."testResult" = 'positive') THEN 'positive'
          WHEN BOOL_OR(lt_status."testResult" = 'unclear') THEN 'unclear'
          WHEN BOOL_OR(lt_status."testResult" = 'negative') THEN 'negative'
          ELSE 'pending'
        END`;

    const perSampleQuery = filteredQuery
      .clone()
      .leftJoin('sample.labTests', 'lt_status')
      .select('sample.id', 'sampleId')
      .addSelect('site.id', 'siteId')
      .addSelect('site.name', 'siteName')
      .addSelect('site.siteType', 'siteType')
      .addSelect('site.farmType', 'farmType')
      .addSelect(
        `CASE
          WHEN region."regionType" = 'state' THEN region.name
          WHEN parentregion."regionType" = 'state' THEN parentregion.name
          WHEN grandparentregion."regionType" = 'state' THEN grandparentregion.name
        END`,
        'state',
      )
      .addSelect(
        `CASE
          WHEN region."regionType" = 'district' THEN region.name
          WHEN parentregion."regionType" = 'district' THEN parentregion.name
          WHEN grandparentregion."regionType" = 'district' THEN grandparentregion.name
        END`,
        'district',
      )
      .addSelect('site.block', 'block')
      .addSelect('site.village', 'village')
      .addSelect('site.address', 'address')
      .addSelect('sample.collectedAt', 'collectedAt')
      .addSelect(sampleStatusExpr, 'status')
      // The primary key of every table selected from above, so Postgres
      // accepts their other columns as functionally dependent.
      .groupBy('sample.id')
      .addGroupBy('site.id')
      .addGroupBy('region.id')
      .addGroupBy('parentregion.id')
      .addGroupBy('grandparentregion.id');

    // One row per sample in `per_sample`, so plain COUNT(*)s replace the
    // COUNT(DISTINCT sample.id)s that the fanned-out join needed.
    const dataQuery = this.dataSource
      .createQueryBuilder()
      .addCommonTableExpression(perSampleQuery, 'per_sample')
      .from('per_sample', 'per_sample')
      // Same column (= response key) order as before, when TypeORM emitted the
      // `site.*` selects in Site entity column order ahead of state/district.
      .select('per_sample."siteId"', 'siteId')
      .addSelect('per_sample."siteName"', 'siteName')
      .addSelect('per_sample."farmType"', 'farmType')
      .addSelect('per_sample."siteType"', 'siteType')
      .addSelect('per_sample."address"', 'address')
      .addSelect('per_sample."block"', 'block')
      .addSelect('per_sample."village"', 'village')
      .addSelect('per_sample."state"', 'state')
      .addSelect('per_sample."district"', 'district')
      .addSelect('COUNT(*)', 'totalSamples')
      .addSelect(
        `COUNT(*) FILTER (WHERE per_sample.status = 'positive')`,
        'positiveSamples',
      )
      .addSelect(
        `COUNT(*) FILTER (WHERE per_sample.status = 'unclear')`,
        'unclearSamples',
      )
      .addSelect(
        `COUNT(*) FILTER (WHERE per_sample.status = 'negative')`,
        'negativeSamples',
      )
      .addSelect(
        `COUNT(*) FILTER (WHERE per_sample.status = 'pending')`,
        'pendingSamples',
      )
      .addSelect('MAX(per_sample."collectedAt")', 'lastSampleDate')
      // Number of sites across all pages, read off the page itself.
      .addSelect('COUNT(*) OVER ()', 'totalSites')
      .groupBy(
        'per_sample."siteId", per_sample."siteName", per_sample."siteType", per_sample."farmType", per_sample."state", per_sample."district", per_sample."block", per_sample."village", per_sample."address"',
      )
      // The previous query had no ORDER BY but always came back in site-id
      // order (its GroupAggregate sorted on site.id first); keep that order.
      .orderBy('per_sample."siteId"', 'ASC')
      .offset(skip)
      .limit(limit);

    const rawData = await dataQuery.getRawMany();

    // A page past the last one has no row to read `totalSites` from, so only
    // then count the sites separately (cheap: no lab-test work, no fan-out).
    const total = rawData.length
      ? Number(rawData[0].totalSites)
      : Number(
          (
            await filteredQuery
              .clone()
              .select('COUNT(DISTINCT site.id)', 'total')
              .getRawOne()
          )?.total || 0,
        );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- drops the window count from the response rows
    const docs = rawData.map(({ totalSites, ...row }) => ({
      ...row,
      totalSamples: Number(row.totalSamples),
      positiveSamples: Number(row.positiveSamples),
      unclearSamples: Number(row.unclearSamples),
      negativeSamples: Number(row.negativeSamples),
      pendingSamples: Number(row.pendingSamples),
      positivityRate: Number(row.totalSamples)
        ? Number(
            (
              (Number(row.positiveSamples) / Number(row.totalSamples)) *
              100
            ).toFixed(1),
          )
        : 0,
    }));

    return {
      data: docs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      success: true,
    };
  }

  async getDiseaseWiseAnalysis(query: any, user: User): Promise<any> {
    const userData = user;
    const tenant = await this.tenantScopeService.forUser(userData);

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const baseQuery = this.sampleRepository
      .createQueryBuilder('sample')
      .leftJoin('sample.project', 'project')
      .leftJoin('sample.site', 'site')
      .leftJoin('site.location', 'location')
      .leftJoin('location.region', 'region')
      .leftJoin('region.parentRegion', 'parentregion')
      .leftJoin('parentregion.parentRegion', 'grandparentregion')
      .leftJoin('sample.diseases', 'disease')
      .leftJoin('sample.sampleType', 'sampletype')
      .leftJoin('sample.labTests', 'labtest');

    const filteredQuery = this.applyProjectFilter(
      this.applyDashboardFilters(baseQuery, query, userData, tenant),
      query,
      tenant,
    );

    const testedStatuses = [
      SampleStatus.TESTED,
      SampleStatus.TEST_REPORT_GENERATED,
    ];

    const dataQuery = filteredQuery
      .clone()
      .select('disease.id', 'diseaseId')
      .addSelect('disease.name', 'diseaseName')
      .addSelect('COUNT(DISTINCT sample.id)', 'totalSamples')
      .addSelect(
        `COUNT(DISTINCT CASE WHEN sample."sampleStatus" IN (:...testedStatuses) THEN sample.id END)`,
        'processedSamples',
      )
      .addSelect(
        `COUNT(DISTINCT CASE WHEN labtest."testResult" = 'positive' THEN sample.id END)`,
        'positiveSamples',
      )
      .addSelect(
        `COUNT(DISTINCT CASE WHEN labtest."testResult" = 'negative' THEN sample.id END)`,
        'negativeSamples',
      )
      .setParameters({ testedStatuses })
      .groupBy('disease.id, disease.name')
      .offset(skip)
      .limit(limit);

    const rawData = await dataQuery.getRawMany();

    // Total count logic
    const totalCountQuery = this.applyProjectFilter(
      this.applyDashboardFilters(
        this.sampleRepository
          .createQueryBuilder('sample')
          .leftJoin('sample.project', 'project')
          .leftJoin('sample.site', 'site')
          .leftJoin('site.location', 'location')
          .leftJoin('location.region', 'region')
          .leftJoin('region.parentRegion', 'parentregion')
          .leftJoin('parentregion.parentRegion', 'grandparentregion')
          .leftJoin('sample.diseases', 'disease')
          .leftJoin('sample.sampleType', 'sampletype')
          .leftJoin('sample.labTests', 'labtest'),
        query,
        userData,
        tenant,
      ),
      query,
      tenant,
    ).select('COUNT(DISTINCT disease.id)', 'total');

    const totalRaw = await totalCountQuery.getRawOne();
    const total = Number(totalRaw?.total || 0);

    const docs = rawData.map((row) => ({
      ...row,
      totalSamples: Number(row.totalSamples),
      positiveSamples: Number(row.positiveSamples),
      negativeSamples: Number(row.negativeSamples),
      positivityRate: Number(row.processedSamples)
        ? Number(
            (
              (Number(row.positiveSamples) / Number(row.processedSamples)) *
              100
            ).toFixed(1),
          )
        : 0,
    }));

    return {
      data: docs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      success: true,
    };
  }

  async getSampleWiseAnalysis(query: any, user: User): Promise<any> {
    const userData = user;
    const tenant = await this.tenantScopeService.forUser(userData);

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const baseQuery = this.sampleRepository
      .createQueryBuilder('sample')
      .leftJoin('sample.project', 'project')
      .leftJoin('sample.site', 'site')
      .leftJoin('site.location', 'location')
      .leftJoin('location.region', 'region')
      .leftJoin('region.parentRegion', 'parentregion')
      .leftJoin('parentregion.parentRegion', 'grandparentregion')
      .leftJoin('sample.diseases', 'disease')
      .leftJoin('sample.sampleType', 'sampletype')
      .leftJoin('sample.labTests', 'labtest')
      .leftJoin('sample.visit', 'visit'); // added: needed for round

    const filteredQuery = this.applyProjectFilter(
      this.applyDashboardFilters(baseQuery, query, userData, tenant),
      query,
      tenant,
    );

    const dataQuery = filteredQuery
      .clone()
      .select('sample.id', 'sampleId')
      .addSelect('sample.barcode', 'barcode')
      .addSelect('site.id', 'siteId') // added: group visits per site for round calc
      .addSelect('site.name', 'siteName')
      .addSelect('disease.name', 'diseaseName')
      .addSelect('visit.id', 'visitId') // added
      .addSelect('sample.collectedAt', 'collectedAt')
      .addSelect('sampletype.name', 'sampleType')
      .addSelect('sample.sampleStatus', 'status')
      .addSelect('labtest.testResult', 'result')
      .orderBy('sample.collectedAt', 'DESC')
      .offset(skip)
      .limit(limit);

    const rawData = await dataQuery.getRawMany();

    const totalCountQuery = this.applyProjectFilter(
      this.applyDashboardFilters(
        this.sampleRepository
          .createQueryBuilder('sample')
          .leftJoin('sample.project', 'project')
          .leftJoin('sample.site', 'site')
          .leftJoin('site.location', 'location')
          .leftJoin('location.region', 'region')
          .leftJoin('region.parentRegion', 'parentregion')
          .leftJoin('parentregion.parentRegion', 'grandparentregion')
          .leftJoin('sample.diseases', 'disease')
          .leftJoin('sample.sampleType', 'sampletype')
          .leftJoin('sample.labTests', 'labtest'),
        query,
        userData,
        tenant,
      ),
      query,
      tenant,
    ).select('COUNT(DISTINCT sample.id)', 'total');

    const totalRaw = await totalCountQuery.getRawOne();
    const total = Number(totalRaw?.total || 0);

    // Round numbers reuse the same per-site ranking as SamplesService.findAll
    // (see visit-rounds.util.ts) instead of a separate copy of the algorithm.
    const siteIds = [
      ...new Set(rawData.filter((r) => r.siteId).map((r) => r.siteId)),
    ];

    let visitRounds = new Map<string, number>();
    if (siteIds.length > 0) {
      const rawSiteVisits = await this.dataSource
        .createQueryBuilder()
        .select('visit.id', 'id')
        .addSelect('visit.siteId', 'siteId')
        .addSelect('visit.visitScheduledAt', 'visitScheduledAt')
        .from('visits', 'visit')
        .where('visit."siteId" IN (:...siteIds)', { siteIds })
        .getRawMany();

      visitRounds = assignRoundsBySite(rawSiteVisits);
    }

    const docs = rawData.map((row) => ({
      ...row,
      round: row.visitId ? (visitRounds.get(row.visitId) ?? null) : null,
    }));

    return {
      data: docs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      success: true,
    };
  }

  async getProjectSampleTypes(user: User): Promise<any> {
    const userData = user;
    const tenant = await this.tenantScopeService.forUser(userData);

    const qb = this.sampleRepository
      .createQueryBuilder('sample')
      .leftJoin('sample.project', 'project')
      .leftJoin('sample.sampleType', 'sampletype')
      .select('sampletype.id', 'id')
      .addSelect('sampletype.name', 'name');

    applyProjectScope(qb, tenant, 'project.id');

    qb.andWhere('sampletype.id IS NOT NULL');
    qb.groupBy('sampletype.id');
    qb.addGroupBy('sampletype.name');
    qb.orderBy('sampletype.name', 'ASC');

    const rawData = await qb.getRawMany();

    return {
      success: true,
      data: rawData,
    };
  }

  async getHomeLast30Days(query: any, user: User): Promise<any> {
    const userData = user;
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const startDate = thirtyDaysAgo.toISOString();
    const endDate = now.toISOString();
    const window = { startDate, endDate };

    // 4.4 follow-up, now generalized: `tenant.projectIds` already carries the
    // correctly-expanded reachable-project set for every scope (System /
    // Workspace->projects / Project / Team) - see tenant-scope.ts - so the
    // ad-hoc workspace->projects lookup that used to live here (and the
    // legacy singular `userData.project?.id` / `userData.team?.id` reads for
    // the Project/Team branches below) are gone. The one behaviour worth
    // preserving on top of it is workspace-admins narrowing to a single
    // project via the frontend's useCurrentProjectResolver() (`?projectId=`)
    // - kept scoped to Workspace scope, same as before, so this doesn't
    // change what Project/Team-scoped callers see.
    const tenant = await this.tenantScopeService.forUser(userData);

    let projectIds = tenant.projectIds;
    let isSystem = tenant.isSystem;

    const requestedWorkspaceId = Array.isArray(query?.workspaceId)
      ? query.workspaceId[0]
      : query?.workspaceId;

    const requestedProjectId = Array.isArray(query?.projectId)
      ? query.projectId[0]
      : query?.projectId;

    if (requestedWorkspaceId) {
      const wsProjects = await this.dataSource.getRepository(Project).find({
        where: { workspace: { id: requestedWorkspaceId } },
        select: ['id'],
      });
      const wsProjectIds = wsProjects.map((p) => p.id);
      if (tenant.isSystem) {
        projectIds = wsProjectIds;
        isSystem = false;
      } else {
        projectIds = wsProjectIds.filter((id) =>
          tenant.projectIds.includes(id),
        );
      }
    }

    if (requestedProjectId) {
      if (tenant.isSystem || tenant.projectIds.includes(requestedProjectId)) {
        projectIds = [requestedProjectId];
        isSystem = false;
      }
    }

    const scopedTenant: TenantScope = { ...tenant, isSystem, projectIds };

    // Each metric gets its own query rooted at the entity it actually counts.
    // The previous shared builder rooted everything at LabTest and left-joined
    // project.sites / project.visits, which cross-multiplied every lab test
    // against every site in the project — one positive test made all of a
    // project's sites count as positive. It also hid sites belonging to
    // projects with no lab tests at all.
    //
    // Team scope adds a team restriction on top of (never instead of) the
    // project restriction, sourced from `tenant.teamIds` - every team-scoped
    // role the caller holds, possibly several - rather than the legacy
    // singular `userData.team.id`, which silently picked one arbitrary team
    // (or none, for anyone without that legacy column set) regardless of how
    // many team roles the caller actually held. Empty either side fails
    // closed to `1 = 0`, same as `applyProjectScope` elsewhere - never an
    // absent predicate. Scope predicates differ per root only in which
    // column carries the team, since each entity has its own.
    const scopeToTenant = <T extends SelectQueryBuilder<any>>(
      qb: T,
      teamColumn: string,
    ): T => {
      applyProjectScope(qb, scopedTenant, 'project.id');
      if (tenant.scope === Scope.Team) {
        if (!tenant.teamIds.length) return qb.andWhere('1 = 0');
        qb.andWhere(`${teamColumn} IN (:...tenantTeamIds)`, {
          tenantTeamIds: tenant.teamIds,
        });
      }
      return qb;
    };

    const scopeBySample = <T extends SelectQueryBuilder<any>>(qb: T): T =>
      scopeToTenant(qb, 'sample.team');

    const scopeByVisit = <T extends SelectQueryBuilder<any>>(qb: T): T =>
      scopeToTenant(qb, 'visit.team');

    const toSiteIds = async (qb: SelectQueryBuilder<any>): Promise<string[]> =>
      (await qb.getRawMany())
        .map((row) => row.siteId)
        .filter((id): id is string => Boolean(id));

    // Sites touched by sample activity in the window: collected inside it, or
    // collected earlier but tested inside it.
    const sampleActiveSitesQuery = scopeBySample(
      this.sampleRepository
        .createQueryBuilder('sample')
        .leftJoin('sample.project', 'project')
        .leftJoin('sample.site', 'site')
        .leftJoin('sample.labTests', 'labTest')
        .select('site.id', 'siteId')
        .distinct(true)
        .where(
          new Brackets((qb) => {
            qb.where(
              'sample.collectionTime BETWEEN :startDate AND :endDate',
            ).orWhere('labTest.testedAt BETWEEN :startDate AND :endDate');
          }),
        ),
    ).setParameters(window);

    // Distinct sites with a visit actually completed in the window. isCompleted
    // matters because visitedAt survives a later status change.
    const visitedSitesQuery = scopeByVisit(
      this.dataSource
        .getRepository(Visit)
        .createQueryBuilder('visit')
        .leftJoin('visit.project', 'project')
        .leftJoin('visit.site', 'site')
        .select('site.id', 'siteId')
        .distinct(true)
        .where('visit.isCompleted = true')
        .andWhere('visit.visitedAt BETWEEN :startDate AND :endDate'),
    ).setParameters(window);

    // Positive sites, correlated through the sample that was actually tested.
    const positiveSitesQuery = scopeBySample(
      this.sampleRepository
        .createQueryBuilder('sample')
        .leftJoin('sample.project', 'project')
        .leftJoin('sample.site', 'site')
        .innerJoin('sample.labTests', 'labTest')
        .select('site.id', 'siteId')
        .distinct(true)
        .where('labTest.testResult = :positive')
        .andWhere('labTest.testedAt BETWEEN :startDate AND :endDate'),
    ).setParameters({ ...window, positive: TestResultType.POSITIVE });

    const samplesPresentQuery = scopeBySample(
      this.sampleRepository
        .createQueryBuilder('sample')
        .leftJoin('sample.project', 'project')
        .select('COUNT(DISTINCT sample.id)', 'count')
        .where('sample.collectionTime BETWEEN :startDate AND :endDate'),
    ).setParameters(window);

    // "Tested" means a conclusive result. The previous predicate was
    // `testResult != 'unclear'`, and since 'pending' != 'unclear' is TRUE in
    // SQL, samples still awaiting a result were counted as tested.
    const samplesTestedQuery = scopeBySample(
      this.sampleRepository
        .createQueryBuilder('sample')
        .leftJoin('sample.project', 'project')
        .innerJoin('sample.labTests', 'labTest')
        .select('COUNT(DISTINCT sample.id)', 'count')
        .where('labTest.testResult IN (:...conclusiveResults)')
        .andWhere('labTest.testedAt BETWEEN :startDate AND :endDate'),
    ).setParameters({
      ...window,
      conclusiveResults: [
        TestResultType.POSITIVE,
        TestResultType.NEGATIVE,
        TestResultType.UNCLEAR,
      ],
    });

    const [
      sampleActiveSiteIds,
      visitedSiteIds,
      positiveSiteIds,
      samplesPresentRaw,
      samplesTestedRaw,
    ] = await Promise.all([
      toSiteIds(sampleActiveSitesQuery),
      toSiteIds(visitedSitesQuery),
      toSiteIds(positiveSitesQuery),
      samplesPresentQuery.getRawOne(),
      samplesTestedQuery.getRawOne(),
    ]);

    // Denominator for both site tiles: every site with any activity in the
    // window, from either source.
    const activeSiteCount = new Set([...sampleActiveSiteIds, ...visitedSiteIds])
      .size;

    // Disease-wise sample stats for last 30 days
    const diseases = await this.diseaseRepository.find({
      where: { status: StatusType.ACTIVE },
    });
    const diseaseIds = diseases.map((d) => d.id);

    let diseaseStats: any[] = [];
    if (diseaseIds.length) {
      // Result buckets count by when the test ran, so a sample collected before
      // the window but tested inside it lands in the right bucket. The sample
      // status gate the previous version applied is redundant — having a lab
      // test with a given result in the window is the authoritative signal.
      const testedInWindow = (resultParam: string) =>
        `COUNT(DISTINCT CASE WHEN EXISTS (
            SELECT 1 FROM lab_tests lab
            WHERE lab."sampleId" = sample.id
              AND lab."testResult" = :${resultParam}
              AND lab."testedAt" BETWEEN :startDate AND :endDate
          ) THEN sample.id END)`;

      const sampleQuery = this.sampleRepository
        .createQueryBuilder('sample')
        .leftJoin('sample.diseases', 'disease')
        .leftJoin('sample.project', 'project')
        .select('disease.name', 'name')
        .addSelect(
          `COUNT(DISTINCT CASE
            WHEN sample.sampleStatus = :collectedStatus
             AND sample."collectionTime" BETWEEN :startDate AND :endDate
            THEN sample.id END)`,
          'totalCollected',
        )
        .addSelect(testedInWindow('unclearStatus'), 'totalUnclear')
        .addSelect(testedInWindow('negativeStatus'), 'totalNegative')
        .addSelect(testedInWindow('positiveStatus'), 'totalPositive')
        .where('disease.id IN (:...diseaseIds)', { diseaseIds })
        // Bounds the scan to rows that can contribute to a bucket above.
        // Logically a no-op given the CASE conditions.
        .andWhere(
          new Brackets((qb) => {
            qb.where('sample."collectionTime" BETWEEN :startDate AND :endDate')
              .orWhere(`EXISTS (
                SELECT 1 FROM lab_tests lab2
                WHERE lab2."sampleId" = sample.id
                  AND lab2."testedAt" BETWEEN :startDate AND :endDate
              )`);
          }),
        )
        .groupBy('disease.name');

      scopeBySample(sampleQuery);

      sampleQuery.setParameters({
        ...window,
        collectedStatus: SampleStatus.PICKED_UP,
        unclearStatus: TestResultType.UNCLEAR,
        positiveStatus: TestResultType.POSITIVE,
        negativeStatus: TestResultType.NEGATIVE,
      });

      diseaseStats = (await sampleQuery.getRawMany()).map((item) => ({
        name: item.name,
        totalCollected: Number(item.totalCollected || 0),
        totalUnclear: Number(item.totalUnclear || 0),
        totalPositive: Number(item.totalPositive || 0),
        totalNegative: Number(item.totalNegative || 0),
      }));
    }

    // Site details for last 30 days
    const siteDetailsQuery = this.sampleRepository
      .createQueryBuilder('sample')
      .leftJoin('sample.site', 'site')
      .leftJoin('site.project', 'project')
      .leftJoin('sample.diseases', 'disease')
      .leftJoin('sample.labTests', 'labtest')
      .select('site.id', 'siteId')
      .addSelect('site.name', 'siteName')
      .addSelect('project.name', 'projectName')
      .addSelect(
        `COUNT(DISTINCT CASE
          WHEN sample."collectionTime" BETWEEN :startDate AND :endDate
          THEN sample.id END)`,
        'samplesCollected',
      )
      .addSelect(
        `STRING_AGG(DISTINCT disease.name, ', ' ORDER BY disease.name)`,
        'diseases',
      )
      // Status reflects only tests run inside the window, so a site that was
      // positive months ago no longer reads Positive today.
      .addSelect(
        `CASE
          WHEN BOOL_OR(labtest."testResult" = :positive AND labtest."testedAt" BETWEEN :startDate AND :endDate) THEN 'Positive'
          WHEN BOOL_OR(labtest."testResult" = :unclear AND labtest."testedAt" BETWEEN :startDate AND :endDate) THEN 'Inconclusive'
          WHEN BOOL_OR(labtest."testResult" = :negative AND labtest."testedAt" BETWEEN :startDate AND :endDate) THEN 'Negative'
          ELSE 'Pending'
        END`,
        'status',
      )
      .where(
        new Brackets((qb) => {
          qb.where(
            'sample."collectionTime" BETWEEN :startDate AND :endDate',
          ).orWhere('labtest."testedAt" BETWEEN :startDate AND :endDate');
        }),
      )
      .groupBy('site.id')
      .addGroupBy('site.name')
      .addGroupBy('project.name')
      .orderBy('site.name')
      .setParameters({
        ...window,
        positive: TestResultType.POSITIVE,
        unclear: TestResultType.UNCLEAR,
        negative: TestResultType.NEGATIVE,
      });

    scopeBySample(siteDetailsQuery);

    const siteDetailsRaw = await siteDetailsQuery.getRawMany();

    const siteDetails = siteDetailsRaw.map((row) => ({
      siteName: row.siteName || '-',
      projectName: row.projectName || '-',
      samplesCollected: Number(row.samplesCollected || 0),
      diseases: row.diseases || '-',
      status: row.status || 'Pending',
    }));

    return {
      sites: {
        totalPresent: activeSiteCount,
        totalPositive: positiveSiteIds.length,
      },
      visits: {
        totalPresent: activeSiteCount,
        totalVisited: visitedSiteIds.length,
      },
      samples: {
        totalPresent: Number(samplesPresentRaw?.count) || 0,
        totalTested: Number(samplesTestedRaw?.count) || 0,
      },
      diseaseStats,
      siteDetails,
    };
  }
}
