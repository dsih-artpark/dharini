import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Species } from './base.response';

class SpeciesResponseData extends Species {}

export class SpeciesResponse {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: SpeciesResponseData })
  @Type(() => SpeciesResponseData)
  data: SpeciesResponseData;
}

export class ListSpeciesResponse {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: SpeciesResponseData, isArray: true })
  @Type(() => SpeciesResponseData)
  data: SpeciesResponseData[];
}
