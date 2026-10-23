import { PartialType } from '@nestjs/swagger';
import { CreateSurveillanceTypeDto } from './create-surveillance-type.dto';

export class UpdateSurveillanceTypeDto extends PartialType(
  CreateSurveillanceTypeDto,
) {}
