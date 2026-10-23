import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { DateTime } from 'luxon';
import { AppAbility } from 'src/common/casl/abitlity.factory';
import { CheckPolicies } from 'src/common/decorators/check-policy.decorator';
import {
  ServiceScoped,
  TenantAgnostic,
} from 'src/common/decorators/tenant-scope.decorator';
import {
  LabTestResponse,
  ListLabTestResponse,
} from 'src/common/dto/response/lab-test.response';
import {
  PaginatedSampleResponse,
  SampleResponse,
  SampleStatLogisticResponse,
} from 'src/common/dto/response/sample.response';
import {
  ListNearbySiteResponse,
  ListSiteResponse,
  SiteResponse,
} from 'src/common/dto/response/site.response';
import {
  ListAvailableRoleResponse,
  ListTeamMemberResponse,
  TeamMemberListResponse,
  TeamMemberResponse,
} from 'src/common/dto/response/team-member.response';
import {
  ListTeamResponse,
  PaginatedTeamMemberActivityResponse,
  PaginatedTeamMemberProgressResponse,
  PaginatedTeamMemberResponse,
  PaginatedTeamProgressResponse,
  RemovedTeamMemberResponse,
  TeamActivityProgressResponse,
  TeamMemberActivityResponse,
  TeamProgressActivityOverviewResponse,
  TeamResponse,
} from 'src/common/dto/response/team.response';
import {
  PaginatedVisitResponse,
  SubmitVisitResponse,
  ValidateBarcodeMessage,
  VisitResponse,
  VisitSummaryResponse,
} from 'src/common/dto/response/visit.response';
import { Action } from 'src/common/enums/action.enum';
import { PoliciesGuard } from 'src/common/guards/casl-policies.guard';
import { CommonResponse } from 'src/common/types/common-response.type';
import { CreateCollectionPlanObj } from 'src/common/types/create-collectionplan-obj.type';
import { CreateSiteObj } from 'src/common/types/create-site-obj.type';
import { Role } from 'src/entities/role.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import {
  PaginatedProjectResponse,
  ProjectCollectorsResponse,
  ProjectResponse,
  ProjectResponseDataExtended,
  ProjectStatisticByDiseaseResponse,
  ProjectStatisticBySiteResponse,
} from '../../common/dto/response/project.response';
import { CreateMultipleLabTestDto } from '../lab-tests/dto/create-lab-test.dto';
import { UpdateMultipleLabTestDto } from '../lab-tests/dto/update-lab-test.dto';
import { LabTestsService } from '../lab-tests/lab-tests.service';
import { CreateSampleDto } from '../samples/dto/create-sample.dto';
import { UpdateCollectedSampleDetailsDto } from '../samples/dto/update-collected-sample-details.dto';
import { UpdateSampleDto } from '../samples/dto/update-sample.dto';
import { UpdateSampleStageDetailsDto } from '../samples/dto/update-sample-stage-details.dto';
import { SamplesService } from '../samples/samples.service';
import { calculateExpiryDateFlexible } from '../sites/calExpiryDate';
import { calculateStartDate } from '../sites/calStartDate';
import { CreateSiteDto } from '../sites/dto/create-site.dto';
import { UpdateSiteDto } from '../sites/dto/update-site.dto';
import { SitesService } from '../sites/sites.service';
import { CreateMembersListDto } from '../teams/dto/create-list-member.dto';
import { CreateMemberDto } from '../teams/dto/create-member.dto';
import { CreateTeamDto } from '../teams/dto/create-team.dto';
import { TeamMemberRemoveDto } from '../teams/dto/list-member-ids.dto';
import { UpdateMemberDto } from '../teams/dto/update-member.dto';
import { UpdateTeamDto } from '../teams/dto/update-team.dto';
import { TeamsService } from '../teams/teams.service';
import { CreateVisitDto } from '../visits/dto/create-visit.dto';
import { RescheduleVisitDto } from '../visits/dto/reschedule-visit.dto';
import { SubmitVisitDto } from '../visits/dto/submit-visit.dto';
import { UpdateVisitDto } from '../visits/dto/update-visit.dto';
import { VisitService } from '../visits/visits.service';
import { CreateProjectDto } from './dto/create-project.dto';
import {
  ProjectStatisticsResponse,
  SampleScriptResponseData,
  ProjectDetailsResponse,
} from './dto/response.dto';
import { ProjectDetailsRequestDto } from './dto/project-details.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { StructuredSiteDto } from './dto/upload-sample-data.dto';
import { ProjectsService } from './projects.service';

@ApiBearerAuth()
@UseGuards(PoliciesGuard)
@Controller('projects')
export class ProjectsController {
  private readonly logger = new Logger(ProjectsController.name);

  constructor(
    private readonly projectsService: ProjectsService,
    private readonly siteService: SitesService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly visitService: VisitService,
    private readonly sampleService: SamplesService,
    private readonly teamsService: TeamsService,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly labTestsService: LabTestsService,
    private readonly samplesService: SamplesService,
  ) {}

