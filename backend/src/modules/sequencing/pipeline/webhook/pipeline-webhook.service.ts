import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PipelineWebhookDelivery } from '../../../../entities/pipeline-webhook-delivery.entity';
import { RunResultService, TerminalRunResult } from '../run-result.service';
import {
  isTimestampFresh,
  verifyWebhookSignature,
} from './webhook-signature.util';

interface PipelineRunPayload {
  id: string;
  external_id: string;
  owner_id?: string;
  pipeline_id?: string;
  pipeline_version?: string;
  status: string;
  duration_s?: number | null;
  params?: Record<string, unknown>;
  input_filename?: string;
  input_bytes?: number;
  created_at?: string;
  started_at?: string;
  finished_at?: string;
  error?: string | null;
}

export interface PipelineWebhookPayload {
  event: string;
  delivery_id: string;
  attempt?: number;
  timestamp: string;
  run: PipelineRunPayload;
  metrics?: Record<string, unknown> | null;
  stages?: unknown[] | null;
  variants?: unknown[] | null;
  variants_truncated?: boolean;
  variants_total?: number;
  artifacts?: unknown[] | null;
  artifacts_uploaded?: boolean;
  artifacts_error?: string | null;
  output?: { bucket?: string; prefix?: string };
}

export interface WebhookDeliveryInput {
  rawBody: Buffer;
  event: string | undefined;
  deliveryId: string | undefined;
  timestamp: string | undefined;
  signature: string | undefined;
  body: unknown;
}

export interface WebhookDeliveryOutcome {
  duplicate: boolean;
}

const TERMINAL_STATUSES: ReadonlySet<TerminalRunResult['status']> = new Set([
  'SUCCEEDED',
  'FAILED',
  'CANCELLED',
]);

/**
 * Orchestrates one inbound pipeline webhook delivery: verifies the HMAC
 * signature and timestamp freshness, de-duplicates by `X-Dharini-Delivery`,
 * and — for a fresh delivery — hands the normalised result to
 * RunResultService, the single place that applies a finished run.
 *
 * Deliberately does NOT record the delivery id until AFTER
 * RunResultService.applyTerminalResult resolves successfully. If processing
 * throws partway through, nothing is recorded, so the pipeline's retry (it
 * retries an unacknowledged delivery for roughly nine hours) reprocesses
 * rather than being silently swallowed as a "duplicate".
 */
@Injectable()
export class PipelineWebhookService {
  private readonly logger = new Logger(PipelineWebhookService.name);
  private readonly webhookSecret: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(PipelineWebhookDelivery)
    private readonly deliveryRepo: Repository<PipelineWebhookDelivery>,
    private readonly runResultService: RunResultService,
  ) {
    this.webhookSecret =
      this.configService.getOrThrow<string>('WEBHOOK_SECRET');
  }

  async handleDelivery(
    input: WebhookDeliveryInput,
  ): Promise<WebhookDeliveryOutcome> {
    const { rawBody, event, deliveryId, timestamp, signature, body } = input;

    if (!deliveryId) {
      throw new BadRequestException('Missing X-Dharini-Delivery header');
    }
    if (!timestamp) {
      throw new BadRequestException('Missing X-Dharini-Timestamp header');
    }

    if (
      !verifyWebhookSignature(rawBody, timestamp, signature, this.webhookSecret)
    ) {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    if (!isTimestampFresh(timestamp)) {
      throw new UnauthorizedException('Webhook timestamp is stale or invalid');
    }

    // Fast path: a delivery we've already processed is a cheap, successful
    // no-op — checked before touching run/variant state at all.
    const existing = await this.deliveryRepo.findOne({ where: { deliveryId } });
    if (existing) {
      this.logger.log(`Delivery ${deliveryId} already processed, skipping`);
      return { duplicate: true };
    }

    const payload = this.parsePayload(body);
    const result = this.toTerminalRunResult(event, payload);

    await this.runResultService.applyTerminalResult(result);

    try {
      await this.deliveryRepo.insert({
        deliveryId,
        event: event ?? payload.event,
        runExternalId: payload.run.external_id,
      });
    } catch (err: any) {
      // Postgres unique_violation: a concurrent delivery of the same id won
      // the race and recorded it first. applyTerminalResult above is itself
      // idempotent, so this is safe to treat as success.
      if (err?.code !== '23505') throw err;
      this.logger.debug(
        `Delivery ${deliveryId} recorded concurrently, ignoring race`,
      );
    }

    return { duplicate: false };
  }

  private parsePayload(body: unknown): PipelineWebhookPayload {
    if (!body || typeof body !== 'object') {
      throw new BadRequestException('Webhook body must be a JSON object');
    }
    const payload = body as PipelineWebhookPayload;

    if (!payload.run || typeof payload.run !== 'object') {
      throw new BadRequestException('Webhook body is missing "run"');
    }
    if (!payload.run.external_id) {
      throw new BadRequestException(
        'Webhook body "run.external_id" is required',
      );
    }
    if (!payload.run.id) {
      throw new BadRequestException('Webhook body "run.id" is required');
    }
    return payload;
  }

  private toTerminalRunResult(
    event: string | undefined,
    payload: PipelineWebhookPayload,
  ): TerminalRunResult {
    return {
      runId: payload.run.id,
      externalId: payload.run.external_id,
      status: this.mapStatus(event, payload.run.status),
      durationS: payload.run.duration_s ?? null,
      error: payload.run.error ?? null,
      metrics: payload.metrics ?? null,
      stages: payload.stages ?? null,
      variants: payload.variants ?? null,
      artifacts: payload.artifacts ?? null,
      // artifacts_uploaded is always sent by the pipeline; defaulting to
      // true only guards a malformed/legacy payload that omits it.
      artifactsUploaded: payload.artifacts_uploaded ?? true,
      artifactsError: payload.artifacts_error ?? null,
    };
  }

  private mapStatus(
    event: string | undefined,
    runStatus: string,
  ): TerminalRunResult['status'] {
    if (TERMINAL_STATUSES.has(runStatus as TerminalRunResult['status'])) {
      return runStatus as TerminalRunResult['status'];
    }
    // run.status disagreed with our known terminal values — fall back to the
    // event header rather than dropping the delivery outright.
    if (event === 'run.completed') return 'SUCCEEDED';
    if (event === 'run.failed') return 'FAILED';
    throw new BadRequestException(
      `Unrecognized run.status "${runStatus}" for event "${event}"`,
    );
  }
}
