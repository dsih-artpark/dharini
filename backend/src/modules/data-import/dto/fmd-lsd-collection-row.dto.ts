import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { IsIso8601Date } from '../../../common/validators/is-iso8601-date.validator';

/**
 * One row of the FMD/LSD Collection Data template.
 * `locationPrecision`/`datePrecision` intentionally dropped (unused).
 * `habitat` kept adjacent to `siteCategory` since it depends on it.
 */
export class FmdLsdCollectionRowDto {
  @IsString()
  instituteSampleId: string;

  @IsString()
  collectorName: string;

  @IsNotEmpty()
  @IsEmail()
  collectorEmail: string;

  @IsIso8601Date()
  visitOrCollectionDate: string;

  @IsString()
  siteName: string;

  @IsString()
  siteCategory: string;

  @IsOptional()
  @IsString()
  habitat?: string;

  @IsString()
  state: string;

  @IsString()
  district: string;

  @IsOptional()
  @IsString()
  villageOrLocality?: string;

  @IsOptional()
  @IsNumberString()
  latitude?: string;

  @IsOptional()
  @IsNumberString()
  longitude?: string;

  // Disease cell may name more than one disease (e.g. "FMD & LSD") since one
  // sample can be relevant to both; validated in ImportValidationService.
  @IsString()
  disease: string;

  @IsIn(['Clinical', 'Environmental'])
  sampleCategory: string;

  @IsOptional()
  @IsString()
  species?: string;

  @IsOptional()
  @IsNumberString()
  speciesHeadcountAtSite?: string;

  @IsOptional()
  @IsNumberString()
  totalAnimalsAtSite?: string;

  @IsOptional()
  @IsString()
  animalIdentifier?: string;

  @IsOptional()
  @IsString()
  breed?: string;

  @IsOptional()
  @IsNumberString()
  ageYears?: string;

  @IsOptional()
  @IsNumberString()
  ageMonths?: string;

  @IsOptional()
  @IsIn(['Male', 'Female', 'Unknown'])
  gender?: string;

  @IsOptional()
  @IsIn([
    'Vaccinated within 1 year',
    'Vaccinated before 1 year',
    'Not Vaccinated',
    'Unknown',
  ])
  vaccinationStatus?: string;

  @IsOptional()
  @IsString()
  diseaseHistory?: string;

  @IsOptional()
  @IsIn(['Yes', 'No'])
  feverObserved?: string;

  @IsOptional()
  @IsIso8601Date()
  firstNoticedDate?: string;

  @IsOptional()
  @IsNumberString()
  averageMilkProductionPerDayWithinOneYear?: string;

  @IsOptional()
  @IsNumberString()
  averageMilkProductionPerDayBeforeOneYear?: string;

  @IsOptional()
  @IsString()
  vectors?: string;

  @IsOptional()
  @IsString()
  environmentalSourceDescription?: string;

  @IsString()
  sampleType: string;

  @IsOptional()
  @IsNumberString()
  sampleQuantity?: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  remarks?: string;
}
