import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { SequencingSubmission } from '../../entities/sequencing-submission.entity';
import { SequencingJob } from '../../entities/sequencing-job.entity';
import { Sample } from '../../entities/sample.entity';
import { LabTest } from '../../entities/lab-test.entity';
import { Project } from '../../entities/project.entity';
import { PipelineWebhookDelivery } from '../../entities/pipeline-webhook-delivery.entity';
import { PipelineVariant } from '../../entities/pipeline-variant.entity';

import { SequencingJobsService } from './sequencing-jobs.service';
import { LabSamplesSearchService } from './lab-samples-search.service';
import { NcbiService } from './ncbi.service';
import { SequencingUploadsService } from './sequencing-uploads.service';
import { SequencingController } from './sequencing.controller';
import { PipelineApiService } from './pipeline/pipeline-api.service';
import { PipelineReconciliationService } from './pipeline/pipeline-reconciliation.service';
import { RunResultService } from './pipeline/run-result.service';
import { PipelineWebhookService } from './pipeline/webhook/pipeline-webhook.service';
import { PipelineWebhookController } from './pipeline/webhook/pipeline-webhook.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SequencingSubmission,
      SequencingJob,
      Sample,
      LabTest,
      Project,
      PipelineWebhookDelivery,
      PipelineVariant,
    ]),
    HttpModule,
  ],
  controllers: [SequencingController, PipelineWebhookController],
  providers: [
    SequencingJobsService,
    LabSamplesSearchService,
    NcbiService,
    SequencingUploadsService,
    PipelineApiService,
    PipelineReconciliationService,
    RunResultService,
    PipelineWebhookService,
  ],
  exports: [SequencingJobsService, NcbiService, SequencingUploadsService],
})
export class SequencingModule {}
