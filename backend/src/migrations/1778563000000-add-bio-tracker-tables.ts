import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBioTrackerTables1778563000000 implements MigrationInterface {
  name = 'AddBioTrackerTables1778563000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── bio_wetlands ──
    await queryRunner.query(
      `CREATE TABLE "bio_wetlands" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "srNo" integer,
        "state" character varying(100) NOT NULL,
        "district" character varying(100) NOT NULL,
        "longitude" double precision NOT NULL,
        "latitude" double precision NOT NULL,
        "wetlandTypeCode" integer,
        "wetlandTypeDescription" character varying(255),
        "areaHa" double precision,
        "name" character varying(255),
        "status" character varying(20),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_bio_wetlands" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bio_wetlands_state" ON "bio_wetlands" ("state")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bio_wetlands_district" ON "bio_wetlands" ("district")`,
    );

    // ── bio_poultry_farms ──
    await queryRunner.query(
      `CREATE TABLE "bio_poultry_farms" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "address" text,
        "phone" character varying(50),
        "email" character varying(255),
        "latitude" double precision NOT NULL,
        "longitude" double precision NOT NULL,
        "url" character varying(500),
        "ratingCount" integer NOT NULL DEFAULT 0,
        "starCount" double precision NOT NULL DEFAULT 0,
        "country" character varying(100),
        "state" character varying(100),
        "city" character varying(100),
        "zip" character varying(20),
        "facebookLink" character varying(500),
        "instagramLink" character varying(500),
        "twitterLink" character varying(500),
        "whatsappLink" character varying(500),
        "tiktokLink" character varying(500),
        "linkedinLink" character varying(500),
        "youtubeLink" character varying(500),
        "primaryCategoryName" character varying(255),
        "categoryName" character varying(255),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_bio_poultry_farms" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bio_poultry_farms_state" ON "bio_poultry_farms" ("state")`,
    );

    // ── bio_water_boundaries ──
    await queryRunner.query(
      `CREATE TABLE "bio_water_boundaries" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "osmId" character varying(50),
        "code" integer,
        "fclass" character varying(50),
        "name" character varying(255),
        "geometry" geometry(Geometry,4326),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_bio_water_boundaries" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bio_water_boundaries_osmId" ON "bio_water_boundaries" ("osmId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bio_water_boundaries_fclass" ON "bio_water_boundaries" ("fclass")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bio_water_boundaries_geometry" ON "bio_water_boundaries" USING GiST ("geometry")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "bio_water_boundaries"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "bio_poultry_farms"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "bio_wetlands"`);
  }
}
