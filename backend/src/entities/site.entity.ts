import { DayOfWeek } from '../common/enums/daysofweek.enum';
import { SiteType } from '../common/enums/site.enum';
import { StatusType } from '../common/enums/status.enum';
import { TestResultType } from '../common/enums/test-result.enum';
import { Location } from './location.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Disease } from './disease.entity';
import { Project } from './project.entity';
import { Sample } from './sample.entity';
import { User } from './user.entity';
import { Visit } from './visit.entity';
import { Exclude } from 'class-transformer';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

@Entity('sites')
export class Site {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  siteCode?: string | null;

  @Column({ type: 'varchar', nullable: true })
  collectionConsent?: string | null;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @ManyToOne(() => Project, (project) => project.sites)
  project: Project;

  @ManyToMany(() => Disease, (disease) => disease.sites)
  @JoinTable({
    name: 'site_diseases',
    joinColumn: { name: 'site_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'disease_id', referencedColumnName: 'id' },
  })
  diseases: Disease[];

  @Column({ nullable: true })
  collectionFrequencyInterval?: number | null;

  @Column({ nullable: true })
  collectionFrequency?: number | null;

  @ApiProperty({
    enum: DayOfWeek,
    enumName: 'DayOfWeek',
    isArray: true,
  })
  @Column({
    type: 'enum',
    enum: DayOfWeek,
    array: true,
    nullable: true,
  })
  collectionDayOfWeek?: DayOfWeek[] | null;

  @Column({
    type: 'time',
    nullable: true,
  })
  collectionTime?: string | null;

  @ApiProperty({
    description: 'The date when collection visits should start',
    example: '2026-01-16',
    required: false,
  })
  @Column({ nullable: true })
  collectionStartDate?: Date | null;

  @Column({ nullable: true })
  collectionLastScheduleDate?: Date | null;

  @Column({ nullable: true })
  collectionDuration?: number | null;

  @ManyToOne(() => User, (user) => user.sites, { nullable: true })
  @JoinColumn({ name: 'collector_id' })
  collectionCollector?: User | null;

  @Column({ nullable: true })
  collectionExpiryDate?: Date;

  @Column({
    type: 'varchar',
    array: true,
    nullable: true,
  })
  photos?: string[] | null;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @OneToMany(() => Visit, (visit) => visit.site, { nullable: true })
  visits?: Visit[] | null;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @OneToMany(() => Sample, (sample) => sample.site, { nullable: true })
  samples?: Sample[] | null;

  @ApiProperty({
    description:
      'Type of farm/site based on the disease (e.g. Poultry Farm, Wetland, Cattle Farm)',
    example: 'poultry_farm',
  })
  @Column({ type: 'varchar', length: 100, nullable: true })
  farmType?: string | null;

  @ApiProperty({
    description:
      'Sub-type of the farm/site (e.g. Broiler, Breeder, Layer, Backyard)',
    example: 'broiler',
  })
  @Column({ type: 'varchar', length: 100, nullable: true })
  siteSubType?: string | null;

  @ApiProperty({
    enum: SiteType,
    enumName: 'SiteType',
  })
  @Column({ type: 'enum', enum: SiteType, nullable: true })
  siteType?: SiteType | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  siteOwnerName?: string | null;

  @Column({ nullable: true, type: 'varchar', length: 15 })
  siteOwnerNumber?: string | null;

  @Column({ nullable: true })
  workerNumber?: number | null;

  @Column({ type: 'varchar', length: 400, nullable: true })
  address?: string | null;

  @Column({ nullable: true })
  pinCode?: number | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  block?: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  village?: string | null;

  // @Column({ type: 'varchar', length: 100, nullable: true })
  // district: string;

  // @Column({ type: 'varchar', length: 100, nullable: true })
  // state: string;

  @Column({ type: 'varchar', length: 400, nullable: true })
  comment?: string | null;

  @ApiHideProperty()
  @Column({
    type: 'enum',
    enum: StatusType,
    default: StatusType.ACTIVE,
  })
  status: StatusType;

  @ApiProperty({
    enum: TestResultType,
    enumName: 'TestResultType',
  })
  @Column({
    type: 'enum',
    enum: TestResultType,
    default: TestResultType.PENDING,
  })
  testResult?: TestResultType | null;

  @ManyToOne(() => Location, (location) => location.sites, { nullable: true })
  @JoinColumn({ name: 'location_id' })
  location?: Location | null;

  @CreateDateColumn()
  createdAt: Date;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @ManyToOne(() => User, (user) => user.createdSites, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdBy?: User | null;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @ManyToOne(() => User, (user) => user.updatedSites, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updatedBy?: User | null;
}
