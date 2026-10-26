import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAnimalMetadata1779000000000 implements MigrationInterface {
  name = 'AddAnimalMetadata1779000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create animal_metadata table.
    //    site_id is denormalized from visit.site so the natural query
    //    "all animals at site X" is a single-column filter, not a join.
    await queryRunner.query(`
      CREATE TABLE "animal_metadata" (
        "id"                                            uuid                NOT NULL DEFAULT uuid_generate_v4(),
        "visit_id"                                      uuid                NOT NULL,
        "site_id"                                       uuid                NOT NULL,
        "animalTagId"                                   character varying,
        "birdId"                                        character varying,
        "species_id"                                    uuid,
        "breed"                                         character varying,
        "ageYears"                                      integer,
        "ageMonths"                                     integer,
        "gender"                                        character varying,
        "vaccinationStage"                              character varying,
        "diseaseHistory"                                character varying array,
        "averageMilkProductionPerDayWithinOneYear"      numeric(10,2),
        "averageMilkProductionPerDayBeforeOneYear"      numeric(10,2),
        "feverObserved"                                 boolean             NOT NULL DEFAULT false,
        "firstNoticedDate"                              TIMESTAMP,
        "vectors"                                       character varying array,
        "dropInFeedIntake"                              boolean             NOT NULL DEFAULT false,
        "dropInWaterIntake"                             boolean             NOT NULL DEFAULT false,
        "dropInEggProduction"                           boolean             NOT NULL DEFAULT false,
        "createdAt"                                     TIMESTAMP           NOT NULL DEFAULT now(),
        "updatedAt"                                     TIMESTAMP           NOT NULL DEFAULT now(),

        CONSTRAINT "PK_animal_metadata_id" PRIMARY KEY ("id")
      )
    `);

    // 2. Foreign keys
    await queryRunner.query(`
      ALTER TABLE "animal_metadata"
      ADD CONSTRAINT "FK_animal_metadata_visit"
      FOREIGN KEY ("visit_id")
      REFERENCES "visits"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "animal_metadata"
      ADD CONSTRAINT "FK_animal_metadata_site"
      FOREIGN KEY ("site_id")
      REFERENCES "sites"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "animal_metadata"
      ADD CONSTRAINT "FK_animal_metadata_species"
      FOREIGN KEY ("species_id")
      REFERENCES "species"("id")
      ON DELETE SET NULL
      ON UPDATE NO ACTION
    `);

    // 3. Indexes
    await queryRunner.query(`
      CREATE INDEX "IDX_animal_metadata_visitId"
      ON "animal_metadata" ("visit_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_animal_metadata_site_id"
      ON "animal_metadata" ("site_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_animal_metadata_speciesId"
      ON "animal_metadata" ("species_id")
    `);

    // Composite indexes power the dedup lookup paths in
    // SamplesService.resolveAnimalMetadata (site_id, animalTagId|birdId).
    await queryRunner.query(`
      CREATE INDEX "IDX_animal_metadata_site_tag"
      ON "animal_metadata" ("site_id", "animalTagId")
      WHERE "animalTagId" IS NOT NULL
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_animal_metadata_site_bird"
      ON "animal_metadata" ("site_id", "birdId")
      WHERE "birdId" IS NOT NULL
    `);

    // 4. Add animal_metadata_id column to samples table
    await queryRunner.query(`
      ALTER TABLE "samples"
      ADD "animal_metadata_id" uuid
    `);

    // 5. Foreign key samples → animal_metadata
    await queryRunner.query(`
      ALTER TABLE "samples"
      ADD CONSTRAINT "FK_samples_animal_metadata"
      FOREIGN KEY ("animal_metadata_id")
      REFERENCES "animal_metadata"("id")
      ON DELETE SET NULL
      ON UPDATE NO ACTION
    `);

    // 6. Index on samples(animal_metadata_id)
    await queryRunner.query(`
      CREATE INDEX "IDX_samples_animal_metadata_id"
      ON "samples" ("animal_metadata_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Drop index & foreign key on samples
    await queryRunner.query(`
      ALTER TABLE "samples"
      DROP CONSTRAINT "FK_samples_animal_metadata"
    `);
    await queryRunner.query(`
      DROP INDEX "IDX_samples_animal_metadata_id"
    `);
    await queryRunner.query(`
      ALTER TABLE "samples"
      DROP COLUMN "animal_metadata_id"
    `);

    // 2. Drop indexes on animal_metadata
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_animal_metadata_site_bird"
    `);
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_animal_metadata_site_tag"
    `);
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_animal_metadata_speciesId"
    `);
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_animal_metadata_site_id"
    `);
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_animal_metadata_visitId"
    `);

    // 3. Drop foreign keys
    await queryRunner.query(`
      ALTER TABLE "animal_metadata"
      DROP CONSTRAINT "FK_animal_metadata_species"
    `);
    await queryRunner.query(`
      ALTER TABLE "animal_metadata"
      DROP CONSTRAINT "FK_animal_metadata_site"
    `);
    await queryRunner.query(`
      ALTER TABLE "animal_metadata"
      DROP CONSTRAINT "FK_animal_metadata_visit"
    `);

    // 4. Drop table
    await queryRunner.query(`
      DROP TABLE "animal_metadata"
    `);
  }
}
