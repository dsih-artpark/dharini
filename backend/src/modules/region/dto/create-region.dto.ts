import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RegionType } from 'src/common/enums/region.enum';

export class CreateRegionDto {
  @IsEnum(RegionType)
  @IsNotEmpty()
  regionType: RegionType;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  parentId?: string;
}
