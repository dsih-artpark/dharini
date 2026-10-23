import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  Body,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { AppAbility } from 'src/common/casl/abitlity.factory';
import { CheckPolicies } from 'src/common/decorators/check-policy.decorator';
import {
  ServiceScoped,
  TenantAgnostic,
} from 'src/common/decorators/tenant-scope.decorator';
import { Action } from 'src/common/enums/action.enum';
import { PoliciesGuard } from 'src/common/guards/casl-policies.guard';

import { SequencingJobsService } from './sequencing-jobs.service';
import { LabSamplesSearchService } from './lab-samples-search.service';
import { NcbiService } from './ncbi.service';
import { SequencingUploadsService } from './sequencing-uploads.service';
import { PipelineApiService } from './pipeline/pipeline-api.service';
import { SubmitSequencingJobDto } from './dto/submit-sequencing-job.dto';
import { PresignUploadDto } from './dto/presign-upload.dto';
import { stripResourceParams } from './pipeline/strip-resource-params.util';

/**
 * None of these routes carry a `:projectId`/`:workspaceId` segment, so
 * `AbilityFactory` cannot resolve a tenant from the URL. Under the
 * default-deny rule in `PoliciesGuard` that means every route must declare
 * one of:
 *
 *   @ServiceScoped(...)  the service narrows to the caller's reachable
 *                        projects itself - see SequencingJobsService's
 *                        `accessContext`/`isAccessible` pair, which is the
 *                        single choke point every tenant-owned read passes
 *                        through.
 *   @TenantAgnostic()    the route reads no tenant-owned row at all: it
 *                        either proxies the external pipeline/NCBI service
 *                        or works purely inside the caller's own
 *                        `uploads/<userId>/...` key namespace.
 *
 * `sequencing` only has `create` and `read` permissions (see seeder/data.ts),
 * so `retry` - which mints a brand new run - checks `create` rather than
 * `update`.
 */
@ApiBearerAuth()
@UseGuards(PoliciesGuard)
@Controller('sequencing')
export class SequencingController {
  constructor(
    private sequencingService: SequencingJobsService,
    private labSamplesService: LabSamplesSearchService,
    private ncbiService: NcbiService,
    private uploadsService: SequencingUploadsService,
    private pipelineApi: PipelineApiService,
  ) {}

