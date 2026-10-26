import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ description: 'Name of the project', example: 'Project demo' })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: 'Code associated with the project',
    example: 'P-123',
  })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiHideProperty()
  @IsUUID()
  @IsOptional()
  invitedBy?: any;

  @ApiHideProperty()
  @IsUUID()
  @IsNotEmpty()
  workspaceId: string;

  @ApiProperty({
    description: 'Unique identifier for the disease',
    example: ['20f0a586-1b8e-40eb-9576-b76966c5102a'],
  })
  @IsOptional()
  @IsArray()
  diseases: string[];

  @ApiProperty({
    description: 'List of unique identifiers for surveillance types',
    example: ['570c4a4c-c6f6-4138-a6ec-57aa1a81d0d2'],
  })
  @IsOptional()
  @IsArray()
  surveillanceTypes: string[];

  @ApiProperty({
    description: 'List of unique identifiers for locations',
    example: ['a382d6b2-3565-45e2-88a5-5e59b1660d84'],
  })
  @IsOptional()
  @IsArray()
  regions: string[];

  @ApiProperty({
    description: 'Email associated with the project',
    example: [
      {
        teamName: 'test1',
        email: 'test@gmail.com',
        isProjectViewer: true,
      },
    ],
  })
  @IsNotEmpty()
  teams: any[];

  @ApiHideProperty()
  @IsArray()
  @IsOptional()
  projectAdmins?: string[];

  @ApiHideProperty()
  @IsOptional()
  user?: any;
}
