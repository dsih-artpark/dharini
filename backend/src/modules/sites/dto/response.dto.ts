import { PickType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  DiseaseResponseDto,
  UserResponseDto,
} from 'src/common/types/common-response.dto';
import { Project } from 'src/entities/project.entity';
import { Site } from 'src/entities/site.entity';
import { LocationResponseDto } from 'src/modules/location/dto/response.dto';
import { Point } from 'typeorm';

export class ProjectExposeDto extends PickType(Project, ['id', 'name']) {}
export class SiteResponseDto extends PickType(Site, [
  'id',
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
  'siteSubType',
  'siteType',
  'siteOwnerName',
  'siteOwnerNumber',
  'workerNumber',
  'address',
  'pinCode',
  'comment',
  'testResult',
]) {
  @Expose()
  @Type(() => ProjectExposeDto)
  project: ProjectExposeDto;

  @Type(() => DiseaseResponseDto)
  diseases: DiseaseResponseDto[];

  @Type(() => UserResponseDto)
  collectionCollector?: UserResponseDto;

  @Type(() => LocationResponseDto)
  location?: LocationResponseDto;
}

export class SitePaginatedResponseType {
  docs: SiteResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export class PaginatedSiteResponse {
  success: boolean;
  message: string;
  data: SitePaginatedResponseType;
}
export class SiteResponse {
  success: boolean;
  message: string;
  data: SiteResponseDto;
}

export class FetchAllSiteResponse {
  success: boolean;
  message: string;
  data: SiteResponseDto[];
}

export class SiteStatType {
  district: string;
  positiveCount: number;
  totalSiteCount: number;
}

export class MostPositiveSiteResponse {
  success: boolean;
  message: string;
  data: { siteStats: SiteStatType[] }; // Wrap the array inside an object
}

export class SiteStat {
  totalPresent: number;
  totalPositive: number;
}

export class VisitStat {
  totalPresent: number;
  totalVisited: number;
}

export class SampleStat {
  totalPresent: number;
  totalTested: number;
}

export class GetSiteOnDiseaseResponse {
  success: boolean;
  message: string;
  data: {
    sites: SiteStat;
    visits: VisitStat;
    samples: SampleStat;
  };
}

export class DiseaseSiteStat {
  diseaseId: string;
  diseaseName: string;
  shortName: string;
  totalSites: number;
  positiveSites: number;
  negativeSites: number;
  positiveSitesCoordinates: any[];
  negativeSitesCoordinates: any[];
}

export class DiseaseFreeSite {
  coordinates: Point;
  siteName: string;
  totalSampleCount: number;
  totalPositiveSampleCount: number;
}

export class ExploreSitesResponse {
  success: boolean;
  message: string;
  data: {
    siteData: DiseaseSiteStat[];
    diseaseFreeSiteCount: number;
    diseaseFreeSitesCoordinates: DiseaseFreeSite[];
  };
}

export class FileUploadResult {
  filename: string;
  uploaded: boolean;
  fileUrl: string | null;
}

export class UploadMultipleFilesResponse {
  success: boolean;
  message: string;
  data: FileUploadResult[];
}

export class SiteStatResponse {
  success: boolean;
  message: string;
  data: { siteStats: SiteStatType[] };
}

export class SiteData {
  id: string;
  project: any;
  diseases: any[];
  visits: any[];
  collectionCollector: any;
  createdBy: any;
  updatedBy: any;
  location: any;
  samples: any[];
}

export class SiteDetailsResponse {
  success: boolean;
  message: string;
  data: {
    site: SiteData;
    photos: string[];
  };
}
