import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from 'src/entities/team.entity';
import { User } from 'src/entities/user.entity';
import { Project } from 'src/entities/project.entity';
import { Role } from 'src/entities/role.entity';
import { UserRole } from 'src/entities/user-role.entity';
import { Sample } from 'src/entities/sample.entity';
import { Media } from 'src/entities/media.entity';
import { MulterConfigService } from '../media/media.service';
import { Region } from 'src/entities/region.entity';
import { MailerService } from '../mailer/mailer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Team,
      User,
      Project,
      Role,
      UserRole,
      Sample,
      Media,
      Region,
    ]),
  ],
  controllers: [TeamsController],
  providers: [TeamsService, MulterConfigService, MailerService],
})
export class TeamsModule {}
