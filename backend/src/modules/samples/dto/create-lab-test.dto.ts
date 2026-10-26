import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { TestResultType } from 'src/common/enums/test-result.enum';

export class CreateSampleDto {
  @ApiProperty({
    description: 'Project UUID',
    example: 'Project id',
  })
  @IsUUID()
  project: any;

  @ApiProperty({
    description: 'Site UUID',
    example: 'Site id',
  })
  @IsUUID()
  site: any;

  @ApiProperty({
    description: 'Sample UUID',
    example: 'Sample id',
  })
  @IsUUID()
  sample: any;

  @ApiProperty({
    description: 'Visit UUID',
    example: 'Visit id',
  })
  @IsUUID()
  visit: any;

  @ApiProperty({
    description: 'Disease UUID',
    example: 'Disease id',
  })
  @IsUUID()
  disease: any;

  @ApiProperty({
    description: 'Team UUID',
    example: 'Team id',
  })
  @IsUUID()
  team: any;

  @ApiProperty({
    description: 'Test result',
    enum: TestResultType,
    example: 'positive',
  })
  @IsOptional()
  testResult?: TestResultType;
}
