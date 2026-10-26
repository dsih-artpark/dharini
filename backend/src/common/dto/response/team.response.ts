import { Type } from 'class-transformer';
import { Team, User } from './base.response';
import { VisitStatus } from 'src/common/enums/visitStatus.enum';

export class TeamResponseData extends Team {
  @Type(() => User)
  members?: User[];
}

export class TeamResponse {
  success: boolean;
  message: string;
  @Type(() => TeamResponseData)
  data: TeamResponseData;
}

export class RemovedTeamMemberResponse {
  success: boolean;
  message: string;
  removedMembers: string[];
}

export class TeamProgressActivityOverviewResponseData {
  activeMembers: number;
  collectedSamples: number;
}
export class TeamProgressActivityOverviewResponse {
  success: boolean;
  message: string;
  @Type(() => TeamProgressActivityOverviewResponseData)
  data: TeamProgressActivityOverviewResponseData;
}

export class ListTeamResponse {
  success: boolean;
  message: string;
  @Type(() => TeamResponseData)
  data: TeamResponseData[];
}

export class MembersActivityDataType {
  visits: VisitDataForEveryMemberType[];
  totalNumberOfVisitsAssigned: number;
  collector: string;
  id: string;
  totalNumberOfVisitsPending: number;
  totalNumberOfVisitsOverDue: number;
}

export class VisitDataForEveryMemberType {
  siteName: string;
  siteAddress: string;
  siteState: string;
  siteDistrict: string;
  visitScheduledAt: Date;
  visitStatus: VisitStatus;
}

export class TeamMemberActivityResponse {
  success: boolean;
  message: string;
  @Type(() => MembersActivityDataType)
  data: MembersActivityDataType[];
}

export class TeamMembersCollectorListType {
  id: string;
  firstName: string;
  lastName: string;
  siteCount: number;
  lastVisitedVisit?: Date;
}

export class TeamMemberPaginatedResponseType {
  docs: TeamMembersCollectorListType[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export class PaginatedTeamMemberResponse {
  success: boolean;
  message: string;
  @Type(() => User)
  data: TeamMembersCollectorListType[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export class TeamProgressResponseData {
  id: string;
  name: string;
  pendingVisitCount: number;
  completedVisitCount: number;
  totalTeamMemberCount: number;
  photos?: string[];
  farmType?: string;
  siteSubType?: string;
  siteType?: string;
  status?: string;
  collectionCollector?: {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

export class TeamActivityProgressResponseData {
  totalPendingSampleCount: number;
  totalCompletedSampleCount: number;
}

export class TeamMemberActivityResponseData {
  id: string;
  firstName: string;
  lastName: string;
  totalCollected: number;
  totalReceived: number;
  totalExtracted: number;
  totalTested: number;
  totalReportGenerated: number;
}

export class PaginatedTeamProgressResponse {
  success: boolean;
  message: string;
  @Type(() => TeamProgressResponseData)
  data: TeamProgressResponseData[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export class TeamActivityProgressResponse {
  success: boolean;
  message: string;
  @Type(() => TeamActivityProgressResponseData)
  data: TeamActivityProgressResponseData;
}

export class PaginatedTeamMemberActivityResponse {
  success: boolean;
  message: string;
  @Type(() => TeamMemberActivityResponseData)
  data: TeamMemberActivityResponseData[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export class TeamMemberProgressResponseData {
  userId: string;
  firstName: string;
  lastName: string;
  siteId: string;
  siteName: string;
  pendingVisitCount: number;
  completedVisitCount: number;
  totalCollected: number;
  totalReceived: number;
  totalExtracted: number;
  totalTested: number;
  totalReportGenerated: number;
}

export class PaginatedTeamMemberProgressResponse {
  success: boolean;
  message: string;
  @Type(() => TeamMemberProgressResponseData)
  data: TeamMemberProgressResponseData[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}
