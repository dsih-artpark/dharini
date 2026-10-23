import { Type } from 'class-transformer';
import { Region } from './base.response';

export class RegionResponseData extends Region {
  @Type(() => Region)
  subRegions?: Region[];

  @Type(() => Region)
  parentRegion?: Region;
}

export class RegionResponse {
  success: boolean;
  message: string;
  @Type(() => RegionResponseData)
  data: RegionResponseData;
}

export class ProjectLocationStateType {
  id: string;
  regionType: string;
  lgdcode: number;
  localname: string;
  name: string;
  createdat: Date;
  updatedat: Date;
}

export class ProjectLocationStateResponse {
  success: boolean;
  message: string;
  @Type(() => ProjectLocationStateType)
  data: ProjectLocationStateType[];
}

export class ListRegionResponse {
  success: boolean;
  message: string;
  @Type(() => RegionResponseData)
  data: RegionResponseData[];
}

export class ConvertExcelResponse {
  success: boolean;
  message: string;
}
