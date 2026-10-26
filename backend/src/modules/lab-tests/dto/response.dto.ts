import { PickType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  DiseaseResponseDto,
  UserResponseDto,
} from 'src/common/types/common-response.dto';
import { Disease } from 'src/entities/disease.entity';
import { LabTest } from 'src/entities/lab-test.entity';
import { Sample } from 'src/entities/sample.entity';

export class DiseaseStatisticsDto {
  @Expose()
  diseaseShortName: string;

  @Expose()
  totalSamples: number;

  @Expose()
  positiveSamples: number;
}

export class SampleExposesDto extends PickType(Sample, [
  'collectedAt',
  'collectionTime',
  'comment',
]) {}
export class LabTestResponseDto extends PickType(LabTest, [
  'id',
  'testResult',
  'testedAt',
]) {
  @Type(() => SampleExposesDto)
  sample?: SampleExposesDto;

  @Type(() => UserResponseDto)
  testedBy?: UserResponseDto;

  @Type(() => DiseaseResponseDto)
  disease?: DiseaseResponseDto;
}
export class ProjectPaginatedResponseType {
  docs: LabTestResponseDto[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}
export class PaginatedProjectResponse {
  success: boolean;
  message: string;
  data: ProjectPaginatedResponseType;
}
export class LabTestResponse {
  success: boolean;
  message: string;
  data: LabTestResponseDto;
}

export class FetchAllLabTestResponse {
  success: boolean;
  message: string;
  data: LabTestResponseDto[];
}

export class ProjectStatistics {
  disease?: Disease;
  totalProjectLocations: number;
  totalProjects: number;
}
export class ProjectStatisticsResponse {
  success: boolean;
  message: string;
  data: ProjectStatistics;
}

export class SiteStatisticsDisease {
  diseasesName: string;
  diseaseSName: string;
  siteCount: number;
}

export class SiteStatisticsByDiseaseResponse {
  success: boolean;
  message: string;
  data: SiteStatisticsDisease;
}

export class SiteStatisticsStatus {
  total: number;
  pending: number;
  positive: number;
  negative: number;
}

export class SiteStatisticsByStatusResponse {
  success: boolean;
  message: string;
  data: SiteStatisticsStatus;
}
