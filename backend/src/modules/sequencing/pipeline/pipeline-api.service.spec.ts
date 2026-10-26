import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosError, AxiosHeaders } from 'axios';
import { of, throwError } from 'rxjs';

import { PipelineApiService } from './pipeline-api.service';
import {
  PipelineInputTooLargeError,
  PipelineNotFoundError,
  PipelineValidationError,
  PipelineApiError,
} from './pipeline-api.types';

function axiosResponse(data: any, status = 200) {
  return { data, status, statusText: '', headers: {}, config: {} as any };
}

function axiosError(status: number, data?: any): AxiosError {
  const err = new AxiosError('Request failed', String(status));
  err.response = {
    data,
    status,
    statusText: '',
    headers: {},
    config: { headers: new AxiosHeaders() } as any,
  };
  return err;
}

describe('PipelineApiService', () => {
  let httpService: { get: jest.Mock; post: jest.Mock };
  let configValues: Record<string, string | undefined>;

  const buildService = async (): Promise<PipelineApiService> => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PipelineApiService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => configValues[key],
            getOrThrow: (key: string) => {
              const v = configValues[key];
              if (v === undefined) throw new Error(`Missing config: ${key}`);
              return v;
            },
          },
        },
        { provide: HttpService, useValue: httpService },
      ],
    }).compile();

    return module.get(PipelineApiService);
  };

  beforeEach(() => {
    httpService = { get: jest.fn(), post: jest.fn() };
    configValues = { PIPELINE_URL: 'https://pipeline.example' };
  });

  describe('auth header', () => {
    it('omits X-API-Key when PIPELINE_API_KEY is unset', async () => {
      httpService.get.mockReturnValue(of(axiosResponse([])));
      const service = await buildService();

      await service.listPipelines();

      const [, config] = httpService.get.mock.calls[0];
      expect(config.headers).not.toHaveProperty('X-API-Key');
    });

    it('omits X-API-Key when PIPELINE_API_KEY is an empty string', async () => {
      configValues.PIPELINE_API_KEY = '';
      httpService.get.mockReturnValue(of(axiosResponse([])));
      const service = await buildService();

      await service.listPipelines();

      const [, config] = httpService.get.mock.calls[0];
      expect(config.headers).not.toHaveProperty('X-API-Key');
    });

    it('sends X-API-Key when PIPELINE_API_KEY is set', async () => {
      configValues.PIPELINE_API_KEY = 'secret-123';
      httpService.get.mockReturnValue(of(axiosResponse([])));
      const service = await buildService();

      await service.listPipelines();

      const [, config] = httpService.get.mock.calls[0];
      expect(config.headers['X-API-Key']).toBe('secret-123');
    });
  });

  describe('listPipelines', () => {
    // extra_inputs arrives as an object keyed by input name — verified against
    // the deployed service, which returns {"primer_bed": {...}}.
    it('maps snake_case pipeline definitions to the domain shape', async () => {
      httpService.get.mockReturnValue(
        of(
          axiosResponse([
            {
              id: 'snp-calling',
              version: '2.0.0',
              stages: ['align', 'call'],
              params_schema: { type: 'object' },
              display_name: 'SNP calling',
              description: 'Aligns reads and calls variants.',
              accepted_extensions: ['.fastq.gz'],
              extra_inputs: {
                reference: {
                  filename: 'ref.fa',
                  extensions: ['.fa'],
                  required: true,
                  title: 'Reference',
                  when: { 'primer.enabled': true, 'primer.tool': 'align_trim' },
                },
              },
            },
          ]),
        ),
      );
      const service = await buildService();

      const pipelines = await service.listPipelines();

      expect(pipelines).toEqual([
        {
          id: 'snp-calling',
          version: '2.0.0',
          stages: ['align', 'call'],
          paramsSchema: { type: 'object' },
          acceptedExtensions: ['.fastq.gz'],
          displayName: 'SNP calling',
          description: 'Aligns reads and calls variants.',
          extraInputs: [
            {
              name: 'reference',
              filename: 'ref.fa',
              extensions: ['.fa'],
              required: true,
              title: 'Reference',
              description: null,
              when: { 'primer.enabled': true, 'primer.tool': 'align_trim' },
            },
          ],
        },
      ]);
    });

    // Older pipeline versions omit `when` entirely, and a future contract
    // change could send something other than a flat scalar-valued object —
    // both must resolve to "always in use" rather than surfacing garbage or
    // throwing.
    it('maps a missing or malformed `when` to {}', async () => {
      httpService.get.mockReturnValue(
        of(
          axiosResponse([
            {
              id: 'legacy-pipeline',
              version: '1.0.0',
              extra_inputs: {
                no_when: {
                  filename: 'a.txt',
                  extensions: ['.txt'],
                  required: false,
                },
                array_when: {
                  filename: 'b.txt',
                  extensions: ['.txt'],
                  required: false,
                  when: ['not', 'an', 'object'],
                },
                nested_when: {
                  filename: 'c.txt',
                  extensions: ['.txt'],
                  required: false,
                  when: { 'primer.enabled': true, 'primer.opts': { a: 1 } },
                },
              },
            },
          ]),
        ),
      );
      const service = await buildService();

      const [pipeline] = await service.listPipelines();

      expect(pipeline.extraInputs).toEqual([
        expect.objectContaining({ name: 'no_when', when: {} }),
        expect.objectContaining({ name: 'array_when', when: {} }),
        // Non-scalar entries are dropped rather than the whole object
        // collapsing to {}.
        expect.objectContaining({
          name: 'nested_when',
          when: { 'primer.enabled': true },
        }),
      ]);
    });
  });

  describe('listPipelines caching', () => {
    it('does not refetch within the cache TTL', async () => {
      httpService.get.mockReturnValue(
        of(
          axiosResponse([
            { id: 'p1', version: '1.0.0', display_name: 'Pipeline One' },
          ]),
        ),
      );
      const service = await buildService();

      await service.listPipelines();
      await service.listPipelines();
      const pipelines = await service.listPipelines();

      expect(httpService.get).toHaveBeenCalledTimes(1);
      expect(pipelines[0].id).toBe('p1');
    });

    it('refetches once the cache TTL has elapsed', async () => {
      httpService.get.mockReturnValue(
        of(
          axiosResponse([
            { id: 'p1', version: '1.0.0', display_name: 'Pipeline One' },
          ]),
        ),
      );
      const service = await buildService();
      const nowSpy = jest.spyOn(Date, 'now');

      nowSpy.mockReturnValue(1_000_000);
      await service.listPipelines();
      expect(httpService.get).toHaveBeenCalledTimes(1);

      // Still within the 5-minute TTL.
      nowSpy.mockReturnValue(1_000_000 + 4 * 60 * 1000);
      await service.listPipelines();
      expect(httpService.get).toHaveBeenCalledTimes(1);

      // Past the TTL.
      nowSpy.mockReturnValue(1_000_000 + 6 * 60 * 1000);
      await service.listPipelines();
      expect(httpService.get).toHaveBeenCalledTimes(2);

      nowSpy.mockRestore();
    });
  });

  describe('findPipelineSafe', () => {
    it('returns the matching pipeline definition from the (cached) catalog', async () => {
      httpService.get.mockReturnValue(
        of(
          axiosResponse([
            {
              id: 'ont-lsdv',
              version: '1.0.0',
              display_name: 'Oxford Nanopore — LSDV',
            },
            {
              id: 'snippy-fasta',
              version: '1.0.0',
              display_name: 'FASTA assembly',
            },
          ]),
        ),
      );
      const service = await buildService();

      const pipeline = await service.findPipelineSafe('snippy-fasta');

      expect(pipeline?.displayName).toBe('FASTA assembly');
    });

    it('returns null, without throwing, when the pipeline id is not in the catalog', async () => {
      httpService.get.mockReturnValue(of(axiosResponse([])));
      const service = await buildService();

      await expect(
        service.findPipelineSafe('unknown-pipeline'),
      ).resolves.toBeNull();
    });

    it('returns null instead of throwing when the catalog fetch fails, so a submission never fails on this lookup', async () => {
      httpService.get.mockReturnValue(
        throwError(() => new AxiosError('connect ECONNREFUSED')),
      );
      const service = await buildService();

      await expect(service.findPipelineSafe('ont-lsdv')).resolves.toBeNull();
    });
  });

  describe('submitRun', () => {
    const payload = {
      pipelineId: 'snp-calling',
      externalId: 'ext-1',
      ownerId: 'owner-1',
      inputKey: 's3://bucket/key.fastq.gz',
      callbackUrl: 'https://dharini.example/webhook',
    };

    it('reports a fresh 202 as wasExisting: false', async () => {
      httpService.post.mockReturnValue(
        of(
          axiosResponse(
            {
              run_id: 'run-1',
              external_id: 'ext-1',
              pipeline_id: 'snp-calling',
              pipeline_version: '2.0.0',
              status: 'QUEUED',
              stages: ['align', 'call'],
              queue_position: 3,
              estimated_start_s: 120,
            },
            202,
          ),
        ),
      );
      const service = await buildService();

      const result = await service.submitRun(payload);

      expect(result.wasExisting).toBe(false);
      expect(result.run).toEqual({
        runId: 'run-1',
        externalId: 'ext-1',
        pipelineId: 'snp-calling',
        pipelineVersion: '2.0.0',
        status: 'QUEUED',
        stages: ['align', 'call'],
        queuePosition: 3,
        estimatedStartS: 120,
      });
    });

    it('reports a 200 idempotent replay as wasExisting: true, distinct from a fresh submit', async () => {
      httpService.post.mockReturnValue(
        of(
          axiosResponse(
            {
              run_id: 'run-1',
              external_id: 'ext-1',
              pipeline_id: 'snp-calling',
              pipeline_version: '2.0.0',
              status: 'RUNNING',
              stages: ['align', 'call'],
              queue_position: null,
              estimated_start_s: null,
            },
            200,
          ),
        ),
      );
      const service = await buildService();

      const result = await service.submitRun(payload);

      expect(result.wasExisting).toBe(true);
      expect(result.run.runId).toBe('run-1');
      expect(result.run.status).toBe('RUNNING');
    });

    it('sends the payload as the documented snake_case body', async () => {
      httpService.post.mockReturnValue(
        of(
          axiosResponse(
            {
              run_id: 'run-1',
              external_id: 'ext-1',
              pipeline_id: 'snp-calling',
              pipeline_version: '2.0.0',
              status: 'QUEUED',
              stages: [],
              queue_position: 0,
              estimated_start_s: 0,
            },
            202,
          ),
        ),
      );
      const service = await buildService();

      await service.submitRun({ ...payload, params: { minDepth: 10 } });

      const [url, body] = httpService.post.mock.calls[0];
      expect(url).toBe('https://pipeline.example/v1/runs');
      expect(body).toMatchObject({
        pipeline_id: 'snp-calling',
        external_id: 'ext-1',
        owner_id: 'owner-1',
        input_key: 's3://bucket/key.fastq.gz',
        callback_url: 'https://dharini.example/webhook',
        params: { minDepth: 10 },
      });
    });
  });

  describe('error mapping', () => {
    it('surfaces 404 as PipelineNotFoundError carrying the detail', async () => {
      httpService.get.mockReturnValue(
        throwError(() => axiosError(404, { detail: 'run xyz not found' })),
      );
      const service = await buildService();

      await expect(service.getRun('xyz')).rejects.toBeInstanceOf(
        PipelineNotFoundError,
      );
      try {
        await service.getRun('xyz');
        fail('expected rejection');
      } catch (e: any) {
        expect(e.detail).toBe('run xyz not found');
        expect(e.status).toBe(404);
      }
    });

    it('surfaces 413 as PipelineInputTooLargeError carrying the detail', async () => {
      httpService.post.mockReturnValue(
        throwError(() =>
          axiosError(413, { detail: 'input exceeds 5GiB limit' }),
        ),
      );
      const service = await buildService();

      await expect(
        service.submitRun({
          pipelineId: 'p',
          externalId: 'e',
          ownerId: 'o',
          inputKey: 'k',
          callbackUrl: 'https://x',
        }),
      ).rejects.toBeInstanceOf(PipelineInputTooLargeError);

      try {
        await service.submitRun({
          pipelineId: 'p',
          externalId: 'e',
          ownerId: 'o',
          inputKey: 'k',
          callbackUrl: 'https://x',
        });
        fail('expected rejection');
      } catch (e: any) {
        expect(e.detail).toBe('input exceeds 5GiB limit');
        expect(e.status).toBe(413);
      }
    });

    it('surfaces 422 as PipelineValidationError carrying the detail', async () => {
      httpService.post.mockReturnValue(
        throwError(() => axiosError(422, { detail: 'unknown param minDepth' })),
      );
      const service = await buildService();

      try {
        await service.submitRun({
          pipelineId: 'p',
          externalId: 'e',
          ownerId: 'o',
          inputKey: 'k',
          callbackUrl: 'https://x',
        });
        fail('expected rejection');
      } catch (e: any) {
        expect(e).toBeInstanceOf(PipelineValidationError);
        expect(e.detail).toBe('unknown param minDepth');
        expect(e.status).toBe(422);
      }
    });

    it('does not swallow other failures into 404/413/422, and does not lose status info', async () => {
      httpService.get.mockReturnValue(
        throwError(() => axiosError(500, { detail: 'internal error' })),
      );
      const service = await buildService();

      try {
        await service.getRun('xyz');
        fail('expected rejection');
      } catch (e: any) {
        expect(e).toBeInstanceOf(PipelineApiError);
        expect(e).not.toBeInstanceOf(PipelineNotFoundError);
        expect(e).not.toBeInstanceOf(PipelineInputTooLargeError);
        expect(e).not.toBeInstanceOf(PipelineValidationError);
        expect(e.status).toBe(500);
      }
    });

    it('surfaces a network failure (no response at all) as a PipelineApiError', async () => {
      const networkErr = new AxiosError('connect ECONNREFUSED');
      httpService.get.mockReturnValue(throwError(() => networkErr));
      const service = await buildService();

      await expect(service.getQueue()).rejects.toBeInstanceOf(PipelineApiError);
    });
  });

  describe('getRunProgress / getQueue / reuploadArtifacts', () => {
    it('maps run progress from snake_case', async () => {
      httpService.get.mockReturnValue(
        of(
          axiosResponse({
            run_id: 'run-1',
            external_id: 'ext-1',
            status: 'RUNNING',
            stage: 'call',
            stage_index: 1,
            stage_total: 3,
            stage_started_at: '2026-08-20T00:00:00Z',
            stage_elapsed_s: 12,
            stage_typical_s: null,
            heartbeat_age_s: 2,
            eta_s: 60,
            eta_at: '2026-08-20T00:01:00Z',
            queue_position: null,
            estimated_start_s: null,
            stages: [{ name: 'align', status: 'SUCCEEDED', duration_s: 30 }],
          }),
        ),
      );
      const service = await buildService();

      const progress = await service.getRunProgress('run-1');

      expect(progress.stageTypicalS).toBeNull();
      expect(progress.stages).toEqual([
        { name: 'align', status: 'SUCCEEDED', durationS: 30 },
      ]);
    });

    it('maps queue status from snake_case', async () => {
      httpService.get.mockReturnValue(
        of(
          axiosResponse({
            worker_concurrency: 4,
            queued: 2,
            estimated_wait_s: 300,
            running: [
              { run_id: 'run-2', pipeline_id: 'p', stage: 'align', eta_s: 10 },
            ],
          }),
        ),
      );
      const service = await buildService();

      const queue = await service.getQueue();

      expect(queue).toEqual({
        workerConcurrency: 4,
        queued: 2,
        estimatedWaitS: 300,
        running: [
          { runId: 'run-2', pipelineId: 'p', stage: 'align', etaS: 10 },
        ],
      });
    });

    it('posts to the reupload endpoint for a run', async () => {
      httpService.post.mockReturnValue(of(axiosResponse({ ok: true })));
      const service = await buildService();

      const result = await service.reuploadArtifacts('run-1');

      expect(httpService.post.mock.calls[0][0]).toBe(
        'https://pipeline.example/v1/runs/run-1/reupload',
      );
      expect(result).toEqual({ ok: true });
    });
  });
});
