import { MigrationInterface, QueryRunner } from 'typeorm';

// visits."visitedById" goes from one user id to a uuid[] of them, in place:
// each visit keeps who visited it as the only element, and a visit nobody has
// visited gets an empty array. The submitter comes first. Arrays can't carry a
// foreign key, so the FK to users is dropped; VisitService checks the ids
// instead. visits."collectorId" is unchanged.
//
// Guarded so it can run on a database whose column TypeORM synchronize has
// already converted (development), and run again without effect.
export class ConvertVisitVisitedByToArray1795000000000 implements MigrationInterface {
  name = 'ConvertVisitVisitedByToArray1795000000000';

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
          WHERE con.conrelid = 'visits'::regclass
            AND con.contype = 'f'
            AND att.attname = 'visitedById'
        LOOP
          EXECUTE format('ALTER TABLE "visits" DROP CONSTRAINT %I', fk.conname);
        END LOOP;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF (
          SELECT udt_name FROM information_schema.columns
          WHERE table_schema = current_schema()
            AND table_name = 'visits'
            AND column_name = 'visitedById'
        ) = 'uuid' THEN
          ALTER TABLE "visits" ALTER COLUMN "visitedById" TYPE uuid[]
            USING CASE
              WHEN "visitedById" IS NULL THEN '{}'::uuid[]
              ELSE ARRAY["visitedById"]
            END;
        END IF;
      END $$;
    `);

    await queryRunner.query(
      `UPDATE "visits" SET "visitedById" = '{}' WHERE "visitedById" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" ALTER COLUMN "visitedById" SET DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" ALTER COLUMN "visitedById" SET NOT NULL`,
    );
    // Serves "visits this user was at" ("visitedById" @> ARRAY[id]).
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_visits_visitedById" ON "visits" USING GIN ("visitedById")`,
    );
  }

  // Only each visit's first visitor, its submitter, survives the way back.
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_visits_visitedById"`);
    await queryRunner.query(`
      DO $$
      BEGIN
        IF (
          SELECT udt_name FROM information_schema.columns
          WHERE table_schema = current_schema()
            AND table_name = 'visits'
            AND column_name = 'visitedById'
        ) = '_uuid' THEN
          ALTER TABLE "visits" ALTER COLUMN "visitedById" DROP NOT NULL;
          ALTER TABLE "visits" ALTER COLUMN "visitedById" DROP DEFAULT;
          ALTER TABLE "visits" ALTER COLUMN "visitedById" TYPE uuid
            USING "visitedById"[1];
        END IF;
      END $$;
    `);
    // Without the FK an id could outlive its user; the restored FK would
    // refuse such a row.
    await queryRunner.query(`
      UPDATE "visits" v SET "visitedById" = NULL
      WHERE v."visitedById" IS NOT NULL
        AND NOT EXISTS (SELECT 1 FROM "users" u WHERE u."id" = v."visitedById")
    `);
    await queryRunner.query(`
      ALTER TABLE "visits" ADD CONSTRAINT "FK_cedb5ea8ff342831c53622fef9e"
        FOREIGN KEY ("visitedById") REFERENCES "users"("id")
        ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }
}
