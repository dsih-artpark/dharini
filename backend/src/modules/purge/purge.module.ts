import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../../entities/project.entity';
import { Site } from '../../entities/site.entity';
import { Visit } from '../../entities/visit.entity';
import { Sample } from '../../entities/sample.entity';
import { LabTest } from '../../entities/lab-test.entity';
import { SampleAudit } from '../../entities/sample-audit.entity';
import { Invite } from '../../entities/invite.entity';
import { UserRole } from '../../entities/user-role.entity';
import { User } from '../../entities/user.entity';
import { PurgeController } from './purge.controller';
import { PurgeService } from './purge.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      Site,
      Visit,
      Sample,
      LabTest,
      SampleAudit,
      Invite,
      UserRole,
      User,
    ]),
  ],
  controllers: [PurgeController],
  providers: [PurgeService],
  exports: [PurgeService],
})
export class PurgeModule {}
