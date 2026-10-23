import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adds the FK `sequencing_submissions.project_id` -> `projects(id)` and puts
 * the column on the right type.
 *
 * `projects.id` is a nanoid string ("P" + 5 chars - see
 * `Project.generateId()`), not a UUID, so the original `uuid` declaration in
 * `CreateSequencingTables1776400000000` could never have held a real project
 * id. Every other FK to `projects(id)` in the schema (`sites.projectId`,
 * `samples.projectId`, `lab_tests.projectId`, ...) is `text`, and this now
 * matches them.
 *
 * Ordering matters and is handled by timestamp:
 * `MigrateSequencingToV1Pipeline1787230000000` runs first, truncating both
 * sequencing tables and widening this column to `varchar`. This migration
 * then converts `varchar` -> `text` and adds the constraint, so on a database
 * that has run the full chain the table is empty when the FK lands.
 *
 * The service populates this column on every new submission and scopes reads
 * by it (see `sequencing-jobs.service.ts`), so rows written after this point
 * carry a real project code.
 */
export class AddProjectFkToSequencingSubmissions1788000000000 implements MigrationInterface {
  name = 'AddProjectFkToSequencingSubmissions1788000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sequencing_submissions" ALTER COLUMN "project_id" TYPE text USING "project_id"::text`,
    );
    // Defensive: main.ts runs migrations on boot and exits the process if one
    // throws, so a single orphan value here would crash-loop the app. Every
    // row is expected to be NULL, but null out anything that cannot satisfy
    // the constraint rather than discovering it in production.
    await queryRunner.query(
      `UPDATE "sequencing_submissions" SET "project_id" = NULL
         WHERE "project_id" IS NOT NULL
           AND "project_id" NOT IN (SELECT "id" FROM "projects")`,
    );
    await queryRunner.query(
      `ALTER TABLE "sequencing_submissions" ADD CONSTRAINT "FK_sequencing_submissions_project_id" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sequencing_submissions" DROP CONSTRAINT "FK_sequencing_submissions_project_id"`,
    );
    // Best-effort reversal. Only safe if every row is still NULL (true at
    // migration time); a real nanoid project id written after `up` runs
    // would fail this cast, which is expected - this column cannot
    // meaningfully hold a project id as `uuid`.
    await queryRunner.query(
      `ALTER TABLE "sequencing_submissions" ALTER COLUMN "project_id" TYPE uuid USING "project_id"::uuid`,
    );
  }
}
