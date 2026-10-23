import { ApiProperty, PickType } from '@nestjs/swagger';
import { Site } from 'src/entities/site.entity';
import { IsOptional, Matches } from 'class-validator';

export class UpdateSiteDto extends PickType(Site, [
  'name',
  'collectionFrequencyInterval',
  'collectionFrequency',
  'collectionDayOfWeek',
  'collectionTime',
  'collectionDuration',
  'collectionStartDate',
  'farmType',
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
  @IsOptional()
  regionId: string;

  @ApiProperty({
    description: 'latitude',
    example: '40.2331',
  })
  @IsOptional()
  latitude: number;

  @ApiProperty({
    description: 'longitude',
    example: '-70.4453',
  })
  @IsOptional()
  longitude: number;

  @ApiProperty({
    description: 'collectionCollector id',
    example: 'user-uuid',
  })
  @IsOptional()
  collectionCollector: string;

  // Plain string, not boolean, with the pattern set here rather than taken
  // from @Matches: see CreateSiteDto.collectionConsent.
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
}
