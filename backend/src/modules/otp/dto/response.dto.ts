import { Project } from 'src/entities/project.entity';

export class ProjectPaginatedResponseType {
  docs: Project[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export class PaginatedProjectResponse {
  success: boolean;
  message: string;
  data: ProjectPaginatedResponseType;
}
export class ProjectResponse {
  success: boolean;
  message: string;
  data: Project | ProjectPaginatedResponseType;
}
