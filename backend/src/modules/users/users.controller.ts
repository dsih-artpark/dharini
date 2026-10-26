import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AppAbility } from 'src/common/casl/abitlity.factory';
import { CheckPolicies } from 'src/common/decorators/check-policy.decorator';
import { ServiceScoped } from 'src/common/decorators/tenant-scope.decorator';
import {
  UserProfileResponse,
  UserResponse,
} from 'src/common/dto/response/user.response';
import { Action } from 'src/common/enums/action.enum';
import { PoliciesGuard } from 'src/common/guards/casl-policies.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { FetchAllUserResponse } from './dto/response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateOwnProfileDto } from './dto/update-own-profile.dto';
import { LookupUserDto, LookupUserResponse } from './dto/lookup-user.dto';
import { UserService } from './users.service';
import { CreateSuperAdminDto } from '../auth/dtos/create-super-admin.dto';

@ApiBearerAuth()
@UseGuards(PoliciesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // No :projectId/:workspaceId on this route - it always targets req.user.id,
  // never a body/param-supplied id, so it's safe for every authenticated
  // user regardless of tenant scope. @ServiceScoped documents that
  // guarantee to AbilityFactory's context-less-route default-deny.
  @ServiceScoped('always targets req.user.id, never a caller-supplied id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'user'))
  @SerializeOptions({
    type: UserProfileResponse,
    exposeDefaultValues: true,
  })
  @Get('profile')
  async profile(@Req() req): Promise<UserProfileResponse> {
    try {
      const user = await this.userService.findOne({ id: req.user.id });
      return {
        success: true,
        message: 'User profile fetched successfully',
        data: user,
      };
    } catch (error) {
      throw error;
    }
  }

  // 3.3: self-service "first-run details" update (and general own-profile
  // editing) for the caller — always targets req.user.id, never a body/param
  // -supplied id, so this is safe regardless of row-level ownership checks.
  // Placed before @Patch(':id') so the literal 'profile' path matches first.
  // Same @ServiceScoped rationale as GET profile above.
  @ServiceScoped('always targets req.user.id, never a caller-supplied id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, 'user'))
  @SerializeOptions({
    type: UserProfileResponse,
    exposeDefaultValues: true,
  })
  @Patch('profile')
  async updateProfile(
    @Req() req,
    @Body() updateOwnProfileDto: UpdateOwnProfileDto,
  ): Promise<UserProfileResponse> {
    try {
      const user = await this.userService.update(
        req.user.id,
        updateOwnProfileDto,
      );
      return {
        success: true,
        message: 'Profile updated successfully',
        data: user,
      };
    } catch (error) {
      throw error;
    }
  }

  // Identity check for the "add a user" forms. Placed before @Get(':id') so
  // the literal 'lookup' path matches first.
  //
  // @ServiceScoped: this reads a user row but returns no tenant-owned data —
  // no roles, teams, projects or workspaces (see LookupUserMatch), so there
  // is nothing for the ability layer to scope. It answers exactly one
  // question: "does an account already hold this email/phone, and what is it
  // called?" — which every add-member form needs before it can decide
  // whether to collect details or reuse them.
  @ServiceScoped(
    'exact-match identity check; returns a display name only, never tenant-owned data',
  )
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'user'))
  @Get('lookup')
  async lookup(@Query() query: LookupUserDto): Promise<LookupUserResponse> {
    const result = await this.userService.lookupByIdentity(query);
    return {
      success: true,
      message: result.exists ? 'User found' : 'No user found',
      data: result,
    };
  }

  // --- System scope only, below this line through @Patch(':id') ---
  // None of these routes carry :projectId/:workspaceId, and none carries
  // @ServiceScoped()/@TenantAgnostic() — that absence is deliberate, not an
  // oversight, so the factory denies every non-System caller by default.
  // Do not "fix" this by adding an opt-in decorator:
  //  - findSuperAdmins/createSuperAdmin/updateSuperAdmin/removeSuperAdmin
  //    (super-admins/*) require only 'read'/'create'/'update'/'delete' on
  //    'user'. The seeded workspace-admin role holds 'read' and 'update' on
  //    'user' (needed for its own GET/PATCH /users/profile access above) —
  //    under the old context-less fallback that also let a workspace-admin
  //    list and patch super-admin accounts, a privilege-escalation path.
  //    Denying them here is the fix, not a regression; System scope still
  //    reaches these routes because it short-circuits before the tenant
  //    check in AbilityFactory.
  //  - create/findAll/findOne/update (POST '', GET '', GET ':id', PATCH
  //    ':id') require 'manage' on 'all', which only System scope holds
  //    (see seeder/data.ts) — nothing changes for legitimate callers either
  //    way, but they're deliberately left undecorated too so the route
  //    stays denied-by-default if that ever stops being true.
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'user'))
  @Get('super-admins')
  @SerializeOptions({
    type: FetchAllUserResponse,
    exposeDefaultValues: true,
  })
  async findSuperAdmins(@Req() req): Promise<FetchAllUserResponse> {
    const users = await this.userService.findSuperAdmins(req.user.id);
    return {
      success: true,
      message: 'Super admins fetched successfully',
      data: users,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, 'user'))
  @Post('super-admins')
  @SerializeOptions({
    type: UserResponse,
    exposeDefaultValues: true,
  })
  async createSuperAdmin(
    @Req() req,
    @Body() createSuperAdminDto: CreateSuperAdminDto,
  ): Promise<UserResponse> {
    const user = await this.userService.createSuperAdmin(
      req.user.id,
      createSuperAdminDto,
    );
    return {
      success: true,
      message: 'Super admin created successfully',
      data: user,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, 'user'))
  @Patch('super-admins/:id')
  @ApiParam({ name: 'id', type: String, description: 'User UUID' })
  @SerializeOptions({
    type: UserResponse,
    exposeDefaultValues: true,
  })
  async updateSuperAdmin(
    @Req() req,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    const user = await this.userService.updateSuperAdmin(
      req.user.id,
      id,
      updateUserDto,
    );
    return {
      success: true,
      message: 'Super admin updated successfully',
      data: user,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, 'user'))
  @Delete('super-admins/:id')
  @ApiParam({ name: 'id', type: String, description: 'User UUID' })
  async removeSuperAdmin(@Param('id') id: string, @Req() req) {
    await this.userService.removeSuperAdmin(id, req.user.id);
    return {
      success: true,
      message: 'Super admin removed successfully',
    };
  }

  @Post()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, 'all'))
  @SerializeOptions({
    type: UserResponse,

    exposeDefaultValues: true,
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    try {
      const user = await this.userService.create(createUserDto);
      return {
        success: true,
        message: 'User created successfully',
        data: user,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, 'all'))
  @SerializeOptions({
    type: FetchAllUserResponse,

    exposeDefaultValues: true,
  })
  async findAll(): Promise<FetchAllUserResponse> {
    try {
      const users = await this.userService.findAll({});
      return {
        success: true,
        message: 'User list fetched successfully',
        data: users,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, 'all'))
  @ApiParam({ name: 'id', type: String, description: 'User UUID' })
  @SerializeOptions({
    type: FetchAllUserResponse,

    exposeDefaultValues: true,
  })
  async findOne(@Param('id') id: string): Promise<UserResponse> {
    try {
      const user = await this.userService.findOne({ id });
      return {
        success: true,
        message: 'User fetched successfully',
        data: user,
      };
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, 'all'))
  @ApiParam({ name: 'id', type: String, description: 'User UUID' })
  @SerializeOptions({
    type: FetchAllUserResponse,

    exposeDefaultValues: true,
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    try {
      const user = await this.userService.update(id, updateUserDto);
      return {
        success: true,
        message: 'User updated successfully',
        data: user,
      };
    } catch (error) {
      throw error;
    }
  }

  // Anonymize, never hard-delete (product decision - see plan doc). Admin
  // only: the acting user must genuinely outrank and administer the target,
  // enforced by UserService.anonymize -> TenantScopeService.canManageUser.
  // No @ServiceScoped/@TenantAgnostic on purpose - carries no :projectId/
  // :workspaceId, so the ability here is only the coarse "holds delete on
  // user somewhere" gate; canManageUser does the real per-target check
  // ("destructive enough to defend twice", same posture as PurgeService).
  @ServiceScoped(
    "target's tenant is resolved from the target's own roles inside canManageUser, not from a route param",
  )
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, 'user'))
  @Delete(':id')
  @ApiParam({ name: 'id', type: String, description: 'User UUID' })
  async remove(@Param('id') id: string, @Req() req): Promise<UserResponse> {
    await this.userService.anonymize(id, req.user);
    return {
      success: true,
      message: 'Account anonymized successfully',
      data: null,
    };
  }
}
