import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SequencingSubmission } from './sequencing-submission.entity';

export enum JobStatus {
  SUBMITTED = 'submitted',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

@Entity('sequencing_jobs')
export class SequencingJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'submission_id', type: 'uuid' })
  submissionId: string;

  @ManyToOne(() => SequencingSubmission, (sub) => sub.jobs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'submission_id',
    foreignKeyConstraintName: 'FK_sequencing_jobs_submission_id',
  })
  submission: SequencingSubmission;

  @Column({ name: 'api_response', type: 'jsonb', nullable: true })
  apiResponse: Record<string, unknown> | null;

  @Column({ name: 'api_status', type: 'varchar', nullable: true })
  apiStatus: string | null;

  @Column({ name: 'external_job_id', type: 'varchar', nullable: true })
  externalJobId: string | null;

  @Column({ type: 'varchar', default: JobStatus.PROCESSING })
  status: JobStatus;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string | null;

  /**
   * Params exactly as submitted to the pipeline. Persisted so a retry can
   * replay the run the user actually configured — without this, retrying a
   * failure silently falls back to pipeline defaults.
   */
  @Column({ name: 'submitted_params', type: 'jsonb', nullable: true })
  submittedParams: Record<string, unknown> | null;

  /** Secondary input keys (e.g. primer_bed) as submitted, for the same reason. */
  @Column({ name: 'extra_input_keys', type: 'jsonb', nullable: true })
  extraInputKeys: Record<string, string> | null;

  @Column({ name: 'run_id', type: 'varchar', nullable: true })
  runId: string | null;

  @Column({ name: 'visualization_path', type: 'varchar', nullable: true })
  visualizationPath: string | null;

  @Column({ name: 'snps_vcf_data', type: 'text', nullable: true })
  snpsVcfData: string | null;

  @Column({ name: 'annotated_vcf_data', type: 'text', nullable: true })
  annotatedVcfData: string | null;

  /**
   * The id Dharini generates and sends when submitting a run to the pipeline
   * (`SubmitRunPayload.externalId` / wire `run.external_id`). Unique, and the
   * only correlation key guaranteed to be known locally at submit time — the
   * pipeline's own `run.id` is only known once the submit response comes
   * back, so if that response is lost, this is how a later webhook or
   * reconciliation sweep is matched back to this job.
   */
  @Column({
    name: 'external_id',
    type: 'varchar',
    nullable: true,
    unique: true,
  })
  externalId: string | null;

  @Column({ name: 'pipeline_id', type: 'varchar', nullable: true })
  pipelineId: string | null;

  @Column({ name: 'pipeline_version', type: 'varchar', nullable: true })
  pipelineVersion: string | null;

  /** Name of the most recently known pipeline stage (e.g. the last stage to finish). */
  @Column({ type: 'varchar', nullable: true })
  stage: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metrics: Record<string, unknown> | null;

  @Column({ type: 'jsonb', nullable: true })
  stages: unknown[] | null;

  @Column({ type: 'jsonb', nullable: true })
  artifacts: unknown[] | null;

  /**
   * False when the run finished but its output files are stranded on the
   * worker (`artifacts_uploaded: false` in the webhook payload). The run is
   * still a success — metrics/variants are persisted regardless — this only
   * flags that the artifact files themselves are not yet retrievable and a
   * `POST /v1/runs/{id}/reupload` should be retried.
   */
  @Column({ name: 'artifacts_uploaded', type: 'boolean', nullable: true })
  artifactsUploaded: boolean | null;

  @Column({ name: 'artifacts_error', type: 'text', nullable: true })
  artifactsError: string | null;

  @Column({ name: 'finished_at', type: 'timestamptz', nullable: true })
  finishedAt: Date | null;

  @Column({ name: 'duration_s', type: 'double precision', nullable: true })
  durationS: number | null;

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
