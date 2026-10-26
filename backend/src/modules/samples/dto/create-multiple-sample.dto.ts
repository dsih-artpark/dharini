import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSampleOnVisitDto } from './create-sample-on-submit.dto';

export class CreateMultipleSampleDto {
  @ApiProperty({
    description: 'samples',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSampleOnVisitDto)
  samples: CreateSampleOnVisitDto[];
}
