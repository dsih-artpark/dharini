import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Email',
    example: 'user@email.com',
  })
  email?: string;

  @ApiProperty({
    description: 'Phone',
    example: '233442243',
  })
  phone?: number;

  @ApiProperty({
    description: 'OTP',
    example: '1235',
  })
  @IsNumber()
  otp: number;
}
