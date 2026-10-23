import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class LabTestDetailsDto {
  @ApiProperty() 'Conc. (ng/µl)': number;
  @ApiProperty() '260/280 Ratio': number;
  @ApiProperty() 'Kit 1 H5 Ct Value': string | number;
  @ApiProperty() 'Kit 1 N1 Ct Value': string | number;
  @ApiProperty() 'Kit 1 Influenza A Ct Value': string | number;
  @ApiProperty() 'Kit 2 H5 Ct Value': string | number;
  @ApiProperty() 'Kit 2 H7 Ct Value': string | number;
  @ApiProperty() 'Kit 2 H9 Ct Value': string | number;
}

export class LabTestDto {
  @ApiProperty() disease: string;
  @ApiProperty() testedAt: string;
  @ApiProperty() testResult: string;

  @ApiProperty({ type: () => Object }) testedBy: any;

  @ApiProperty({ type: LabTestDetailsDto }) extraDetails: LabTestDetailsDto;
  @ApiProperty({ type: LabTestDetailsDto }) details: LabTestDetailsDto;
}

export class SampleDto {
  @ApiProperty() sampleId: string;
  @ApiProperty() barcode: string;
  @ApiProperty() replicates: string;
  @ApiProperty() comment: string;
  @ApiProperty({ type: [String] }) diseases: string[];
  @ApiProperty({ type: [String] }) photos: string[];
  @ApiProperty() latitude: number;
  @ApiProperty() longitude: number;

  @ApiProperty({ type: [LabTestDto] })
  @Type(() => LabTestDto)
  labTests: LabTestDto[];
}

export class VisitDto {
  @ApiProperty() visitId: string;

  @ApiProperty({ type: () => Object })
  visitData: any;

  @ApiProperty({ type: [SampleDto] })
  @Type(() => SampleDto)
  samples: SampleDto[];
}

export class UpdatePayloadDto {
  @ApiProperty() collectionCollector: string;
  @ApiProperty() collectionFrequencyInterval: number;
  @ApiProperty() collectionFrequency: number;
  @ApiProperty({ type: [String] }) collectionDayOfWeek: string[];
  @ApiProperty() collectionTime: string;
  @ApiProperty() collectionDuration: number;
}

export class CreatePayloadDto {
  @ApiProperty() project: string;
  @ApiProperty() name: string;
  @ApiProperty() farmType: string;
  @ApiProperty() siteType: string;
  @ApiProperty() siteOwnerName: string;
  @ApiProperty() siteOwnerNumber: string;
  @ApiProperty() workerNumber: number;
  @ApiProperty() address: string;
  @ApiProperty() regionId: string;
  @ApiProperty() pinCode: string | null;
  @ApiProperty() latitude: number;
  @ApiProperty() longitude: number;
  @ApiProperty() comment: string;
  @ApiProperty({ type: [String] }) photos: string[];
}

export class StructuredSiteDto {
  @ValidateNested({ each: true })
  @Type(() => CreatePayloadDto)
  sites: CreatePayloadDto[];

  @ValidateNested({ each: true })
  @Type(() => VisitDto)
  visits: VisitDto[];

  @ValidateNested({ each: true })
  @Type(() => SampleDto)
  samples: SampleDto[];

  @ValidateNested({ each: true })
  @Type(() => LabTestDto)
  labTests: LabTestDto[];

  @ApiHideProperty()
  user: any;
}
