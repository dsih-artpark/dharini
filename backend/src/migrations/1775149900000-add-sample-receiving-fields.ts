import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSampleReceivingFields1775149900000 implements MigrationInterface {
  name = 'AddSampleReceivingFields1775149900000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "samples"
      ADD COLUMN IF NOT EXISTS "receivedStorageTemperature" VARCHAR,
      ADD COLUMN IF NOT EXISTS "referenceBatchId" VARCHAR,
      ADD COLUMN IF NOT EXISTS "batchReferenceDocument" VARCHAR,
      ADD COLUMN IF NOT EXISTS "accessionId" VARCHAR
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "samples"
      DROP COLUMN IF EXISTS "receivedStorageTemperature",
      DROP COLUMN IF EXISTS "referenceBatchId",
      DROP COLUMN IF EXISTS "batchReferenceDocument",
      DROP COLUMN IF EXISTS "accessionId"
    `);
  }
}
