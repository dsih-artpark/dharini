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
import { AppAbility } from 'src/common/casl/abitlity.factory';
import { CheckPolicies } from 'src/common/decorators/check-policy.decorator';
import { TenantAgnostic } from 'src/common/decorators/tenant-scope.decorator';
import { Action } from 'src/common/enums/action.enum';
import {
  DiseaseResponse,
  ListDiseaseResponse,
} from 'src/common/dto/response/disease.response';
import { PoliciesGuard } from 'src/common/guards/casl-policies.guard';
import { CommonResponse } from 'src/common/types/common-response.type';
import { Disease } from 'src/entities/disease.entity';
import { DiseaseService } from './disease.service';
import { CreateDiseaseDto } from './dto/create-disease.dto';
import { UpdateDiseaseDto } from './dto/update-disease.dto';

@ApiBearerAuth()
@UseGuards(PoliciesGuard)
@Controller('disease')
// Genuinely global reference data (diseases belong to no tenant) - every
// route here is CRUD over that reference table, so the permission union
// is the correct and complete check. The tenant-scoped disease-wise sample
// statistics route lives on StatisticsController, not here.
@TenantAgnostic()
export class DiseaseController {
  constructor(private readonly diseaseService: DiseaseService) {}

  @Post()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, 'disease'))
  @SerializeOptions({ type: DiseaseResponse, exposeDefaultValues: true })
  async create(
    @Body() createDiseaseDto: CreateDiseaseDto,
  ): Promise<DiseaseResponse> {
    const disease = await this.diseaseService.create(createDiseaseDto);
    return {
      success: true,
      message: 'Disease created successfully',
      data: disease,
    };
  }

  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'disease'))
  @SerializeOptions({ type: ListDiseaseResponse, exposeDefaultValues: true })
  async findAll(): Promise<ListDiseaseResponse> {
    const disease = await this.diseaseService.findAll({});
    return {
      success: true,
      message: 'Diseases fetched successfully',
      data: disease,
    };
  }

  @Get(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'disease'))
  @ApiParam({ name: 'id', type: String, description: 'Disease UUID' })
  @SerializeOptions({ type: DiseaseResponse, exposeDefaultValues: true })
  async findOne(@Param('id') id: string): Promise<DiseaseResponse> {
    const disease = await this.diseaseService.findOne({ id });
    return {
      success: true,
      message: 'Disease fetched successfully',
      data: disease,
    };
  }

  @Patch(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, 'disease'))
  @ApiParam({ name: 'id', type: String, description: 'Disease UUID' })
  @SerializeOptions({ type: DiseaseResponse, exposeDefaultValues: true })
  async update(
    @Param('id') id: string,
    @Body() updateDiseaseDto: UpdateDiseaseDto,
  ): Promise<DiseaseResponse> {
    const disease = await this.diseaseService.update(id, updateDiseaseDto);
    return {
      success: true,
      message: 'Disease updated successfully',
      data: disease,
    };
  }

  // @Delete(':id')
  async remove(@Param('id') id: string): Promise<CommonResponse<Disease>> {
    const disease = await this.diseaseService.remove(id);
    return {
      success: true,
      message: 'Disease deleted successfully',
      data: disease,
    };
  }
}
