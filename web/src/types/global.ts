import { UserRole } from "@/src/types/user";

export type ApiResponse<T> = {
  success: true;
  message: string;
  data: T;
  limit: number;
  page: number;
  total: number;
  totalPages: number;
};

export type Pagination<T> = {
  docs: T;
  limit: number;
  page: number;
  total: number;
  totalPages: number;
};

/**
 * Result of `GET /users/lookup`. Deliberately minimal - the endpoint returns a
 * display name and nothing about which teams, projects or workspaces the user
 * belongs to.
 */
export type LookupUserMatch = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  contactNumber?: string | null;
};

export type LookupUserResult = {
  exists: boolean;
  user?: LookupUserMatch;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  designation: string;
  contactNumber: string;
  address?: string;
  email: string;
  userType?: string;
  roles?: UserRole[];
  team?: {
    id: string;
    teamName: string;
  };
};

export type ProjectDetail = {
  id: string;
  name: string;
  code: string;
  email: string;
  createdBy?: User;
  processDetail: string | null;
  logisticDetails: string[] | null;
  diseases: Disease[];
  surveillanceTypes: SurveillanceType[];
  regions: Region[];
  projectAdmins: User[];
  totalSiteCount: number;
};

export type ProjectInvite = {
  id: string;
  projectId: string;
  inviteToken: string;
  accepted: boolean;
  organizationType: string;
  organizationName: string;
  organization: string;
  email: string;
  userType: string;
};

export type ProjectStatistic = {
  disease: Disease;
  totalProjects: number;
  totalProjectLocations: number;
};

export type PartnerOrganization = {
  id: string;
  organizationName: string;
  email: string;
};

// 4.2: the canonical frontend Workspace type — 4.1 renamed the old
// `Organization` type/atom specifically to keep this name free for this.
export type Workspace = {
  id: string;
  name: string;
};

export type Disease = {
  id: string;
  name: string;
  shortName: string;
  code: string;
  index: number;
};

export type Species = {
  id: string;
  name: string;
  emojiIcon?: string | null;
  diseaseShortNames?: string[] | null;
  abbreviation?: string | null;
  active: boolean;
};

export type SurveillanceType = {
  id: string;
  name: string;
  status: number;
};

export type Region = {
  id: string;
  lgdCode: string;
  localName: string;
  name: string;
  regionType: string;
  parentRegion?: Region | null;
};

export type SiteStatisticsByStatus = {
  total: number;
  pending: number;
  positive: number;
  negative: number;
};

export type SiteStatisticsByDisease = {
  diseaseName: string;
  diseaseSName?: string;
  diseaseIndex: number;
  siteCount: number;
};

export type SiteWiseSampleStat = {
  id?: string;
  name: string;
  code: string;
  photos: string[];
  region: Region;
  district: string;
  state: string;
  positiveSampleCount: number;
  negativeSampleCount: number;
  unclearSampleCount: number;
  totalSampleCount: number;
};

export type SurveillanceTypes = {
  id: string;
  name: string;
};

export type WeeklyStat = {
  sites: {
    totalPresent: number;
    totalPositive: number;
  };
  visits: {
    totalPresent: number;
    totalVisited: number;
  };
  samples: {
    totalPresent: number;
    totalTested: number;
  };
};

export type uploadedFile = {
  filename: string;
  uploaded: boolean;
  fileUrl: string;
};

export type globalSearchResponse = {
  projects: { id: string; name: string }[];
  sites: { id: string; name: string; projectId: string }[];
  diseases: { id: string; name: string }[];
};
