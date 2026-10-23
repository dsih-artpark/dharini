import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Project, Site } from './base.response';

class ProjectSearchResponseData extends PickType(Project, [
  'id',
  'name',
] as const) {}

class SiteSearchResponseData extends PickType(Site, ['id', 'name'] as const) {
  projectId: string;
}

class DiseaseSearchResponseData {
  id: string;
  name: string;
}

export class SearchResponseData {
  @Type(() => ProjectSearchResponseData)
  projects: ProjectSearchResponseData[];

  @Type(() => SiteSearchResponseData)
  sites: SiteSearchResponseData[];

  @Type(() => DiseaseSearchResponseData)
  diseases: DiseaseSearchResponseData[];
}

export class SearchResponse {
  success: boolean;
  message: string;
  @Type(() => SearchResponseData)
  data: SearchResponseData;
}
