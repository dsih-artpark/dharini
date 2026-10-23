import {
  Body,
  Controller,
  Param,
  Query,
  Req,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { AppAbility } from 'src/common/casl/abitlity.factory';
import { CheckPolicies } from 'src/common/decorators/check-policy.decorator';
import { ServiceScoped } from 'src/common/decorators/tenant-scope.decorator';
import { PoliciesGuard } from 'src/common/guards/casl-policies.guard';
import {
  ListAvailableRoleResponse,
  ListTeamMemberResponse,
  TeamMemberListResponse,
  TeamMemberResponse,
} from 'src/common/dto/response/team-member.response';
import {
  ListTeamResponse,
  PaginatedTeamMemberResponse,
  RemovedTeamMemberResponse,
  TeamMemberActivityResponse,
  TeamMembersCollectorListType,
  TeamProgressActivityOverviewResponse,
  TeamResponse,
} from 'src/common/dto/response/team.response';
import { Action } from 'src/common/enums/action.enum';
import { Role } from 'src/entities/role.entity';
import { Repository } from 'typeorm';
import { CreateMembersListDto } from './dto/create-list-member.dto';
import { CreateMemberDto } from './dto/create-member.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamMemberRemoveDto } from './dto/list-member-ids.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamsService } from './teams.service';

