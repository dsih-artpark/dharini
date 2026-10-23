import { Role } from 'src/entities/role.entity';

export class RolePaginatedResponseType {
  docs: Role[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export class PaginatedRoleResponse {
  success: boolean;
  message: string;
  data: RolePaginatedResponseType;
}
export class RoleResponse {
  success: boolean;
  message: string;
  data: Role;
}

export class FetchAllRoleResponse {
  success: boolean;
  message: string;
  data: Role[];
}
