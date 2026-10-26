import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class ProjectDetailsRequestDto {
  @ApiProperty({
    description: 'Project IDs',
    example: ['PABCDE', 'P12345'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  projectId: string[];
}
