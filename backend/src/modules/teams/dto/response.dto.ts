import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserWithRoleResponseDto } from 'src/common/types/common-response.dto';
import { Team } from 'src/entities/team.entity';

export class TeamPaginatedResponseType {
  docs: Team[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export class PaginatedTeamResponse {
  success: boolean;
  message: string;
  data: TeamPaginatedResponseType;
}

export class TeamResponseDto extends PickType(Team, ['id', 'teamName']) {
  @Type(() => UserWithRoleResponseDto)
  members: UserWithRoleResponseDto[];
}
export class TeamResponse {
  success: boolean;
  message: string;
  data?: TeamResponseDto;
}

export class FetchAllTeamResponse {
  success: boolean;
  message: string;
  data: TeamResponseDto[];
}

// export class TeamMemberResponse {
//   success: boolean;
//   message: string;
//   data?: UserWithRoleResponseDto;
// }

// export class FetchAllTeamMemberResponse {
//   success: boolean;
//   message: string;
//   data?: UserWithRoleResponseDto[];
// }
