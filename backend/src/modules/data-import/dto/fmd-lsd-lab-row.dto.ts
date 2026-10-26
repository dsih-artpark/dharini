import {
  IsIn,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { IsIso8601Date } from '../../../common/validators/is-iso8601-date.validator';
import { IsDateOnOrAfter } from '../../../common/validators/is-date-on-or-after.validator';

export class FmdLsdLabRowDto {
  @IsString()
  instituteSampleId: string;

  // Disease cell may name more than one disease (e.g. "FMD & LSD") when the
  // same test result applies to both; validated in ImportValidationService.
  @IsString()
  disease: string;

  @IsString()
  sampleType: string;

  @IsIso8601Date()
  sampleReceivedDate: string;

  @IsOptional()
  @IsString()
  nucleicAcidType?: string;

  @IsOptional()
  @IsString()
  testMethodUsed?: string;

  @IsIn(['Positive', 'Negative', 'Unclear', 'Pending'])
  testResult: string;

  @IsOptional()
  @IsNumberString()
  ctValue?: string;

  @IsOptional()
  @IsString()
  viralLoad?: string;

  @IsOptional()
  @IsString()
  strainOrSerotype?: string;

  @IsIso8601Date()
  @IsDateOnOrAfter('sampleReceivedDate')
  resultDate: string;

  @IsString()
  testedBy: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  remarks?: string;
}
