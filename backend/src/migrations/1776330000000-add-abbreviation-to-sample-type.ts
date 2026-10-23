import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAbbreviationToSampleType1776330000000 implements MigrationInterface {
  name = 'AddAbbreviationToSampleType1776330000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sample_types" ADD "abbreviation" character varying`,
    );

    // Set some default abbreviations
    await queryRunner.query(
      `UPDATE "sample_types" SET "abbreviation" = 'CL' WHERE "name" ILIKE '%Cloacal Swab%'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sample_types" DROP COLUMN "abbreviation"`,
    );
  }
}
