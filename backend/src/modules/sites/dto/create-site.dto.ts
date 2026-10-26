import { ApiHideProperty, ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Matches,
} from 'class-validator';
import { Site } from 'src/entities/site.entity';

export class CreateSiteDto extends PickType(Site, [
  'name',
  'siteCode',
  'collectionFrequencyInterval',
  'collectionFrequency',
  'collectionDayOfWeek',
  'collectionTime',
  'collectionDuration',
  'collectionStartDate',
  'farmType',
  'siteSubType',
  'siteType',
  'siteOwnerName',
  'siteOwnerNumber',
  'workerNumber',
  'address',
  'pinCode',
  'comment',
  'block',
  'village',
] as const) {
  @ApiProperty({
    description: 'file path',
    example: ['https://<s3>/<bucket>/<filepath>'],
  })
  @IsOptional()
  photos: string[];

  @ApiProperty({
    description: 'ID of the region',
    example: 'district_<code>',
  })
  @IsNotEmpty()
  regionId: string;

  @ApiProperty({
    description: 'latitude',
    example: '40.2331',
  })
  @IsNotEmpty()
  latitude: number;

  @ApiProperty({
    description: 'longitude',
    example: '-70.4453',
  })
  @IsNotEmpty()
  longitude: number;

  @ApiHideProperty()
  project?: string;

  @ApiProperty({
    description: 'collectionCollector id',
    example: 'user-uuid',
  })
  @IsOptional()
  collectionCollector: string;

  // Kept as a plain string (not boolean) because the varchar column predates
  // this field and released APKs deserialize it as String; a boolean on the
  // wire would break their site list parsing. @Matches rather than @IsIn:
  // the Swagger plugin turns @IsIn into an OpenAPI enum, which would
  // generate a Dart enum class in es_client instead of String. The plugin
  // copies @Matches' regex literal into `pattern` with its slashes, which
  // would only match '/true/'; the pattern set here takes precedence.
  @ApiProperty({
    description: "Site owner's collection consent: 'true' or 'false'",
    example: 'true',
    type: String,
    required: false,
    nullable: true,
    pattern: '^(true|false)$',
  })
  @IsOptional()
  @Matches(/^(true|false)$/, {
    message: "collectionConsent must be 'true' or 'false'",
  })
  collectionConsent?: string | null;

  @ApiProperty({
    description:
      'IDs of diseases to associate with this site (subset of project diseases)',
    example: ['uuid-1', 'uuid-2'],
    isArray: true,
    type: String,
  })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  diseaseIds?: string[];
}
