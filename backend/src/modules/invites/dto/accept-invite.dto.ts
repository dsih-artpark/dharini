import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AcceptInviteDto {
  @ApiProperty({
    description: 'invite token',
    type: String,
    example: 'inviteToken',
  })
  @IsString()
  @IsNotEmpty()
  inviteToken: string;
}
