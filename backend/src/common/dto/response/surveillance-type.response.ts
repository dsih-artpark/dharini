import { Type } from 'class-transformer';
import { SurveillanceType } from './base.response';

class SurveillanceTypeResponseData extends SurveillanceType {}

export class SurveillanceTypeResponse {
  success: boolean;
  message: string;
  @Type(() => SurveillanceTypeResponseData)
  data: SurveillanceTypeResponseData;
}

export class ListSurveillanceTypeResponse {
  success: boolean;
  message: string;
  @Type(() => SurveillanceTypeResponseData)
  data: SurveillanceTypeResponseData[];
}

export class ConvertExcelResponse {
  success: boolean;
  message: string;
}
