import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UpdateWorkspaceMemberDto {
  @ApiProperty({ description: 'Workspace-scoped Role UUID to assign' })
  @IsUUID()
  roleId: string;
}
