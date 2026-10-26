import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/entities/project.entity';
import { Role } from 'src/entities/role.entity';
import { User } from 'src/entities/user.entity';
import { UserRole } from 'src/entities/user-role.entity';
import { Workspace } from 'src/entities/workspace.entity';
import { AccessController } from './access.controller';
import { AccessService } from './access.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, User, UserRole, Workspace, Project]),
  ],
  controllers: [AccessController],
  providers: [AccessService],
})
export class AccessModule {}
