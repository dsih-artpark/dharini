import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWorkspaceIdToInvites1786000000000 implements MigrationInterface {
  name = 'AddWorkspaceIdToInvites1786000000000';

  // Guarded throughout. `synchronize: true` runs in development against a
  // shared database, so these objects may already exist by the time this
  // migration first runs — and the migrations table records an earlier,
  // renamed generation of the workspace migrations, so TypeORM considers this
  // one unapplied even where the schema change is already present. An
  // unguarded ADD COLUMN there aborts the migration, and main.ts exits the
  // process on a failed migration, so the app would never boot.
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Nullable, no backfill — existing (project/team) invite rows stay NULL.
    // Only populated going forward for new workspace invites (2.7).
    await queryRunner.query(
      `ALTER TABLE "invites" ADD COLUMN IF NOT EXISTS "workspace_id" uuid`,
    );

    // A database where synchronize created this column first has it as
    // varchar (see the note on Invite.workspaceId), and the guarded ADD
    // COLUMN above leaves it that way — so the FK below would fail with
    // "incompatible types: character varying and uuid". Convert it first.
    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'invites'
            AND column_name = 'workspace_id'
            AND data_type <> 'uuid'
        ) THEN
          ALTER TABLE "invites"
            ALTER COLUMN "workspace_id" TYPE uuid
            USING NULLIF("workspace_id", '')::uuid;
        END IF;
      END $$;
    `);

    await queryRunner.query(
      `
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_invites_workspace_id') THEN
          ALTER TABLE "invites" ADD CONSTRAINT "FK_invites_workspace_id" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        END IF;
      END $$;
    `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invites" DROP CONSTRAINT "FK_invites_workspace_id"`,
    );
    await queryRunner.query(`ALTER TABLE "invites" DROP COLUMN "workspace_id"`);
  }
}
