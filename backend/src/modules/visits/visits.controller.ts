import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Param,
  Req,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AppAbility } from 'src/common/casl/abitlity.factory';
import { CheckPolicies } from 'src/common/decorators/check-policy.decorator';
import { ServiceScoped } from 'src/common/decorators/tenant-scope.decorator';
import { Action } from 'src/common/enums/action.enum';
import { PoliciesGuard } from 'src/common/guards/casl-policies.guard';
import {
  PaginatedVisitResponse,
  SubmitVisitResponse,
  VisitResponse,
  VisitSummaryResponse,
} from '../../common/dto/response/visit.response';
import { SamplesService } from '../samples/samples.service';
import { CreateVisitDto } from './dto/create-visit.dto';
import { SubmitVisitDto } from './dto/submit-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';
import { VisitService } from './visits.service';

@ApiBearerAuth()
@UseGuards(PoliciesGuard)
@Controller('visits')
// This flat controller's routes are all currently commented out - the live
// routes are nested under /projects/:projectId/visits/... in
// projects.controller.ts. None of these carry a :projectId, so they'd be
// denied outright by the ability factory's context-less fallback if
// re-enabled without this. The underlying services (getFilteredVisits,
// findById, update) filter by the caller's own memberships / the route's
// :projectId - see visits.service.ts.
@ServiceScoped(
  'caller-membership-filtered in VisitService; no :projectId on this flat route',
)
export class VisitController {
  constructor(
    private readonly visitService: VisitService,
    private readonly sampleService: SamplesService,
    // private readonly siteService: SitesService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({
    type: VisitSummaryResponse,

    exposeDefaultValues: true,
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    example: '2025-03-01T00:00:00Z',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    example: '2025-03-21T00:00:00Z',
  })
  // @Get('/visit-summary')
  async getVisitSummary(@Req() req): Promise<VisitSummaryResponse> {
    const userId = req.user.id; // Get logged-in user ID
    return {
      success: true,
      message: '',
      data: await this.visitService.getVisitSummary(userId, '', req.query),
    };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({
    type: VisitResponse,

    exposeDefaultValues: true,
  })
  // @Get(':id')
  @ApiParam({ name: 'id', type: String, description: 'Visit UUID' })
  async findById(@Param('id') id: string): Promise<VisitResponse> {
    const visit = await this.visitService.findById(id);
    for (const sample of visit.samples) {
      const signedUrls = await this.sampleService.getSignedUrlForSample(sample);
      sample.photos = signedUrls;
    }
    const signedUrls = await this.visitService.getSignedUrlForSample(visit);
    visit.photos = signedUrls;
    return {
      success: true,
      message: 'Visit fetched successfully',
      data: visit,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, 'visit'))
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({
    type: VisitResponse,

    exposeDefaultValues: true,
  })
  // @Post()
  async createVisit(
    @Body() createVisitDto: CreateVisitDto,
  ): Promise<VisitResponse> {
    const visit = await this.visitService.createVisit(createVisitDto);
    return {
      success: true,
      message: 'Visit created successfully',
      data: visit,
    };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({
    type: PaginatedVisitResponse,

    exposeDefaultValues: true,
  })
  @ApiQuery({ name: 'siteId', required: false, type: String })
  @ApiQuery({ name: 'disease', required: false, type: String })
  @ApiQuery({ name: 'siteType', required: false, type: String })
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
    example: '2024-12-31',
  })
  @ApiQuery({ name: 'isCompleted', required: false, type: Boolean })
  @ApiQuery({ name: 'assignedTo', required: false, type: Boolean })
  @ApiQuery({ name: 'visitStatus', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  // @Get()
  async getVisits(@Req() req): Promise<PaginatedVisitResponse> {
    const { user } = req;

    const visits = await this.visitService.getFilteredVisits(user, {
      ...req.query,
    });

    return {
      success: true,
      message: 'Visits fetched successfully',
      data: visits.docs,
      limit: visits.limit,
      page: visits.page,
      total: visits.total,
      totalPages: visits.totalPages,
    };
  }

  // @UseInterceptors(ClassSerializerInterceptor)
  // @SerializeOptions({ type: VisitResponse })
  // @Get('/collectors')
  // async findByToke(@Req() req): Promise<VisitResponse> {
  //   try {
  //     const { user } = req;
  //     const visits = await this.visitService.findByUserId(user.id);
  //     return new VisitResponse(true, 'Visits fetched successfully', visits);
  //   } catch (error) {
  //     return new VisitResponse(
  //       false,
  //       `Failed to fetch visits: ${error.message}`,
  //       null,
  //     );
  //   }
  // }

  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({
    type: VisitResponse,

    exposeDefaultValues: true,
  })
  // @Get('/collector/:id')
  @ApiParam({ name: 'id', type: String, description: 'User UUID' })
  async findByCollector(@Req() req): Promise<VisitResponse> {
    const { id } = req.params;
    const visits = await this.visitService.findByUserId(id);
    return {
      success: true,
      message: 'Visits fetched successfully',
      data: visits,
    };
  }

  @SerializeOptions({
    type: SubmitVisitResponse,
    exposeDefaultValues: true,
  })
  // @Put(':visitId/submit-visit')
  @ApiParam({ name: 'visitId', type: String, description: 'Visit UUID' })
  async submitVisit(
    @Param('visitId') visitId: string,
    @Body() createSampleDto: SubmitVisitDto,
  ): Promise<SubmitVisitResponse> {
    try {
      await this.visitService.submitVisit(visitId, createSampleDto);
      return {
        success: true,
        message: 'Visit submitted successfully',
      };
    } catch (error) {
      throw Error(error);
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({
    type: VisitResponse,

    exposeDefaultValues: true,
  })
  // @Put(':id')
  @ApiParam({ name: 'id', type: String, description: 'Visit UUID' })
  async update(
    @Param('id') id: string,
    @Body() updateVisitDto: UpdateVisitDto,
    @Req() req,
  ): Promise<VisitResponse> {
    const { user } = req;
    console.log(user);

    let updatedVisit = await this.visitService.update(id, updateVisitDto);
    const signedUrls =
      await this.visitService.getSignedUrlForSample(updatedVisit);
    updatedVisit.photos = signedUrls;

    if (
      updateVisitDto.suspectDiseaseData &&
      updateVisitDto.suspectDiseaseData.length > 0
    ) {
      const updatePromises = updateVisitDto.suspectDiseaseData.map((data) =>
        this.visitService.updateSuspectedPositives(
          id,
          data.diseaseId,
          data.sampleCount,
          data.isSuspectedPositive,
        ),
      );

      const updatedVisits = await Promise.all(updatePromises);
      updatedVisit = updatedVisits[updatedVisits.length - 1];
    }

    return {
      success: true,
      message: 'Visit updated successfully',
      data: updatedVisit,
    };
  }
}
