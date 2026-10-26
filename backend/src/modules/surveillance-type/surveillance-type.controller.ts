import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CommonResponse } from 'src/common/types/common-response.type';
import { SurveillanceType } from 'src/entities/surveillance-type.entity';
import { CreateSurveillanceTypeDto } from './dto/create-surveillance-type.dto';
import { UpdateSurveillanceTypeDto } from './dto/update-surveillance-type.dto';
import { SurveillanceTypeService } from './surveillance-type.service';
import {
  ListSurveillanceTypeResponse,
  SurveillanceTypeResponse,
} from 'src/common/dto/response/surveillance-type.response';
import { AppAbility } from 'src/common/casl/abitlity.factory';
import { CheckPolicies } from 'src/common/decorators/check-policy.decorator';
import { Action } from 'src/common/enums/action.enum';
import { PoliciesGuard } from 'src/common/guards/casl-policies.guard';
import { TenantAgnostic } from 'src/common/decorators/tenant-scope.decorator';

@ApiBearerAuth()
@UseGuards(PoliciesGuard)
// Global reference data: owned by no workspace or project, so there is no
// tenant to scope against. Declared explicitly because PoliciesGuard now
// denies context-less routes that claim neither opt-in.
@TenantAgnostic()
@Controller('surveillance-type')
export class SurveillanceTypeController {
  constructor(
    private readonly surveillanceTypeService: SurveillanceTypeService,
  ) {}

  @Post()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, 'surveillance-type'),
  )
  @SerializeOptions({
    type: SurveillanceTypeResponse,
    exposeDefaultValues: true,
  })
  async create(
    @Body() createSurveillanceTypeDto: CreateSurveillanceTypeDto,
  ): Promise<SurveillanceTypeResponse> {
    try {
      const surveillance = await this.surveillanceTypeService.create(
        createSurveillanceTypeDto,
      );
      return {
        success: true,
        message: 'Surveillance type created successfully',
        data: surveillance,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, 'surveillance-type'),
  )
  @SerializeOptions({
    type: ListSurveillanceTypeResponse,
    exposeDefaultValues: true,
  })
  async findAll(): Promise<ListSurveillanceTypeResponse> {
    const surveillance = await this.surveillanceTypeService.findAll({});
    return {
      success: true,
      message: 'Surveillance types fetched successfully',
      data: surveillance,
    };
  }

  @Get(':id')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, 'surveillance-type'),
  )
  @ApiParam({ name: 'id', type: String, description: 'Surveillance Type UUID' })
  @SerializeOptions({
    type: SurveillanceTypeResponse,
    exposeDefaultValues: true,
  })
  async findOne(@Param('id') id: string): Promise<SurveillanceTypeResponse> {
    const surveillance = await this.surveillanceTypeService.findOne(id);
    return {
      success: true,
      message: 'Surveillance type fetched successfully',
      data: surveillance,
    };
  }

  @Patch(':id')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, 'surveillance-type'),
  )
  @ApiParam({ name: 'id', type: String, description: 'Surveillance Type UUID' })
  @SerializeOptions({
    type: SurveillanceTypeResponse,
    exposeDefaultValues: true,
  })
  async update(
    @Param('id') id: string,
    @Body() updateSurveillanceTypeDto: UpdateSurveillanceTypeDto,
  ): Promise<SurveillanceTypeResponse> {
    const surveillance = await this.surveillanceTypeService.update(
      id,
      updateSurveillanceTypeDto,
    );
    return {
      success: true,
      message: 'Surveillance type updated successfully',
      data: surveillance,
    };
  }

  // @Delete(':id')
  remove(@Param('id') id: string): Promise<CommonResponse<SurveillanceType>> {
    return this.surveillanceTypeService.remove(id);
  }
}
