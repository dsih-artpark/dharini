import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { SmsModule } from './sms.module';
import { SMS_PROVIDER } from './sms-provider.token';
import { TwilioSmsProvider } from './providers/twilio-sms.provider';
import { ConsoleSmsProvider } from './providers/console-sms.provider';

jest.mock('twilio', () => jest.fn(() => ({ messages: { create: jest.fn() } })));

async function buildModuleWith(smsProviderConfigValue: string | undefined) {
  return Test.createTestingModule({
    imports: [SmsModule],
  })
    .overrideProvider(ConfigService)
    .useValue({
      get: (key: string, defaultValue?: string) => {
        if (key === 'SMS_PROVIDER')
          return smsProviderConfigValue ?? defaultValue;
        return undefined;
      },
    })
    .compile();
}

describe('SmsModule', () => {
  it('resolves SMS_PROVIDER to TwilioSmsProvider by default', async () => {
    const moduleRef: TestingModule = await buildModuleWith(undefined);
    expect(moduleRef.get(SMS_PROVIDER)).toBeInstanceOf(TwilioSmsProvider);
  });

  it('resolves SMS_PROVIDER to ConsoleSmsProvider when SMS_PROVIDER=console', async () => {
    const moduleRef: TestingModule = await buildModuleWith('console');
    expect(moduleRef.get(SMS_PROVIDER)).toBeInstanceOf(ConsoleSmsProvider);
  });

  it('falls back to TwilioSmsProvider for an unrecognized provider name', async () => {
    const moduleRef: TestingModule = await buildModuleWith('unknown-provider');
    expect(moduleRef.get(SMS_PROVIDER)).toBeInstanceOf(TwilioSmsProvider);
  });
});
