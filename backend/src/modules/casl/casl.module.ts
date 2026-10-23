import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbilityFactory } from 'src/common/casl/abitlity.factory';
import { Permission } from 'src/entities/permission.entity';
import { Project } from 'src/entities/project.entity';
import { Role } from 'src/entities/role.entity';
import { Otp } from 'src/entities/otp.entity';
import { User } from 'src/entities/user.entity';
import { PermissionsService } from '../permissions/permissions.service';
import { RolesService } from '../roles/roles.service';
import { UserService } from '../users/users.service';
import { UserRole } from 'src/entities/user-role.entity';
import { Media } from 'src/entities/media.entity';
import { MulterConfigService } from '../media/media.service';
import { Region } from 'src/entities/region.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Permission,
      Role,
      Project,
      Otp,
      UserRole,
      Media,
      Region,
    ]),
  ],
  providers: [
    AbilityFactory,
    UserService,
    PermissionsService,
    RolesService,
    MulterConfigService,
  ],
  exports: [AbilityFactory, UserService, PermissionsService, RolesService],
})
export class CaslModule {}
