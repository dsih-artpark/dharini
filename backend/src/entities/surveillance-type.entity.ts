import { StatusType } from '../common/enums/status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { SampleType } from './sample-type.entity';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity('surveillance_types')
export class SurveillanceType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Exclude()
  @ApiHideProperty()
  @ManyToMany(() => Project, (project) => project.surveillanceTypes)
  projects: Project[];

  @Exclude()
  @ApiHideProperty()
  @OneToMany(() => SampleType, (sampleType) => sampleType.surveillanceType)
  sampleTypes: SampleType[];

  @Column({
    type: 'enum',
    enum: StatusType,
    default: StatusType.ACTIVE,
  })
  status: StatusType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
