import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { Parser } from 'json2csv';
import { DateTime } from 'luxon';
import { DataSource } from 'typeorm';
import { ProjectResponseData } from 'src/common/dto/response/project.response';
import { Action } from 'src/common/enums/action.enum';
import { Resource } from 'src/common/enums/resource.enum';
import { RoleType } from 'src/common/enums/roles.enum';
import { SampleStatus } from 'src/common/enums/sample-status.enum';
import { Scope } from 'src/common/enums/scope.enum';
import { TestResultType } from 'src/common/enums/test-result.enum';
import { VisitStatus } from 'src/common/enums/visitStatus.enum';
import { beautifyHeader } from 'src/common/functions/format-csv-header';
import {
  checkUserPermissions,
  getUserScope,
} from 'src/common/functions/get-user-role';
import { CreateCollectionPlanObj } from 'src/common/types/create-collectionplan-obj.type';
import { CreateSiteObj } from 'src/common/types/create-site-obj.type';
import { computeVisitRoundsForSites } from 'src/common/utils/visit-rounds.util';
import { Disease } from 'src/entities/disease.entity';
import { LabTest } from 'src/entities/lab-test.entity';
import { Media } from 'src/entities/media.entity';
import { Otp } from 'src/entities/otp.entity';
import { Project } from 'src/entities/project.entity';
import { Region } from 'src/entities/region.entity';
import { Role } from 'src/entities/role.entity';
import { SampleType } from 'src/entities/sample-type.entity';
import { Sample } from 'src/entities/sample.entity';
import { Site } from 'src/entities/site.entity';
import { SurveillanceType } from 'src/entities/surveillance-type.entity';
import { Team } from 'src/entities/team.entity';
import { UserRole } from 'src/entities/user-role.entity';
import { User } from 'src/entities/user.entity';
import { Visit } from 'src/entities/visit.entity';
import { Workspace } from 'src/entities/workspace.entity';
import { Brackets, ILike, In, Repository } from 'typeorm';
import { RegionType } from '../../common/enums/region.enum';
import { StatusType } from '../../common/enums/status.enum';
import { LocationService } from '../location/location.service';
import { MulterConfigService } from '../media/media.service';
import { calculateExpiryDateFlexible } from '../sites/calExpiryDate';
import { calculateStartDate } from '../sites/calStartDate';
import { UpdateSiteDto } from '../sites/dto/update-site.dto';
import { SitesService } from '../sites/sites.service';
import { UserService } from '../users/users.service';
import { SubmitVisitDto } from '../visits/dto/submit-visit.dto';
import { VisitService } from '../visits/visits.service';
import { CreateProjectDto } from './dto/create-project.dto';
import {
  ProjectDetailsRecord,
  ProjectPaginatedResponseType,
} from './dto/response.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { RedisCacheService } from '../../common/cache/redis-cache.service';
import { USER_AUTH_CACHE_PREFIX } from '../../common/cache/cache-keys';
import { TenantScopeService } from '../../common/authorization/tenant-scope.service';
import { generateOtp } from '../../common/functions/generate-otp';

export type ProjectTeamUserListItem = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  contactNumber?: string | null;
  role?: {
    id: string;
    name: string;
    scope: string;
  } | null;
  team?: {
    id: string;
    teamName: string;
  } | null;
  project?: {
    id: string;
    name: string;
  } | null;
};

export type ProjectTeamUsersResponse = {
  users: ProjectTeamUserListItem[];
  canEditRole: boolean;
};

function resolveRegionHierarchy(region?: Region | null): {
  state: string | null;
  district: string | null;
} {
  let state: string | null = null;
  let district: string | null = null;
  let current: Region | null | undefined = region;
  while (current) {
    if (current.regionType === RegionType.STATE) state = current.name;
    if (current.regionType === RegionType.DISTRICT) district = current.name;
    current = current.parentRegion;
  }
  return { state, district };
}

function toIsoString(date?: Date | string | null): string | null {
  return date ? new Date(date).toISOString() : null;
}

