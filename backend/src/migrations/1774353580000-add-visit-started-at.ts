import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVisitStartedAt1774353580000 implements MigrationInterface {
  name = 'AddVisitStartedAt1774353580000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "visits" ADD COLUMN IF NOT EXISTS "visitStartedAt" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "visits" DROP COLUMN IF EXISTS "visitStartedAt"`,
    );
  }
}
