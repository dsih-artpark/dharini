import { OmitType } from '@nestjs/swagger';
import { CreateProjectDto } from '../../projects/dto/create-project.dto';

/**
 * Body DTO for POST /workspaces/:workspaceId/projects.
 *
 * CreateProjectDto.workspaceId is @IsNotEmpty() (task A2 — the DB column
 * stays nullable, so DTO validation is the only thing that enforces "every
 * project has a workspace"). The flat POST /projects route takes it from the
 * body, but this route already takes it from the :workspaceId URL param
 * (WorkspacesService.createProject receives and validates it there) — so
 * `workspaceId` is omitted here, not made optional, to avoid requiring
 * clients to duplicate it into the JSON body just to satisfy the global
 * validation pipe. Both routes still end up with a workspace set either way.
 */
export class CreateWorkspaceProjectDto extends OmitType(CreateProjectDto, [
  'workspaceId',
] as const) {}
