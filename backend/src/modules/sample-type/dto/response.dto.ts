import { SampleTypeResponseDto } from 'src/common/types/common-response.dto';

export class FetchAllSampleTypeResponse {
  success: boolean;
  message: string;
  data: SampleTypeResponseDto[];
}
export class SampleTypeResponse {
  success: boolean;
  message: string;
  data: SampleTypeResponseDto;
}
