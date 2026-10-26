import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVisitCoordinates1755599000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "visits" 
      ADD COLUMN "completedAtCoordinates" geometry(Point, 4326);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "visits" DROP COLUMN "completedAtCoordinates";
    `);
  }
}
