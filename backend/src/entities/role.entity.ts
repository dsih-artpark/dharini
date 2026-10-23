import { StatusType } from '../common/enums/status.enum';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Permission } from './permission.entity';
import { UserRole } from './user-role.entity';
import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  // Deliberately defaults to the *narrowest* scope. It used to default to
  // 'system', so any role created outside the seeder silently became
  // system-scoped - i.e. full manage-all - which is exactly backwards for a
  // column that decides authorization.
  @Column({ type: 'varchar', default: 'project' })
  scope: string;

  @Column({ type: 'varchar', default: 'pre-defined' })
  type: string;

  @Column({ type: 'enum', enum: StatusType, default: StatusType.ACTIVE })
  status: StatusType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: Permission[];

  @Exclude()
  @ApiHideProperty()
  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];
}
