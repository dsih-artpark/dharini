import { StatusType } from '../common/enums/status.enum';

import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TestResultType } from '../common/enums/test-result.enum';
import { Disease } from './disease.entity';
import { Project } from './project.entity';
import { Sample } from './sample.entity';
import { Site } from './site.entity';
import { Team } from './team.entity';
import { User } from './user.entity';
import { Visit } from './visit.entity';

@Entity('lab_tests')
export class LabTest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @ManyToOne(() => Project, (project) => project.labTests, { nullable: false })
  project: Project;

  @ManyToOne(() => Sample, (sample) => sample.labTests, { nullable: false })
  sample: Sample;

  @ManyToOne(() => Visit, { nullable: false })
  visit: Visit;

  @ManyToOne(() => Team, { nullable: false })
  team: Team;

  @ManyToOne(() => Disease, { nullable: false })
  @JoinColumn() // Ensure this is present
  disease: Disease;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @ManyToOne(() => Site, { nullable: false })
  site: Site;

  @Column({ nullable: true })
  ctValue?: string | null;

  @Column({ nullable: true })
  variant?: string | null;

  @Column({ nullable: true })
  viralLoad?: string | null;

  @Column({ nullable: true })
  kitOrProtocol?: string | null;

  @Column({ nullable: true })
  labComment?: string | null;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  resultDate?: Date | null;

  @Column({ nullable: true })
  resultComment?: string | null;

  @Column({ nullable: true })
  testResultReport?: string | null;

  @ManyToOne(() => User, { nullable: true })
  testedBy?: User | null;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  testedAt?: Date | null;

  @ApiPropertyOptional({
    enum: TestResultType,
    enumName: 'TestResultType',
  })
  @Column({
    type: 'enum',
    enum: TestResultType,
    nullable: true,
  })
  testResult?: TestResultType | null;

  @Column({ type: 'jsonb', nullable: true })
  details?: object | null;

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
}
