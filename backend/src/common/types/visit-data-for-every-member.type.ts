import { VisitStatus } from '../enums/visitStatus.enum';

export interface VisitDataForEveryMember {
  id: string;
  siteName: string;
  siteAddress: string;
  siteState: string;
  siteDistrict: string;
  visitScheduledAt: Date;
  visitStatus: VisitStatus;
}
