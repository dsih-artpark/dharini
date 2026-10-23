import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AppAbility } from 'src/common/casl/abitlity.factory';
import { CheckPolicies } from 'src/common/decorators/check-policy.decorator';
import { ServiceScoped } from 'src/common/decorators/tenant-scope.decorator';
import { Action } from 'src/common/enums/action.enum';
import { PoliciesGuard } from 'src/common/guards/casl-policies.guard';
import { CommonResponse } from 'src/common/types/common-response.type';
import { User } from 'src/entities/user.entity';
import { AccessService } from './access.service';
import { UpdateAccessDto } from './dto/update-access.dto';

@ApiBearerAuth()
@UseGuards(PoliciesGuard)
@Controller('access')
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  // No :workspaceId/:projectId param here - AccessService.findOne() does the
  // real per-target authorization (FIX-PLAN A13: caller must share a
  // project/workspace with the target, or hold System scope).
  // @ServiceScoped documents that guarantee to AbilityFactory's
  // context-less-route default-deny.
  @Get(':id')
  @ServiceScoped(
    'AccessService.findOne requires the caller to share a project/workspace with the target user, or hold System scope',
  )
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'user'))
  async findOne(
    @Param('id') id: string,
    @Req() req,
  ): Promise<CommonResponse<User>> {
    const access = await this.accessService.findOne({ id }, req.user);
    return {
      success: true,
      message: 'Access fetched successfully',
      data: access,
    };
  }

  // Gated on Action.Manage for 'user' OR 'workspace-member': the former is
  // satisfied only by System scope (super-admin, via 'manage all'); the
  // latter is satisfied by Workspace scope (workspace-admin, via its seeded
  // 'manage workspace-member'). This route has no :workspaceId param, so
  // AbilityFactory's cascading match can't confirm WHICH workspace a
  // workspace-admin caller administers — it only confirms they have a
  // workspace-admin-shaped role somewhere. AccessService.update() does the
  // actual fine-grained enforcement: workspace-admins may only assign
  // workspace-scoped roles (never system-scope ones), and only into a
  // workspace they can prove (via their own UserRole.workspace) they
  // administer.
  @Patch(':id')
  @ServiceScoped(
    'AccessService.update requires System scope, or a workspace-admin-conferring role for the body-supplied workspaceId',
  )
  @CheckPolicies(
    (ability: AppAbility) =>
      ability.can(Action.Manage, 'user') ||
      ability.can(Action.Manage, 'workspace-member'),
  )
  async update(
    @Param('id') id: string,
    @Body() updateAccessDto: UpdateAccessDto,
    @Req() req,
  ): Promise<CommonResponse<User>> {
    const access = await this.accessService.update(
      id,
      updateAccessDto,
      req.user,
    );
    return {
      success: true,
      message: 'Access gave successfully',
      data: access,
    };
  }
}
