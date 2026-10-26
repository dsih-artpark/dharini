import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Wetland entity — stores wetland site data from wetlands_merged.csv
 *
 * CSV columns:
 *   Sr. No., State, District, Central Longitude (DD), Central Latitude (DD),
 *   Wetland Type Code, Wetland Type Description, Wetland Area (Ha),
 *   Wetland Name, Status 2017-18 w.r.t. 2006-07
 */
@Entity('bio_wetlands')
export class BioWetland {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Sr. No. from CSV — original row index */
  @Column({ type: 'int', nullable: true })
  srNo: number;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  state: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  district: string;

  /** Central Longitude (DD) */
  @Column({ type: 'double precision' })
  longitude: number;

  /** Central Latitude (DD) */
  @Column({ type: 'double precision' })
  latitude: number;

  @Column({ type: 'int', nullable: true })
  wetlandTypeCode: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  wetlandTypeDescription: string;

  /** Wetland Area in Hectares */
  @Column({ type: 'double precision', nullable: true })
  areaHa: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  /** Status 2017-18 w.r.t. 2006-07 (e.g., "Y-Y") */
  @Column({ type: 'varchar', length: 20, nullable: true })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
