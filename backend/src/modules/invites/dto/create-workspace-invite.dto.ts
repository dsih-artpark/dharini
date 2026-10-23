import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateWorkspaceInviteDto {
  @ApiProperty({ description: 'Email of the person being invited' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Workspace UUID to invite the user into' })
  @IsUUID()
  workspaceId: string;

  @ApiProperty({
    description:
      'Workspace-scoped Role UUID to assign when the invite is accepted',
  })
  @IsUUID()
  roleId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiHideProperty()
  @IsOptional()
  invitedBy?: any;
}
