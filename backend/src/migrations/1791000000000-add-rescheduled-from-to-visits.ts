import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRescheduledFromToVisits1791000000000 implements MigrationInterface {
  name = 'AddRescheduledFromToVisits1791000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "visits" ADD COLUMN IF NOT EXISTS "rescheduledFrom" TIMESTAMP WITHOUT TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "visits" DROP COLUMN IF EXISTS "rescheduledFrom"`,
    );
  }
}
