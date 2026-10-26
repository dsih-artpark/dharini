import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateTeamDto {
  @ApiHideProperty()
  project?: any;

  @ApiPropertyOptional({
    description: 'Name of the team',
    example: 'Team Dharini',
  })
  @IsString()
  teamName?: string;

  @ApiPropertyOptional({ description: 'Address of the lab' })
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Logo of the lab' })
  @IsString()
  logo?: string;
}
