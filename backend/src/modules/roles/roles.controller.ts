import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  SerializeOptions,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ListRoleResponse } from 'src/common/dto/response/role.response';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';

@ApiBearerAuth()
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    try {
      return this.rolesService.create(createRoleDto);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to create role');
    }
  }

  // 2.9 regression-pass finding: this was the only LIVE route in this
  // controller and had ZERO guards (only a decorative @ApiBearerAuth) —
  // anyone unauthenticated could list every role (and, via the
  // 'permissions' relation, every permission) in the system. Requiring
  // login is the minimal fix; no @CheckPolicies subject exists for 'role'
  // today and this is likely used broadly by any authenticated user
  // needing to populate a role picker (e.g. the workspace-invite flow), so
  // it's left at "must be logged in" rather than further restricted.
  @Get()
  @SerializeOptions({ type: ListRoleResponse, exposeDefaultValues: true })
  async findAll(): Promise<ListRoleResponse> {
    const roles = await this.rolesService.findAll({});
    return {
      success: true,
      message: 'Roles fetched successfully',
      data: roles,
    };
  }

  // @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  // @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  // @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
