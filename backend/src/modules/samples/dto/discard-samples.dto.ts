import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class DiscardSamplesDto {
  @ApiProperty({
    type: [String],
    description:
      'Samples to discard. A pooled sample brings the rest of its pool with it.',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  sampleIds: string[];

  @ApiProperty({ description: 'Reason for discard' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  reason: string;

  @ApiPropertyOptional({
    description: 'What was observed. Required when the reason is "Other".',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  comment?: string;

  @ApiProperty({ description: 'User UUID of the team member who discarded' })
  @IsUUID()
  discardedBy: string;

  @ApiProperty({ description: 'When the sample was discarded' })
  @IsDateString()
  discardedAt: string;
}
