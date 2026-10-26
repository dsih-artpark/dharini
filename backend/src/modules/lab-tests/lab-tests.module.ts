import { Module } from '@nestjs/common';
import { LabTestsService } from './lab-tests.service';
import { LabTestsController } from './lab-tests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LabTest } from 'src/entities/lab-test.entity';
import { Sample } from 'src/entities/sample.entity';
import { MulterConfigService } from '../media/media.service';
import { Media } from 'src/entities/media.entity';
import { Region } from 'src/entities/region.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LabTest, Sample, Media, Region, User])],
  controllers: [LabTestsController],
  providers: [LabTestsService, MulterConfigService],
})
export class LabTestsModule {}
