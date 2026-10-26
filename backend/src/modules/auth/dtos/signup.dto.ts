import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateIf } from 'class-validator';
import { AtLeastOneOf } from 'src/common/validators/at-least-one-of.validator';

// 3.1: first step of self-serve signup — send an OTP to a brand-new
// contact (no account/workspace exists yet). Mirrors UnifiedLoginDto's
// shape/validation intentionally, but kept as its own DTO since signup's
// validation rules may diverge from login's over time.
// Omitting BOTH email and phone used to validate cleanly: @IsOptional()
// skips the rest of a property's validators when its value is absent, so
// nothing was left to object. Enforced at class level for that reason.
@AtLeastOneOf(['email', 'phone'])
export class SignupDto {
  @ApiProperty({
    description: 'Email for the new workspace owner',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @ValidateIf((o) => !o.phone || o.email)
  email?: string;

  @ApiProperty({
    description: 'Phone number for the new workspace owner',
    type: String,
    example: '919875645646',
    required: false,
  })
  @IsOptional()
  @IsString()
  @ValidateIf((o) => !o.email || o.phone)
  phone?: string;
}
