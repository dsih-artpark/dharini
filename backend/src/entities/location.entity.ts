import { StatusType } from '../common/enums/status.enum';

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
import { Site } from './site.entity';
import { Region } from './region.entity';
import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Sample } from './sample.entity';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Region, (region) => region.locations, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  region?: Region | null;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  coordinates?: Point | null;

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
  @OneToMany(() => Site, (site) => site.location)
  sites: Site[];

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @OneToMany(() => Sample, (site) => site.location)
  samples: Sample[];

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
