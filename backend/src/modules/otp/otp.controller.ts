import { Body, Controller } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { CommonResponse } from 'src/common/types/common-response.type';
import { EmailOtpDto } from './dto/email-otp.dto';
import { SmsOtpDto } from './dto/sms-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { OtpService } from './otp.service';

@Public()
@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  // @Post('send-email')
  async sendEmailOtp(
    @Body() sendOtpDto: EmailOtpDto,
  ): Promise<CommonResponse<any>> {
    const otp = await this.otpService.sendEmail(sendOtpDto);
    return {
      success: true,
      message: 'Email OTP sent successfully',
      data: otp,
    };
  }

  // @Post('send-sms')
  async sendSmsOtp(@Body() smsOtpDto: SmsOtpDto): Promise<CommonResponse<any>> {
    await this.otpService.sendSms(smsOtpDto);
    return {
      success: true,
      message: 'Phone OTP sent successfully',
    };
  }

  // @Post('verify')
  async verify(
    @Body() verifyOtpDto: VerifyOtpDto,
  ): Promise<CommonResponse<any>> {
    const user = await this.otpService.verifyOtp(verifyOtpDto);
    return {
      success: true,
      message: 'Otp verified successfully',
      data: user,
    };
  }
}
