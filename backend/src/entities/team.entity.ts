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
import { User } from './user.entity';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';
import { Visit } from './visit.entity';
import { Sample } from './sample.entity';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  teamName?: string | null;

  @Column({ type: 'varchar', nullable: true })
  address?: string | null;

  @Column({ type: 'varchar', nullable: true })
  logo?: string | null;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @Column({ default: false })
  isProjectViewer: boolean;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @OneToMany(() => User, (user) => user.team, { eager: true })
  members: User[];

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @OneToMany(() => Visit, (visit) => visit.team)
  visits: Visit[];

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @OneToMany(() => Sample, (sample) => sample.team)
  samples: Sample[];

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @ManyToMany(() => Project, (project) => project.teams)
  projects: Project[];

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
