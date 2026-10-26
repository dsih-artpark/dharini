import { SurveillanceTypeResponseDto } from 'src/common/types/common-response.dto';

export class FetchAllSurveillanceTypeResponse {
  success: boolean;
  message: string;
  data: SurveillanceTypeResponseDto[];
}
export class SurveillanceTypeResponse {
  success: boolean;
  message: string;
  data: SurveillanceTypeResponseDto;
}
