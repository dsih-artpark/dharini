import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invite } from 'src/entities/invite.entity';
import { Otp } from 'src/entities/otp.entity';
import { Project } from 'src/entities/project.entity';
import { Team } from 'src/entities/team.entity';
import { User } from 'src/entities/user.entity';
import { InvitesService } from '../invites/invites.service';
import { MailerService } from '../mailer/mailer.service';
import { OtpService } from '../otp/otp.service';
import { UsersModule } from '../users/users.module';
import { UserService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserRole } from 'src/entities/user-role.entity';
import { Media } from 'src/entities/media.entity';
import { MulterConfigService } from '../media/media.service';
import { Region } from 'src/entities/region.entity';
import { Role } from 'src/entities/role.entity';
import { Workspace } from 'src/entities/workspace.entity';
import { OtpAttemptGuardService } from 'src/common/otp/otp-attempt-guard.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
    TypeOrmModule.forFeature([
      User,
      Otp,
      Invite,
      Project,
      Team,
      UserRole,
      Media,
      Region,
      Role,
      Workspace,
    ]),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    UserService,
    OtpService,
    MailerService,
    InvitesService,
    MulterConfigService,
    OtpAttemptGuardService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
