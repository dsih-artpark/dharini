import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'The phone number used for login',
    type: String,
    example: 'user@example.com',
  })
  @IsPhoneNumber()
  phone: number;

  @ApiProperty({
    description: 'The password associated with the user account',
    type: String,
    example: 'password123',
  })
  @IsString()
  password: string;
}
