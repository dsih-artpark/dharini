import { Module } from '@nestjs/common';
import { SurveillanceTypeService } from './surveillance-type.service';
import { SurveillanceTypeController } from './surveillance-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveillanceType } from 'src/entities/surveillance-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SurveillanceType])],
  controllers: [SurveillanceTypeController],
  providers: [SurveillanceTypeService],
})
export class SurveillanceTypeModule {}
