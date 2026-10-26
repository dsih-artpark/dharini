import { BadRequestException, UnauthorizedException } from '@nestjs/common';

import {
  PipelineWebhookService,
  WebhookDeliveryInput,
} from './pipeline-webhook.service';
import { computeWebhookSignature } from './webhook-signature.util';

const SECRET = 'test-webhook-secret';

function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

function buildPayload(overrides: Record<string, unknown> = {}) {
  return {
    event: 'run.completed',
    delivery_id: 'delivery-1',
    attempt: 1,
    timestamp: new Date().toISOString(),
    run: {
      id: 'run-1',
      external_id: 'ext-1',
      owner_id: 'owner-1',
      pipeline_id: 'pl-1',
      pipeline_version: '1.0.0',
      status: 'SUCCEEDED',
      duration_s: 42,
      input_filename: 'reads.fastq.gz',
      error: null,
    },
    metrics: { variant_count: 37, snp_count: 31 },
    stages: [{ name: 'align', status: 'SUCCEEDED', duration_s: 10 }],
    variants: [{ chrom: 'chr1', pos: 100, ref: 'A', alt: 'T' }],
    variants_truncated: false,
    variants_total: 1,
    artifacts: [{ kind: 'vcf', bucket: 'dharini', key: 'runs/run-1/out.vcf' }],
    artifacts_uploaded: true,
    artifacts_error: null,
    output: { bucket: 'dharini', prefix: 'runs/run-1/' },
    ...overrides,
  };
}

function buildDelivery(
  payload: Record<string, unknown>,
  timestamp: string,
  secretForSig = SECRET,
): WebhookDeliveryInput {
  const rawBody = Buffer.from(JSON.stringify(payload), 'utf8');
  const signature = `sha256=${computeWebhookSignature(rawBody, timestamp, secretForSig)}`;
  return {
    rawBody,
    event: payload.event as string,
    deliveryId: payload.delivery_id as string,
    timestamp,
    signature,
    body: payload,
  };
}

