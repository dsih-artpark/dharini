import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { getMetadataStorage, validate } from 'class-validator';
import { Disease } from 'src/entities/disease.entity';
import { SampleType } from 'src/entities/sample-type.entity';
import { Sample } from 'src/entities/sample.entity';
import { LabTest } from 'src/entities/lab-test.entity';
import { StatusType } from 'src/common/enums/status.enum';
import {
  DiseaseGroup,
  FINAL_TEST_RESULTS,
  RowError,
  ValidationResult,
} from './data-import.types';
import { FmdLsdCollectionRowDto } from './dto/fmd-lsd-collection-row.dto';
import { FmdLsdLabRowDto } from './dto/fmd-lsd-lab-row.dto';
import { AiCollectionRowDto } from './dto/ai-collection-row.dto';
import { AiLabRowDto } from './dto/ai-lab-row.dto';
import { getVaccinationStatusOptions } from './config/vaccination-status.config';
import {
  getHabitatOptions,
  getSiteCategoryOptions,
} from './config/site-category.config';
import { parseDiseaseList } from './config/parse-disease-list';

type CollectionRowDto = FmdLsdCollectionRowDto | AiCollectionRowDto;
type LabRowDto = FmdLsdLabRowDto | AiLabRowDto;

// A handful of DTO field names read awkwardly once split on camelCase
// boundaries (e.g. "Institute Sample Id") — spelled out for those only.
const FIELD_LABEL_OVERRIDES: Record<string, string> = {
  instituteSampleId: 'Sample ID',
  visitOrCollectionDate: 'Collection Date',
};

function humanizeField(field: string): string {
  if (FIELD_LABEL_OVERRIDES[field]) return FIELD_LABEL_OVERRIDES[field];
  return field
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/^./, (c) => c.toUpperCase());
}

// class-validator's default messages are correct but expose decorator/raw
// jargon (e.g. "state must be a string", "must be a valid ISO 8601 date
// (YYYY-MM-DD)") straight to end users. This maps each constraint type
// (keyed the same way `violation.constraints` is) to plain-language copy;
// anything not covered here falls back to the raw class-validator message.
const FRIENDLY_CONSTRAINT_MESSAGES: Record<
  string,
  (label: string, rawMessage: string) => string
> = {
  isString: (label) => `${label} is required`,
  isNotEmpty: (label) => `${label} is required`,
  isEmail: (label) => `${label} must be a valid email address`,
  isNumberString: (label) => `${label} must be a number`,
  isIso8601Date: (label) => `${label} must be a valid date (e.g. 2026-09-01)`,
  isIn: (label, rawMessage) => {
    const match = rawMessage.match(
      /must be one of the following values: (.+)$/i,
    );
    return match
      ? `${label} must be one of: ${match[1]}`
      : `${label} has an invalid value`;
  },
  isDateOnOrAfter: (label, rawMessage) => {
    const match = rawMessage.match(/must be on or after (\w+)$/i);
    const relatedLabel = match ? humanizeField(match[1]) : 'the related date';
    return `${label} must be on or after ${relatedLabel}`;
  },
  maxLength: (label, rawMessage) => {
    const match = rawMessage.match(/(\d+)\s+characters/);
    return match
      ? `${label} must be at most ${match[1]} characters`
      : `${label} is too long`;
  },
};

function buildFriendlyMessage(
  field: string,
  constraints: Record<string, string>,
): string {
  const label = humanizeField(field);
  return Object.entries(constraints ?? {})
    .map(([constraintKey, rawMessage]) => {
      const toFriendly = FRIENDLY_CONSTRAINT_MESSAGES[constraintKey];
      return toFriendly ? toFriendly(label, rawMessage) : rawMessage;
    })
    .join('; ');
}

// One lab result per (sample, disease): a row naming "FMD & LSD" claims both
// pairs. Retest on the Lab page is the only way to add a second result.
function labResultKey(sampleKey: string, disease: string): string {
  return `${sampleKey}::${disease}`;
}

