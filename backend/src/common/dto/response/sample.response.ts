import { Type } from 'class-transformer';
import {
  Disease,
  Location,
  Project,
  Sample,
  Team,
  Visit,
} from './base.response';
import { LabTestResponseData } from './lab-test.response';
import { SiteResponseData } from './site.response';

export class SampleResponseData extends Sample {
  @Type(() => Project)
  project?: Project;

  @Type(() => SiteResponseData)
  site?: SiteResponseData;

  @Type(() => Disease)
  diseases?: Disease[];

  @Type(() => Team)
  team?: Team;

  @Type(() => Location)
  location?: Location;

  @Type(() => Visit)
  visit?: Visit;

  @Type(() => LabTestResponseData)
  labTests?: LabTestResponseData[];

  hasAI?: boolean;
}

export class SampleResponse {
  success: boolean;
  message: string;
  @Type(() => SampleResponseData)
  data: SampleResponseData;
}

export class ListSampleResponse {
  success: boolean;
  message: string;
  @Type(() => SampleResponseData)
  data: SampleResponseData[];
}

export class PaginatedSampleResponse {
  success: boolean;
  message: string;
  @Type(() => SampleResponseData)
  data: SampleResponseData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class SampleBreakDownResponseData {
  id: string;
  name: string;
  code: string;
  photos: string[];
  locationId: string;
  state: string;
  district: string;
  totalSampleCount: number;
  positiveSampleCount: number;
  negativeSampleCount: number;
  unclearSampleCount: number;
}

export class SampleBreakDownResponse {
  success: boolean;
  message: string;
  data: SampleBreakDownResponseData[];
}

export class SampleStatLogisticResponseData {
  totalCollected: number;
  totalUnclear: number;
  totalPositive: number;
  totalNegative: number;
}

export class SampleStatLogisticResponse {
  success: boolean;
  message: string;
  data: SampleStatLogisticResponseData[];
}
