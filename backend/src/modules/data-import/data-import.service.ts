import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from 'src/entities/project.entity';
import { XlsxParserService } from './xlsx-parser.service';
import { TemplateService } from './template.service';
import { ImportValidationService } from './import-validation.service';
import { ImportPersistenceService } from './import-persistence.service';
import { checkColumns } from './column-check';
import {
  DiseaseGroup,
  ImportResult,
  ImportSection,
  ImportTemplate,
  RowError,
} from './data-import.types';

const NO_DATA_ROWS_ERROR: RowError = {
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
    const sheet = await this.readRows(buffer, {
      diseaseGroup,
      section: 'collection',
    });
    if ('errors' in sheet) {
      return { success: false, importedCount: 0, errors: sheet.errors };
    }
    const rawRows = sheet.rows;
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
    const sheet = await this.readRows(buffer, { diseaseGroup, section: 'lab' });
    if ('errors' in sheet) {
      return { success: false, importedCount: 0, errors: sheet.errors };
    }
    const rawRows = sheet.rows;
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

  // Problems with the file as a whole are reported on their own: with the
  // wrong template or edited columns, row checks would only repeat the same
  // problem on every row.
  private async readRows(
    buffer: Buffer,
    template: ImportTemplate,
  ): Promise<{ rows: Record<string, any>[] } | { errors: RowError[] }> {
    const { headers, rows } = await this.xlsxParser.parse(buffer);
    const columnErrors = checkColumns(headers, template, (candidate) =>
      this.templateService.getHeaders(
        candidate.diseaseGroup,
        candidate.section,
      ),
    );
    if (columnErrors.length > 0) return { errors: columnErrors };
    if (rows.length === 0) return { errors: [NO_DATA_ROWS_ERROR] };
    return { rows };
  }
}