// This controller previously had no class-level auth/policy guards at all
// (every route below is also currently commented out - team management now
// lives under `/projects/:projectId/teams/**` in ProjectsController). Adding
// the guards here is defence in depth for whenever these routes are
// revived, matching SitesController's convention. None of these routes
// carry a `:projectId`/`:workspaceId` route param, so - like
// SitesController - the controller is annotated `@ServiceScoped`:
// TeamsService binds each write to an explicit projectId argument
// (findAll/findOne/update/addTeamMember/updateTeamMember/removeTeamMember
// all require or accept one) rather than relying on the ability factory's
// route-param check. See FINDINGS.md §21b / FIX-PLAN A10/A14.
@ApiBearerAuth()
@UseGuards(PoliciesGuard)
@ServiceScoped(
  'TeamsService binds each read/write to an explicit projectId argument (see findAll/findOne/update/addTeamMember/updateTeamMember/removeTeamMember); no route here carries :projectId',
)
@Controller('teams')
export class TeamsController {
  constructor(
    private readonly teamsService: TeamsService,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, 'team-member'),
  )
  // @Post(':teamId/member')
  @ApiParam({ name: 'teamId', type: String, description: 'Team UUID' })
  @SerializeOptions({ type: TeamMemberResponse })
  async addMember(
    @Param() params,
    @Body() createMemberDto: CreateMemberDto,
  ): Promise<TeamMemberResponse> {
    const team = await this.teamsService.addTeamMember({
      ...createMemberDto,
      ...params,
    });
    return {
      success: true,
      message: 'Team member added successfully',
      data: team,
    };
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, 'team-member'),
  )
  // @Post(':teamId/members-list')
  @ApiParam({ name: 'teamId', type: String, description: 'Team UUID' })
  @SerializeOptions({ type: TeamMemberListResponse })
  async addMembersList(
    @Param() params,
    @Body() createMembersListDto: CreateMembersListDto,
  ): Promise<TeamMemberListResponse> {
    const teamMembers = [];

    for (const dto of createMembersListDto.members) {
      const member = await this.teamsService.addTeamMember({
        ...dto,
        project: createMembersListDto.project,
        ...params,
      });
      teamMembers.push(member);
    }

    return {
      success: true,
      message: 'Team members added successfully',
      data: teamMembers,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, 'team'))
  // @Post()
  @SerializeOptions({ type: TeamResponse })
  async create(@Body() createTeamDto: CreateTeamDto): Promise<TeamResponse> {
    const team = await this.teamsService.create(createTeamDto);
    return {
      success: true,
      message: 'Team created successfully',
      data: team,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'team'))
  // @Get()
  @SerializeOptions({ type: ListTeamResponse })
  @ApiQuery({
    name: 'project',
    required: false,
    type: String,
    description: 'Project ID',
  })
  async findAll(@Req() req): Promise<ListTeamResponse> {
    const query = req.query;
    const team = await this.teamsService.findAll({ ...query });
    return {
      success: true,
      message: 'Teams fetched successfully',
      data: team,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'team'))
  // @Get('available-roles')
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
  // @Get(':teamId/members/')
  @ApiParam({ name: 'teamId', type: String, description: 'Team UUID' })
  @SerializeOptions({ type: ListTeamMemberResponse })
  async getMembers(
    @Param('teamId') teamId,
    @Query() query,
  ): Promise<ListTeamMemberResponse> {
    const team = await this.teamsService.findAllTeamMembers({
      ...query,
      team: teamId,
    });
    return {
      success: true,
      message: 'Team members fetched successfully',
      data: team,
    };
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, 'team-member'),
  )
  // @Get(':teamId/members-filed')
  @ApiParam({ name: 'teamId', type: String, description: 'Team UUID' })
  @SerializeOptions({ type: PaginatedTeamMemberResponse })
  async getTeamMembersFieldView(
    @Param('teamId') teamId,
    @Query() query,
  ): Promise<PaginatedTeamMemberResponse> {
    const team = await this.teamsService.getTeamMembersFieldView({
      ...query,
      team: teamId,
    });
    return {
      success: true,
      message: 'Team members fetched successfully',
      data: team.docs as TeamMembersCollectorListType[],
      limit: team.limit,
      total: team.total,
      totalPages: team.totalPages,
      page: team.page,
    };
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, 'team-member'),
  )
  // @Get(':teamId/activity-overview')
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
  @SerializeOptions({ type: ListTeamMemberResponse })
  async getTeamActivityOverview(
    @Param('teamId') teamId,
    @Query() query,
  ): Promise<TeamProgressActivityOverviewResponse> {
    const activity = await this.teamsService.getTeamActivityOverview(
      query,
      teamId,
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
  // @Get(':teamId/visit-activity')
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
  @SerializeOptions({ type: TeamMemberActivityResponse })
  async getTeamMembersVisitActivity(
    @Param('teamId') teamId,
    @Query() query,
  ): Promise<TeamMemberActivityResponse> {
    const activity = await this.teamsService.getTeamMembersVisitActivity(
      query,
      teamId,
    );
    return {
      success: true,
      message: 'Team activity fetched successfully',
      data: activity,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'team'))
  // @Get(':id')
  @ApiParam({ name: 'id', type: String, description: 'Team UUID' })
  @SerializeOptions({ type: TeamResponse })
  async findOne(@Param('id') id: string): Promise<TeamResponse> {
    const team = await this.teamsService.findOne({ id });
    return {
      success: true,
      message: 'Team fetched successfully',
      data: team,
    };
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, 'team-member'),
  )
  // @Patch(':teamId/member/:memberId')
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
  // @Patch(':id')
  @ApiParam({ name: 'id', type: String, description: 'Team UUID' })
  @SerializeOptions({ type: TeamResponse })
  async update(
    @Param('id') id: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ): Promise<TeamResponse> {
    const team = await this.teamsService.update(id, updateTeamDto, '');
    return {
      success: true,
      message: 'Team updated successfully',
      data: team,
    };
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Delete, 'team-member'),
  )
  // @Delete(':teamId/member/:memberId')
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
    ability.can(Action.Delete, 'team-member'),
  )
  // @Delete(':teamId/members-list')
  @ApiParam({ name: 'teamId', type: String, description: 'Team UUID' })
  async removeMembersList(
    @Param() params,
    @Body() teamMemberRemoveDto?: TeamMemberRemoveDto,
  ): Promise<RemovedTeamMemberResponse> {
    try {
      await this.teamsService.removeMultipleTeamMembers(
        params,
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

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, 'team'))
  // @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.teamsService.remove(id);
    return {
      success: true,
      message: 'Team removed successfully',
    };
  }
}
