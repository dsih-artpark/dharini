import { ApiSchema, PickType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { Team } from 'src/entities/team.entity';
import { UserRole } from 'src/entities/user-role.entity';
import { User } from 'src/entities/user.entity';

class UserResponseType extends PickType(User, [
  'id',
  'firstName',
  'lastName',
  'address',
  'contactNumber',
  'designation',
  'email',
]) {}
class UserRoleResponseDto extends PickType(UserRole, [
  'id',
  'team',
  'project',
  'role',
]) {}
class TeamResponseDto extends PickType(Team, [
  'id',
  'teamName',
  'isProjectViewer',
]) {}
class ProjectMemberType extends PickType(User, [
  'id',
  'firstName',
  'lastName',
  'email',
]) {}

export class UserResponseDto extends UserResponseType {
  @Expose()
  @Type(() => UserRoleResponseDto)
  roles: UserRoleResponseDto[];

  @Expose()
  @Type(() => TeamResponseDto)
  team?: TeamResponseDto;
}

export class UserPaginatedResponseType {
  docs: UserResponseDto[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}
export class PaginatedUserResponse {
  success: boolean;
  message: string;
  data: UserPaginatedResponseType;
}
// The OpenAPI schema named UserResponse is the full user that the users
// endpoints return (src/common/dto/response/user.response.ts). This one
// carries only the UserResponseType fields, so it gets a name of its own
// rather than overwriting that schema, depending on which is scanned last.
@ApiSchema({ name: 'UserSummaryResponse' })
export class UserResponse {
  success: boolean;
  message: string;
  data: UserResponseType;
}

export class FetchAllUserResponse {
  success: boolean;
  message: string;
  data: UserResponseType[];
}

export class MemberResponse extends ProjectMemberType {}

export class ProjectMembersResponse {
  success: boolean;
  message: string;
  data: MemberResponse[];
}