describe('PipelineWebhookService', () => {
  let deliveryRepo: { findOne: jest.Mock; insert: jest.Mock };
  let runResultService: { applyTerminalResult: jest.Mock };
  let configService: { getOrThrow: jest.Mock };
  let service: PipelineWebhookService;

  beforeEach(() => {
    deliveryRepo = {
      findOne: jest.fn().mockResolvedValue(null),
      insert: jest.fn().mockResolvedValue(undefined),
    };
    runResultService = {
      applyTerminalResult: jest.fn().mockResolvedValue(undefined),
    };
    configService = { getOrThrow: jest.fn().mockReturnValue(SECRET) };

    service = new PipelineWebhookService(
      configService as any,
      deliveryRepo as any,
      runResultService as any,
    );
  });

  it('accepts a validly-signed, fresh delivery and applies the terminal result', async () => {
    const payload = buildPayload();
    const timestamp = String(nowSeconds());
    const input = buildDelivery(payload, timestamp);

    const outcome = await service.handleDelivery(input);

    expect(outcome).toEqual({ duplicate: false });
    expect(runResultService.applyTerminalResult).toHaveBeenCalledWith(
      expect.objectContaining({
        runId: 'run-1',
        externalId: 'ext-1',
        status: 'SUCCEEDED',
        durationS: 42,
        metrics: { variant_count: 37, snp_count: 31 },
        variants: [{ chrom: 'chr1', pos: 100, ref: 'A', alt: 'T' }],
        artifactsUploaded: true,
      }),
    );
    expect(deliveryRepo.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        deliveryId: 'delivery-1',
        event: 'run.completed',
        runExternalId: 'ext-1',
      }),
    );
  });

  it('rejects a delivery whose body was tampered with after signing', async () => {
    const payload = buildPayload();
    const timestamp = String(nowSeconds());
    const input = buildDelivery(payload, timestamp);
    // Simulate interception: the bytes (and therefore the parsed body) are
    // altered in transit, but the original `X-Dharini-Signature` header
    // (computed over the honest bytes) is left untouched.
    const tamperedPayload = {
      ...payload,
      run: { ...payload.run, status: 'FAILED' },
    };
    input.rawBody = Buffer.from(JSON.stringify(tamperedPayload), 'utf8');
    input.body = tamperedPayload;

    await expect(service.handleDelivery(input)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(runResultService.applyTerminalResult).not.toHaveBeenCalled();
    expect(deliveryRepo.insert).not.toHaveBeenCalled();
  });

  it('rejects a delivery whose timestamp header was tampered with', async () => {
    const payload = buildPayload();
    const timestamp = String(nowSeconds());
    const input = buildDelivery(payload, timestamp);
    // Signature was computed over `timestamp`, verifying against a different
    // one must fail even though it is itself "fresh".
    input.timestamp = String(nowSeconds() + 1);

    await expect(service.handleDelivery(input)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(runResultService.applyTerminalResult).not.toHaveBeenCalled();
  });

  it('rejects a delivery whose timestamp is 10 minutes old', async () => {
    const payload = buildPayload();
    const timestamp = String(nowSeconds() - 10 * 60);
    const input = buildDelivery(payload, timestamp);

    await expect(service.handleDelivery(input)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(runResultService.applyTerminalResult).not.toHaveBeenCalled();
  });

  it('rejects a delivery signed with the wrong secret', async () => {
    const payload = buildPayload();
    const timestamp = String(nowSeconds());
    const input = buildDelivery(payload, timestamp, 'wrong-secret');

    await expect(service.handleDelivery(input)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('rejects a delivery missing the delivery id header', async () => {
    const payload = buildPayload();
    const timestamp = String(nowSeconds());
    const input = buildDelivery(payload, timestamp);
    input.deliveryId = undefined;

    await expect(service.handleDelivery(input)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('is a fast, successful no-op for a repeated delivery id: it does not write anything twice', async () => {
    const payload = buildPayload();
    const timestamp = String(nowSeconds());
    const input = buildDelivery(payload, timestamp);

    deliveryRepo.findOne.mockResolvedValue({
      id: 'x',
      deliveryId: 'delivery-1',
    });

    const outcome = await service.handleDelivery(input);

    expect(outcome).toEqual({ duplicate: true });
    expect(runResultService.applyTerminalResult).not.toHaveBeenCalled();
    expect(deliveryRepo.insert).not.toHaveBeenCalled();
  });

  it('still persists metrics and variants when artifacts_uploaded is false, without treating the run as failed', async () => {
    const payload = buildPayload({
      artifacts_uploaded: false,
      artifacts_error: 'worker unreachable',
    });
    const timestamp = String(nowSeconds());
    const input = buildDelivery(payload, timestamp);

    await service.handleDelivery(input);

    expect(runResultService.applyTerminalResult).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'SUCCEEDED',
        artifactsUploaded: false,
        artifactsError: 'worker unreachable',
        metrics: { variant_count: 37, snp_count: 31 },
        variants: [{ chrom: 'chr1', pos: 100, ref: 'A', alt: 'T' }],
      }),
    );
  });

  it('maps a run.failed event to a FAILED terminal result', async () => {
    const payload = buildPayload({
      event: 'run.failed',
      run: {
        id: 'run-1',
        external_id: 'ext-1',
        status: 'FAILED',
        error: 'boom',
      },
    });
    const timestamp = String(nowSeconds());
    const input = buildDelivery(payload, timestamp);

    await service.handleDelivery(input);

    expect(runResultService.applyTerminalResult).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'FAILED', error: 'boom' }),
    );
  });

  it('treats a unique-violation race on delivery insert as success, not an error', async () => {
    const payload = buildPayload();
    const timestamp = String(nowSeconds());
    const input = buildDelivery(payload, timestamp);
    deliveryRepo.insert.mockRejectedValue({ code: '23505' });

    const outcome = await service.handleDelivery(input);

    expect(outcome).toEqual({ duplicate: false });
    expect(runResultService.applyTerminalResult).toHaveBeenCalledTimes(1);
  });
});
