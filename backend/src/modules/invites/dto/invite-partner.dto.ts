import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsUUID } from 'class-validator';

export class InvitePartnerDto {
  @ApiProperty({
    description: 'Contractors',
    type: Array,
    example: 'Contractors',
  })
  @IsArray()
  @IsOptional()
  individualContractors?: any[];

  @IsUUID()
  @IsOptional()
  projectId?: any;

  @ApiProperty({
    description: 'Collectors',
    type: Array,
    example: 'collectors',
  })
  @IsArray()
  @IsOptional()
  collectors?: any[];

  @IsUUID()
  @IsOptional()
  invitedBy?: any;
}
