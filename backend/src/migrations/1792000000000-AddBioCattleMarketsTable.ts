import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adds `bio_cattle_markets`, the livestock-market reference layer that sits
 * alongside `bio_wetlands` and `bio_poultry_farms` and is seeded from
 * src/seeder/data/cattle-market.csv.
 */
export class AddBioCattleMarketsTable1792000000000 implements MigrationInterface {
  name = 'AddBioCattleMarketsTable1792000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bio_cattle_markets" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "operatingDay" character varying(50),
        "latitude" double precision NOT NULL,
        "longitude" double precision NOT NULL,
        "state" character varying(100) NOT NULL,
        "district" character varying(100) NOT NULL,
        "lgdStateCode" character varying(10),
        "lgdDistrictCode" character varying(10),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_bio_cattle_markets" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bio_cattle_markets_state" ON "bio_cattle_markets" ("state")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bio_cattle_markets_district" ON "bio_cattle_markets" ("district")`,
    );
    // The state filter arrives as free-form text and is compared case
    // insensitively (LOWER(state) = LOWER(:state)), which cannot use the plain
    // btree above - mirrors IDX_bio_wetlands_lower_state.
    await queryRunner.query(
      `CREATE INDEX "IDX_bio_cattle_markets_lower_state" ON "bio_cattle_markets" (LOWER("state"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "bio_cattle_markets"`);
  }
}
