import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';
import { TestResultType } from '../../../common/enums/test-result.enum';

export class CreateLabTestDto {
  @ApiPropertyOptional({
    description: 'Sample UUID',
    example: 'Sample id',
  })
  @IsUUID()
  sample?: any;

  @ApiProperty({
    description: 'Disease UUID',
    example: 'Disease id',
  })
  @IsUUID()
  disease: any;

  @ApiProperty({
    description: 'Kit or Protocol of Test',
  })
  @IsString()
  kitOrProtocol?: string;

  @ApiProperty({
    description: 'Tested Date of Test',
  })
  testedAt?: Date;

  @ApiProperty({
    description: 'comments of Test',
  })
  @IsString()
  labComment?: string;

  @ApiPropertyOptional({
    description: 'User who tested the sample',
  })
  testedBy?: any;

  @ApiPropertyOptional({
    description: 'Additional dynamic details (e.g. ct values, storage)',
  })
  @IsOptional()
  details?: any;

  @ApiPropertyOptional({
    description: 'Test Result',
    enum: TestResultType,
    enumName: 'TestResultType',
  })
  @IsOptional()
  testResult?: TestResultType;

  @ApiPropertyOptional({
    description: 'Ct value detected',
  })
  @IsString()
  @IsOptional()
  ctValue?: string;

  @ApiPropertyOptional({
    description: 'Variant detected',
  })
  @IsString()
  @IsOptional()
  variant?: string;

  @ApiPropertyOptional({
    description: 'Viral load detected',
  })
  @IsString()
  @IsOptional()
  viralLoad?: string;

  @ApiPropertyOptional({
    description: 'Test Result Report file path/key',
  })
  @IsString()
  @IsOptional()
  testResultReport?: string;
}

export class CreateMultipleLabTestDto {
  @ApiHideProperty()
  sample?: any;

  @ApiProperty({
    description: 'CreateLabTestDto',
  })
  @IsArray()
  labTests: CreateLabTestDto[];
}
