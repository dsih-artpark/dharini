import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from 'src/entities/media.entity';
import { MediaController } from './media.controller';
import { MulterConfigService } from './media.service';
import { MediaAccessService } from './media-access.service';
import { Region } from 'src/entities/region.entity';
import { Project } from 'src/entities/project.entity';
import { Sample } from 'src/entities/sample.entity';
import { Site } from 'src/entities/site.entity';
import { Visit } from 'src/entities/visit.entity';
import { LabTest } from 'src/entities/lab-test.entity';
import { Team } from 'src/entities/team.entity';

// A13: Sample/Site/Visit/LabTest/Team are read-only here — used purely by
// MediaAccessService to resolve which project owns a file a caller asks to
// sign. They live here rather than on MulterConfigService because that
// service is re-provided by thirteen other modules, none of which register
// these entities.
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Media,
      Region,
      Project,
      Sample,
      Site,
      Visit,
      LabTest,
      Team,
    ]),
  ],
  controllers: [MediaController],
  providers: [MulterConfigService, MediaAccessService],
})
export class MediaModule {}