/**
 * Validates every row of an uploaded collection/lab sheet without
 * short-circuiting, so the caller gets back the complete list of problems
 * in one pass (required for the all-or-nothing upload UX).
 */
@Injectable()
export class ImportValidationService {
  constructor(
    @InjectRepository(Disease)
    private readonly diseaseRepository: Repository<Disease>,
    @InjectRepository(SampleType)
    private readonly sampleTypeRepository: Repository<SampleType>,
    @InjectRepository(Sample)
    private readonly sampleRepository: Repository<Sample>,
    @InjectRepository(LabTest)
    private readonly labTestRepository: Repository<LabTest>,
  ) {}

  async validateCollectionRows(
    rawRows: Record<string, any>[],
    diseaseGroup: DiseaseGroup,
    projectId: string,
  ): Promise<ValidationResult<CollectionRowDto>> {
    // Cast needed: the ternary's union constructor type isn't assignable to
    // plainToInstance's single-class overload even though both rows are validated identically below.
    const dtoClass = (
      diseaseGroup === 'AI' ? AiCollectionRowDto : FmdLsdCollectionRowDto
    ) as { new (): CollectionRowDto };
    const errors: RowError[] = [
      ...this.checkForUnexpectedColumns(rawRows, dtoClass),
    ];
    const rows: CollectionRowDto[] = [];
    const seenInstituteSampleIds = new Set<string>();
    // The (barcode, project) unique index still backstops this at insert
    // time, but only as a file-level 409 — checked here for row-level errors.
    const existingSamples = await this.findSamplesByBarcode(
      projectId,
      rawRows.map((raw) => raw['instituteSampleId']),
    );

    for (const raw of rawRows) {
      const row = raw['__row'] as number;
      const dto = plainToInstance(dtoClass, raw, {
        excludeExtraneousValues: false,
      });

      errors.push(...(await this.runClassValidation(dto, row)));
      errors.push(
        ...(await this.validateCollectionBusinessRules(
          dto,
          raw,
          row,
          diseaseGroup,
        )),
      );

      const instituteSampleId = raw['instituteSampleId'];
      if (instituteSampleId) {
        if (seenInstituteSampleIds.has(instituteSampleId)) {
          errors.push({
            row,
            column: 'instituteSampleId',
            message: `Duplicate instituteSampleId "${instituteSampleId}" in this file`,
          });
        }
        seenInstituteSampleIds.add(instituteSampleId);

        if (existingSamples.has(instituteSampleId)) {
          errors.push({
            row,
            column: 'instituteSampleId',
            message: `instituteSampleId "${instituteSampleId}" already exists in this project`,
          });
        }
      }

      rows.push(dto);
    }

    return { isValid: errors.length === 0, errors, rows };
  }

