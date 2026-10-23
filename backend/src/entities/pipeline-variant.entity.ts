import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { SequencingJob } from './sequencing-job.entity';

/**
 * A single called variant belonging to a finished sequencing run, parsed out
 * of the webhook/reconciliation payload's inline `variants` array so it can
 * be queried (by gene, impact, position, ...) instead of living buried in a
 * jsonb blob on the job row.
 */
@Entity('pipeline_variants')
export class PipelineVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'job_id', type: 'uuid' })
  jobId: string;

  @ManyToOne(() => SequencingJob, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'job_id',
    foreignKeyConstraintName: 'FK_pipeline_variants_job_id',
  })
  job: SequencingJob;

  @Column({ type: 'varchar', nullable: true })
  chrom: string | null;

  @Column({ type: 'int', nullable: true })
  pos: number | null;

  @Column({ type: 'varchar', nullable: true })
  ref: string | null;

  @Column({ type: 'varchar', nullable: true })
  alt: string | null;

  @Column({ type: 'varchar', nullable: true })
  effect: string | null;

  @Column({ type: 'varchar', nullable: true })
  impact: string | null;

  @Column({ type: 'varchar', nullable: true })
  gene: string | null;

  @Column({ name: 'hgvs_p', type: 'varchar', nullable: true })
  hgvsP: string | null;

  @Column({ type: 'int', nullable: true })
  depth: number | null;

  @Column({ name: 'allele_freq', type: 'double precision', nullable: true })
  alleleFreq: number | null;

  // timestamptz explicitly: the migrations create these as TIMESTAMPTZ, but
  // @CreateDateColumn/@UpdateDateColumn default to TIMESTAMP WITHOUT TIME
  // ZONE. Left implicit, a migration-built database (staging, production)
  // and a synchronize-built one (development) end up with different types
  // for the same column, and synchronize "reconciles" that by DROPping and
  // re-ADDing the column — which is how sequencing_submissions.project_id
  // lost its values.
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
