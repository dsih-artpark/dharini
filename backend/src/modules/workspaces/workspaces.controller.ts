import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AppAbility } from 'src/common/casl/abitlity.factory';
import {
  AnyAuthenticated,
  CheckPolicies,
} from 'src/common/decorators/check-policy.decorator';
import { ServiceScoped } from 'src/common/decorators/tenant-scope.decorator';
import { Action } from 'src/common/enums/action.enum';
import { PoliciesGuard } from 'src/common/guards/casl-policies.guard';
import { ProjectResponseData } from 'src/common/dto/response/project.response';
import { CommonResponse } from 'src/common/types/common-response.type';
import { Project } from 'src/entities/project.entity';
import { UserRole } from 'src/entities/user-role.entity';
import { Workspace } from 'src/entities/workspace.entity';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { CreateWorkspaceProjectDto } from './dto/create-workspace-project.dto';
import { CreateWorkspaceMemberDto } from './dto/create-workspace-member.dto';
import { UpdateWorkspaceMemberDto } from './dto/update-workspace-member.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { WorkspacesService } from './workspaces.service';

@ApiBearerAuth()
@UseGuards(PoliciesGuard)
@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  // No :workspaceId param here, so this hits AbilityFactory's context-less
  // route path — @ServiceScoped documents that findMine() below does the
  // actual per-user filtering (it can't be scoped to a single workspace
  // because the whole point of this route is listing all of them).
  @Get()
  @ServiceScoped(
    'findMine() filters to workspaces the caller actually belongs to (directly or via project membership)',
  )
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'workspace'))
  async findMine(@Req() req): Promise<CommonResponse<Workspace[]>> {
    const workspaces = await this.workspacesService.findMine(req.user);
    return {
      success: true,
      message: 'Workspaces fetched successfully',
      data: workspaces,
    };
  }

  // Any authenticated user may create a workspace and become its admin.
  // Uses the same 'read workspace' policy as GET / (no stricter restriction
  // needed — creating your own workspace is self-service). No :workspaceId
  // param (there isn't one yet — this route creates it), hence @ServiceScoped.
  @Post()
  @ServiceScoped(
    'create() always scopes the new admin UserRole to req.user and the newly-created workspace',
  )
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'workspace'))
  async create(
    @Body() createWorkspaceDto: CreateWorkspaceDto,
    @Req() req,
  ): Promise<CommonResponse<Workspace>> {
    const workspace = await this.workspacesService.create(
      createWorkspaceDto,
      req.user,
    );
    return {
      success: true,
      message: 'Workspace created successfully',
      data: workspace,
    };
  }

  // PoliciesGuard now rejects any guarded route with no @CheckPolicies at
  // all (a route used to silently pass with none). This route intentionally
  // does its authorization in the service (assertWorkspaceAccess, which also
  // allows read-only project/team members — a plain @CheckPolicies grant off
  // AbilityFactory's cascading resolution can't express that), so
  // @CheckPolicies(AnyAuthenticated) just satisfies "a policy must be
  // declared" without narrowing who can pass; the global JwtAuthGuard still
  // requires authentication, and assertWorkspaceAccess still requires either
  // System scope, a direct workspace role, or reachability via a member
  // project.
  @Get(':workspaceId')
  @ApiParam({
    name: 'workspaceId',
    type: String,
    description: 'Workspace UUID',
  })
  @CheckPolicies(AnyAuthenticated)
  async findOne(
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
    @Req() req,
  ): Promise<CommonResponse<Workspace>> {
    const workspace = await this.workspacesService.findOne(
      workspaceId,
      req.user,
    );
    return {
      success: true,
      message: 'Workspace fetched successfully',
      data: workspace,
    };
  }

  // 4.5: workspace rename. Same @CheckPolicies(AnyAuthenticated) rationale as
  // findOne()/findProjects() above — authorization is done explicitly in
  // WorkspacesService.update() (System scope OR a role that actually confers
  // admin for THIS workspace).
  @Patch(':workspaceId')
  @ApiParam({
    name: 'workspaceId',
    type: String,
    description: 'Workspace UUID',
  })
  @CheckPolicies(AnyAuthenticated)
  async update(
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
    @Req() req,
  ): Promise<CommonResponse<Workspace>> {
    const workspace = await this.workspacesService.update(
      workspaceId,
      updateWorkspaceDto,
      req.user,
    );
    return {
      success: true,
      message: 'Workspace updated successfully',
      data: workspace,
    };
  }

  // Same rationale as findOne() above: authorization handled by
  // assertWorkspaceAccess() inside the service, not @CheckPolicies.
  @Get(':workspaceId/projects')
  @ApiParam({
    name: 'workspaceId',
    type: String,
    description: 'Workspace UUID',
  })
  @CheckPolicies(AnyAuthenticated)
  async findProjects(
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
    @Req() req,
  ): Promise<CommonResponse<Project[]>> {
    const projects = await this.workspacesService.findProjects(
      workspaceId,
      req.user,
    );
    return {
      success: true,
      message: 'Projects fetched successfully',
      data: projects,
    };
  }

  // Body DTO omits workspaceId (see CreateWorkspaceProjectDto) — it comes
  // from :workspaceId below instead, since CreateProjectDto.workspaceId is
  // now @IsNotEmpty() (task A2) and the global validation pipe runs before
  // this handler, before WorkspacesService.createProject ever sees the body.
  @Post(':workspaceId/projects')
  @ApiParam({
    name: 'workspaceId',
    type: String,
    description: 'Workspace UUID',
  })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, 'project'))
  async createProject(
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
    @Body() createProjectDto: CreateWorkspaceProjectDto,
    @Req() req,
  ): Promise<CommonResponse<ProjectResponseData>> {
    const project = await this.workspacesService.createProject(
      workspaceId,
      createProjectDto,
      req.user,
    );
    return {
      success: true,
      message: 'Project created successfully',
      data: project,
    };
  }

  @Get(':workspaceId/members')
  @ApiParam({
    name: 'workspaceId',
    type: String,
    description: 'Workspace UUID',
  })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, 'workspace-member'),
  )
  async findMembers(
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
  ): Promise<CommonResponse<UserRole[]>> {
    const members = await this.workspacesService.findMembers(workspaceId);
    return {
      success: true,
      message: 'Workspace members fetched successfully',
      data: members,
    };
  }

  @Post(':workspaceId/members')
  @ApiParam({
    name: 'workspaceId',
    type: String,
    description: 'Workspace UUID',
  })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, 'workspace-member'),
  )
  async addMember(
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
    @Body() createWorkspaceMemberDto: CreateWorkspaceMemberDto,
    @Req() req,
  ): Promise<CommonResponse<UserRole>> {
    const member = await this.workspacesService.addMember(
      workspaceId,
      createWorkspaceMemberDto,
      req.user,
    );
    return {
      success: true,
      message: 'Workspace member added successfully',
      data: member,
    };
  }

  @Patch(':workspaceId/members/:memberId')
  @ApiParam({
    name: 'workspaceId',
    type: String,
    description: 'Workspace UUID',
  })
  @ApiParam({ name: 'memberId', type: String, description: 'UserRole UUID' })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, 'workspace-member'),
  )
  async updateMember(
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
    @Param('memberId', ParseUUIDPipe) memberId: string,
    @Body() updateWorkspaceMemberDto: UpdateWorkspaceMemberDto,
    @Req() req,
  ): Promise<CommonResponse<UserRole>> {
    const member = await this.workspacesService.updateMember(
      workspaceId,
      memberId,
      updateWorkspaceMemberDto,
      req.user,
    );
    return {
      success: true,
      message: 'Workspace member updated successfully',
      data: member,
    };
  }

  @Delete(':workspaceId/members/:memberId')
  @ApiParam({
    name: 'workspaceId',
    type: String,
    description: 'Workspace UUID',
  })
  @ApiParam({ name: 'memberId', type: String, description: 'UserRole UUID' })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Delete, 'workspace-member'),
  )
  async removeMember(
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
    @Param('memberId', ParseUUIDPipe) memberId: string,
  ): Promise<CommonResponse<null>> {
    await this.workspacesService.removeMember(workspaceId, memberId);
    return {
      success: true,
      message: 'Workspace member removed successfully',
    };
  }
}
