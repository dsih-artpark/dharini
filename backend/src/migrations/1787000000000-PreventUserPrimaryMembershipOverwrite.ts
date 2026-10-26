import { MigrationInterface, QueryRunner } from 'typeorm';

export class PreventUserPrimaryMembershipOverwrite1787000000000 implements MigrationInterface {
  name = 'PreventUserPrimaryMembershipOverwrite1787000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create a trigger function that prevents changing a user's primary
    // project_id or team_id once set. This is a defensive DB-level
    // safeguard: instead of silently overwriting the legacy singular FKs,
    // the DB will raise an error which surfaces to the API and prevents
    // accidental membership moves.
    await queryRunner.query(`
      -- Ensure any previous trigger/function is removed before creating
      DROP TRIGGER IF EXISTS trg_prevent_user_primary_membership_overwrite ON users;
      DROP FUNCTION IF EXISTS prevent_user_primary_membership_overwrite();

      CREATE OR REPLACE FUNCTION prevent_user_primary_membership_overwrite()
      RETURNS trigger AS $$
      BEGIN
        -- If projectId was set previously and is being changed to a
        -- different non-null value, block the update.
        IF TG_OP = 'UPDATE' THEN
          IF OLD."projectId" IS NOT NULL AND NEW."projectId" IS NOT NULL AND OLD."projectId" <> NEW."projectId" THEN
            RAISE EXCEPTION 'Cannot change user.projectId from % to %: primary project is immutable', OLD."projectId", NEW."projectId";
          END IF;
          IF OLD."teamId" IS NOT NULL AND NEW."teamId" IS NOT NULL AND OLD."teamId" <> NEW."teamId" THEN
            RAISE EXCEPTION 'Cannot change user.teamId from % to %: primary team is immutable', OLD."teamId", NEW."teamId";
          END IF;
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER trg_prevent_user_primary_membership_overwrite
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE PROCEDURE prevent_user_primary_membership_overwrite();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS trg_prevent_user_primary_membership_overwrite ON users;
      DROP FUNCTION IF EXISTS prevent_user_primary_membership_overwrite();
    `);
  }
}
