import {
  Disease,
  Sample,
  SampleType,
  Site,
  User,
  Visit,
  Location,
  Region,
} from './base.response';
import { Expose, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

class VisitSampleData extends Sample {
  disease?: Disease;
  sampleType?: SampleType;
}

class VisitSiteLocationData extends Location {
  region?: Region;
}
class VisitSiteData extends Site {
  @Type(() => VisitSiteLocationData)
  location?: VisitSiteLocationData;
}

class suspectedPositivesData {
  disease?: Disease;
  sampleCount?: number;
  isSuspectedPositive?: boolean;
}
class VisitResponseData extends Visit {
  suspectedPositives?: suspectedPositivesData[];

  @ApiPropertyOptional({
    description:
      'Sequential round number of this visit for its site (Nth visit, ordered by schedule date)',
    type: Number,
  })
  @Expose()
  round?: number;

  @Type(() => VisitSiteData)
  site: VisitSiteData;

  @Type(() => VisitSampleData)
  samples: VisitSampleData[];
  collector?: User;
  visitedBy?: User;
}

export class VisitResponse {
  success: boolean;
  message: string;
  data: VisitResponseData;
}

export class SubmitVisitResponse {
  success: boolean;
  message: string;
}

export class ValidateBarcodeMessage {
  success: boolean;
  isValidBarcode: boolean;
}

export class PaginatedVisitResponse {
  success: boolean;
  message: string;
  @Type(() => VisitResponseData)
  data: VisitResponseData[];
  total: number;
  page: number;
  limit: number;
  @ApiPropertyOptional({ description: 'Total number of pages' })
  totalPages?: number;
}

export class ListVisitResponse {
  success: boolean;
  message: string;
  @Type(() => VisitResponseData)
  data: VisitResponseData[];
}

class VisitSummaryResponseData {
  visitCount: number;
  totalSampleCollected: number;
  pendingVisitsIndividual: number;
  overdueVisits: number;
  pendingVisits: number;
  completedVisits: number;
}

export class VisitSummaryResponse {
  success: boolean;
  message: string;
  data: VisitSummaryResponseData;
}
