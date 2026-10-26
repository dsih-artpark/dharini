import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class TeamMemberRemoveDto {
  @ApiProperty({
    description: 'Team id',
    example: 'bf842546-fa54-4c6c-935f-f8146db98756',
  })
  @IsString()
  teamId: string;

  @ApiProperty({
    description: 'User id',
    example: '["bf842546-fa54-4c6c-935f-f8146db98756"]',
  })
  @IsArray()
  memberIds: string[];
}
