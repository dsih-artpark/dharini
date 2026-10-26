import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class RescheduleVisitDto {
  @ApiProperty({
    description: 'New scheduled visit date-time in ISO format',
    example: '2026-09-30T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  newScheduledDate: string;
}
