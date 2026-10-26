import { Injectable } from '@nestjs/common';
import { convert } from 'html-to-text';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    if (process.env.SMTP_HOST) {
      // Any SMTP relay, e.g. AWS SES (email-smtp.<region>.amazonaws.com),
      // Resend (smtp.resend.com, user "resend", the API key as password)
      // or Gmail (smtp.gmail.com, port 465, app password)
      const port = Number(process.env.SMTP_PORT) || 587;
      console.log(
        `Initializing Mailer with Nodemailer (SMTP ${process.env.SMTP_HOST}:${port})`,
      );
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: port === 465, // 465 is implicit TLS; other ports upgrade via STARTTLS
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        connectionTimeout: 10000, // 10 seconds
        greetingTimeout: 10000,
        socketTimeout: 30000,
      });
    } else {
      console.warn(
        'No mailer configured (set SMTP_HOST). Emails will not be sent.',
      );
    }
  }

  async sendMail(emailData: any): Promise<any> {
    // HTML-only mail scores worse with spam filters; add a text/plain part
    if (emailData.html && !emailData.text) {
      emailData.text = convert(emailData.html, {
        wordwrap: 100,
        selectors: [
          { selector: 'a', options: { hideLinkHrefIfSameAsText: true } },
          { selector: 'img', format: 'skip' },
        ],
      });
    }

    if (this.transporter) {
      try {
        // Gmail filled in a missing From; SES and most other relays reject the message instead
        emailData.from = emailData.from || process.env.EMAIL_FROM;
        const info = await this.transporter.sendMail(emailData);
        console.log('Email sent successfully via Nodemailer:', info.messageId);
        return info;
      } catch (error) {
        console.error('Nodemailer error:', error);
        throw error;
      }
    } else {
      const error = new Error('No mailer configuration found. Email not sent.');
      console.warn(error.message);
      throw error;
    }
  }
}
