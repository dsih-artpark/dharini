import { PartialType } from '@nestjs/swagger';
import { CreateSampleTypeDto } from './create-sample-type.dto';

export class UpdateSampleTypeDto extends PartialType(CreateSampleTypeDto) {}
