import { Module } from '@nestjs/common';
import { SamplesService } from './samples.service';
import { SamplesController } from './samples.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sample } from 'src/entities/sample.entity';
import { SampleType } from 'src/entities/sample-type.entity';
import { Site } from 'src/entities/site.entity';
import { Visit } from 'src/entities/visit.entity';
import { MulterConfigService } from '../media/media.service';
import { Media } from 'src/entities/media.entity';
import { Disease } from 'src/entities/disease.entity';
import { UserService } from '../users/users.service';
import { User } from 'src/entities/user.entity';
import { Otp } from 'src/entities/otp.entity';
import { Project } from 'src/entities/project.entity';
import { UserRole } from 'src/entities/user-role.entity';
import { Team } from 'src/entities/team.entity';
import { LabTest } from 'src/entities/lab-test.entity';
import { Region } from 'src/entities/region.entity';
import { LabTestsService } from '../lab-tests/lab-tests.service';
import { SampleAudit } from 'src/entities/sample-audit.entity';
import { Location } from 'src/entities/location.entity';
import { AnimalMetadata } from 'src/entities/animal-metadata.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Sample,
      SampleType,
      Site,
      Visit,
      Media,
      Disease,
      User,
      Team,
      Otp,
      Project,
      UserRole,
      LabTest,
      Region,
      SampleAudit,
      Location,
      AnimalMetadata,
    ]),
  ],
  controllers: [SamplesController],
  providers: [
    SamplesService,
    MulterConfigService,
    UserService,
    LabTestsService,
  ],
})
export class SamplesModule {}
