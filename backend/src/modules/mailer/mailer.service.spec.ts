import { Test, TestingModule } from '@nestjs/testing';
import * as nodemailer from 'nodemailer';
import { MailerService } from './mailer.service';

jest.mock('nodemailer');

const MAIL_ENV_KEYS = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'EMAIL_FROM',
];

describe('MailerService', () => {
  const createTransport = nodemailer.createTransport as jest.Mock;
  const transportSendMail = jest.fn();
  const originalEnv = { ...process.env };

  const build = async (): Promise<MailerService> => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailerService],
    }).compile();
    return module.get<MailerService>(MailerService);
  };

  beforeEach(() => {
    MAIL_ENV_KEYS.forEach((key) => delete process.env[key]);
    createTransport
      .mockReset()
      .mockReturnValue({ sendMail: transportSendMail });
    transportSendMail.mockReset().mockResolvedValue({ messageId: 'msg-1' });
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    jest.restoreAllMocks();
  });

  it('should be defined', async () => {
    expect(await build()).toBeDefined();
  });

  describe('transport selection', () => {
    it('uses the SMTP host with STARTTLS on port 587 when SMTP_HOST is set', async () => {
      process.env.SMTP_HOST = 'email-smtp.ap-south-1.amazonaws.com';
      process.env.SMTP_PORT = '587';
      process.env.SMTP_USER = 'smtp-user';
      process.env.SMTP_PASS = 'smtp-pass';

      await build();

      expect(createTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          host: 'email-smtp.ap-south-1.amazonaws.com',
          port: 587,
          secure: false,
          auth: { user: 'smtp-user', pass: 'smtp-pass' },
        }),
      );
    });

    it('uses implicit TLS on port 465', async () => {
      process.env.SMTP_HOST = 'email-smtp.ap-south-1.amazonaws.com';
      process.env.SMTP_PORT = '465';

      await build();

      expect(createTransport).toHaveBeenCalledWith(
        expect.objectContaining({ port: 465, secure: true }),
      );
    });

    it('defaults to port 587 when SMTP_PORT is unset', async () => {
      process.env.SMTP_HOST = 'smtp.example.com';

      await build();

      expect(createTransport).toHaveBeenCalledWith(
        expect.objectContaining({ port: 587, secure: false }),
      );
    });

    it('creates no transport and refuses to send when nothing is configured', async () => {
      const service = await build();

      expect(createTransport).not.toHaveBeenCalled();
      await expect(
        service.sendMail({ to: 'user@example.com' }),
      ).rejects.toThrow('No mailer configuration found');
    });
  });

  describe('sendMail via Nodemailer', () => {
    beforeEach(() => {
      process.env.SMTP_HOST = 'email-smtp.ap-south-1.amazonaws.com';
      process.env.EMAIL_FROM = 'Dharini <dharini@services.artpark.ai>';
    });

    it('fills in EMAIL_FROM when the caller sets no from', async () => {
      const service = await build();

      await service.sendMail({ to: 'user@example.com', subject: 'OTP' });

      expect(transportSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'Dharini <dharini@services.artpark.ai>',
        }),
      );
    });

    it('keeps an explicit from', async () => {
      const service = await build();

      await service.sendMail({
        from: 'other@services.artpark.ai',
        to: 'user@example.com',
      });

      expect(transportSendMail).toHaveBeenCalledWith(
        expect.objectContaining({ from: 'other@services.artpark.ai' }),
      );
    });

    describe('plain-text part', () => {
      const html = `<!DOCTYPE html>
<html>
  <head>
    <title>Your code</title>
    <style>.otp { color: #ff0000; font-size: 32px; }</style>
  </head>
  <body>
    <p>Your verification code is</p>
    <p class="otp">492585</p>
    <img src="https://example.com/logo.png" alt="Logo" />
    <p><a href="https://example.com/verify?t=1">Verify your email</a></p>
  </body>
</html>`;

      it('is generated from the body of html-only messages', async () => {
        const service = await build();

        await service.sendMail({ to: 'a@example.com', subject: 's', html });

        const sent = transportSendMail.mock.calls[0][0];
        expect(sent.html).toBe(html);
        expect(sent.text).toContain('492585');
        expect(sent.text).toContain('Verify your email');
        expect(sent.text).toContain('https://example.com/verify?t=1');
        expect(sent.text).not.toContain('font-size');
        expect(sent.text).not.toContain('Your code');
        expect(sent.text).not.toContain('logo.png');
      });

      it('does not repeat a url when the link text is the url', async () => {
        const service = await build();

        await service.sendMail({
          to: 'a@example.com',
          subject: 's',
          html: '<p><a href="https://example.com/x">https://example.com/x</a></p>',
        });

        const sent = transportSendMail.mock.calls[0][0];
        expect(sent.text.match(/https:\/\/example\.com\/x/g)).toHaveLength(1);
      });

      it('keeps a caller-provided text unchanged', async () => {
        const service = await build();

        await service.sendMail({
          to: 'a@example.com',
          subject: 's',
          html,
          text: 'custom plain text',
        });

        expect(transportSendMail.mock.calls[0][0].text).toBe(
          'custom plain text',
        );
      });
    });
  });
});
