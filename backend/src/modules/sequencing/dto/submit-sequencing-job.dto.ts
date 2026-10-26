import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsUUID,
  ValidateIf,
  IsString,
} from 'class-validator';

export enum SourceType {
  LAB = 'lab',
  NCBI = 'ncbi',
  MANUAL = 'manual',
}

export enum FileFormat {
  FASTA = 'FASTA',
  FASTQ = 'FASTQ',
}

export enum LibraryType {
  SINGLE_END = 'Single End',
  PAIRED_END = 'Paired End',
}

/**
 * Historical values only — no longer enforced. The pipeline (not this
 * field) determines how a submission is processed, so the DTO accepts any
 * string here rather than validating against this enum.
 */
export enum SequencingMethod {
  WGS = 'WGS',
  AMPLICON = 'Amplicon',
  METAGENOMICS = 'Metagenomics',
  RNA_SEQ = 'RNA-Seq',
}

/**
 * Body of `POST /sequencing/jobs/submit`. JSON only — the browser has
 * already PUT its bytes straight to S3 via a presigned URL (see
 * SequencingUploadsService.createUploadTarget) and hands back only the key.
 */
export class SubmitSequencingJobDto {
  @IsEnum(SourceType)
  sourceType: SourceType;

  @ValidateIf((o) => o.sourceType === SourceType.LAB)
  @IsUUID()
  labTestId?: string;

  @ValidateIf((o) => o.sourceType === SourceType.NCBI)
  @IsString()
  @IsNotEmpty()
  ncbiAccession?: string;

  @ValidateIf((o) => o.sourceType === SourceType.MANUAL)
  @IsString()
  @IsNotEmpty()
  manualSampleBarcode?: string;

  @ValidateIf((o) => o.sourceType === SourceType.MANUAL)
  @IsOptional()
  @IsString()
  manualSiteName?: string;

  /**
   * Optional — the pipeline architecture now determines the file format.
   * When omitted, SequencingJobsService derives it from the input
   * filename's extension (falling back to the pipeline's accepted
   * extensions). Honoured as-is when supplied.
   */
  @IsOptional()
  @IsEnum(FileFormat)
  fileFormat?: FileFormat;

  /**
   * Optional, and never defaulted by the server: neither live pipeline
   * accepts a second reads file, so guessing "Single End" would record a
   * claim we can't honour. Stored null when not supplied.
   */
  @IsOptional()
  @IsEnum(LibraryType)
  libraryType?: LibraryType;

  /**
   * Optional — derived from the selected pipeline's displayName (falling
   * back to pipelineId) when omitted. Honoured as-is when supplied.
   */
  @IsOptional()
  @IsString()
  platform?: string;

  /**
   * Optional, free-form now that the pipeline determines how a file is
   * processed rather than this field. Stored null when not supplied.
   */
  @IsOptional()
  @IsString()
  sequencingMethod?: string;

  /**
   * The project this submission belongs to. NOT a UUID — Dharini identifies
   * projects by their short code (e.g. "PHJOLL"), which is what the web app
   * holds in `user.project.id` and what the rest of the API accepts.
   */
  @IsOptional()
  @IsString()
  projectId?: string;

  /** Which pipeline definition (id from GET /sequencing/pipelines) to run. */
  @IsString()
  @IsNotEmpty()
  pipelineId: string;

  /**
   * S3 key the browser already uploaded to via a presigned PUT
   * (SequencingUploadsService.createUploadTarget). Re-checked against the
   * authenticated user at submit time — see
   * SequencingUploadsService.assertOwnedKey.
   *
   * Absent/null ONLY for sourceType "ncbi": there the backend fetches the
   * FASTA from NCBI itself and uploads it server-side, so there is nothing
   * for the browser to hand back.
   */
  @ValidateIf((o) => o.sourceType !== SourceType.NCBI)
  @IsString()
  @IsNotEmpty()
  inputKey?: string | null;

  @IsOptional()
  @IsString()
  inputFilename?: string;

  /** e.g. `{ primer_bed: "<key>" }` — every value is an S3 key subject to the same ownership check as inputKey. */
  @IsOptional()
  @IsObject()
  extraInputKeys?: Record<string, string>;

  @IsOptional()
  @IsObject()
  params?: Record<string, unknown>;
}
