import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatisticsAndSearchIndexes1781000000000 implements MigrationInterface {
  name = 'AddStatisticsAndSearchIndexes1781000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // lab_tests columns filtered/grouped on by every statistics dashboard
    // query (testResult CASE WHEN, testedAt >= :lastWeek, diseaseId IN (...))
    await queryRunner.query(`
      CREATE INDEX "IDX_lab_tests_testResult" ON "lab_tests" ("testResult")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_lab_tests_testedAt" ON "lab_tests" ("testedAt")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_lab_tests_diseaseId" ON "lab_tests" ("diseaseId")
    `);

    // samples columns used in DATE_TRUNC grouping and status CASE WHEN
    await queryRunner.query(`
      CREATE INDEX "IDX_samples_collectedAt" ON "samples" ("collectedAt")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_samples_sampleStatus" ON "samples" ("sampleStatus")
    `);

    // /api/search does LOWER(x) LIKE LOWER(:term) substring matches against
    // projects.name and sites.name with no index today, forcing a seq scan.
    // pg_trgm + a GIN trigram index makes substring LIKE fast.
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm`);
    await queryRunner.query(`
      CREATE INDEX "IDX_projects_name_trgm" ON "projects" USING GIN (LOWER("name") gin_trgm_ops)
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_sites_name_trgm" ON "sites" USING GIN (LOWER("name") gin_trgm_ops)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_sites_name_trgm"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_projects_name_trgm"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_samples_sampleStatus"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_samples_collectedAt"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_lab_tests_diseaseId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_lab_tests_testedAt"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_lab_tests_testResult"`);
  }
}
