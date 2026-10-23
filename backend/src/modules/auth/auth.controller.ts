import {
  Body,
  Controller,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CommonResponse } from 'src/common/types/common-response.type';
import { UserService } from 'src/modules/users/users.service';
import { VerifyOtpDto } from '../otp/dto/verify-otp.dto';
import { OtpService } from '../otp/otp.service';
import { UserResponse } from '../users/dto/response.dto';
import { AuthService } from './auth.service';
import { CreateSuperAdminDto } from './dtos/create-super-admin.dto';
import { EmailLoginDto } from './dtos/email-login.dto';
import { PhoneLoginDto } from './dtos/phone-login.dto';
import { UnifiedLoginDto } from './dtos/unified-login.dto';
import { SignupDto } from './dtos/signup.dto';
import { VerifySignupDto } from './dtos/verify-signup.dto';
import { LoginResponse, VerifyOtpResponse } from './dtos/response.dto';

@Public()
// Every route on this controller sends or verifies an OTP, so a
// controller-level guard is correctly scoped without touching any route
// elsewhere in the app.
@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private readonly otpService: OtpService,
  ) {}

  @Post('login')
  @SerializeOptions({ type: LoginResponse })
  async loginUnified(@Body() body: UnifiedLoginDto): Promise<LoginResponse> {
    try {
      if (!body.email && !body.phone) {
        throw new Error('Either email or phone is required');
      }
      await this.authService.login(body);
      const loginMethod = body.email ? 'Email' : 'Phone';
      return {
        success: true,
        message: `${loginMethod} otp sent successfully`,
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('login-with-email')
  @SerializeOptions({ type: LoginResponse })
  async login(@Body() body: EmailLoginDto): Promise<LoginResponse> {
    try {
      await this.authService.login(body);
      return {
        success: true,
        message: 'Email otp sent successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('login-with-phone')
  @SerializeOptions({ type: LoginResponse })
  async loginWithPhone(@Body() body: PhoneLoginDto): Promise<LoginResponse> {
    try {
      await this.authService.login(body);
      return {
        success: true,
        message: 'Phone otp sent successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('verify-otp')
  @SerializeOptions({ type: VerifyOtpResponse })
  async verify(@Body() verifyOtpDto: VerifyOtpDto): Promise<VerifyOtpResponse> {
    const user = await this.otpService.verifyOtp(verifyOtpDto);
    return {
      success: true,
      message: 'Otp verified successfully',
      data: user,
    };
  }

  @Post('resend-email-otp')
  @SerializeOptions({ type: VerifyOtpResponse })
  async resendEmailOtp(
    @Body() verifyOtpDto: EmailLoginDto,
  ): Promise<LoginResponse> {
    await this.authService.login(verifyOtpDto);
    return {
      success: true,
      message: 'Email OTP sent successfully',
    };
  }

  @Post('resend-phone-otp')
  @SerializeOptions({ type: VerifyOtpResponse })
  async resendPhoneOtp(
    @Body() verifyOtpDto: PhoneLoginDto,
  ): Promise<LoginResponse> {
    await this.authService.login(verifyOtpDto);
    return {
      success: true,
      message: 'Phone OTP sent successfully',
    };
  }

  // 3.1, step 1: send an OTP to a brand-new contact to start self-serve
  // workspace signup.
  @Post('signup')
  @SerializeOptions({ type: LoginResponse })
  async signup(@Body() body: SignupDto): Promise<LoginResponse> {
    await this.authService.signup(body);
    const loginMethod = body.email ? 'Email' : 'Phone';
    return {
      success: true,
      message: `${loginMethod} otp sent successfully`,
    };
  }

  // 3.1, step 2: verify the OTP and atomically create the User + Workspace
  // + workspace-admin UserRole, returning a JWT in the same shape as login.
  @Post('signup/verify')
  @SerializeOptions({ type: VerifyOtpResponse })
  async verifySignup(
    @Body() body: VerifySignupDto,
  ): Promise<VerifyOtpResponse> {
    const data = await this.authService.verifySignup(body);
    return {
      success: true,
      message: 'Workspace created successfully',
      data,
    };
  }

  // @Post('create-super-admin')
  @SerializeOptions({ type: UserResponse })
  async createSuperAdmin(
    @Body() body: CreateSuperAdminDto,
  ): Promise<UserResponse> {
    try {
      const data = await this.userService.create({ ...body });
      return {
        success: true,
        message: 'Admin created successfully',
        data: data,
      };
    } catch (error) {
      throw error;
    }
  }

  // @Post('register')
  async register(@Body() body: any): Promise<CommonResponse<any>> {
    try {
      const { phone } = body;
      const whereQuery = {
        phone,
      };

      const user = await this.userService.findOne(whereQuery);

      if (user) {
        return {
          success: false,
          message: 'User already exist',
        };
      }

      await this.userService.create({ ...body });

      return {
        success: true,
        message: 'Registered Successfully',
      };
    } catch (err) {
      console.log('Register error', err);
      return {
        success: false,
        message: 'FAILED',
        error: err,
      };
    }
  }
}
