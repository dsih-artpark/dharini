import { PartialType } from '@nestjs/mapped-types';
import { CreateRegionDto } from './create-region.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { StatusType } from '../../../common/enums/status.enum';

import { RegionType } from 'src/common/enums/region.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRegionDto extends PartialType(CreateRegionDto) {
  @IsEnum(RegionType)
  regionType: RegionType;

  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Status of the region',
    enum: StatusType,
  })
  @IsOptional()
  @IsEnum(StatusType)
  status?: StatusType;
}