  // ***************** Project Apis ***************** //
  @ServiceScoped(
    'create() requires workspaceId and validates it via ' +
      'TenantScopeService.administersWorkspace() — System scope or an ' +
      'admin-conferring role on that workspace only — see projects.service.ts#create',
  )
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, 'project'))
  @SerializeOptions({
    type: ProjectResponse,
    exposeDefaultValues: true,
  })
  @Post()
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Req() req,
  ): Promise<ProjectResponse> {
    const { user } = req;
    const project = await this.projectsService.create({
      ...createProjectDto,
      invitedBy: user,
    });

    return {
      success: true,
      message: 'Project created successfully',
      data: project,
    };
  }

  @ServiceScoped(
    'projectStatistics resolves the caller scope (System/Workspace/Project/Team) ' +
      'from their roles and, for a supplied workspaceId, narrows to workspaces ' +
      'the caller actually administers — see projects.service.ts#projectStatistics',
  )
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'project'))
  @Get('statistics')
  @SerializeOptions({
    type: ProjectStatisticsResponse,
    exposeDefaultValues: true,
  })
  @ApiQuery({
    name: 'workspaceId',
    required: false,
    type: String,
    example: 'workspace UUID',
  })
  async statistics(@Req() req): Promise<ProjectStatisticsResponse> {
    const { user } = req;
    const statistics = await this.projectsService.projectStatistics(
      user,
      req.query?.workspaceId,
    );
    return {
      success: true,
      message: 'Project statistics fetched successfully',
      data: statistics,
    };
  }

  @ServiceScoped(
    "exportProjects shares findAll()'s tenant resolution (System/Workspace/" +
      'Project scoping, fails closed to 1=0 when the caller reaches no ' +
      'project) — see projects.service.ts#findAll',
  )
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'project'))
  @Get('download-csv')
  @ApiQuery({
    name: 'disease',
    required: false,
    type: String,
    example: 'disease UUID',
  })
  async exportProjects(@Req() req, @Res() res: Response): Promise<void> {
    const { user } = req;
    const filterQuery: any = {
      ...req.query,
    };

    const projects = await this.projectsService.findAll(filterQuery, user);

    const csv = await this.projectsService.generateCsv(projects.docs);

    this.projectsService.sendCsv(res, csv, 'projects.csv');
  }

  @ServiceScoped(
    "findAll() resolves System/Workspace/Project scope from the caller's " +
      'roles; a client-supplied workspaceId is validated against ' +
      'memberWorkspaceIds before use, and a caller reaching no project gets ' +
      '1=0, never an unfiltered query — see projects.service.ts#findAll',
  )
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'project'))
  @Get()
  @SerializeOptions({
    type: PaginatedProjectResponse,
    exposeDefaultValues: true,
  })
  @ApiQuery({
    name: 'disease',
    required: false,
    type: String,
    example: 'disease UUID',
  })
  async findAll(@Req() req): Promise<PaginatedProjectResponse> {
    const { user } = req;
    const filterQuery: any = {
      ...req.query,
    };

    const project = await this.projectsService.findAll(filterQuery, user);
    return {
      success: true,
      message: 'Projects fetched successfully',
      data: project.docs as unknown as ProjectResponseDataExtended[],
      limit: project.limit,
      total: project.total,
      totalPages: project.totalPages,
      page: project.page,
    };
  }

  @ServiceScoped(
    "getProjectDetails resolves the caller's reachable projects via " +
      'TenantScopeService.canReachProject and 403s on any requested ' +
      'projectId outside that set — see projects.service.ts#getProjectDetails',
  )
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'project'))
  @Post('details')
  @ApiBody({ type: ProjectDetailsRequestDto })
  @ApiQuery({
    name: 'responseType',
    required: false,
    enum: ['json', 'csv'],
  })
  @SerializeOptions({
    type: ProjectDetailsResponse,
    exposeDefaultValues: true,
  })
  async getProjectDetails(
    @Body() body: ProjectDetailsRequestDto,
    @Query('responseType') responseType: string,
    @Res({ passthrough: true }) res: Response,
    @Req() req,
  ): Promise<ProjectDetailsResponse | void> {
    if (!body.projectId?.length) {
      throw new HttpException('projectId is required', HttpStatus.BAD_REQUEST);
    }
    const data = await this.projectsService.getProjectDetails(
      body.projectId,
      req.user,
    );
    if (responseType?.toLowerCase() === 'csv') {
      const csv = this.projectsService.generateProjectDetailsCsv(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="project-details.csv"',
      );
      res.send(csv);
      return;
    }
    return {
      success: true,
      message: 'Project data fetched successfully',
      data,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'project'))
  @Get(':projectId/team-progress')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @ApiQuery({
    name: 'sort',
    type: String,
    required: false,
    description: 'Sort field',
  })
  @ApiQuery({
    name: 'sortOrder',
    type: String,
    required: false,
    description: 'asc or desc',
  })
  @SerializeOptions({
    type: PaginatedTeamProgressResponse,
    exposeDefaultValues: true,
  })
  async getProjectTeamProgress(
    @Param('projectId') projectId: string,
    @Query() query,
  ): Promise<PaginatedTeamProgressResponse> {
    const teamProgress = await this.projectsService.teamProgress({
      ...query,
      projectId,
    });
    return {
      success: true,
      message: 'Team progress fetched successfully',
      data: teamProgress.docs,
      limit: teamProgress.limit,
      total: teamProgress.total,
      totalPages: teamProgress.totalPages,
      page: teamProgress.page,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'project'))
  @Get(':projectId/team-activity-progress')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @SerializeOptions({
    type: TeamActivityProgressResponse,
    exposeDefaultValues: true,
  })
  async getProjectTeamActivityProgress(
    @Param('projectId') id: string,
  ): Promise<TeamActivityProgressResponse> {
    const disease = await this.projectsService.teamActivityProgress(id);
    return {
      success: true,
      message: 'Team activity progress fetched successfully',
      data: disease,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'project'))
  @Get(':projectId/team-member-activity')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @ApiQuery({
    name: 'diseaseId',
    required: false,
    type: String,
    example: 'Disease ID',
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
    name: 'sort',
    type: String,
    required: false,
    description: 'Sort field',
  })
  @ApiQuery({
    name: 'sortOrder',
    type: String,
    required: false,
    description: 'asc or desc',
  })
  @SerializeOptions({
    type: PaginatedTeamMemberActivityResponse,
    exposeDefaultValues: true,
  })
  async getProjectTeamMemberActivity(
    @Param('projectId') projectId: string,
    @Query() query,
  ): Promise<PaginatedTeamMemberActivityResponse> {
    const teamMemberActivity = await this.projectsService.teamMemberActivity({
      ...query,
      projectId,
    });
    return {
      success: true,
      message: 'Team members activity fetched successfully',
      data: teamMemberActivity.docs,
      limit: teamMemberActivity.limit,
      total: teamMemberActivity.total,
      totalPages: teamMemberActivity.totalPages,
      page: teamMemberActivity.page,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'project'))
  @Get(':projectId/team-member-activity/download-csv')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @ApiQuery({
    name: 'diseaseId',
    required: false,
    type: String,
    example: 'Disease ID',
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
    name: 'sort',
    type: String,
    required: false,
    description: 'Sort field',
  })
  @ApiQuery({
    name: 'sortOrder',
    type: String,
    required: false,
    description: 'asc or desc',
  })
  async getProjectTeamMemberActivityExport(
    @Param('projectId') projectId: string,
    @Query() query,
    @Res() res: Response,
  ): Promise<void> {
    const teamMemberActivity = await this.projectsService.teamMemberActivity({
      ...query,
      isDownload: true,
      projectId,
    });
    const csv = await this.projectsService.generateTeamMemberActivityCsv(
      teamMemberActivity.docs,
    );

    this.projectsService.sendCsv(res, csv, 'team-member-activity.csv');
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'project'))
  @Get(':projectId/team-member-progress')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @ApiQuery({
    name: 'diseaseId',
    required: false,
    type: String,
    example: 'Disease ID',
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
    name: 'sort',
    type: String,
    required: false,
    description: 'Sort field',
  })
  @ApiQuery({
    name: 'sortOrder',
    type: String,
    required: false,
    description: 'asc or desc',
  })
  @SerializeOptions({
    type: PaginatedTeamMemberProgressResponse,
    exposeDefaultValues: true,
  })
  async getProjectTeamMemberProgress(
    @Param('projectId') projectId: string,
    @Query() query,
  ): Promise<PaginatedTeamMemberProgressResponse> {
    const result = await this.projectsService.teamMemberProgress({
      ...query,
      projectId,
    });
    return {
      success: true,
      message: 'Team member progress fetched successfully',
      data: result.docs,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
      page: result.page,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'project'))
  @Get(':projectId/team-member-progress/download-csv')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @ApiQuery({
    name: 'diseaseId',
    required: false,
    type: String,
    example: 'Disease ID',
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
  async getProjectTeamMemberProgressExport(
    @Param('projectId') projectId: string,
    @Query() query,
    @Res() res: Response,
  ): Promise<void> {
    const result = await this.projectsService.teamMemberProgress({
      ...query,
      isDownload: true,
      projectId,
    });
    const csv = await this.projectsService.generateTeamMemberProgressCsv(
      result.docs,
    );
    this.projectsService.sendCsv(res, csv, 'team-member-progress.csv');
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'project'))
  @Get(':projectId/sites-statistics-by-diseases')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @SerializeOptions({
    type: ProjectStatisticByDiseaseResponse,
    exposeDefaultValues: true,
  })
  async findAllSites(
    @Param('projectId') id: string,
  ): Promise<ProjectStatisticByDiseaseResponse> {
    const disease = await this.projectsService.getDiseaseSiteCounts(id);
    return {
      success: true,
      message: 'Diseases fetched successfully',
      data: disease,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'project'))
  @Get(':projectId/sites-statistics-by-status')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @SerializeOptions({
    type: ProjectStatisticBySiteResponse,
    exposeDefaultValues: true,
  })
  async getSitesStatisticsByStatus(
    @Param('projectId') projectId: string,
    @Query('disease') diseaseId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<ProjectStatisticBySiteResponse> {
    const siteStats = await this.projectsService.getSitesStatisticsByStatus(
      projectId,
      diseaseId,
      startDate,
      endDate,
    );
    return {
      success: true,
      message: 'Diseases fetched successfully',
      data: siteStats,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'project'))
  @SerializeOptions({
    type: ProjectCollectorsResponse,
    exposeDefaultValues: true,
  })
  @Get(':projectId/collectors')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  async getMembers(
    @Req() req,
    @Param('projectId') projectId: string,
  ): Promise<ProjectCollectorsResponse> {
    try {
      const members = await this.projectsService.getMembers(
        projectId,
        req.user,
      );
      return {
        success: true,
        message: 'collectors list fetched successfully',
        data: members,
      };
    } catch (error) {
      throw error;
    }
  }

  @ServiceScoped(
    'getProjectTeamUsers resolves System/Workspace/Project scope from the ' +
      "caller's roles, validates any client-supplied projectId/workspaceId " +
      'against that set, and fails closed to an empty list otherwise — see ' +
      'projects.service.ts#getProjectTeamUsers',
  )
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'project'))
  @Get('team-users')
  async getProjectTeamUsers(
    @Req() req,
    @Query('projectId') projectId?: string,
    @Query('workspaceId') workspaceId?: string,
  ): Promise<CommonResponse<any>> {
    const data = await this.projectsService.getProjectTeamUsers(
      req.user,
      projectId,
      workspaceId,
    );

    return {
      success: true,
      message: 'Project users fetched successfully',
      data,
    };
  }

  @TenantAgnostic()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'team'))
  @Get('team-users/roles')
  async getProjectTeamUserRoles(): Promise<CommonResponse<any>> {
    const roles = await this.roleRepository.find({
      where: { status: 'active' as any },
      order: { name: 'ASC' },
    });

    return {
      success: true,
      message: 'Assignable roles fetched successfully',
      data: roles.filter((role) => role.name !== 'super-admin'),
    };
  }

  @ServiceScoped(
    'updateProjectTeamUserRole takes projectId/teamId from the body (no route ' +
      'param); the service verifies the caller administers that project/workspace ' +
      'and that the target member actually belongs to that team+project before ' +
      'writing — see projects.service.ts#updateProjectTeamUserRole',
  )
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, 'team-member'),
  )
  @Patch('team-users/:memberId/role')
  async updateProjectTeamUserRole(
    @Req() req,
    @Param('memberId') memberId: string,
    @Body() body: { roleId: string; projectId: string; teamId: string },
  ): Promise<CommonResponse<any>> {
    const data = await this.projectsService.updateProjectTeamUserRole(
      req.user,
      memberId,
      body,
    );

    return {
      success: true,
      message: 'User role updated successfully',
      data,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'project'))
  @Get(':projectId')
  @ApiParam({ name: 'projectId', type: String, description: 'Site UUID' })
  @SerializeOptions({
    type: ProjectResponse,
    exposeDefaultValues: true,
  })
  async findOne(
    @Req() req,
    @Param('projectId') id: string,
  ): Promise<ProjectResponse> {
    console.log('id', id);
    const project = await this.projectsService.findOne({ id }, req.user);
    return {
      success: true,
      message: 'Project fetched successfully',
      data: project,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'project'))
  // @Get(':projectId/site')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @SerializeOptions({
    type: ProjectResponse,
    exposeDefaultValues: true,
  })
  async findOneSiteList(@Param('id') id: string): Promise<ProjectResponse> {
    const project = await this.projectsService.findOne({ id });
    return {
      success: true,
      message: 'Project fetched successfully',
      data: project,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, 'project'))
  @Patch(':projectId')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @SerializeOptions({
    type: ProjectResponse,
    exposeDefaultValues: true,
  })
  async update(
    @Req() req,
    @Param('projectId') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponse> {
    const { user } = req;
    const project = await this.projectsService.update(id, {
      ...updateProjectDto,
      user: user.id,
    });
    return {
      success: true,
      message: 'Project updated successfully',
      data: project,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, 'project'))
  // @Delete(':projectId')
  async remove(@Param('id') id: string): Promise<CommonResponse<any>> {
    const project = await this.projectsService.remove(id);
    return {
      success: true,
      message: 'Project deleted successfully',
      data: project,
    };
  }

  // ****************************** Sites apis ************************** //

  @ApiOperation({ summary: 'Create Site' })
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, 'site'))
  @SerializeOptions({
    type: SiteResponse,
    exposeDefaultValues: true,
  })
  @Post(':projectId/sites')
  async createSite(
    @Param('projectId') project: string,
    @Body() createSiteDto: CreateSiteDto,
    @Req() req,
  ): Promise<SiteResponse> {
    try {
      const { user } = req;
      const {
        photos,
        collectionCollector,
        collectionTime,
        diseaseIds,
        ...createSiteObj
      } = createSiteDto;

      createSiteObj.project = project;

      const collectionObj: CreateCollectionPlanObj = {
        collectionCollector: null,
        collectionStartDate: null,
        collectionExpiryDate: null,
        collectionTime: collectionTime || null,
      };

      const projectData = await this.projectsService.findOne(
        { id: project },
        user,
      );
      if (!projectData) {
        throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
      }

      let diseasesData = projectData.diseases;
      if (!diseasesData) {
        throw new HttpException('Disease not found', HttpStatus.NOT_FOUND);
      }

      if (diseaseIds && Array.isArray(diseaseIds) && diseaseIds.length > 0) {
        diseasesData = diseasesData.filter((d) => diseaseIds.includes(d.id));
      }

      let collector = null;
      if (collectionCollector) {
        collector = await this.userRepository.findOne({
          where: { id: collectionCollector },
        });
        collectionObj.collectionCollector = collector;
      }

      if (collectionCollector && !collector) {
        throw new HttpException('Collector not found', HttpStatus.NOT_FOUND);
      }

      let createdBy: User = null;
      if (user && user.id) {
        createdBy = await this.userRepository.findOne({
          where: { id: user.id },
        });
        if (!createdBy) {
          throw new HttpException(
            `User not found for userid ${user.id}`,
            HttpStatus.NOT_FOUND,
          );
        }
      }

      // Use user-provided collectionStartDate if present, otherwise calculate it
      if (createSiteObj.collectionStartDate) {
        // User provided a start date from the frontend (YYYY-MM-DD or ISO string)
        // Parse as UTC midnight to ensure consistent date handling across timezones
        const parsedDate = DateTime.fromISO(
          createSiteObj.collectionStartDate instanceof Date
            ? createSiteObj.collectionStartDate.toISOString()
            : (createSiteObj.collectionStartDate as unknown as string),
          {
            zone: 'utc',
          },
        );
        if (!parsedDate.isValid) {
          throw new BadRequestException(
            `Invalid collectionStartDate: ${createSiteObj.collectionStartDate}`,
          );
        }
        collectionObj.collectionStartDate = parsedDate
          .startOf('day')
          .toFormat('yyyy-MM-dd HH:mm:ss') as unknown as Date;
      } else if (collectionTime && createSiteObj.collectionDayOfWeek) {
        // Fallback: calculate start date if not provided
        collectionObj.collectionStartDate = calculateStartDate(
          createSiteObj.collectionDayOfWeek,
          collectionObj.collectionTime,
        );
        collectionObj.collectionStartDate = DateTime.fromJSDate(
          collectionObj.collectionStartDate,
        ).toFormat('yyyy-MM-dd HH:mm:ss') as unknown as Date;
      }
      if (createSiteObj.collectionDuration) {
        collectionObj.collectionExpiryDate = calculateExpiryDateFlexible(
          createSiteObj.collectionDuration,
          collectionObj.collectionTime,
          collectionObj.collectionStartDate,
        );
        collectionObj.collectionExpiryDate = DateTime.fromJSDate(
          collectionObj.collectionExpiryDate,
        ).toFormat('yyyy-MM-dd HH:mm:ss') as unknown as Date;
      }

      const site = await this.siteService.create(
        { ...createSiteObj } as CreateSiteObj,
        projectData,
        diseasesData,
        collectionObj,
        createdBy,
        photos,
      );

      const signedUrls = await this.siteService.getSignedUrlForSingleSite(site);
      site.photos = signedUrls;

      return {
        success: true,
        message: 'Site created successfully',
        data: site,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'An error occurred while creating the site',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'site'))
  @SerializeOptions({
    type: ListSiteResponse,
    exposeDefaultValues: true,
  })
  @ApiQuery({ name: 'project', required: false, type: String, example: '123' })
  @ApiQuery({
    name: 'testResult',
    required: false,
    type: String,
    example: 'positive',
  })
  @ApiQuery({ name: 'disease', required: false, type: String, example: '1' })
  @ApiQuery({
    name: 'siteType',
    required: false,
    type: String,
    example: 'private',
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
    name: 'filterBy',
    required: false,
    type: String,
    example: 'newest',
  })
  @ApiQuery({
    name: 'farmType',
    required: false,
    type: String,
    example: 'poultry farm',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    example: 'ABC Site',
  })
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @Get(':projectId/sites')
  async findSites(
    @Req() req,
    @Param('projectId') projectId,
  ): Promise<ListSiteResponse> {
    try {
      const { user } = req;
      const query = {
        ...req.query,
        project: projectId,
      };
      const site = await this.siteService.findAll(query, user);

      return {
        success: true,
        message: 'Sites fetched successfully',
        data: site,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error,
        // 'An error occurred while fetching sites',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'site'))
  @SerializeOptions({
    type: ListSiteResponse,
    exposeDefaultValues: true,
  })
  @ApiQuery({
    name: 'radius',
    required: true,
    type: Number,
    example: 1000,
    description: 'Radius in meters to search for nearby sites',
  })
  @ApiQuery({
    name: 'filterBy',
    required: false,
    type: String,
    example: 'newest',
    description: 'Filter the sites by newest or status',
  })
  @ApiQuery({
    name: 'farmType',
    required: false,
    type: String,
    isArray: true,
    example: ['poultry farm', 'cattle farm'],
    description: 'Filter sites by farm type',
  })
  @ApiQuery({
    name: 'assignedTo',
    required: false,
    type: Boolean,
    example: 'true',
  })
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @Get(':projectId/sites/nearby')
  async getNearbyLocations(
    @Param('projectId') projectId: string,
    @Query('lat') latitude: number,
    @Query('lon') longitude: number,
    @Query('radius') radius: number = 1000,
    @Query('assignedTo') assignedTo: string,
    @Req() req,
  ): Promise<ListNearbySiteResponse> {
    const { user } = req;
    const sites = await this.siteService.getNearbySites(
      req?.query,
      latitude,
      longitude,
      radius,
      user,
      assignedTo,
      projectId,
    );
    return {
      success: true,
      message: 'Fetch sites successfully',
      data: sites,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'site'))
  @SerializeOptions({
    type: SiteResponse,
    exposeDefaultValues: true,
  })
  @Get(':projectId/sites/:siteId')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @ApiParam({ name: 'siteId', type: String, description: 'Site UUID' })
  async findSite(
    @Param('projectId') projectId: string,
    @Param('siteId') id: string,
    @Req() req,
  ): Promise<SiteResponse> {
    const { user } = req;
    console.log(user);
    try {
      const { site, photos, nextCollectionDate } =
        await this.siteService.findOne({ id, projectId });

      return {
        success: true,
        message: 'Site fetched successfully',
        data: { ...site, photos, nextCollectionDate },
      };
    } catch (error) {
      // NotFoundException and other intended HTTP errors pass through as-is.
      if (error instanceof HttpException) throw error;
      // Anything else (e.g. a database timeout) is logged here and hidden
      // behind a generic 500: a QueryFailedError carries the SQL and its
      // parameters, which must not reach the client.
      this.logger.error(
        `Failed to fetch site ${id} in project ${projectId}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException(
        'An error occurred while fetching the site',
      );
    }
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, 'site'))
  @SerializeOptions({
    type: SiteResponse,
    exposeDefaultValues: true,
  })
  @Patch(':projectId/sites/:siteId')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @ApiParam({ name: 'siteId', type: String, description: 'Site UUID' })
  async updateSite(
    @Param('projectId') projectId: string,
    @Param('siteId') id: string,
    @Body() updateSiteDto: UpdateSiteDto,
    @Req() req,
  ): Promise<SiteResponse> {
    try {
      const { user } = req;
      const { collectionCollector, photos, collectionTime, ...createSiteObj } =
        updateSiteDto;

      const collectionObj: CreateCollectionPlanObj = {
        collectionStartDate: null,
        collectionExpiryDate: null,
        collectionTime: collectionTime || null,
      };

      let collector = null;
      if (collectionCollector) {
        collector = await this.userRepository.findOne({
          where: { id: collectionCollector },
        });
      }
      if (!collector && collectionCollector) {
        throw new HttpException('Collector not found', HttpStatus.NOT_FOUND);
      }

      let updatedBy: User = null;
      if (user && user.id) {
        updatedBy = await this.userRepository.findOne({
          where: { id: user.id },
        });
        if (!updatedBy) {
          throw new HttpException(
            `User not found for userid ${user.id}`,
            HttpStatus.NOT_FOUND,
          );
        }
      }

      // Use user-provided collectionStartDate if present. An edit that leaves
      // it out (the mobile app never sends one) keeps the stored start date,
      // and the expiry below counts from it; only a site without one gets a
      // calculated start date.
      let storedStartDate: Date | null = null;
      if (createSiteObj.collectionStartDate) {
        // User provided a start date from the frontend (YYYY-MM-DD or ISO string)
        // Parse as UTC midnight to ensure consistent date handling across timezones
        const parsedDate = DateTime.fromISO(
          createSiteObj.collectionStartDate instanceof Date
            ? createSiteObj.collectionStartDate.toISOString()
            : (createSiteObj.collectionStartDate as unknown as string),
          {
            zone: 'utc',
          },
        );
        if (!parsedDate.isValid) {
          throw new BadRequestException(
            `Invalid collectionStartDate: ${createSiteObj.collectionStartDate}`,
          );
        }
        collectionObj.collectionStartDate = parsedDate
          .startOf('day')
          .toFormat('yyyy-MM-dd HH:mm:ss') as unknown as Date;
      } else {
        storedStartDate = await this.siteService.getCollectionStartDate(
          id,
          projectId,
        );
        if (
          !storedStartDate &&
          collectionTime &&
          createSiteObj.collectionDayOfWeek
        ) {
          // Fallback: calculate start date if not provided
          collectionObj.collectionStartDate = calculateStartDate(
            createSiteObj.collectionDayOfWeek,
            collectionObj.collectionTime,
          );
          collectionObj.collectionStartDate = DateTime.fromJSDate(
            collectionObj.collectionStartDate,
          ).toFormat('yyyy-MM-dd HH:mm:ss') as unknown as Date;
        }
      }
      if (createSiteObj.collectionDuration) {
        collectionObj.collectionExpiryDate = calculateExpiryDateFlexible(
          createSiteObj.collectionDuration,
          collectionObj.collectionTime,
          collectionObj.collectionStartDate ?? storedStartDate,
        );
        collectionObj.collectionExpiryDate = DateTime.fromJSDate(
          collectionObj.collectionExpiryDate,
        ).toFormat('yyyy-MM-dd HH:mm:ss') as unknown as Date;
      }

      const site = await this.siteService.update(
        id,
        collector,
        createSiteObj,
        collectionObj,
        updatedBy,
        photos,
        projectId,
      );

      const signedUrls = await this.siteService.getSignedUrlForSingleSite(site);
      site.photos = signedUrls;

      return {
        success: true,
        message: 'Site updated successfully',
        data: site,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'An error occurred while updating the site',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Visits api
  @ApiOperation({ summary: 'Visit Summary for Site' })
  @SerializeOptions({
    type: VisitSummaryResponse,
    exposeDefaultValues: true,
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    example: '2025-03-01T00:00:00Z',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    example: '2025-03-21T00:00:00Z',
  })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'visit'))
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @Get(':projectId/visit-summary')
  async getVisitSummary(
    @Req() req,
    @Param('projectId') projectId: string,
  ): Promise<VisitSummaryResponse> {
    const userId = req.user.id; // Get logged-in user ID
    return {
      success: true,
      message: '',
      data: await this.visitService.getVisitSummary(
        userId,
        projectId,
        req.query,
      ),
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'visit'))
  @SerializeOptions({
    type: VisitResponse,
    exposeDefaultValues: true,
  })
  @Get(':projectId/visits/:visitId')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @ApiParam({ name: 'siteId', type: String, description: 'Site UUID' })
  @ApiParam({ name: 'visitId', type: String, description: 'Visit UUID' })
  async findById(
    @Param('projectId') projectId: string,
    @Param('visitId') id: string,
  ): Promise<VisitResponse> {
    const visit = await this.visitService.findById(id, projectId);
    for (const sample of visit.samples) {
      const signedUrls = await this.sampleService.getSignedUrlForSample(sample);
      sample.photos = signedUrls;
    }
    const signedUrls = await this.visitService.getSignedUrlForSample(visit);
    visit.photos = signedUrls;
    return {
      success: true,
      message: 'Visit fetched successfully',
      data: visit,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, 'visit'))
  @SerializeOptions({
    type: VisitResponse,
    exposeDefaultValues: true,
  })
  @Post(':projectId/visits')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  async createVisit(
    @Param('projectId') projectId: string,
    @Body() createVisitDto: CreateVisitDto,
  ): Promise<VisitResponse> {
    const isSiteExist = await this.siteService.existsInProject(
      createVisitDto.siteId,
      projectId,
    );
    if (!isSiteExist) {
      throw new HttpException(
        `Site not found for siteId ${createVisitDto.siteId}`,
        HttpStatus.NOT_FOUND,
      );
    }
    const visit = await this.visitService.createVisit({
      ...createVisitDto,
      projectId,
    });
    return {
      success: true,
      message: 'Visit created successfully',
      data: visit,
    };
  }

  @SerializeOptions({
    type: PaginatedVisitResponse,
    exposeDefaultValues: true,
  })
  @ApiQuery({ name: 'siteId', required: false, type: String })
  @ApiQuery({ name: 'disease', required: false, type: String })
  @ApiQuery({ name: 'siteType', required: false, type: String })
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
  @ApiQuery({ name: 'isCompleted', required: false, type: Boolean })
  @ApiQuery({ name: 'assignedTo', required: false, type: Boolean })
  @ApiQuery({ name: 'visitStatus', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'visit'))
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @Get(':projectId/visits')
  async getVisits(@Req() req): Promise<PaginatedVisitResponse> {
    const { user } = req;

    const visits = await this.visitService.getFilteredVisits(user, {
      ...req.query,
      projectId: req.params.projectId,
    });

    return {
      success: true,
      message: 'Visits fetched successfully',
      data: visits.docs,
      limit: visits.limit,
      page: visits.page,
      total: visits.total,
      totalPages: visits.totalPages,
    };
  }

  @SerializeOptions({
    type: VisitResponse,
    exposeDefaultValues: true,
  })
  // @Get(':projectId/visits/collector/:collectorId')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @ApiParam({ name: 'collectorId', type: String, description: 'User UUID' })
  async findByCollector(@Req() req): Promise<VisitResponse> {
    const { collectorId } = req.params;
    const visits = await this.visitService.findByUserId(collectorId);
    return {
      success: true,
      message: 'Visits fetched successfully',
      data: visits,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, 'visit'))
  @SerializeOptions({
    type: VisitResponse,
    exposeDefaultValues: true,
  })
  @Put(':projectId/visits/:visitId')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @ApiParam({ name: 'visitId', type: String, description: 'Visit UUID' })
  async updateVisit(
    @Param('projectId') projectId: string,
    @Param('visitId') id: string,
    @Body() updateVisitDto: UpdateVisitDto,
    @Req() req,
  ): Promise<VisitResponse> {
    const { user } = req;
    console.log(user);

    const updatedVisit = await this.visitService.update(
      id,
      updateVisitDto,
      projectId,
    );
    const signedUrls =
      await this.visitService.getSignedUrlForSample(updatedVisit);
    updatedVisit.photos = signedUrls;

    if (
      updateVisitDto.suspectDiseaseData &&
      updateVisitDto.suspectDiseaseData.length > 0
    ) {
      const updatePromises = updateVisitDto.suspectDiseaseData.map((data) =>
        this.visitService.updateSuspectedPositives(
          id,
          data.diseaseId,
          data.sampleCount,
          data.isSuspectedPositive,
        ),
      );

      await Promise.all(updatePromises);
      // updatedVisit = updatedVisits[updatedVisits.length - 1];
    }
    const updatedVisitData = await this.visitService.findById(id, projectId);
    return {
      success: true,
      message: 'Visit updated successfully',
      data: updatedVisitData,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, 'visit'))
  @SerializeOptions({
    type: VisitResponse,
    exposeDefaultValues: true,
  })
  @Patch(':projectId/visits/:visitId/reschedule')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @ApiParam({ name: 'visitId', type: String, description: 'Visit UUID' })
  async rescheduleVisit(
    @Param('projectId') projectId: string,
    @Param('visitId') id: string,
    @Body() rescheduleVisitDto: RescheduleVisitDto,
  ): Promise<VisitResponse> {
    await this.visitService.rescheduleVisit(id, rescheduleVisitDto, projectId);
    const updatedVisitData = await this.visitService.findById(id, projectId);
    return {
      success: true,
      message: 'Visit rescheduled successfully',
      data: updatedVisitData,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, 'visit'))
  @SerializeOptions({
    type: SubmitVisitResponse,
    exposeDefaultValues: true,
  })
  @Put(':projectId/visits/:visitId/submit-visit')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @ApiParam({ name: 'visitId', type: String, description: 'Visit UUID' })
  async submitVisit(
    @Param('projectId') projectId: string,
    @Param('visitId') visitId: string,
    @Body() createSampleDto: SubmitVisitDto,
  ): Promise<SubmitVisitResponse> {
    try {
      console.log(
        `[submitVisit Controller] ➡️ Received submit-visit request for visitId=${visitId}, projectId=${projectId}`,
      );
      console.log(
        `[submitVisit Controller] 📦 Samples count in request: ${createSampleDto.samples?.length ?? 0}`,
      );
      await this.visitService.submitVisit(
        visitId,
        {
          ...createSampleDto,
          visitData: { ...createSampleDto.visitData, projectId },
        },
        projectId,
      );
      console.log(
        `[submitVisit Controller] ✅ visitService.submitVisit completed successfully for visitId=${visitId}`,
      );
      const result = {
        success: true,
        message: 'Visit submitted successfully',
      };
      console.log(
        `[submitVisit Controller] 📤 Returning response:`,
        JSON.stringify(result),
      );
      return result;
    } catch (error) {
      console.log(
        `[submitVisit Controller] ❌ Error for visitId=${visitId}:`,
        error?.message || error,
      );
      throw error;
    }
  }

  // ***************** Sample Apis ***************** //
  @ApiOperation({ summary: 'Create Sample' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, 'sample'))
  @SerializeOptions({
    type: SampleResponse,
    exposeDefaultValues: true,
  })
  @Post(':projectId/samples')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  async createSample(
    @Param('projectId') projectId: string,
    @Body() createSampleDto: CreateSampleDto,
    // @Req() req
  ): Promise<SampleResponse> {
    // const {user} = req;

    const sample = await this.sampleService.create({
      ...createSampleDto,
      project: projectId,
    });
    const signedUrls = await this.sampleService.getSignedUrlForSample(sample);
    sample.photos = signedUrls;

    return {
      success: true,
      message: 'Sample created successfully',
      data: sample,
    };
  }

  @ApiOperation({ summary: 'Validate Barcode' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'sample'))
  @Get(':projectId/validate-barcode/:barcode')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  async validateBarcode(
    @Param('projectId') projectId: string,
    @Param('barcode') barcode: string,
  ): Promise<ValidateBarcodeMessage> {
    // try {
    const isValid: boolean = await this.sampleService.validateSampleBarcode(
      projectId,
      barcode,
    );
    return {
      success: true,
      isValidBarcode: isValid,
    };
    // } catch (error) {
    //   throw new Error(error.message);
    // }
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, 'sample-test'),
  )
  @Post(':projectId/samples/:sampleId/lab-tests')
  @SerializeOptions({
    type: LabTestResponse,
    exposeDefaultValues: true,
  })
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @ApiParam({ name: 'sampleId', type: String, description: 'Sample UUID' })
  async createLabTest(
    @Param('sampleId') sampleId: string,
    @Body() createMultipleLabTestDto: CreateMultipleLabTestDto,
    @Req() req,
  ): Promise<ListLabTestResponse> {
    const { user } = req;
    createMultipleLabTestDto.sample = sampleId;
    const labTest = await this.labTestsService.create(
      createMultipleLabTestDto,
      user,
    );
    return {
      success: true,
      message: 'Lab tests created successfully',
      data: labTest,
    };
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, 'sample-test'),
  )
  @Patch(':projectId/samples/:sampleId/lab-tests')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @ApiParam({ name: 'sampleId', type: String, description: 'Sample UUID' })
  @ApiParam({ name: 'labTestId', type: String, description: 'LabTest UUID' })
  @SerializeOptions({
    type: LabTestResponse,
    exposeDefaultValues: true,
  })
  async updateLabTest(
    @Param('sampleId') sampleId: string,
    @Body() updateMultipleLabTestDto: UpdateMultipleLabTestDto,
    @Req() req,
  ): Promise<ListLabTestResponse> {
    const { user } = req;
    console.log(user);
    updateMultipleLabTestDto.sample = sampleId;
    // Use sampleService.updateLabTests which handles pooled samples propagation
    const labTests = await this.sampleService.updateLabTests(
      updateMultipleLabTestDto,
    );
    return {
      success: true,
      message: 'Lab tests updated successfully',
      data: labTests,
    };
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, 'sample-test'),
  )
  @Get(':projectId/samples/:sampleId/lab-tests/:labTestId')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @ApiParam({ name: 'sampleId', type: String, description: 'Sample UUID' })
  @ApiParam({ name: 'labTestId', type: String, description: 'LabTest UUID' })
  @SerializeOptions({
    type: LabTestResponse,
    exposeDefaultValues: true,
  })
  async getLabTest(
    @Param('projectId') projectId: string,
    @Param('labTestId') labTestId,
    // @Req() req
  ): Promise<LabTestResponse> {
    // const {user} = req;

    const labTest = await this.labTestsService.findOne(
      { id: labTestId },
      projectId,
    );
    return {
      success: true,
      message: 'Lab test fetched successfully',
      data: labTest,
    };
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, 'sample-test'),
  )
  @Get(':projectId/samples/:sampleId/lab-tests')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @ApiParam({ name: 'sampleId', type: String, description: 'Sample UUID' })
  @SerializeOptions({
    type: ListLabTestResponse,
    exposeDefaultValues: true,
  })
  async getLabTests(
    @Query() query,
    @Param('projectId') projectId: string,
    @Param('sampleId') sampleId,
    // @Req() req
  ): Promise<ListLabTestResponse> {
    // const {user} = req;

    const labTest = await this.labTestsService.findAll(
      {
        ...query,
        sampleId: sampleId,
      },
      projectId,
    );
    return {
      success: true,
      message: 'Lab tests fetched successfully',
      data: labTest,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'sample'))
  @Get(':projectId/samples/max-round')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @ApiQuery({ name: 'workspaceId', required: false, type: String })
  async getMaxRound(
    @Req() req,
    @Param('projectId') projectId: string,
  ): Promise<{ success: boolean; data: number }> {
    const { user } = req;
    const maxRound = await this.sampleService.getMaxRound(
      projectId,
      user,
      req.query?.workspaceId,
    );
    return { success: true, data: maxRound };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'sample'))
  @Get(':projectId/samples')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @ApiQuery({ name: 'workspaceId', required: false, type: String })
  @ApiQuery({
    name: 'sort',
    type: String,
    required: false,
    description: 'Sort field',
  })
  @ApiQuery({
    name: 'sortOrder',
    type: String,
    required: false,
    description: 'asc or desc',
  })
  @ApiQuery({
    name: 'diseaseId',
    required: false,
    type: String,
    example: 'disease UUID',
  })
  @ApiQuery({
    name: 'siteId',
    required: false,
    type: String,
    example: 'site UUID',
  })
  @ApiQuery({
    name: 'visitId',
    required: false,
    type: String,
    example: 'visit UUID',
  })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sampleTypeId', required: false, type: String })
  @ApiQuery({ name: 'sampleStatus', required: false, type: String })
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
    example: '2024-01-31',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'round', required: false, type: Number })
  async findAllSamples(
    @Req() req,
    @Query() query,
    @Param('projectId') projectId,
  ): Promise<PaginatedSampleResponse> {
    const { user } = req;
    const sample = await this.sampleService.findAll(
      { ...query, projectId },
      user,
    );
    return {
      success: true,
      message: 'Samples fetched successfully',
      data: sample.docs,
      page: sample.page,
      limit: sample.limit,
      total: sample.total,
      totalPages: sample.totalPages,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'sample'))
  @Get(':projectId/samples/lab-stats')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @ApiQuery({ name: 'workspaceId', required: false, type: String })
  // @ApiQuery({
  //   name: 'diseaseId',
  //   required: false,
  //   type: String,
  //   example: 'disease UUID',
  // })
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
  async getLabTestStats(
    @Param('projectId') projectId: string,
    @Req() req,
  ): Promise<SampleStatLogisticResponse> {
    const { user } = req;
    const sample = await this.samplesService.getSampleStatsForLab(
      req.query,
      user,
      projectId,
    );
    return {
      success: true,
      message: 'Lab Samples stats fetched successfully',
      data: sample,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'sample'))
  @Get(':projectId/samples/:sampleId/poolable-samples')
  @ApiOperation({
    summary: 'Get samples that can be pooled with the given sample',
  })
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @ApiParam({ name: 'sampleId', type: String, description: 'Sample UUID' })
  async getPoolableSamples(
    @Param('projectId') projectId: string,
    @Param('sampleId') sampleId: string,
  ): Promise<any> {
    const samples = await this.sampleService.getPoolableSamples(
      projectId,
      sampleId,
    );
    return {
      success: true,
      message: 'Poolable samples fetched successfully',
      data: samples,
    };
  }

  @ApiOperation({ summary: 'Edit collected sample details' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, 'sample'))
  @SerializeOptions({
    type: SampleResponse,
    exposeDefaultValues: true,
  })
  @Post(':projectId/samples/:sampleId/edit-details')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @ApiParam({ name: 'sampleId', type: String, description: 'Sample UUID' })
  async editCollectedSampleDetails(
    @Req() req,
    @Param('projectId') projectId: string,
    @Param('sampleId') id: string,
    @Body() updateCollectedSampleDetailsDto: UpdateCollectedSampleDetailsDto,
  ): Promise<SampleResponse> {
    const { user } = req;
    const sample = await this.sampleService.updateCollectedSampleDetails(
      projectId,
      id,
      updateCollectedSampleDetailsDto,
      user,
    );
    return {
      success: true,
      message: 'Sample details updated successfully',
      data: sample,
    };
  }

  @ApiOperation({ summary: 'Edit sample details for a lab workflow stage' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, 'sample'))
  @SerializeOptions({
    type: SampleResponse,
    exposeDefaultValues: true,
  })
  @Post(':projectId/samples/:sampleId/edit-details/:stage')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @ApiParam({ name: 'sampleId', type: String, description: 'Sample UUID' })
  @ApiParam({
    name: 'stage',
    type: String,
    description:
      'Lab workflow stage: picked-up, received, virus-isolation, pre-processed, extracted, tested, test-report-generated',
  })
  async editSampleDetailsByStage(
    @Req() req,
    @Param('projectId') projectId: string,
    @Param('sampleId') id: string,
    @Param('stage') stage: string,
    @Body() updateSampleStageDetailsDto: UpdateSampleStageDetailsDto,
  ): Promise<SampleResponse> {
    const { user } = req;
    const sample = await this.sampleService.updateSampleStageDetails(
      projectId,
      id,
      stage,
      updateSampleStageDetailsDto,
      user,
    );
    return {
      success: true,
      message: 'Sample details updated successfully',
      data: sample,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'sample'))
  @SerializeOptions({
    type: SampleResponse,
    exposeDefaultValues: true,
  })
  @Get(':projectId/samples/:sampleId')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @ApiParam({ name: 'sampleId', type: String, description: 'Sample UUID' })
  async findOneSample(
    @Param('projectId') projectId: string,
    @Param('sampleId') id: string,
  ): Promise<SampleResponse> {
    const sample = await this.sampleService.findOne({ id }, projectId);
    return {
      success: true,
      message: 'Sample fetched successfully',
      data: sample,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, 'sample'))
  @SerializeOptions({
    type: SampleResponse,
    exposeDefaultValues: true,
  })
  @Patch(':projectId/samples/:sampleId')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @ApiParam({ name: 'sampleId', type: String, description: 'Sample UUID' })
  async updateSample(
    @Req() req,
    @Param('projectId') projectId: string,
    @Param('sampleId') id: string,
    @Body() updateSampleDto: UpdateSampleDto,
  ): Promise<SampleResponse> {
    const { user } = req;
    const sample = await this.sampleService.update(
      id,
      updateSampleDto,
      user,
      projectId,
    );
    return {
      success: true,
      message: 'Sample updated successfully',
      data: sample,
    };
  }

  // ***************** Teams Apis ***************** //

  @ApiOperation({ summary: 'Create Team Member' })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, 'team-member'),
  )
  @Post(':projectId/teams/:teamId/member')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @ApiParam({ name: 'teamId', type: String, description: 'Team UUID' })
  @SerializeOptions({ type: TeamMemberResponse })
  async addMember(
    @Param() params,
    @Body() createMemberDto: CreateMemberDto,
  ): Promise<TeamMemberResponse> {
    const team = await this.teamsService.addTeamMember({
      ...createMemberDto,
      teamId: params.teamId,
      project: params.projectId,
    });
    return {
      success: true,
      message: 'Team member added successfully',
      data: team,
    };
  }

  @ApiOperation({ summary: 'Create Team' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, 'team'))
  @Post(':projectId/teams')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @SerializeOptions({ type: TeamResponse })
  async createTeam(
    @Param('projectId') projectId: string,
    @Body() createTeamDto: CreateTeamDto,
  ): Promise<TeamResponse> {
    const team = await this.teamsService.create({
      ...createTeamDto,
      project: projectId,
    });
    return {
      success: true,
      message: 'Team created successfully',
      data: team,
    };
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, 'team-member'),
  )
  @Post(':projectId/members-list')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @SerializeOptions({ type: TeamMemberListResponse })
  async addMembersList(
    @Param('projectId') projectId: string,
    @Body() createMembersListDto: CreateMembersListDto,
  ): Promise<TeamMemberListResponse> {
    // A10: `teamId` comes from the body, not the CASL-validated :projectId
    // route param, so a caller who administers their own project could name
    // any other project's team here. Confirm the team actually belongs to
    // this project before writing anything.
    await this.teamsService.findOne({
      id: createMembersListDto.teamId,
      projectId,
    });

    const teamMembers = [];

    for (const dto of createMembersListDto.members) {
      const member = await this.teamsService.addTeamMember({
        ...dto,
        project: projectId,
        teamId: createMembersListDto.teamId,
      });
      teamMembers.push(member);
    }

    return {
      success: true,
      message: 'Team members added successfully',
      data: teamMembers,
    };
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Delete, 'team-member'),
  )
  @Delete(':projectId/members-list')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  async removeMembersList(
    @Param('projectId') projectId: string,
    @Body() teamMemberRemoveDto?: TeamMemberRemoveDto,
  ): Promise<RemovedTeamMemberResponse> {
    try {
      // A10: same cross-tenant risk as addMembersList — `teamId` is
      // caller-supplied, not derived from the validated :projectId.
      await this.teamsService.findOne({
        id: teamMemberRemoveDto?.teamId,
        projectId,
      });

      await this.teamsService.removeMultipleTeamMembers(
        { projectId, teamId: teamMemberRemoveDto.teamId },
        teamMemberRemoveDto,
      );
      return {
        success: true,
        message: `Team members removed successfully`,
        removedMembers: teamMemberRemoveDto.memberIds,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'team'))
  @Get(':projectId/teams')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @SerializeOptions({ type: ListTeamResponse })
  @ApiParam({
    name: 'projectId',
    required: false,
    type: String,
    description: 'Project UUID',
  })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'team'))
  async findAllTeams(
    @Param('projectId') projectId,
    @Req() req,
  ): Promise<ListTeamResponse> {
    const query = req.query;
    const team = await this.teamsService.findAll({ ...query, projectId });
    return {
      success: true,
      message: 'Teams fetched successfully',
      data: team,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'team'))
  @Get(':projectId/teams/available-roles')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @SerializeOptions({ type: ListAvailableRoleResponse })
  async getTeamRoles(): Promise<ListAvailableRoleResponse> {
    const teamRoles = await this.roleRepository.find({
      where: { scope: 'team' },
    });
    return {
      success: true,
      message: 'Teams roles fetched successfully',
      data: teamRoles,
    };
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, 'team-member'),
  )
  @Get(':projectId/teams/:teamId/members')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @ApiParam({ name: 'teamId', type: String, description: 'Team UUID' })
  @SerializeOptions({ type: ListTeamMemberResponse })
  async getTeamMembers(
    @Param('teamId') teamId,
    @Param('projectId') projectId,
    @Query() query,
  ): Promise<ListTeamMemberResponse> {
    const team = await this.teamsService.findAllTeamMembers({
      ...query,
      team: teamId,
      projectId,
    });
    return {
      success: true,
      message: 'Team members fetched successfully',
      data: team,
    };
  }

  @Get(':projectId/teams/:teamId')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'team'))
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @ApiParam({ name: 'teamId', type: String, description: 'Team UUID' })
  @SerializeOptions({ type: TeamResponse })
  async findTeam(
    @Param('projectId') projectId: string,
    @Param('teamId') id: string,
  ): Promise<TeamResponse> {
    const team = await this.teamsService.findOne({ id, projectId });
    return {
      success: true,
      message: 'Team fetched successfully',
      data: team,
    };
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, 'team-member'),
  )
  @Patch(':projectId/teams/:teamId/member/:memberId')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @ApiParam({ name: 'teamId', type: String, description: 'Team UUID' })
  @ApiParam({ name: 'memberId', type: String, description: 'User UUID' })
  @SerializeOptions({ type: TeamMemberResponse })
  async updateMember(
    @Param() params,
    @Body() updateMemberDto: UpdateMemberDto,
  ): Promise<TeamMemberResponse> {
    const team = await this.teamsService.updateTeamMember({
      ...updateMemberDto,
      ...params,
    });
    return {
      success: true,
      message: 'Team member updated successfully',
      data: team,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, 'team'))
  @Patch(':projectId/teams/:teamId')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @ApiParam({ name: 'teamId', type: String, description: 'Team UUID' })
  @SerializeOptions({ type: TeamResponse })
  async updateTeam(
    @Param('projectId') projectId: string,
    @Param('teamId') id: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ): Promise<TeamResponse> {
    const team = await this.teamsService.update(id, updateTeamDto, projectId);
    return {
      success: true,
      message: 'Team updated successfully',
      data: team,
    };
  }

  @Delete(':projectId/teams/:teamId/member/:memberId')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Delete, 'team-member'),
  )
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @ApiParam({ name: 'teamId', type: String, description: 'Team UUID' })
  @ApiParam({ name: 'memberId', type: String, description: 'User UUID' })
  async removeMember(@Param() params) {
    await this.teamsService.removeTeamMember({ ...params });
    return {
      success: true,
      message: 'Team member removed successfully',
    };
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, 'team-member'),
  )
  @Get(':projectId/teams/:teamId/members-filed')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
  @ApiParam({ name: 'teamId', type: String, description: 'Team UUID' })
  @SerializeOptions({ type: PaginatedTeamMemberResponse })
  async getTeamMembersFieldView(
    @Param('projectId') projectId: string,
    @Param('teamId') teamId,
    @Query() query,
  ): Promise<PaginatedTeamMemberResponse> {
    const team = await this.teamsService.getTeamMembersFieldView(
      {
        ...query,
        team: teamId,
      },
      projectId,
    );
    return {
      success: true,
      message: 'Team members fetched successfully',
      data: team.docs,
      limit: team.limit,
      total: team.total,
      totalPages: team.totalPages,
      page: team.page,
    };
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, 'team-member'),
  )
  @Get(':projectId/teams/:teamId/activity-overview')
  @ApiParam({ name: 'projectId', type: String, description: 'Project UUID' })
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
  @ApiParam({ name: 'teamId', type: String, description: 'Team UUID' })
  @SerializeOptions({
    type: ListTeamMemberResponse,
    exposeDefaultValues: true,
  })
  async getTeamActivityOverview(
    @Param('projectId') projectId: string,
    @Param('teamId') teamId,
    @Query() query,
  ): Promise<TeamProgressActivityOverviewResponse> {
    const activity = await this.teamsService.getTeamActivityOverview(
      query,
      teamId,
      projectId,
    );
    return {
      success: true,
      message: 'Team activity overview fetched successfully',
      data: activity,
    };
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, 'team-member'),
  )
  @Get(':projectId/teams/:teamId/visit-activity')
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
  @ApiParam({ name: 'projectId', type: String, description: 'project UUID' })
  @ApiParam({ name: 'teamId', type: String, description: 'Team UUID' })
  @SerializeOptions({ type: TeamMemberActivityResponse })
  async getTeamMembersVisitActivity(
    @Param('projectId') projectId: string,
    @Param('teamId') teamId,
    @Query() query,
  ): Promise<TeamMemberActivityResponse> {
    const activity = await this.teamsService.getTeamMembersVisitActivity(
      query,
      teamId,
      projectId,
    );
    return {
      success: true,
      message: 'Team activity fetched successfully',
      data: activity,
    };
  }

  // ***************** Upload sample data Script ***************** //
  @ServiceScoped(
    "uploadData validates every row's Project ID* against the uploader's " +
      'reachable projects via TenantScopeService.canReachProject and rejects ' +
      'the whole upload otherwise — see projects.service.ts#uploadData',
  )
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, 'project'))
  @SerializeOptions({
    type: ProjectResponse,
    exposeDefaultValues: true,
  })
  @Post('upload-sample-data')
  @ApiBody({ type: StructuredSiteDto })
  async uploadSampleDataScript(
    @Body() scriptData: any,
    @Req() req,
  ): Promise<SampleScriptResponseData> {
    const { user } = req;
    await this.projectsService.uploadData({
      ...scriptData,
      user,
    });

    return {
      success: true,
      message: 'Sample data uploaded successfully',
    };
  }
}
