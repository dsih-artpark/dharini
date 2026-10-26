import { ApiHideProperty, ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Visit } from 'src/entities/visit.entity';

export class CreateVisitDto extends PickType(Visit, [
  'questionSetId',
  'comment',
] as const) {
  @ApiProperty({
    description: 'ID of the site',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  siteId: string;

  @ApiProperty({
    description: 'Array of collector IDs',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  collectorId: string;

  @ApiHideProperty()
  projectId?: string;

  @ApiProperty({
    description: 'Scheduled visit date-time in ISO format',
    example: '2025-02-06T12:00:00Z',
  })
  @IsString()
  visitScheduledAt: string;

  @ApiProperty({
    description: 'The date when the collector visited',
    example: '2025-02-06T12:00:00Z',
  })
  visitedAt?: string;
}
