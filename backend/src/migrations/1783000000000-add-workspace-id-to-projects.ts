import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWorkspaceIdToProjects1783000000000 implements MigrationInterface {
  name = 'AddWorkspaceIdToProjects1783000000000';

  // Guarded throughout. `synchronize: true` runs in development against a
  // shared database, so these objects may already exist by the time this
  // migration first runs — and the migrations table records an earlier,
  // renamed generation of the workspace migrations, so TypeORM considers this
  // one unapplied even where the schema change is already present. An
  // unguarded ADD COLUMN there aborts the migration, and main.ts exits the
  // process on a failed migration, so the app would never boot.
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Nullable, no backfill, no NOT NULL constraint here (see design doc:
    // 1.6 manual backfill, then 1.7 adds NOT NULL + FK constraint).
    await queryRunner.query(
      `ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "workspace_id" uuid`,
    );

    await queryRunner.query(
      `
      DO $$
      DECLARE existing_name text;
      BEGIN
        SELECT c.conname INTO existing_name
        FROM pg_constraint c
        WHERE c.contype = 'f'
          AND c.conrelid = '"projects"'::regclass
          AND c.confrelid = '"workspaces"'::regclass
          AND c.conkey = ARRAY[(
            SELECT a.attnum FROM pg_attribute a
            WHERE a.attrelid = c.conrelid AND a.attname = 'workspace_id'
          )]
        LIMIT 1;

        IF existing_name IS NULL THEN
          ALTER TABLE "projects" ADD CONSTRAINT "FK_projects_workspace_id" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        ELSIF existing_name <> 'FK_projects_workspace_id' THEN
          EXECUTE format('ALTER TABLE "projects" RENAME CONSTRAINT %I TO %I', existing_name, 'FK_projects_workspace_id');
        END IF;
      END $$;
    `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projects" DROP CONSTRAINT "FK_projects_workspace_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" DROP COLUMN "workspace_id"`,
    );
  }
}
