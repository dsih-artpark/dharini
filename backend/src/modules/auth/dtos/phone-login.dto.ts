import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PhoneLoginDto {
  @ApiProperty({
    description: 'The phone number used for login',
    type: String,
    example: '919875645646',
  })
  @IsString()
  phone: string;
}
