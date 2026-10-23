import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmojiAndDiseaseShortNamesToSampleType1772520991529 implements MigrationInterface {
  name = 'AddEmojiAndDiseaseShortNamesToSampleType1772520991529';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sample_types" ADD "emojiIcon" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "sample_types" ADD "diseaseShortNames" text array`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sample_types" DROP COLUMN "diseaseShortNames"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sample_types" DROP COLUMN "emojiIcon"`,
    );
  }
}
