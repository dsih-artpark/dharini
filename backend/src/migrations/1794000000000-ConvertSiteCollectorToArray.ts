import { MigrationInterface, QueryRunner } from 'typeorm';

// sites.collector_id goes from one user id to a uuid[] of them, in place: each
// site keeps its collector as the only element, and a site without one gets an
// empty array. Arrays can't carry a foreign key, so the FK to users is dropped;
// SitesService checks the ids instead. visits."collectorId" is unchanged.
//
// Guarded so it can run on a database whose column TypeORM synchronize has
// already converted (development), and run again without effect.
export class ConvertSiteCollectorToArray1794000000000 implements MigrationInterface {
  name = 'ConvertSiteCollectorToArray1794000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // The FK's name is TypeORM's generated one, so drop whatever FK covers
    // the column rather than one name.
    await queryRunner.query(`
      DO $$
      DECLARE fk record;
      BEGIN
        FOR fk IN
          SELECT con.conname
          FROM pg_constraint con
          JOIN pg_attribute att
            ON att.attrelid = con.conrelid AND att.attnum = ANY (con.conkey)
          WHERE con.conrelid = 'sites'::regclass
            AND con.contype = 'f'
            AND att.attname = 'collector_id'
        LOOP
          EXECUTE format('ALTER TABLE "sites" DROP CONSTRAINT %I', fk.conname);
        END LOOP;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF (
          SELECT udt_name FROM information_schema.columns
          WHERE table_schema = current_schema()
            AND table_name = 'sites'
            AND column_name = 'collector_id'
        ) = 'uuid' THEN
          ALTER TABLE "sites" ALTER COLUMN "collector_id" TYPE uuid[]
            USING CASE
              WHEN "collector_id" IS NULL THEN '{}'::uuid[]
              ELSE ARRAY["collector_id"]
            END;
        END IF;
      END $$;
    `);

    await queryRunner.query(
      `UPDATE "sites" SET "collector_id" = '{}' WHERE "collector_id" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sites" ALTER COLUMN "collector_id" SET DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "sites" ALTER COLUMN "collector_id" SET NOT NULL`,
    );
    // Serves "sites this user collects for" (collector_id @> ARRAY[id]).
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_sites_collector_id" ON "sites" USING GIN ("collector_id")`,
    );
  }

  // Only each site's first collector survives the way back.
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_sites_collector_id"`);
    await queryRunner.query(`
      DO $$
      BEGIN
        IF (
          SELECT udt_name FROM information_schema.columns
          WHERE table_schema = current_schema()
            AND table_name = 'sites'
            AND column_name = 'collector_id'
        ) = '_uuid' THEN
          ALTER TABLE "sites" ALTER COLUMN "collector_id" DROP NOT NULL;
          ALTER TABLE "sites" ALTER COLUMN "collector_id" DROP DEFAULT;
          ALTER TABLE "sites" ALTER COLUMN "collector_id" TYPE uuid
            USING "collector_id"[1];
        END IF;
      END $$;
    `);
    // Without the FK an id could outlive its user; the restored FK would
    // refuse such a row.
    await queryRunner.query(`
      UPDATE "sites" s SET "collector_id" = NULL
      WHERE s."collector_id" IS NOT NULL
        AND NOT EXISTS (SELECT 1 FROM "users" u WHERE u."id" = s."collector_id")
    `);
    await queryRunner.query(`
      ALTER TABLE "sites" ADD CONSTRAINT "FK_e8907dffbf7fb3bd5708f07adda"
        FOREIGN KEY ("collector_id") REFERENCES "users"("id")
        ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }
}
