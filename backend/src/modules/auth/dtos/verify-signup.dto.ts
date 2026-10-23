import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { AtLeastOneOf } from 'src/common/validators/at-least-one-of.validator';

// 3.1: second step of self-serve signup — verifies the OTP sent by
// SignupDto's endpoint and carries everything needed to atomically create
// the User + Workspace + workspace-admin UserRole in one shot.
// Omitting BOTH email and phone used to validate cleanly: @IsOptional()
// skips the rest of a property's validators when its value is absent, so
// nothing was left to object. Enforced at class level for that reason.
@AtLeastOneOf(['email', 'phone'])
export class VerifySignupDto {
  @ApiProperty({
    description: 'Email used for signup',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @ValidateIf((o) => !o.phone || o.email)
  email?: string;

  @ApiProperty({
    description: 'Phone number used for signup',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @ValidateIf((o) => !o.email || o.phone)
  phone?: string;

  @ApiProperty({ description: 'OTP sent to the email/phone', example: 123456 })
  @IsNumber()
  otp: number;

  @ApiProperty({ description: 'First name of the new workspace owner' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the new workspace owner',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ description: 'Name of the new workspace to create' })
  @IsString()
  @IsNotEmpty()
  workspaceName: string;
}
