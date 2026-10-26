import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { Visit } from 'src/entities/visit.entity';
import { UpdateVisitOnSubmitDto } from './update-visit-on-submit.dto';
import { CreateSampleOnVisitDto } from 'src/modules/samples/dto/create-sample-on-submit.dto';

export class SubmitVisitDto extends PickType(Visit, [
  'questionSetId',
] as const) {
  @ApiProperty({
    description: 'list of sample data collected from site',
    example: `{
      "siteId": "eaa81d72-5733-40e2-8f91-e3af7f845967",
      "visitedBy": "eaa81d72-5733-40e2-8f91-e3af7f845967",
      "projectId" : "2742233c-4ddd-4f85-a961-4a30ceaa47e6",
      "teamId": "ab76cec7-38ee-48b8-b6f3-cb7813a0a937",
      "isCompleted": true,
      "photos": [],
      "comment": "test",
      "suspectDiseaseData": [
          "{diseaseId: 99d12e32-079a-47c8-967a-5d92c7529d47, sampleCount: 0, isSuspectedPositive: false}"
      ]
    }`,
  })
  visitData: UpdateVisitOnSubmitDto;

  @ApiProperty({
    description: 'list of sample data collected from site',
    example: `[
    {
      "replicates": "not collected",
      "photos": [
        "https://<s3>/<bucket>/<filepath>"
      ],
      "diseases": [
        "diseaseId1",
        "diseaseId1"
      ],
      "originalSampleBarcode": "G-2407-E-L-11-09",
      "barcode": "G-2407-E-L-11-09",
      "comment": "Anything regarding sample",
      "sampleType": "Sample type UUID"
    }
    ]`,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSampleOnVisitDto)
  samples: CreateSampleOnVisitDto[];
}
