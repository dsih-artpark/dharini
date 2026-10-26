import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { customAlphabet } from 'nanoid';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StatusType } from '../common/enums/status.enum';
import { Disease } from './disease.entity';
import { LabTest } from './lab-test.entity';
import { Region } from './region.entity';
import { Site } from './site.entity';
import { SurveillanceType } from './surveillance-type.entity';
import { Team } from './team.entity';
import { User } from './user.entity';
import { Visit } from './visit.entity';
import { Workspace } from './workspace.entity';

@Entity('projects')
export class Project {
  @PrimaryColumn({ type: 'text', unique: true })
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  code: string;

  @ManyToMany(() => User, (user) => user.projects)
  @JoinTable({
    name: 'project_admins',
    joinColumn: { name: 'project_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  projectAdmins: User[];

  @ManyToMany(() => Disease, (disease) => disease.projects)
  @JoinTable({
    name: 'project_diseases',
    joinColumn: { name: 'project_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'disease_id', referencedColumnName: 'id' },
  })
  diseases: Disease[];

  @ManyToMany(
    () => SurveillanceType,
    (surveillanceType) => surveillanceType.projects,
  )
  @JoinTable({
    name: 'project_surveillance_types',
    joinColumn: { name: 'project_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'surveillance_type_id',
      referencedColumnName: 'id',
    },
  })
  surveillanceTypes: SurveillanceType[];

  @ManyToMany(() => Region, (region) => region.projects)
  @JoinTable({
    name: 'project_regions',
    joinColumn: { name: 'project_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'region_id', referencedColumnName: 'id' },
  })
  regions: Region[];

  @Exclude()
  @ApiHideProperty()
  // See Workspace.createdBy for why the constraint name is pinned here.
  @ManyToOne(() => Workspace, { nullable: true })
  @JoinColumn({
    name: 'workspace_id',
    foreignKeyConstraintName: 'FK_projects_workspace_id',
  })
  workspace?: Workspace | null;

  @Column({ name: 'workspace_id', nullable: true })
  workspaceId?: string | null;

  @Exclude()
  @ApiHideProperty()
  @OneToMany(() => Site, (site) => site.project)
  sites: Site[];

  @Exclude()
  @ApiHideProperty()
  @OneToMany(() => LabTest, (labTest) => labTest.project, { cascade: true })
  labTests: LabTest[];

  @Exclude()
  @ApiHideProperty()
  @OneToMany(() => User, (user) => user.project)
  members: User[];

  @Exclude()
  @ApiHideProperty()
  @ManyToMany(() => Team, (team) => team.projects, { cascade: true })
  @JoinTable({
    name: 'project_teams',
    joinColumn: { name: 'project_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'team_id', referencedColumnName: 'id' },
  })
  teams: Team[];

  // @OneToMany(() => Site, (site) => site.project)
  // collectionPlans: CollectionPlan[];

  @Exclude()
  @ApiHideProperty()
  @OneToMany(() => Visit, (visit) => visit.project)
  visits: Visit[];

  // @OneToMany(() => Sample, (sample) => sample.project)
  // samples: Sample[];
  @Exclude()
  @ApiHideProperty()
  @Column({ type: 'boolean', default: false })
  isOnboardingCompleted: boolean;

  @Exclude()
  @ApiHideProperty()
  @Column({
    type: 'enum',
    enum: StatusType,
    default: StatusType.ACTIVE,
  })
  status: StatusType;

  @Exclude()
  @ApiHideProperty()
  @ManyToOne(() => User, (user) => user.createdProjects, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdBy?: User | null;

  @Exclude()
  @ApiHideProperty()
  @ManyToOne(() => User, (user) => user.updatedProjects, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updatedBy?: User | null;

  @Exclude()
  @ApiHideProperty()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @ApiHideProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  generateId() {
    const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 5);
    this.id = `P${nanoid()}`;
  }
}
