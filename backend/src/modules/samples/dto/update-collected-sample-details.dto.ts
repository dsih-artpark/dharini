import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateCollectedSampleDetailsDto {
  @ApiPropertyOptional({ description: 'Visible sample identifier / barcode' })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiPropertyOptional({ description: 'User UUID of the collector' })
  @IsOptional()
  @IsUUID()
  collectedBy?: string;

  @ApiPropertyOptional({ description: 'Sample collection date/time' })
  @IsOptional()
  @IsDateString()
  collectionTime?: string;
}
