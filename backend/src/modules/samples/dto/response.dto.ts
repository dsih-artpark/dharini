import { PickType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { Sample } from 'src/common/dto/response/base.response';
import {
  DiseaseResponseDto,
  SampleTypeResponseDto,
  UserResponseDto,
} from 'src/common/types/common-response.dto';
import { LabTest } from 'src/entities/lab-test.entity';

export class SamplePaginatedResponseType {
  docs: Sample[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export class PaginatedSampleResponse {
  success: boolean;
  message: string;
  data: SamplePaginatedResponseType;
}

export class SampleResponseDto extends PickType(Sample, [
  'id',
  'sampleCode',
  'collectedAt',
  'quantity',
  'unit',
  'habitat',
  'conc',
  'collectionTime',
  'photos',
  'comment',
  'replicates',
  'originalSampleId',
]) {
  @Type(() => DiseaseResponseDto)
  disease?: DiseaseResponseDto;

  @Type(() => SampleTypeResponseDto)
  sampleType?: SampleTypeResponseDto;

  photos: string[];
}
export class SampleResponse {
  success: boolean;
  message: string;
  data: SampleResponseDto;
}

export class MultipleSampleResponse {
  success: boolean;
  message: string;
  data: SampleResponseDto[];
}

export class FetchAllSampleResponse {
  success: boolean;
  message: string;
  data: SampleResponseDto[];
}

export class SampleBreakDownType {
  id: string;
  name: string;
  code: string;
  photos: string[];
  locationId: string;
  state: string;
  district: string;
  totalSampleCount: number;
  positiveSampleCount: number;
  negativeSampleCount: number;
  unclearSampleCount: number;
}

export class SampleBreakDownResponse {
  success: boolean;
  message: string;
  data: SampleBreakDownType[];
}

export class SampleStatLogisticType {
  disease: string;
  totalCollected: number;
  totalUnclear: number;
  totalPositive: number;
  totalNegative: number;
}

export class SampleStatLogisticResponse {
  success: boolean;
  message: string;
  data: SampleStatLogisticType[];
}

export class LabTestResponseDto extends PickType(LabTest, [
  'id',
  'disease',
  'testResult',
  'testedAt',
]) {
  @Expose()
  @Type(() => UserResponseDto)
  testedBy: UserResponseDto;
}

export class LabTestResponse {
  success: boolean;
  message: string;
  data: LabTestResponseDto;
}

export class FetchAllLabTestResponse {
  success: boolean;
  message: string;
  data: LabTestResponseDto[];
}
