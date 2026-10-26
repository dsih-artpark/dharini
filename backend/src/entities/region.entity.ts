import { RegionType } from '../common/enums/region.enum';
import { StatusType } from '../common/enums/status.enum';

import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { Location } from './location.entity';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity('regions')
@Unique(['regionType', 'lgdCode', 'parentRegion'])
export class Region {
  @PrimaryColumn()
  id: string;

  @Column({
    type: 'enum',
    enum: RegionType,
    nullable: false,
  })
  regionType: RegionType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lgdCode?: string | null;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @Column({ type: 'jsonb', nullable: true })
  metaData?: object | null;

  @Column({ type: 'varchar', length: 255, nullable: false })
  localName: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @ManyToOne(() => Region, (region) => region.subRegions, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  parentRegion?: Region | null;

  @OneToMany(() => Region, (region) => region.parentRegion)
  subRegions: Region[];

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @OneToMany(() => Location, (location) => location.region, { nullable: true })
  locations?: Location[] | null;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @ManyToMany(() => Project, (project) => project.regions)
  projects: Project[];

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
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

  @BeforeInsert()
  generateCustomId() {
    if (this.regionType === RegionType.COUNTRY) {
      this.id = `${this.regionType}_1`;
    } else {
      this.id = `${this.regionType}_${this.lgdCode}`; // Append prefix
    }
  }
}
