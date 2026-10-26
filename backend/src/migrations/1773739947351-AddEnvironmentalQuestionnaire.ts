import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEnvironmentalQuestionnaire1773739947351 implements MigrationInterface {
  name = 'AddEnvironmentalQuestionnaire1773739947351';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "visits" ADD "environmentalQuestionnaireData" jsonb`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "visits" DROP COLUMN "environmentalQuestionnaireData"`,
    );
  }
}
