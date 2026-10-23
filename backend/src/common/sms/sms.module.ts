import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SMS_PROVIDER } from './sms-provider.token';
import { TwilioSmsProvider } from './providers/twilio-sms.provider';
import { ConsoleSmsProvider } from './providers/console-sms.provider';

/**
 * Global because OtpService and InvitesService are each re-provided as
 * separate instances in multiple modules (OtpModule, InvitesModule, and
 * AuthModule all declare their own copy) - every one of those needs
 * SMS_PROVIDER resolvable in its own module context. Importing SmsModule
 * into each one individually is exactly the kind of easy-to-forget wiring
 * that already broke AuthModule's copy of OtpService silently (a boot-time
 * DI failure, never caught because nothing had actually booted the full
 * app since the SMS abstraction landed). Mirrors RedisCacheModule/
 * AuthorizationModule's existing use of @Global() for the same reason.
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    TwilioSmsProvider,
    ConsoleSmsProvider,
    {
      provide: SMS_PROVIDER,
      inject: [ConfigService, TwilioSmsProvider, ConsoleSmsProvider],
      useFactory: (
        configService: ConfigService,
        twilioProvider: TwilioSmsProvider,
        consoleProvider: ConsoleSmsProvider,
      ) => {
        const providerName = configService.get<string>(
          'SMS_PROVIDER',
          'twilio',
        );
        return providerName === 'console' ? consoleProvider : twilioProvider;
      },
    },
  ],
  exports: [SMS_PROVIDER],
})
export class SmsModule {}
