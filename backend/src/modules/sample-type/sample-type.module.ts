import { Module } from '@nestjs/common';
import { SampleTypeService } from './sample-type.service';
import { SampleTypeController } from './sample-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SampleType } from 'src/entities/sample-type.entity';
import { SurveillanceType } from 'src/entities/surveillance-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SampleType, SurveillanceType])],
  controllers: [SampleTypeController],
  providers: [SampleTypeService],
})
export class SampleTypeModule {}
