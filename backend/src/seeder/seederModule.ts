import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Disease } from 'src/entities/disease.entity';
import { Permission } from 'src/entities/permission.entity';
import { Role } from 'src/entities/role.entity';
import { SampleType } from 'src/entities/sample-type.entity';
import { SurveillanceType } from 'src/entities/surveillance-type.entity';
import { TeamsService } from 'src/modules/teams/teams.service';
import { SeederService } from './seederService';
import { UserRole } from 'src/entities/user-role.entity';
import { Team } from 'src/entities/team.entity';
import { User } from 'src/entities/user.entity';
import { Project } from 'src/entities/project.entity';
import { Sample } from 'src/entities/sample.entity';
import { MulterConfigService } from 'src/modules/media/media.service';
import { Region } from 'src/entities/region.entity';
import { Media } from 'src/entities/media.entity';
import { SamplesService } from 'src/modules/samples/samples.service';
import { Site } from 'src/entities/site.entity';
import { Visit } from 'src/entities/visit.entity';
import { LabTest } from 'src/entities/lab-test.entity';
import { SampleAudit } from 'src/entities/sample-audit.entity';
import { Location } from 'src/entities/location.entity';
import { AnimalMetadata } from 'src/entities/animal-metadata.entity';
import { MailerService } from 'src/modules/mailer/mailer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Disease,
      SurveillanceType,
      Role,
      Permission,
      SampleType,
      UserRole,
      Team,
      User,
      Sample,
      Project,
      Region,
      Media,
      Site,
      Visit,
      LabTest,
      SampleAudit,
      Location,
      AnimalMetadata,
    ]),
  ],
  providers: [
    SeederService,
    TeamsService,
    MulterConfigService,
    SamplesService,
    MailerService,
  ],
})
export class SeederModule {}
