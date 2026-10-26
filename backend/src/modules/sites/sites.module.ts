import { forwardRef, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Disease } from 'src/entities/disease.entity';
import { Invite } from 'src/entities/invite.entity';
import { Location } from 'src/entities/location.entity';
import { Media } from 'src/entities/media.entity';
import { Otp } from 'src/entities/otp.entity';
import { Project } from 'src/entities/project.entity';
import { Sample } from 'src/entities/sample.entity';
import { Site } from 'src/entities/site.entity';
import { SurveillanceType } from 'src/entities/surveillance-type.entity';
import { User } from 'src/entities/user.entity';
import { DiseaseModule } from '../disease/disease.module';
import { DiseaseService } from '../disease/disease.service';
import { InvitesService } from '../invites/invites.service';
import { LocationService } from '../location/location.service';

import { Region } from 'src/entities/region.entity';
import { Team } from 'src/entities/team.entity';
import { MailerService } from '../mailer/mailer.service';
import { MulterConfigService } from '../media/media.service';
import { ProjectsModule } from '../projects/projects.module';
import { ProjectsService } from '../projects/projects.service';
import { RegionService } from '../region/region.service';
import { SitesController } from './sites.controller';
import { SitesService } from './sites.service';
import { UserRole } from 'src/entities/user-role.entity';
import { Visit } from 'src/entities/visit.entity';
import { UserService } from '../users/users.service';
import { Role } from 'src/entities/role.entity';
import { LabTest } from 'src/entities/lab-test.entity';
import { CronJobProcessor } from '../visits/visit-schedule-job-processor';
import { VisitService } from '../visits/visits.service';
import { SamplesService } from '../samples/samples.service';
import { BullModule } from '@nestjs/bullmq';
import { SampleType } from 'src/entities/sample-type.entity';
import { SampleAudit } from 'src/entities/sample-audit.entity';
import { LabTestsService } from '../lab-tests/lab-tests.service';
import { AnimalMetadata } from 'src/entities/animal-metadata.entity';
import { Workspace } from 'src/entities/workspace.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Site,
      User,
      Project,
      Location,
      SurveillanceType,
      Disease,
      Otp,
      Team,
      Invite,
      Media,
      Sample,
      Location,
      Region,
      UserRole,
      Visit,
      Role,
      LabTest,
      SampleType,
      SampleAudit,
      AnimalMetadata,
      Workspace,
    ]),
    forwardRef(() => ProjectsModule),
    DiseaseModule,
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
  controllers: [SitesController],
  providers: [
    SitesService,
    ProjectsService,
    DiseaseService,
    InvitesService,
    JwtService,
    MulterConfigService,
    LocationService,
    MailerService,
    LocationService,
    RegionService,
    UserService,
    CronJobProcessor,
    VisitService,
    SamplesService,
    LabTestsService,
  ],
  exports: [SitesService],
})
export class SitesModule {}