  async validateLabRows(
    rawRows: Record<string, any>[],
    diseaseGroup: DiseaseGroup,
    projectId: string,
  ): Promise<ValidationResult<LabRowDto>> {
    const dtoClass = (
      diseaseGroup === 'AI' ? AiLabRowDto : FmdLsdLabRowDto
    ) as { new (): LabRowDto };
    const errors: RowError[] = [
      ...this.checkForUnexpectedColumns(rawRows, dtoClass),
    ];
    const rows: LabRowDto[] = [];
    const samplesByBarcode = await this.findSamplesByBarcode(
      projectId,
      rawRows.map((raw) => raw['instituteSampleId']),
    );
    const existingLabResults = await this.findExistingLabResults(
      [...samplesByBarcode.values()].map((sample) => sample.id),
    );
    // Row each (instituteSampleId, disease) pair first appeared on.
    const firstRowByLabResult = new Map<string, number>();

    for (const raw of rawRows) {
      const row = raw['__row'] as number;
      const dto = plainToInstance(dtoClass, raw, {
        excludeExtraneousValues: false,
      });

      errors.push(...(await this.runClassValidation(dto, row)));
      errors.push(
        ...(await this.validateLabDiseaseList(raw, diseaseGroup, row)),
      );

      const instituteSampleId = raw['instituteSampleId'];
      const sample = instituteSampleId
        ? samplesByBarcode.get(instituteSampleId)
        : undefined;

      if (!sample) {
        errors.push({
          row,
          column: 'instituteSampleId',
          message: `No matching collection data found for instituteSampleId "${instituteSampleId}" (upload collection data first)`,
        });
      } else {
        const collectedAt = sample.collectedAt;
        const receivedAt = raw['sampleReceivedDate'];
        if (
          collectedAt &&
          receivedAt &&
          new Date(receivedAt).getTime() < new Date(collectedAt).getTime()
        ) {
          errors.push({
            row,
            column: 'sampleReceivedDate',
            message: `sampleReceivedDate (${receivedAt}) must be on or after the collection date (${collectedAt})`,
          });
        }
      }

      if (instituteSampleId) {
        const diseases = parseDiseaseList(raw['disease']);

        for (const disease of diseases) {
          const key = labResultKey(instituteSampleId, disease);
          const firstRow = firstRowByLabResult.get(key);
          if (firstRow !== undefined) {
            errors.push({
              row,
              column: 'instituteSampleId',
              message: `Duplicate ${disease} lab result for instituteSampleId "${instituteSampleId}" in this file (also on row ${firstRow})`,
            });
          } else {
            firstRowByLabResult.set(key, row);
          }
        }

        const alreadyTested = sample
          ? diseases.filter((disease) =>
              existingLabResults.has(labResultKey(sample.id, disease)),
            )
          : [];
        if (alreadyTested.length > 0) {
          errors.push({
            row,
            column: 'instituteSampleId',
            message: `Lab result for ${alreadyTested.join(' & ')} already exists for instituteSampleId "${instituteSampleId}". To record another result, use Retest on the Lab page.`,
          });
        }
      }

      rows.push(dto);
    }

    return { isValid: errors.length === 0, errors, rows };
  }

  private async runClassValidation(
    dto: object,
    row: number,
  ): Promise<RowError[]> {
    const violations = await validate(dto, {
      whitelist: false,
      forbidUnknownValues: false,
    });
    return violations.map((violation) => ({
      row,
      column: humanizeField(violation.property),
      message: buildFriendlyMessage(
        violation.property,
        violation.constraints ?? {},
      ),
    }));
  }

  // Header names are identical across every row of a parsed sheet
  // (`XlsxParserService` writes one key per template column onto every row
  // object), so checking the first row is enough to catch a file with
  // extra/renamed/misspelled columns — surfaced once, at the file level,
  // rather than as per-row noise.
  private checkForUnexpectedColumns(
    rawRows: Record<string, any>[],
    dtoClass: { new (): object },
  ): RowError[] {
    if (rawRows.length === 0) return [];
    const knownFields = new Set(
      getMetadataStorage()
        .getTargetValidationMetadatas(dtoClass, '', false, false)
        .map((metadata) => metadata.propertyName),
    );
    const actualColumns = Object.keys(rawRows[0]).filter(
      (key) => key !== '__row',
    );
    const unexpectedColumns = actualColumns.filter(
      (column) => !knownFields.has(column),
    );
    if (unexpectedColumns.length === 0) return [];

    return [
      {
        row: 0,
        message: `Unexpected column(s): ${unexpectedColumns
          .map(humanizeField)
          .join(
            ', ',
          )}. Please use the provided template without adding extra columns.`,
      },
    ];
  }

