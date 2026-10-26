import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateSurveillanceTypeDto {
  @ApiProperty({
    description: 'Surveillance type name',
    type: String,
    example: 'name',
  })
  @IsString()
  @IsOptional()
  name: string;
}