  @Post('uploads/presign')
  @TenantAgnostic()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, 'sequencing'),
  )
  async presignUpload(@Req() req, @Body() dto: PresignUploadDto) {
    const target = await this.uploadsService.createUploadTarget(
      req.user.id,
      dto,
    );
    return { success: true, data: target };
  }

  @Get('lab-samples/search')
  @ServiceScoped(
    'LabSamplesSearchService.search narrows to the caller’s reachable projects via resolveTenantScope, failing closed to [] otherwise',
  )
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, 'sequencing'),
  )
  async searchLabSamples(@Req() req, @Query('q') query?: string) {
    const results = await this.labSamplesService.search(query, req.user);
    return { success: true, data: results };
  }

  @Get('ncbi/preview')
  @TenantAgnostic()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, 'sequencing'),
  )
  async getNcbiPreview(@Query('accession') accession: string) {
    if (!accession)
      throw new BadRequestException('Accession parameter required');
    const result = await this.ncbiService.fetchSummary(accession);
    return { success: true, data: result };
  }

  @Get('pipelines')
  @TenantAgnostic()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, 'sequencing'),
  )
  async getPipelines() {
    const data = await this.pipelineApi.listPipelines();
    // Presentation filter only — see stripResourceParams. What gets
    // forwarded to POST /v1/runs is untouched by this.
    const presented = data.map((pipeline) => ({
      ...pipeline,
      paramsSchema: stripResourceParams(pipeline.paramsSchema),
    }));
    return { success: true, data: presented };
  }

  @Get('queue')
  @TenantAgnostic()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, 'sequencing'),
  )
  async getQueue() {
    // Aggregate depth/capacity of the shared pipeline queue, not a listing of
    // anybody's runs — there is no tenant-owned row here to scope.
    const data = await this.pipelineApi.getQueue();
    return { success: true, data };
  }

  @Post('jobs/submit')
  @ServiceScoped(
    'SequencingJobsService.submitJob validates the resolved project (from the lab sample, or dto.projectId otherwise) against the caller’s tenant scope before creating anything',
  )
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, 'sequencing'),
  )
  async submitJob(@Req() req, @Body() dto: SubmitSequencingJobDto) {
    const data = await this.sequencingService.submitJob(req.user, dto);
    return { success: true, data };
  }

  @Get('jobs')
  @ServiceScoped(
    'SequencingJobsService.findAllJobs filters by isAccessible, which admits a run only if the caller submitted it or its project is in their reachable set',
  )
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, 'sequencing'),
  )
  async getAllJobs(@Req() req, @Query('workspaceId') workspaceId?: string) {
    const ctx = await this.sequencingService.accessContext(
      req.user,
      workspaceId,
    );
    const jobs = await this.sequencingService.findAllJobs(ctx);
    return { success: true, data: jobs };
  }

  /** Presigned URL for one artifact, minted when the user actually asks for it. */
  @Get('jobs/:id/artifacts/:filename/url')
  @ServiceScoped(
    'SequencingJobsService.getArtifactUrl resolves the job through findAccessibleJob, which 404s anything outside the caller’s tenant scope',
  )
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, 'sequencing'),
  )
  async getArtifactUrl(
    @Req() req,
    @Param('id') id: string,
    @Param('filename') filename: string,
    @Query('inline') inline?: string,
  ) {
    const ctx = await this.sequencingService.accessContext(req.user);
    const data = await this.sequencingService.getArtifactUrl(
      ctx,
      id,
      filename,
      inline === 'true',
    );
    return { success: true, data };
  }

  /** Re-runs a failed job against the same input and parameters. */
  @Post('jobs/:id/retry')
  @ServiceScoped(
    'SequencingJobsService.retryJob resolves the job through assertSubmissionAccessible before resubmitting, so a run outside the caller’s tenant scope 404s',
  )
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, 'sequencing'),
  )
  async retryJob(@Req() req, @Param('id') id: string) {
    const ctx = await this.sequencingService.accessContext(req.user);
    const result = await this.sequencingService.retryJob(ctx, id);
    return { success: true, data: result };
  }

  @Get('jobs/:id/progress')
  @ServiceScoped(
    'SequencingJobsService.getJobProgress resolves the job through findAccessibleJob, which 404s anything outside the caller’s tenant scope',
  )
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, 'sequencing'),
  )
  async getJobProgress(@Req() req, @Param('id') id: string) {
    const ctx = await this.sequencingService.accessContext(req.user);
    const data = await this.sequencingService.getJobProgress(ctx, id);
    return { success: true, data };
  }

  @Get('jobs/:id/variants')
  @ServiceScoped(
    'SequencingJobsService.getJobVariants resolves the job through findAccessibleJob, which 404s anything outside the caller’s tenant scope',
  )
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, 'sequencing'),
  )
  async getJobVariants(@Req() req, @Param('id') id: string) {
    const ctx = await this.sequencingService.accessContext(req.user);
    const data = await this.sequencingService.getJobVariants(ctx, id);
    return { success: true, data };
  }

  @Get('jobs/:id/artifacts')
  @ServiceScoped(
    'SequencingJobsService.getJobArtifacts resolves the job through findAccessibleJob, which 404s anything outside the caller’s tenant scope',
  )
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, 'sequencing'),
  )
  async getJobArtifacts(@Req() req, @Param('id') id: string) {
    const ctx = await this.sequencingService.accessContext(req.user);
    const data = await this.sequencingService.getJobArtifacts(ctx, id);
    return { success: true, data };
  }

  @Get('jobs/:id')
  @ServiceScoped(
    'SequencingJobsService.findOneJob returns null unless isAccessible admits the run for this caller',
  )
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, 'sequencing'),
  )
  async getJob(@Req() req, @Param('id') id: string) {
    const ctx = await this.sequencingService.accessContext(req.user);
    const job = await this.sequencingService.findOneJob(ctx, id);
    return { success: true, data: job };
  }

  @Get()
  @ServiceScoped(
    'SequencingJobsService.findAllSubmissions filters by isAccessible, which admits a submission only if the caller made it or its project is in their reachable set',
  )
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, 'sequencing'),
  )
  async getAllSubmissions(
    @Req() req,
    @Query('workspaceId') workspaceId?: string,
  ) {
    const ctx = await this.sequencingService.accessContext(
      req.user,
      workspaceId,
    );
    const submissions = await this.sequencingService.findAllSubmissions(ctx);
    return { success: true, data: submissions };
  }

  @Get(':id')
  @ServiceScoped(
    'SequencingJobsService.findOneSubmission returns null unless isAccessible admits the submission for this caller',
  )
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, 'sequencing'),
  )
  async getSubmission(@Req() req, @Param('id') id: string) {
    const ctx = await this.sequencingService.accessContext(req.user);
    const submission = await this.sequencingService.findOneSubmission(ctx, id);
    return { success: true, data: submission };
  }
}
