// create-user.dto.ts
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
} from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class MemberDto {
  @ApiProperty({
    description: 'First name',
    example: 'firstname',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'Last name',
    example: 'lastname',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiHideProperty()
  teamId?: any;

  @ApiProperty({
    description: 'Email',
    example: 'user@mail.com',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactNumber?: string;

  @ApiProperty({
    description: 'Role id',
    example: 'bf842546-fa54-4c6c-935f-f8146db98756',
  })
  @IsString()
  @IsOptional()
  role?: any;
}
export class CreateMemberDto extends PartialType(MemberDto) {
  @ApiProperty({
    description: 'Project id',
    example: 'bf842546-fa54-4c6c-935f-f8146db98756',
  })
  @IsString()
  project: string;
}
