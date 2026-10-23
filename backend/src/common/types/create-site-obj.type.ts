import { DayOfWeek } from '../enums/daysofweek.enum';
import { SiteType } from '../enums/site.enum';

export type CreateSiteObj = {
  name: string;
  siteCode: string;
  farmType: string;
  siteSubType?: string;
  siteType: SiteType;
  siteOwnerName: string;
  siteOwnerNumber: string;
  workerNumber: number;
  address: string;
  regionId: string;
  pinCode: number;
  latitude: number;
  longitude: number;
  photos: any[];
  comment: string;
  collectionFrequencyInterval?: number;
  collectionFrequency?: number;
  collectionDayOfWeek?: DayOfWeek[];
  collectionLastScheduleDate?: Date;
  collectionDuration?: number;
};
