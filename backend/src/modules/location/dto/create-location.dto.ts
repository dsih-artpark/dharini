import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty({
    description: 'Id of the district',
    example: 'district_111',
  })
  regionId: string;

  @ApiProperty({
    description: 'current location latitude',
    example: '34.0522',
  })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({
    description: 'current location longitude',
    example: '-118.2437',
  })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}
