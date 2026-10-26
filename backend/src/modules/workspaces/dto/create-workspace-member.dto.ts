import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateWorkspaceMemberDto {
  @ApiProperty({ description: 'User UUID to add to the workspace' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Workspace-scoped Role UUID to assign' })
  @IsUUID()
  roleId: string;
}
