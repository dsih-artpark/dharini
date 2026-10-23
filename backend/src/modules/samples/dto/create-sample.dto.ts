import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ReplicateAvailability } from 'src/common/enums/replicateAvailability.enum';
import { SampleStatus } from 'src/common/enums/sample-status.enum';
import { StatusType } from '../../../common/enums/status.enum';

export class CreateSampleDto {
  @ApiProperty({ description: 'Quantity', example: 2 })
  @IsNumber()
  @IsOptional()
  quantity?: number;

  @ApiPropertyOptional({
    description: 'Replicates',
    example: ReplicateAvailability.AVAILABLE,
  })
  @IsEnum(ReplicateAvailability)
  @IsOptional()
  replicates?: ReplicateAvailability;

  @ApiProperty({ description: 'Unit', example: 'ml' })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiHideProperty()
  project?: any;

  @ApiProperty({
    description: 'File path',
    example: ['https://<s3>/<bucket>/<filepath>'],
  })
  @IsOptional()
  photos?: string[];

  @ApiProperty({ description: 'Barcode', example: 'G-2407-E-L-11-09' })
  @IsOptional()
  barcode: string;

  @ApiProperty({
    description: 'Barcode of original sample if exist',
    example: 'G-2407-E-L-11-09',
  })
  @IsOptional()
  originalSampleBarcode?: string;

  @ApiProperty({ description: 'Site UUID', example: 'Site id' })
  @IsUUID()
  site: any;

  @ApiProperty({ description: 'Team UUID', example: 'Team id' })
  @IsUUID()
  team: any;

  @ApiProperty({
    description: 'Disease ID array',
    example: ['diseaseId1', 'diseaseId2'],
  })
  diseases: any[];

  @ApiProperty({
    description: 'When the sample is tested',
    example: '2025-03-21T10:00:00Z',
  })
  @IsOptional()
  testDate?: Date;

  @ApiProperty({ description: 'Who collected the sample', example: 'User id' })
  @IsOptional()
  collectedBy?: any;

  @ApiProperty({ description: 'Who received the sample', example: 'User id' })
  @IsOptional()
  receivedBy?: any;

  @ApiProperty({ description: 'Who extracted the sample', example: 'User id' })
  @IsOptional()
  extractedBy?: any;

  @ApiProperty({ description: 'Who tested the sample', example: 'User id' })
  @IsOptional()
  testedBy?: any;

  @ApiProperty({
    description: 'Who generated the sample report',
    example: 'User id',
  })
  @IsOptional()
  reportGeneratedBy?: any;

  @ApiPropertyOptional({
    description: 'latitude',
    example: '40.2331',
  })
  latitude?: number;

  @ApiPropertyOptional({
    description: 'longitude',
    example: '-70.4453',
  })
  longitude?: number;

  @ApiProperty({
    description:
      'Sample status enum [picked-up, received, extracted, tested, rejected, test-report-generated]',
    example: 'tested',
  })
  @IsOptional()
  @IsEnum(SampleStatus)
  sampleStatus?: SampleStatus;

  @ApiProperty({
    description: 'Comments',
    example: 'Anything regarding sample',
  })
  @IsOptional()
  comment?: string;

  @ApiProperty({ description: 'Visit UUID', example: 'Visit id' })
  @IsUUID()
  visit: any;

  @ApiProperty({ description: 'Sample type UUID', example: 'Sample type UUID' })
  sampleType: any;

  @ApiPropertyOptional({ description: 'Species UUID', example: 'Species UUID' })
  @IsOptional()
  species?: any;

  @ApiHideProperty()
  @IsNumber()
  @IsOptional()
  status?: StatusType;

  // Added Fields
  @ApiPropertyOptional({
    description: 'Reason for rejection',
    example: 'Sample contaminated',
  })
  @IsOptional()
  @IsString()
  rejectReason?: string | null;

