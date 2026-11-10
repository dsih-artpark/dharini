import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { getMetadataStorage, validate } from 'class-validator';
import { Disease } from 'src/entities/disease.entity';
import { SampleType } from 'src/entities/sample-type.entity';
import { Sample } from 'src/entities/sample.entity';
import { LabTest } from 'src/entities/lab-test.entity';
import { Project } from 'src/entities/project.entity';
import { Region } from 'src/entities/region.entity';
import { StatusType } from 'src/common/enums/status.enum';
import { RegionType } from 'src/common/enums/region.enum';
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
import {
  RegionLookup,
  loadRegionLookup,
  normalizeRegionName,
} from './config/region-lookup';

type CollectionRowDto = FmdLsdCollectionRowDto | AiCollectionRowDto;
type LabRowDto = FmdLsdLabRowDto | AiLabRowDto;

// What a collection file's state/district cells are checked against: the
// country-wide master list, and the regions the project is configured for.
interface LocationContext {
  lookup: RegionLookup;
  configuredStates: Map<string, string>; // state id -> name
  configuredDistrictsByState: Map<string, Region[]>;
}

function formatNames(names: Iterable<string>): string {
  const sorted = [...names].sort((a, b) => a.localeCompare(b));
  return sorted.length > 0 ? sorted.join(', ') : 'none';
}

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

// The template columns a row DTO reads (template headers are these keys).
function dtoFields(dtoClass: { new (): object }): string[] {
  return [
    ...new Set(
      getMetadataStorage()
        .getTargetValidationMetadatas(dtoClass, '', false, false)
        .map((metadata) => metadata.propertyName),
    ),
  ];
}

function normalizeColumnName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Errors name their column either by template key ("instituteSampleId") or
// by label ("Tested By", "Sample ID"). Each one also gets the template key,
// so the upload page can mark the exact cell whichever form was used.
function withTemplateFields(errors: RowError[], fields: string[]): RowError[] {
  const fieldByColumn = new Map<string, string>();
  for (const field of fields) {
    fieldByColumn.set(normalizeColumnName(field), field);
    fieldByColumn.set(normalizeColumnName(humanizeField(field)), field);
  }
  return errors.map((error) => {
    if (error.field || !error.column) return error;
    const field = fieldByColumn.get(normalizeColumnName(error.column));
    return field ? { ...error, field } : error;
  });
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
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,
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
    const errors: RowError[] = [];
    const rows: CollectionRowDto[] = [];
    const seenInstituteSampleIds = new Set<string>();
    // The (barcode, project) unique index still backstops this at insert
    // time, but only as a file-level 409 — checked here for row-level errors.
    const existingSamples = await this.findSamplesByBarcode(
      projectId,
      rawRows.map((raw) => raw['instituteSampleId']),
    );
    const locationContext = await this.loadLocationContext(projectId, rawRows);

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
      errors.push(...this.validateLocation(raw, row, locationContext));

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

    return {
      isValid: errors.length === 0,
      errors: withTemplateFields(errors, dtoFields(dtoClass)),
      rows,
    };
  }

  async validateLabRows(
    rawRows: Record<string, any>[],
    diseaseGroup: DiseaseGroup,
    projectId: string,
  ): Promise<ValidationResult<LabRowDto>> {
    const dtoClass = (
      diseaseGroup === 'AI' ? AiLabRowDto : FmdLsdLabRowDto
    ) as { new (): LabRowDto };
    const errors: RowError[] = [];
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

    return {
      isValid: errors.length === 0,
      errors: withTemplateFields(errors, dtoFields(dtoClass)),
      rows,
    };
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
      field: violation.property,
      message: buildFriendlyMessage(
        violation.property,
        violation.constraints ?? {},
      ),
    }));
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

  // One project query and two region queries for the whole file.
  private async loadLocationContext(
    projectId: string,
    rawRows: Record<string, any>[],
  ): Promise<LocationContext> {
    const [lookup, project] = await Promise.all([
      loadRegionLookup(
        this.regionRepository,
        rawRows.map((raw) => raw['state']),
      ),
      this.projectRepository.findOne({
        where: { id: projectId },
        relations: { regions: { parentRegion: true } },
      }),
    ]);

    const configuredStates = new Map<string, string>();
    const configuredDistrictsByState = new Map<string, Region[]>();
    for (const region of project?.regions ?? []) {
      if (region.regionType === RegionType.STATE) {
        configuredStates.set(region.id, region.name);
      } else if (
        region.regionType === RegionType.DISTRICT &&
        region.parentRegion
      ) {
        // A configured district implies its state, as on the dashboard.
        const stateId = region.parentRegion.id;
        configuredStates.set(stateId, region.parentRegion.name);
        configuredDistrictsByState.set(stateId, [
          ...(configuredDistrictsByState.get(stateId) ?? []),
          region,
        ]);
      }
    }

    return { lookup, configuredStates, configuredDistrictsByState };
  }

  // The dashboard location filters and the Create Site form only offer the
  // project's configured states and districts. A site saved outside them
  // would import fine but no location filter could ever reach it, and a
  // name missing from the master list would save the site with no location.
  private validateLocation(
    raw: Record<string, any>,
    row: number,
    context: LocationContext,
  ): RowError[] {
    const reupload =
      'Add it under Edit Project Details on the project page, then re-upload.';

    const stateCell = raw['state'];
    // A blank cell is already reported as "State is required" by the DTO.
    if (!normalizeRegionName(stateCell)) return [];

    const configuredStateNames = formatNames(context.configuredStates.values());
    const state = context.lookup.findState(stateCell);
    if (!state) {
      return [
        {
          row,
          column: 'State',
          message: `State "${stateCell}" is not recognised. Check the spelling against the official state name. Configured for this project: ${configuredStateNames}.`,
        },
      ];
    }
    if (!context.configuredStates.has(state.id)) {
      return [
        {
          row,
          column: 'State',
          message: `State "${state.name}" is not configured for this project. ${reupload} Configured for this project: ${configuredStateNames}.`,
        },
      ];
    }

    const districtCell = raw['district'];
    if (!normalizeRegionName(districtCell)) return [];

    const configuredDistricts =
      context.configuredDistrictsByState.get(state.id) ?? [];
    const configuredDistrictNames = formatNames(
      configuredDistricts.map((district) => district.name),
    );
    const district = context.lookup.findDistrict(state.id, districtCell);
    if (!district) {
      return [
        {
          row,
          column: 'District',
          message: `District "${districtCell}" was not found in ${state.name}. Check the spelling against the official district name. Configured for ${state.name}: ${configuredDistrictNames}.`,
        },
      ];
    }
    if (
      !configuredDistricts.some((configured) => configured.id === district.id)
    ) {
      return [
        {
          row,
          column: 'District',
          message: `District "${district.name}" is not configured for this project. ${reupload} Configured for ${state.name}: ${configuredDistrictNames}.`,
        },
      ];
    }

    return [];
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
