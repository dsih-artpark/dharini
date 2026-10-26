import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  Inject,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { RoleType } from 'src/common/enums/roles.enum';
import { formatString } from 'src/common/functions/formate-string';
import { Invite } from 'src/entities/invite.entity';
import { Otp } from 'src/entities/otp.entity';
import { Project } from 'src/entities/project.entity';
import { Role } from 'src/entities/role.entity';
import { Team } from 'src/entities/team.entity';
import { User } from 'src/entities/user.entity';
import { UserRole } from 'src/entities/user-role.entity';
import { Workspace } from 'src/entities/workspace.entity';
import { In, Repository } from 'typeorm';
import { ISmsProvider } from 'src/common/sms/sms-provider.interface';
import { SMS_PROVIDER } from 'src/common/sms/sms-provider.token';
import { formatIndianPhoneNumber } from 'src/common/sms/functions/format-phone-number';
import { Scope } from 'src/common/enums/scope.enum';
import { getUserScopeFromRole } from 'src/common/functions/get-user-role';
import { RedisCacheService } from '../../common/cache/redis-cache.service';
import { USER_AUTH_CACHE_PREFIX } from '../../common/cache/cache-keys';
import { MailerService } from '../mailer/mailer.service';
import { emailTemplate } from '../mailer/temaplates';
import { EmailOtpDto } from '../otp/dto/email-otp.dto';
import { SmsOtpDto } from '../otp/dto/sms-otp.dto';
import { UserService } from '../users/users.service';
import { TenantScopeService } from '../../common/authorization/tenant-scope.service';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import { CreateInviteDto } from './dto/create-invite.dto';
import { CreateWorkspaceInviteDto } from './dto/create-workspace-invite.dto';
import { InvitePartnerDto } from './dto/invite-partner.dto';
@Injectable()
export class InvitesService {
  private readonly logger = new Logger(InvitesService.name);
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
    @InjectRepository(Invite)
    private readonly inviteRepository: Repository<Invite>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    private readonly userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
    private readonly mailerService: MailerService,
    private readonly cacheService: RedisCacheService,
    private readonly tenantScopeService: TenantScopeService,
    @Inject(SMS_PROVIDER) private readonly smsProvider: ISmsProvider,
  ) {}

  generateRandomString(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!_-.';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(crypto.randomInt(charactersLength));
    }
    return result;
  }
  async sendInvite(createInviteDto: CreateInviteDto) {
    const project = await this.projectRepository.findOne({
      where: { id: createInviteDto.projectId },
    });

    const payload: any = {
      email: createInviteDto.email,
      role: createInviteDto.role,
    };

    // Create expire date
    const now = new Date();
    const futureDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Add 24 hours

    const invitePayload: CreateInviteDto = {
      ...createInviteDto,
      isPrimary: createInviteDto.isPrimary,
      email: createInviteDto.email,
      role: payload.role as RoleType,
      invitedBy: createInviteDto.invitedBy.id,
      inviteToken: this.generateRandomString(30),
    };
    const invite = await this.inviteRepository.create(
      invitePayload as Partial<Invite>,
    );

    const emailData: any = {
      email: createInviteDto.email,
      projectName: project.name,
      userName: createInviteDto.username,
      role: createInviteDto.role,
      inviteLink: `${process.env.FRONTEND_PLATFORM}project-invitation/${invite.inviteToken}`,
    };

    await this.sendEmail(emailData);

    invite.expirationDate = futureDate;
    return await this.inviteRepository.save(invite);
  }

  async sendInviteToPartners(invitePartnersDto: InvitePartnerDto) {
    try {
      const { collectors, individualContractors, invitedBy, projectId } =
        invitePartnersDto;
      const project = await this.projectRepository.findOne({
        where: { id: projectId },
        relations: ['members'],
      });

      const invitePayload = [];
      // Create expire date
      const now = new Date();
      const futureDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Add 24 hours

      if (individualContractors?.length) {
        const contractorEmails = individualContractors
          .map((element) => element.email)
          .filter((email) => !!email);

        // Batch: one ILIKE ANY(...) query instead of one ILike() findOne per
        // contractor. ILIKE ANY(:emails) with plain (non-wildcard) email
        // strings performs the same case-insensitive equality comparison
        // Postgres does for ILike(element.email), just against every email
        // in a single round trip.
        const contractorUsers = contractorEmails.length
          ? await this.userRepository
              .createQueryBuilder('user')
              .where('user.email ILIKE ANY(:emails)', {
                emails: contractorEmails,
              })
              .getMany()
          : [];

        const contractorUserByEmail = new Map(
          contractorUsers.map((user) => [user.email.toLowerCase(), user]),
        );

        const contractPayload = individualContractors.map((element) => {
          const existUser = element.email
            ? contractorUserByEmail.get(element.email.toLowerCase())
            : undefined;
          return {
            ...element,
            user: existUser ? existUser.id : null,
            email: element.email,
            projectId,
            inviteeType: 'individual-contractor',
            invitedBy: invitedBy.id,
            inviteToken: this.generateRandomString(30),
            expirationDate: futureDate,
          };
        });
        invitePayload.push(...contractPayload);
      }

      if (collectors?.length) {
        const collectorContactNumbers = collectors
          .map((element) => element.contactNumber)
          .filter((contactNumber) => !!contactNumber);

        // Batch: one find(In(...)) query instead of one findOne per collector.
        const collectorUsers = collectorContactNumbers.length
          ? await this.userRepository.find({
              where: { contactNumber: In(collectorContactNumbers) },
            })
          : [];

        const collectorUserByContactNumber = new Map(
          collectorUsers.map((user) => [user.contactNumber, user]),
        );

        const collectorPayload = collectors.map((element) => {
          const existUser = collectorUserByContactNumber.get(
            element.contactNumber,
          );
          return {
            ...element,
            user: existUser ? existUser.id : null,
            projectId,
            inviteeType: 'user',
            invitedBy: invitedBy.id,
            inviteToken: this.generateRandomString(30),
            expirationDate: futureDate,
          };
        });
        invitePayload.push(...collectorPayload);
      }

      const invite = await this.inviteRepository.create(
        invitePayload as Partial<Invite>,
      );

      const invites: any = await this.inviteRepository.save(invite);
      this.logger.log(
        `Created ${invites.length} invite(s) for project ${projectId}`,
      );

      invites.forEach(async (element) => {
        if (element.role === RoleType.COLLECTOR) {
          const message = `You've been invited to join ${project.name} as a ${RoleType.COLLECTOR}.\nAccept here: ${process.env.FRONTEND_PLATFORM}project-invitation/${element.inviteToken}.\n Team Dharini`;
          return await this.sendSms({
            contactNumber: element.contactNumber,
            message,
          });
        }

        const emailData: EmailOtpDto = {
          email: element.email,
          projectName: project.name,
          userName: 'User',
          role: element.role,
          inviteLink: `${process.env.FRONTEND_PLATFORM}project-invitation/${element.inviteToken}`,
        };

        await this.sendEmail(emailData);
      });

      return await this.inviteRepository.save(invites);
    } catch (error) {
      this.logger.error(
        'Failed to invite partners',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  async acceptInvite(acceptInviteDto: AcceptInviteDto) {
    try {
      const inviteDetails = await this.inviteRepository.findOne({
        where: { inviteToken: acceptInviteDto.inviteToken },
      });
      if (!inviteDetails) {
        throw new Error('Invalid invite token');
      }

      const now = new Date();
      const isExpired = now > inviteDetails.expirationDate;

      if (inviteDetails.expirationDate && isExpired) {
        throw new Error('Invitation link expired');
      }

      // Workspace invites (2.7) are a self-contained flow: short-circuit
      // here rather than falling into the project/team logic below, which
      // is left completely untouched for the legacy invite paths.
      if (inviteDetails.workspaceId) {
        // FIX-PLAN C4: the `accepted` gate must be checked BEFORE minting a
        // token, not after — otherwise a leaked invite link is replayable
        // for the full 24h expiration window, handing out a fresh 60-day
        // JWT on every replay instead of being single-use.
        if (inviteDetails.accepted) {
          throw new Error('Invitation link has already been used');
        }
        return this.acceptWorkspaceInvite(inviteDetails);
      }

      const project = await this.projectRepository.findOne({
        where: { id: inviteDetails.projectId },
        relations: ['projectAdmins', 'members', 'teams'],
      });

      let user: User;
      if (inviteDetails.accepted) {
        user = await this.userService.findOne({
          id: inviteDetails.user,
          email: inviteDetails.email,
          contactNumber: inviteDetails.contactNumber,
        });
      } else {
        const userDto: any = {
          ...inviteDetails,
          email: inviteDetails.email,
          projectId: inviteDetails.projectId,
        };
        user = await this.userService.findOne({
          id: inviteDetails.user,
          email: inviteDetails.email,
          contactNumber: inviteDetails.contactNumber,
        });

        if (!user) user = await this.userService.create(userDto);

        let team: Team = await this.teamRepository.findOne({
          where: [{ id: inviteDetails.team }, { email: inviteDetails.email }],
        });
        if (!team) {
          team = await this.teamRepository.save({
            email: inviteDetails.email,
            teamName: inviteDetails.teamName,
            username: inviteDetails.username,
            teamType: inviteDetails.role,
            projectId: inviteDetails.projectId,
            isProjectViewer: inviteDetails.isProjectViewer,
            projects: [project],
            members: [],
          });
        }

        // let teamMember: TeamMember = await this.teamMemberRepository.findOne({
        //   where: [{ user: { id: user.id } }, { team: { id: team.id } }],
        // });

        // if (!teamMember) {
        //   teamMember = await this.teamMemberRepository.save({
        //     user,
        //     team,
        //     role: inviteDetails.role as RoleType,
        //   });
        // }
        team = await this.teamRepository.findOne({
          where: { id: team.id },
          relations: ['members', 'projects'],
        });

        team.members.push(user);

        if (user && inviteDetails) {
          const invite = await this.inviteRepository.update(
            { id: inviteDetails?.id },
            { accepted: true },
          );

          if (invite.affected === 0) {
            throw new Error('Invalid invite token');
          }
        }

        // Find the member by their ids
        if (user) {
          const members = await this.userRepository.findBy({
            id: In([user?.id]),
          });
          if (inviteDetails.isProjectViewer) {
            project.projectAdmins.push(...members);
          }

          project.teams.push(team);
          await this.projectRepository.save(project);
        }
      }

      if (user) {
        const payload = {
          subject: user?.id,
        };
        return {
          accessToken: await this.jwtService.sign(payload),
        };
      }
    } catch (error) {
      this.logger.error(
        'Failed to accept invite',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  // 2.7: creates a workspace-scoped Invite row. Only a system-scope user or
  // someone who directly ADMINISTERS this specific workspace may invite into
  // it. FINDINGS.md §3 / FIX-PLAN A5: the previous check only confirmed the
  // caller held ANY role tied to the workspace (plain membership), so a
  // non-admin member of workspace B could invite anyone into B — including
  // as workspace-admin. TenantScopeService.administersWorkspace() below
  // requires the matching role to actually confer admin: either it's
  // literally the seeded 'workspace-admin' role, or its permissions grant
  // 'manage' on 'workspace-member' (the same permission the route's own
  // controller-level @CheckPolicies checks) — mirrors the same fix applied at
  // AccessService.update()'s workspace branch. There's no :workspaceId route
  // param here for AbilityFactory to key off of, hence this explicit check.
  async sendWorkspaceInvite(
    createWorkspaceInviteDto: CreateWorkspaceInviteDto,
    invitedBy: any,
  ): Promise<Invite> {
    const { email, workspaceId, roleId, firstName, lastName } =
      createWorkspaceInviteDto;

    const callerScope = getUserScopeFromRole(invitedBy?.roles ?? []);
    const administersWorkspace = this.tenantScopeService.administersWorkspace(
      invitedBy,
      workspaceId,
    );
    if (callerScope !== Scope.System && !administersWorkspace) {
      throw new ForbiddenException('You do not administer this workspace');
    }

    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId },
    });
    if (!workspace) throw new NotFoundException('Workspace not found');

    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) throw new NotFoundException('Role not found');
    if (role.scope !== Scope.Workspace) {
      throw new BadRequestException(
        'Only workspace-scoped roles can be assigned via a workspace invite',
      );
    }

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      const alreadyMember = await this.userRoleRepository.findOne({
        where: {
          user: { id: existingUser.id },
          workspace: { id: workspaceId },
        },
      });
      if (alreadyMember) {
        throw new BadRequestException(
          'This user is already a member of this workspace',
        );
      }
    }

    const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const invite = this.inviteRepository.create({
      email,
      firstName,
      lastName,
      workspaceId,
      // Reuses the entity's generic `role` string column, which the legacy
      // project/team flow stores a RoleType name in — here it stores the
      // invited Role's UUID instead. Kept as-is rather than adding a
      // dedicated column, since the column is already untyped/free-form.
      role: role.id,
      invitedBy,
      inviteToken: this.generateRandomString(30),
      expirationDate,
      accepted: false,
    });
    const savedInvite = await this.inviteRepository.save(invite);

    try {
      await this.mailerService.sendMail({
        to: email,
        from: process.env.EMAIL_FROM,
        subject: `Invitation to join ${workspace.name} on Dharini`,
        html: `<p>You have been invited to join the workspace <strong>${workspace.name}</strong> on Dharini as ${role.name}. Dharini is a disease surveillance and sample collection platform run by ARTPARK.</p><p>You are receiving this email because an administrator added your email address to this workspace. To accept, enter this invite code in Dharini: <strong>${savedInvite.inviteToken}</strong></p><p>If you were not expecting this invitation, you can ignore this email.</p><p>Dharini team, ARTPARK</p>`,
      });
    } catch (error) {
      this.logger.error(
        'Failed to send workspace invite email',
        error instanceof Error ? error.stack : String(error),
      );
    }

    return savedInvite;
  }

  // 2.7's core fix: unlike the legacy project/team acceptance path, this
  // explicitly creates the UserRole for the invited workspace — the
  // original acceptInvite() created a User but never created a
  // corresponding UserRole at all.
  private async acceptWorkspaceInvite(inviteDetails: Invite) {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: inviteDetails.workspaceId },
    });
    if (!workspace) {
      throw new Error('Workspace no longer exists');
    }

    const role = await this.roleRepository.findOne({
      where: { id: inviteDetails.role },
    });
    if (!role) {
      throw new Error('Invited role no longer exists');
    }

    let user = await this.userRepository.findOne({
      where: { email: inviteDetails.email },
    });
    if (!user) {
      user = await this.userRepository.save(
        this.userRepository.create({
          email: inviteDetails.email,
          firstName: inviteDetails.firstName,
          lastName: inviteDetails.lastName,
        }),
      );
    }

    const existingWorkspaceRole = await this.userRoleRepository.findOne({
      where: { user: { id: user.id }, workspace: { id: workspace.id } },
    });
    if (!existingWorkspaceRole) {
      const userRole = this.userRoleRepository.create({
        user,
        role,
        workspace,
      });
      await this.userRoleRepository.save(userRole);
    }

    if (!inviteDetails.accepted) {
      await this.inviteRepository.update(
        { id: inviteDetails.id },
        { accepted: true },
      );
    }

    await this.cacheService.delByPrefix(USER_AUTH_CACHE_PREFIX);

    const payload = { subject: user.id };
    return { accessToken: await this.jwtService.sign(payload) };
  }

  async getInviteByToken(acceptInviteDto: AcceptInviteDto) {
    return await this.inviteRepository.findOne({
      where: { inviteToken: acceptInviteDto.inviteToken },
    });
  }

  async getInvites(query: any) {
    return await this.inviteRepository.find({ where: query });
  }

  async sendSms(smsOtpDto: SmsOtpDto): Promise<boolean> {
    try {
      await this.smsProvider.sendSms(
        formatIndianPhoneNumber(smsOtpDto.contactNumber),
        smsOtpDto.message,
      );
      return true;
    } catch (error) {
      this.logger.error(
        'Failed to send SMS',
        error instanceof Error ? error.stack : String(error),
      );
      return false;
    }
  }

  // Deliberately not logging emailOtpDto or the constructed message: the
  // invite link embeds a plaintext inviteToken, and `html` carries it again
  // via generateTemplate() - same reasoning as OtpService.sendEmail.
  async sendEmail(emailOtpDto: any): Promise<any> {
    const msg: any = {
      to: emailOtpDto.email,
      from: process.env.EMAIL_FROM,
      subject: `Invitation to join ${emailOtpDto.projectName || 'a project'} on Dharini`,
      html: await this.generateTemplate(emailOtpDto),
    };

    try {
      const response = await this.mailerService.sendMail(msg);
      this.logger.log('Email sent successfully');
      return response;
    } catch (error) {
      this.logger.error(
        'Failed to send email',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  async generateTemplate(emailData: any): Promise<string> {
    const template = emailTemplate[emailData?.role];
    emailData.role = formatString(emailData.role);
    return template?.replace(/{(\w+)}/g, (_, key) => {
      return emailData[key] !== undefined ? emailData[key] : `{${key}}`;
    });
  }
}
