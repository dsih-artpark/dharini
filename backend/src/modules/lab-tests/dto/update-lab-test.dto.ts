import { ApiHideProperty, ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { CreateLabTestDto } from './create-lab-test.dto';

export class updateLabTestDto extends PartialType(CreateLabTestDto) {
  @ApiProperty()
  id: string;

  @ApiProperty({
    description: 'Kit or Protocol of Test',
  })
  @IsString()
  ctValue?: string;

  @IsString()
  variant?: string;

  @ApiProperty()
  @IsString()
  viralLoad?: string;

  @ApiProperty({
    description: 'Tested Date of Test',
  })
  resultDate?: Date;

  @ApiProperty({
    description: 'comments of Test',
  })
  @IsString()
  resultComment?: string;

  @ApiProperty({
    description: 'Result Report document of Test',
  })
  @IsString()
  testResultReport?: string;
}
export class UpdateMultipleLabTestDto {
  @ApiHideProperty()
  sample?: any;

  @ApiProperty({
    description: 'updateLabTestDto',
  })
  @IsArray()
  labTests: updateLabTestDto[];
}
