import { Module } from '@nestjs/common';
import { DiseaseService } from './disease.service';
import { DiseaseController } from './disease.controller';
import { Disease } from 'src/entities/disease.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Project } from 'src/entities/project.entity';
import { Sample } from 'src/entities/sample.entity';
import { Team } from 'src/entities/team.entity';
import { LabTest } from 'src/entities/lab-test.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Disease, User, Project, Sample, Team, LabTest]),
  ],
  controllers: [DiseaseController],
  providers: [DiseaseService],
  exports: [DiseaseService],
})
export class DiseaseModule {}
