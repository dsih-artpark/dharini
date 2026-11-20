import { MigrationInterface, QueryRunner } from 'typeorm';

// Columns for discarding a sample mid-process (Pre-processing to Testing).
// A sample is discarded when "discardedAt" is set; "sampleStatus" is left as
// it was, so no new status value is added.
//
// Guarded so it can run on a database whose columns TypeORM synchronize has
// already added (development), and run again without effect.
export class AddSampleDiscardFields1796000000000 implements MigrationInterface {
  name = 'AddSampleDiscardFields1796000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "samples"
      ADD COLUMN IF NOT EXISTS "discardReason" VARCHAR,
      ADD COLUMN IF NOT EXISTS "discardComment" TEXT,
      ADD COLUMN IF NOT EXISTS "discardedAt" TIMESTAMP,
      ADD COLUMN IF NOT EXISTS "discardedById" uuid
    `);

    // Only add the FK if none covers the column yet (synchronize may have
    // created one under TypeORM's generated name).
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint con
          JOIN pg_attribute att
            ON att.attrelid = con.conrelid AND att.attnum = ANY (con.conkey)
          WHERE con.conrelid = 'samples'::regclass
            AND con.contype = 'f'
            AND att.attname = 'discardedById'
        ) THEN
          ALTER TABLE "samples"
          ADD CONSTRAINT "FK_samples_discarded_by"
          FOREIGN KEY ("discardedById")
          REFERENCES "users"("id")
          ON DELETE SET NULL;
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      DECLARE fk record;
      BEGIN
        FOR fk IN
          SELECT con.conname
          FROM pg_constraint con
          JOIN pg_attribute att
            ON att.attrelid = con.conrelid AND att.attnum = ANY (con.conkey)
          WHERE con.conrelid = 'samples'::regclass
            AND con.contype = 'f'
            AND att.attname = 'discardedById'
        LOOP
          EXECUTE format('ALTER TABLE "samples" DROP CONSTRAINT %I', fk.conname);
        END LOOP;
      END $$;
    `);

    await queryRunner.query(`
      ALTER TABLE "samples"
      DROP COLUMN IF EXISTS "discardReason",
      DROP COLUMN IF EXISTS "discardComment",
      DROP COLUMN IF EXISTS "discardedAt",
      DROP COLUMN IF EXISTS "discardedById"
    `);
  }
}
