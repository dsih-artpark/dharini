import { Type } from 'class-transformer';
import {
  Permission,
  Project,
  Role,
  Team,
  User,
  UserRole,
} from './base.response';

export class UserProfileResponseData extends User {
  @Type(() => UserProfileResponseDataUserRole)
  roles: UserProfileResponseDataUserRole[];

  @Type(() => Team)
  team?: Team;

  @Type(() => Project)
  project?: Project;
}

class UserProfileResponseDataRole extends Role {
  @Type(() => Permission)
  permissions: Permission[];
}

class UserProfileResponseDataUserRole extends UserRole {
  @Type(() => UserProfileResponseDataRole)
  role?: UserProfileResponseDataRole;
}

export class UserProfileResponse {
  success: boolean;
  message: string;
  @Type(() => UserProfileResponseData)
  data: UserProfileResponseData;
}

export class UserResponse {
  success: boolean;
  message: string;
  @Type(() => User)
  data: User;
}
