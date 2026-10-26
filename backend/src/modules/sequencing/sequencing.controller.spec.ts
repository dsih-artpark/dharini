import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { SequencingController } from './sequencing.controller';
import { SequencingJobsService } from './sequencing-jobs.service';
import { LabSamplesSearchService } from './lab-samples-search.service';
import { NcbiService } from './ncbi.service';
import { SequencingUploadsService } from './sequencing-uploads.service';
import { PipelineApiService } from './pipeline/pipeline-api.service';
import { isOwnedUploadKey } from './sequencing-upload-key.util';
import { JwtAuthGuard } from '../auth/auth.guard';
import { PoliciesGuard } from 'src/common/guards/casl-policies.guard';

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn(
    async () => 'https://s3.example/bucket/key?X-Amz-Signature=abc',
  ),
}));

const FOLDER = 'SDS004-ES_App_Data';
const AUTHENTICATED_USER_ID = '11111111-1111-4111-8111-111111111111';

const config: Record<string, string> = {
  S3_BUCKET: 'dsih-artpark-04-staging-data',
  S3_FOLDER: FOLDER,
  SIGNED_URL_EXPIRY: '3600',
};

describe('SequencingController upload presigning', () => {
  let controller: SequencingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SequencingController],
      providers: [
        SequencingUploadsService,
        {
          provide: ConfigService,
          useValue: {
            get: (k: string) => config[k],
            getOrThrow: (k: string) => config[k],
          },
        },
        { provide: SequencingJobsService, useValue: {} },
        { provide: LabSamplesSearchService, useValue: {} },
        { provide: NcbiService, useValue: {} },
        { provide: PipelineApiService, useValue: {} },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PoliciesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(SequencingController);
  });

  it('scopes the upload key to the authenticated user, ignoring the request body', async () => {
    const req = { user: { id: AUTHENTICATED_USER_ID } };

    const response = await controller.presignUpload(req, {
      filename: 'reads.fastq.gz',
      contentLength: 500,
      // a client trying to nominate someone else's namespace
      userId: '99999999-9999-4999-8999-999999999999',
    } as never);

    expect(
      isOwnedUploadKey(response.data.key, {
        folder: FOLDER,
        userId: AUTHENTICATED_USER_ID,
      }),
    ).toBe(true);
  });

  it('returns the content type the browser must send', async () => {
    const req = { user: { id: AUTHENTICATED_USER_ID } };

    const response = await controller.presignUpload(req, {
      filename: 'reads.fastq.gz',
      contentLength: 500,
    });

    expect(response.data.contentType).toBe('application/octet-stream');
    expect(response.data.uploadUrl).toContain('X-Amz-Signature');
  });
});

describe('SequencingController.getPipelines', () => {
  let controller: SequencingController;
  let pipelineApi: { listPipelines: jest.Mock };

  beforeEach(async () => {
    pipelineApi = { listPipelines: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SequencingController],
      providers: [
        { provide: SequencingUploadsService, useValue: {} },
        { provide: SequencingJobsService, useValue: {} },
        { provide: LabSamplesSearchService, useValue: {} },
        { provide: NcbiService, useValue: {} },
        { provide: PipelineApiService, useValue: pipelineApi },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PoliciesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(SequencingController);
  });

  it('strips resource params from paramsSchema before returning the catalog, without touching the underlying pipeline definition', async () => {
    const rawPipeline = {
      id: 'ont-lsdv',
      version: '1.0.0',
      stages: ['basecall'],
      paramsSchema: {
        type: 'object',
        properties: {
          threads: { type: 'integer', default: 4 },
          minDepth: { type: 'integer', default: 10 },
          clair3: {
            type: 'object',
            properties: {
              model_path: { type: 'string', default: '/opt/models/ont' },
              platform: { type: 'string', enum: ['ont'] },
            },
            required: ['model_path', 'platform'],
          },
        },
        required: ['threads', 'minDepth', 'clair3'],
      },
      acceptedExtensions: ['.fastq'],
      extraInputs: [],
      displayName: 'Oxford Nanopore — LSDV',
      description: null,
    };
    pipelineApi.listPipelines.mockResolvedValue([rawPipeline]);

    const response = await controller.getPipelines();

    const presented = response.data[0].paramsSchema as any;
    // clair3 disappears entirely: both of its properties are infrastructure,
    // so the group has nothing left to configure and an empty titled box in
    // the form would be worse than no box at all.
    expect(Object.keys(presented.properties)).toEqual(['minDepth']);
    expect(presented.required).toEqual(['minDepth']);
    expect(presented.properties.clair3).toBeUndefined();

    // The object handed back by PipelineApiService is not mutated.
    expect(rawPipeline.paramsSchema.properties).toHaveProperty('threads');
  });
});
