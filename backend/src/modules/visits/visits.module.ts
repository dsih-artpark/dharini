import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visit } from 'src/entities/visit.entity';
import { VisitController } from './visits.controller';
import { VisitService } from './visits.service';
import { SitesModule } from '../sites/sites.module';
import { ProjectsModule } from '../projects/projects.module';
import { BullModule } from '@nestjs/bullmq';
import { CronJobProcessor } from './visit-schedule-job-processor';
import { configDotenv } from 'dotenv';
import { Site } from 'src/entities/site.entity';
import { Project } from 'src/entities/project.entity';
import { User } from 'src/entities/user.entity';
import { Disease } from 'src/entities/disease.entity';
import { UserService } from '../users/users.service';
import { UserRole } from 'src/entities/user-role.entity';
import { Otp } from 'src/entities/otp.entity';
import { Team } from 'src/entities/team.entity';
import { SamplesService } from '../samples/samples.service';
import { Sample } from 'src/entities/sample.entity';
import { SampleType } from 'src/entities/sample-type.entity';
import { Media } from 'src/entities/media.entity';
import { LabTest } from 'src/entities/lab-test.entity';
import { MulterConfigService } from '../media/media.service';
import { Region } from 'src/entities/region.entity';
import { SampleAudit } from 'src/entities/sample-audit.entity';
import { Location } from 'src/entities/location.entity';
import { AnimalMetadata } from 'src/entities/animal-metadata.entity';

configDotenv();
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Visit,
      Site,
      Project,
      User,
      Team,
      UserRole,
      Otp,
      Disease,
      Sample,
      SampleType,
      Media,
      LabTest,
      Region,
      SampleAudit,
      Location,
      AnimalMetadata,
    ]),
    SitesModule,
    ProjectsModule,
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
  controllers: [VisitController],
  providers: [
    VisitService,
    CronJobProcessor,
    UserService,
    SamplesService,
    MulterConfigService,
  ],
  exports: [VisitService],
})
export class VisitModule {}
