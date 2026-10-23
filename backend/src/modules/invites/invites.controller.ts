import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AppAbility } from 'src/common/casl/abitlity.factory';
import { CheckPolicies } from 'src/common/decorators/check-policy.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { ServiceScoped } from 'src/common/decorators/tenant-scope.decorator';
import { Action } from 'src/common/enums/action.enum';
import { PoliciesGuard } from 'src/common/guards/casl-policies.guard';
import { CommonResponse } from 'src/common/types/common-response.type';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import { CreateWorkspaceInviteDto } from './dto/create-workspace-invite.dto';
import { InvitePartnerDto } from './dto/invite-partner.dto';
import { FetchAllInviteResponse, InviteResponse } from './dto/response.dto';
import { InvitesService } from './invites.service';

@Controller('invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  // Kept commented out intentionally (2.7): these create PROJECT/TEAM
  // invites — the design doc explicitly says to leave that legacy path
  // alone, since project/team member addition already works via the live
  // /projects/:id/teams/... endpoints. Only the workspace-invite flow below
  // is being revived.
  // @Post('partners')
  async invitePartners(
    @Req() req,
    @Body() invitePartnersDto: InvitePartnerDto,
  ): Promise<CommonResponse<any>> {
    const { user } = req;
    const invites = await this.invitesService.sendInviteToPartners({
      ...invitePartnersDto,
      invitedBy: user,
    });
    return {
      success: true,
      message: 'Partner invites sent successfully',
      data: invites,
    };
    return;
  }

  // @Post('collectors')
  async inviteCollectors(
    @Req() req,
    @Body() inviteCollectorDto: InvitePartnerDto,
  ): Promise<CommonResponse<any>> {
    const { user } = req;
    const invites = await this.invitesService.sendInviteToPartners({
      ...inviteCollectorDto,
      invitedBy: user,
    });
    return {
      success: true,
      message: 'Collector invites sent successfully',
      data: invites,
    };
  }

  // 2.7: this is how a workspace-admin adds a NEW (or existing) person to
  // their workspace via email, as opposed to signup (which creates a brand
  // new workspace). No :workspaceId route param here — workspaceId is in
  // the body — so @CheckPolicies only confirms the caller has A
  // workspace-admin-shaped role somewhere; InvitesService.sendWorkspaceInvite
  // does the real "administers THIS workspace" check (FIX-PLAN A5).
  // @ServiceScoped documents that guarantee for AbilityFactory's
  // context-less-route default-deny (this route resolves neither :projectId
  // nor :workspaceId).
  @ApiBearerAuth()
  @UseGuards(PoliciesGuard)
  @ServiceScoped(
    'InvitesService.sendWorkspaceInvite requires the caller to administer the target workspaceId (role name workspace-admin or manage/workspace-member permission), checked against the body-supplied workspaceId',
  )
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Manage, 'workspace-member'),
  )
  @Post('workspace')
  async inviteToWorkspace(
    @Req() req,
    @Body() createWorkspaceInviteDto: CreateWorkspaceInviteDto,
  ): Promise<CommonResponse<any>> {
    const invite = await this.invitesService.sendWorkspaceInvite(
      createWorkspaceInviteDto,
      req.user,
    );
    return {
      success: true,
      message: 'Workspace invite sent successfully',
      data: invite,
    };
  }

  // Intentionally public/unguarded: the invitee doesn't have an account or
  // JWT yet when accepting an invite.
  @Public()
  @Post('accept/:inviteToken')
  async inviteAccept(
    @Param() acceptInviteDto: AcceptInviteDto,
  ): Promise<CommonResponse<any>> {
    const data = await this.invitesService.acceptInvite(acceptInviteDto);
    return {
      success: true,
      message: 'Invite accepted successfully',
      data,
    };
  }

  // Intentionally public/unguarded: shown to an invitee before they have an
  // account, so they can see what they're accepting.
  @Public()
  @Get(':inviteToken')
  @SerializeOptions({ type: InviteResponse })
  async getInviteByToken(
    @Param() getInviteDto: AcceptInviteDto,
  ): Promise<InviteResponse> {
    const data = await this.invitesService.getInviteByToken(getInviteDto);
    return {
      success: true,
      message: 'Invite fetched successfully',
      data,
    };
  }

  // Authenticated (who invited whom is sensitive), but per-row authorization
  // (e.g. "only see invites for a workspace/project you administer") is not
  // enforced here — pre-existing gap for the ?project= filter too, flagged
  // as a follow-up rather than fixed as part of 2.7.
  @Get()
  @SerializeOptions({ type: FetchAllInviteResponse })
  async getInvites(@Req() req): Promise<FetchAllInviteResponse> {
    const { project, workspace } = req.query;
    const filterQuery: any = {};

    if (project) filterQuery.projectId = project;
    if (workspace) filterQuery.workspaceId = workspace;
    const data = await this.invitesService.getInvites(filterQuery);
    return {
      success: true,
      message: 'Invite fetched successfully',
      data,
    };
  }
}
