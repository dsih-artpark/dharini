import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { SequencingJob } from './sequencing-job.entity';
import { Project } from './project.entity';

export enum SourceType {
  LAB = 'lab',
  NCBI = 'ncbi',
  MANUAL = 'manual',
}

export enum SubmissionStatus {
  PENDING = 'pending',
  SUBMITTED = 'submitted',
  FAILED = 'failed',
  COMPLETED = 'completed',
  /** A deliberately stopped run — distinct from one that broke. */
  CANCELLED = 'cancelled',
}

@Entity('sequencing_submissions')
export class SequencingSubmission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'seq_id', type: 'varchar', unique: true })
  seqId: string;

  @Column({ name: 'source_type', type: 'varchar' })
  sourceType: SourceType;

  @Column({ name: 'lab_test_id', type: 'uuid', nullable: true })
  labTestId: string | null;

  @Column({ name: 'sample_barcode', type: 'varchar', nullable: true })
  sampleBarcode: string;

  @Column({ name: 'site_name', type: 'varchar', nullable: true })
  siteName: string;

  @Column({ name: 'disease_name', type: 'varchar', nullable: true })
  diseaseName: string | null;

  // fileFormat/libraryType/platform/sequencingMethod are no longer collected
  // from the submission form — the selected pipeline determines all four
  // now. SequencingJobsService derives fileFormat and platform server-side
  // when possible; libraryType and sequencingMethod are stored null rather
  // than guessed when not supplied. Columns stay (the records table still
  // displays them) but must accept NULL — see the matching migration
  // MigrateSequencingToV1Pipeline1787230000000.
  @Column({ name: 'file_format', type: 'varchar', nullable: true })
  fileFormat: string | null;

  @Column({ name: 'library_type', type: 'varchar', nullable: true })
  libraryType: string | null;

  @Column({ name: 'platform', type: 'varchar', nullable: true })
  platform: string | null;

  @Column({ name: 'sequencing_method', type: 'varchar', nullable: true })
  sequencingMethod: string | null;

  @Column({ name: 'file_name_r1', type: 'varchar', nullable: true })
  fileNameR1: string;

  @Column({ name: 'file_path_r1', type: 'varchar', nullable: true })
  filePathR1: string;

  @Column({ name: 'file_name_r2', type: 'varchar', nullable: true })
  fileNameR2: string | null;

  @Column({ name: 'file_path_r2', type: 'varchar', nullable: true })
  filePathR2: string | null;

  @Column({ name: 'ncbi_accession', type: 'varchar', nullable: true })
  ncbiAccession: string | null;

  // text, not varchar — CreateSequencingTables1776400000000 declares TEXT.
  @Column({ name: 'ncbi_title', type: 'text', nullable: true })
  ncbiTitle: string | null;

  @Column({ name: 'ncbi_organism', type: 'varchar', nullable: true })
  ncbiOrganism: string | null;

  @Column({ name: 'ncbi_length', type: 'int', nullable: true })
  ncbiLength: number | null;

  @Column({ type: 'varchar', default: SubmissionStatus.PENDING })
  status: SubmissionStatus;

  // A12: a project CODE (e.g. "PHJOLL"), not a UUID — Project.id is a nanoid
  // string ("P" + 5 chars, see Project.generateId()). The column was
  // originally declared `uuid` (CreateSequencingTables1776400000000), which
  // could never have held a real project id.
  //
  // `text` rather than demo's `varchar` so it matches every other FK to
  // projects(id) in the schema (sites.projectId, samples.projectId,
  // lab_tests.projectId, ...). MigrateSequencingToV1Pipeline1787230000000
  // widens it to varchar and AddProjectFkToSequencingSubmissions1788000000000
  // then converts to text and adds the FK — in that order, by timestamp.
  @Column({ name: 'project_id', type: 'text', nullable: true })
  projectId: string | null;

  // Read-only declaration of the key created by
  // AddProjectFkToSequencingSubmissions1788000000000. See Invite.workspace
  // for why this exists and why `persistence: false` matters.
  @ManyToOne(() => Project, { nullable: true, persistence: false })
  @JoinColumn({
    name: 'project_id',
    foreignKeyConstraintName: 'FK_sequencing_submissions_project_id',
  })
  project?: Project | null;

  @Column({ name: 'submitted_by', type: 'uuid', nullable: true })
  submittedBy: string | null;

  @Column({ name: 'submission_date', type: 'date', nullable: true })
  submissionDate: string;

  @OneToMany(() => SequencingJob, (job) => job.submission, { cascade: true })
  jobs: SequencingJob[];

  // timestamptz explicitly: the migrations create these as TIMESTAMPTZ, but
  // @CreateDateColumn/@UpdateDateColumn default to TIMESTAMP WITHOUT TIME
  // ZONE. Left implicit, a migration-built database (staging, production)
  // and a synchronize-built one (development) end up with different types
  // for the same column, and synchronize "reconciles" that by DROPping and
  // re-ADDing the column — which is how sequencing_submissions.project_id
  // lost its values.
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
