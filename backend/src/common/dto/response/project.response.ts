import { Type } from 'class-transformer';
import { Disease, Project, Region, User, Workspace } from './base.response';

export class ProjectResponseData extends Project {
  // Which workspace owns this project. Clients need it to group a
  // multi-workspace user's projects and to tell which of their roles applies;
  // without it a project list is a flat set of ids with no tenant on it.
  // Exposes only {id, name} - see base.response.ts's strict Workspace DTO.
  @Type(() => Workspace)
  workspace?: Workspace | null;

  @Type(() => User)
  projectAdmins: User[];

  @Type(() => Disease)
  diseases: Disease[];

  @Type(() => ProjectResponseRegion)
  regions: ProjectResponseRegion[];
}

export class ProjectResponseDataExtended extends ProjectResponseData {
  totalSiteCount?: number;
}

class ProjectResponseParentRegion extends Region {}

class ProjectResponseRegion extends Region {
  parentRegion?: ProjectResponseParentRegion;
}

export class ProjectResponse {
  success: boolean;
  message: string;
  @Type(() => ProjectResponseData)
  data: ProjectResponseData;
}

export class PaginatedProjectResponse {
  success: boolean;
  message: string;
  @Type(() => ProjectResponseDataExtended)
  data: ProjectResponseDataExtended[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

class ProjectStatisticByDiseasesResponseData {
  diseasesName: string;
  diseaseSName: string;
  siteCount: number;
}

class ProjectStatisticsBySiteResponseData {
  total: number;
  pending: number;
  positive: number;
  negative: number;
}

export class ProjectStatisticByDiseaseResponse {
  success: boolean;
  message: string;
  @Type(() => ProjectStatisticByDiseasesResponseData)
  data: ProjectStatisticByDiseasesResponseData[];
}

export class ProjectStatisticBySiteResponse {
  success: boolean;
  message: string;
  @Type(() => ProjectStatisticsBySiteResponseData)
  data: ProjectStatisticsBySiteResponseData;
}

export class ProjectCollectorsResponse {
  success: boolean;
  message: string;
  data: User[];
}
