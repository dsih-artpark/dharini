import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPreprocessingFields1770876902000 implements MigrationInterface {
  name = 'AddPreprocessingFields1770876902000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add pre-processing columns to samples table
    await queryRunner.query(`
      ALTER TABLE "samples" 
      ADD COLUMN IF NOT EXISTS "preprocessingSteps" jsonb,
      ADD COLUMN IF NOT EXISTS "preprocessingDate" TIMESTAMP,
      ADD COLUMN IF NOT EXISTS "preprocessingStorageTemperature" VARCHAR,
      ADD COLUMN IF NOT EXISTS "preprocessingStorageDetails" VARCHAR,
      ADD COLUMN IF NOT EXISTS "preprocessingPerformedById" uuid,
      ADD COLUMN IF NOT EXISTS "isPooledSample" BOOLEAN DEFAULT false
    `);

    // Add foreign key for preprocessingPerformedBy
    await queryRunner.query(`
      ALTER TABLE "samples" DROP CONSTRAINT IF EXISTS "FK_preprocessing_performed_by"
    `);

    await queryRunner.query(`
      ALTER TABLE "samples"
      ADD CONSTRAINT "FK_preprocessing_performed_by"
      FOREIGN KEY ("preprocessingPerformedById")
      REFERENCES "users"("id")
      ON DELETE SET NULL
    `);

    // Create sample_pools junction table for sample pooling
    // Drop first in case it exists with different schema
    await queryRunner.query(`DROP TABLE IF EXISTS "sample_pools" CASCADE`);

    await queryRunner.query(`
      CREATE TABLE "sample_pools" (
        "sample_id_1" uuid NOT NULL,
        "sample_id_2" uuid NOT NULL,
        CONSTRAINT "PK_sample_pools" PRIMARY KEY ("sample_id_1", "sample_id_2"),
        CONSTRAINT "FK_sample_pools_1" FOREIGN KEY ("sample_id_1") REFERENCES "samples"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_sample_pools_2" FOREIGN KEY ("sample_id_2") REFERENCES "samples"("id") ON DELETE CASCADE
      )
    `);

    // Create indexes for the junction table
    await queryRunner.query(`
      CREATE INDEX "IDX_sample_pools_1" ON "sample_pools" ("sample_id_1")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_sample_pools_2" ON "sample_pools" ("sample_id_2")
    `);

    // Add pre-processed status to enum
    // Note: PostgreSQL doesn't allow adding enum values in a transaction,
    // so we need to commit any pending transaction first
    await queryRunner.query(`
      ALTER TYPE "public"."samples_samplestatus_enum" 
      ADD VALUE IF NOT EXISTS 'pre-processed'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_sample_pools_2"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_sample_pools_1"`);

    // Drop sample_pools table
    await queryRunner.query(`DROP TABLE IF EXISTS "sample_pools"`);

    // Drop foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "samples" DROP CONSTRAINT IF EXISTS "FK_preprocessing_performed_by"
    `);

    // Drop columns
    await queryRunner.query(`
      ALTER TABLE "samples"
      DROP COLUMN IF EXISTS "preprocessingSteps",
      DROP COLUMN IF EXISTS "preprocessingDate",
      DROP COLUMN IF EXISTS "preprocessingStorageTemperature",
      DROP COLUMN IF EXISTS "preprocessingStorageDetails",
      DROP COLUMN IF EXISTS "preprocessingPerformedById",
      DROP COLUMN IF EXISTS "isPooledSample"
    `);

    // Note: Removing enum values is complex in PostgreSQL and often not done in down migrations
    // The 'pre-processed' value will remain in the enum
  }
}