  private async validateCollectionBusinessRules(
    dto: CollectionRowDto,
    raw: Record<string, any>,
    row: number,
    diseaseGroup: DiseaseGroup,
  ): Promise<RowError[]> {
    const errors: RowError[] = [];

    // Coordinate/quantity bounds are disease-independent, so checked
    // regardless of whether the disease field itself is valid (unlike the
    // checks below).
    if (raw['latitude']) {
      const latitude = Number(raw['latitude']);
      if (!Number.isNaN(latitude) && (latitude < -90 || latitude > 90)) {
        errors.push({
          row,
          column: 'Latitude',
          message: `Latitude must be between -90 and 90 (got ${raw['latitude']})`,
        });
      }
    }
    if (raw['longitude']) {
      const longitude = Number(raw['longitude']);
      if (!Number.isNaN(longitude) && (longitude < -180 || longitude > 180)) {
        errors.push({
          row,
          column: 'Longitude',
          message: `Longitude must be between -180 and 180 (got ${raw['longitude']})`,
        });
      }
    }
    if (raw['sampleQuantity']) {
      const quantity = Number(raw['sampleQuantity']);
      if (!Number.isNaN(quantity) && quantity < 0) {
        errors.push({
          row,
          column: 'sampleQuantity',
          message: 'sampleQuantity cannot be negative',
        });
      }
    }

    // Clinical/Environmental samples require extra fields the DTOs otherwise
    // treat as optional (they're only conditionally mandatory, not always).
    // `gender` doesn't exist on the AI template at all, so it's only
    // enforced for FMD/LSD.
    if (raw['sampleCategory'] === 'Clinical') {
      if (!raw['species']) {
        errors.push({
          row,
          column: 'species',
          message: 'species is required for Clinical samples',
        });
      }
      if (!raw['breed']) {
        errors.push({
          row,
          column: 'breed',
          message: 'breed is required for Clinical samples',
        });
      }
      if (diseaseGroup !== 'AI' && !raw['gender']) {
        errors.push({
          row,
          column: 'gender',
          message: 'gender is required for Clinical samples',
        });
      }
    }
    if (
      raw['sampleCategory'] === 'Environmental' &&
      !raw['environmentalSourceDescription']
    ) {
      errors.push({
        row,
        column: 'environmentalSourceDescription',
        message:
          'environmentalSourceDescription is required for Environmental samples',
      });
    }

    const diseases = parseDiseaseList(raw['disease']);
    const allowedDiseases = diseaseGroup === 'AI' ? ['AI'] : ['FMD', 'LSD'];
    if (diseases.length === 0) {
      errors.push({ row, column: 'disease', message: 'disease is required' });
      return errors;
    }
    for (const disease of diseases) {
      if (!allowedDiseases.includes(disease)) {
        errors.push({
          row,
          column: 'disease',
          message: `Unknown disease "${disease}". Valid options: ${allowedDiseases.join(', ')}`,
        });
      }
    }
    if (errors.length > 0) return errors;

    for (const disease of diseases) {
      const diseaseEntity = await this.diseaseRepository.findOne({
        where: { shortName: disease },
      });
      if (!diseaseEntity) {
        errors.push({
          row,
          column: 'disease',
          message: `Unknown disease "${disease}"`,
        });
      }
    }
    if (errors.length > 0) return errors;

    // A sample can be relevant to more than one disease (e.g. "FMD,LSD") —
    // a field is accepted if it's valid for at least one of the listed diseases.
    const siteCategoryOptions = [
      ...new Set(diseases.flatMap((d) => getSiteCategoryOptions(d))),
    ];
    if (
      raw['siteCategory'] &&
      !siteCategoryOptions.includes(raw['siteCategory'])
    ) {
      errors.push({
        row,
        column: 'siteCategory',
        message: `siteCategory "${raw['siteCategory']}" is not valid for disease ${diseases.join(', ')}. Valid options: ${siteCategoryOptions.join(', ')}`,
      });
    }

    const habitatOptions = getHabitatOptions();
    if (raw['habitat'] && !habitatOptions.includes(raw['habitat'])) {
      errors.push({
        row,
        column: 'habitat',
        message: `habitat "${raw['habitat']}" is not valid. Valid options: ${habitatOptions.join(', ')}`,
      });
    }

    const vaccinationOptions = [
      ...new Set(diseases.flatMap((d) => getVaccinationStatusOptions(d))),
    ];
    if (
      raw['vaccinationStatus'] &&
      !vaccinationOptions.includes(raw['vaccinationStatus'])
    ) {
      errors.push({
        row,
        column: 'vaccinationStatus',
        message: `vaccinationStatus "${raw['vaccinationStatus']}" is not valid for disease ${diseases.join(', ')}. Valid options: ${vaccinationOptions.join(', ')}`,
      });
    }

    if (raw['sampleType']) {
      const sampleType = await this.sampleTypeRepository.findOne({
        where: { name: ILike(raw['sampleType']) },
      });
      if (!sampleType) {
        errors.push({
          row,
          column: 'sampleType',
          message: `Sample type "${raw['sampleType']}" is not set up yet. Ask a workspace admin to add it under Manage > Sample Types, then re-upload.`,
        });
      } else if (
        !diseases.some((d) => (sampleType.diseaseShortNames ?? []).includes(d))
      ) {
        errors.push({
          row,
          column: 'sampleType',
          message: `Sample type "${raw['sampleType']}" exists but isn't tagged for ${diseases.join(', ')}. Ask a workspace admin to update it under Manage > Sample Types, then re-upload.`,
        });
      }
    }

    if (raw['sampleCategory'] === 'Environmental' && !raw['habitat']) {
      errors.push({
        row,
        column: 'habitat',
        message: 'habitat is required for Environmental samples',
      });
    }

    return errors;
  }

