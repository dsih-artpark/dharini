import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWorkspacesTable1782000000000 implements MigrationInterface {
  name = 'AddWorkspacesTable1782000000000';

  // Guarded throughout. `synchronize: true` runs in development against a
  // shared database, so these objects may already exist by the time this
  // migration first runs — and the migrations table records an earlier,
  // renamed generation of the workspace migrations, so TypeORM considers this
  // one unapplied even where the schema change is already present. An
  // unguarded ADD COLUMN there aborts the migration, and main.ts exits the
  // process on a failed migration, so the app would never boot.
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'workspaces_status_enum') THEN
          CREATE TYPE "public"."workspaces_status_enum" AS ENUM('active', 'inactive', 'deleted');
        END IF;
      END $$;
    `);

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "workspaces" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "status" "public"."workspaces_status_enum" NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, CONSTRAINT "PK_ff5f37058e19a6efb63d90a89bb" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `
      DO $$
      DECLARE existing_name text;
      BEGIN
        SELECT c.conname INTO existing_name
        FROM pg_constraint c
        WHERE c.contype = 'f'
          AND c.conrelid = '"workspaces"'::regclass
          AND c.confrelid = '"users"'::regclass
          AND c.conkey = ARRAY[(
            SELECT a.attnum FROM pg_attribute a
            WHERE a.attrelid = c.conrelid AND a.attname = 'created_by'
          )]
        LIMIT 1;

        IF existing_name IS NULL THEN
          ALTER TABLE "workspaces" ADD CONSTRAINT "FK_workspaces_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        ELSIF existing_name <> 'FK_workspaces_created_by' THEN
          EXECUTE format('ALTER TABLE "workspaces" RENAME CONSTRAINT %I TO %I', existing_name, 'FK_workspaces_created_by');
        END IF;
      END $$;
    `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "workspaces" DROP CONSTRAINT "FK_workspaces_created_by"`,
    );
    await queryRunner.query(`DROP TABLE "workspaces"`);
    await queryRunner.query(`DROP TYPE "public"."workspaces_status_enum"`);
  }
}
