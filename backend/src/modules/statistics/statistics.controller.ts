import {
  Controller,
  Get,
  Query,
  Req,
  Res,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AppAbility } from 'src/common/casl/abitlity.factory';
import { CheckPolicies } from 'src/common/decorators/check-policy.decorator';
import { DiseaseStatsResponse } from 'src/common/dto/response/disease.response';
import {
  SampleBreakDownResponse,
  SampleStatLogisticResponse,
} from 'src/common/dto/response/sample.response';
import {
  ExploreSitesResponse,
  GetSiteOnDiseaseResponse,
  MostPositiveSiteResponse,
} from 'src/common/dto/response/site.response';
import {
  MonitorDashboardResponse,
  PaginatedProjectDiseaseStatsResponse,
} from 'src/common/dto/response/statastics.response';
import { ServiceScoped } from 'src/common/decorators/tenant-scope.decorator';
import { Action } from 'src/common/enums/action.enum';
import { PoliciesGuard } from 'src/common/guards/casl-policies.guard';
import { DiseaseService } from '../disease/disease.service';
import { SamplesService } from '../samples/samples.service';
import { SitesService } from '../sites/sites.service';
import { StatisticsService } from './statistics.service';

@ApiBearerAuth()
@UseGuards(PoliciesGuard)
@Controller('statistics')
// None of these routes carry a :projectId or :workspaceId - every one of
// them serves tenant-owned data scoped by the caller's own memberships,
// resolved service-side via resolveTenantScope() (see tenant-scope.ts and
// statistics.service.ts / disease.service.ts). The ability layer can't help
// here, so this is what stands between an authenticated user and every
// other tenant's data.
@ServiceScoped(
  'caller-membership filtered via resolveTenantScope in the underlying services',
)
export class StatisticsController {
  constructor(
    private readonly statisticsService: StatisticsService,
    private readonly siteService: SitesService,
    private readonly sampleService: SamplesService,
    private readonly diseaseService: DiseaseService,
  ) {}

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'site'))
  @SerializeOptions({
    type: GetSiteOnDiseaseResponse,
    exposeDefaultValues: true,
  })
  @Get('weekly-update')
  async getSiteOnDisease(@Req() req): Promise<GetSiteOnDiseaseResponse> {
    const { user } = req;
    const query = {
      ...req.query,
    };

    const site = await this.siteService.getSiteOnDisease(query, user);
    return {
      success: true,
      message: 'Sites statistics fetched successfully',
      data: site,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'sample'))
  @SerializeOptions({
    type: SampleStatLogisticResponse,
    exposeDefaultValues: true,
  })
  @Get('disease-wise-sample-stat')
  @ApiQuery({
    name: 'diseaseId',
    required: false,
    type: String,
    example: 'disease UUID',
  })
  async getSampleStatLogistics(
    @Req() req,
  ): Promise<SampleStatLogisticResponse> {
    const { user } = req;
    const sample = await this.sampleService.getSampleStatLogistics(
      req.query,
      user,
    );
    return {
      success: true,
      message: 'Samples fetched successfully',
      data: sample,
    };
  }

  @SerializeOptions({
    type: SampleBreakDownResponse,
    exposeDefaultValues: true,
  })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'sample'))
  @Get('site-wise-samples-breakdown')
  @ApiQuery({
    name: 'disease',
    required: false,
    type: String,
    example: 'disease UUID',
  })
  @ApiQuery({
    name: 'region',
    required: false,
    type: String,
    example: 'district_501',
  })
  async sieWiseSampleBreakDown(
    @Query() query,
    @Req() req,
  ): Promise<SampleBreakDownResponse> {
    const { user } = req;
    const sample = await this.sampleService.sampleBreakDown(query, user);
    return {
      success: true,
      message: 'Samples breakdown fetched successfully',
      data: sample,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'site'))
  @SerializeOptions({
    type: ExploreSitesResponse,
    exposeDefaultValues: true,
  })
  @ApiQuery({ name: 'regionId', required: false, type: String, example: '123' })
  @ApiQuery({
    name: 'disease',
    required: false,
    type: String,
    example: 'Foot & Mouth Disease',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    example: '2024-12-31',
  })
  @ApiQuery({
    name: 'surveillanceType',
    required: false,
    type: String,
    example: 'Active Surveillance',
  })
  @ApiQuery({ name: 'siteId', required: false, type: String })
  @ApiQuery({ name: 'sampleTypeId', required: false, type: String })
  @ApiQuery({ name: 'testResult', required: false, type: String })
  @ApiQuery({ name: 'variant', required: false, type: String })
  @ApiQuery({ name: 'projectId', required: false, type: String })
  @ApiQuery({ name: 'workspaceId', required: false, type: String })
  @ApiQuery({
    name: 'period',
    required: false,
    enum: ['overall', 'year', 'month'],
    description:
      'Time window on sample collection date. Defaults to overall (all data). year needs `year`; month needs `year` and `month`.',
  })
  @ApiQuery({ name: 'year', required: false, type: Number, example: 2025 })
  @ApiQuery({
    name: 'month',
    required: false,
    type: Number,
    example: 6,
    description: '1-12',
  })
  @Get('explore-sites')
  async exploreSites(@Req() req): Promise<ExploreSitesResponse> {
    const { user } = req;
    const query = {
      ...req.query,
    };
    const site = await this.siteService.exploreSites({ ...query, user });
    return {
      success: true,
      message: 'Sites statistics fetched successfully',
      data: site as unknown as ExploreSitesResponse['data'],
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'site'))
  @SerializeOptions({
    type: MostPositiveSiteResponse,
    exposeDefaultValues: true,
  })
  @ApiQuery({
    name: 'diseaseId',
    required: false,
    type: String,
    example: '1234567',
    isArray: true,
  })
  @ApiQuery({
    name: 'startDate',
    required: true,
    type: String,
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    type: String,
    example: '2024-12-31',
  })
  @Get('most-positive-sites')
  async getMostPositive(@Req() req): Promise<MostPositiveSiteResponse> {
    const { user } = req;
    const query = {
      ...req.query,
    };

    const site = await this.siteService.getMostPositive(query, user);
    return {
      success: true,
      message: 'Sites statistics fetched successfully',
      data: site,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'sample'))
  @Get('disease-wise-positive-samples')
  @SerializeOptions({
    type: DiseaseStatsResponse,
    exposeDefaultValues: true,
  })
  async getDiseaseWiseSample(@Req() req): Promise<DiseaseStatsResponse> {
    const { user } = req;
    const { startDate, endDate } = req.query;
    const disease = await this.diseaseService.getDiseaseWiseSample(
      user,
      startDate,
      endDate,
    );
    return {
      success: true,
      message: 'Disease wise samples statistics fetched successfully',
      data: disease,
    };
  }

  @SerializeOptions({
    type: SampleBreakDownResponse,
    exposeDefaultValues: true,
  })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'sample'))
  @Get('site-wise-samples-breakdown/download-csv')
  @ApiQuery({
    name: 'disease',
    required: false,
    type: String,
    example: 'disease UUID',
  })
  @ApiQuery({
    name: 'region',
    required: false,
    type: String,
    example: 'district_501',
  })
  async exportSieWiseSampleBreakDown(
    @Query() query,
    @Req() req,
    @Res() res,
  ): Promise<SampleBreakDownResponse> {
    const { user } = req;
    const sample = await this.sampleService.sampleBreakDown(query, user);
    console.log([sample[0]]);
    const csv = await this.sampleService.generateCsv(sample);

    this.sampleService.sendCsv(res, csv, 'site-wise-samples-breakdown.csv');

    return {
      success: true,
      message: 'Samples breakdown fetched successfully',
      data: sample,
    };
  }
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'sample'))
  @Get('projects')
  @SerializeOptions({
    type: PaginatedProjectDiseaseStatsResponse,
    exposeDefaultValues: true,
  })
  async getProjectStats(
    @Req() req,
  ): Promise<PaginatedProjectDiseaseStatsResponse> {
    const { user } = req;
    const disease =
      await this.statisticsService.getDiseaseWiseSampleStatsByProject(
        req.query,
        user,
      );
    return {
      success: true,
      message: 'Disease wise samples statistics fetched successfully',
      data: disease.docs,
      total: disease.total,
      page: disease.page,
      limit: disease.limit,
      totalPages: disease.totalPages,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'sample'))
  @SerializeOptions({
    type: MonitorDashboardResponse,
    exposeDefaultValues: true,
  })
  @ApiQuery({ name: 'diseaseId', required: false, type: String, isArray: true })
  @ApiQuery({ name: 'siteId', required: false, type: String, isArray: true })
  @ApiQuery({
    name: 'sampleTypeId',
    required: false,
    type: String,
    isArray: true,
  })
  @ApiQuery({
    name: 'testResult',
    required: false,
    type: String,
    isArray: true,
  })
  @ApiQuery({ name: 'variant', required: false, type: String, isArray: true })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiQuery({ name: 'stateId', required: false, type: String, isArray: true })
  @ApiQuery({
    name: 'districtId',
    required: false,
    type: String,
    isArray: true,
  })
  @ApiQuery({
    name: 'subdistrictId',
    required: false,
    type: String,
    isArray: true,
  })
  @Get('monitor-dashboard')
  async getMonitorDashboardStats(
    @Req() req,
  ): Promise<MonitorDashboardResponse> {
    console.log('Monitor Dashboard Query:', req.query);
    const { user } = req;
    const data = await this.statisticsService.getMonitorDashboardStats(
      req.query,
      user,
    );

    return {
      success: true,
      message: 'Monitor dashboard statistics fetched successfully',
      data,
    };
  }
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'sample'))
  @Get('site-wise-analysis')
  async getSiteWiseAnalysis(@Req() req): Promise<any> {
    const { user } = req;
    return await this.statisticsService.getSiteWiseAnalysis(req.query, user);
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'sample'))
  @Get('disease-wise-analysis')
  async getDiseaseWiseAnalysis(@Req() req): Promise<any> {
    const { user } = req;
    return await this.statisticsService.getDiseaseWiseAnalysis(req.query, user);
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'sample'))
  @Get('sample-wise-analysis')
  async getSampleWiseAnalysis(@Req() req): Promise<any> {
    const { user } = req;
    return await this.statisticsService.getSampleWiseAnalysis(req.query, user);
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'sample'))
  @ApiQuery({ name: 'projectId', required: false, type: String })
  @ApiQuery({ name: 'workspaceId', required: false, type: String })
  @Get('home-last-30-days')
  async getHomeLast30Days(@Req() req): Promise<any> {
    const { user } = req;
    const data = await this.statisticsService.getHomeLast30Days(
      req.query,
      user,
    );
    return {
      success: true,
      message: 'Home last 30 days data fetched successfully',
      data,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'sample'))
  @Get('project-sample-types')
  async getProjectSampleTypes(@Req() req): Promise<any> {
    const { user } = req;
    return await this.statisticsService.getProjectSampleTypes(user);
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'sample'))
  @ApiQuery({ name: 'projectId', required: false, type: String, isArray: true })
  @ApiQuery({ name: 'diseaseId', required: false, type: String, isArray: true })
  @ApiQuery({ name: 'siteId', required: false, type: String, isArray: true })
  @ApiQuery({
    name: 'sampleTypeId',
    required: false,
    type: String,
    isArray: true,
  })
  @ApiQuery({
    name: 'testResult',
    required: false,
    type: String,
    isArray: true,
  })
  @ApiQuery({ name: 'variant', required: false, type: String, isArray: true })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiQuery({ name: 'stateId', required: false, type: String, isArray: true })
  @ApiQuery({
    name: 'districtId',
    required: false,
    type: String,
    isArray: true,
  })
  @ApiQuery({
    name: 'subdistrictId',
    required: false,
    type: String,
    isArray: true,
  })
  @Get('project-comparison')
  async getProjectComparison(@Req() req): Promise<any> {
    const { user } = req;
    const data = await this.statisticsService.getProjectComparison(
      req.query,
      user,
    );
    return {
      success: true,
      message: 'Project comparison statistics fetched successfully',
      data,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'sample'))
  @ApiQuery({ name: 'projectId', required: false, type: String })
  @ApiQuery({ name: 'site1Id', required: true, type: String })
  @ApiQuery({ name: 'site2Id', required: true, type: String })
  @ApiQuery({
    name: 'sampleTypeId',
    required: false,
    type: String,
    isArray: true,
  })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @Get('site-comparison')
  async getSiteComparison(@Req() req): Promise<any> {
    const { user } = req;
    const data = await this.statisticsService.getSiteComparison(
      req.query,
      user,
    );
    return {
      success: true,
      message: 'Site comparison statistics fetched successfully',
      data,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'sample'))
  @ApiQuery({ name: 'projectId', required: false, type: String })
  @ApiQuery({ name: 'sampleType1Id', required: true, type: String })
  @ApiQuery({ name: 'sampleType2Id', required: true, type: String })
  @ApiQuery({ name: 'siteId', required: false, type: String, isArray: true })
  @ApiQuery({ name: 'stateId', required: false, type: String, isArray: true })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @Get('sample-type-comparison')
  async getSampleTypeComparison(@Req() req): Promise<any> {
    const { user } = req;
    const data = await this.statisticsService.getSampleTypeComparison(
      req.query,
      user,
    );
    return {
      success: true,
      message: 'Sample type comparison statistics fetched successfully',
      data,
    };
  }
}