  private async validateLabDiseaseList(
    raw: Record<string, any>,
    diseaseGroup: DiseaseGroup,
    row: number,
  ): Promise<RowError[]> {
    const errors: RowError[] = [];
    const diseases = parseDiseaseList(raw['disease']);
    const allowed = diseaseGroup === 'AI' ? ['AI'] : ['FMD', 'LSD'];

    if (diseases.length === 0) {
      errors.push({ row, column: 'disease', message: 'disease is required' });
      return errors;
    }

    for (const disease of diseases) {
      if (!allowed.includes(disease)) {
        errors.push({
          row,
          column: 'disease',
          message: `Unknown disease "${disease}". Valid options: ${allowed.join(', ')}`,
        });
      }
    }

    return errors;
  }

  // One query for the whole file rather than one per row.
  private async findSamplesByBarcode(
    projectId: string,
    instituteSampleIds: string[],
  ): Promise<Map<string, Sample>> {
    const barcodes = [...new Set(instituteSampleIds.filter(Boolean))];
    if (barcodes.length === 0) return new Map();

    const samples = await this.sampleRepository.find({
      where: { project: { id: projectId }, barcode: In(barcodes) },
      select: { id: true, barcode: true, collectedAt: true },
    });
    return new Map(samples.map((sample) => [sample.barcode, sample]));
  }

  // Keys are labResultKey(sample.id, disease shortName). Includes results
  // entered through the Lab page, not just earlier imports. Only final results
  // count (see FINAL_TEST_RESULTS).
  private async findExistingLabResults(
    sampleIds: string[],
  ): Promise<Set<string>> {
    if (sampleIds.length === 0) return new Set();

    const labTests = await this.labTestRepository.find({
      where: {
        sample: { id: In(sampleIds) },
        status: StatusType.ACTIVE,
        testResult: In(FINAL_TEST_RESULTS),
      },
      relations: { sample: true, disease: true },
      select: {
        id: true,
        sample: { id: true },
        disease: { id: true, shortName: true },
      },
    });
    return new Set(
      labTests.map((labTest) =>
        labResultKey(labTest.sample.id, labTest.disease.shortName),
      ),
    );
  }
}
