import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReplicateAvailability } from '../common/enums/replicateAvailability.enum';
import { SampleStatus } from '../common/enums/sample-status.enum';
import { StatusType } from '../common/enums/status.enum';
import { Disease } from './disease.entity';
import { LabTest } from './lab-test.entity';
import { Species } from './species.entity';
import { Project } from './project.entity';
import { SampleType } from './sample-type.entity';
import { Site } from './site.entity';
import { Team } from './team.entity';
import { User } from './user.entity';
import { Visit } from './visit.entity';
import { SampleAudit } from './sample-audit.entity';
import { Location } from './location.entity';
import { AnimalMetadata } from './animal-metadata.entity';

@Index(['barcode', 'project'], { unique: true })
@Entity('samples')
export class Sample {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  sampleCode?: string | null;

  @ManyToMany(() => Disease, (disease) => disease.samples)
  @JoinTable()
  diseases: Disease[];

  @ManyToOne(() => Project, { nullable: false })
  project: Project;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @ManyToOne(() => Site, (site) => site.samples, { nullable: false })
  site: Site;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @ManyToOne(() => Team, (team) => team.visits, { nullable: false })
  team: Team;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @ManyToOne(() => Visit, (visit) => visit.samples)
  visit: Visit;

  @ManyToOne(() => AnimalMetadata, (animalMetadata) => animalMetadata.samples, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'animal_metadata_id' })
  animalMetadata?: AnimalMetadata | null;

  @Column({ name: 'animal_metadata_id', nullable: true })
  animalMetadataId?: string | null;

  @OneToMany(() => LabTest, (labTest) => labTest.sample)
  labTests: LabTest[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  collectedAt: Date;

  @ManyToOne(() => SampleType, (sampleType) => sampleType.samples)
  sampleType: SampleType;

  @ManyToOne(() => Species, (species) => species.samples, { nullable: true })
  species?: Species;

  @Column({ nullable: true })
  quantity?: number | null;

  @Column({ nullable: true })
  unit?: string | null;

  @Column({ nullable: true })
  habitat?: string | null;

  @Column({ nullable: true })
  conc?: string | null;

  @Column({ nullable: true })
  rejectReason?: string | null;

  @Column({ type: 'timestamp', nullable: true })
  rejectedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  receivedAt?: Date | null;

  @Column({ nullable: true })
  receivedVolumeValue?: string | null;

  @Column({ nullable: true })
  receivedVolumeUnit?: string | null;

  @Column({ nullable: true })
  receivedLabStorageDetails?: string | null;

  @Column({ nullable: true })
  receivedStorageTemperature?: string | null;

  @Column({ nullable: true })
  referenceBatchId?: string | null;

  @Column({ nullable: true })
  batchReferenceDocument?: string | null;

  @Column({ nullable: true })
  accessionId?: string | null;

  @Column({ type: 'timestamp', nullable: true })
  extractionDateTime?: Date | null;

  @Column({ nullable: true })
  extractionSampleUsedValue?: string | null;

  @Column({ nullable: true })
  extractionSampleUsedUnit?: string | null;

  @Column({ nullable: true })
  extractionSampleRemainingValue?: string | null;

  @Column({ nullable: true })
  extractionSampleRemainingUnit?: string | null;

  @Column({ nullable: true })
  extractionComments?: string | null;

  @Column({ type: 'jsonb', nullable: true })
  details?: any | null;

  // Pre-processing fields
  @Column({ type: 'jsonb', nullable: true })
  preprocessingSteps?: any[] | null;

  @Column({ type: 'timestamp', nullable: true })
  preprocessingDate?: Date | null;

  @Column({ nullable: true })
  preprocessingStorageTemperature?: string | null;

  @Column({ nullable: true })
  preprocessingStorageDetails?: string | null;

  @ManyToOne(() => User, { nullable: true })
  preprocessingPerformedBy?: User | null;

  // Sample pooling
  @ManyToMany(() => Sample)
  @JoinTable({
    name: 'sample_pools',
    joinColumn: { name: 'sample_id_1', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'sample_id_2', referencedColumnName: 'id' },
  })
  pooledWith?: Sample[] | null;

  @Column({ default: false })
  isPooledSample: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  collectionTime: Date;

  @ManyToOne(() => User, (user) => user.collectedSamples, { nullable: true })
  collectedBy?: User | null;

  @ManyToOne(() => User, (user) => user.receivedSamples, { nullable: true })
  receivedBy?: User | null;

  @ManyToOne(() => User, (user) => user.extractedSamples, { nullable: true })
  extractedBy?: User | null;

  @ManyToOne(() => User, (user) => user.testedSamples, { nullable: true })
  testedBy?: User | null;

  @Column({ type: 'timestamp', nullable: true })
  testedAt: Date;

  @ManyToOne(() => User, (user) => user.reportGeneratedSamples, {
    nullable: true,
  })
  reportGeneratedBy?: User | null;

  @Column({ type: 'timestamp', nullable: true })
  reportGeneratedAt: Date;

  @OneToMany(() => SampleAudit, (audits) => audits.sample, { nullable: true })
  audits?: SampleAudit | null;

  @Column({
    type: 'varchar',
    array: true,
    nullable: true,
  })
  photos: string[];

  @Column({ nullable: true })
  comment?: string | null;

  @ApiProperty({
    enum: ReplicateAvailability,
    enumName: 'ReplicateAvailability',
  })
  @Column({
    type: 'enum',
    enum: ReplicateAvailability,
    default: ReplicateAvailability.NOT_COLLECTED,
  })
  replicates?: ReplicateAvailability | null;

  @ApiProperty({
    enum: SampleStatus,
    enumName: 'SampleStatus',
  })
  @Column({
    type: 'enum',
    enum: SampleStatus,
    default: SampleStatus.PICKED_UP,
  })
  sampleStatus: SampleStatus;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  barcode: string;

  @ManyToOne(() => Sample, (sample) => sample.replicatesSamples, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  originalSample?: Sample | null;

  @ApiProperty()
  @OneToMany(() => Sample, (sample) => sample.originalSample, {
    nullable: true,
  })
  replicatesSamples: Sample[];

  @Exclude({ toClassOnly: true })
  @ManyToOne(() => Location, (location) => location.samples, { nullable: true })
  @JoinColumn({ name: 'location_id' })
  location?: Location | null;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @Column({
    type: 'enum',
    enum: StatusType,
    default: StatusType.ACTIVE,
  })
  status?: StatusType;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude({ toClassOnly: true })
  @ApiHideProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
