import { ApiProperty } from '@nestjs/swagger';
import { Disease } from 'src/entities/disease.entity';
import { Invite } from 'src/entities/invite.entity';
import { Location } from 'src/entities/location.entity';
import { Permission } from 'src/entities/permission.entity';
import { Project } from 'src/entities/project.entity';
import { Region } from 'src/entities/region.entity';
import { Role } from 'src/entities/role.entity';
import { SampleType } from 'src/entities/sample-type.entity';
import { Sample } from 'src/entities/sample.entity';
import { Site } from 'src/entities/site.entity';
import { SurveillanceType } from 'src/entities/surveillance-type.entity';
import { Team } from 'src/entities/team.entity';
import { User } from 'src/entities/user.entity';
import { Visit } from 'src/entities/visit.entity';
// import { UserRole } from 'src/entities/user-role.entity';

export type ResponseType = User | Site | Visit | Project;

export type CommonResponse<T> = {
  success: boolean;
  message: string;
  data?: T | PaginatedResponse<T>;
  error?: any;
};

export type PaginatedResponse<T> = {
  docs: T;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export class BasePaginatedResponse<T> {
  @ApiProperty({ isArray: true }) // Indicating this is an array
  docs: T[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;

  constructor(
    docs: T[],
    total: number,
    page: number,
    limit: number,
    totalPages: number,
  ) {
    this.docs = docs;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = totalPages;
  }
}

export class BaseResponse<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Success' })
  message: string;

  @ApiProperty({ type: Object }) // Generic, but overridden in subclasses
  data?: T | BasePaginatedResponse<T>;

  constructor(
    success: boolean,
    message: string,
    data?: T | BasePaginatedResponse<T>,
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
  }
}

// User response
export class UserResponse extends BaseResponse<
  User | User[] | BasePaginatedResponse<User> | BasePaginatedResponse<User[]>
> {
  @ApiProperty({ type: User }) // Explicitly set the type
  data:
    | User
    | User[]
    | BasePaginatedResponse<User>
    | BasePaginatedResponse<User[]>;

  constructor(
    success = true,
    message = 'Success',
    data:
      | User
      | User[]
      | BasePaginatedResponse<User>
      | BasePaginatedResponse<User[]>,
  ) {
    super(success, message, data);
    this.data = data; // Ensure data is correctly assigned
  }
}

export class ProjectResponse extends BaseResponse<Project | Project[]> {
  @ApiProperty({ type: Project, isArray: true }) // Supports both single and multiple projects
  data: Project | Project[];

  constructor(success = true, message = 'Success', data: Project | Project[]) {
    super(success, message, data);
    this.data = data;
  }
}

export class TeamResponse extends BaseResponse<Team | Team[]> {
  @ApiProperty({ type: Team, isArray: true })
  data: Team | Team[];

  constructor(success = true, message = 'Success', data: Team | Team[]) {
    super(success, message, data);
    this.data = data;
  }
}

export class RoleResponse extends BaseResponse<Role | Role[]> {
  @ApiProperty({ type: Role, isArray: true })
  data: Role | Role[];

  constructor(success = true, message = 'Success', data: Role | Role[]) {
    super(success, message, data);
    this.data = data;
  }
}

export class PermissionResponse extends BaseResponse<
  Permission | Permission[]
> {
  @ApiProperty({ type: Permission, isArray: true })
  data: Permission | Permission[];

  constructor(
    success = true,
    message = 'Success',
    data: Permission | Permission[],
  ) {
    super(success, message, data);
    this.data = data;
  }
}

// export class UserRoleResponse extends BaseResponse<UserRole | UserRole[]> {
//   @ApiProperty({ type: UserRole, isArray: true })
//   data: UserRole | UserRole[];

//   constructor(
//     success = true,
//     message = 'Success',
//     data: UserRole | UserRole[],
//   ) {
//     super(success, message, data);
//     this.data = data;
//   }
// }

export class SiteResponse extends BaseResponse<Site | Site[]> {
  @ApiProperty({ type: Site, isArray: true })
  data: Site | Site[];

  constructor(success = true, message = 'Success', data: Site | Site[]) {
    super(success, message, data);
    this.data = data;
  }
}

export class VisitResponse extends BaseResponse<
  | Visit
  | Visit[]
  | BasePaginatedResponse<Visit>
  | BasePaginatedResponse<Visit[]>
> {
  @ApiProperty({ type: Visit })
  data:
    | Visit
    | Visit[]
    | BasePaginatedResponse<Visit>
    | BasePaginatedResponse<Visit[]>;

  constructor(
    success = true,
    message = 'Success',
    data:
      | Visit
      | Visit[]
      | BasePaginatedResponse<Visit>
      | BasePaginatedResponse<Visit[]>,
  ) {
    super(success, message, data);
    this.data = data;
  }
}

export class SampleResponse extends BaseResponse<Sample | Sample[]> {
  @ApiProperty({ type: Sample, isArray: true })
  data: Sample | Sample[];

  constructor(success = true, message = 'Success', data: Sample | Sample[]) {
    super(success, message, data);
    this.data = data;
  }
}

export class DiseaseResponse extends BaseResponse<Disease | Disease[]> {
  @ApiProperty({ type: Disease, isArray: true })
  data: Disease | Disease[];

  constructor(success = true, message = 'Success', data: Disease | Disease[]) {
    super(success, message, data);
    this.data = data;
  }
}

export class SampleTypeResponse extends BaseResponse<
  SampleType | SampleType[]
> {
  @ApiProperty({ type: SampleType, isArray: true })
  data: SampleType | SampleType[];

  constructor(
    success = true,
    message = 'Success',
    data: SampleType | SampleType[],
  ) {
    super(success, message, data);
    this.data = data;
  }
}

export class SurveillanceTypeResponse extends BaseResponse<
  SurveillanceType | SurveillanceType[]
> {
  @ApiProperty({ type: SurveillanceType, isArray: true })
  data: SurveillanceType | SurveillanceType[];

  constructor(
    success = true,
    message = 'Success',
    data: SurveillanceType | SurveillanceType[],
  ) {
    super(success, message, data);
    this.data = data;
  }
}

export class RegionResponse extends BaseResponse<Region | Region[]> {
  @ApiProperty({ type: Region, isArray: true })
  data: Region | Region[];

  constructor(success = true, message = 'Success', data: Region | Region[]) {
    super(success, message, data);
    this.data = data;
  }
}

export class LocationResponse extends BaseResponse<Location | Location[]> {
  @ApiProperty({ type: Location, isArray: true })
  data: Location | Location[];

  constructor(
    success = true,
    message = 'Success',
    data: Location | Location[],
  ) {
    super(success, message, data);
    this.data = data;
  }
}

export class InvitesResponse extends BaseResponse<Invite | Invite[]> {
  @ApiProperty({ type: Invite, isArray: true })
  data: Invite | Invite[];

  constructor(success = true, message = 'Success', data: Invite | Invite[]) {
    super(success, message, data);
    this.data = data;
  }
}

export class Login {
  accessToken: string;
}
export class LoginResponse extends BaseResponse<Login> {
  constructor(success = true, message = 'Success') {
    super(success, message);
  }
}

export class VerifyOtp {
  accessToken: string;
}
export class VerifyOtpResponse extends BaseResponse<VerifyOtp> {
  @ApiProperty({ type: VerifyOtp })
  data: VerifyOtp;

  constructor(success = true, message = 'Success', data?: VerifyOtp) {
    super(success, message, data);
    this.data = data;
  }
}
