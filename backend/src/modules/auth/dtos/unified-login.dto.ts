import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateIf } from 'class-validator';
import { AtLeastOneOf } from 'src/common/validators/at-least-one-of.validator';

// Omitting BOTH email and phone used to validate cleanly: @IsOptional()
// skips the rest of a property's validators when its value is absent, so
// nothing was left to object. Enforced at class level for that reason.
@AtLeastOneOf(['email', 'phone'])
export class UnifiedLoginDto {
  @ApiProperty({
    description: 'The email used for login',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @ValidateIf((o) => !o.phone || o.email)
  email?: string;

  @ApiProperty({
    description: 'The phone number used for login',
    type: String,
    example: '919875645646',
    required: false,
  })
  @IsOptional()
  @IsString()
  @ValidateIf((o) => !o.email || o.phone)
  phone?: string;
}
