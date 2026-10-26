import { StatusType } from '../common/enums/status.enum';

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';
import { Workspace } from './workspace.entity';
import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity('user_roles')
export class UserRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Role, (role) => role.userRoles, { onDelete: 'CASCADE' })
  role: Role;

  @Column({ nullable: true })
  team?: string | null;

  @Column({ nullable: true })
  project?: string | null;

  @Exclude()
  @ApiHideProperty()
  // See Workspace.createdBy for why the constraint name is pinned here.
  @ManyToOne(() => Workspace, { nullable: true })
  @JoinColumn({
    name: 'workspace_id',
    foreignKeyConstraintName: 'FK_user_roles_workspace_id',
  })
  workspace?: Workspace | null;

  @Column({
    type: 'enum',
    enum: StatusType,
    default: StatusType.ACTIVE,
  })
  status: StatusType;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @ManyToOne(() => User, (user) => user.roles, { onDelete: 'CASCADE' })
  user: User;
}
