import { Type } from 'class-transformer';
import { Disease } from './base.response';

class DiseaseResponseData extends Disease {}

export class DiseaseResponse {
  success: boolean;
  message: string;
  @Type(() => DiseaseResponseData)
  data: DiseaseResponseData;
}

export class ListDiseaseResponse {
  success: boolean;
  message: string;
  @Type(() => DiseaseResponseData)
  data: DiseaseResponseData[];
}

export class ConvertExcelResponse {
  success: boolean;
  message: string;
}

export class DiseaseSampleStatsType {
  totalSamples: number;
  testedSamples: number;
}

export class DiseaseSampleStatsResponseData {
  diseaseName: DiseaseSampleStatsType;
}

export class DiseaseStatsResponseData {
  diseaseStats: DiseaseSampleStatsResponseData;
}

export class DiseaseStatsResponse {
  success: boolean;
  message: string;
  data: DiseaseStatsResponseData;
}
