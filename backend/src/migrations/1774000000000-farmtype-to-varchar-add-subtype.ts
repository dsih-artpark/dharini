import { MigrationInterface, QueryRunner } from 'typeorm';

export class FarmtypeToVarcharAddSubtype1774000000000 implements MigrationInterface {
  name = 'FarmtypeToVarcharAddSubtype1774000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sites" ALTER COLUMN "farmType" TYPE character varying(100) USING "farmType"::text`,
    );

    await queryRunner.query(
      `ALTER TABLE "sites" ADD COLUMN IF NOT EXISTS "siteSubType" character varying(100)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sites" DROP COLUMN IF EXISTS "siteSubType"`,
    );
    await queryRunner.query(
      `DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sites_farmtype_enum') THEN
          CREATE TYPE "sites_farmtype_enum" AS ENUM ('cattle farm', 'poultry farm', 'wetland farm');
        END IF;
      END $$`,
    );

    await queryRunner.query(
      `ALTER TABLE "sites" ALTER COLUMN "farmType" TYPE "sites_farmtype_enum"
       USING CASE "farmType"
         WHEN 'cattle farm' THEN 'cattle farm'::"sites_farmtype_enum"
         WHEN 'poultry farm' THEN 'poultry farm'::"sites_farmtype_enum"
         WHEN 'wetland farm' THEN 'wetland farm'::"sites_farmtype_enum"
         ELSE NULL
       END`,
    );
  }
}