@Injectable()
export class ProjectsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,
    @InjectRepository(SurveillanceType)
    private readonly surveillanceTypeRepository: Repository<SurveillanceType>,
    @InjectRepository(Disease)
    private readonly diseaseRepository: Repository<Disease>,
    private readonly userService: UserService,
    private readonly siteService: SitesService,
    private readonly visitService: VisitService,
    private readonly locationService: LocationService,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Site)
    private readonly siteRepository: Repository<Site>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(LabTest)
    private readonly labTestRepository: Repository<LabTest>,
    @InjectRepository(SampleType)
    private readonly sampleTypeRepository: Repository<SampleType>,
    @InjectRepository(Sample)
    private readonly sampleRepository: Repository<Sample>,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    @InjectRepository(Visit)
    private readonly visitRepository: Repository<Visit>,
    private readonly mediaService: MulterConfigService,
    private readonly cacheService: RedisCacheService,
    private readonly tenantScopeService: TenantScopeService,
  ) {}

  async findAll(query: any, user?: any): Promise<ProjectPaginatedResponseType> {
    const { page = 1, limit = 10, disease, region, workspaceId } = query;
    const diseaseWiseStats = new Map();
    // `user` is req.user, already eager-loaded by UserService.findOne with
    // roles/roles.role/roles.role.permissions/roles.workspace - re-fetching
    // it here was a redundant query.
    const userData = user;
    const userScope = getUserScope(userData);
    // Workspace(s) this caller is a *member* of - any role tied to the
    // workspace, not necessarily one that confers admin (that's the
    // stricter check in `administersWorkspace()`, used for writes). Fine
    // for scoping this read and for validating a client-supplied
    // `workspaceId` filter (never trust it blindly for non-System callers),
    // but don't reuse this variable's shape for a write path.
    const memberWorkspaceIds = (userData?.roles ?? [])
      .map((userRole) => userRole.workspace?.id)
      .filter((id): id is string => !!id);
    const allDiseases = await this.diseaseRepository.find({
      select: ['name', 'shortName', 'index'],
    });

    allDiseases.forEach(({ name, shortName, index }) => {
      diseaseWiseStats.set(name, {
        diseaseShortName: shortName,
        diseaseName: name,
        diseaseIndex: index,
        totalSamples: 0,
        positiveSamples: 0,
      });
    });
    try {
      const skip = (page - 1) * limit; // Calculate how many records to skip
      if (userScope === Scope.System) {
        // Super-admin query with pagination
        const projectQuery = this.projectRepository
          .createQueryBuilder('project')
          .leftJoinAndSelect('project.diseases', 'disease') // Join diseases
          .leftJoinAndSelect('project.regions', 'region') // Join regions
          .leftJoinAndSelect('region.parentRegion', 'parentRegion')
          .leftJoinAndSelect('project.surveillanceTypes', 'surveillanceType') // Join surveillanceTypes
          .leftJoinAndSelect('project.projectAdmins', 'projectAdmin') // Join projectAdmins
          .loadRelationCountAndMap('project.totalSiteCount', 'project.sites')
          // AndSelect: clients need the owning workspace to group a
          // multi-workspace user's projects - ManyToOne, so this cannot
          // fan out rows or skew the paginated count below.
          .leftJoinAndSelect('project.workspace', 'workspace');

        // Scope to a single workspace when the caller has one "selected" in
        // the UI (4.3's switcher) - System scope sees everything by default
        // (unchanged, backward-compatible), but filters down when a
        // workspaceId is explicitly requested, so "go to projects" while a
        // workspace is selected reflects that workspace instead of the
        // global admin view.
        if (workspaceId) {
          projectQuery.andWhere('workspace.id = :workspaceId', {
            workspaceId,
          });
        }

        // Filter by diseases if provided
        if (disease) {
          projectQuery.andWhere('disease.id IN (:diseases)', {
            diseases: disease,
          });
        }

        // Filter by regions if provided
        if (region) {
          projectQuery.andWhere(
            new Brackets((qb) => {
              qb.where('region.id = :region', { region }).orWhere(
                'region.parentRegion.id = :region',
                { region },
              );
            }),
          );
        }

        // Apply date range filter if provided
        if (query.startDate) {
          projectQuery.andWhere('project.createdAt >= :startDate', {
            startDate: query.startDate,
          });
        }

        if (query.endDate) {
          projectQuery.andWhere('project.createdAt <= :endDate', {
            endDate: query.endDate,
          });
        }

        // Apply pagination
        const [projects, total] = await projectQuery
          .orderBy('project.createdAt', 'DESC')
          .skip(skip)
          .take(limit)
          .getManyAndCount();

        const data = projects.map((project) => {
          project.diseases.sort((a, b) => a.index - b.index);
          return project;
        });

        return {
          docs: data,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        };
      } else {
        // Query for users with associated permissions
        const accessibleProjectIds = [
          ...new Set(
            (userData?.roles ?? [])
              .map((userRole) => userRole.project)
              .filter((projectId): projectId is string => !!projectId),
          ),
        ];

        const projectQuery = this.projectRepository
          .createQueryBuilder('project')
          .leftJoinAndSelect('project.diseases', 'disease')
          .leftJoinAndSelect('project.regions', 'region') // Join regions
          .leftJoinAndSelect('project.surveillanceTypes', 'surveillanceType')
          .leftJoinAndSelect('project.projectAdmins', 'projectAdmin')
          .loadRelationCountAndMap('project.totalSiteCount', 'project.sites')
          // AndSelect: clients need the owning workspace to group a
          // multi-workspace user's projects - ManyToOne, so this cannot
          // fan out rows or skew the paginated count below.
          .leftJoinAndSelect('project.workspace', 'workspace')
          .andWhere('project.status = :status', { status: StatusType.ACTIVE });

        if (userScope === Scope.Workspace) {
          // Workspace-admins are not necessarily project team members, so
          // team-membership isn't the right filter for them - scope by the
          // workspace(s) they administer instead. A requested `workspaceId`
          // narrows this further, but only when it's actually one they admin.
          const scopedWorkspaceIds =
            workspaceId && memberWorkspaceIds.includes(workspaceId)
              ? [workspaceId]
              : memberWorkspaceIds;

          projectQuery.andWhere('workspace.id IN (:...workspaceIds)', {
            workspaceIds: scopedWorkspaceIds.length
              ? scopedWorkspaceIds
              : [null],
          });
        } else if (accessibleProjectIds.length) {
          projectQuery.andWhere('project.id IN (:...accessibleProjectIds)', {
            accessibleProjectIds,
          });
          // Scope to the selected workspace when one is active — mirrors the
          // workspace-admin branch above so switching workspaces in the UI
          // updates the list for team members too.
          if (workspaceId) {
            projectQuery.andWhere('workspace.id = :workspaceId', {
              workspaceId,
            });
          }
        } else {
          projectQuery.andWhere('1 = 0');
        }

        if (disease) {
          projectQuery.andWhere('disease.id IN (:diseases)', {
            diseases: disease,
          });
        }

        if (region) {
          projectQuery.andWhere('region.id IN (:regions)', { regions: region });
        }

        if (query.startDate) {
          projectQuery.andWhere('project.createdAt >= :startDate', {
            startDate: query.startDate,
          });
        }

        if (query.endDate) {
          projectQuery.andWhere('project.createdAt <= :endDate', {
            endDate: query.endDate,
          });
        }

        const [projects, total] = await projectQuery
          .orderBy('project.createdAt', 'DESC')
          .skip(skip)
          .take(limit)
          .getManyAndCount();
        const data = projects.map((project) => {
          project.diseases.sort((a, b) => a.index - b.index);
          return project;
        });
        return {
          docs: data,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        };
      }
    } catch (error) {
      console.log('Get projects error', error);
      throw error;
    }
  }

  async getMembers(projectId: string, user?: User): Promise<any[]> {
    let whereCondition = {};
    // `user` is req.user, already eager-loaded by UserService.findOne with
    // roles/roles.role/roles.role.permissions - re-fetching it here was a
    // redundant query.
    const userData = user;
    const canUserCollectSamples = checkUserPermissions(userData, {
      subject: Resource.Sample,
      action: Action.Create,
    });
    const canUserManageAll = checkUserPermissions(userData, {
      subject: Resource.All,
      action: Action.Manage,
    });

    if (canUserManageAll) {
      whereCondition = {
        projects: { id: projectId },
      };
    } else if (user.team?.id) {
      // Check if the user is an admin
      whereCondition = {
        projects: { id: projectId },
        id: user.team.id, // Only get the team of the collector-admin or collector
      };
    } else {
      // No singular team (e.g. workspace-admin, whose access comes via a
      // workspace-scoped UserRole instead of a team FK) - this route is
      // already authorized for this exact :projectId via CASL's project-
      // scoped Read check, so show every team under this project rather
      // than crashing on `.team.id` of null.
      whereCondition = {
        projects: { id: projectId },
      };
    }

    const teams = await this.teamRepository.find({
      where: whereCondition,
      relations: [
        'members',
        'members.roles',
        'members.roles.role',
        'members.roles.role.permissions',
      ], // Populate members
    });

    // `Team.members` is @OneToMany(User, user => user.team) - it is driven
    // entirely by the singular `users.teamId` FK, which teams.service.ts
    // deliberately keeps immutable ("Keep the user's primary `team` FK
    // immutable... membership is tracked through `user_roles` instead").
    // So it only ever contains the one user the team was created around -
    // typically the team lead - and every member added afterwards through
    // addTeamMember was invisible here. That is why the collector dropdown
    // listed a single name while the project clearly had several collectors.
    //
    // Resolve membership from `user_roles` instead, the same way
    // teams.service.ts#findAll does, and union it with `members` so legacy
    // users who have the FK but no matching UserRole row are still included.
    const teamIds = teams.map((team) => team.id);

    const memberRoles = teamIds.length
      ? await this.userRoleRepository.find({
          where: {
            team: In(teamIds),
            project: projectId,
            status: StatusType.ACTIVE,
          },
          relations: [
            'user',
            'user.roles',
            'user.roles.role',
            'user.roles.role.permissions',
          ],
        })
      : [];

    const candidatesById = new Map<string, User>();
    teams.forEach((team) =>
      (team.members ?? []).forEach((member) => {
        if (member) candidatesById.set(member.id, member);
      }),
    );
    // UserRole-derived members win: they carry the freshly loaded role
    // graph that the permission filter below depends on.
    memberRoles.forEach((userRole) => {
      if (userRole.user) candidatesById.set(userRole.user.id, userRole.user);
    });

    const teamMembers = Array.from(candidatesById.values()).filter((member) => {
      if (canUserCollectSamples) {
        // Only include members who have permission for create sample
        return checkUserPermissions(member, {
          subject: Resource.Sample,
          action: Action.Create,
        });
      }

      // Otherwise exclude members who has manage all access
      return !checkUserPermissions(member, {
        subject: Resource.All,
        action: Action.Manage,
      });
    });

    return teamMembers.map((member) => ({
      id: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
    }));
  }

  async findOne(query: any, user?: any): Promise<Project> {
    try {
      console.log(user);
      // const userData = await this.userRepository.findOne({
      //   where: { id: user.id },
      //   relations: ['roles', 'roles.role', 'roles.role.permissions'],
      // });
      // const userScope = getUserScope(userData);
      const whereQuery = { id: query.id };
      const project = await this.projectRepository.findOne({
        where: { ...whereQuery, status: StatusType.ACTIVE },
        relations: [
          'regions',
          'regions.parentRegion',
          'diseases',
          'surveillanceTypes',
          'projectAdmins',
          'createdBy',
          'workspace',
        ],
      });
      if (!project) {
        throw new NotFoundException(`Project with ID ${query.id} not found`);
      }

      // Sort the diseases array in-place
      if (project.diseases.length > 0) {
        project.diseases.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
      }

      return project;
    } catch (error) {
      console.error(error);
      throw new NotFoundException(`Project with ID ${query.id} not found`);
    }
  }

  async getProjectTeamUsers(
    user: User,
    projectId?: string,
    workspaceId?: string,
  ): Promise<ProjectTeamUsersResponse> {
    // `user` is req.user, already eager-loaded by UserService.findOne with
    // roles/roles.role/roles.role.permissions/roles.workspace - re-fetching
    // it here was a redundant query.
    const userData = user;
    const userScope = getUserScope(userData);
    const isSuperAdmin = userScope === Scope.System;

    // Which projects the caller may view: a super admin can see every
    // active project (optionally narrowed to one via ?projectId=). Workspace
    // admins are scoped to projects belonging to their workspace(s). Anyone
    // else is scoped to every project they hold a Project/Team-level
    // UserRole for - a user can legitimately administer/participate in
    // more than one project at once, so this is no longer limited to their
    // single legacy `user.project` FK.
    let accessibleProjectIds: string[] | undefined;
    if (isSuperAdmin) {
      if (projectId) {
        accessibleProjectIds = [projectId];
      } else if (workspaceId) {
        // Super-admin has switched to a specific workspace - scope to that
        // workspace's projects so the user list reflects the selected context.
        const wsProjects = await this.projectRepository.find({
          where: { workspace: { id: workspaceId } },
          select: ['id'],
        });
        accessibleProjectIds = wsProjects.map((p) => p.id);
      } else {
        accessibleProjectIds = undefined; // see all
      }
    } else if (userScope === Scope.Workspace) {
      // Workspace admins hold no project-scoped UserRoles - their access
      // is workspace-scoped. Fetch the projects that belong to the
      // workspace(s) they administer, but narrow to a specific workspace
      // when the caller has explicitly selected one (workspaceId param).
      // Membership, not adminship (any role tied to the workspace) - fine
      // for scoping this read, same caveat as findAll()'s memberWorkspaceIds.
      const memberWorkspaceIds = (userData?.roles ?? [])
        .map((ur) => ur.workspace?.id)
        .filter((id): id is string => !!id);

      const scopedWorkspaceIds =
        workspaceId && memberWorkspaceIds.includes(workspaceId)
          ? [workspaceId]
          : memberWorkspaceIds;

      const workspaceProjects = scopedWorkspaceIds.length
        ? await this.projectRepository.find({
            where: { workspace: { id: In(scopedWorkspaceIds) } },
            select: ['id'],
          })
        : [];

      const wsProjectIds = workspaceProjects.map((p) => p.id);
      accessibleProjectIds =
        projectId && wsProjectIds.includes(projectId)
          ? [projectId]
          : wsProjectIds;
    } else {
      const ownedProjectIds: string[] = [];
      (userData?.roles ?? []).forEach((userRole) => {
        if (userRole.project && !ownedProjectIds.includes(userRole.project)) {
          ownedProjectIds.push(userRole.project);
        }
      });

      // If a workspaceId was requested, narrow to only owned projects that
      // belong to that workspace — matches the same scoping applied to
      // findAll() for team members.
      let filteredProjectIds = ownedProjectIds;
      if (workspaceId && ownedProjectIds.length) {
        const wsProjects = await this.projectRepository.find({
          where: { id: In(ownedProjectIds), workspace: { id: workspaceId } },
          select: ['id'],
        });
        filteredProjectIds = wsProjects.map((p) => p.id);
      }

      accessibleProjectIds =
        projectId && filteredProjectIds.includes(projectId)
          ? [projectId]
          : filteredProjectIds;
    }

    const projectWhere: any = { status: StatusType.ACTIVE };
    if (accessibleProjectIds) projectWhere.id = In(accessibleProjectIds);

    const projects =
      accessibleProjectIds && !accessibleProjectIds.length
        ? []
        : await this.projectRepository.find({
            where: projectWhere,
            relations: ['teams'],
            order: { name: 'ASC' },
          });

    const canEditRole =
      isSuperAdmin ||
      userScope === Scope.Workspace ||
      (userData?.roles?.some(
        (userRole) =>
          userRole.role?.name === RoleType.PROJECT_ADMIN &&
          (!projectId || userRole.project === projectId),
      ) ??
        false);

    if (!projects.length) {
      return { users: [], canEditRole };
    }

    const projectIds = projects.map((project) => project.id);
    const projectMap = new Map<string, Project>();
    projects.forEach((project) => projectMap.set(project.id, project));
    const teamMap = new Map<string, Team>();
    projects.forEach((project) =>
      project.teams?.forEach((team) => teamMap.set(team.id, team)),
    );

    // Every Project/Team-scoped UserRole against a visible project is a
    // distinct membership - a user can hold several of these at once (one
    // per project/team they belong to), and each is rendered as its own
    // row so the same person can show up under multiple projects with
    // different roles simultaneously.
    const userRoles = await this.userRoleRepository.find({
      where: { project: In(projectIds), status: StatusType.ACTIVE },
      relations: ['user', 'role'],
    });

    const rows = new Map<string, ProjectTeamUserListItem>();

    userRoles.forEach((userRole) => {
      if (!userRole.user || !userRole.project) return;
      const project = projectMap.get(userRole.project);
      if (!project) return;
      const team = userRole.team ? teamMap.get(userRole.team) : undefined;
      const key = `${userRole.project}:${userRole.team ?? 'none'}:${userRole.user.id}`;

      rows.set(key, {
        id: userRole.user.id,
        firstName: userRole.user.firstName,
        lastName: userRole.user.lastName,
        email: userRole.user.email,
        contactNumber: userRole.user.contactNumber,
        role: userRole.role
          ? {
              id: userRole.role.id,
              name: userRole.role.name,
              scope: userRole.role.scope,
            }
          : null,
        team: team ? { id: team.id, teamName: team.teamName } : null,
        project: { id: project.id, name: project.name },
      });
    });

    return {
      users: Array.from(rows.values()),
      canEditRole,
    };
  }

  async updateProjectTeamUserRole(
    currentUser: User,
    memberId: string,
    body: { roleId: string; projectId: string; teamId: string },
  ): Promise<ProjectTeamUserListItem> {
    // `currentUser` is req.user, already eager-loaded by UserService.findOne
    // with roles/roles.role/roles.role.permissions/roles.workspace -
    // re-fetching it here was a redundant query.
    const currentUserData = currentUser;
    const isSuperAdmin = getUserScope(currentUserData) === Scope.System;
    const isProjectAdmin = currentUserData?.roles?.some(
      (userRole) =>
        userRole.role?.name === RoleType.PROJECT_ADMIN &&
        userRole.project === body.projectId,
    );

    const role = await this.roleRepository.findOne({
      where: { id: body.roleId },
    });

    if (!role || role.name === RoleType.SUPER_ADMIN) {
      throw new BadRequestException('Invalid role selected');
    }

    const project = await this.projectRepository.findOne({
      where: { id: body.projectId },
      relations: ['workspace'],
    });

    const administersWorkspace = this.tenantScopeService.administersWorkspace(
      currentUserData,
      project?.workspace?.id,
    );

    if (!isSuperAdmin && !isProjectAdmin && !administersWorkspace) {
      throw new ForbiddenException('You are not allowed to edit user roles');
    }

    const team = await this.teamRepository.findOne({
      where: { id: body.teamId, projects: { id: body.projectId } },
      relations: ['members'],
    });
    const member = await this.userRepository.findOne({
      where: { id: memberId },
      relations: ['roles', 'roles.role'],
    });

    if (!project || !team || !member) {
      throw new NotFoundException('Project, team, or user not found');
    }

    // team.members is derived from the user's singular `user.team` FK, so
    // it only ever reflects one "primary" team and misses a user's other,
    // simultaneously-held project/team memberships. Also accept any
    // existing UserRole scoped to this project as proof of membership,
    // since that's how a user's non-primary memberships are represented.
    const isTeamMember =
      team.members?.some((item) => item.id === memberId) ||
      (member.roles?.some((userRole) => userRole.project === body.projectId) ??
        false);
    if (!isTeamMember) {
      throw new BadRequestException('User is not part of this team');
    }

    let userRole = await this.userRoleRepository.findOne({
      where: {
        user: { id: memberId },
        project: body.projectId,
        team: body.teamId,
      },
      relations: ['role', 'user'],
    });

    if (!userRole) {
      userRole = this.userRoleRepository.create({
        user: member,
        project: body.projectId,
        team: body.teamId,
        role,
      });
    } else {
      userRole.role = role;
    }

    await this.userRoleRepository.save(userRole);
    await this.cacheService.delByPrefix(USER_AUTH_CACHE_PREFIX);

    return {
      id: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      contactNumber: member.contactNumber,
      role: {
        id: role.id,
        name: role.name,
        scope: role.scope,
      },
      team: {
        id: team.id,
        teamName: team.teamName,
      },
      project: {
        id: project.id,
        name: project.name,
      },
    };
  }

  async getProjectDetails(
    projectIds: string[],
    user?: User,
  ): Promise<ProjectDetailsRecord[]> {
    // Was: `user.projects` (a ManyToMany to Project.projectAdmins - only
    // catches project-admins, not general team membership) plus the legacy
    // singular `user.team` FK. Neither represents the `user_roles`-based
    // multi-tenancy model, so a workspace-admin (access via a
    // workspace-scoped UserRole, no project/team FK at all) or anyone with
    // more than one project membership was wrongly denied every project.
    // Resolve from `user_roles` instead, via TenantScopeService (memoised
    // per request, and `user` is req.user - already eager-loaded with every
    // relation this needs, so no re-fetch here).
    const disallowed: string[] = [];
    for (const id of projectIds) {
      if (!(await this.tenantScopeService.canReachProject(user, id))) {
        disallowed.push(id);
      }
    }
    if (disallowed.length) {
      throw new ForbiddenException(
        `Not authorized for project ID(s): ${disallowed.join(', ')}`,
      );
    }

    const projects = await this.projectRepository.find({
      where: { id: In(projectIds), status: StatusType.ACTIVE },
      select: ['id'],
    });

    if (!projects.length) {
      throw new NotFoundException('No matching projects found');
    }

    const existingIds = new Set(projects.map((project) => project.id));
    const missingIds = projectIds.filter((id) => !existingIds.has(id));
    if (missingIds.length) {
      throw new NotFoundException(
        `Project ID(s) not found: ${missingIds.join(', ')}`,
      );
    }

    const samples = await this.sampleRepository.find({
      where: {
        project: { id: In(projectIds) },
        status: StatusType.ACTIVE,
      },
      relations: [
        'project',
        'site',
        'site.location',
        'site.location.region',
        'site.location.region.parentRegion',
        'site.location.region.parentRegion.parentRegion',
        'visit',
        'diseases',
        'sampleType',
        'labTests',
        'labTests.disease',
        'species',
        'animalMetadata',
        'animalMetadata.species',
      ],
    });

    const siteIds = [
      ...new Set(samples.map((sample) => sample.site?.id).filter(Boolean)),
    ] as string[];
    const visitRounds = siteIds.length
      ? await computeVisitRoundsForSites(this.visitRepository, siteIds)
      : new Map<string, number>();

    const records: ProjectDetailsRecord[] = [];

    samples.forEach((sample) => {
      const site = sample.site;
      const location = site?.location;
      const region = location?.region;
      const coordinates = location?.coordinates?.coordinates;
      const [lng, lat] = Array.isArray(coordinates)
        ? coordinates
        : [null, null];
      const { state, district } = resolveRegionHierarchy(region);
      const diseases = (sample.diseases || [])
        .slice()
        .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
        .map((disease) => disease.name)
        .join(', ');

      const visit = sample.visit;
      const animalMetadata = sample.animalMetadata;
      const diseaseHistory = animalMetadata?.diseaseHistory?.length
        ? animalMetadata.diseaseHistory.join(', ')
        : null;

      const baseRecord: ProjectDetailsRecord = {
        projectId: sample.project?.id,
        siteId: site?.id ?? null,
        siteName: site?.name ?? null,
        regionId: region?.id ?? null,
        regionName: region?.name ?? null,
        lat,
        lng,
        farmType: site?.farmType ?? null,
        siteType: site?.siteType ?? null,
        address: site?.address ?? null,
        visitId: visit?.id ?? null,
        visitStatus: visit?.visitStatus ?? null,
        diseases,
        sampleId: sample.id,
        barcode: sample.barcode,
        sampleName: sample.sampleType?.name ?? null,
        quantity: sample.quantity ?? null,
        unit: sample.unit ?? null,
        conc: sample.conc ?? null,
        labTestId: null,
        ctValue: null,
        variant: null,
        kitOrProtocol: null,
        testResult: null,
        diseaseName: null,
        projectName: sample.project?.name ?? null,
        block: site?.block ?? null,
        village: site?.village ?? null,
        siteSubType: site?.siteSubType ?? null,
        state,
        district,
        visitScheduledAt: toIsoString(visit?.visitScheduledAt),
        visitedAt: toIsoString(visit?.visitedAt),
        round: visit?.id ? (visitRounds.get(visit.id) ?? null) : null,
        diseaseQuestionnaireData: visit?.diseaseQuestionnaireData
          ? JSON.stringify(visit.diseaseQuestionnaireData)
          : null,
        environmentalQuestionnaireData: visit?.environmentalQuestionnaireData
          ? JSON.stringify(visit.environmentalQuestionnaireData)
          : null,
        collectedAt: toIsoString(sample.collectedAt),
        sampleStatus: sample.sampleStatus ?? null,
        rejectReason: sample.rejectReason ?? null,
        sampleSpecies: sample.species?.name ?? null,
        animalTagId: animalMetadata?.animalTagId ?? null,
        birdId: animalMetadata?.birdId ?? null,
        animalSpecies: animalMetadata?.species?.name ?? null,
        breed: animalMetadata?.breed ?? null,
        ageYears: animalMetadata?.ageYears ?? null,
        ageMonths: animalMetadata?.ageMonths ?? null,
        gender: animalMetadata?.gender ?? null,
        vaccinationStage: animalMetadata?.vaccinationStage ?? null,
        diseaseHistory,
        feverObserved: animalMetadata?.feverObserved ?? null,
        dropInFeedIntake: animalMetadata?.dropInFeedIntake ?? null,
        dropInWaterIntake: animalMetadata?.dropInWaterIntake ?? null,
        dropInEggProduction: animalMetadata?.dropInEggProduction ?? null,
        avgMilkProductionPerDayWithinOneYear:
          animalMetadata?.averageMilkProductionPerDayWithinOneYear ?? null,
        avgMilkProductionPerDayBeforeOneYear:
          animalMetadata?.averageMilkProductionPerDayBeforeOneYear ?? null,
        viralLoad: null,
        resultDate: null,
        testedAt: null,
      };

      const labTests = (sample.labTests || []).filter(
        (labTest) => labTest.status === StatusType.ACTIVE,
      );

      if (!labTests.length) {
        records.push(baseRecord);
        return;
      }

      labTests.forEach((labTest) => {
        records.push({
          ...baseRecord,
          labTestId: labTest.id,
          ctValue: labTest.ctValue ?? null,
          variant: labTest.variant ?? null,
          kitOrProtocol: labTest.kitOrProtocol ?? null,
          testResult: labTest.testResult ?? null,
          diseaseName: labTest.disease?.name ?? null,
          viralLoad: labTest.viralLoad ?? null,
          resultDate: toIsoString(labTest.resultDate),
          testedAt: toIsoString(labTest.testedAt),
        });
      });
    });

    return records;
  }

  generateProjectDetailsCsv(records: ProjectDetailsRecord[]): string {
    const fields = [
      'projectId',
      'siteId',
      'siteName',
      'regionId',
      'regionName',
      'lat',
      'lng',
      'farmType',
      'siteType',
      'address',
      'visitId',
      'visitStatus',
      'diseases',
      'sampleId',
      'barcode',
      'sampleName',
      'quantity',
      'unit',
      'conc',
      'labTestId',
      'ctValue',
      'variant',
      'kitOrProtocol',
      'testResult',
      'diseaseName',
      'projectName',
      'block',
      'village',
      'siteSubType',
      'state',
      'district',
      'visitScheduledAt',
      'visitedAt',
      'round',
      'diseaseQuestionnaireData',
      'environmentalQuestionnaireData',
      'collectedAt',
      'sampleStatus',
      'rejectReason',
      'sampleSpecies',
      'animalTagId',
      'birdId',
      'animalSpecies',
      'breed',
      'ageYears',
      'ageMonths',
      'gender',
      'vaccinationStage',
      'diseaseHistory',
      'feverObserved',
      'dropInFeedIntake',
      'dropInWaterIntake',
      'dropInEggProduction',
      'avgMilkProductionPerDayWithinOneYear',
      'avgMilkProductionPerDayBeforeOneYear',
      'viralLoad',
      'resultDate',
      'testedAt',
    ];
    const parser = new Parser({ fields });
    return parser.parse(records);
  }

  async create(
    createProjectDto: CreateProjectDto,
  ): Promise<ProjectResponseData> {
    try {
      const result = await this.dataSource.transaction(async (manager) => {
        const projectRepository = manager.getRepository(Project);
        const regionRepository = manager.getRepository(Region);
        const surveillanceTypeRepository =
          manager.getRepository(SurveillanceType);
        const diseaseRepository = manager.getRepository(Disease);
        const userRepository = manager.getRepository(User);
        const otpRepository = manager.getRepository(Otp);
        const teamRepository = manager.getRepository(Team);
        const roleRepository = manager.getRepository(Role);
        const userRoleRepository = manager.getRepository(UserRole);

        const isCodeExist = await projectRepository.findOne({
          where: { code: createProjectDto.code },
        });
        if (isCodeExist) {
          throw new BadRequestException({
            success: false,
            statusCode: 400,
            message: 'Project with code already exist',
            timestamp: new Date().toISOString(),
          });
        }

        if (createProjectDto?.diseases?.length) {
          const diseases = await diseaseRepository.findBy({
            id: In(createProjectDto.diseases),
          });
          if (diseases.length === 0) {
            throw new BadRequestException({
              success: false,
              statusCode: 400,
              message: 'Disease not found',
              timestamp: new Date().toISOString(),
            });
          }
        }

        if (createProjectDto?.surveillanceTypes?.length) {
          const surveillanceTypes = await surveillanceTypeRepository.findBy({
            id: In(createProjectDto.surveillanceTypes),
          });
          if (surveillanceTypes.length === 0) {
            throw new BadRequestException({
              success: false,
              statusCode: 400,
              message: 'Surveillance type not found',
              timestamp: new Date().toISOString(),
            });
          }
        }

        if (createProjectDto?.regions?.length) {
          const regions = await regionRepository.findBy({
            id: In(createProjectDto.regions),
          });
          if (regions.length === 0) {
            throw new BadRequestException({
              success: false,
              statusCode: 400,
              message: 'Regions not found',
              timestamp: new Date().toISOString(),
            });
          }
        }

        const createdBy = await userRepository.findOne({
          where: { id: createProjectDto.invitedBy.id },
        });

        const projectAdmins = createProjectDto.teams.filter(
          (team) => team.isProjectViewer,
        );

        for (const team of createProjectDto.teams) {
          const existingUser = await userRepository.findOne({
            where: [
              { email: ILike(team.email) },
              { contactNumber: team.contactNumber },
            ],
            relations: [
              'roles',
              'roles.role',
              'roles.role.permissions',
              'project',
            ],
          });

          if (existingUser && getUserScope(existingUser) === Scope.System) {
            throw new BadRequestException({
              success: false,
              statusCode: 400,
              message: 'Super admin cannot be project viewer',
              timestamp: new Date().toISOString(),
            });
          }
        }

        const { workspaceId, ...projectFields } = createProjectDto;
        delete (projectFields as { teams?: unknown }).teams;

        if (!workspaceId) {
          throw new BadRequestException({
            success: false,
            statusCode: 400,
            message: 'workspaceId is required',
            timestamp: new Date().toISOString(),
          });
        }

        const workspaceRepository = manager.getRepository(Workspace);
        const workspace = await workspaceRepository.findOne({
          where: { id: workspaceId },
        });
        if (!workspace) {
          throw new BadRequestException({
            success: false,
            statusCode: 400,
            message: 'Workspace not found',
            timestamp: new Date().toISOString(),
          });
        }

        const callerScope = getUserScope(createProjectDto.invitedBy);
        const administersWorkspace =
          this.tenantScopeService.administersWorkspace(
            createProjectDto.invitedBy,
            workspaceId,
          );
        if (callerScope !== Scope.System && !administersWorkspace) {
          throw new ForbiddenException('You do not administer this workspace');
        }

        const trimmedName = createProjectDto.name?.trim();
        if (!trimmedName) {
          throw new BadRequestException({
            success: false,
            statusCode: 400,
            message: 'Project name is required',
            timestamp: new Date().toISOString(),
          });
        }

        const isNameExist = await projectRepository
          .createQueryBuilder('project')
          .where('project.workspace_id = :workspaceId', { workspaceId })
          .andWhere('project.name ILIKE :name', { name: trimmedName })
          .getOne();

        if (isNameExist) {
          throw new BadRequestException({
            success: false,
            statusCode: 400,
            message: `Project with name "${trimmedName}" already exists in this workspace`,
            timestamp: new Date().toISOString(),
          });
        }

        projectFields.name = trimmedName;

        let project = projectRepository.create({
          ...projectFields,
          name: trimmedName,
          createdBy,
          updatedBy: createdBy,
          regions: createProjectDto.regions?.map((id) => ({ id })),
          diseases: createProjectDto.diseases?.map((id) => ({ id })),
          surveillanceTypes: createProjectDto.surveillanceTypes?.map((id) => ({
            id,
          })),
          projectAdmins: createProjectDto.projectAdmins?.map((id) => ({ id })),
        });

        project.workspace = workspace;

        project.regions = createProjectDto.regions
          ? await regionRepository.findBy({ id: In(createProjectDto.regions) })
          : [];
        project.diseases = createProjectDto.diseases
          ? await diseaseRepository.findBy({
              id: In(createProjectDto.diseases),
            })
          : [];
        project.surveillanceTypes = createProjectDto.surveillanceTypes
          ? await surveillanceTypeRepository.findBy({
              id: In(createProjectDto.surveillanceTypes),
            })
          : [];
        project.projectAdmins = createProjectDto.projectAdmins
          ? await userRepository.findBy({
              id: In(createProjectDto.projectAdmins),
            })
          : [];

        project = await projectRepository.save(project);
        project.projectAdmins ??= [];
        project.members ??= [];

        const teamAdminRole = await roleRepository.findOne({
          where: { name: RoleType.TEAM_ADMIN },
        });
        if (!teamAdminRole) {
          throw new NotFoundException('Team admin role not found');
        }

        const teams: Team[] = [];
        for (const teamDto of createProjectDto.teams ?? []) {
          const team = await teamRepository.save(
            teamRepository.create({
              email: teamDto.email,
              teamName: teamDto.teamName,
              isProjectViewer: teamDto.isProjectViewer,
              projects: [project],
            }),
          );

          // Match on either identifier, the same way teams.service.ts does.
          // Email-only lookup here meant a team lead identified by a phone
          // number that already belongs to someone got a second, nameless
          // account instead of being recognised - and the web form, which
          // checks both, would have already told the admin they were adding
          // an existing person.
          const teamLeadWhere: Array<Record<string, unknown>> = [];
          if (teamDto.email) {
            teamLeadWhere.push({ email: ILike(teamDto.email) });
          }
          if (teamDto.contactNumber) {
            teamLeadWhere.push({ contactNumber: teamDto.contactNumber });
          }

          let user = teamLeadWhere.length
            ? await userRepository.findOne({ where: teamLeadWhere })
            : null;

          if (!user) {
            user = userRepository.create({
              firstName: teamDto.firstName,
              lastName: teamDto.lastName,
              email: teamDto.email,
              contactNumber: teamDto.contactNumber,
              project,
              team,
            });
            user = await userRepository.save(user);
            await otpRepository.save({
              id: user.id,
              otp: generateOtp(),
            } as any);
          }

          const workspaceRelation = workspaceId
            ? ({ id: workspaceId } as Workspace)
            : null;
          const existingUserRole = await userRoleRepository.findOne({
            where: {
              user: { id: user.id },
              project: project.id,
              team: team.id,
            },
          });
          if (!existingUserRole) {
            await userRoleRepository.save(
              userRoleRepository.create({
                user,
                role: teamAdminRole,
                project: project.id,
                team: team.id,
                workspace: workspaceRelation,
              }),
            );
          }

          if (projectAdmins.some((admin) => admin.email === user.email)) {
            project.projectAdmins.push(user);
          }

          teams.push(await teamRepository.save(team));
        }

        project.teams = teams;
        return projectRepository.save(project);
      });
      await this.cacheService.delByPrefix(USER_AUTH_CACHE_PREFIX);
      return result;
    } catch (error) {
      console.log('Create project error:', error);
      throw error;
    }
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const projectExists = await this.projectRepository.findOne({
      where: { id },
      relations: ['workspace'],
    });
    if (!projectExists) {
      throw new BadRequestException({
        success: false,
        statusCode: 400,
        message: `The project with id ${id} is not found.`,
        timestamp: new Date().toISOString(),
      });
    }

    if (updateProjectDto.name !== undefined) {
      const trimmedName = updateProjectDto.name?.trim();
      if (!trimmedName) {
        throw new BadRequestException({
          success: false,
          statusCode: 400,
          message: 'Project name cannot be empty',
          timestamp: new Date().toISOString(),
        });
      }

      const workspaceId =
        projectExists.workspaceId ?? projectExists.workspace?.id;

      const duplicateQuery = this.projectRepository
        .createQueryBuilder('project')
        .where('project.id != :id', { id })
        .andWhere('project.name ILIKE :name', { name: trimmedName });

      if (workspaceId) {
        duplicateQuery.andWhere('project.workspace_id = :workspaceId', {
          workspaceId,
        });
      } else {
        duplicateQuery.andWhere('project.workspace_id IS NULL');
      }

      const duplicateProject = await duplicateQuery.getOne();
      if (duplicateProject) {
        throw new BadRequestException({
          success: false,
          statusCode: 400,
          message: `Project with name "${trimmedName}" already exists in this workspace`,
          timestamp: new Date().toISOString(),
        });
      }

      updateProjectDto.name = trimmedName;
    }

    const project = await this.projectRepository.preload({
      id: id,
      ...updateProjectDto,
      regions: updateProjectDto.regions?.map((id) => ({ id })),
      diseases: updateProjectDto.diseases?.map((id) => ({ id })),
      surveillanceTypes: updateProjectDto.surveillanceTypes?.map((id) => ({
        id,
      })),
      projectAdmins: updateProjectDto.projectAdmins?.map((id) => ({ id })),
    });

    if (updateProjectDto.regions) {
      // Find the regions by their ids
      const regionIds = [...new Set(updateProjectDto.regions)];
      const regions = await this.regionRepository.findBy({
        id: In(regionIds),
      });
      if (regions.length !== regionIds.length) {
        throw new BadRequestException('One or more regions are invalid.');
      }
      project.regions = regions;
    }

    if (updateProjectDto.diseases) {
      // Find the diseases by their ids
      const diseaseIds = [...new Set(updateProjectDto.diseases)];
      const diseases = await this.diseaseRepository.findBy({
        id: In(diseaseIds),
      });
      if (diseases.length !== diseaseIds.length) {
        throw new BadRequestException('One or more diseases are invalid.');
      }
      project.diseases = diseases;
    }

    if (updateProjectDto.surveillanceTypes) {
      // Find the surveillanceTypes by their ids
      const surveillanceTypeIds = [
        ...new Set(updateProjectDto.surveillanceTypes),
      ];
      const surveillanceTypes = await this.surveillanceTypeRepository.findBy({
        id: In(surveillanceTypeIds),
      });
      if (surveillanceTypes.length !== surveillanceTypeIds.length) {
        throw new BadRequestException(
          'One or more surveillance types are invalid.',
        );
      }
      project.surveillanceTypes = surveillanceTypes;
    }

    const user = await this.userRepository.findOne({
      where: { id: updateProjectDto.user },
    });
    project.updatedBy = user;
    await this.projectRepository.save(project);

    return this.findOne({ id });
  }

  async remove(id: string): Promise<Project> {
    // `findOne(query)` expects an object and reads `query.id`; called with a
    // bare string that read as `undefined`, TypeORM drops the predicate from
    // `where: { id: undefined, status: ACTIVE }` and this would delete
    // whichever active project the DB happened to return first — an
    // arbitrary project, not the requested one. Look the project up by the
    // string id directly instead of routing through `findOne`.
    if (!id) {
      throw new BadRequestException({
        success: false,
        statusCode: 400,
        message: 'Project id is required',
        timestamp: new Date().toISOString(),
      });
    }
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return this.projectRepository.remove(project);
  }

  async projectStatistics(user, workspaceId?: string): Promise<any> {
    // `user` is req.user, already eager-loaded by UserService.findOne with
    // roles/roles.role/roles.role.permissions/roles.workspace - re-fetching
    // it here was a redundant query.
    const userData = user;
    const userScope = getUserScope(userData);
    const isSuperAdmin = userScope === Scope.System;
    // Workspace-admins should see stats for the workspace(s) they
    // administer (narrowed to the requested workspaceId when it's one of
    // theirs), not just projects they personally created - mirrors the
    // same fix applied to findAll(). Membership, not adminship (any role
    // tied to the workspace) - fine for scoping this read, same caveat as
    // findAll()'s memberWorkspaceIds.
    const memberWorkspaceIds = (userData?.roles ?? [])
      .map((userRole) => userRole.workspace?.id)
      .filter((id): id is string => !!id);
    const scopedWorkspaceIds =
      userScope === Scope.Workspace
        ? workspaceId && memberWorkspaceIds.includes(workspaceId)
          ? [workspaceId]
          : memberWorkspaceIds
        : [];

    // Total projects (all projects for super-admin, only created projects for others)
    let totalProjectsWhere: any = {};
    if (isSuperAdmin) {
      totalProjectsWhere = workspaceId
        ? { workspace: { id: workspaceId } }
        : {};
    } else if (userScope === Scope.Workspace) {
      totalProjectsWhere = {
        workspace: {
          id: In(scopedWorkspaceIds.length ? scopedWorkspaceIds : [null]),
        },
      };
    } else {
      // Regular users (team-admin, team-member, etc.) - scope by team membership.
      // Optionally narrow to a specific workspace when the UI switcher is active.
      const memberRoles = await this.userRoleRepository.find({
        where: { user: { id: user.id } },
        select: ['project'],
      });
      const memberProjectIds = [
        ...new Set(
          memberRoles.map((r) => r.project).filter((p): p is string => !!p),
        ),
      ];
      if (memberProjectIds.length && workspaceId) {
        const wsProjects = await this.projectRepository.find({
          where: { id: In(memberProjectIds), workspace: { id: workspaceId } },
          select: ['id'],
        });
        const wsProjectIds = wsProjects.map((p) => p.id);
        totalProjectsWhere = wsProjectIds.length
          ? { id: In(wsProjectIds) }
          : { id: In([null]) };
      } else if (memberProjectIds.length) {
        totalProjectsWhere = { id: In(memberProjectIds) };
      } else {
        totalProjectsWhere = { id: In([null]) };
      }
    }
    const totalProjects = await this.projectRepository.count({
      where: totalProjectsWhere,
    });

    // Total unique regions across projects
    const totalProjectLocationsQuery = this.projectRepository
      .createQueryBuilder('project')
      .leftJoin('project.regions', 'region')
      .select('COUNT(DISTINCT region.id)', 'count');

    if (isSuperAdmin) {
      if (workspaceId) {
        totalProjectLocationsQuery
          .leftJoin('project.workspace', 'workspace')
          .andWhere('workspace.id = :workspaceId', { workspaceId });
      }
    } else if (userScope === Scope.Workspace) {
      totalProjectLocationsQuery
        .leftJoin('project.workspace', 'workspace')
        .andWhere('workspace.id IN (:...workspaceIds)', {
          workspaceIds: scopedWorkspaceIds.length ? scopedWorkspaceIds : [null],
        });
    } else {
      // team members - filter by their project membership (workspace-scoped when active)
      const memberRoles2 = await this.userRoleRepository.find({
        where: { user: { id: user.id } },
        select: ['project'],
      });
      let memberProjectIds2 = [
        ...new Set(
          memberRoles2.map((r) => r.project).filter((p): p is string => !!p),
        ),
      ];
      if (memberProjectIds2.length && workspaceId) {
        const wsProjects = await this.projectRepository.find({
          where: { id: In(memberProjectIds2), workspace: { id: workspaceId } },
          select: ['id'],
        });
        memberProjectIds2 = wsProjects.map((p) => p.id);
      }
      if (memberProjectIds2.length) {
        totalProjectLocationsQuery.andWhere('project.id IN (:...projectIds)', {
          projectIds: memberProjectIds2,
        });
      } else {
        totalProjectLocationsQuery.andWhere('1=0');
      }
    }

    const totalProjectLocations = await totalProjectLocationsQuery.getRawOne();

    // Optimized disease-level breakdown using a single aggregated query
    const diseaseAnalyticsQuery = this.projectRepository
      .createQueryBuilder('project')
      .leftJoin('project.diseases', 'disease')
      .leftJoin('project.regions', 'region')
      .select('disease.id', 'id')
      .addSelect('disease.name', 'name')
      .addSelect('disease.shortName', 'shortName')
      .addSelect('disease.index', 'index')
      .addSelect('COUNT(DISTINCT project.id)', 'totalProjects')
      .addSelect('COUNT(DISTINCT region.id)', 'totalProjectLocations')
      .groupBy('disease.id')
      .addGroupBy('disease.name')
      .addGroupBy('disease.shortName')
      .addGroupBy('disease.index');

    if (isSuperAdmin) {
      if (workspaceId) {
        diseaseAnalyticsQuery
          .leftJoin('project.workspace', 'workspace')
          .andWhere('workspace.id = :workspaceId', { workspaceId });
      }
    } else if (userScope === Scope.Workspace) {
      diseaseAnalyticsQuery
        .leftJoin('project.workspace', 'workspace')
        .andWhere('workspace.id IN (:...workspaceIds)', {
          workspaceIds: scopedWorkspaceIds.length ? scopedWorkspaceIds : [null],
        });
    } else {
      // team members - filter by their project membership (workspace-scoped when active)
      const memberRoles3 = await this.userRoleRepository.find({
        where: { user: { id: user.id } },
        select: ['project'],
      });
      let memberProjectIds3 = [
        ...new Set(
          memberRoles3.map((r) => r.project).filter((p): p is string => !!p),
        ),
      ];
      if (memberProjectIds3.length && workspaceId) {
        const wsProjects = await this.projectRepository.find({
          where: { id: In(memberProjectIds3), workspace: { id: workspaceId } },
          select: ['id'],
        });
        memberProjectIds3 = wsProjects.map((p) => p.id);
      }
      if (memberProjectIds3.length) {
        diseaseAnalyticsQuery.andWhere('project.id IN (:...projectIds)', {
          projectIds: memberProjectIds3,
        });
      } else {
        diseaseAnalyticsQuery.andWhere('1=0');
      }
    }

    const diseaseAnalyticsRaw = await diseaseAnalyticsQuery.getRawMany();

    // Final response
    return [
      {
        totalProjects,
        totalProjectLocations: Number(totalProjectLocations?.count ?? 0),
      },
      ...diseaseAnalyticsRaw
        .sort((a, b) => a.index - b.index) // Sort by index
        .map((item) => ({
          disease: {
            id: item.id,
            name: item.name,
            shortName: item.shortName,
            index: item.index,
          },
          totalProjects: Number(item.totalProjects),
          totalProjectLocations: Number(item.totalProjectLocations),
        })),
    ];
  }

  /**
   * Get disease site counts for a project
   */
  async getDiseaseSiteCounts(projectId: string): Promise<any> {
    // First, get all sites for the project
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['sites', 'diseases'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Get all site IDs for this project
    const siteIds = project.sites.map((site) => site.id);

    // If no sites, return empty result
    if (siteIds.length === 0) {
      return [
        {
          id: '',
          diseaseName: 'Total Positive Sites',
          diseaseSName: '',
          siteCount: 0,
        },
      ];
    }

    // Query to get disease data with site counts using TypeORM column names
    // This query uses a window function to deduplicate sites across diseases
    const query = `
    WITH distinct_positive_sites AS (
      SELECT DISTINCT ON (d.id, s.id)
        d.id AS "diseaseId",
        d.name AS "diseaseName",
        d."shortName" AS "diseaseSName",
        d."index" AS "diseaseIndex",
        s.id AS "siteId",
        CASE 
          WHEN COUNT(DISTINCT CASE 
            WHEN lt."testResult" = $3 THEN lt.id 
            ELSE NULL 
          END) > 0 
          THEN 1 
          ELSE 0 
        END AS "isPositive"
      FROM 
        diseases d
      JOIN 
        lab_tests lt ON lt."diseaseId" = d.id
      JOIN 
        samples smp ON lt."sampleId" = smp.id
      JOIN 
        sites s ON smp."siteId" = s.id
      WHERE 
        lt."projectId" = $1
        AND s.id = ANY($2)
      GROUP BY 
        d.id, d.name, d."shortName", s.id
    )
    SELECT 
      "diseaseId",
      "diseaseName",
      "diseaseSName",
      "diseaseIndex",
      COUNT(DISTINCT "siteId") AS "totalCount",
      SUM("isPositive") AS "positiveCount"
    FROM 
      distinct_positive_sites
    GROUP BY 
      "diseaseId", "diseaseName", "diseaseSName", "diseaseIndex"
    ORDER BY 
      "diseaseName"
  `;

    try {
      const siteTestCounts = await this.labTestRepository.query(query, [
        projectId,
        siteIds,
        TestResultType.POSITIVE,
      ]);

      // Calculate unique positive sites across all diseases
      // We need to query this separately to avoid double-counting
      const uniquePositiveSitesQuery = `
      WITH positive_sites AS (
        SELECT DISTINCT s.id AS "siteId"
        FROM sites s
        JOIN samples smp ON s.id = smp."siteId"
        JOIN lab_tests lt ON smp.id = lt."sampleId"
        WHERE 
          lt."projectId" = $1
          AND s.id = ANY($2)
          AND lt."testResult" = $3
      )
      SELECT COUNT(*) AS "totalPositiveSites" FROM positive_sites
    `;

      const uniquePositiveSitesResult = await this.labTestRepository.query(
        uniquePositiveSitesQuery,
        [projectId, siteIds, TestResultType.POSITIVE],
      );
      const totalPositiveSiteCount = Number(
        uniquePositiveSitesResult[0]?.totalPositiveSites || 0,
      );

      const finalResults = siteTestCounts.map((item) => {
        return {
          id: item.diseaseId,
          diseaseName: item.diseaseName,
          diseaseSName: item.diseaseSName,
          diseaseIndex: item.diseaseIndex,
          siteCount: Number(item.positiveCount) || 0,
          total: Number(item.totalCount) || 0,
        };
      });

      return [
        {
          id: '',
          diseaseName: 'Total Positive Sites',
          diseaseSName: '',
          diseaseIndex: 0,
          siteCount: totalPositiveSiteCount,
        },
        ...finalResults,
      ];
    } catch (error) {
      console.error('Error in getDiseaseSiteCounts:', error);
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to get disease site counts: ${message}`);
    }
  }

  /**
   * Get site statistics by status
   */
  async getSitesStatisticsByStatus(
    projectId: string,
    diseaseId?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<{
    total: number;
    pending: number;
    positive: number;
    negative: number;
  }> {
    const query = this.siteRepository
      .createQueryBuilder('site')
      .select(
        diseaseId
          ? `
          COUNT(DISTINCT CASE
            WHEN EXISTS (
              SELECT 1 FROM samples s
              WHERE s."siteId" = site.id
            )
            OR NOT EXISTS (
              SELECT 1 FROM samples s
              INNER JOIN samples_diseases_diseases sd ON sd."samplesId" = s.id
              WHERE s."siteId" = site.id
            )
            THEN site.id ELSE NULL
          END)
        `
          : 'COUNT(DISTINCT site.id)',
        'total',
      )
      .addSelect(
        `
          COUNT(DISTINCT CASE 
            WHEN EXISTS (
              SELECT 1 FROM samples s
              INNER JOIN lab_tests lt ON lt."sampleId" = s.id
              WHERE s."siteId" = site.id
                AND s."sampleStatus" IN ('tested', 'test-report-generated')
                AND lt."testResult" = :positive
                ${diseaseId ? 'AND lt."diseaseId" = :diseaseId' : ''}
                ${startDate && endDate ? 'AND lt."resultDate" BETWEEN :startDate AND :endDate' : ''}
            )
            THEN site.id ELSE NULL 
          END)
        `,
        'positive',
      )

      .addSelect(
        `
          COUNT(DISTINCT CASE 
            WHEN EXISTS (
              SELECT 1 FROM samples s
              INNER JOIN lab_tests lt ON lt."sampleId" = s.id
              WHERE s."siteId" = site.id
                AND s."sampleStatus" IN ('tested', 'test-report-generated')
                AND lt."testResult" = :negative
                ${diseaseId ? 'AND lt."diseaseId" = :diseaseId' : ''}
                ${startDate && endDate ? 'AND lt."resultDate" BETWEEN :startDate AND :endDate' : ''}
            )
            AND NOT EXISTS (
              SELECT 1 FROM samples s
              INNER JOIN lab_tests lt ON lt."sampleId" = s.id
              WHERE s."siteId" = site.id
                AND s."sampleStatus" IN ('tested', 'test-report-generated')
                AND lt."testResult" = :positive
                ${diseaseId ? 'AND lt."diseaseId" = :diseaseId' : ''}
                ${startDate && endDate ? 'AND lt."resultDate" BETWEEN :startDate AND :endDate' : ''}
            )
            THEN site.id ELSE NULL 
          END)
        `,
        'negative',
      )

      .addSelect(
        `
          COUNT(DISTINCT CASE 
            -- Case 1: site has no samples
            WHEN NOT EXISTS (
              SELECT 1 FROM samples s WHERE s."siteId" = site.id
            )
            OR (
              -- Case 2: site has samples but no lab tests
              EXISTS (
                SELECT 1 FROM samples s
                WHERE s."siteId" = site.id
              )
              AND NOT EXISTS (
                SELECT 1 FROM samples s
                INNER JOIN lab_tests lt ON lt."sampleId" = s.id
                WHERE s."siteId" = site.id
                  ${diseaseId ? 'AND lt."diseaseId" = :diseaseId' : ''}
                  ${startDate && endDate ? 'AND lt."resultDate" BETWEEN :startDate AND :endDate' : ''}
              )
            )
            OR (
              -- Case 3: has lab tests but only unclear or null results
              EXISTS (
                SELECT 1 FROM samples s
                INNER JOIN lab_tests lt ON lt."sampleId" = s.id
                WHERE s."siteId" = site.id
                  AND s."sampleStatus" IN ('tested', 'test-report-generated', 'picked-up')
                  AND (lt."testResult" = :unclear OR lt."testResult" IS NULL)
                  ${diseaseId ? 'AND lt."diseaseId" = :diseaseId' : ''}
                  ${startDate && endDate ? 'AND lt."resultDate" BETWEEN :startDate AND :endDate' : ''}
              )
              AND NOT EXISTS (
                SELECT 1 FROM samples s
                INNER JOIN lab_tests lt ON lt."sampleId" = s.id
                WHERE s."siteId" = site.id
                  AND s."sampleStatus" IN ('tested', 'test-report-generated', 'picked-up')
                  AND lt."testResult" IN (:positive, :negative)
                  ${diseaseId ? 'AND lt."diseaseId" = :diseaseId' : ''}
                  ${startDate && endDate ? 'AND lt."resultDate" BETWEEN :startDate AND :endDate' : ''}
              )
            )
            THEN site.id ELSE NULL 
          END)
        `,
        'pending',
      )
      .where('site."projectId" = :projectId', { projectId });

    if (diseaseId) {
      query.setParameter('diseaseId', diseaseId);
    }

    if (startDate && endDate) {
      query.setParameter('startDate', startDate);
      query.setParameter('endDate', endDate);
    }

    query.setParameter('positive', TestResultType.POSITIVE);
    query.setParameter('negative', TestResultType.NEGATIVE);
    query.setParameter('unclear', TestResultType.UNCLEAR);

    // TEMP DEBUG - remove once the "syntax error at or near '('" is found
    console.log('SITES-STATS-SQL', query.getSql());

    const result = await query.getRawOne();

    return {
      total: Number(result.total ?? 0),
      positive: Number(result.positive ?? 0),
      negative: Number(result.negative ?? 0),
      pending: Number(result.pending ?? 0),
    };
  }

  /**
   * Get team allocation and progress by project id
   * @param
   */
  async teamProgress(query: any): Promise<any> {
    try {
      const {
        projectId,
        page,
        limit,
        sort = 'createdAt',
        sortOrder = 'DESC',
      } = query;
      const currentPage = Number(page);
      const perPage = Number(limit);
      const offset = (currentPage - 1) * perPage;

      // Total count of sites for pagination metadata. This is independent
      // of the paginated fetch below (no joins/grouping), so it can run
      // concurrently with it instead of blocking it.
      const countQuery = this.siteRepository
        .createQueryBuilder('site')
        .where('site.project = :projectId', { projectId });

      // Paginated site data with visit and team stats
      const siteQuery = this.siteRepository
        .createQueryBuilder('site')
        .leftJoin('site.visits', 'visit')
        .leftJoin('visit.team', 'team')
        .leftJoin('team.members', 'member')
        .where('site.project = :projectId', { projectId })
        .select('site.id', 'id')
        .addSelect('site.name', 'name')
        .addSelect('site.photos', 'photos')
        .addSelect(
          `
          COUNT(DISTINCT CASE
            WHEN visit.visitStatus = :upcoming
            THEN visit.id ELSE null END)
        `,
          'pendingVisitCount',
        )
        .addSelect(
          `
          COUNT(DISTINCT CASE
            WHEN visit.visitStatus = :completed
            THEN visit.id ELSE null END)
        `,
          'completedVisitCount',
        )
        .addSelect('COUNT(DISTINCT member.id)', 'totalTeamMemberCount')
        .groupBy('site.id, site.name, site.photos')
        .setParameters({
          upcoming: VisitStatus.UPCOMING,
          completed: VisitStatus.COMPLETED,
          projectId,
        })
        // NOTE: .limit()/.offset() (not .skip()/.take()) are required here.
        // This query has joins and is read via getRawMany(); TypeORM only
        // folds .skip()/.take() into the emitted SQL LIMIT/OFFSET when the
        // query builder has zero join attributes (see
        // SelectQueryBuilder.createLimitOffsetExpression in typeorm). With
        // joins present, .skip()/.take() are silently dropped for raw
        // queries, so .limit()/.offset() is the only reliable option.
        .limit(perPage)
        .offset(offset);

      const [totalCount, paginatedResult] = await Promise.all([
        countQuery.getCount(),
        siteQuery.getRawMany(),
      ]);
      // Get signed photo URLs
      const sitesWithVisitCounts = await Promise.all(
        paginatedResult.map(async (site: any) => {
          const photoIds = site.photos ?? [];
          const photos = photoIds.length
            ? await this.mediaRepository.findBy({
                id: In(photoIds),
              })
            : [];

          let filteredPhotos = photos;
          if (photos.length > 1) {
            filteredPhotos = photos.filter(
              (photo) =>
                !photo.key.includes(process.env.DEFAULT_IMAGE_THUMBNAIL),
            );
          }

          const signedPhotoUrls = await Promise.all(
            filteredPhotos.map((photo) =>
              this.mediaService.getSignedFileUrl(photo.key),
            ),
          );

          return {
            id: site.id,
            name: site.name,
            pendingVisitCount: Number(site.pendingVisitCount) || 0,
            completedVisitCount: Number(site.completedVisitCount) || 0,
            totalTeamMemberCount: Number(site.totalTeamMemberCount) || 0,
            photos: signedPhotoUrls,
          };
        }),
      );

      // ✅ Sort the final array here
      if (sort && sortOrder) {
        const direction = sortOrder.toLowerCase() === 'desc' ? -1 : 1;
        sitesWithVisitCounts.sort((a, b) => (a[sort] - b[sort]) * direction);
      }

      // Final paginated response
      return {
        docs: sitesWithVisitCounts,
        total: totalCount,
        page: currentPage,
        limit: perPage,
        totalPages: Math.ceil(totalCount / perPage),
      };
    } catch (error) {
      console.error('Error fetching team progress:', error);
      throw error;
    }
  }

  /**
   * Get team activity and progress by project id
   * @param
   */
  async teamActivityProgress(projectId: string): Promise<any> {
    try {
      const result = await this.sampleRepository
        .createQueryBuilder('sample')
        .select('COUNT(DISTINCT sample.id)', 'total') // Optional: get total count if needed
        .addSelect(
          `COUNT(DISTINCT CASE WHEN sample.sampleStatus != :completed THEN sample.id END)`,
          'totalPending',
        )
        .addSelect(
          `COUNT(DISTINCT CASE WHEN sample.sampleStatus = :completed THEN sample.id END)`,
          'totalCompleted',
        )
        .innerJoin('sample.project', 'project')
        .innerJoin('project.createdBy', 'createdBy')
        .innerJoin('sample.diseases', 'disease')
        .andWhere('project.id = :projectId', { projectId })
        .setParameters({
          completed: SampleStatus.TEST_REPORT_GENERATED,
        })
        .getRawOne();

      return {
        totalPendingSampleCount: Number(result.totalPending || 0),
        totalCompletedSampleCount: Number(result.totalCompleted || 0),
      };
    } catch (error) {
      console.error('Error fetching team activity progress:', error);
      throw error;
    }
  }

  /**
   * Every distinct person belonging to a project's teams, plus the team each
   * one is in.
   *
   * `Team.members` is @OneToMany(User, user => user.team) and reflects only
   * the singular `users.teamId` FK, which addTeamMember deliberately leaves
   * untouched - so reading membership off it returned just the one user each
   * team was created around. Membership lives in `user_roles`, keyed by
   * (project, team, user); the user row carries no project or team scope now
   * that one person can belong to several of each.
   *
   * `Team.members` is still unioned in so users onboarded before `user_roles`
   * carried team/project are not dropped.
   */
  private async resolveProjectTeamMembers(projectId: string): Promise<{
    members: User[];
    memberTeamMap: Map<string, string>;
  }> {
    const teams = await this.teamRepository.find({
      where: { projects: { id: projectId } },
      relations: ['members', 'members.roles', 'members.roles.role'],
    });

    const teamIds = teams.map((team) => team.id);

    const memberRoles = teamIds.length
      ? await this.userRoleRepository.find({
          where: {
            team: In(teamIds),
            project: projectId,
            status: StatusType.ACTIVE,
          },
          relations: ['user', 'user.roles', 'user.roles.role'],
        })
      : [];

    const byId = new Map<string, User>();
    const memberTeamMap = new Map<string, string>();

    teams.forEach((team) =>
      (team.members ?? []).forEach((member) => {
        if (!member) return;
        byId.set(member.id, member);
        if (!memberTeamMap.has(member.id))
          memberTeamMap.set(member.id, team.id);
      }),
    );

    // UserRole-derived members win: they carry the freshly loaded role graph
    // and the team this membership actually belongs to.
    memberRoles.forEach((userRole) => {
      if (!userRole.user) return;
      byId.set(userRole.user.id, userRole.user);
      if (userRole.team) memberTeamMap.set(userRole.user.id, userRole.team);
    });

    return { members: Array.from(byId.values()), memberTeamMap };
  }

  /**
   * Get team member activity by project id
   * @param
   */
  async teamMemberActivity(query: any): Promise<any> {
    try {
      const {
        diseaseId,
        startDate,
        endDate,
        projectId,
        page = 1,
        limit = 10,
        sort,
        sortOrder,
        isDownload,
      } = query;

      const { members: allMembers } =
        await this.resolveProjectTeamMembers(projectId);
      const totalMembers = allMembers.length;

      // Calculate pagination indices
      const currentPage = Number(page);
      const perPage = Number(limit);
      const offset = (currentPage - 1) * perPage;

      // Slice members array for pagination
      const paginatedMembers = isDownload
        ? allMembers
        : allMembers.slice(offset, offset + perPage);

      const results = await Promise.all(
        paginatedMembers.map(async (member) => {
          const queryBuilder = this.sampleRepository
            .createQueryBuilder('sample')
            .select('COUNT(DISTINCT sample.id)', 'total')
            .addSelect(
              `COUNT(DISTINCT CASE WHEN sample.sampleStatus IN (:...collectedStatuses) AND sample.collectedById = :memberId THEN sample.id END)`,
              'totalCollected',
            )
            .addSelect(
              `COUNT(DISTINCT CASE WHEN sample.sampleStatus = :received AND sample.receivedById = :memberId THEN sample.id END)`,
              'totalReceived',
            )
            .addSelect(
              `COUNT(DISTINCT CASE WHEN sample.sampleStatus = :extracted AND sample.extractedById = :memberId THEN sample.id END)`,
              'totalExtracted',
            )
            .addSelect(
              `COUNT(DISTINCT CASE WHEN sample.sampleStatus = :tested AND sample.testedById = :memberId THEN sample.id END)`,
              'totalTested',
            )
            .addSelect(
              `COUNT(DISTINCT CASE WHEN sample.sampleStatus = :testReportGenerated AND sample.reportGeneratedById = :memberId THEN sample.id END)`,
              'totalTestReportGenerated',
            )
            .where('sample.projectId = :projectId', { projectId })
            .setParameters({
              memberId: member.id,
              collectedStatuses: [SampleStatus.PENDING, SampleStatus.PICKED_UP],
              received: SampleStatus.RECEIVED,
              extracted: SampleStatus.EXTRACTED,
              tested: SampleStatus.TESTED,
              testReportGenerated: SampleStatus.TEST_REPORT_GENERATED,
            });

          if (diseaseId) {
            queryBuilder.innerJoin('sample.diseases', 'disease');
            queryBuilder.andWhere('disease.id = :diseaseId', { diseaseId });
          }

          if (startDate && endDate) {
            queryBuilder.andWhere(
              'DATE(sample.createdAt) BETWEEN :startDate AND :endDate',
              { startDate, endDate },
            );
          }

          const result = await queryBuilder.getRawOne();

          return {
            id: member.id,
            firstName: member.firstName,
            lastName: member.lastName,
            totalCollected: Number(result.totalCollected || 0),
            totalReceived: Number(result.totalReceived || 0),
            totalExtracted: Number(result.totalExtracted || 0),
            totalTested: Number(result.totalTested || 0),
            totalTestReportGenerated: Number(
              result.totalTestReportGenerated || 0,
            ),
          };
        }),
      );

      // ✅ Sort the final array here
      if (sort && sortOrder) {
        const direction = sortOrder.toLowerCase() === 'desc' ? -1 : 1;
        results.sort((a, b) => (a[sort] - b[sort]) * direction);
      }

      return {
        docs: results,
        total: totalMembers,
        page: currentPage,
        limit: perPage,
        totalPages: Math.ceil(totalMembers / perPage),
      };
    } catch (error) {
      console.error('Error fetching team member activity:', error);
      throw error;
    }
  }

  /**
   * Get team member progress per site for the combined view
   */
  async teamMemberProgress(query: any): Promise<any> {
    try {
      const {
        diseaseId,
        startDate,
        endDate,
        projectId,
        page = 1,
        limit = 10,
        sort,
        sortOrder,
        isDownload,
      } = query;

      const currentPage = Number(page);
      const perPage = Number(limit);
      const offset = (currentPage - 1) * perPage;

      // 1. Every member of the project's teams, resolved from `user_roles`
      const { members: allMembers, memberTeamMap } =
        await this.resolveProjectTeamMembers(projectId);
      const totalMembers = allMembers.length;

      // Paginate members
      const paginatedMembers = isDownload
        ? allMembers
        : allMembers.slice(offset, offset + perPage);

      const memberIds = paginatedMembers.map((m) => m.id);
      const relevantTeamIds = [
        ...new Set(
          memberIds.map((id) => memberTeamMap.get(id)).filter(Boolean),
        ),
      ] as string[];

      // 2. Get visit counts per team per site (one query for all relevant teams)
      // `completedVisitCount` is disease-scoped: a visit only "completed" for
      // a given disease if it has a sample of that disease (left-joined so a
      // visit with zero samples yet — an upcoming one — isn't dropped from
      // the result, since `pendingVisitCount` stays disease-agnostic: a
      // scheduled visit has no samples yet, so its disease isn't known
      // until collection happens).
      let visitQuery = this.visitRepository
        .createQueryBuilder('visit')
        .select('visit.teamId', 'teamId')
        .addSelect('visit.siteId', 'siteId')
        .addSelect('site.name', 'siteName')
        .addSelect(
          `COUNT(DISTINCT CASE WHEN visit.visitStatus = '${VisitStatus.UPCOMING}' THEN visit.id END)`,
          'pendingVisitCount',
        )
        .innerJoin('visit.site', 'site')
        .where('visit.teamId IN (:...teamIds)', {
          teamIds: relevantTeamIds,
        })
        .andWhere('visit.projectId = :projectId', { projectId });

      if (diseaseId) {
        visitQuery = visitQuery
          .addSelect(
            `COUNT(DISTINCT CASE WHEN visit.visitStatus = '${VisitStatus.COMPLETED}' AND disease.id = :diseaseId THEN visit.id END)`,
            'completedVisitCount',
          )
          .leftJoin('visit.samples', 'sample')
          .leftJoin('sample.diseases', 'disease')
          .setParameter('diseaseId', diseaseId);
      } else {
        visitQuery = visitQuery.addSelect(
          `COUNT(DISTINCT CASE WHEN visit.visitStatus = '${VisitStatus.COMPLETED}' THEN visit.id END)`,
          'completedVisitCount',
        );
      }

      const visitStats: any[] = relevantTeamIds.length
        ? await visitQuery
            .groupBy('visit.teamId')
            .addGroupBy('visit.siteId')
            .addGroupBy('site.name')
            .getRawMany()
        : [];

      // Build a map: teamId -> siteId -> { siteName, pendingVisitCount, completedVisitCount }
      const teamVisitMap = new Map<
        string,
        Map<
          string,
          {
            siteName: string;
            pendingVisitCount: number;
            completedVisitCount: number;
          }
        >
      >();
      for (const stat of visitStats) {
        if (!teamVisitMap.has(stat.teamId)) {
          teamVisitMap.set(stat.teamId, new Map());
        }
        teamVisitMap.get(stat.teamId)!.set(stat.siteId, {
          siteName: stat.siteName,
          pendingVisitCount: Number(stat.pendingVisitCount) || 0,
          completedVisitCount: Number(stat.completedVisitCount) || 0,
        });
      }

      // 3. For each member, get sample counts per site
      const results: any[] = [];

      await Promise.all(
        paginatedMembers.map(async (member) => {
          const teamId = memberTeamMap.get(member.id);
          if (!teamId) return;

          // Get sample counts grouped by site for this member
          const sampleQuery = this.sampleRepository
            .createQueryBuilder('sample')
            .select('sample.siteId', 'siteId')
            .addSelect(
              `COUNT(DISTINCT CASE WHEN sample.sampleStatus IN (:...collectedStatuses) AND sample.collectedById = :memberId THEN sample.id END)`,
              'totalCollected',
            )
            .addSelect(
              `COUNT(DISTINCT CASE WHEN sample.sampleStatus = :received AND sample.receivedById = :memberId THEN sample.id END)`,
              'totalReceived',
            )
            .addSelect(
              `COUNT(DISTINCT CASE WHEN sample.sampleStatus = :extracted AND sample.extractedById = :memberId THEN sample.id END)`,
              'totalExtracted',
            )
            .addSelect(
              `COUNT(DISTINCT CASE WHEN sample.sampleStatus = :tested AND sample.testedById = :memberId THEN sample.id END)`,
              'totalTested',
            )
            .addSelect(
              `COUNT(DISTINCT CASE WHEN sample.sampleStatus = :testReportGenerated AND sample.reportGeneratedById = :memberId THEN sample.id END)`,
              'totalTestReportGenerated',
            )
            .where('sample.projectId = :projectId', { projectId })
            .setParameters({
              memberId: member.id,
              collectedStatuses: [SampleStatus.PENDING, SampleStatus.PICKED_UP],
              received: SampleStatus.RECEIVED,
              extracted: SampleStatus.EXTRACTED,
              tested: SampleStatus.TESTED,
              testReportGenerated: SampleStatus.TEST_REPORT_GENERATED,
            });

          if (diseaseId) {
            sampleQuery.innerJoin('sample.diseases', 'disease');
            sampleQuery.andWhere('disease.id = :diseaseId', {
              diseaseId,
            });
          }

          if (startDate && endDate) {
            sampleQuery.andWhere(
              'DATE(sample.createdAt) BETWEEN :startDate AND :endDate',
              { startDate, endDate },
            );
          }

          sampleQuery.groupBy('sample.siteId');

          const sampleStats = await sampleQuery.getRawMany();

          // Build a map: siteId -> sample counts
          const sampleSiteMap = new Map<
            string,
            {
              totalCollected: number;
              totalReceived: number;
              totalExtracted: number;
              totalTested: number;
              totalTestReportGenerated: number;
            }
          >();
          for (const stat of sampleStats) {
            sampleSiteMap.set(stat.siteId, {
              totalCollected: Number(stat.totalCollected) || 0,
              totalReceived: Number(stat.totalReceived) || 0,
              totalExtracted: Number(stat.totalExtracted) || 0,
              totalTested: Number(stat.totalTested) || 0,
              totalTestReportGenerated:
                Number(stat.totalTestReportGenerated) || 0,
            });
          }

          // 4. Combine visit stats and sample stats per site
          const memberSites = teamVisitMap.get(teamId);
          if (memberSites && memberSites.size > 0) {
            for (const [siteId, visitInfo] of memberSites.entries()) {
              const sampleInfo = sampleSiteMap.get(siteId) ?? {
                totalCollected: 0,
                totalReceived: 0,
                totalExtracted: 0,
                totalTested: 0,
                totalTestReportGenerated: 0,
              };

              results.push({
                userId: member.id,
                firstName: member.firstName,
                lastName: member.lastName,
                siteId,
                siteName: visitInfo.siteName,
                pendingVisitCount: visitInfo.pendingVisitCount,
                completedVisitCount: visitInfo.completedVisitCount,
                ...sampleInfo,
              });
            }
          } else {
            // Member has no visits assigned, still show with empty counts
            results.push({
              userId: member.id,
              firstName: member.firstName,
              lastName: member.lastName,
              siteId: '',
              siteName: 'No site assigned',
              pendingVisitCount: 0,
              completedVisitCount: 0,
              totalCollected: 0,
              totalReceived: 0,
              totalExtracted: 0,
              totalTested: 0,
              totalTestReportGenerated: 0,
            });
          }
        }),
      );

      // 5. Sort the final array
      if (sort && sortOrder) {
        const direction = sortOrder.toLowerCase() === 'desc' ? -1 : 1;
        results.sort((a, b) => {
          const aVal = a[sort] ?? 0;
          const bVal = b[sort] ?? 0;
          if (typeof aVal === 'string' && typeof bVal === 'string') {
            return aVal.localeCompare(bVal) * direction;
          }
          return (Number(aVal) - Number(bVal)) * direction;
        });
      }

      return {
        docs: results,
        total: totalMembers,
        page: currentPage,
        limit: perPage,
        totalPages: Math.ceil(totalMembers / perPage),
      };
    } catch (error) {
      console.error('Error fetching team member progress:', error);
      throw error;
    }
  }

  // upload data script
  async uploadData(bodyData: any) {
    try {
      const { user } = bodyData;

      // A13: every row names a `Project ID*` that gets used directly to
      // create sites/samples/lab-tests, with no check that the uploader
      // actually administers it — an IDOR that lets anyone holding "create
      // project" inject data into another tenant's project. Validate every
      // distinct project id referenced anywhere in the sheet against the
      // uploader's reachable projects before touching any row; reject the
      // whole upload rather than trying to partially filter interdependent
      // rows (samples/lab-tests key off Visit/Site rows by id, not just by
      // project).
      const referencedProjectIds = new Set<string>();
      for (const site of bodyData.Site ?? []) {
        if (site?.['Project ID*'])
          referencedProjectIds.add(site['Project ID*']);
      }
      for (const visit of bodyData.Visit ?? []) {
        if (visit?.['Project ID*'])
          referencedProjectIds.add(visit['Project ID*']);
      }
      for (const projectId of referencedProjectIds) {
        if (!(await this.tenantScopeService.canReachProject(user, projectId))) {
          throw new ForbiddenException(
            `You do not have access to project ${projectId}`,
          );
        }
      }

      const siteMap = new Map();
      let teamId = null;

      // Step 1: Organize LabTests by Sample ID and Disease
      const labTestsBySampleId: Record<string, Record<string, any[]>> = {};
      const diseaseResultKeys = Object.keys(bodyData).filter((k) =>
        k.startsWith('Result_'),
      );

      for (const key of diseaseResultKeys) {
        for (const test of bodyData[key]) {
          const sampleId = test['Sample ID*'];
          const disease = test['Disease*'] || test['Disease'];
          if (!labTestsBySampleId[sampleId]) labTestsBySampleId[sampleId] = {};
          if (!labTestsBySampleId[sampleId][disease])
            labTestsBySampleId[sampleId][disease] = [];

          // Extract extraDetails for non-* keys
          const extraDetails: Record<string, any> = {};
          for (const testKey in test) {
            if (
              !testKey.endsWith('*') &&
              !['Disease', 'Disease*'].includes(testKey)
            ) {
              extraDetails[testKey] = test[testKey];
            }
          }

          const testedBy = await this.userRepository.findOne({
            where: { id: test['Tested By*'] },
          });
          labTestsBySampleId[sampleId][disease].push({
            disease,
            kitOrProtocol: test['Kit / Protocol'],
            testedAt: test['Tested Date*'],
            testResult: test['Result*']?.toLowerCase(),
            labComment: test['Comment'],
            testedBy,
            details: extraDetails,
          });
        }
      }

      // ✅ Step 2: Build Site Map First
      for (const site of bodyData.Site) {
        const key = `${site['Project ID*']}_${site['Site Name*']}`;
        const payload = {
          project: site['Project ID*'],
          name: site['Site Name*'],
          farmType: `${site['Farm Type*'].toLowerCase()} farm`,
          siteType: site['Site Type'].toLowerCase(),
          siteOwnerName: site['Site Owner Name'],
          siteOwnerNumber: String(site['Site Owner Number']),
          workerNumber: site['Worker Number'] || 0,
          siteCode: site['Site Code'],
          address: site['Address'],
          regionId: site['Region ID*'],
          pinCode: site['Pin Code'] || null,
          latitude: parseFloat(site['Latitude*']),
          longitude: parseFloat(site['Longitude*']),
          comment: site['Comment'] || '',
          photos: site['Photos'] ? [site['Photos']] : [],
        };

        siteMap.set(key, {
          createPayload: payload,
          updatePayload: {
            collectionCollector: site['Collector ID*'],
            collectionFrequencyInterval: 1,
            collectionFrequency: 1,
            collectionDayOfWeek: ['Wednesday', 'Friday'],
            collectionTime: '12:43:12',
            collectionDuration: 60,
          },
          visits: [],
        });
      }

      // ✅ Step 3: Map Samples by Visit ID
      const samplesByVisitId: Record<string, any[]> = {};
      for (const sample of bodyData.Sample) {
        const visitId = sample['Visit ID'];
        const sampleId = sample['Sample ID'];
        const diseases = sample['Suspected disease'].split(',');

        const diseaseList = await Promise.all(
          diseases.map(async (disease: string) => {
            const diseaseData = await this.diseaseRepository.findOne({
              where: { shortName: disease },
            });
            return { name: disease, id: diseaseData.id };
          }),
        );
        const diseaseIds = diseaseList.map((disease: any) => disease.id);

        const sampleType = await this.sampleTypeRepository.findOne({
          where: { name: ILike(sample['Sample Type']?.toLowerCase()) },
        });

        // 🔍 Get Site Location fallback
        const visit = bodyData.Visit.find((v) => v['Visit ID*'] === visitId);
        const siteKey = `${visit['Project ID*']}_${visit['Site Name*']}`;
        const sitePayload = siteMap.get(siteKey)?.createPayload;

        const longitude = sample['Long'] ?? sitePayload?.longitude;
        const latitude = sample['Lat'] ?? sitePayload?.latitude;

        const sampleDto = {
          sampleId,
          barcode: sample['Barcode'],
          sampleType: sampleType?.id,
          replicates: sample['Replicates'] || 'not collected',
          comment: sample['Comment'] || '',
          diseases: diseaseIds,
          photos: sample['Photos'] ? [sample['Photos']] : [],
          latitude,
          longitude,
          labTests: [],
        };

        // 🔬 Attach Lab Tests
        if (labTestsBySampleId[sampleId]) {
          for (const disease of Object.keys(labTestsBySampleId[sampleId])) {
            for (const test of labTestsBySampleId[sampleId][disease]) {
              const diseaseData = await this.diseaseRepository.findOne({
                where: { shortName: disease },
              });
              sampleDto.labTests.push({
                ...test,
                disease: diseaseData.id,
              });
            }
          }
        }

        if (!samplesByVisitId[visitId]) samplesByVisitId[visitId] = [];
        samplesByVisitId[visitId].push(sampleDto);
      }

      // ✅ Step 4: Group Visits by Project + Site Name
      const visitsByProjectSite: Record<string, any[]> = {};
      for (const visit of bodyData.Visit) {
        const key = `${visit['Project ID*']}_${visit['Site Name*']}`;
        const visitId = visit['Visit ID*'];
        const userData = await this.userRepository.findOne({
          where: { id: visit['Collector ID*'] },
          relations: ['team'],
        });
        teamId = userData.team?.id;

        const visitDto = {
          visitId,
          visitData: {
            isCompleted: true,
            siteId: visit['Site ID*'],
            teamId: teamId,
            visitedAt: visit['Visit Date*'],
            visitedBy: visit['Collector ID*'],
          },
          samples: samplesByVisitId[visitId] || [],
        };

        if (!visitsByProjectSite[key]) visitsByProjectSite[key] = [];
        visitsByProjectSite[key].push(visitDto);
      }

      // ✅ Step 5: Attach visits to siteMap
      for (const [key, value] of siteMap.entries()) {
        value.visits = visitsByProjectSite[key] || [];
      }

      // ✅ Final Structured Output
      const structuredData = Array.from(siteMap.values());

      // console.log('structuredData', structuredData);

      for (const site of structuredData) {
        const {
          project,
          photos,
          collectionCollector,
          collectionTime,
          ...createSiteObj
        } = site.createPayload;

        const collectionObj: CreateCollectionPlanObj = {
          collectionCollector: null,
          collectionStartDate: null,
          collectionExpiryDate: null,
          collectionTime: collectionTime || null,
        };

        const projectData = await this.projectRepository.findOne({
          where: { id: project },
          relations: ['diseases'],
        });
        if (!projectData) {
          throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
        }

        const diseasesData = projectData.diseases;
        if (!diseasesData) {
          throw new HttpException('Disease not found', HttpStatus.NOT_FOUND);
        }
        let collector = null;
        if (collectionCollector) {
          collector = await this.userRepository.findOne({
            where: { id: collectionCollector },
          });
          collectionObj.collectionCollector = collector;
        }

        if (collectionCollector && !collector) {
          throw new HttpException('Collector not found', HttpStatus.NOT_FOUND);
        }

        let createdBy: User = null;
        if (user && user.id) {
          createdBy = await this.userRepository.findOne({
            where: { id: user.id },
          });
          if (!createdBy) {
            throw new HttpException(
              `User not found for userid ${user.id}`,
              HttpStatus.NOT_FOUND,
            );
          }
        }

        if (collectionTime && createSiteObj.collectionDayOfWeek) {
          collectionObj.collectionStartDate = calculateStartDate(
            createSiteObj.collectionDayOfWeek,
            collectionObj.collectionTime,
          );
          collectionObj.collectionStartDate = DateTime.fromJSDate(
            collectionObj.collectionStartDate,
          ).toFormat('yyyy-MM-dd HH:mm:ss') as unknown as Date;
        }
        if (createSiteObj.collectionDuration) {
          collectionObj.collectionExpiryDate = calculateExpiryDateFlexible(
            createSiteObj.collectionDuration,
            collectionObj.collectionTime,
            collectionObj.collectionStartDate,
          );
          collectionObj.collectionExpiryDate = DateTime.fromJSDate(
            collectionObj.collectionExpiryDate,
          ).toFormat('yyyy-MM-dd HH:mm:ss') as unknown as Date;
        }

        const createdSite = await this.siteService.create(
          { ...createSiteObj } as CreateSiteObj,
          projectData,
          diseasesData,
          collectionObj,
          createdBy,
          photos,
        );
        console.log('🟩 Create Site:', createdSite?.id);
        if (createdSite?.id) {
          const updateSitePayload: UpdateSiteDto = {
            project: projectData,
            ...site.updatePayload,
          };
          const {
            collectionCollector,
            photos,
            collectionTime,
            ...createSiteObj
          } = updateSitePayload;

          const collectionObj: CreateCollectionPlanObj = {
            collectionStartDate: null,
            collectionExpiryDate: null,
            collectionTime: collectionTime || null,
          };

          let collector = null;
          if (collectionCollector) {
            collector = await this.userRepository.findOne({
              where: { id: collectionCollector },
            });
          }
          if (!collector && collectionCollector) {
            throw new HttpException(
              'Collector not found',
              HttpStatus.NOT_FOUND,
            );
          }

          let updatedBy: User = null;
          if (user && user.id) {
            updatedBy = await this.userRepository.findOne({
              where: { id: user.id },
            });
            if (!updatedBy) {
              throw new HttpException(
                `User not found for userid ${user.id}`,
                HttpStatus.NOT_FOUND,
              );
            }
          }

          if (collectionTime && createSiteObj.collectionDayOfWeek) {
            collectionObj.collectionStartDate = calculateStartDate(
              createSiteObj.collectionDayOfWeek,
              collectionObj.collectionTime,
            );
            collectionObj.collectionStartDate = DateTime.fromJSDate(
              collectionObj.collectionStartDate,
            ).toFormat('yyyy-MM-dd HH:mm:ss') as unknown as Date;
          }
          if (createSiteObj.collectionDuration) {
            collectionObj.collectionExpiryDate = calculateExpiryDateFlexible(
              createSiteObj.collectionDuration,
              collectionObj.collectionTime,
              collectionObj.collectionStartDate,
            );
            collectionObj.collectionExpiryDate = DateTime.fromJSDate(
              collectionObj.collectionExpiryDate,
            ).toFormat('yyyy-MM-dd HH:mm:ss') as unknown as Date;
          }

          const updatedSite = await this.siteService.update(
            createdSite.id,
            collector,
            createSiteObj,
            collectionObj,
            updatedBy,
            photos,
          );

          console.log('🟦 Update Site:', updatedSite.id);
          if (updatedSite) {
            const findSite = await this.siteRepository.findOne({
              where: { id: createdSite?.id },
              relations: ['visits'],
              order: {
                createdAt: 'DESC',
              },
            });
            console.log('🟥 findSite:', findSite.id);
            if (findSite?.id) {
              for (const visit of site.visits) {
                const visitPayload: SubmitVisitDto = {
                  ...visit,
                  visitData: {
                    ...visit.visitData,
                    siteId: createdSite.id,
                    projectId: projectData.id,
                    teamId,
                  },
                };
                console.log('🟨 Visit Submit:');
                await this.visitService.submitVisit(
                  findSite.visits[0].id,
                  visitPayload,
                );
                for (const sample of visit.samples) {
                  console.log('🟥 sample barcode:', sample.barcode);
                  const sampleData = await this.sampleRepository.findOne({
                    where: { barcode: sample.barcode },
                    relations: ['site', 'visit', 'team', 'project'],
                  });
                  // console.log('🟥 sample data:', sampleData);
                  const labTestPayload = sample.labTests.map((test: any) => ({
                    ...test,
                    project: sampleData.project.id,
                    site: sampleData.site.id,
                    visit: sampleData.visit.id,
                    team: sampleData.team.id,
                    sample: sampleData.id,
                  }));
                  // console.log('🟥 LabTest Create payload:', labTestPayload);
                  await this.labTestRepository.save(labTestPayload);
                  await this.sampleRepository.update(sampleData.id, {
                    sampleStatus: SampleStatus.TESTED,
                  });
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }

  async generateCsv(projects: any[]): Promise<string> {
    const fields = [
      'id',
      'name',
      'code',
      'diseases',
      'regions',
      'surveillanceTypes',
      'projectAdmins',
    ];

    const cleanData = projects.map((project) => ({
      ...project,
      diseases: (project.diseases ?? []).map((d) => d.shortName).join(', '),
      regions: (project.regions ?? []).map((r) => r.name).join(', '),
      surveillanceTypes: (project.surveillanceTypes ?? [])
        .map((st) => st.name)
        .join(', '),
      projectAdmins: (project.projectAdmins ?? [])
        .map((pa) => `${pa.firstName} ${pa.lastName}`)
        .join(', '),
    }));

    const parser = new Parser({
      fields: fields.map((field) => ({
        label: beautifyHeader(field),
        value: field,
      })),
    });
    return parser.parse(cleanData);
  }

  async generateTeamMemberActivityCsv(data: any[]): Promise<string> {
    const fields = [
      'id',
      'firstName',
      'lastName',
      'totalCollected',
      'totalReceived',
      'totalExtracted',
      'totalTested',
      'totalTestReportGenerated',
    ];

    const cleanData = data.map((project) => ({
      ...project,
    }));

    const parser = new Parser({
      fields: fields.map((field) => ({
        label: beautifyHeader(field),
        value: field,
      })),
    });
    return parser.parse(cleanData);
  }

  sendCsv(res: Response, csvContent: string, filename: string): void {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    // console.log('csvContent', csvContent);
    res.send(csvContent);
  }

  async generateTeamMemberProgressCsv(data: any[]): Promise<string> {
    const fields = [
      'firstName',
      'lastName',
      'siteName',
      'pendingVisitCount',
      'completedVisitCount',
      'totalCollected',
      'totalReceived',
      'totalExtracted',
      'totalTested',
      'totalReportGenerated',
    ];

    const parser = new Parser({
      fields: fields.map((field) => ({
        label: beautifyHeader(field),
        value: field,
      })),
    });
    return parser.parse(data);
  }
}
