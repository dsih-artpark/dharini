import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from 'src/entities/otp.entity';
import { Permission } from 'src/entities/permission.entity';
import { Role } from 'src/entities/role.entity';
import { User } from 'src/entities/user.entity';
import { RolesService } from '../roles/roles.service';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { UserRole } from 'src/entities/user-role.entity';
import { Project } from 'src/entities/project.entity';
import { RegionService } from '../region/region.service';
import { Region } from 'src/entities/region.entity';
import { Media } from 'src/entities/media.entity';
import { MulterConfigService } from '../media/media.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      Permission,
      Otp,
      UserRole,
      Project,
      Region,
      Media,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, RolesService, RegionService, MulterConfigService],
})
export class UsersModule {}
