import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateDiseaseDto {
  @ApiProperty({
    description: 'Name of the disease',
    example: 'Dengue',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Short name of the disease',
    example: 'DNG',
  })
  @IsString()
  shortName: string;

  @ApiProperty({
    description: 'Code associated with the disease',
    example: 'DA12dgh',
  })
  @IsOptional()
  @IsString()
  code: string;
}
