import { PartialType } from '@nestjs/swagger';
import { IsArray, IsOptional, IsUUID } from 'class-validator';
import { CreateAccessDto } from './create-access.dto';

export class UpdateAccessDto extends PartialType(CreateAccessDto) {
  @IsArray()
  roles?: string[];

  // Required when the caller is a workspace-admin (not a system-scope user)
  // assigning a workspace-scoped role — identifies which workspace the new
  // UserRole(s) belong to, and which workspace the caller must themselves
  // administer. Ignored/unused for system-scope callers, who can assign any
  // role unscoped as before.
  @IsUUID()
  @IsOptional()
  workspaceId?: string;
}
