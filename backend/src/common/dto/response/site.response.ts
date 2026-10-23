import { Type } from 'class-transformer';
import {
  Disease,
  Location,
  LocationCoordinates,
  Site,
  Team,
  User,
} from './base.response';

class UserWithTeamResponse extends User {
  @Type(() => Team)
  team?: Team;
}
export class SiteResponseData extends Site {
  @Type(() => Disease)
  diseases: Disease[];

  @Type(() => User)
  collectionCollector?: User;

  @Type(() => UserWithTeamResponse)
  createdBy?: UserWithTeamResponse;

  @Type(() => Location)
  location?: Location;
}

export class NearbySiteResponseData extends SiteResponseData {
  distance: number;
}

export class SiteResponse {
  success: boolean;
  message: string;
  @Type(() => SiteResponseData)
  data: SiteResponseData;
}

export class ListSiteResponse {
  success: boolean;
  message: string;
  @Type(() => SiteResponseData)
  data: SiteResponseData[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export class ListNearbySiteResponse {
  success: boolean;
  message: string;
  @Type(() => NearbySiteResponseData)
  data: NearbySiteResponseData[];
}

class DiseaseSiteStat {
  diseaseId: string;
  diseaseName: string;
  diseaseIndex?: number;
  shortName: string;
  totalSites: number;
  positiveSites: number;
  negativeSites: number;
  positiveSitesCoordinates: any[];
  negativeSitesCoordinates: any[];
}

class DiseaseFreeSite {
  coordinates: LocationCoordinates;
  siteName: string;
  totalSampleCount: number;
  totalPositiveSampleCount: number;
}

class ExploreSiteData {
  @Type(() => DiseaseSiteStat)
  siteData: DiseaseSiteStat[];
  diseaseFreeSiteCount: number;
  @Type(() => DiseaseFreeSite)
  diseaseFreeSitesCoordinates: DiseaseFreeSite[];
}

export class ExploreSitesResponse {
  success: boolean;
  message: string;
  @Type(() => ExploreSiteData)
  data: ExploreSiteData;
}

class GetSiteOnDiseaseResponseData {
  sites: GetSiteOnDiseaseSiteStatData;
  visits: GetSiteOnDiseaseVisitStatData;
  samples: GetSiteOnSampleVisitStatData;
}

class GetSiteOnDiseaseSiteStatData {
  totalPresent: number;
  totalPositive: number;
}

class GetSiteOnDiseaseVisitStatData {
  totalPresent: number;
  totalVisited: number;
}

class GetSiteOnSampleVisitStatData {
  totalPresent: number;
  totalTested: number;
}

export class GetSiteOnDiseaseResponse {
  success: boolean;
  message: string;
  @Type(() => GetSiteOnDiseaseResponseData)
  data: GetSiteOnDiseaseResponseData;
}

class SiteStatType {
  district: string;
  positiveCount: number;
  totalSiteCount: number;
}

class MostPositiveSiteResponseData {
  @Type(() => SiteStatType)
  siteStats: SiteStatType[];
}

export class MostPositiveSiteResponse {
  success: boolean;
  message: string;
  data: MostPositiveSiteResponseData;
}
