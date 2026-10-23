import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MembersActivityDataType,
  TeamMemberPaginatedResponseType,
  TeamProgressActivityOverviewResponseData,
} from 'src/common/dto/response/team.response';
import { Action } from 'src/common/enums/action.enum';
import { Resource } from 'src/common/enums/resource.enum';
import { RoleType } from 'src/common/enums/roles.enum';
import { StatusType } from 'src/common/enums/status.enum';
import { VisitStatus } from 'src/common/enums/visitStatus.enum';
import {
  checkUserPermissions,
  getUserScope,
} from 'src/common/functions/get-user-role';
import { VisitDataForEveryMember } from 'src/common/types/visit-data-for-every-member.type';
import { Media } from 'src/entities/media.entity';
import { Project } from 'src/entities/project.entity';
import { Role } from 'src/entities/role.entity';
import { Sample } from 'src/entities/sample.entity';
import { Team } from 'src/entities/team.entity';
import { UserRole } from 'src/entities/user-role.entity';
import { User } from 'src/entities/user.entity';
import {
  Between,
  DataSource,
  ILike,
  In,
  QueryRunner,
  Repository,
} from 'typeorm';
import { MulterConfigService } from '../media/media.service';
import { UserService } from '../users/users.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Scope } from 'src/common/enums/scope.enum';
import { MailerService } from '../mailer/mailer.service';
import { emailTemplate } from '../mailer/temaplates';
import { RedisCacheService } from '../../common/cache/redis-cache.service';
import { USER_AUTH_CACHE_PREFIX } from '../../common/cache/cache-keys';

function scopeUserRolesToProject(user: User, projectId?: string): User {
  if (!projectId || !user?.roles?.length) return user;
  return {
    ...user,
    roles: user.roles.filter((userRole) => userRole.project === projectId),
  };
}

