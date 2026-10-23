import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddViralLoadToLabTests1776329721000 implements MigrationInterface {
  name = 'AddViralLoadToLabTests1776329721000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "lab_tests"
      ADD COLUMN IF NOT EXISTS "viralLoad" VARCHAR
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "lab_tests"
      DROP COLUMN IF EXISTS "viralLoad"
    `);
  }
}
