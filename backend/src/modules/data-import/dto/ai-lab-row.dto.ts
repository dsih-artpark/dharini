import {
  IsIn,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { IsIso8601Date } from '../../../common/validators/is-iso8601-date.validator';
import { IsDateOnOrAfter } from '../../../common/validators/is-date-on-or-after.validator';

export class AiLabRowDto {
  @IsString()
  instituteSampleId: string;

  @IsIn(['AI'])
  disease: string;

  @IsString()
  sampleType: string;

  @IsIso8601Date()
  sampleReceivedDate: string;

  @IsIn(['Yes', 'No'])
  virusIsolationPerformed: string;

  @IsOptional()
  @IsIso8601Date()
  @IsDateOnOrAfter('sampleReceivedDate')
  inoculationDate?: string;

  @IsOptional()
  @IsIso8601Date()
  @IsDateOnOrAfter('inoculationDate')
  harvestingDate?: string;

  @IsOptional()
  @IsString()
  hValue?: string;

  @IsOptional()
  @IsString()
  nValue?: string;

  @IsOptional()
  @IsIn(['Positive', 'Negative'])
  ndvPresent?: string;

  @IsOptional()
  @IsString()
  haTitre?: string;

  @IsOptional()
  @IsString()
  hiTitre?: string;

  @IsOptional()
  @IsNumberString()
  allantoicFluidVolume?: string;

  @IsOptional()
  @IsString()
  allantoicFluidVolumeUnit?: string;

  @IsOptional()
  @IsString()
  nucleicAcidType?: string;

  @IsOptional()
  @IsString()
  testMethodUsed?: string;

  @IsOptional()
  @IsString()
  targetGene?: string;

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
  subtypeOrVariant?: string;

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
