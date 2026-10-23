import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type, Transform } from 'class-transformer';

export class AnimalMetadataSpecies {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty({ required: false })
  @Expose()
  emojiIcon?: string;
}

export class AnimalMetadataData {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  animalTagId?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  birdId?: string | null;

  @ApiProperty({ required: false, nullable: true, type: AnimalMetadataSpecies })
  @Expose()
  @Type(() => AnimalMetadataSpecies)
  species?: AnimalMetadataSpecies | null;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  breed?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  ageYears?: number | null;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  ageMonths?: number | null;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  gender?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  vaccinationStage?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  diseaseHistory?: string[] | null;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  @Transform(({ value }) => (value != null ? Number(value) : null))
  averageMilkProductionPerDayWithinOneYear?: number | null;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  @Transform(({ value }) => (value != null ? Number(value) : null))
  averageMilkProductionPerDayBeforeOneYear?: number | null;

  @ApiProperty()
  @Expose()
  feverObserved: boolean;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  firstNoticedDate?: Date | null;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  vectors?: string[] | null;

  @ApiProperty()
  @Expose()
  dropInFeedIntake: boolean;

  @ApiProperty()
  @Expose()
  dropInWaterIntake: boolean;

  @ApiProperty()
  @Expose()
  dropInEggProduction: boolean;

  @ApiProperty()
  @Expose()
  createdAt: Date;
}

export class ListAnimalMetadataResponse {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: AnimalMetadataData, isArray: true })
  @Type(() => AnimalMetadataData)
  data: AnimalMetadataData[];
}
