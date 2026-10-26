import { Type } from 'class-transformer';
import { Role } from './base.response';

class RoleResponseData extends Role {}

export class RoleResponse {
  success: boolean;
  message: string;
  @Type(() => RoleResponseData)
  data: RoleResponseData;
}

export class ListRoleResponse {
  success: boolean;
  message: string;
  @Type(() => RoleResponseData)
  data: RoleResponseData[];
}
