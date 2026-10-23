import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Disease } from 'src/entities/disease.entity';
import { SampleType } from 'src/entities/sample-type.entity';
import { Sample } from 'src/entities/sample.entity';
import { Site } from 'src/entities/site.entity';
import { Team } from 'src/entities/team.entity';
import { User } from 'src/entities/user.entity';
import { Visit } from 'src/entities/visit.entity';
import { LabTest } from 'src/entities/lab-test.entity';
import { Project } from 'src/entities/project.entity';
import { DataImportController } from './data-import.controller';
import { DataImportService } from './data-import.service';
import { XlsxParserService } from './xlsx-parser.service';
import { TemplateService } from './template.service';
import { ImportValidationService } from './import-validation.service';
import { ImportPersistenceService } from './import-persistence.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Disease,
      SampleType,
      Sample,
      Site,
      Team,
      User,
      Visit,
      LabTest,
      Project,
    ]),
  ],
  controllers: [DataImportController],
  providers: [
    DataImportService,
    XlsxParserService,
    TemplateService,
    ImportValidationService,
    ImportPersistenceService,
  ],
})
export class DataImportModule {}
