// create-user.dto.ts
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email',
    example: 'user@gmaill.com',
  })
  @IsOptional()
  @IsString()
  email?: string;

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
  @IsOptional()
  @IsString()
  contactNumber?: string;

  @ApiPropertyOptional({
    description: 'Designation',
    example: 'Field Coordinator',
  })
  @IsOptional()
  @IsString()
  designation?: string;

  @ApiHideProperty()
  @IsOptional()
  role?: any;

  @ApiHideProperty()
  @IsOptional()
  project?: any;

  @ApiHideProperty()
  @IsOptional()
  team?: any;
}
