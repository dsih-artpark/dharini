import {
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Req,
} from '@nestjs/common';
import { RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';
import { Public } from 'src/common/decorators/public.decorator';

import { PipelineWebhookService } from './pipeline-webhook.service';

/**
 * Receiver for the external genomics pipeline's run-completion webhook.
 *
 * Deliberately @Public(), exempt from the global JwtAuthGuard — the caller
 * is the pipeline service, not a logged-in Dharini user. Authenticity is
 * instead established by the HMAC signature (PipelineWebhookService /
 * webhook-signature.util).
 *
 * Requires `req.rawBody` to be populated (Nest's `rawBody: true` / a
 * `verify` callback on the JSON body parser) — see this module's README/PR
 * notes for the exact `main.ts` change. Without it, the signature can never
 * be verified, so this fails loudly instead of silently accepting
 * unverifiable requests.
 */
@Public()
@Controller('sequencing/pipeline')
export class PipelineWebhookController {
  constructor(private readonly webhookService: PipelineWebhookService) {}

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('x-dharini-event') event: string | undefined,
    @Headers('x-dharini-delivery') deliveryId: string | undefined,
    @Headers('x-dharini-timestamp') timestamp: string | undefined,
    @Headers('x-dharini-signature') signature: string | undefined,
  ): Promise<{ received: boolean; duplicate: boolean }> {
    if (!req.rawBody) {
      throw new InternalServerErrorException(
        'req.rawBody is unavailable — the JSON body parser in main.ts must capture the raw ' +
          'bytes (add a `verify` callback to the existing app.use(json(...)) call) before the ' +
          'webhook signature can be verified. Refusing to fall back to JSON.stringify(req.body), ' +
          "since that would never match the sender's signature.",
      );
    }

    const outcome = await this.webhookService.handleDelivery({
      rawBody: req.rawBody,
      event,
      deliveryId,
      timestamp,
      signature,
      body: req.body,
    });

    return { received: true, duplicate: outcome.duplicate };
  }
}
