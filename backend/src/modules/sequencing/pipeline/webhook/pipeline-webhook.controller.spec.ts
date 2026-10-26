import { InternalServerErrorException } from '@nestjs/common';

import { PipelineWebhookController } from './pipeline-webhook.controller';
import { PipelineWebhookService } from './pipeline-webhook.service';

function makeRequest(overrides: Record<string, unknown> = {}) {
  return {
    rawBody: Buffer.from('{"event":"run.completed"}', 'utf8'),
    body: { event: 'run.completed' },
    ...overrides,
  } as any;
}

describe('PipelineWebhookController', () => {
  let webhookService: { handleDelivery: jest.Mock };
  let controller: PipelineWebhookController;

  beforeEach(() => {
    webhookService = {
      handleDelivery: jest.fn().mockResolvedValue({ duplicate: false }),
    };
    controller = new PipelineWebhookController(
      webhookService as unknown as PipelineWebhookService,
    );
  });

  it('forwards the raw body and headers to the service and reports success', async () => {
    const req = makeRequest();

    const result = await controller.handleWebhook(
      req,
      'run.completed',
      'delivery-1',
      '1755598800',
      'sha256=abc',
    );

    expect(webhookService.handleDelivery).toHaveBeenCalledWith({
      rawBody: req.rawBody,
      event: 'run.completed',
      deliveryId: 'delivery-1',
      timestamp: '1755598800',
      signature: 'sha256=abc',
      body: req.body,
    });
    expect(result).toEqual({ received: true, duplicate: false });
  });

  it('reports duplicate: true when the service says this delivery was already processed', async () => {
    webhookService.handleDelivery.mockResolvedValue({ duplicate: true });
    const req = makeRequest();

    const result = await controller.handleWebhook(
      req,
      'run.completed',
      'delivery-1',
      '1755598800',
      'sha256=abc',
    );

    expect(result).toEqual({ received: true, duplicate: true });
  });

  it('fails loudly instead of falling back to JSON.stringify(body) when req.rawBody is missing', async () => {
    const req = makeRequest({ rawBody: undefined });

    await expect(
      controller.handleWebhook(
        req,
        'run.completed',
        'delivery-1',
        '1755598800',
        'sha256=abc',
      ),
    ).rejects.toThrow(InternalServerErrorException);
    expect(webhookService.handleDelivery).not.toHaveBeenCalled();
  });
});
