import { Type } from 'class-transformer';
import { Disease, Project, LabTest, User, Sample } from './base.response';

export class LabTestResponseData extends LabTest {
  @Type(() => Project)
  project?: Project;

  @Type(() => Sample)
  sample?: Sample;

  @Type(() => Disease)
  disease?: Disease;

  @Type(() => User)
  testedBy?: User;
}

export class LabTestResponse {
  success: boolean;
  message: string;
  @Type(() => LabTestResponseData)
  data: LabTestResponseData;
}

export class ListLabTestResponse {
  success: boolean;
  message: string;
  @Type(() => LabTestResponseData)
  data: LabTestResponseData[];
}
