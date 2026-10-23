import {
  Body,
  Controller,
  Get,
  Param,
  Query,
  Req,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AppAbility } from 'src/common/casl/abitlity.factory';
import { CheckPolicies } from 'src/common/decorators/check-policy.decorator';
import { ServiceScoped } from 'src/common/decorators/tenant-scope.decorator';
import {
  LabTestResponse,
  ListLabTestResponse,
} from 'src/common/dto/response/lab-test.response';
import {
  PaginatedSampleResponse,
  SampleBreakDownResponse,
  SampleResponse,
  SampleStatLogisticResponse,
} from 'src/common/dto/response/sample.response';
import { ListAnimalMetadataResponse } from 'src/common/dto/response/animal-metadata.response';
import { Action } from 'src/common/enums/action.enum';
import { PoliciesGuard } from 'src/common/guards/casl-policies.guard';
import { CreateMultipleLabTestDto } from '../lab-tests/dto/create-lab-test.dto';
import { UpdateMultipleLabTestDto } from '../lab-tests/dto/update-lab-test.dto';
import { LabTestsService } from '../lab-tests/lab-tests.service';
import { CreateSampleDto } from './dto/create-sample.dto';
import { UpdateSampleDto } from './dto/update-sample.dto';
import { SamplesService } from './samples.service';

@ApiBearerAuth()
@ApiTags('samples')
@UseGuards(PoliciesGuard)
@Controller('samples')
// None of this controller's routes resolve a `:projectId`/`:workspaceId` -
// the live route (`GET animal-metadata/by-site/:siteId`) is scoped inside
// SamplesService.getAnimalMetadataBySite() via resolveTenantScope() +
// canReachProject() against the site's owning project (see A13). If any of
// the currently-commented-out routes in this file are ever re-enabled,
// audit them for the same guarantee before removing this annotation.
@ServiceScoped(
  'no route param here carries the tenant - SamplesService filters every route in this controller by the callers resolveTenantScope() reachable projects/teams before returning rows',
)
export class SamplesController {
  constructor(
    private readonly samplesService: SamplesService,
    private readonly labTestsService: LabTestsService,
  ) {}

