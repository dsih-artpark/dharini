import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSpecies1778067899171 implements MigrationInterface {
  name = 'AddSpecies1778067899171';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "species" (
        "id"                 uuid                NOT NULL DEFAULT uuid_generate_v4(),
        "name"               character varying   NOT NULL,
        "emojiIcon"          character varying,
        "diseaseShortNames"  text array,
        "abbreviation"       character varying,
        "active"             boolean             NOT NULL DEFAULT true,
        "createdAt"          TIMESTAMP           NOT NULL DEFAULT now(),
        "updatedAt"          TIMESTAMP           NOT NULL DEFAULT now(),

        CONSTRAINT "PK_species_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "samples"
      ADD "speciesId" uuid
    `);

    await queryRunner.query(`
      ALTER TABLE "samples"
      ADD CONSTRAINT "FK_samples_species"
      FOREIGN KEY ("speciesId")
      REFERENCES "species"("id")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_samples_speciesId"
      ON "samples" ("speciesId")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "samples"
      DROP CONSTRAINT "FK_samples_species"
    `);
    await queryRunner.query(`
      ALTER TABLE "samples"
      DROP COLUMN "speciesId"
    `);
    await queryRunner.query(`
      DROP TABLE "species"
    `);
  }
}
