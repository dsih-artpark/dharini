import { RegionResponseDto } from 'src/common/types/common-response.dto';

export class FetchAllRegionResponse {
  success: boolean;
  message: string;
  data: RegionResponseDto[];
}

export class CreateRegionResponse {
  success: boolean;
  message: string;
  data: RegionResponseDto;
}

export class RegionListResponse {
  id: string;
  name: string;
  regionType: string;
}

export class FindAllRegionsResponse {
  success: boolean;
  message: string;
  data: RegionResponseDto[];
}

export class RegionDetailResponse {
  id: string;
  name: string;
  regionType: string;
  parentRegion?: RegionDetailResponse;
  subRegions?: RegionDetailResponse[];
}

export class FindOneRegionResponse {
  success: boolean;
  message: string;
  data: RegionDetailResponse;
}

export class RegionUpdateResponse {
  success: boolean;
  message: string;
  data: RegionDetailResponse;
}

export class ConvertExcelResponse {
  success: boolean;
  message: string;
}
