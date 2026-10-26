import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  Point,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StatusType } from '../common/enums/status.enum';
import { VisitStatus } from '../common/enums/visitStatus.enum';
import { Project } from './project.entity';
import { Sample } from './sample.entity';
import { Site } from './site.entity';

import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Disease } from './disease.entity';
import { Team } from './team.entity';
import { User } from './user.entity';

@Entity('visits')
export class Visit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @ManyToOne(() => Project, (project) => project.visits)
  project: Project;

  @ManyToOne(() => Site, (site) => site.visits)
  site: Site;

  @Exclude()
  @ApiHideProperty()
  @Column({ type: 'varchar', nullable: true })
  questionSetId?: string | null | null;

  @OneToMany(() => Sample, (sample) => sample.visit)
  samples: Sample[];

  // Virtual property to hold the calculated round number for this visit
  round?: number;

  @Column({ nullable: true })
  visitedAt?: Date | null; // the date when the collector visited

  @ApiPropertyOptional({
    description: 'Timestamp when the collector opened the page',
  })
  @Column({ nullable: true })
  visitStartedAt?: Date | null; // the date when the collector started the visit

  @Column({ nullable: false })
  visitScheduledAt: Date; // the date when the visit had been scheduled

  @ApiProperty({
    enum: VisitStatus,
    enumName: 'VisitStatus',
  })
  @Column({ type: 'enum', enum: VisitStatus, default: VisitStatus.UPCOMING })
  visitStatus: VisitStatus;

  @ManyToOne(() => Team, (team) => team.visits, { nullable: false })
  team: Team;

  @ApiHideProperty()
  @Column({
    type: 'varchar',
    array: true,
    nullable: true,
  })
  photos?: string[] | null;

  @Column({ nullable: true })
  comment?: string;

  @ManyToOne(() => User, (user) => user.visits, { nullable: false })
  collector: User;

  @ManyToOne(() => User, (user) => user.visited, { nullable: true })
  visitedBy?: User | null;

  @ApiHideProperty()
  @Column({
    type: 'enum',
    enum: StatusType,
    default: StatusType.ACTIVE,
  })
  status: StatusType;

  @Column('jsonb', { default: [], nullable: true })
  suspectedPositives?: Array<{
    disease: Disease;
    sampleCount: number;
    isSuspectedPositive: boolean;
  }> | null;

  @Column('jsonb', { nullable: true })
  diseaseQuestionnaireData?: Record<string, any> | null;

  @Column('jsonb', { nullable: true })
  environmentalQuestionnaireData?: Record<string, any> | null;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  completedAtCoordinates?: Point | null;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ type: 'timestamp without time zone', nullable: true })
  rescheduledFrom?: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
