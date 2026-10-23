import { PickType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  RegionResponseDto,
  UserResponseDto,
} from 'src/common/types/common-response.dto';
import { Disease } from 'src/entities/disease.entity';
import { Project } from 'src/entities/project.entity';

class ProjectResponseType extends PickType(Project, ['id', 'name', 'code']) {}
class DiseaseResponseDto extends PickType(Disease, [
  'id',
  'name',
  'shortName',
  'index',
]) {}
export class DiseaseStatisticsDto {
  @Expose()
  diseaseName: string;

  @Expose()
  diseaseShortName: string;

  @Expose()
  diseaseIndex: number;

  @Expose()
  totalSamples: number;

  @Expose()
  positiveSamples: number;
}

export class ProjectResponseDto extends ProjectResponseType {
  @Type(() => UserResponseDto)
  projectAdmins?: UserResponseDto[];

  @Type(() => DiseaseResponseDto)
  diseases?: DiseaseResponseDto[];

  @Type(() => RegionResponseDto)
  regions?: RegionResponseDto[];

  visitedSites?: number;

  notVisitedSites?: number;

  @Type(() => DiseaseStatisticsDto)
  diseaseStatistics?: DiseaseStatisticsDto[];

  totalSiteCount?: number;
}
export class ProjectPaginatedResponseType {
  docs: ProjectResponseDto[];
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
export class ProjectResponse {
  success: boolean;
  message: string;
  data: ProjectResponseDto;
}

export class FetchAllProjectResponse {
  success: boolean;
  message: string;
  data: ProjectResponseDto[];
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
  diseaseIndex: number;
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

export class SampleScriptResponseData {
  success: boolean;
  message: string;
}

export class ProjectDetailsRecord {
  projectId: string;
  siteId?: string | null;
  siteName?: string | null;
  regionId?: string | null;
  regionName?: string | null;
  lat?: number | null;
  lng?: number | null;
  farmType?: string | null;
  siteType?: string | null;
  address?: string | null;
  visitId?: string | null;
  visitStatus?: string | null;
  diseases?: string | null;
  sampleId: string;
  barcode: string;
  sampleName?: string | null;
  quantity?: number | null;
  unit?: string | null;
  conc?: string | null;
  labTestId?: string | null;
  ctValue?: string | null;
  variant?: string | null;
  kitOrProtocol?: string | null;
  testResult?: string | null;
  diseaseName?: string | null;
  projectName?: string | null;
  block?: string | null;
  village?: string | null;
  siteSubType?: string | null;
  state?: string | null;
  district?: string | null;
  visitScheduledAt?: string | null;
  visitedAt?: string | null;
  round?: number | null;
  diseaseQuestionnaireData?: string | null;
  environmentalQuestionnaireData?: string | null;
  collectedAt?: string | null;
  sampleStatus?: string | null;
  rejectReason?: string | null;
  sampleSpecies?: string | null;
  animalTagId?: string | null;
  birdId?: string | null;
  animalSpecies?: string | null;
  breed?: string | null;
  ageYears?: number | null;
  ageMonths?: number | null;
  gender?: string | null;
  vaccinationStage?: string | null;
  diseaseHistory?: string | null;
  feverObserved?: boolean | null;
  dropInFeedIntake?: boolean | null;
  dropInWaterIntake?: boolean | null;
  dropInEggProduction?: boolean | null;
  avgMilkProductionPerDayWithinOneYear?: number | null;
  avgMilkProductionPerDayBeforeOneYear?: number | null;
  viralLoad?: string | null;
  resultDate?: string | null;
  testedAt?: string | null;
}

export class ProjectDetailsResponse {
  success: boolean;
  message: string;
  data: ProjectDetailsRecord[];
}
