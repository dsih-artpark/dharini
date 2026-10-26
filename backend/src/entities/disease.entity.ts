import { StatusType } from '../common/enums/status.enum';

import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { Sample } from './sample.entity';
import { Site } from './site.entity';

@Entity('diseases')
export class Disease {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @PrimaryColumn('varchar')
  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  shortName: string;

  @Column({ type: 'int', generated: 'increment' })
  index: number;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @ManyToMany(() => Project, (project) => project.diseases)
  projects: Project[];

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @ManyToMany(() => Site, (site) => site.diseases)
  sites: Site[];

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @ManyToMany(() => Sample, (sample) => sample.diseases)
  samples: Sample[];

  @Column({
    type: 'enum',
    enum: StatusType,
    default: StatusType.ACTIVE,
  })
  status?: StatusType | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
