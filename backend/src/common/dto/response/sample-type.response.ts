import { Type } from 'class-transformer';
import { SampleType } from './base.response';

class SampleTypeResponseData extends SampleType {}

export class SampleTypeResponse {
  success: boolean;
  message: string;
  @Type(() => SampleTypeResponseData)
  data: SampleTypeResponseData;
}

export class ListSampleTypeResponse {
  success: boolean;
  message: string;
  @Type(() => SampleTypeResponseData)
  data: SampleTypeResponseData[];
}

export class ConvertExcelResponse {
  success: boolean;
  message: string;
}
