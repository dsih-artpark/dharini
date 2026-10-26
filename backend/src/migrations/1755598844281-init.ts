import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1755598844281 implements MigrationInterface {
  name = 'Init1755598844281';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'regions_regiontype_enum') THEN
                CREATE TYPE "public"."regions_regiontype_enum" AS ENUM('country', 'state', 'district', 'subdistrict', 'city');
            END IF;
        END$$;`,
    );
    await queryRunner.query(
      `DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'regions_status_enum') THEN
                CREATE TYPE "public"."regions_status_enum" AS ENUM('active', 'inactive', 'deleted');
            END IF;
        END$$;`,
    );
    await queryRunner.query(
      `CREATE TABLE "regions" ("id" character varying NOT NULL, "regionType" "public"."regions_regiontype_enum" NOT NULL, "lgdCode" character varying(255), "metaData" jsonb, "localName" character varying(255) NOT NULL, "name" character varying(255) NOT NULL, "status" "public"."regions_status_enum" NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "parentRegionId" character varying, CONSTRAINT "UQ_09f2ca790e8c71ef51ce7cda325" UNIQUE ("regionType", "lgdCode", "parentRegionId"), CONSTRAINT "PK_4fcd12ed6a046276e2deb08801c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'locations_status_enum') THEN
                CREATE TYPE "public"."locations_status_enum" AS ENUM('active', 'inactive', 'deleted');
            END IF;
        END$$;`,
    );
    await queryRunner.query(
      `CREATE TABLE "locations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "coordinates" geometry(Point,4326), "status" "public"."locations_status_enum" NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "regionId" character varying, CONSTRAINT "PK_7cc1c9e3853b94816c094825e74" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invites_inviteetype_enum') THEN
                CREATE TYPE "public"."invites_inviteetype_enum" AS ENUM('team', 'user', 'individual-contractor');
            END IF;
        END$$;`,
    );
    await queryRunner.query(
      `CREATE TABLE "invites" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "inviteeType" "public"."invites_inviteetype_enum", "teamName" character varying, "team" character varying, "username" character varying, "role" character varying, "user" character varying, "firstName" character varying, "lastName" character varying, "email" character varying, "contactNumber" character varying(15), "projectId" character varying, "inviteToken" character varying, "expirationDate" TIMESTAMP, "isProjectViewer" boolean NOT NULL DEFAULT false, "accepted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "invitedById" uuid, CONSTRAINT "PK_aa52e96b44a714372f4dd31a0af" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'teams_status_enum') THEN
                CREATE TYPE "public"."teams_status_enum" AS ENUM('active', 'inactive', 'deleted');
            END IF;
        END$$;`,
    );
    await queryRunner.query(
      `CREATE TABLE "teams" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "teamName" character varying(255), "address" character varying, "logo" character varying, "isProjectViewer" boolean NOT NULL DEFAULT false, "email" character varying(255) NOT NULL, "status" "public"."teams_status_enum" NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2195007977b1b9cf76ad224324c" UNIQUE ("email"), CONSTRAINT "PK_7e5523774a38b08a6236d322403" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'permissions_status_enum') THEN
                CREATE TYPE "public"."permissions_status_enum" AS ENUM('active', 'inactive', 'deleted');
            END IF;
        END$$;`,
    );
    await queryRunner.query(
      `CREATE TABLE "permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "scope" character varying, "action" character varying NOT NULL, "subject" character varying NOT NULL, "status" "public"."permissions_status_enum" NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'roles_status_enum') THEN
                CREATE TYPE "public"."roles_status_enum" AS ENUM('active', 'inactive', 'deleted');
            END IF;
        END$$;`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "scope" character varying NOT NULL DEFAULT 'system', "type" character varying NOT NULL DEFAULT 'pre-defined', "status" "public"."roles_status_enum" NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_roles_status_enum') THEN
                CREATE TYPE "public"."user_roles_status_enum" AS ENUM('active', 'inactive', 'deleted');
            END IF;
        END$$;`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "team" character varying, "project" character varying, "status" "public"."user_roles_status_enum" NOT NULL DEFAULT 'active', "roleId" uuid, "userId" uuid, CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sample_audits_status_enum') THEN
                CREATE TYPE "public"."sample_audits_status_enum" AS ENUM('active', 'inactive', 'deleted');
            END IF;
        END$$;`,
    );
    await queryRunner.query(
      `CREATE TABLE "sample_audits" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "previousChanges" jsonb, "currentChanges" jsonb, "event" character varying, "status" "public"."sample_audits_status_enum" NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "sampleId" uuid, "userId" uuid, CONSTRAINT "PK_e08a07ab9d73f5daa1a55b2ad55" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'users_status_enum') THEN
                CREATE TYPE "public"."users_status_enum" AS ENUM('active', 'inactive', 'deleted');
            END IF;
        END$$;`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying(255), "lastName" character varying(255), "profilePicture" character varying, "designation" character varying(255), "contactNumber" character varying(15), "address" character varying(255), "email" character varying(255), "status" "public"."users_status_enum" NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "projectId" text, "teamId" uuid, CONSTRAINT "UQ_4b632cb215a511f09a891c8aadd" UNIQUE ("contactNumber"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sites_collectiondayofweek_enum') THEN
                CREATE TYPE "public"."sites_collectiondayofweek_enum" AS ENUM('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
            END IF;
        END$$;`,
    );
    await queryRunner.query(
      `DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sites_farmtype_enum') THEN
                CREATE TYPE "public"."sites_farmtype_enum" AS ENUM('cattle farm', 'poultry farm', 'wetland farm');
            END IF;
        END$$;`,
    );
    await queryRunner.query(
      `DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sites_sitetype_enum') THEN
                CREATE TYPE "public"."sites_sitetype_enum" AS ENUM('private', 'government', 'corporate');
            END IF;
        END$$;`,
    );
    await queryRunner.query(
      `DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sites_status_enum') THEN
                CREATE TYPE "public"."sites_status_enum" AS ENUM('active', 'inactive', 'deleted');
            END IF;
        END$$;`,
    );
    await queryRunner.query(
      `DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sites_testresult_enum') THEN
                CREATE TYPE "public"."sites_testresult_enum" AS ENUM('pending', 'positive', 'negative', 'unclear');
            END IF;
        END$$;`,
    );
    await queryRunner.query(
      `CREATE TABLE "sites" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "siteCode" character varying(255), "collectionConsent" character varying, "collectionFrequencyInterval" integer, "collectionFrequency" integer, "collectionDayOfWeek" "public"."sites_collectiondayofweek_enum" array, "collectionTime" TIME, "collectionStartDate" TIMESTAMP, "collectionLastScheduleDate" TIMESTAMP, "collectionDuration" integer, "collectionExpiryDate" TIMESTAMP, "photos" character varying array, "farmType" "public"."sites_farmtype_enum", "siteType" "public"."sites_sitetype_enum", "siteOwnerName" character varying(100), "siteOwnerNumber" character varying(15), "workerNumber" integer, "address" character varying(400), "pinCode" integer, "comment" character varying(400), "status" "public"."sites_status_enum" NOT NULL DEFAULT 'active', "testResult" "public"."sites_testresult_enum" NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "projectId" text, "collector_id" uuid, "location_id" uuid, "created_by" uuid, "updated_by" uuid, CONSTRAINT "PK_4f5eccb1dfde10c9170502595a7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lab_tests_testresult_enum') THEN
                CREATE TYPE "public"."lab_tests_testresult_enum" AS ENUM('pending', 'positive', 'negative', 'unclear');
            END IF;
        END$$;`,
    );
    await queryRunner.query(
      `DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lab_tests_status_enum') THEN
                CREATE TYPE "public"."lab_tests_status_enum" AS ENUM('active', 'inactive', 'deleted');
            END IF;
        END$$;`,
    );
    await queryRunner.query(
      `CREATE TABLE "lab_tests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ctValue" character varying, "variant" character varying, "kitOrProtocol" character varying, "labComment" character varying, "resultDate" TIMESTAMP, "resultComment" character varying, "testResultReport" character varying, "testedAt" TIMESTAMP DEFAULT now(), "testResult" "public"."lab_tests_testresult_enum", "details" jsonb, "status" "public"."lab_tests_status_enum" NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "projectId" text NOT NULL, "sampleId" uuid NOT NULL, "visitId" uuid NOT NULL, "teamId" uuid NOT NULL, "diseaseId" uuid NOT NULL, "siteId" uuid NOT NULL, "testedById" uuid, CONSTRAINT "PK_400d229da68540bf586c0f4a20f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'surveillance_types_status_enum') THEN
                CREATE TYPE "public"."surveillance_types_status_enum" AS ENUM('active', 'inactive', 'deleted');
            END IF;
        END$$;`,
    );
    await queryRunner.query(
      `CREATE TABLE "surveillance_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "status" "public"."surveillance_types_status_enum" NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7033a9fb3c56cd2996b76bcb276" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sample_types_status_enum') THEN
                CREATE TYPE "public"."sample_types_status_enum" AS ENUM('active', 'inactive', 'deleted');
            END IF;
        END$$;`,
    );
    await queryRunner.query(
      `CREATE TABLE "sample_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "status" "public"."sample_types_status_enum" NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "surveillanceTypeId" uuid, CONSTRAINT "PK_8bdc605a5d502c58e7908d7d319" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'samples_replicates_enum') THEN
                CREATE TYPE "public"."samples_replicates_enum" AS ENUM('available', 'not collected');
            END IF;
        END$$;`,
    );
    await queryRunner.query(
      `DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'samples_samplestatus_enum') THEN
                CREATE TYPE "public"."samples_samplestatus_enum" AS ENUM('pending', 'picked-up', 'received', 'extracted', 'tested', 'rejected', 'test-report-generated');
            END IF;
        END$$;`,
    );
    await queryRunner.query(
      `DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'samples_status_enum') THEN
                CREATE TYPE "public"."samples_status_enum" AS ENUM('active', 'inactive', 'deleted');
            END IF;
        END$$;`,
    );
    await queryRunner.query(
      `CREATE TABLE "samples" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sampleCode" character varying, "collectedAt" TIMESTAMP NOT NULL DEFAULT now(), "quantity" integer, "unit" character varying, "habitat" character varying, "conc" character varying, "rejectReason" character varying, "rejectedAt" TIMESTAMP, "receivedAt" TIMESTAMP, "receivedVolumeValue" character varying, "receivedVolumeUnit" character varying, "receivedLabStorageDetails" character varying, "extractionDateTime" TIMESTAMP, "extractionSampleUsedValue" character varying, "extractionSampleUsedUnit" character varying, "extractionSampleRemainingValue" character varying, "extractionSampleRemainingUnit" character varying, "extractionComments" character varying, "collectionTime" TIMESTAMP NOT NULL DEFAULT now(), "testedAt" TIMESTAMP, "reportGeneratedAt" TIMESTAMP, "photos" character varying array, "comment" character varying, "replicates" "public"."samples_replicates_enum" NOT NULL DEFAULT 'not collected', "sampleStatus" "public"."samples_samplestatus_enum" NOT NULL DEFAULT 'picked-up', "barcode" character varying NOT NULL, "status" "public"."samples_status_enum" NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "projectId" text NOT NULL, "siteId" uuid NOT NULL, "teamId" uuid NOT NULL, "visitId" uuid, "sampleTypeId" uuid, "collectedById" uuid, "receivedById" uuid, "extractedById" uuid, "testedById" uuid, "reportGeneratedById" uuid, "originalSampleId" uuid, "location_id" uuid, CONSTRAINT "PK_d68b5b3bd25a6851b033fb63444" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_49bfe760640fc5d89721e3c5bc" ON "samples" ("barcode", "projectId") `,
    );
    await queryRunner.query(
      `DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'diseases_status_enum') THEN
                CREATE TYPE "public"."diseases_status_enum" AS ENUM('active', 'inactive', 'deleted');
            END IF;
        END$$;`,
    );
    await queryRunner.query(
      `CREATE TABLE "diseases" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying(255) NOT NULL, "name" character varying(255) NOT NULL, "shortName" character varying(255), "index" SERIAL NOT NULL, "status" "public"."diseases_status_enum" NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e0c5faa8b8f4ff13c13defa60d5" UNIQUE ("code"), CONSTRAINT "PK_79ddc936b1458d8a079b62dc210" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'projects_status_enum') THEN
                CREATE TYPE "public"."projects_status_enum" AS ENUM('active', 'inactive', 'deleted');
            END IF;
        END$$;`,
    );
    await queryRunner.query(
      `CREATE TABLE "projects" ("id" text NOT NULL, "name" character varying(255) NOT NULL, "code" character varying(255) NOT NULL, "isOnboardingCompleted" boolean NOT NULL DEFAULT false, "status" "public"."projects_status_enum" NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, CONSTRAINT "UQ_d95a87318392465ab663a32cc4f" UNIQUE ("code"), CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'visits_visitstatus_enum') THEN
                CREATE TYPE "public"."visits_visitstatus_enum" AS ENUM('upcoming', 'overdue', 'skipped', 'completed');
            END IF;
        END$$;`,
    );
    await queryRunner.query(
      `DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'visits_status_enum') THEN
                CREATE TYPE "public"."visits_status_enum" AS ENUM('active', 'inactive', 'deleted');
            END IF;
        END$$;`,
    );
    await queryRunner.query(
      `CREATE TABLE "visits" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "questionSetId" character varying, "visitedAt" TIMESTAMP, "visitScheduledAt" TIMESTAMP NOT NULL, "visitStatus" "public"."visits_visitstatus_enum" NOT NULL DEFAULT 'upcoming', "photos" character varying array, "comment" character varying, "status" "public"."visits_status_enum" NOT NULL DEFAULT 'active', "suspectedPositives" jsonb DEFAULT '[]', "isCompleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "projectId" text, "siteId" uuid, "teamId" uuid NOT NULL, "collectorId" uuid NOT NULL, "visitedById" uuid, CONSTRAINT "PK_0b0b322289a41015c6ea4e8bf30" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'site_types_status_enum') THEN
                CREATE TYPE "public"."site_types_status_enum" AS ENUM('active', 'inactive', 'deleted');
            END IF;
        END$$;`,
    );
    await queryRunner.query(
      `CREATE TABLE "site_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "status" "public"."site_types_status_enum" NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_562bd588ffaec1cca0950e80abc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "otps" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255), "contactNumber" character varying(15), "otp" integer, "otpExpireTime" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_91fef5ed60605b854a2115d2410" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "medias" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "path" character varying NOT NULL, CONSTRAINT "PK_f27321557a66cd4fae9bc1ed6e7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'kits_status_enum') THEN
                CREATE TYPE "public"."kits_status_enum" AS ENUM('active', 'inactive', 'deleted');
            END IF;
        END$$;`,
    );
    await queryRunner.query(
      `CREATE TABLE "kits" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "status" "public"."kits_status_enum" NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ce4a775d30ac772ed054b155376" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "role_permissions" ("role_id" uuid NOT NULL, "permission_id" uuid NOT NULL, CONSTRAINT "PK_25d24010f53bb80b78e412c9656" PRIMARY KEY ("role_id", "permission_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_178199805b901ccd220ab7740e" ON "role_permissions" ("role_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_17022daf3f885f7d35423e9971" ON "role_permissions" ("permission_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "site_diseases" ("site_id" uuid NOT NULL, "disease_id" uuid NOT NULL, CONSTRAINT "PK_665f7d2f90af7e49b624ab454ff" PRIMARY KEY ("site_id", "disease_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fb3e4a9ff4e20b42557cd17b06" ON "site_diseases" ("site_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1eb63568a19791cb951c078d67" ON "site_diseases" ("disease_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "samples_diseases_diseases" ("samplesId" uuid NOT NULL, "diseasesId" uuid NOT NULL, CONSTRAINT "PK_6436ac42df167ce73a80e31f8bc" PRIMARY KEY ("samplesId", "diseasesId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fcc3ab9149b1e6fc74dea4d9c2" ON "samples_diseases_diseases" ("samplesId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c98e2b2a2f75cdc9dabcb57066" ON "samples_diseases_diseases" ("diseasesId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project_admins" ("project_id" text NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_a3f2e5041ea5ab359ff9727cff3" PRIMARY KEY ("project_id", "user_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7431e8e9db7f6d0a27553ec28d" ON "project_admins" ("project_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_864befed89c52e53d7d5a1486f" ON "project_admins" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project_diseases" ("project_id" text NOT NULL, "disease_id" uuid NOT NULL, CONSTRAINT "PK_9452bf66882497589e9411d1209" PRIMARY KEY ("project_id", "disease_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1fcc99a3974d77c8391d3c5406" ON "project_diseases" ("project_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_01fb15361ff7ea2e7901f11c36" ON "project_diseases" ("disease_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project_surveillance_types" ("project_id" text NOT NULL, "surveillance_type_id" uuid NOT NULL, CONSTRAINT "PK_05031d72a11632f556ae1255a21" PRIMARY KEY ("project_id", "surveillance_type_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_29186559efe8ea1204182da57f" ON "project_surveillance_types" ("project_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c0bf605364e690a7aaad4a1403" ON "project_surveillance_types" ("surveillance_type_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project_regions" ("project_id" text NOT NULL, "region_id" character varying NOT NULL, CONSTRAINT "PK_ecd1fa751762c26f544c77186c1" PRIMARY KEY ("project_id", "region_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9a0b69cfe9689475c321d08cde" ON "project_regions" ("project_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c496eac577fb08bf147c0a818a" ON "project_regions" ("region_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project_teams" ("project_id" text NOT NULL, "team_id" uuid NOT NULL, CONSTRAINT "PK_0474ed6380b82e0ecdb54124a93" PRIMARY KEY ("project_id", "team_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8e02f911192897094a081e6823" ON "project_teams" ("project_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c448616f12038bffafbeea6828" ON "project_teams" ("team_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "regions" ADD CONSTRAINT "FK_87b54e549ecf036c7c9533938c2" FOREIGN KEY ("parentRegionId") REFERENCES "regions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "locations" ADD CONSTRAINT "FK_19822be95823ff37e1b1c71fbbb" FOREIGN KEY ("regionId") REFERENCES "regions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invites" ADD CONSTRAINT "FK_512a5c477fc936b04516d7a2d57" FOREIGN KEY ("invitedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_86033897c009fcca8b6505d6be2" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_472b25323af01488f1f66a06b67" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sample_audits" ADD CONSTRAINT "FK_f530a2d9afd5f95240b697da0e2" FOREIGN KEY ("sampleId") REFERENCES "samples"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sample_audits" ADD CONSTRAINT "FK_d43e9f71d9e04188d494dc983e3" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_67689993ed1578f83ebf1b90781" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_d1803064187c8f38e57a9c4984c" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sites" ADD CONSTRAINT "FK_23337088b58a461c586df5627ba" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sites" ADD CONSTRAINT "FK_e8907dffbf7fb3bd5708f07adda" FOREIGN KEY ("collector_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sites" ADD CONSTRAINT "FK_867d967cebb831eeca6cebf4b03" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sites" ADD CONSTRAINT "FK_e2a9a2377348da2183f26b38fa1" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sites" ADD CONSTRAINT "FK_924cbb76316cb81be8f40927082" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_tests" ADD CONSTRAINT "FK_a47c90c4656f7839273b7d9043b" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_tests" ADD CONSTRAINT "FK_780f40397ec788f8e1ec2185226" FOREIGN KEY ("sampleId") REFERENCES "samples"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_tests" ADD CONSTRAINT "FK_239856d3ea2bc2d6db53a3f0679" FOREIGN KEY ("visitId") REFERENCES "visits"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_tests" ADD CONSTRAINT "FK_ff8e4ca94bc2064d1210f0063cd" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_tests" ADD CONSTRAINT "FK_ba4cc9e0889b065c6f7a5caec94" FOREIGN KEY ("diseaseId") REFERENCES "diseases"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_tests" ADD CONSTRAINT "FK_7003ad9e3475ffcc9ad84659284" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_tests" ADD CONSTRAINT "FK_5ca984576860eb8eb14c0baa43e" FOREIGN KEY ("testedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sample_types" ADD CONSTRAINT "FK_85b9727aca763b89a91fc573179" FOREIGN KEY ("surveillanceTypeId") REFERENCES "surveillance_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "samples" ADD CONSTRAINT "FK_86e29d8c6c2335708a77da185e1" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "samples" ADD CONSTRAINT "FK_d6423a79a4a83dd958bdf7a8cba" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "samples" ADD CONSTRAINT "FK_8bb6e5ba8fbbcf05fc4b2a0c606" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "samples" ADD CONSTRAINT "FK_8e99d321a2280bdd454a8f1372b" FOREIGN KEY ("visitId") REFERENCES "visits"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "samples" ADD CONSTRAINT "FK_0e87be82034dc8529750850508c" FOREIGN KEY ("sampleTypeId") REFERENCES "sample_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "samples" ADD CONSTRAINT "FK_bf5e51d11f743f3c8f2eb1f8862" FOREIGN KEY ("collectedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "samples" ADD CONSTRAINT "FK_5663374db918282e522c950d931" FOREIGN KEY ("receivedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "samples" ADD CONSTRAINT "FK_fa310f7f7602029caf786357761" FOREIGN KEY ("extractedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "samples" ADD CONSTRAINT "FK_1eea9165b9e643df08b2f189fd2" FOREIGN KEY ("testedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "samples" ADD CONSTRAINT "FK_e47363cc5cd1ccc7a3d439742d5" FOREIGN KEY ("reportGeneratedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "samples" ADD CONSTRAINT "FK_9ae9b7ee4375b5fcd9c3db8d5b6" FOREIGN KEY ("originalSampleId") REFERENCES "samples"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "samples" ADD CONSTRAINT "FK_38b8d4ee2455fd00fa19ecb2096" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" ADD CONSTRAINT "FK_8a7ccdb94bcc8635f933c8f8080" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" ADD CONSTRAINT "FK_458ce18ebdb792c80257bc96678" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" ADD CONSTRAINT "FK_5541a8ac6cb01f90e95aab2d209" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" ADD CONSTRAINT "FK_1ecaa5b0cf9f52cc4aafa5ad549" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" ADD CONSTRAINT "FK_12a5500a611c0e33d212b23d56c" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" ADD CONSTRAINT "FK_f83b2beaa43eba6c1203ea193a7" FOREIGN KEY ("collectorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" ADD CONSTRAINT "FK_cedb5ea8ff342831c53622fef9e" FOREIGN KEY ("visitedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_diseases" ADD CONSTRAINT "FK_fb3e4a9ff4e20b42557cd17b062" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_diseases" ADD CONSTRAINT "FK_1eb63568a19791cb951c078d672" FOREIGN KEY ("disease_id") REFERENCES "diseases"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "samples_diseases_diseases" ADD CONSTRAINT "FK_fcc3ab9149b1e6fc74dea4d9c2b" FOREIGN KEY ("samplesId") REFERENCES "samples"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "samples_diseases_diseases" ADD CONSTRAINT "FK_c98e2b2a2f75cdc9dabcb57066b" FOREIGN KEY ("diseasesId") REFERENCES "diseases"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_admins" ADD CONSTRAINT "FK_7431e8e9db7f6d0a27553ec28d5" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_admins" ADD CONSTRAINT "FK_864befed89c52e53d7d5a1486f1" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_diseases" ADD CONSTRAINT "FK_1fcc99a3974d77c8391d3c5406e" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_diseases" ADD CONSTRAINT "FK_01fb15361ff7ea2e7901f11c362" FOREIGN KEY ("disease_id") REFERENCES "diseases"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_surveillance_types" ADD CONSTRAINT "FK_29186559efe8ea1204182da57f5" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_surveillance_types" ADD CONSTRAINT "FK_c0bf605364e690a7aaad4a1403b" FOREIGN KEY ("surveillance_type_id") REFERENCES "surveillance_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_regions" ADD CONSTRAINT "FK_9a0b69cfe9689475c321d08cde0" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_regions" ADD CONSTRAINT "FK_c496eac577fb08bf147c0a818a0" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_teams" ADD CONSTRAINT "FK_8e02f911192897094a081e6823b" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_teams" ADD CONSTRAINT "FK_c448616f12038bffafbeea68285" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_teams" DROP CONSTRAINT "FK_c448616f12038bffafbeea68285"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_teams" DROP CONSTRAINT "FK_8e02f911192897094a081e6823b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_regions" DROP CONSTRAINT "FK_c496eac577fb08bf147c0a818a0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_regions" DROP CONSTRAINT "FK_9a0b69cfe9689475c321d08cde0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_surveillance_types" DROP CONSTRAINT "FK_c0bf605364e690a7aaad4a1403b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_surveillance_types" DROP CONSTRAINT "FK_29186559efe8ea1204182da57f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_diseases" DROP CONSTRAINT "FK_01fb15361ff7ea2e7901f11c362"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_diseases" DROP CONSTRAINT "FK_1fcc99a3974d77c8391d3c5406e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_admins" DROP CONSTRAINT "FK_864befed89c52e53d7d5a1486f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_admins" DROP CONSTRAINT "FK_7431e8e9db7f6d0a27553ec28d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "samples_diseases_diseases" DROP CONSTRAINT "FK_c98e2b2a2f75cdc9dabcb57066b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "samples_diseases_diseases" DROP CONSTRAINT "FK_fcc3ab9149b1e6fc74dea4d9c2b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_diseases" DROP CONSTRAINT "FK_1eb63568a19791cb951c078d672"`,
    );
    await queryRunner.query(
      `ALTER TABLE "site_diseases" DROP CONSTRAINT "FK_fb3e4a9ff4e20b42557cd17b062"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" DROP CONSTRAINT "FK_cedb5ea8ff342831c53622fef9e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" DROP CONSTRAINT "FK_f83b2beaa43eba6c1203ea193a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" DROP CONSTRAINT "FK_12a5500a611c0e33d212b23d56c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" DROP CONSTRAINT "FK_1ecaa5b0cf9f52cc4aafa5ad549"`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" DROP CONSTRAINT "FK_5541a8ac6cb01f90e95aab2d209"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" DROP CONSTRAINT "FK_458ce18ebdb792c80257bc96678"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" DROP CONSTRAINT "FK_8a7ccdb94bcc8635f933c8f8080"`,
    );
    await queryRunner.query(
      `ALTER TABLE "samples" DROP CONSTRAINT "FK_38b8d4ee2455fd00fa19ecb2096"`,
    );
    await queryRunner.query(
      `ALTER TABLE "samples" DROP CONSTRAINT "FK_9ae9b7ee4375b5fcd9c3db8d5b6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "samples" DROP CONSTRAINT "FK_e47363cc5cd1ccc7a3d439742d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "samples" DROP CONSTRAINT "FK_1eea9165b9e643df08b2f189fd2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "samples" DROP CONSTRAINT "FK_fa310f7f7602029caf786357761"`,
    );
    await queryRunner.query(
      `ALTER TABLE "samples" DROP CONSTRAINT "FK_5663374db918282e522c950d931"`,
    );
    await queryRunner.query(
      `ALTER TABLE "samples" DROP CONSTRAINT "FK_bf5e51d11f743f3c8f2eb1f8862"`,
    );
    await queryRunner.query(
      `ALTER TABLE "samples" DROP CONSTRAINT "FK_0e87be82034dc8529750850508c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "samples" DROP CONSTRAINT "FK_8e99d321a2280bdd454a8f1372b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "samples" DROP CONSTRAINT "FK_8bb6e5ba8fbbcf05fc4b2a0c606"`,
    );
    await queryRunner.query(
      `ALTER TABLE "samples" DROP CONSTRAINT "FK_d6423a79a4a83dd958bdf7a8cba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "samples" DROP CONSTRAINT "FK_86e29d8c6c2335708a77da185e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sample_types" DROP CONSTRAINT "FK_85b9727aca763b89a91fc573179"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_tests" DROP CONSTRAINT "FK_5ca984576860eb8eb14c0baa43e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_tests" DROP CONSTRAINT "FK_7003ad9e3475ffcc9ad84659284"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_tests" DROP CONSTRAINT "FK_ba4cc9e0889b065c6f7a5caec94"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_tests" DROP CONSTRAINT "FK_ff8e4ca94bc2064d1210f0063cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_tests" DROP CONSTRAINT "FK_239856d3ea2bc2d6db53a3f0679"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_tests" DROP CONSTRAINT "FK_780f40397ec788f8e1ec2185226"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lab_tests" DROP CONSTRAINT "FK_a47c90c4656f7839273b7d9043b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sites" DROP CONSTRAINT "FK_924cbb76316cb81be8f40927082"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sites" DROP CONSTRAINT "FK_e2a9a2377348da2183f26b38fa1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sites" DROP CONSTRAINT "FK_867d967cebb831eeca6cebf4b03"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sites" DROP CONSTRAINT "FK_e8907dffbf7fb3bd5708f07adda"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sites" DROP CONSTRAINT "FK_23337088b58a461c586df5627ba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_d1803064187c8f38e57a9c4984c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_67689993ed1578f83ebf1b90781"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sample_audits" DROP CONSTRAINT "FK_d43e9f71d9e04188d494dc983e3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sample_audits" DROP CONSTRAINT "FK_f530a2d9afd5f95240b697da0e2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_472b25323af01488f1f66a06b67"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_86033897c009fcca8b6505d6be2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invites" DROP CONSTRAINT "FK_512a5c477fc936b04516d7a2d57"`,
    );
    await queryRunner.query(
      `ALTER TABLE "locations" DROP CONSTRAINT "FK_19822be95823ff37e1b1c71fbbb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "regions" DROP CONSTRAINT "FK_87b54e549ecf036c7c9533938c2"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c448616f12038bffafbeea6828"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8e02f911192897094a081e6823"`,
    );
    await queryRunner.query(`DROP TABLE "project_teams"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c496eac577fb08bf147c0a818a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9a0b69cfe9689475c321d08cde"`,
    );
    await queryRunner.query(`DROP TABLE "project_regions"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c0bf605364e690a7aaad4a1403"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_29186559efe8ea1204182da57f"`,
    );
    await queryRunner.query(`DROP TABLE "project_surveillance_types"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_01fb15361ff7ea2e7901f11c36"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1fcc99a3974d77c8391d3c5406"`,
    );
    await queryRunner.query(`DROP TABLE "project_diseases"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_864befed89c52e53d7d5a1486f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7431e8e9db7f6d0a27553ec28d"`,
    );
    await queryRunner.query(`DROP TABLE "project_admins"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c98e2b2a2f75cdc9dabcb57066"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fcc3ab9149b1e6fc74dea4d9c2"`,
    );
    await queryRunner.query(`DROP TABLE "samples_diseases_diseases"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1eb63568a19791cb951c078d67"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fb3e4a9ff4e20b42557cd17b06"`,
    );
    await queryRunner.query(`DROP TABLE "site_diseases"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_17022daf3f885f7d35423e9971"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_178199805b901ccd220ab7740e"`,
    );
    await queryRunner.query(`DROP TABLE "role_permissions"`);
    await queryRunner.query(`DROP TABLE "kits"`);
    await queryRunner.query(`DROP TYPE "public"."kits_status_enum"`);
    await queryRunner.query(`DROP TABLE "medias"`);
    await queryRunner.query(`DROP TABLE "otps"`);
    await queryRunner.query(`DROP TABLE "site_types"`);
    await queryRunner.query(`DROP TYPE "public"."site_types_status_enum"`);
    await queryRunner.query(`DROP TABLE "visits"`);
    await queryRunner.query(`DROP TYPE "public"."visits_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."visits_visitstatus_enum"`);
    await queryRunner.query(`DROP TABLE "projects"`);
    await queryRunner.query(`DROP TYPE "public"."projects_status_enum"`);
    await queryRunner.query(`DROP TABLE "diseases"`);
    await queryRunner.query(`DROP TYPE "public"."diseases_status_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_49bfe760640fc5d89721e3c5bc"`,
    );
    await queryRunner.query(`DROP TABLE "samples"`);
    await queryRunner.query(`DROP TYPE "public"."samples_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."samples_samplestatus_enum"`);
    await queryRunner.query(`DROP TYPE "public"."samples_replicates_enum"`);
    await queryRunner.query(`DROP TABLE "sample_types"`);
    await queryRunner.query(`DROP TYPE "public"."sample_types_status_enum"`);
    await queryRunner.query(`DROP TABLE "surveillance_types"`);
    await queryRunner.query(
      `DROP TYPE "public"."surveillance_types_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "lab_tests"`);
    await queryRunner.query(`DROP TYPE "public"."lab_tests_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."lab_tests_testresult_enum"`);
    await queryRunner.query(`DROP TABLE "sites"`);
    await queryRunner.query(`DROP TYPE "public"."sites_testresult_enum"`);
    await queryRunner.query(`DROP TYPE "public"."sites_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."sites_sitetype_enum"`);
    await queryRunner.query(`DROP TYPE "public"."sites_farmtype_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."sites_collectiondayofweek_enum"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
    await queryRunner.query(`DROP TABLE "sample_audits"`);
    await queryRunner.query(`DROP TYPE "public"."sample_audits_status_enum"`);
    await queryRunner.query(`DROP TABLE "user_roles"`);
    await queryRunner.query(`DROP TYPE "public"."user_roles_status_enum"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TYPE "public"."roles_status_enum"`);
    await queryRunner.query(`DROP TABLE "permissions"`);
    await queryRunner.query(`DROP TYPE "public"."permissions_status_enum"`);
    await queryRunner.query(`DROP TABLE "teams"`);
    await queryRunner.query(`DROP TYPE "public"."teams_status_enum"`);
    await queryRunner.query(`DROP TABLE "invites"`);
    await queryRunner.query(`DROP TYPE "public"."invites_inviteetype_enum"`);
    await queryRunner.query(`DROP TABLE "locations"`);
    await queryRunner.query(`DROP TYPE "public"."locations_status_enum"`);
    await queryRunner.query(`DROP TABLE "regions"`);
    await queryRunner.query(`DROP TYPE "public"."regions_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."regions_regiontype_enum"`);
  }
}