  @ApiPropertyOptional({
    description: 'Timestamp when the sample was received',
    example: '2025-03-21T10:00:00Z',
  })
  @IsOptional()
  receivedAt?: Date | null;

  @ApiPropertyOptional({ description: 'Received volume value', example: '5' })
  @IsOptional()
  @IsString()
  receivedVolumeValue?: string | null;

  @ApiPropertyOptional({ description: 'Received volume unit', example: 'ml' })
  @IsOptional()
  @IsString()
  receivedVolumeUnit?: string | null;

  @ApiPropertyOptional({
    description: 'Received lab storage details',
    example: 'Stored in freezer -20°C',
  })
  @IsOptional()
  @IsString()
  receivedLabStorageDetails?: string | null;

  @ApiPropertyOptional({
    description: 'Reference batch ID',
    example: 'BATCH-2025-001',
  })
  @IsOptional()
  @IsString()
  referenceBatchId?: string | null;

  @ApiPropertyOptional({
    description: 'Batch reference document (URL or filename)',
    example: 'doc-url',
  })
  @IsOptional()
  @IsString()
  batchReferenceDocument?: string | null;

  @ApiPropertyOptional({
    description: 'Accession ID',
    example: 'ACC-2025-001',
  })
  @IsOptional()
  @IsString()
  accessionId?: string | null;

  @ApiPropertyOptional({
    description: 'Timestamp when extraction was performed',
    example: '2025-03-21T12:30:00Z',
  })
  @IsOptional()
  extractionDateTime?: Date | null;

  @ApiPropertyOptional({
    description: 'Sample used value for extraction',
    example: '3',
  })
  @IsOptional()
  @IsString()
  extractionSampleUsedValue?: string | null;

  @ApiPropertyOptional({
    description: 'Sample used unit for extraction',
    example: 'ml',
  })
  @IsOptional()
  @IsString()
  extractionSampleUsedUnit?: string | null;

  @ApiPropertyOptional({
    description: 'Remaining sample value after extraction',
    example: '2',
  })
  @IsOptional()
  @IsString()
  extractionSampleRemainingValue?: string | null;

  @ApiPropertyOptional({
    description: 'Remaining sample unit after extraction',
    example: 'ml',
  })
  @IsOptional()
  @IsString()
  extractionSampleRemainingUnit?: string | null;

  @ApiPropertyOptional({
    description: 'Comments related to the extraction process',
    example: 'Sample extracted successfully',
  })
  @IsOptional()
  @IsString()
  extractionComments?: string | null;

  // Pre-processing fields
  @ApiPropertyOptional({ description: 'Pre-processing steps data' })
  @IsOptional()
  preprocessingSteps?: any[];

  @ApiPropertyOptional({ description: 'Pre-processing date' })
  @IsOptional()
  preprocessingDate?: Date | null;

  @ApiPropertyOptional({ description: 'Pre-processing storage temperature' })
  @IsOptional()
  @IsString()
  preprocessingStorageTemperature?: string | null;

  @ApiPropertyOptional({ description: 'Pre-processing storage details' })
  @IsOptional()
  @IsString()
  preprocessingStorageDetails?: string | null;

  @ApiPropertyOptional({ description: 'User who performed pre-processing' })
  @IsOptional()
  preprocessingPerformedBy?: any;

  @ApiPropertyOptional({
    description: 'IDs of samples pooled with this sample',
  })
  @IsOptional()
  pooledSampleIds?: string[];

  @ApiPropertyOptional({
    description: 'Samples pooled with this sample (resolved entities)',
  })
  @IsOptional()
  pooledWith?: any[];

  @ApiPropertyOptional({ description: 'Whether this is a pooled sample' })
  @IsOptional()
  isPooledSample?: boolean;

  @ApiPropertyOptional({
    description: 'Additional dynamic details (e.g. extraction metadata)',
  })
  @IsOptional()
  details?: any;
}
