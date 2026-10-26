import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Give every pre-workspace project a workspace, so tenant resolution has
 * something to resolve.
 *
 * Fixed id rather than uuid_generate_v4() so the same row exists in every
 * environment and re-running is a no-op.
 *
 * ONLY `projects.workspace_id` is backfilled. `user_roles.workspace_id` is
 * deliberately left NULL, and that is load-bearing:
 *
 *   `collectRoleTenantIds` (common/functions/tenant-scope.ts) collects
 *   `userRole.workspace.id` from EVERY role regardless of the role's scope,
 *   and `resolveTenantScope` then expands each collected workspace into every
 *   project inside it. Stamping this workspace onto the existing team- and
 *   project-scoped rows would therefore hand every one of those users all 12
 *   projects — the exact cross-tenant leak this whole branch exists to close.
 *
 * Nothing is lost by leaving it NULL. `WorkspacesService.findMine` derives a
 * user's workspaces from the workspaces of the projects their roles name, not
 * only from workspace-scoped roles, so a project- or team-scoped user still
 * sees this workspace in the switcher. Only genuinely workspace-scoped roles
 * need `user_roles.workspace_id`, and those are created through the invite
 * flow with it already set.
 */
const LEGACY_WORKSPACE_ID = '00000000-0000-4000-8000-000000000001';

export class BackfillLegacyWorkspace1790000000000 implements MigrationInterface {
  name = 'BackfillLegacyWorkspace1790000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "workspaces" ("id", "name")
       VALUES ($1, 'Legacy Workspace')
       ON CONFLICT ("id") DO NOTHING`,
      [LEGACY_WORKSPACE_ID],
    );

    // Only unassigned projects: never move a project some later change has
    // already placed in a real workspace.
    await queryRunner.query(
      `UPDATE "projects" SET "workspace_id" = $1 WHERE "workspace_id" IS NULL`,
      [LEGACY_WORKSPACE_ID],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "projects" SET "workspace_id" = NULL WHERE "workspace_id" = $1`,
      [LEGACY_WORKSPACE_ID],
    );
    await queryRunner.query(`DELETE FROM "workspaces" WHERE "id" = $1`, [
      LEGACY_WORKSPACE_ID,
    ]);
  }
}
