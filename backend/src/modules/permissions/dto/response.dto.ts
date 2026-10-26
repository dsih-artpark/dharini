import { Permission } from 'src/entities/permission.entity';

export class PermissionPaginatedResponseType {
  docs: Permission[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export class PaginatedPermissionResponse {
  success: boolean;
  message: string;
  data: PermissionPaginatedResponseType;
}
export class PermissionResponse {
  success: boolean;
  message: string;
  data: Permission | PermissionPaginatedResponseType;
}
