import {
  IsInt,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class PresignUploadDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  filename: string;

  @IsInt()
  @IsPositive()
  contentLength: number;
}