@Injectable()
export class TeamsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    private readonly userService: UserService,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Sample)
    private readonly sampleRepository: Repository<Sample>,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    private readonly mediaService: MulterConfigService,
    private readonly mailerService: MailerService,
    private readonly cacheService: RedisCacheService,
  ) {}

  // A14: `query.projectId` used to go straight into `where: {...}` as an
  // object literal - if it was ever missing, TypeORM silently drops that
  // key from the predicate instead of matching nothing, and this returns
  // every team in the system. Guard it explicitly so a missing project id
  // fails closed (empty list) rather than open (everything).
  async findAll(query: any): Promise<Team[]> {
    try {
      if (!query?.projectId) {
        return [];
      }
      const teams = await this.teamRepository.find({
        where: { projects: { id: query.projectId } },
      });

      const teamIds = teams.map((team) => team.id);
      const userRoles = teamIds.length
        ? await this.userRoleRepository.find({
            where: { team: In(teamIds), project: query.projectId },
            relations: ['user', 'user.roles', 'user.roles.role'],
          })
        : [];
      const membersByTeam = new Map<string, User[]>();
      for (const userRole of userRoles) {
        if (!userRole.team || !userRole.user) continue;
        const list = membersByTeam.get(userRole.team) ?? [];
        if (!list.some((member) => member.id === userRole.user.id)) {
          list.push(userRole.user);
        }
        membersByTeam.set(userRole.team, list);
      }

      // Batch-fetch every team's logo media in a single query instead of
      // one mediaRepository lookup per team.
      const logoIds = teams
        .filter((team) => team.logo)
        .map((team) => team.logo);
      const logos = logoIds.length
        ? await this.mediaRepository.findBy({ id: In(logoIds) })
        : [];
      const logosById = new Map(logos.map((logo) => [logo.id, logo]));

      await Promise.all(
        teams.map(async (team) => {
          team.members = (membersByTeam.get(team.id) ?? [])
            .map((member) => scopeUserRolesToProject(member, query.projectId))
            .reverse();
          if (!team.logo) return;
          const photo = logosById.get(team.logo);
          if (!photo) {
            team['logo'] = null;
            return;
          }

          const signedUrl = await this.mediaService.getSignedFileUrl(photo.key);
          team['logo'] = signedUrl;
        }),
      );

      return teams;
    } catch (error) {
      console.log('Get all teams error:', error);
      throw error;
    }
  }

  // A15: `query.projectId` feeds a nested `projects: { id: ... }` relation
  // condition - if it were ever missing, TypeORM drops that nested key and
  // the lookup silently falls back to `id: query.team` alone, returning the
  // team's members regardless of project. The live route already forwards
  // `projectId`; guard the case where a caller doesn't.
  async findAllTeamMembers(query: any): Promise<User[]> {
    if (!query?.projectId) {
      throw new NotFoundException(`Team not found`);
    }
    const team = await this.teamRepository.findOne({
      where: { id: query.team, projects: { id: query.projectId } },
    });

    if (!team) {
      throw new NotFoundException(`Team not found`);
    }

    const members = await this.userRoleRepository.find({
      where: { team: team.id, project: query.projectId },
      relations: ['user', 'user.roles', 'user.roles.role'],
    });

    return members
      .map((userRole) =>
        scopeUserRolesToProject(userRole.user, query.projectId),
      )
      .filter(
        (member, index, arr) =>
          !!member && arr.findIndex((u) => u.id === member.id) === index,
      )
      .reverse();
  }

  // A9: optional trailing `projectId` - when the caller (once wired) passes
  // the route's `:projectId`, the team lookup is bound to it so a teamId
  // from a foreign project can't be used to read another project's member
  // activity. Optional so nothing breaks before the controller threads it.
  async getTeamMembersFieldView(
    query: any,
    projectId?: string,
  ): Promise<TeamMemberPaginatedResponseType> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const team = await this.teamRepository.findOne({
      where: projectId
        ? { id: query.team, projects: { id: projectId } }
        : { id: query.team },
    });

    if (!team) {
      throw new Error('Team not found');
    }

    const members = await this.userRoleRepository.find({
      where: { team: team.id },
      relations: [
        'user',
        'user.sites',
        'user.sites.visits',
        'user.roles',
        'user.roles.role',
      ],
    });
    const teamMembers = members
      .map((userRole) =>
        scopeUserRolesToProject(userRole.user, query.projectId),
      )
      .filter(
        (member, index, arr) =>
          !!member && arr.findIndex((u) => u.id === member.id) === index,
      );

    const collectors = teamMembers.filter((member) =>
      member.roles.some((role) => role.role.name === 'collector'),
    );

    const total = collectors.length;
    const paginatedCollectors = collectors.slice(skip, skip + limit);

    // Process members to include site count and last visited visit
    const TeamMembersCollectorListType = paginatedCollectors.map((member) => {
      const siteCount = member.sites ? member.sites.length : 0;

      // Find the most recent visit
      let lastVisitedVisit: Date | null = null;
      member.sites.forEach((site) => {
        site.visits.forEach((visit) => {
          if (visit.visitedAt) {
            if (!lastVisitedVisit || visit.visitedAt > lastVisitedVisit) {
              lastVisitedVisit = visit.visitedAt;
            }
          }
        });
      });

      return {
        id: member.id,
        firstName: member.firstName,
        lastName: member.lastName,
        siteCount,
        lastVisitedVisit,
      };
    });

    return {
      docs: TeamMembersCollectorListType,
      total,
      page: Number(page),
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // A9: optional trailing `projectId` - see getTeamMembersFieldView above.
  async getTeamActivityOverview(
    query: any,
    teamId: string,
    projectId?: string,
  ): Promise<TeamProgressActivityOverviewResponseData> {
    const { startDate, endDate } = query;
    const team = await this.teamRepository.findOne({
      where: {
        id: teamId,
        status: StatusType.ACTIVE,
        ...(projectId ? { projects: { id: projectId } } : {}),
      },
    });
    // Was `if (team) { ... }` with `team.members.length` read
    // unconditionally below - a not-found team (including one that fails
    // the new project check above) would crash with a null deref instead
    // of a clean 404.
    if (!team) {
      throw new NotFoundException(`Team not found`);
    }
    const members = await this.userRoleRepository.find({
      where: { team: teamId },
      relations: [
        'user',
        'user.roles',
        'user.roles.role',
        'user.roles.role.permissions',
      ],
    });
    team.members = members
      .map((userRole) => userRole.user)
      .filter((member) =>
        checkUserPermissions(member, {
          subject: Resource.Sample,
          action: Action.Create,
        }),
      );
    const whereCondition: any = {
      team: { id: teamId },
    };
    if (startDate && endDate) {
      whereCondition.collectedAt = Between(startDate, endDate);
    }
    const samples = await this.sampleRepository.find({ where: whereCondition });
    return {
      activeMembers: team.members.length,
      collectedSamples: samples.length,
    };
  }

  // A9: optional trailing `projectId` - see getTeamMembersFieldView above.
  async getTeamMembersVisitActivity(
    query: any,
    teamId: string,
    projectId?: string,
  ): Promise<MembersActivityDataType[]> {
    try {
      console.log(query);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      const teamWithMembers = await this.teamRepository.findOne({
        where: projectId
          ? { id: teamId, projects: { id: projectId } }
          : { id: teamId },
      });
      if (!teamWithMembers) {
        throw new NotFoundException(`Team not found`);
      }
      const memberRoles = await this.userRoleRepository.find({
        where: { team: teamId },
        relations: [
          'user',
          'user.roles',
          'user.roles.role',
          'user.roles.role.permissions',
          'user.sites',
          'user.sites.visits',
          'user.sites.location',
          'user.sites.location.region',
          'user.sites.location.region.parentRegion',
        ],
      });
      teamWithMembers.members = memberRoles.map((userRole) =>
        scopeUserRolesToProject(userRole.user, undefined),
      );
      const members: MembersActivityDataType[] = [];
      for (const users of teamWithMembers?.members) {
        if (
          !checkUserPermissions(users, {
            subject: Resource.Sample,
            action: Action.Create,
          })
        )
          continue;
        const membersActivityData: MembersActivityDataType = {
          collector: '',
          id: '',
          totalNumberOfVisitsAssigned: 0,
          totalNumberOfVisitsOverDue: 0,
          totalNumberOfVisitsPending: 0,
          visits: [],
        };
        let totalVisits = 0,
          totalPendingVisits = 0,
          totalOverdueVisits = 0;
        for (const site of users.sites) {
          for (const visit of site.visits) {
            const visitData: VisitDataForEveryMember = {
              id: '',
              siteName: '',
              siteAddress: '',
              siteState: '',
              siteDistrict: '',
              visitScheduledAt: null,
              visitStatus: null,
            };
            totalVisits++;
            if (
              visit.visitScheduledAt < currentDate &&
              visit.visitStatus !== VisitStatus.COMPLETED &&
              !visit.isCompleted
            ) {
              visitData.visitStatus = VisitStatus.OVERDUE;
              totalOverdueVisits++;
            } else {
              visitData.visitStatus = visit.visitStatus;
              if (visit.visitStatus !== VisitStatus.COMPLETED) {
                totalPendingVisits++;
              }
              visitData.id = visit.id;
              visitData.siteName = site.name;
              visitData.siteAddress = site.address;
              visitData.siteState = site.location.region.parentRegion.name;
              visitData.siteDistrict = site.location.region.name;
              visitData.visitScheduledAt = visit.visitScheduledAt;
              membersActivityData.visits.push(visitData);
            }
          }
        }
        membersActivityData.collector = `${users.firstName} ${users.lastName}`;
        membersActivityData.totalNumberOfVisitsAssigned = totalVisits;
        membersActivityData.totalNumberOfVisitsPending = totalPendingVisits;
        membersActivityData.totalNumberOfVisitsOverDue = totalOverdueVisits;
        membersActivityData.id = users.id;
        members.push(membersActivityData);
      }
      return members;
    } catch (error) {
      console.log('get visit activity error', error);
      throw error;
    }
  }

  // A9: `projectId` is optional only because not every caller has been
  // threaded through to pass the route's `:projectId` yet - when it IS
  // supplied, the lookup is bound to it so a team id from a foreign project
  // can never be read through here. See FINDINGS.md §21a.
  async findOne(query: {
    id: string;
    projectId?: string;
    [key: string]: any;
  }): Promise<Team> {
    try {
      const { projectId, ...rest } = query;
      const where: Record<string, any> = { ...rest };
      if (projectId) {
        where.projects = { id: projectId };
      }
      const team = await this.teamRepository.findOne({ where });
      if (!team) {
        throw new NotFoundException(`Team with ID ${query.id} not found`);
      }

      const photo = await this.mediaRepository.findOne({
        where: { id: team.logo },
      });
      if (!photo) {
        return { ...team, logo: null };
      }

      const signedUrl = await this.mediaService.getSignedFileUrl(photo.key);

      return { ...team, logo: signedUrl };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new NotFoundException(`Team with ID ${query?.id} not found`);
    }
  }

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    try {
      let isUserExist = null;

      // Find project if provided
      let project: Project = null;
      if (createTeamDto.project) {
        project = await this.projectRepository.findOne({
          where: { id: createTeamDto.project },
          relations: ['teams', 'members'],
        });

        if (!project) {
          throw new NotFoundException(
            `Project with ID ${createTeamDto.project} not found`,
          );
        }
        const existingTeam = project.teams.find(
          (team) => team.teamName === createTeamDto.teamName,
        );
        if (existingTeam) {
          throw new Error(
            `Team name "${createTeamDto.teamName}" already exists in this project`,
          );
        }
      }

      // A user can be part of multiple projects with different roles, so
      // merely existing in the system is not grounds to reject them here -
      // only super-admins are barred from being a team's contact person.
      if (createTeamDto?.email) {
        isUserExist = await this.userRepository.findOne({
          where: [{ email: ILike(createTeamDto.email) }],
          relations: ['roles', 'roles.role', 'roles.role.permissions'],
        });
      }

      if (!isUserExist && createTeamDto?.contactNumber) {
        isUserExist = await this.userRepository.findOne({
          where: [{ contactNumber: createTeamDto.contactNumber }],
          relations: ['roles', 'roles.role', 'roles.role.permissions'],
        });
      }

      if (isUserExist && getUserScope(isUserExist) === Scope.System) {
        throw new BadRequestException({
          success: false,
          statusCode: 400,
          message: `Super admin cannot be part of a project team.`,
          timestamp: new Date().toISOString(),
        });
      }

      // Check if team already exists with the same email
      const existingTeam = await this.teamRepository.findOne({
        where: { email: createTeamDto.email },
      });

      if (existingTeam) {
        throw new BadRequestException(
          `Team with email ${createTeamDto.email} already exists`,
        );
      }

      const team = this.teamRepository.create({
        ...createTeamDto,
        projects: project ? [project] : [],
      });
      await this.teamRepository.save(team);
      team.members = [];
      // Create user if not exists
      if (!isUserExist) {
        if (!project) {
          throw new BadRequestException(
            'Project is required when creating a new user',
          );
        }

        const userPayload = {
          email: createTeamDto.email,
          contactNumber: createTeamDto.contactNumber,
          firstName: createTeamDto.firstName,
          lastName: createTeamDto.lastName,
          role: RoleType.TEAM_ADMIN,
          project: project.id,
          // B6: this is the brand-new-user branch only (`!isUserExist`), so
          // `users.teamId` is going NULL -> value here, which migration
          // 1787's trigger allows. Without this, new team-admins were never
          // linked to the team they were just created for. Mirrors
          // projects.service.ts's equivalent user-creation path.
          team: team.id,
        };

        isUserExist = await this.userService.create(userPayload);
      } else {
        // Same rule as addTeamMember: an existing user's name is not the
        // team form's to rewrite. Only fill it in when it is currently blank.
        const firstNameIsBlank = !isUserExist.firstName?.trim();
        const lastNameIsBlank = !isUserExist.lastName?.trim();

        if (
          (firstNameIsBlank && createTeamDto.firstName?.trim()) ||
          (lastNameIsBlank && createTeamDto.lastName?.trim())
        ) {
          await this.userRepository.save({
            ...isUserExist,
            firstName: firstNameIsBlank
              ? createTeamDto.firstName
              : isUserExist.firstName,
            lastName: lastNameIsBlank
              ? createTeamDto.lastName
              : isUserExist.lastName,
          });
        }
      }

      // Persist the team without attaching members to the Team.members
      // relation. That relation points back to `user.team`, so saving the
      // members array would try to rewrite the user's immutable primary
      // team. Membership is tracked through `user_roles` instead.
      const savedTeam = await this.teamRepository.save(team);
      project.teams.push(savedTeam);
      await this.projectRepository.save(project);

      // Assign project admin role if needed
      if (createTeamDto.isProjectViewer) {
        const roleData = await this.roleRepository.findOne({
          where: { name: RoleType.PROJECT_ADMIN },
        });

        if (!roleData) {
          throw new NotFoundException('Project admin role not found');
        }

        if (!project) {
          throw new BadRequestException(
            'Cannot assign project viewer role without a project',
          );
        }

        const userRole = this.userRoleRepository.create({
          user: isUserExist,
          role: roleData,
          project: project.id,
          team: savedTeam.id,
        });

        await this.userRoleRepository.save(userRole);
      }
      await this.cacheService.delByPrefix(USER_AUTH_CACHE_PREFIX);
      return savedTeam;
    } catch (error) {
      throw error;
    }
  }

  // A9/A10: the team lookup used to be by `teamId` alone, so a caller
  // authorized against the CASL-validated `:projectId` in the route could
  // patch (or, via `updateTeamDto.project`, reassign) a team that actually
  // belongs to a completely different project by pasting its id into the
  // URL. Binding the lookup itself to `projectId` closes that - a team from
  // another project now 404s instead of loading. See FINDINGS.md §21a/§21b.
  async update(
    teamId: string,
    updateTeamDto: UpdateTeamDto,
    projectId: string,
  ): Promise<Team> {
    if (!projectId) {
      throw new BadRequestException('Project is required to update a team.');
    }
    // Check if team exists and actually belongs to this project
    const team = await this.teamRepository.findOne({
      where: { id: teamId, projects: { id: projectId } },
      relations: ['projects'], // Pre-load projects to avoid overwriting existing ones if needed
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // Handle project assignment if provided

    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['teams', 'members'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }
    const existingTeam = project.teams.find(
      (team) => team.teamName === updateTeamDto.teamName,
    );

    if (existingTeam) {
      throw new Error(
        `Team name "${updateTeamDto.teamName}" already exists in this project`,
      );
    }
    if (updateTeamDto.project) {
      team.projects = [project];
    }

    if (updateTeamDto.logo) {
      const arr = updateTeamDto.logo.split('/');
      const key = arr[arr.length - 1];

      const file = await this.mediaRepository.create({
        key: `${process.env.S3_FOLDER}/${process.env.NODE_ENV}/${key}`,
        path: updateTeamDto.logo,
      });

      await this.mediaRepository.save(file);
      updateTeamDto.logo = file.id;
    }

    // Handle other properties from DTO using object spread
    // This will only update properties that are defined in the DTO
    const updatableProps = [
      'teamName',
      'address',
      'logo' /* other allowed properties */,
    ];
    for (const prop of updatableProps) {
      if (updateTeamDto[prop] !== undefined) {
        team[prop] = updateTeamDto[prop];
      }
    }

    // Save and return the updated team
    return this.teamRepository.save(team);
  }

  async remove(id: string): Promise<void> {
    const team = await this.findOne({ id });
    await this.teamRepository.remove(team);
  }

  async addTeamMember(createMemberDto: CreateMemberDto): Promise<User> {
    try {
      // A10/A15: `project`/`teamId`/`role` all flow into `where: { id: ... }`
      // lookups below. If any were missing, TypeORM silently drops that
      // key from the predicate and matches an arbitrary row instead of
      // nothing (e.g. the first role in the table, which may be
      // super-admin) - guard them explicitly so a missing value fails
      // closed. See FINDINGS.md §21g.
      if (!createMemberDto.project) {
        throw new BadRequestException({
          success: false,
          statusCode: 400,
          message: `Project is required.`,
          timestamp: new Date().toISOString(),
        });
      }
      if (!createMemberDto.teamId) {
        throw new BadRequestException({
          success: false,
          statusCode: 400,
          message: `Team is required.`,
          timestamp: new Date().toISOString(),
        });
      }
      if (!createMemberDto.role) {
        throw new BadRequestException({
          success: false,
          statusCode: 400,
          message: `Role is required.`,
          timestamp: new Date().toISOString(),
        });
      }

      // A10: bind the team lookup to the caller's project so a team from a
      // different project can never be joined through here, whatever id is
      // passed in. See FINDINGS.md §21b.
      const teamExists = await this.teamRepository.findOne({
        where: {
          id: createMemberDto.teamId,
          projects: { id: createMemberDto.project },
        },
      });
      if (!teamExists) {
        throw new BadRequestException({
          success: false,
          statusCode: 400,
          message: `Team not found.`,
          timestamp: new Date().toISOString(),
        });
      }

      // Find Role
      const role = await this.roleRepository.findOne({
        where: { id: createMemberDto.role },
      });

      // A10: reject system/super-admin-scoped roles outright - without this
      // check, anyone holding ordinary "create team-member" permission on
      // their own project could assign themselves super-admin. Mirrors the
      // check already in projects.service.ts's updateProjectTeamUserRole.
      if (!role || role.name === RoleType.SUPER_ADMIN) {
        throw new BadRequestException({
          success: false,
          statusCode: 400,
          message: `Invalid role selected.`,
          timestamp: new Date().toISOString(),
        });
      }

      const project = await this.projectRepository.findOne({
        where: { id: createMemberDto.project },
        relations: ['members'],
      });
      // Fetch the target team only - a user can be part of multiple
      // projects with different roles, so membership on OTHER teams/
      // projects must not block them from joining this one. Only a
      // duplicate membership on this exact team is rejected below.
      const isTeamExist = await this.teamRepository.findOne({
        where: {
          id: createMemberDto.teamId,
          projects: { id: createMemberDto.project },
        },
        relations: ['members'],
      });

      const isSuperAdmin = await this.userRepository.findOne({
        where: {
          email: ILike(createMemberDto.email),
        },
        relations: ['roles', 'roles.role', 'roles.role.permissions'],
      });
      const checkSystemPerson = getUserScope(isSuperAdmin);
      if (checkSystemPerson === Scope.System) {
        throw new BadRequestException({
          success: false,
          statusCode: 400,
          message: `Super admin cannot be team member`,
          timestamp: new Date().toISOString(),
        });
      }

      if (isTeamExist) {
        // isTeamExist.members is derived from the singular user.team FK and
        // only reflects one "primary" team per user, so it misses a user
        // who already holds a UserRole for this exact team via a *second*
        // project. Check both so re-adding the same (user, team) pair is
        // still rejected as a duplicate either way.
        const hasExistingRoleOnTeam = (isSuperAdmin?.roles ?? []).some(
          (userRole) =>
            userRole.project === createMemberDto.project &&
            userRole.team === createMemberDto.teamId,
        );

        if (createMemberDto.email) {
          const isTeamMemberExist =
            isTeamExist.members.some(
              (member) =>
                member?.email?.toLocaleLowerCase() ===
                createMemberDto?.email?.toLocaleLowerCase(),
            ) ||
            (isSuperAdmin?.email?.toLocaleLowerCase() ===
              createMemberDto?.email?.toLocaleLowerCase() &&
              hasExistingRoleOnTeam);
          if (isTeamMemberExist)
            throw new BadRequestException({
              success: false,
              statusCode: 400,
              message: `The member with email '${createMemberDto.email}' is already a member of the team '${isTeamExist.teamName}'.`,
              timestamp: new Date().toISOString(),
            });
        }

        if (createMemberDto.contactNumber) {
          const isTeamMemberExist =
            isTeamExist.members.some(
              (member) =>
                member.contactNumber === createMemberDto.contactNumber,
            ) ||
            (isSuperAdmin?.contactNumber === createMemberDto.contactNumber &&
              hasExistingRoleOnTeam);
          if (isTeamMemberExist)
            throw new BadRequestException({
              success: false,
              statusCode: 400,
              message: `The member with contact number '${createMemberDto.contactNumber}' is already a member of the team '${isTeamExist.teamName}'.`,
              timestamp: new Date().toISOString(),
            });
        }
      }

      // Find or Create User
      let user = await this.userRepository.findOne({
        where: [
          { email: ILike(createMemberDto.email) },
          { contactNumber: createMemberDto.contactNumber },
        ],
        relations: ['team', 'project'],
      });

      let isNewUser = false;
      if (!user) {
        isNewUser = true;
        user = this.userRepository.create({
          firstName: createMemberDto.firstName,
          lastName: createMemberDto.lastName,
          email: createMemberDto.email,
          contactNumber: createMemberDto.contactNumber,
          project: project,
          team: isTeamExist,
        });

        // Save the new user first to generate an ID
        user = await this.userRepository.save(user);
      }

      // Never rename an existing user from an "add member" form. The name
      // on `users` is that person's identity across every project they
      // belong to, so applying whatever was typed here would rename them
      // globally - the admin adding "A. Kumar" to a second project would
      // silently overwrite "Anil Kumar" everywhere. The form now looks the
      // user up by email/phone first and shows their stored name read-only,
      // but the server must not rely on the client for that.
      //
      // Filling a *blank* name is still allowed: stub users created by an
      // earlier bulk import have no name at all, and setting one there adds
      // information instead of destroying it. Renaming is done deliberately
      // through updateTeamMember / the user's own profile.
      if (!isNewUser) {
        let filledBlank = false;

        if (!user.firstName?.trim() && createMemberDto.firstName?.trim()) {
          user.firstName = createMemberDto.firstName;
          filledBlank = true;
        }
        if (!user.lastName?.trim() && createMemberDto.lastName?.trim()) {
          user.lastName = createMemberDto.lastName;
          filledBlank = true;
        }

        // Keep the user's primary `team` FK immutable. Multi-team membership
        // is represented by `user_roles` and the team members collection, so
        // adding an existing user to another team must not overwrite the
        // original primary team.
        if (filledBlank) {
          await this.userRepository.save(user);
        }
      }

      // Find or Create UserRole (Prevent circular reference)
      let userRole = await this.userRoleRepository.findOne({
        where: {
          user: { id: user.id },
          team: isTeamExist.id,
          role,
          project: project.id,
        },
      });

      if (!userRole) {
        userRole = this.userRoleRepository.create({
          user,
          role,
          team: isTeamExist.id,
          project: createMemberDto.project,
        });

        await this.userRoleRepository.save(userRole);
      }

      console.log('UserRole assigned:', { userRoleId: userRole.id });

      // Send onboarding email to new users with email
      if (isNewUser && user.email) {
        const platformLink = process.env.FRONTEND_PLATFORM || '';
        const template = emailTemplate['onboarding']
          .replace(/{userName}/g, user.firstName || 'there')
          .replace(/{teamName}/g, isTeamExist.teamName || 'your team')
          .replace(/{roleName}/g, role.name || 'team member')
          .replace(/{platformLink}/g, platformLink);

        try {
          await this.mailerService.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: `You have been added to ${isTeamExist.teamName || 'a team'} on Dharini`,
            html: template,
          });
        } catch (err) {
          console.error('Failed to send onboarding email:', err);
        }
      }

      await this.cacheService.delByPrefix(USER_AUTH_CACHE_PREFIX);
      return await this.userRepository.findOne({
        where: { id: user.id },
        relations: ['roles', 'roles.role'],
      });
    } catch (error) {
      console.error('Error adding team member:', error.message);
      throw error;
    }
  }

  // Not named in the assigned task list by line range, but this is the same
  // team-member-write class of bug as addTeamMember/removeTeamMember (A10):
  // the team was looked up by `teamId` alone, so a caller authorized only
  // against their own project's `:projectId` could update - and, via the
  // unrestricted role lookup below, escalate - a member of a team in a
  // completely different project. Fixed the same way. See FINDINGS.md §21b.
  // Membership is resolved from `user_roles`, never from `Team.members`.
  //
  // `Team.members` is @OneToMany(User, user => user.team) - it reflects only
  // the singular `users.teamId` FK, which addTeamMember deliberately leaves
  // untouched ("Keep the user's primary `team` FK immutable... membership is
  // tracked through `user_roles` instead"). Querying
  // `members: { id: memberId }` therefore matched only the one user the team
  // was originally created around, and every member added afterwards failed
  // with "Team member not found." Same root cause as the collector dropdown
  // in projects.service.ts#getMembers.
  //
  // Now that a person can belong to several teams and projects at once, the
  // (project, team, user) triple in `user_roles` is the only thing that
  // identifies a membership - the user row itself carries no such scope.
  async updateTeamMember(updateMemberDto: UpdateMemberDto): Promise<User> {
    try {
      if (!updateMemberDto.projectId) {
        throw new BadRequestException({
          success: false,
          statusCode: 400,
          message: `Project is required.`,
          timestamp: new Date().toISOString(),
        });
      }
      if (!updateMemberDto.teamId) {
        throw new BadRequestException({
          success: false,
          statusCode: 400,
          message: `Team is required.`,
          timestamp: new Date().toISOString(),
        });
      }
      if (!updateMemberDto.memberId) {
        throw new BadRequestException({
          success: false,
          statusCode: 400,
          message: `Member is required.`,
          timestamp: new Date().toISOString(),
        });
      }

      // Binds the team to the CASL-validated route project, so a team from
      // another project can never be edited through here.
      const isTeamExist = await this.teamRepository.findOne({
        where: {
          id: updateMemberDto.teamId,
          projects: { id: updateMemberDto.projectId },
        },
      });
      if (!isTeamExist) {
        throw new BadRequestException({
          success: false,
          statusCode: 400,
          message: `Team not found.`,
          timestamp: new Date().toISOString(),
        });
      }

      const membership = await this.userRoleRepository.findOne({
        where: {
          user: { id: updateMemberDto.memberId },
          team: updateMemberDto.teamId,
          project: updateMemberDto.projectId,
          status: StatusType.ACTIVE,
        },
        relations: ['user'],
      });

      // Legacy fallback: users onboarded before memberships were tracked in
      // `user_roles` have only the primary-team FK. They are still real
      // members of this team, so accept them rather than 404.
      const member =
        membership?.user ??
        (await this.userRepository.findOne({
          where: {
            id: updateMemberDto.memberId,
            team: { id: updateMemberDto.teamId },
          },
        }));

      if (!member) {
        throw new BadRequestException({
          success: false,
          statusCode: 400,
          message: `Team member not found.`,
          timestamp: new Date().toISOString(),
        });
      }

      // Uniqueness is a property of the whole users table, not of this team,
      // and it must ignore the person being edited - otherwise re-saving the
      // form without touching the email ("is this email taken? yes, by
      // themselves") rejected the update. The previous check compared against
      // every *other* team member's email, so it fired on essentially any
      // edit.
      if (updateMemberDto.contactNumber) {
        const clash = await this.userRepository.findOne({
          where: { contactNumber: updateMemberDto.contactNumber },
        });
        if (clash && clash.id !== member.id) {
          throw new BadRequestException({
            success: false,
            statusCode: 400,
            message: `Contact number already exist.`,
            timestamp: new Date().toISOString(),
          });
        }
      }

      if (updateMemberDto.email) {
        const clash = await this.userRepository.findOne({
          where: { email: ILike(updateMemberDto.email) },
        });
        if (clash && clash.id !== member.id) {
          throw new BadRequestException({
            success: false,
            statusCode: 400,
            message: `Email already exist.`,
            timestamp: new Date().toISOString(),
          });
        }
      }

      let role: Role;
      if (updateMemberDto.role) {
        role = await this.roleRepository.findOne({
          where: { id: updateMemberDto.role },
        });
        // A10: same escalation guard as addTeamMember - reject
        // system/super-admin-scoped roles rather than silently accepting
        // an unknown or unrestricted role id.
        if (!role || role.name === RoleType.SUPER_ADMIN) {
          throw new BadRequestException({
            success: false,
            statusCode: 400,
            message: `Invalid role selected.`,
            timestamp: new Date().toISOString(),
          });
        }
      }

      // Scoped to this exact (project, team) membership. The old code took
      // whichever UserRole the user happened to have first, so changing
      // someone's role in one project could rewrite their role in another.
      if (role) {
        const userRole =
          membership ??
          this.userRoleRepository.create({
            user: member,
            team: updateMemberDto.teamId,
            project: updateMemberDto.projectId,
          });
        userRole.role = role;
        await this.userRoleRepository.save(userRole);
      }

      // Update the user row directly. The old code mapped over
      // `isTeamExist.members` and only wrote inside the branch that matched
      // the member id - so for anyone missing from that FK-derived array the
      // request silently succeeded without changing anything. It then
      // reassigned `team.members` and saved the team, which writes back
      // through `user.team` and could move members' primary team.
      //
      // `user.roles` is deliberately not touched here: it is a OneToMany, and
      // assigning it to a single role could detach the memberships this user
      // holds in other projects.
      if (updateMemberDto.email) member.email = updateMemberDto.email;
      if (updateMemberDto.firstName)
        member.firstName = updateMemberDto.firstName;
      if (updateMemberDto.lastName) member.lastName = updateMemberDto.lastName;
      if (updateMemberDto.contactNumber !== undefined) {
        member.contactNumber = updateMemberDto.contactNumber;
      }
      await this.userRepository.save(member);

      await this.cacheService.delByPrefix(USER_AUTH_CACHE_PREFIX);

      return await this.userRepository.findOne({
        where: { id: updateMemberDto.memberId },
        relations: ['roles', 'roles.role'],
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async removeMultipleTeamMembers(params: any, teamMemberIds: any) {
    const queryRunner = this.dataSource.createQueryRunner(); // Create QueryRunner
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const id of teamMemberIds.memberIds) {
        await this.removeTeamMember(
          // A10: `params.projectId` was available here (the controller
          // passes it in) but was never forwarded, so removeTeamMember had
          // nothing to bind its team lookup to. See FINDINGS.md §21b.
          { teamId: params.teamId, memberId: id, projectId: params.projectId },
          queryRunner, // Pass queryRunner
        );
      }

      await queryRunner.commitTransaction(); // Commit transaction

      return { removedMembers: teamMemberIds.memberIds };
    } catch (error) {
      await queryRunner.rollbackTransaction(); // Rollback in case of failure
      throw new Error(error);
    } finally {
      await queryRunner.release(); // Release queryRunner
    }
  }
  // A10: bind the team lookup to `query.projectId` so a caller authorized
  // only against their own project's `:projectId` cannot remove a member
  // from a team that belongs to a different project. `projectId` is
  // required (not merely used when present) precisely because the
  // undefined-drop footgun (§21g) would otherwise let a missing value
  // silently match any team. See FINDINGS.md §21b.
  // Same membership rule as updateTeamMember: the (project, team, user)
  // triple in `user_roles` identifies a membership, not `Team.members`.
  async removeTeamMember(query: any, queryRunner?: QueryRunner) {
    try {
      if (!query?.projectId || !query?.teamId || !query?.memberId) {
        throw new BadRequestException({
          success: false,
          statusCode: 400,
          message: `Project, team and member are required.`,
          timestamp: new Date().toISOString(),
        });
      }
      const isTransactional = !!queryRunner;
      const entityManager = isTransactional
        ? queryRunner.manager
        : this.teamRepository.manager;

      const team = await entityManager.findOne(Team, {
        where: { id: query.teamId, projects: { id: query.projectId } },
      });

      if (!team) {
        throw new BadRequestException({
          success: false,
          statusCode: 400,
          message: `The team with id ${query.teamId} does not exist.`,
          timestamp: new Date().toISOString(),
        });
      }

      // Only this project+team's membership rows. The previous version
      // fetched every UserRole belonging to the user - with no team or
      // project filter at all - and removed them, so taking someone off one
      // team silently revoked their access to every other project they
      // belonged to.
      const scopedRoles = await entityManager.find(UserRole, {
        where: {
          user: { id: query.memberId },
          team: query.teamId,
          project: query.projectId,
        },
      });

      // Legacy members predate `user_roles` carrying team/project and are
      // identified only by the primary-team FK.
      const legacyMember = await entityManager.findOne(User, {
        where: { id: query.memberId, team: { id: query.teamId } },
      });

      if (!scopedRoles.length && !legacyMember) {
        throw new BadRequestException({
          success: false,
          statusCode: 400,
          message: `The member with id ${query.memberId} does not exist.`,
          timestamp: new Date().toISOString(),
        });
      }

      if (scopedRoles.length) {
        await entityManager.remove(scopedRoles);
      }

      // Detach the primary-team FK only when it points at the team being
      // left, otherwise the user keeps showing up in this team's
      // FK-derived `members` collection. Clearing to NULL is permitted by
      // migration 1787's trigger, which blocks only value -> different
      // value. `team.members` is deliberately not reassigned and saved:
      // that writes back through `user.team` for every member in the array.
      if (legacyMember) {
        await entityManager.update(
          User,
          { id: query.memberId },
          { team: null },
        );
      }

      await this.cacheService.delByPrefix(USER_AUTH_CACHE_PREFIX);
    } catch (error) {
      console.error('Errors in removeTeamMember', error);
      throw error;
    }
  }

  async getTeamMembers(query: any): Promise<any> {
    try {
      const isTeamMemberExist = await this.teamRepository.findOne({
        where: { id: query.team },
        relations: ['members', 'members.roles', 'members.roles.role'], // Ensure members are fetched
      });

      // Save the team to the database
      return isTeamMemberExist.members;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async scriptTeamMember(): Promise<any[]> {
    try {
      const teams = await this.teamRepository.find({
        select: ['id', 'email'], // Fetch only team IDs
        relations: ['members', 'members.roles', 'members.roles.role'],
      });

      const emails = teams.map((team) => team.email);
      const users = await this.userRepository.find({
        where: { email: In(emails) },
        select: ['id', 'email'], // Fetch only team IDs
        relations: ['project', 'team', 'roles', 'roles.role'],
      });

      const role = await this.roleRepository.findOne({
        where: { name: RoleType.TEAM_ADMIN },
      });
      for (const user of users) {
        // const userIds = team.members.map(({ id }) => ({id}));
        const payload = {
          user: { id: user.id }, // Primary key or unique identifier
          project: user.project?.id || null, // Ensure project is stored as an ID
          role: { id: role.id }, // Direct role ID
        };

        const data: any = await this.userRoleRepository.findOne({
          where: payload,
        });

        if (data.team === null || data.team === undefined) {
          await this.userRoleRepository.save({ ...data, team: user.team?.id });
        }
      }
      console.log('Script executed for add to user role');
      return teams;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
