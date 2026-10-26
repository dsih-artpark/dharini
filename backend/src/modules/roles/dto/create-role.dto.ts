import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Name',
    example: 'collector',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Permissions',
    example: '[id1, id2]',
  })
  @IsArray()
  permissions: string[];
}
