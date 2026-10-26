import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSequencingTables1776400000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "sequencing_submissions" (
        "id"                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "seq_id"            VARCHAR UNIQUE,
        "source_type"       VARCHAR NOT NULL,
        "lab_test_id"       UUID,
        "sample_barcode"    VARCHAR,
        "site_name"         VARCHAR,
        "disease_name"      VARCHAR,
        "file_format"       VARCHAR NOT NULL,
        "library_type"      VARCHAR NOT NULL,
        "platform"          VARCHAR NOT NULL,
        "sequencing_method" VARCHAR NOT NULL,
        "ncbi_accession"    VARCHAR,
        "ncbi_title"        TEXT,
        "ncbi_organism"     VARCHAR,
        "ncbi_length"       INT,
        "file_name_r1"      VARCHAR,
        "file_path_r1"      VARCHAR,
        "file_name_r2"      VARCHAR,
        "file_path_r2"      VARCHAR,
        "status"            VARCHAR DEFAULT 'pending',
        "project_id"        UUID,
        "submitted_by"      UUID,
        "submission_date"   DATE DEFAULT CURRENT_DATE,
        "created_at"        TIMESTAMPTZ DEFAULT now(),
        "updated_at"        TIMESTAMPTZ DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "sequencing_jobs" (
        "id"                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "submission_id"       UUID NOT NULL,
        "api_response"        JSONB,
        "api_status"          VARCHAR,
        "external_job_id"     VARCHAR,
        "status"              VARCHAR DEFAULT 'pending',
        "error_message"       TEXT,
        "run_id"              VARCHAR,
        "visualization_path"  VARCHAR,
        "snps_vcf_data"       TEXT,
        "annotated_vcf_data"  TEXT,
        "created_at"          TIMESTAMPTZ DEFAULT now(),
        "updated_at"          TIMESTAMPTZ DEFAULT now(),
        CONSTRAINT "FK_sequencing_jobs_submission_id"
          FOREIGN KEY ("submission_id")
          REFERENCES "sequencing_submissions"("id")
          ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "sequencing_jobs"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "sequencing_submissions"`);
  }
}
