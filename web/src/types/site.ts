import { User, Disease, ProjectDetail, Region } from "@/src/types/global";
import type { Visit } from "@/src/types/visit";

export type Site = {
  id?: string;
  name?: string;
  siteCode?: string;
  photos?: string[];
  project?: string | ProjectDetail;
  farmType?: string;
  siteType?: string;
  siteSubType?: string;
  status?: string;
  diseaseIds?: string[];
  siteOwnerName?: string;
  siteOwnerNumber?: number;
  workerNumber?: number;
  address?: string;
  pinCode?: number;
  latitude?: number;
  longitude?: number;
  regionId?: string;
  location?: {
    coordinates?: Coordinate;
    region: Region & { parentRegion: Region };
  };
  // "true" | "false" as strings; null when never recorded
  collectionConsent?: string | null;
  testResult?: string;
  lastVisited?: string;
  diseases?: Disease[];
  comment?: string;
  visits?: Visit[];
  collectionFrequency?: number;
  collectionFrequencyInterval?: number;
  collectionDayOfWeek?: string[];
  collectionTime?: string;
  collectionDuration?: number;
  collectionStartDate?: string;
  nextCollectionDate?: string;
  collectionLastScheduleDate?: string;
  collectionExpiryDate?: string;
  collectionCollector?: string | User;
  createdBy?: User;
  createdAt?: string;
  updatedAt?: string;
  updatedBy?: User;
};

export type Coordinate = {
  type: string;
  crs: {
    type: string;
    properties: {
      name: string;
    };
  };
  coordinates: [number, number];
};

export type ExploreSite = {
  siteData: {
    diseaseId: string;
    diseaseName: string;
    shortName: string;
    diseaseIndex: number;
    totalSites: number;
    positiveSites: number;
    negativeSites: number;
    positiveSitesCoordinates: {
      siteId?: string;
      coordinates: Coordinate;
      totalPositiveSampleCount?: number;
      totalNegativeSampleCount?: number;
      totalUnclearSampleCount?: number;
      totalSampleCount?: number;
      siteName: string;
      farmType?: string;
    }[];
    color?: string;
  }[];
  diseaseFreeSiteCount: number;
  diseaseFreeSitesCoordinates: {
    siteId?: string;
    coordinates: Coordinate;
    siteName: string;
    totalPositiveSampleCount: number;
    totalNegativeSampleCount?: number;
    totalUnclearSampleCount?: number;
    totalSampleCount: number;
    farmType?: string;
    shortName?: string;
  }[];
};
