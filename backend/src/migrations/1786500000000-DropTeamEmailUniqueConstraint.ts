import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropTeamEmailUniqueConstraint1786500000000 implements MigrationInterface {
  name = 'DropTeamEmailUniqueConstraint1786500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the globally unique constraint on teams.email so the same person
    // can lead a separate team in each project they are added to, rather than
    // sharing a single Team entity (and therefore its full member list) across
    // every project that team was ever linked to.
    await queryRunner.query(
      `ALTER TABLE "teams" DROP CONSTRAINT IF EXISTS "UQ_c89abbc8f98d43fae04eb5c9dc8"`,
    );
    // Some installations use a differently-named constraint; cover both.
    await queryRunner.query(
      `ALTER TABLE "teams" DROP CONSTRAINT IF EXISTS "teams_email_key"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "UQ_c89abbc8f98d43fae04eb5c9dc8"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // FIX-PLAN C5: this migration is deliberately one-way once the feature
    // it enables has been used. Re-adding the unique constraint unconditionally
    // will throw the moment two teams share an email (exactly what dropping
    // the constraint in up() was for — one person leading a separate team in
    // each project they're added to). Blindly attempting it would surface a
    // raw, confusing Postgres unique-violation error instead of an actionable
    // one, so fail fast with a clear message instead.
    //
    // To actually roll back: manually resolve duplicate "teams"."email"
    // values first (e.g. null out or rename the extras), then re-run
    // `ALTER TABLE "teams" ADD CONSTRAINT "teams_email_key" UNIQUE ("email")`
    // by hand.
    const [{ count }] = await queryRunner.query(`
      SELECT COUNT(*)::int AS count FROM (
        SELECT "email" FROM "teams"
        WHERE "email" IS NOT NULL
        GROUP BY "email"
        HAVING COUNT(*) > 1
      ) AS duplicates
    `);

    if (count > 0) {
      throw new Error(
        `Cannot roll back DropTeamEmailUniqueConstraint: ${count} "teams"."email" ` +
          'value(s) are now duplicated. This migration is one-way once the ' +
          'feature it enables (multiple teams sharing an email across ' +
          'projects) has been used in practice — resolve the duplicates ' +
          'manually, then re-add the unique constraint by hand.',
      );
    }

    await queryRunner.query(
      `ALTER TABLE "teams" ADD CONSTRAINT "teams_email_key" UNIQUE ("email")`,
    );
  }
}
