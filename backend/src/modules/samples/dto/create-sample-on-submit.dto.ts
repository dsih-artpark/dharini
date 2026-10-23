import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ReplicateAvailability } from 'src/common/enums/replicateAvailability.enum';
import { SampleStatus } from 'src/common/enums/sample-status.enum';
import { StatusType } from '../../../common/enums/status.enum';

export class CreateSampleOnVisitDto {
  @ApiProperty({
    description: 'Quantity',
    example: 2,
  })
  @IsNumber()
  @IsOptional()
  quantity?: number;

  @ApiProperty({
    description: 'Replicates',
    example: ReplicateAvailability.AVAILABLE,
  })
  @IsEnum(ReplicateAvailability)
  replicates: ReplicateAvailability;

  @ApiProperty({
    description: 'Unit',
    example: 'ml',
  })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiProperty({
    description: 'file path',
    example: ['https://<s3>/<bucket>/<filepath>'],
  })
  @IsOptional()
  photos?: string[];

  @ApiProperty({
    description: 'barcode',
    example: 'G-2407-E-L-11-09',
  })
  @IsOptional()
  barcode: string;

  @ApiProperty({
    description: 'barcode of original sample if exist',
    example: 'G-2407-E-L-11-09',
  })
  @IsOptional()
  originalSampleBarcode?: string;

  @ApiProperty({
    description: 'disease id array',
    example: ['diseaseId1', 'diseaseId1'],
  })
  diseases: any[];

  @ApiProperty({
    description: 'when the sample is tested',
    example: 'test date',
  })
  @IsOptional()
  testDate?: Date;

  @ApiProperty({
    description: 'who tested the sample',
    example: 'user id',
  })
  @IsOptional()
  collectedBy: any;

  @ApiProperty({
    description: 'location',
    example: 'pune',
  })
  @IsOptional()
  location?: string;

  @ApiProperty({
    description: 'enum [positive, negative, unclear]',
    example: 'positive',
  })
  @IsOptional()
  sampleStatus?: SampleStatus;

  @ApiProperty({
    description: 'who has tested ',
    example: 'userid',
  })
  @IsOptional()
  testedBy?: string;

  @ApiProperty({
    description: 'comments',
    example: 'Anything regarding sample',
  })
  @IsOptional()
  comment?: string;

  @ApiProperty({
    description: 'Sample type UUID',
    example: 'Sample type UUID',
  })
  sampleType: any;

  @ApiPropertyOptional({
    description: 'Species UUID',
    example: 'Species UUID',
  })
  @IsOptional()
  species?: any;

  @ApiHideProperty()
  @IsNumber()
  @IsOptional()
  status?: StatusType;

  @ApiPropertyOptional({
    description:
      'Additional sample metadata (e.g. animal info for FMD/LSD, farm info for AI)',
  })
  @IsOptional()
  details?: any;
}
