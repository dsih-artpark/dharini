import { Injectable, Logger } from '@nestjs/common';
import { ISmsProvider } from '../sms-provider.interface';

// Local-dev/test provider: proves an ISmsProvider can be swapped in via
// config alone, and lets `npm run start:dev` run without real Twilio
// credentials. Never logs the message body — that's where the OTP lives.
@Injectable()
export class ConsoleSmsProvider implements ISmsProvider {
  private readonly logger = new Logger(ConsoleSmsProvider.name);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- signature must match ISmsProvider
  async sendSms(to: string, _message: string): Promise<void> {
    this.logger.log(`[console-sms] would send SMS to ${maskPhoneNumber(to)}`);
  }
}

function maskPhoneNumber(phoneNumber: string): string {
  if (phoneNumber.length <= 6) return '*'.repeat(phoneNumber.length);
  return `${phoneNumber.slice(0, 4)}${'*'.repeat(phoneNumber.length - 6)}${phoneNumber.slice(-2)}`;
}
