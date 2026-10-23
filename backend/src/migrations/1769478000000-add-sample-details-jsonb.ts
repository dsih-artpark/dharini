import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSampleDetailsJsonb1769478000000 implements MigrationInterface {
  name = 'AddSampleDetailsJsonb1769478000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "samples"
      ADD COLUMN IF NOT EXISTS "details" jsonb
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "samples"
      DROP COLUMN IF EXISTS "details"
    `);
  }
}
