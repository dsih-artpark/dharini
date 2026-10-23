import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { CreateRoleDto } from './create-role.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @ApiProperty({
    description: 'Name',
    example: 'collector',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Name',
    example: 'collector',
  })
  @IsOptional()
  @IsArray()
  permissions?: string[];
}
