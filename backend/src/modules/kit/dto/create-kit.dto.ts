import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { StatusType } from 'src/common/enums/status.enum';

export class CreateKitDto {
  @ApiProperty({
    description: 'Kit name',
    example: 'Blood',
  })
  name: string;

  @ApiProperty({
    description: 'Status',
    enum: StatusType,
  })
  @IsOptional()
  status?: StatusType;
}
