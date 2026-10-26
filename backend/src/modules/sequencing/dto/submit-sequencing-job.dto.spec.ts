import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import {
  SubmitSequencingJobDto,
  SourceType,
} from './submit-sequencing-job.dto';

const base = {
  sourceType: SourceType.LAB,
  pipelineId: 'snippy-fasta',
  inputKey:
    'SDS004-ES_App_Data/uploads/3c9f38e9-3aa4-4551-a9c1-ea526a5c3617/3c39cfcf-6e66-4e76-8128-6f31f2468d2b/PP488397.fasta',
  labTestId: '53255911-ce4f-4008-bfbd-67e63bac862e',
};

async function errorsFor(payload: Record<string, unknown>) {
  const dto = plainToInstance(SubmitSequencingJobDto, payload);
  const errors = await validate(dto);
  return errors.map((e) => e.property);
}

describe('SubmitSequencingJobDto', () => {
  // Dharini identifies projects by short code, not UUID — user.project.id is
  // a value like "PHJOLL". An @IsUUID() here rejected every real submission.
  it('accepts a project code rather than requiring a UUID', async () => {
    expect(await errorsFor({ ...base, projectId: 'PHJOLL' })).not.toContain(
      'projectId',
    );
  });

  it('still accepts a submission with no project at all', async () => {
    expect(await errorsFor(base)).not.toContain('projectId');
  });

  it('requires labTestId to be a UUID for a lab-sourced submission', async () => {
    expect(await errorsFor({ ...base, labTestId: 'not-a-uuid' })).toContain(
      'labTestId',
    );
  });
});
