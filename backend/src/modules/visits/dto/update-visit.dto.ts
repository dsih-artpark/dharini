import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

import { Visit } from 'src/entities/visit.entity';

export class UpdateVisitDto extends PickType(Visit, [
  'visitedAt',
  'visitStartedAt',
  'visitStatus',
  'status',
  'isCompleted',
] as const) {
  @ApiPropertyOptional({
    description: 'site id',
    example: 'eaa81d72-5733-40e2-8f91-e3af7f845967',
  })
  @IsNotEmpty()
  siteId: string;

  @ApiProperty({
    description: 'file path',
    example: ['https://<s3>/<bucket>/<filepath>'],
  })
  @IsOptional()
  photos?: string[];

  @ApiProperty({
    description: 'comment',
    example: 'Anything regarding visit',
  })
  @IsOptional()
  comment?: string;

  @ApiPropertyOptional({
    description: 'team member id',
    example: 'eaa81d72-5733-40e2-8f91-e3af7f845967',
  })
  visitedBy: string;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'This data is updating result of test result for disease',
    example: [
      {
        diseaseId: 'diseaseId',
        sampleCount: '10',
        isSuspectedPositive: 'false',
      },
    ],
  })
  suspectDiseaseData?: [
    { diseaseId: string; sampleCount: number; isSuspectedPositive: boolean },
  ];

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Disease questionnaire responses grouped by disease shortName',
    example: {
      AI: {
        farmType: 'Layer',
        numberOfSheds: 4,
        shedCapacity: 2000,
        birdsInShed: 1800,
        farmCapacity: 8000,
        vaccinationStage: 'Starter',
        breed: 'Cobb 400',
        species: 'Chicken',
        mortalityObservedInShed: true,
        dropInEggProduction: false,
      },
    },
  })
  diseaseQuestionnaireData?: Record<string, any>;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Environmental questionnaire responses',
    example: {
      'Drinking Water': {
        sourceOfDrinkingWater: 'Tap',
      },
    },
  })
  environmentalQuestionnaireData?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Latitude of location where visit was completed',
    example: 12.9716,
  })
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional({
    description: 'Longitude of location where visit was completed',
    example: 77.5946,
  })
  @IsOptional()
  longitude?: number;
}
