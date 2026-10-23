import { Module } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from 'src/entities/otp.entity';
import { User } from 'src/entities/user.entity';
import { JwtStrategy } from '../auth/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from '../users/users.service';
import { UserRole } from 'src/entities/user-role.entity';
import { Project } from 'src/entities/project.entity';
import { Media } from 'src/entities/media.entity';
import { MulterConfigService } from '../media/media.service';
import { Region } from 'src/entities/region.entity';
import { MailerService } from '../mailer/mailer.service';
import { SmsModule } from 'src/common/sms/sms.module';
import { OtpAttemptGuardService } from 'src/common/otp/otp-attempt-guard.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Otp, User, UserRole, Project, Media, Region]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
    ConfigModule,
    SmsModule,
  ],
  controllers: [OtpController],
  providers: [
    OtpService,
    JwtStrategy,
    UserService,
    MulterConfigService,
    MailerService,
    OtpAttemptGuardService,
  ],
})
export class OtpModule {}
