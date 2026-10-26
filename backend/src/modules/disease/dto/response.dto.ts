import { DiseaseResponseDto } from 'src/common/types/common-response.dto';

export class FetchAllDiseaseResponse {
  success: boolean;
  message: string;
  data: DiseaseResponseDto[];
}
export class DiseaseResponse {
  success: boolean;
  message: string;
  data: DiseaseResponseDto;
}

export class DiseaseSampleStatsType {
  totalSamples: number;
  testedSamples: number;
}

export class DiseaseSampleStats {
  diseaseName: DiseaseSampleStatsType;
}

export class DiseaseStats {
  diseaseStats: DiseaseSampleStats;
}

export class DiseaseStatsResponse {
  success: boolean;
  message: string;
  data: DiseaseStats;
}
