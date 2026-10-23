import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/auth.guard';
import { PoliciesGuard } from 'src/common/guards/casl-policies.guard';
import { CheckPolicies } from 'src/common/decorators/check-policy.decorator';
import { Action } from 'src/common/enums/action.enum';
import { AppAbility } from 'src/common/casl/abitlity.factory';
import { DataImportService } from './data-import.service';
import { DiseaseGroup, ImportSection } from './data-import.types';

@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('projects/:projectId/data-import')
export class DataImportController {
  constructor(private readonly dataImportService: DataImportService) {}

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, 'data-import'),
  )
  @Get('template')
  async downloadTemplate(
    @Param('projectId') projectId: string,
    @Query('diseaseGroup') diseaseGroup: DiseaseGroup,
    @Query('section') section: ImportSection,
    @Res() res: Response,
  ) {
    const buffer = await this.dataImportService.generateTemplate(
      diseaseGroup,
      section,
      projectId,
    );
    const fileName = `${diseaseGroup.toLowerCase()}-${section}-template.xlsx`;
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });
    res.send(buffer);
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, 'data-import'),
  )
  @Post('collection')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCollection(
    @Param('projectId') projectId: string,
    @Body('diseaseGroup') diseaseGroup: DiseaseGroup,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new Error('No file uploaded');
    const result = await this.dataImportService.importCollection(
      file.buffer,
      diseaseGroup,
      projectId,
    );
    return {
      success: result.success,
      message: result.success
        ? `Imported ${result.importedCount} collection rows successfully`
        : 'Upload rejected: fix the errors below and re-upload',
      data: result,
    };
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, 'data-import'),
  )
  @Post('lab')
  @UseInterceptors(FileInterceptor('file'))
  async uploadLab(
    @Param('projectId') projectId: string,
    @Body('diseaseGroup') diseaseGroup: DiseaseGroup,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new Error('No file uploaded');
    const result = await this.dataImportService.importLab(
      file.buffer,
      diseaseGroup,
      projectId,
    );
    return {
      success: result.success,
      message: result.success
        ? `Imported ${result.importedCount} lab rows successfully`
        : 'Upload rejected: fix the errors below and re-upload',
      data: result,
    };
  }
}
