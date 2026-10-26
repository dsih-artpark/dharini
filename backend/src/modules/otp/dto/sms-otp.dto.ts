import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SmsOtpDto {
  @ApiProperty({
    description: 'Contact number of the recipient',
    example: '83340234',
  })
  @IsString()
  @IsNotEmpty()
  contactNumber: string;

  @ApiProperty({
    description: 'Contact number of the recipient',
    example: '83340234',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
