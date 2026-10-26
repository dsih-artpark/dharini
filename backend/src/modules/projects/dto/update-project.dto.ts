import { ApiHideProperty, PartialType } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { StatusType } from '../../../common/enums/status.enum';
import { CreateProjectDto } from './create-project.dto';

// `status` is intentionally not part of `CreateProjectDto` (see C7 — a client
// must not choose a project's status at creation time), so it isn't inherited
// via `PartialType` here. Re-declared standalone because updating status
// (e.g. archiving a project) is a legitimate PATCH operation.
export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @ApiHideProperty()
  @IsOptional()
  @IsEnum(StatusType)
  status?: StatusType;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  diseases?: string[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  surveillanceTypes?: string[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  regions?: string[];
}
