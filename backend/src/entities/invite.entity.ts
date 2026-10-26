import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Workspace } from './workspace.entity';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity('invites')
export class Invite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @ManyToOne(() => User, (user) => user.invites, { eager: true }) // Use eager: true if you want to load automatically
  invitedBy: User;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @Column({
    type: 'enum',
    enum: ['team', 'user', 'individual-contractor'],
    nullable: true,
  })
  inviteeType?: string | null;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @Column({ nullable: true })
  teamName?: string | null;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @Column({ nullable: true })
  team?: string | null;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @Column({ nullable: true })
  username?: string | null;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @Column({ nullable: true })
  role?: string | null;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @Column({ nullable: true })
  user?: string | null;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @Column({ nullable: true })
  firstName?: string | null;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @Column({ nullable: true })
  lastName?: string | null;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @Column({ nullable: true })
  email?: string | null;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @Column({ type: 'varchar', length: 15, nullable: true })
  contactNumber?: string | null;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @Column({ nullable: true })
  projectId?: string | null;

  // Set only for workspace invites (2.7); project/team invites leave this
  // NULL. Plain column (not a relation), matching the sibling `projectId`
  // column's style on this entity. Unlike every other column here, the
  // physical column was added via a hand-written migration as snake_case
  // "workspace_id" (not this table's usual auto-generated camelCase
  // convention, e.g. "projectId"), so the `name` override is required -
  // without it TypeORM looks for a column literally called "workspaceId",
  // which doesn't exist ("column workspaceid of relation invites does not
  // exist").
  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  // `type: 'uuid'` is required, not cosmetic. Project.workspace and
  // UserRole.workspace are @ManyToOne relations, so TypeORM infers uuid
  // from Workspace.id; this is a plain column, so without an explicit type
  // it infers varchar from `string` and synchronize creates a varchar
  // column that no FK to workspaces(id) can ever be built on.
  @Column({ name: 'workspace_id', type: 'uuid', nullable: true })
  workspaceId?: string | null;

  // Declares the foreign key the migration creates so TypeORM knows it is
  // meant to be there. Without this the key is an orphan — schema:log
  // proposes dropping FK_invites_workspace_id with nothing to replace it,
  // and `synchronize` in development actually does, leaving development and
  // production disagreeing about referential integrity on this column.
  // `persistence: false` makes the relation read-only: `workspaceId` above
  // stays the sole write path, so no existing save() behaviour changes.
  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @ManyToOne(() => Workspace, { nullable: true, persistence: false })
  @JoinColumn({
    name: 'workspace_id',
    foreignKeyConstraintName: 'FK_invites_workspace_id',
  })
  workspace?: Workspace | null;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @Column({ nullable: true })
  inviteToken?: string | null;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @Column({ type: 'timestamp', nullable: true })
  expirationDate?: Date | null;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @Column({ default: false })
  isProjectViewer: boolean;

  @Column({ default: false })
  accepted: boolean;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
