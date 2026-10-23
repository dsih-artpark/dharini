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
import { SampleType } from 'src/entities/sample-type.entity';
import { CreateSampleTypeDto } from './dto/create-sample-type.dto';
import { UpdateSampleTypeDto } from './dto/update-sample-type.dto';
import { SampleTypeService } from './sample-type.service';
import {
  ListSampleTypeResponse,
  SampleTypeResponse,
} from 'src/common/dto/response/sample-type.response';

import { PoliciesGuard } from 'src/common/guards/casl-policies.guard';
import { TenantAgnostic } from 'src/common/decorators/tenant-scope.decorator';
import {
  AnyAuthenticated,
  CheckPolicies,
} from 'src/common/decorators/check-policy.decorator';
import { AppAbility } from 'src/common/casl/abitlity.factory';

@ApiBearerAuth()
@UseGuards(PoliciesGuard)
// Global reference data: owned by no workspace or project, so there is no
// tenant to scope against. Declared explicitly because PoliciesGuard now
// denies context-less routes that claim neither opt-in.
@TenantAgnostic()
@Controller('sample-type')
export class SampleTypeController {
  constructor(private readonly sampleTypeService: SampleTypeService) {}

  @CheckPolicies((ability: AppAbility) => ability.can('manage', 'sample-type'))
  @Post()
  @SerializeOptions({ type: SampleTypeResponse, exposeDefaultValues: true })
  async create(
    @Body() createSampleTypeDto: CreateSampleTypeDto,
  ): Promise<SampleTypeResponse> {
    const sampleType = await this.sampleTypeService.create(createSampleTypeDto);
    return {
      success: true,
      message: 'Sample type created successfully',
      data: sampleType,
    };
  }

  // No seeded role holds a `read sample-type` permission - only
  // workspace-admin has `manage`. Requiring one here would lock every
  // field role out of a list they need, so state the real requirement
  // (a valid JWT) rather than leaving the route with no policy at all.
  @CheckPolicies(AnyAuthenticated)
  @Get()
  @SerializeOptions({ type: ListSampleTypeResponse, exposeDefaultValues: true })
  async findAll(): Promise<ListSampleTypeResponse> {
    const sampleTypes = await this.sampleTypeService.findAll({});
    return {
      success: true,
      message: 'Sample types fetched successfully',
      data: sampleTypes,
    };
  }

  @CheckPolicies(AnyAuthenticated)
  @Get(':id')
  @ApiParam({ name: 'id', type: String, description: 'Sample type UUID' })
  @SerializeOptions({ type: SampleTypeResponse, exposeDefaultValues: true })
  async findOne(@Param('id') id: string): Promise<SampleTypeResponse> {
    const sampleType = await this.sampleTypeService.findOne({ id });
    return {
      success: true,
      message: 'Sample type fetched successfully',
      data: sampleType,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can('manage', 'sample-type'))
  @Patch(':id')
  @ApiParam({ name: 'id', type: String, description: 'Sample type UUID' })
  @SerializeOptions({ type: SampleTypeResponse, exposeDefaultValues: true })
  async update(
    @Param('id') id: string,
    @Body() updateSampleTypeDto: UpdateSampleTypeDto,
  ): Promise<SampleTypeResponse> {
    const updatedSampleType = await this.sampleTypeService.update(
      id,
      updateSampleTypeDto,
    );
    return {
      success: true,
      message: 'Sample type updated successfully',
      data: updatedSampleType,
    };
  }

  // @Delete(':id')
  async remove(@Param('id') id: string): Promise<CommonResponse<SampleType>> {
    await this.sampleTypeService.remove(id);
    return {
      success: true,
      message: 'Sample type deleted successfully',
    };
  }
}
