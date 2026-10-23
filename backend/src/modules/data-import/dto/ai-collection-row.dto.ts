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
 * One row of the AI (Avian Influenza) Collection Data template.
 * `locationPrecision`/`datePrecision` intentionally dropped (unused).
 * `habitat` kept adjacent to `siteCategory`/`siteSubType` since it depends on it.
 * `vaccinationStatus` mirrors the mobile app's AI dropdown (Vaccinated /
 * Not Vaccinated / Unknown) rather than a plain yes/no toggle.
 */
export class AiCollectionRowDto {
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
  siteSubType?: string;

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

  @IsIn(['AI'])
  disease: string;

  @IsIn(['Clinical', 'Environmental'])
  sampleCategory: string;

  @IsOptional()
  @IsNumberString()
  numberOfSheds?: string;

  @IsOptional()
  @IsNumberString()
  shedCapacity?: string;

  @IsOptional()
  @IsNumberString()
  birdsInShed?: string;

  @IsOptional()
  @IsNumberString()
  farmCapacity?: string;

  @IsOptional()
  @IsString()
  farmSize?: string;

  @IsOptional()
  @IsIn(['Yes', 'No'])
  mortalityObservedInShed?: string;

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
  birdId?: string;

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
  @IsIn(['Vaccinated', 'Not Vaccinated', 'Unknown'])
  vaccinationStatus?: string;

  @IsOptional()
  @IsIn(['Yes', 'No'])
  dropInFeedIntake?: string;

  @IsOptional()
  @IsIn(['Yes', 'No'])
  dropInWaterIntake?: string;

  @IsOptional()
  @IsIn(['Yes', 'No'])
  dropInEggProduction?: string;

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
