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
import { JwtStrategy } from '../auth/jwt.strategy';
import { MailerService } from '../mailer/mailer.service';
import { UserService } from '../users/users.service';
import { InvitesController } from './invites.controller';
import { InvitesService } from './invites.service';
import { UserRole } from 'src/entities/user-role.entity';
import { Media } from 'src/entities/media.entity';
import { MulterConfigService } from '../media/media.service';
import { Region } from 'src/entities/region.entity';
import { Role } from 'src/entities/role.entity';
import { Workspace } from 'src/entities/workspace.entity';
import { SmsModule } from 'src/common/sms/sms.module';
@Module({
  imports: [
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
      Otp,
      Invite,
      User,
      Team,
      Project,
      UserRole,
      Media,
      Region,
      Role,
      Workspace,
    ]),
    ConfigModule,
    SmsModule,
  ],
  controllers: [InvitesController],
  providers: [
    InvitesService,
    JwtStrategy,
    UserService,
    MailerService,
    MulterConfigService,
  ],
})
export class InvitesModule {}
