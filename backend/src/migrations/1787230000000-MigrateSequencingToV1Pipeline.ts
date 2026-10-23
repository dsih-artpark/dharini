import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migrates the sequencing feature to the rewritten pipeline service (/v1).
 *
 * One migration rather than several because this is one logical change: the
 * old contract (`POST /upload`, `GET /status/{job_id}`) no longer exists, so
 * the schema change, the data reset and the relaxed submission columns are
 * not independently useful and must never be applied apart.
 *
 * The data reset is deliberate and irreversible. Rows written under the old
 * contract carry no `external_id` or `run_id` meaningful to the new pipeline,
 * so they can never be reconciled or re-fetched — there is nothing to migrate
 * them to. Confirmed with the product owner before writing this.
 */
export class MigrateSequencingToV1Pipeline1787230000000 implements MigrationInterface {
  name = 'MigrateSequencingToV1Pipeline1787230000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Clear data submitted under the retired contract. CASCADE reaches
    //    pipeline_variants via its FK; nothing else references these tables.
    await queryRunner.query(`
      TRUNCATE TABLE "sequencing_jobs", "sequencing_submissions" CASCADE
    `);

    // 2. Fields the pipeline's run-completion payload needs. "external_id" is
    //    the id Dharini generates at submit time and the pipeline echoes back
    //    on every run record — the correlation key used when the submit
    //    response itself was lost.
    await queryRunner.query(`
      ALTER TABLE "sequencing_jobs"
      ADD COLUMN IF NOT EXISTS "external_id"        VARCHAR,
      ADD COLUMN IF NOT EXISTS "pipeline_id"        VARCHAR,
      ADD COLUMN IF NOT EXISTS "pipeline_version"   VARCHAR,
      ADD COLUMN IF NOT EXISTS "stage"              VARCHAR,
      ADD COLUMN IF NOT EXISTS "metrics"            JSONB,
      ADD COLUMN IF NOT EXISTS "stages"             JSONB,
      ADD COLUMN IF NOT EXISTS "artifacts"          JSONB,
      ADD COLUMN IF NOT EXISTS "artifacts_uploaded" BOOLEAN,
      ADD COLUMN IF NOT EXISTS "artifacts_error"    TEXT,
      ADD COLUMN IF NOT EXISTS "finished_at"        TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS "duration_s"         DOUBLE PRECISION,
      ADD COLUMN IF NOT EXISTS "submitted_params"    JSONB,
      ADD COLUMN IF NOT EXISTS "extra_input_keys"    JSONB
    `);

    await queryRunner.query(`
      ALTER TABLE "sequencing_jobs"
      ADD CONSTRAINT "UQ_sequencing_jobs_external_id" UNIQUE ("external_id")
    `);

    // 3. The submission form no longer collects these — the chosen pipeline
    //    determines all four, and the backend derives what it can rather than
    //    guessing, so the columns must accept NULL.
    await queryRunner.query(`
      ALTER TABLE "sequencing_submissions"
      ALTER COLUMN "file_format"       DROP NOT NULL,
      ALTER COLUMN "library_type"      DROP NOT NULL,
      ALTER COLUMN "platform"          DROP NOT NULL,
      ALTER COLUMN "sequencing_method" DROP NOT NULL
    `);

    // 3b. project_id is a project CODE in Dharini (e.g. "PHJOLL"), not a UUID.
    //     The column was declared uuid, so any real submission would fail at
    //     the database with "invalid input syntax for type uuid". Safe to
    //     ALTER unconditionally here because step 1 truncated the table.
    await queryRunner.query(`
      ALTER TABLE "sequencing_submissions"
      ALTER COLUMN "project_id" TYPE VARCHAR USING "project_id"::text
    `);

    // 4. Webhook delivery de-duplication. UNIQUE on delivery_id is what makes
    //    a repeated delivery a no-op rather than a second write.
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "pipeline_webhook_deliveries" (
        "id"               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "delivery_id"      VARCHAR NOT NULL,
        "event"            VARCHAR NOT NULL,
        "run_external_id"  VARCHAR,
        "received_at"      TIMESTAMPTZ DEFAULT now(),
        CONSTRAINT "UQ_pipeline_webhook_deliveries_delivery_id" UNIQUE ("delivery_id")
      )
    `);

    // 5. Called variants as queryable rows, not a jsonb blob — being able to
    //    filter by gene, impact and position is why the pipeline sends them
    //    inline in the webhook payload at all.
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "pipeline_variants" (
        "id"          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "job_id"      UUID NOT NULL,
        "chrom"       VARCHAR,
        "pos"         INT,
        "ref"         VARCHAR,
        "alt"         VARCHAR,
        "effect"      VARCHAR,
        "impact"      VARCHAR,
        "gene"        VARCHAR,
        "hgvs_p"      VARCHAR,
        "depth"       INT,
        "allele_freq" DOUBLE PRECISION,
        "created_at"  TIMESTAMPTZ DEFAULT now(),
        CONSTRAINT "FK_pipeline_variants_job_id"
          FOREIGN KEY ("job_id")
          REFERENCES "sequencing_jobs"("id")
          ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_pipeline_variants_job_id"
      ON "pipeline_variants" ("job_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Schema is reversible; the truncated rows are not. Reverting restores
    // the old columns and constraints, not the data.
    await queryRunner.query(`DROP TABLE IF EXISTS "pipeline_variants"`);
    await queryRunner.query(
      `DROP TABLE IF EXISTS "pipeline_webhook_deliveries"`,
    );

    await queryRunner.query(`
      UPDATE "sequencing_submissions"
      SET
        "file_format"       = COALESCE("file_format", 'FASTQ'),
        "library_type"      = COALESCE("library_type", 'Single End'),
        "platform"          = COALESCE("platform", 'Unknown'),
        "sequencing_method" = COALESCE("sequencing_method", 'WGS')
    `);
    await queryRunner.query(`
      ALTER TABLE "sequencing_submissions"
      ALTER COLUMN "file_format"       SET NOT NULL,
      ALTER COLUMN "library_type"      SET NOT NULL,
      ALTER COLUMN "platform"          SET NOT NULL,
      ALTER COLUMN "sequencing_method" SET NOT NULL
    `);

    // Only reversible while the column holds nothing but UUIDs or NULLs;
    // any project code written since would block the cast, which is correct —
    // it would mean real data cannot fit the old type.
    await queryRunner.query(`
      ALTER TABLE "sequencing_submissions"
      ALTER COLUMN "project_id" TYPE UUID USING "project_id"::uuid
    `);

    await queryRunner.query(`
      ALTER TABLE "sequencing_jobs"
      DROP CONSTRAINT IF EXISTS "UQ_sequencing_jobs_external_id"
    `);
    await queryRunner.query(`
      ALTER TABLE "sequencing_jobs"
      DROP COLUMN IF EXISTS "external_id",
      DROP COLUMN IF EXISTS "pipeline_id",
      DROP COLUMN IF EXISTS "pipeline_version",
      DROP COLUMN IF EXISTS "stage",
      DROP COLUMN IF EXISTS "metrics",
      DROP COLUMN IF EXISTS "stages",
      DROP COLUMN IF EXISTS "artifacts",
      DROP COLUMN IF EXISTS "artifacts_uploaded",
      DROP COLUMN IF EXISTS "artifacts_error",
      DROP COLUMN IF EXISTS "finished_at",
      DROP COLUMN IF EXISTS "duration_s",
      DROP COLUMN IF EXISTS "submitted_params",
      DROP COLUMN IF EXISTS "extra_input_keys"
    `);
  }
}
