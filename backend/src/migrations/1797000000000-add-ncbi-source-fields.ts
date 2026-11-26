import { MigrationInterface, QueryRunner } from 'typeorm';

// GenBank "source" details saved on NCBI sequencing submissions: isolate,
// strain, host, geo_loc_name and collection date. The date is a full day
// only; NCBI's partial dates are left NULL.
//
// Guarded so it can run on a database whose columns TypeORM synchronize has
// already added (development), and run again without effect.
export class AddNcbiSourceFields1797000000000 implements MigrationInterface {
  name = 'AddNcbiSourceFields1797000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "sequencing_submissions"
      ADD COLUMN IF NOT EXISTS "ncbi_isolate" VARCHAR,
      ADD COLUMN IF NOT EXISTS "ncbi_strain" VARCHAR,
      ADD COLUMN IF NOT EXISTS "ncbi_host" VARCHAR,
      ADD COLUMN IF NOT EXISTS "ncbi_geo_loc_name" VARCHAR,
      ADD COLUMN IF NOT EXISTS "ncbi_collection_date" DATE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "sequencing_submissions"
      DROP COLUMN IF EXISTS "ncbi_collection_date",
      DROP COLUMN IF EXISTS "ncbi_geo_loc_name",
      DROP COLUMN IF EXISTS "ncbi_host",
      DROP COLUMN IF EXISTS "ncbi_strain",
      DROP COLUMN IF EXISTS "ncbi_isolate"
    `);
  }
}
