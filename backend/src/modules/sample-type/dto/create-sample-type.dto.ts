import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { StatusType } from '../../../common/enums/status.enum';

export class CreateSampleTypeDto {
  @ApiProperty({
    description: 'Name',
    example: 'Blood',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'surveillanceType',
    example: 'Clinical surveillanceTypeId',
  })
  @IsUUID()
  surveillanceType: any;

  @ApiProperty({
    description: 'Dynamic emoji for the sample type',
    example: '🚰',
    required: false,
  })
  @IsString()
  @IsOptional()
  emojiIcon?: string;

  @ApiProperty({
    description: 'Abbreviation for the sample type',
    example: 'CL',
    required: false,
  })
  @IsString()
  @IsOptional()
  abbreviation?: string;

  @ApiProperty({
    description: 'List of applicable disease short names',
    example: ['AI', 'FMD'],
    required: false,
    isArray: true,
    type: String,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  diseaseShortNames?: string[];

  @ApiProperty({
    description: 'Status',
    enum: StatusType,
  })
  @IsNumber()
  @IsOptional()
  status?: StatusType;
}
