import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVisitDiseaseQuestionnaireData1769900000000 implements MigrationInterface {
  name = 'AddVisitDiseaseQuestionnaireData1769900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if column already exists before adding
    const columnExists = await queryRunner.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'visits' AND column_name = 'diseaseQuestionnaireData'
    `);

    if (columnExists.length === 0) {
      await queryRunner.query(
        `ALTER TABLE "visits" ADD COLUMN "diseaseQuestionnaireData" jsonb`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Check if column exists before dropping
    const columnExists = await queryRunner.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'visits' AND column_name = 'diseaseQuestionnaireData'
    `);

    if (columnExists.length > 0) {
      await queryRunner.query(
        `ALTER TABLE "visits" DROP COLUMN "diseaseQuestionnaireData"`,
      );
    }
  }
}
