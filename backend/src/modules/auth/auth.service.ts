import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Scope } from 'src/common/enums/scope.enum';
import { RoleType } from 'src/common/enums/user-type.enum';
import { getUserScope } from 'src/common/functions/get-user-role';
import {
  generateOtp,
  shouldUseFixedTestOtp,
} from 'src/common/functions/generate-otp';
import { OtpAttemptGuardService } from 'src/common/otp/otp-attempt-guard.service';
import { Otp } from 'src/entities/otp.entity';
import { Role } from 'src/entities/role.entity';
import { Team } from 'src/entities/team.entity';
import { User } from 'src/entities/user.entity';
import { UserRole } from 'src/entities/user-role.entity';
import { Workspace } from 'src/entities/workspace.entity';
import { UserService } from 'src/modules/users/users.service';
import { DataSource, ILike, Repository } from 'typeorm';
import { InvitesService } from '../invites/invites.service';
import { MailerService } from '../mailer/mailer.service';
import { OtpService } from '../otp/otp.service';
import { SignupDto } from './dtos/signup.dto';
import { VerifySignupDto } from './dtos/verify-signup.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UserService,
    private otpService: OtpService,
    private mailerService: MailerService,
    private inviteService: InvitesService,
    private jwtService: JwtService,
    private dataSource: DataSource,
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly otpAttemptGuard: OtpAttemptGuardService,
  ) {}

  // Nullable existence check by email OR phone - only used where "no match"
  // is a normal, expected outcome (signup/verifySignup). Only include a
  // condition per field actually provided, since passing `undefined` into a
  // TypeORM where-array entry would leave that OR-branch with no criteria
  // at all and risk matching every row.
  private async findUserByEmailOrPhone(
    email?: string,
    phone?: string,
  ): Promise<User | null> {
    const conditions: Array<Record<string, unknown>> = [];
    if (email) conditions.push({ email: ILike(email) });
    if (phone) conditions.push({ contactNumber: phone });
    if (!conditions.length) return null;

    return this.userRepository.findOne({ where: conditions });
  }

  async validateUser(username: string): Promise<any> {
    return await this.usersService.findOne({ username });
  }

  async login(data: any) {
    try {
      const existUser = await this.usersService.findOne({
        email: data.email,
        contactNumber: data.phone,
      });
      const userData = await this.userRepository.findOne({
        where: {
          email: data.email,
          contactNumber: data.phone,
        },
        relations: ['roles', 'roles.role', 'roles.role.permissions'],
      });

      const userScope = getUserScope(userData);
      if (!existUser) {
        throw new Error('User not found');
      }

      // 2.8: a brand-new signup user (Phase 3) has a workspace-scoped
      // UserRole but no Team — must not be rejected here. Team membership
      // is now only required when the user holds neither an elevated
      // System/Project scope NOR any Workspace-scoped role.
      const bypassesTeamCheck =
        userScope === Scope.System ||
        userScope === Scope.Project ||
        userScope === Scope.Workspace;
      if (!bypassesTeamCheck) {
        const teams = await this.teamRepository.findOne({
          where: {
            members: [
              { email: ILike(data.email) },
              { contactNumber: data.phone },
            ],
          },
          relations: ['members'],
        });

        if (!teams) {
          throw new Error('You are not a member of any team');
        }
      }

      let otpData = await this.otpRepository.findOne({
        where: [{ email: ILike(data.email) }, { contactNumber: data.phone }],
      });

      const otp = generateOtp();
      const otpDataExist = await this.otpRepository.findOne({
        where: [{ email: ILike(data.email) }, { contactNumber: data.phone }],
      });

      if (!otpDataExist) {
        const otpDataPayload = {
          contactNumber: data.phone,
          email: data.email,
          otp,
          otpExpireTime: new Date(Date.now() + 3 * 60 * 1000),
        };
        if (!otpData && existUser) {
          // If the user does not exist, create a new one
          otpData = this.otpRepository.create(otpDataPayload);
        } else {
          // If the user exists, update the existing user
          otpData = await this.otpRepository.findOne({
            where: [
              { email: ILike(data.email) },
              { contactNumber: data.phone },
            ],
          });
          otpData.otp = otp;
        }
      }

      otpData.otp = otp;
      otpData.otpExpireTime = new Date(Date.now() + 3 * 60 * 1000);
      await this.otpRepository.save(otpData);

      if (data.email) {
        const emailData: any = {
          to: data.email,
          from: process.env.EMAIL_FROM,
          subject: `Your Dharini sign-in code`,
          html: await this.inviteService.generateTemplate({
            role: 'login',
            otp,
            purpose: 'sign in to Dharini',
            reason: 'a sign-in was requested for Dharini',
          }),
        };

        if (!shouldUseFixedTestOtp()) {
          await this.mailerService.sendMail(emailData);
        }
      }

      if (data.phone) {
        const phonePayload = {
          contactNumber: data.phone,
          message: `Your login OTP is ${otp.toString()}. Use this code to verify your login. This OTP is valid for 3 minutes. Do not share it with anyone.`,
        };
        if (!shouldUseFixedTestOtp()) {
          await this.otpService.sendSms(phonePayload);
        }
      }
    } catch (error) {
      this.logger.error(
        'Login failed',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  // 3.1, step 1: send an OTP to a brand-new contact that has no account
  // yet. Deliberately the inverse of login()'s existUser check — signup
  // rejects contacts that already have an account (they should log in
  // instead), and never touches the Team requirement.
  async signup(data: SignupDto) {
    try {
      // NOTE: deliberately NOT usersService.findOne() here - it throws
      // BadRequestException('User not found') when there's no match instead
      // of returning null/undefined, which is exactly the normal/expected
      // case for a brand-new signup and was blocking every first-time signup
      // with a bogus "User not found" error. Use a direct, nullable repo
      // lookup instead, same idiom login() already uses below. Only include
      // a condition per field that's actually provided (email/phone are
      // both optional, at least one required) - passing `undefined` into a
      // TypeORM where-array entry would otherwise leave that OR-branch with
      // no criteria at all and risk matching every row.
      const existingUser = await this.findUserByEmailOrPhone(
        data.email,
        data.phone,
      );
      if (existingUser) {
        throw new BadRequestException(
          'An account with this email or phone already exists. Please log in instead.',
        );
      }

      let otpData = await this.otpRepository.findOne({
        where: [{ email: ILike(data.email) }, { contactNumber: data.phone }],
      });

      const otp = generateOtp();

      if (!otpData) {
        otpData = this.otpRepository.create({
          contactNumber: data.phone,
          email: data.email,
        });
      }
      otpData.otp = otp;
      otpData.otpExpireTime = new Date(Date.now() + 3 * 60 * 1000);
      await this.otpRepository.save(otpData);

      if (data.email) {
        const emailData: any = {
          to: data.email,
          from: process.env.EMAIL_FROM,
          subject: `Your Dharini verification code`,
          html: await this.inviteService.generateTemplate({
            role: 'login',
            otp,
            purpose: 'create your Dharini workspace',
            reason: 'a new Dharini workspace was requested',
          }),
        };
        if (!shouldUseFixedTestOtp()) {
          await this.mailerService.sendMail(emailData);
        }
      }

      if (data.phone) {
        const phonePayload = {
          contactNumber: data.phone,
          message: `Your signup OTP is ${otp.toString()}. Use this code to create your workspace. This OTP is valid for 3 minutes. Do not share it with anyone.`,
        };
        if (!shouldUseFixedTestOtp()) {
          await this.otpService.sendSms(phonePayload);
        }
      }
    } catch (error) {
      this.logger.error(
        'Signup failed',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  // 3.1, step 2: verify the OTP from signup() and atomically create the
  // User + Workspace + workspace-admin UserRole in a single DB transaction
  // (per the design doc: splitting user-creation from workspace-creation
  // risks a non-atomic implementation). Returns a JWT in the same shape
  // as login's verify-otp flow.
  async verifySignup(data: VerifySignupDto) {
    const attemptKey = this.otpAttemptGuard.key({
      email: data.email,
      phone: data.phone,
    });
    const attempts =
      await this.otpAttemptGuard.assertAttemptsRemaining(attemptKey);

    const otpData = await this.otpRepository.findOne({
      where: [{ email: ILike(data.email) }, { contactNumber: data.phone }],
    });
    if (!otpData) {
      throw new BadRequestException('No signup OTP found for this email/phone');
    }
    if (otpData.otp !== data.otp) {
      await this.otpAttemptGuard.recordFailedAttempt(attemptKey, attempts);
      throw new BadRequestException('Invalid OTP');
    }
    if (!otpData.otpExpireTime || new Date() > otpData.otpExpireTime) {
      throw new BadRequestException('OTP expired');
    }

    // Same fix as signup() above - use a direct, nullable repo lookup
    // instead of usersService.findOne() (which throws on no-match).
    const existingUser = await this.findUserByEmailOrPhone(
      data.email,
      data.phone,
    );
    if (existingUser) {
      throw new BadRequestException(
        'An account with this email or phone already exists. Please log in instead.',
      );
    }

    const workspaceAdminRole = await this.roleRepository.findOne({
      where: { name: RoleType.WORKSPACE_ADMIN },
    });
    if (!workspaceAdminRole) {
      throw new Error('workspace-admin role is not seeded');
    }

    const user = await this.dataSource.transaction(async (manager) => {
      const newUser = await manager.save(
        manager.create(User, {
          email: data.email,
          contactNumber: data.phone,
          firstName: data.firstName,
          lastName: data.lastName,
        }),
      );

      const workspace = await manager.save(
        manager.create(Workspace, {
          name: data.workspaceName,
          createdBy: newUser,
        }),
      );

      await manager.save(
        manager.create(UserRole, {
          user: newUser,
          role: workspaceAdminRole,
          workspace,
        }),
      );

      return newUser;
    });

    await this.otpRepository.update(
      { id: otpData.id },
      { otp: null, otpExpireTime: null },
    );
    await this.otpAttemptGuard.clear(attemptKey);

    const payload = { subject: user.id };
    return { accessToken: await this.jwtService.sign(payload) };
  }
}
