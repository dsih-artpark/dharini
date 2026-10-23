import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateInvitesDto {
  @ApiProperty({
    description: 'List of users emails',
    type: String,
    example: '[user1@email.com, user2@email.com]',
  })
  @IsArray()
  emails: string[];

  @ApiProperty({
    description: 'Subject id is project id',
    type: String,
    example: 'project-id',
  })
  @IsNotEmpty()
  subjectId: any;

  @ApiProperty({
    description: 'User who is inviting',
    type: String,
    example: '{id: 1233123, }',
  })
  @IsNotEmpty()
  invitedBy: any;
}
