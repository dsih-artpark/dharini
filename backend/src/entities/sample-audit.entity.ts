import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StatusType } from '../common/enums/status.enum';
import { Sample } from './sample.entity';
import { User } from './user.entity';

@Entity('sample_audits')
export class SampleAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Sample, (sample) => sample.audits)
  @JoinTable()
  sample: Sample;

  @ManyToOne(() => User, (user) => user.sampleAudits)
  @JoinTable()
  user: User;

  @Column({ type: 'jsonb', nullable: true })
  previousChanges?: object | null;

  @Column({ type: 'jsonb', nullable: true })
  currentChanges?: object | null;

  @Column({ nullable: true })
  event?: string | null;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @Column({
    type: 'enum',
    enum: StatusType,
    default: StatusType.ACTIVE,
  })
  status?: StatusType;

  @ApiHideProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiHideProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
