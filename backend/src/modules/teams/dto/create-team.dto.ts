import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTeamDto {
  @ApiHideProperty()
  project?: any;

  @ApiProperty({ description: 'Name of the team', example: 'Team Dharini' })
  @IsNotEmpty()
  @IsString()
  teamName: string;

  @ApiProperty({
    description: 'First Name of the team admin',
    example: 'dharini',
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'LastName of the team admin',
    example: 'artpark',
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Email of the team admin',
    example: 'dharini@yopmail.com',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactNumber?: string;

  @ApiProperty({ description: 'ProjectViewer of the team', example: true })
  @IsNotEmpty()
  @IsBoolean()
  isProjectViewer: boolean;
}
