import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * FIX-PLAN B8.
 *
 * 1. `projects.workspace_id` and `user_roles.workspace_id` (added nullable,
 *    unindexed, by 1783/1784) are both read on every authenticated request
 *    via AbilityFactory's tenant resolution - add indexes.
 * 2. `roles.scope` defaulted to `'system'` (the highest-privilege value) for
 *    any role row created without explicitly setting it - backwards for a
 *    column that decides authorization. The entity-level default was
 *    already flipped to `'project'` (see role.entity.ts); this brings the
 *    DB column's DEFAULT in line, since TypeORM's decorator default alone
 *    doesn't touch already-materialized schema.
 */
export class AddWorkspaceTenantIndexesAndRoleScopeDefault1789000000000 implements MigrationInterface {
  name = 'AddWorkspaceTenantIndexesAndRoleScopeDefault1789000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_projects_workspace_id" ON "projects" ("workspace_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_user_roles_workspace_id" ON "user_roles" ("workspace_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ALTER COLUMN "scope" SET DEFAULT 'project'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "roles" ALTER COLUMN "scope" SET DEFAULT 'system'`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_user_roles_workspace_id"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_projects_workspace_id"`);
  }
}
