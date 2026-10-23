import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UploadImageDto {
  @ApiProperty({
    description: 'Array of files to be uploaded',
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  @IsNotEmpty()
  files: any[];
}
