import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { SitesService } from '../sites/sites.service';
import { SamplesService } from '../samples/samples.service';
import { DiseaseService } from '../disease/disease.service';
import { MulterConfigService } from '../media/media.service';
import { LocationService } from '../location/location.service';
import { RegionService } from '../region/region.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Site } from 'src/entities/site.entity';
import { Visit } from 'src/entities/visit.entity';
import { Media } from 'src/entities/media.entity';
import { Disease } from 'src/entities/disease.entity';
import { Sample } from 'src/entities/sample.entity';
import { Project } from 'src/entities/project.entity';
import { User } from 'src/entities/user.entity';
import { LabTest } from 'src/entities/lab-test.entity';
import { SampleType } from 'src/entities/sample-type.entity';
import { Team } from 'src/entities/team.entity';
import { Location } from 'src/entities/location.entity';
import { Region } from 'src/entities/region.entity';
import { SampleAudit } from 'src/entities/sample-audit.entity';
import { CronJobProcessor } from '../visits/visit-schedule-job-processor';
import { ProjectsService } from '../projects/projects.service';
import { SurveillanceType } from 'src/entities/surveillance-type.entity';
import { VisitService } from '../visits/visits.service';
import { Role } from 'src/entities/role.entity';
import { UserRole } from 'src/entities/user-role.entity';
import { AnimalMetadata } from 'src/entities/animal-metadata.entity';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Site,
      User,
      Project,
      Disease,
      Team,
      Media,
      Sample,
      Location,
      Region,
      SampleType,
      Visit,
      LabTest,
      SampleAudit,
      SurveillanceType,
      Role,
      UserRole,
      AnimalMetadata,
    ]),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    }),
    BullModule.registerQueue({
      name: process.env.QUEUE,
    }),
  ],
  controllers: [StatisticsController],
  providers: [
    StatisticsService,
    SitesService,
    SamplesService,
    DiseaseService,
    MulterConfigService,
    LocationService,
    RegionService,
    CronJobProcessor,
    ProjectsService,
    VisitService,
  ],
  exports: [StatisticsService],
})
export class StatisticsModule {}
