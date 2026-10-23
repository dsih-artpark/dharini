import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSpeciesDto {
  @ApiProperty({ description: 'The name of the species', example: 'Chicken' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Dynamic emoji for the species',
    example: '🐔',
  })
  @IsString()
  @IsOptional()
  emojiIcon?: string;

  @ApiPropertyOptional({
    description: 'Abbreviation for the species',
    example: 'CH',
  })
  @IsString()
  @IsOptional()
  abbreviation?: string;

  @ApiPropertyOptional({
    description: 'Applicable disease short names',
    example: ['AI', 'FMD'],
  })
  @IsArray()
  @IsOptional()
  diseaseShortNames?: string[];

  @ApiPropertyOptional({ description: 'Active status', example: true })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
