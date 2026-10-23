import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { MemberDto } from './create-member.dto';

export class CreateMembersListDto {
  @ApiProperty({
    description: 'Project id',
    example: 'bf842546-fa54-4c6c-935f-f8146db98756',
  })
  @IsString()
  project: string;

  @ApiProperty({
    description: 'Team id',
    example: 'bf842546-fa54-4c6c-935f-f8146db98756',
  })
  @IsString()
  teamId: string;

  @ApiProperty({
    description: 'Members data in list',
    example: `[{
          "firstName": "firstname",
          "lastName": "lastname",
          "email": "user@mail.com",
          "role": "bf842546-fa54-4c6c-935f-f8146db98756",
          "project": "bf842546-fa54-4c6c-935f-f8146db98756"
        }]`,
  })
  @IsArray()
  members: MemberDto[];
}