  // ─── Animal Metadata ──────────────────────────────────────────────────────

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'sample'))
  @SerializeOptions({
    type: ListAnimalMetadataResponse,
    exposeDefaultValues: true,
  })
  @Get('animal-metadata/by-site/:siteId')
  @ApiOperation({
    operationId: 'samplesControllerGetAnimalMetadataBySite',
    summary: 'List all animals recorded at a site',
    description:
      'Returns every AnimalMetadata record ever attached to a sample at the given site, newest-first. Used by the mobile app to let collectors pick an existing animal instead of re-entering metadata.',
  })
  @ApiParam({ name: 'siteId', type: String, description: 'Site UUID' })
  @ApiOkResponse({ type: ListAnimalMetadataResponse })
  async getAnimalMetadataBySite(
    @Param('siteId') siteId: string,
    @Req() req,
  ): Promise<ListAnimalMetadataResponse> {
    const { user } = req;
    const data = await this.samplesService.getAnimalMetadataBySite(
      siteId,
      user,
    );
    return {
      success: true,
      message: 'Animal metadata fetched successfully',
      data,
    };
  }

  // ─── Samples ──────────────────────────────────────────────────────────────

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, 'sample'))
  @SerializeOptions({
    type: SampleResponse,
    exposeDefaultValues: true,
  })
  // @Post()
  async create(
    @Body() createSampleDto: CreateSampleDto,
    // @Req() req
  ): Promise<SampleResponse> {
    // const {user} = req;

    const sample = await this.samplesService.create(createSampleDto);
    const signedUrls = await this.samplesService.getSignedUrlForSample(sample);
    sample.photos = signedUrls;

    return {
      success: true,
      message: 'Sample created successfully',
      data: sample,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'sample'))
  // @Get('site-wise-breakdown')
  @ApiQuery({
    name: 'disease',
    required: false,
    type: String,
    example: 'disease UUID',
  })
  @ApiQuery({
    name: 'region',
    required: false,
    type: String,
    example: 'district_501',
  })
  async sieWiseSampleBreakDown(
    @Query() query,
    @Req() req,
  ): Promise<SampleBreakDownResponse> {
    const { user } = req;
    const sample = await this.samplesService.sampleBreakDown(query, user);
    return {
      success: true,
      message: 'Samples breakdown fetched successfully',
      data: sample,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'sample'))
  @SerializeOptions({
    type: PaginatedSampleResponse,
    exposeDefaultValues: true,
  })
  // @Get()
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'referenceBatchId', required: false, type: String })
  @ApiQuery({ name: 'sampleTypeId', required: false, type: String })
  @ApiQuery({ name: 'sampleStatus', required: false, type: String })
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
    example: '2024-01-31',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'diseaseId',
    required: false,
    type: String,
    example: 'disease UUID',
  })
  @ApiQuery({
    name: 'siteId',
    required: false,
    type: String,
    example: 'site UUID',
  })
  @ApiQuery({
    name: 'visitId',
    required: false,
    type: String,
    example: 'visit UUID',
  })
  async findAll(@Query() query): Promise<PaginatedSampleResponse> {
    const sample = await this.samplesService.findAll(query);
    return {
      success: true,
      message: 'Samples fetched successfully',
      data: sample.docs,
      limit: sample.limit,
      page: sample.page,
      total: sample.total,
      totalPages: sample.totalPages,
    };
  }

  // @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'sample'))
  // @Get('lab-stats')
  // @ApiQuery({
  //   name: 'diseaseId',
  //   required: false,
  //   type: String,
  //   example: 'disease UUID',
  // })
  // @ApiQuery({
  //   name: 'startDate',
  //   required: false,
  //   type: String,
  //   example: '2024-01-01',
  // })
  // @ApiQuery({
  //   name: 'endDate',
  //   required: false,
  //   type: String,
  //   example: '2024-12-31',
  // })
  // async getLabTestStats(@Req() req): Promise<SampleStatLogisticResponse> {
  //   const { user } = req;
  //   const sample = await this.samplesService.getSampleStatsForLab(
  //     req.query,
  //     user,
  //   );
  //   return {
  //     success: true,
  //     message: 'Lab Samples stats fetched successfully',
  //     data: sample,
  //   };
  // }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'sample'))
  // @Get('sample-stat-logistics')
  @ApiQuery({
    name: 'diseaseId',
    required: false,
    type: String,
    example: 'disease UUID',
  })
  async getSampleStatLogistics(
    @Req() req,
  ): Promise<SampleStatLogisticResponse> {
    const { user } = req;
    const sample = await this.samplesService.getSampleStatLogistics(
      req.query,
      user,
    );
    return {
      success: true,
      message: 'Lab sample stats fetched successfully',
      data: sample,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'sample'))
  @SerializeOptions({
    type: SampleResponse,
    exposeDefaultValues: true,
  })
  // @Get(':id')
  @ApiParam({ name: 'id', type: String, description: 'Sample UUID' })
  async findOne(@Param('id') id: string): Promise<SampleResponse> {
    const sample = await this.samplesService.findOne({ id });
    return {
      success: true,
      message: 'Sample fetched successfully',
      data: sample,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, 'sample'))
  @SerializeOptions({
    type: SampleResponse,

    exposeDefaultValues: true,
  })
  // @Patch(':id')
  @ApiParam({ name: 'id', type: String, description: 'Sample UUID' })
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateSampleDto: UpdateSampleDto,
  ): Promise<SampleResponse> {
    const { user } = req;
    const sample = await this.samplesService.update(id, updateSampleDto, user);
    return {
      success: true,
      message: 'Sample updated successfully',
      data: sample,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, 'sample'))
  // @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.samplesService.remove(+id);
    return {
      success: true,
      message: 'Sample deleted successfully',
    };
  }

  // Lab test apis
  // @Post(':sampleId/lab-tests')
  @SerializeOptions({
    type: ListLabTestResponse,
    exposeDefaultValues: true,
  })
  async createLabTest(
    @Param('sampleId') sampleId: string,
    @Body() createMultipleLabTestDto: CreateMultipleLabTestDto,
    // @Req() req
  ): Promise<ListLabTestResponse> {
    // const {user} = req;
    createMultipleLabTestDto.sample = sampleId;
    const labTest = await this.labTestsService.create(createMultipleLabTestDto);
    return {
      success: true,
      message: 'Lab tests created successfully',
      data: labTest,
    };
  }

  // @Patch(':sampleId/lab-tests')
  @SerializeOptions({
    type: ListLabTestResponse,
    exposeDefaultValues: true,
  })
  async updateLabTest(
    @Param('sampleId') sampleId: string,
    @Body() updateMultipleLabTestDto: UpdateMultipleLabTestDto,
  ): Promise<ListLabTestResponse> {
    updateMultipleLabTestDto.sample = sampleId;
    const labTests = await this.labTestsService.update(
      updateMultipleLabTestDto,
    );
    return {
      success: true,
      message: 'Lab tests updated successfully',
      data: labTests,
    };
  }

  // @Get(':sampleId/lab-tests/:labTestId')
  @SerializeOptions({
    type: LabTestResponse,
    exposeDefaultValues: true,
  })
  async getLabTest(
    @Param('labTestId') labTestId,
    // @Req() req
  ): Promise<LabTestResponse> {
    // const {user} = req;

    const labTest = await this.labTestsService.findOne({ id: labTestId });
    return {
      success: true,
      message: 'Lab test fetched successfully',
      data: labTest,
    };
  }

  // @Get(':sampleId/lab-tests')
  @SerializeOptions({
    type: ListLabTestResponse,
    exposeDefaultValues: true,
  })
  async getLabTests(
    @Query() query,
    @Param('sampleId') sampleId,
    // @Req() req
  ): Promise<ListLabTestResponse> {
    // const {user} = req;

    const labTest = await this.labTestsService.findAll({
      ...query,
      sampleId: sampleId,
    });
    return {
      success: true,
      message: 'Lab tests fetched successfully',
      data: labTest,
    };
  }
}
