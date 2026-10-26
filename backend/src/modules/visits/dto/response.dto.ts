import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  DiseaseResponseDto,
  UserResponseDto,
} from 'src/common/types/common-response.dto';
import { Site } from 'src/entities/site.entity';
import { Visit } from 'src/entities/visit.entity';
import { LocationResponseDto } from 'src/modules/location/dto/response.dto';
import { SampleResponseDto } from 'src/modules/samples/dto/response.dto';

class SuspectedPositives {
  disease: DiseaseResponseDto;
  sampleCount: number;
  isSuspectedPositive: boolean;
}

export class VisitSiteResponseDto extends PickType(Site, [
  'name',
  'siteCode',
  'collectionConsent',
  'collectionFrequencyInterval',
  'collectionFrequency',
  'collectionDayOfWeek',
  'collectionTime',
  'collectionStartDate',
  'collectionLastScheduleDate',
  'collectionDuration',
  'collectionExpiryDate',
  'photos',
  'farmType',
  'siteType',
  'siteOwnerName',
  'siteOwnerNumber',
  'workerNumber',
  'address',
  'pinCode',
  'comment',
]) {
  @Type(() => DiseaseResponseDto)
  diseases: DiseaseResponseDto[];

  @Type(() => UserResponseDto)
  collectionCollector?: UserResponseDto;

  @Type(() => LocationResponseDto)
  location?: LocationResponseDto;
}
export class VisitResponseDto extends PickType(Visit, [
  'id',
  'visitedAt',
  'visitScheduledAt',
  'visitStatus',
  'isCompleted',
  'createdAt',
]) {
  suspectedPositives?: SuspectedPositives[];

  @Type(() => VisitSiteResponseDto)
  site?: VisitSiteResponseDto;

  diseaseShortNames?: string[];

  @Type(() => SampleResponseDto)
  samples?: SampleResponseDto[];

  @Type(() => UserResponseDto)
  collector?: UserResponseDto;

  @Type(() => UserResponseDto)
  visitedBy?: UserResponseDto;
}

export class VisitPaginatedResponseType {
  docs: VisitResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export class PaginatedVisitResponse {
  success: boolean;
  message: string;
  data?: VisitPaginatedResponseType;
}
export class VisitResponse {
  success: boolean;
  message: string;
  data?: VisitResponseDto;
}

export class FetchAllVisitResponse {
  success: boolean;
  message: string;
  data: VisitResponseDto[];
}

export class VisitSummaryType {
  visitCount: number;
  totalSampleCollected: number;
}

export class VisitSummaryResponse {
  success: boolean;
  message: string;
  data: VisitSummaryType;
}

export class VisitData {
  id: string;
  site: string;
  project: string;
  collector: string;
  samples: {
    id: string;
    sampleType: string;
  }[];
}
