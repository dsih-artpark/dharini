import { StatusType } from '../common/enums/status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Invite } from './invite.entity';
import { Project } from './project.entity';
import { Site } from './site.entity';
import { Team } from './team.entity';
import { UserRole } from './user-role.entity';
import { Visit } from './visit.entity';
import { Sample } from './sample.entity';
import { Exclude } from 'class-transformer';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { SampleAudit } from './sample-audit.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ example: 'John' })
  firstName?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lastName?: string | null;

  @Column({ type: 'varchar', nullable: true })
  profilePicture?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  designation?: string | null;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @OneToMany(() => Sample, (sample) => sample.collectedBy)
  collectedSamples: Sample[];

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @OneToMany(() => Sample, (sample) => sample.receivedBy)
  receivedSamples: Sample[];

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @OneToMany(() => Sample, (sample) => sample.extractedBy)
  extractedSamples: Sample[];

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @OneToMany(() => Sample, (sample) => sample.testedBy)
  testedSamples: Sample[];

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @OneToMany(() => Sample, (sample) => sample.reportGeneratedBy)
  reportGeneratedSamples: Sample[];

  @Column({ type: 'varchar', length: 15, unique: true, nullable: true })
  contactNumber: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address?: string | null;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  email?: string | null;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  roles: UserRole[];

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @OneToMany(() => Visit, (visit) => visit.collector)
  visits: Visit[];

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @ManyToMany(() => Visit, (visit) => visit.collector, { nullable: true })
  visited?: Visit[] | null;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @OneToMany(() => Invite, (invite) => invite.invitedBy)
  invites: Invite;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @ManyToMany(() => Project, (invite) => invite.projectAdmins)
  projects: Project[];

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @ManyToOne(() => Project, (project) => project.members, { nullable: true })
  project?: Project | null;

  // @Exclude({ toClassOnly: true })
  // @ApiHideProperty()
  // FIX-PLAN B5: was declared `team: Team` (non-nullable) while the DB
  // column has never had a NOT NULL constraint (1755598844281-init.ts:112) -
  // TypeORM's relation default is nullable, so there was no schema drift,
  // but the TS type was a lie. That's what hid two crashing endpoints
  // reading `user.team.id` with no guard (disease.service.ts,
  // samples.service.ts) for any teamless Scope.Team user. No migration
  // needed - the column was already nullable. Matches how `project` is
  // already declared above.
  @ManyToOne(() => Team, (team) => team.members, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  team?: Team | null;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @OneToMany(() => Project, (project) => project.createdBy)
  createdProjects: Project[];

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @OneToMany(() => Project, (project) => project.updatedBy)
  updatedProjects: Project[];

  @OneToMany(() => SampleAudit, (sampleAudits) => sampleAudits.user)
  sampleAudits: SampleAudit[];

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @Column({
    type: 'enum',
    enum: StatusType,
    default: StatusType.ACTIVE,
  })
  status: StatusType;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @OneToMany(() => Site, (site) => site.collectionCollector)
  sites: Site[];

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @OneToMany(() => Site, (site) => site.createdBy, { nullable: true })
  createdSites?: Site[] | null;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @OneToMany(() => Site, (site) => site.updatedBy, { nullable: true })
  updatedSites?: Site[] | null;
}
