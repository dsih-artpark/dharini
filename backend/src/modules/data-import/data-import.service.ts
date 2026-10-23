import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from 'src/entities/project.entity';
import { XlsxParserService } from './xlsx-parser.service';
import { TemplateService } from './template.service';
import { ImportValidationService } from './import-validation.service';
import { ImportPersistenceService } from './import-persistence.service';
import { DiseaseGroup, ImportResult, ImportSection } from './data-import.types';

const NO_DATA_ROWS_ERROR = {
  row: 0,
  message:
    'No data rows found. Add your rows below the header row and delete the pre-filled example rows (the ones whose remarks start with "DELETE THIS ROW").',
};

@Injectable()
export class DataImportService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly xlsxParser: XlsxParserService,
    private readonly templateService: TemplateService,
    private readonly validationService: ImportValidationService,
    private readonly persistenceService: ImportPersistenceService,
  ) {}

  async generateTemplate(
    diseaseGroup: DiseaseGroup,
    section: ImportSection,
    projectId: string,
  ): Promise<Buffer> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['workspace'],
    });
    return this.templateService.generate(
      diseaseGroup,
      section,
      project?.workspace?.name ?? '',
      project?.name ?? '',
    );
  }

  async importCollection(
    buffer: Buffer,
    diseaseGroup: DiseaseGroup,
    projectId: string,
  ): Promise<ImportResult> {
    const rawRows = await this.xlsxParser.parseRows(buffer);
    if (rawRows.length === 0) {
      return { success: false, importedCount: 0, errors: [NO_DATA_ROWS_ERROR] };
    }
    const validation = await this.validationService.validateCollectionRows(
      rawRows,
      diseaseGroup,
      projectId,
    );

    if (!validation.isValid) {
      return { success: false, importedCount: 0, errors: validation.errors };
    }

    const importedCount = await this.persistenceService.persistCollectionRows(
      rawRows,
      diseaseGroup,
      projectId,
    );
    return { success: true, importedCount, errors: [] };
  }

  async importLab(
    buffer: Buffer,
    diseaseGroup: DiseaseGroup,
    projectId: string,
  ): Promise<ImportResult> {
    const rawRows = await this.xlsxParser.parseRows(buffer);
    if (rawRows.length === 0) {
      return { success: false, importedCount: 0, errors: [NO_DATA_ROWS_ERROR] };
    }

    const validation = await this.validationService.validateLabRows(
      rawRows,
      diseaseGroup,
      projectId,
    );

    if (!validation.isValid) {
      return { success: false, importedCount: 0, errors: validation.errors };
    }

    const importedCount = await this.persistenceService.persistLabRows(
      rawRows,
      diseaseGroup,
      projectId,
    );
    return { success: true, importedCount, errors: [] };
  }
}
