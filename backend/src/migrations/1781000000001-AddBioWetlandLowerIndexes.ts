import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBioWetlandLowerIndexes1781000000001 implements MigrationInterface {
  name = 'AddBioWetlandLowerIndexes1781000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // geolens.service.ts filters wetlands with LOWER(w.state) = LOWER(:state)
    // and LOWER(w.district) = LOWER(:district) for case-insensitive matching.
    // The plain @Index() on state/district can't be used once the column is
    // wrapped in LOWER(), forcing a sequential scan. Functional indexes on
    // LOWER(state)/LOWER(district) let Postgres use an index for this shape.
    await queryRunner.query(`
      CREATE INDEX "IDX_bio_wetlands_lower_state" ON "bio_wetlands" (LOWER("state"))
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_bio_wetlands_lower_district" ON "bio_wetlands" (LOWER("district"))
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_bio_wetlands_lower_district"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_bio_wetlands_lower_state"`,
    );
  }
}
