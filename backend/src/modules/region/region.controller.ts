import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  SerializeOptions,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AppAbility } from 'src/common/casl/abitlity.factory';
import { CheckPolicies } from 'src/common/decorators/check-policy.decorator';
import { Action } from 'src/common/enums/action.enum';
import {
  ConvertExcelResponse,
  ListRegionResponse,
  ProjectLocationStateResponse,
  RegionResponse,
} from 'src/common/dto/response/region.response';
import { RegionResponseDto } from 'src/common/types/common-response.dto';
import { CommonResponse } from 'src/common/types/common-response.type';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { RegionService } from './region.service';
import { PoliciesGuard } from 'src/common/guards/casl-policies.guard';
import { TenantAgnostic } from 'src/common/decorators/tenant-scope.decorator';

@ApiBearerAuth()
@UseGuards(PoliciesGuard)
// Global reference data: owned by no workspace or project, so there is no
// tenant to scope against. Declared explicitly because PoliciesGuard now
// denies context-less routes that claim neither opt-in.
@TenantAgnostic()
@Controller('regions')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @SerializeOptions({ type: RegionResponse })
  @Post()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, 'region'))
  @SerializeOptions({ type: RegionResponseDto })
  async create(
    @Body() createRegionDto: CreateRegionDto,
  ): Promise<RegionResponse> {
    const region = await this.regionService.create(createRegionDto);
    return {
      success: true,
      message: 'Region create successfully',
      data: region,
    };
  }

  @SerializeOptions({ type: ListRegionResponse, exposeDefaultValues: true })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'region'))
  @ApiQuery({ name: 'type', required: true, type: String, example: 'STATE' })
  @ApiQuery({
    name: 'select',
    required: true,
    type: String,
    example: '["name","metadata"]',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description:
      'this search the name of the region, it needs type, if you want to search state then the type query should be state',
    example: 'andaman',
  })
  @ApiQuery({
    name: 'select',
    required: false,
    type: String,
    example: 'id,name',
  })
  @Get()
  async findAll(@Req() req): Promise<ListRegionResponse> {
    const regions = await this.regionService.findAll(req.query);
    return {
      success: true,
      message: 'Regions fetched successfully',
      data: regions,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'region'))
  @Get('project-location')
  @SerializeOptions({
    type: ProjectLocationStateResponse,
    exposeDefaultValues: true,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description:
      'this search the name of the region, it needs type, if you want to search state then the type query should be state',
    example: 'andaman',
  })
  async findAllRegionsForInProject(
    @Req() req,
  ): Promise<ProjectLocationStateResponse> {
    const regions = await this.regionService.findAllRegionsAvailableInProject(
      req.query ?? {},
      req.user,
    );
    return {
      success: true,
      message: 'Regions fetched successfully',
      data: regions,
    };
  }

  @SerializeOptions({ type: RegionResponse, exposeDefaultValues: true })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'region'))
  @Get(':id')
  @ApiParam({ name: 'id', type: String, description: 'Region UUID' })
  async findOne(@Param('id') id: string): Promise<RegionResponse> {
    const regions = await this.regionService.findOne(id);
    return {
      success: true,
      message: 'Region fetched successfully',
      data: regions,
    };
  }

  @SerializeOptions({ type: RegionResponse, exposeDefaultValues: true })
  @Patch(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, 'region'))
  @ApiParam({ name: 'id', type: String, description: 'Region UUID' })
  @SerializeOptions({ type: RegionResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateRegionDto: UpdateRegionDto,
  ): Promise<RegionResponse> {
    const region = await this.regionService.update(id, updateRegionDto);
    return {
      success: true,
      message: 'Region updated successfully',
      data: region,
    };
  }

  // @Delete(':id')
  async remove(@Param('id') id: string): Promise<CommonResponse<void>> {
    const data = await this.regionService.remove(id);
    return {
      success: true,
      message: 'Region removed successfully',
      data: data,
    };
  }

  @SerializeOptions({ type: ConvertExcelResponse })
  @Post('import/district')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, 'region'))
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcelFileDistrict(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ConvertExcelResponse> {
    if (!file) {
      throw new Error('No file uploaded');
    }

    // Pass the file path to the service
    await this.regionService.convertExcelToJsonDistrict(file.buffer);
    return {
      success: true,
      message: 'Locations imported successfully',
      // data: locations,
    };
  }

  @SerializeOptions({ type: ConvertExcelResponse })
  @Post('import/state')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, 'region'))
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcelFileState(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ConvertExcelResponse> {
    if (!file) {
      throw new Error('No file uploaded');
    }

    // Pass the file path to the service
    await this.regionService.convertExcelToJsonState(file.buffer);
    return {
      success: true,
      message: 'Locations imported successfully',
      // data: locations,
    };
  }
}
