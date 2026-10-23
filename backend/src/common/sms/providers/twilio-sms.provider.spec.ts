import { ConfigService } from '@nestjs/config';
import { TwilioSmsProvider } from './twilio-sms.provider';
import { SmsDeliveryError } from '../sms-delivery.error';

const mockMessagesCreate = jest.fn();
jest.mock('twilio', () =>
  jest.fn(() => ({
    messages: { create: mockMessagesCreate },
  })),
);

const config: Record<string, string> = {
  TWILIO_ACCOUNT_SID: 'AC-test-sid',
  TWILIO_AUTH_TOKEN: 'test-token',
  TWILIO_FROM_NUMBER: '+15550000000',
};

describe('TwilioSmsProvider', () => {
  let provider: TwilioSmsProvider;

  beforeEach(() => {
    mockMessagesCreate.mockClear();
    const configService = {
      get: (key: string) => config[key],
    } as unknown as ConfigService;
    provider = new TwilioSmsProvider(configService);
  });

  it('sends the message via the Twilio client using the configured from-number', async () => {
    mockMessagesCreate.mockResolvedValue({ sid: 'SM123' });

    await provider.sendSms('+918334023456', 'your otp is 123456');

    expect(mockMessagesCreate).toHaveBeenCalledWith({
      to: '+918334023456',
      from: '+15550000000',
      body: 'your otp is 123456',
    });
  });

  it('throws SmsDeliveryError instead of swallowing a Twilio failure', async () => {
    mockMessagesCreate.mockRejectedValue(new Error('Twilio 400'));

    await expect(
      provider.sendSms('+918334023456', 'your otp is 123456'),
    ).rejects.toBeInstanceOf(SmsDeliveryError);
  });
});
