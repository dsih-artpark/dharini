import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EmailLoginDto {
  @ApiProperty({
    description: 'The email used for login',
    type: String,
  })
  @IsString()
  email: string;
}
