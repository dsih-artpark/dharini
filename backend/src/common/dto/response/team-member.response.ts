import { Type } from 'class-transformer';
import { Role, User, UserRole } from './base.response';

class TeamMemberResponseData extends User {
  @Type(() => UserRole)
  roles?: UserRole[];
}

export class TeamMemberResponse {
  success: boolean;
  message: string;
  @Type(() => TeamMemberResponseData)
  data: TeamMemberResponseData;
}

export class TeamMemberListResponse {
  success: boolean;
  message: string;
  @Type(() => TeamMemberResponseData)
  data: TeamMemberResponseData[];
}

export class ListTeamMemberResponse {
  success: boolean;
  message: string;
  @Type(() => TeamMemberResponseData)
  data: TeamMemberResponseData[];
}

class RoleResponse extends Role {}
export class ListAvailableRoleResponse {
  success: boolean;
  message: string;
  @Type(() => RoleResponse)
  data: RoleResponse[];
}
