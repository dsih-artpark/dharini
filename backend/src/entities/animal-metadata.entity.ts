import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Visit } from './visit.entity';
import { Sample } from './sample.entity';
import { Site } from './site.entity';
import { Species } from './species.entity';

@Entity('animal_metadata')
@Index('IDX_animal_metadata_site_tag', ['siteId', 'animalTagId'])
@Index('IDX_animal_metadata_site_bird', ['siteId', 'birdId'])
export class AnimalMetadata {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @ManyToOne(() => Visit, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'visit_id' })
  visit: Visit;

  @Column({ name: 'visit_id' })
  visitId: string;

  /**
   * Denormalized site reference — every animal belongs to exactly one site
   * (inherited from the visit it was first recorded under). Storing it
   * directly avoids the visit→site join every time we list animals for a
   * site, and matches the natural query pattern: "show me all animals
   * recorded at site X".
   */
  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @ManyToOne(() => Site, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'site_id' })
  site: Site;

  @Column({ name: 'site_id' })
  siteId: string;

  @OneToMany(() => Sample, (sample) => sample.animalMetadata)
  samples: Sample[];

  @ApiProperty()
  @Column({ nullable: true })
  animalTagId?: string | null;

  @ApiProperty()
  @Column({ nullable: true })
  birdId?: string | null;

  @ManyToOne(() => Species, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'species_id' })
  species?: Species | null;

  @Column({ name: 'species_id', nullable: true })
  speciesId?: string | null;

  @ApiProperty()
  @Column({ nullable: true })
  breed?: string | null;

  @ApiProperty()
  @Column({ nullable: true })
  ageYears?: number | null;

  @ApiProperty()
  @Column({ nullable: true })
  ageMonths?: number | null;

  @ApiProperty()
  @Column({ nullable: true })
  gender?: string | null;

  @ApiProperty()
  @Column({ nullable: true })
  vaccinationStage?: string | null;

  @ApiProperty()
  @Column({ type: 'varchar', array: true, nullable: true })
  diseaseHistory?: string[] | null;

  @ApiProperty()
  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  averageMilkProductionPerDayWithinOneYear?: number | null;

  @ApiProperty()
  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  averageMilkProductionPerDayBeforeOneYear?: number | null;

  @ApiProperty()
  @Column({ default: false })
  feverObserved: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  firstNoticedDate?: Date | null;

  @ApiProperty()
  @Column({ type: 'varchar', array: true, nullable: true })
  vectors?: string[] | null;

  @ApiProperty()
  @Column({ default: false })
  dropInFeedIntake: boolean;

  @ApiProperty()
  @Column({ default: false })
  dropInWaterIntake: boolean;

  @ApiProperty()
  @Column({ default: false })
  dropInEggProduction: boolean;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
