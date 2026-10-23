import { Type } from 'class-transformer';
import { Location } from './base.response';

class LocationResponseData extends Location {}

export class LocationResponse {
  success: boolean;
  message: string;
  @Type(() => LocationResponseData)
  data: LocationResponseData;
}

export class ListLocationResponse {
  success: boolean;
  message: string;
  @Type(() => LocationResponseData)
  data: LocationResponseData[];
}

export class ConvertExcelResponse {
  success: boolean;
  message: string;
}
