import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { RegionResponseDto } from 'src/common/types/common-response.dto';
import { Location } from 'src/entities/location.entity';

export class LocationResponseDto extends PickType(Location, [
  'id',
  'coordinates',
]) {
  @Type(() => RegionResponseDto)
  region?: RegionResponseDto;
}
export class FetchAllLocationResponse {
  success: boolean;
  message: string;
  data: LocationResponseDto[];
}
export class LocationResponse {
  success: boolean;
  message: string;
  data?: LocationResponseDto;
}
