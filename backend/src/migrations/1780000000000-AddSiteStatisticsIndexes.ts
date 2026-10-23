import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSiteStatisticsIndexes1780000000000 implements MigrationInterface {
  name = 'AddSiteStatisticsIndexes1780000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // samples.siteId and lab_tests.sampleId are FK columns with no index,
    // so every "sites-statistics-by-status" request runs several correlated
    // EXISTS subqueries per site as sequential scans. These indexes turn
    // those into index lookups.
    await queryRunner.query(`
      CREATE INDEX "IDX_samples_siteId" ON "samples" ("siteId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_lab_tests_sampleId" ON "lab_tests" ("sampleId")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_lab_tests_sampleId"
    `);
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_samples_siteId"
    `);
  }
}
