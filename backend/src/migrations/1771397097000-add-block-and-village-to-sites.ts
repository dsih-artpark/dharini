import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBlockAndVillageToSites1771397097000 implements MigrationInterface {
  name = 'AddBlockAndVillageToSites1771397097000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sites" ADD COLUMN IF NOT EXISTS "block" character varying(200)`,
    );
    await queryRunner.query(
      `ALTER TABLE "sites" ADD COLUMN IF NOT EXISTS "village" character varying(200)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sites" DROP COLUMN IF EXISTS "village"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sites" DROP COLUMN IF EXISTS "block"`,
    );
  }
}
