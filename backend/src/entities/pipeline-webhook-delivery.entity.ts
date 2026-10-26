import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

/**
 * One row per `X-Dharini-Delivery` id the pipeline webhook has successfully
 * processed. `deliveryId` is unique so a retried delivery (the pipeline
 * retries an unacknowledged webhook for roughly nine hours) can be detected
 * and turned into a fast no-op instead of re-applying a run result.
 *
 * A row is written only AFTER the terminal result has been applied
 * successfully — see PipelineWebhookService — so a delivery that fails
 * mid-processing is retried rather than being permanently swallowed as a
 * false "duplicate".
 */
@Entity('pipeline_webhook_deliveries')
export class PipelineWebhookDelivery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'delivery_id', type: 'varchar', unique: true })
  deliveryId: string;

  @Column({ type: 'varchar' })
  event: string;

  @Column({ name: 'run_external_id', type: 'varchar', nullable: true })
  runExternalId: string | null;

  // timestamptz explicitly: the migrations create these as TIMESTAMPTZ, but
  // @CreateDateColumn/@UpdateDateColumn default to TIMESTAMP WITHOUT TIME
  // ZONE. Left implicit, a migration-built database (staging, production)
  // and a synchronize-built one (development) end up with different types
  // for the same column, and synchronize "reconciles" that by DROPping and
  // re-ADDing the column — which is how sequencing_submissions.project_id
  // lost its values.
  @CreateDateColumn({ name: 'received_at', type: 'timestamptz' })
  receivedAt: Date;
}
