import { forwardRef, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Disease } from 'src/entities/disease.entity';
import { Invite } from 'src/entities/invite.entity';
import { Location } from 'src/entities/location.entity';
import { Otp } from 'src/entities/otp.entity';
import { Project } from 'src/entities/project.entity';
import { Site } from 'src/entities/site.entity';
import { SurveillanceType } from 'src/entities/surveillance-type.entity';
import { Team } from 'src/entities/team.entity';
import { User } from 'src/entities/user.entity';
import { InvitesService } from '../invites/invites.service';
import { MailerService } from '../mailer/mailer.service';
import { SitesModule } from '../sites/sites.module';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Region } from 'src/entities/region.entity';
import { UserRole } from 'src/entities/user-role.entity';
import { Role } from 'src/entities/role.entity';
import { LabTest } from 'src/entities/lab-test.entity';
import { VisitService } from '../visits/visits.service';
import { MulterConfigService } from '../media/media.service';
import { BullModule } from '@nestjs/bullmq';
import { Visit } from 'src/entities/visit.entity';
import { Media } from 'src/entities/media.entity';
import { SamplesService } from '../samples/samples.service';
import { Sample } from 'src/entities/sample.entity';
import { SampleType } from 'src/entities/sample-type.entity';
import { TeamsService } from '../teams/teams.service';
import { SampleAudit } from 'src/entities/sample-audit.entity';
import { LabTestsService } from '../lab-tests/lab-tests.service';
import { LocationService } from '../location/location.service';
import { RegionService } from '../region/region.service';
import { AnimalMetadata } from 'src/entities/animal-metadata.entity';
import { Workspace } from 'src/entities/workspace.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      Otp,
      Invite,
      Location,
      SurveillanceType,
      Disease,
      User,
      Site,
      Team,
      Region,
      UserRole,
      Role,
      LabTest,
      Visit,
      Media,
      Sample,
      SampleType,
      SampleAudit,
      AnimalMetadata,
      Workspace,
    ]),
    forwardRef(() => SitesModule),
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
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    InvitesService,
    JwtService,
    MailerService,
    VisitService,
    MulterConfigService,
    SamplesService,
    TeamsService,
    LabTestsService,
    LocationService,
    RegionService,
  ],
  exports: [ProjectsService],
})
export class ProjectsModule {}
