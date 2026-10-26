import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';
import { ISmsProvider } from '../sms-provider.interface';
import { SmsDeliveryError } from '../sms-delivery.error';

@Injectable()
export class TwilioSmsProvider implements ISmsProvider {
  private readonly client: twilio.Twilio;
  private readonly fromNumber: string;

  constructor(configService: ConfigService) {
    this.client = twilio(
      configService.get<string>('TWILIO_ACCOUNT_SID'),
      configService.get<string>('TWILIO_AUTH_TOKEN'),
    );
    this.fromNumber = configService.get<string>('TWILIO_FROM_NUMBER');
  }

  async sendSms(to: string, message: string): Promise<void> {
    try {
      await this.client.messages.create({
        to,
        from: this.fromNumber,
        body: message,
      });
    } catch (error) {
      throw new SmsDeliveryError('Twilio failed to send SMS', error);
    }
  }
}
