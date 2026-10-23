import { Module, OnModuleInit } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.entity';
import { ErrorHandlingService } from 'src/common/service/errorHandle.service';
import { Permission } from 'src/entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission])],
  controllers: [RolesController],
  providers: [RolesService, ErrorHandlingService],
})
export class RolesModule implements OnModuleInit {
  constructor(private readonly errorHandlingService: ErrorHandlingService) {}

  onModuleInit() {
    this.errorHandlingService.registerModuleMessages('roles', {
      '23505': 'Role with this name already exists',
      // Add more error codes and messages as needed
    });
  }
}
