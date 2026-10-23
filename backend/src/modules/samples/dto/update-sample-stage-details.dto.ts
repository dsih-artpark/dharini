import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateSampleStageDetailsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  collectedBy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  collectionTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  receivedAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  receivedBy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  receivedVolumeValue?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  receivedVolumeUnit?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  receivedStorageTemperature?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  receivedLabStorageDetails?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  referenceBatchId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  batchReferenceDocument?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  accessionId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  preprocessingDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  preprocessingPerformedBy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  preprocessingSteps?: any[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  extractionDateTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  extractedBy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  extractionSampleUsedValue?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  extractionSampleUsedUnit?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  extractionSampleRemainingValue?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  extractionSampleRemainingUnit?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  extractionComments?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  testedAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  testedBy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  reportGeneratedAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  reportGeneratedBy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  details?: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  labTests?: any[];
}
