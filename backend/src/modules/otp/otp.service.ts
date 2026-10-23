import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from 'src/entities/otp.entity';
import { Brackets, ILike, Repository } from 'typeorm';
import { UserService } from '../users/users.service';
import { MailerService } from '../mailer/mailer.service';
import { SmsOtpDto } from './dto/sms-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ISmsProvider } from 'src/common/sms/sms-provider.interface';
import { SMS_PROVIDER } from 'src/common/sms/sms-provider.token';
import { formatIndianPhoneNumber } from 'src/common/sms/functions/format-phone-number';
import { generateOtp } from 'src/common/functions/generate-otp';
import { OtpAttemptGuardService } from 'src/common/otp/otp-attempt-guard.service';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
    private jwtService: JwtService,
    private userService: UserService,
    private mailerService: MailerService,
    @Inject(SMS_PROVIDER) private readonly smsProvider: ISmsProvider,
    private readonly otpAttemptGuard: OtpAttemptGuardService,
  ) {}

  async sendSms(smsOtpDto: SmsOtpDto): Promise<boolean> {
    try {
      await this.smsProvider.sendSms(
        formatIndianPhoneNumber(smsOtpDto.contactNumber),
        smsOtpDto.message,
      );
      return true;
    } catch (error) {
      this.logger.error(
        'Failed to send SMS',
        error instanceof Error ? error.stack : String(error),
      );
      return false;
    }
  }

  async sendEmail(emailOtpDto: any) {
    // Deliberately not logging emailOtpDto: its `text`/`html` carry the OTP
    // in cleartext when the caller supplies them.
    try {
      // Find existing OTP data by email
      let otpData = await this.otpRepository.findOne({
        where: { email: ILike(emailOtpDto.email) },
      });

      const otp = generateOtp();

      const otpDataPayload = {
        email: emailOtpDto.email,
        otp,
      };

      if (!otpData) {
        // Create new OTP record
        otpData = this.otpRepository.create(otpDataPayload);
      } else {
        // Update existing OTP record
        otpData = this.otpRepository.merge(otpData, otpDataPayload);
      }

      await this.otpRepository.save(otpData);

      // Send email using MailerService
      const response = await this.mailerService.sendMail({
        to: emailOtpDto.email,
        subject: emailOtpDto.subject || 'Your Dharini verification code',
        text:
          emailOtpDto.text ||
          `Your Dharini verification code is: ${otp}. If you did not request this, you can ignore this email.`,
        html:
          emailOtpDto.html ||
          `<p>Your Dharini verification code is: <strong>${otp}</strong></p><p>If you did not request this, you can ignore this email.</p><p>Dharini team, ARTPARK</p>`,
      });

      this.logger.log('Email sent successfully');
      return { ...otpData, mailResponse: response };
    } catch (error) {
      this.logger.error(
        'Error sending email',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const attemptKey = this.otpAttemptGuard.key(verifyOtpDto as any);
    const attempts =
      await this.otpAttemptGuard.assertAttemptsRemaining(attemptKey);

    try {
      // Find the user by email or phone
      const otpData = await this.otpRepository
        .createQueryBuilder('user')
        .where(
          new Brackets((qb) => {
            qb.where('LOWER(user.email) = LOWER(:email)', {
              email: verifyOtpDto.email,
            }).orWhere('user.contactNumber = :contactNumber', {
              contactNumber: verifyOtpDto.phone,
            });
          }),
        )
        .getOne();

      if (!otpData && verifyOtpDto.email) throw new Error('Invalid Email');

      if (!otpData && verifyOtpDto.phone)
        throw new Error('Invalid Phone Number');

      if (otpData?.otp !== verifyOtpDto.otp) {
        await this.otpAttemptGuard.recordFailedAttempt(attemptKey, attempts);
        throw new Error('Invalid OTP');
      }

      if (new Date() > otpData?.otpExpireTime) throw new Error('OTP Expired');

      const user = await this.userService.findOne({
        email: verifyOtpDto.email,
        contactNumber: verifyOtpDto.phone,
      });

      if (user) {
        const payload = {
          subject: user.id,
        };
        await this.otpRepository.update(
          { id: otpData.id },
          { otp: null, otpExpireTime: null },
        );
        await this.otpAttemptGuard.clear(attemptKey);
        return {
          accessToken: await this.jwtService.sign(payload),
        };
      }
    } catch (error) {
      this.logger.error(
        'Error verifying OTP',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }
}
