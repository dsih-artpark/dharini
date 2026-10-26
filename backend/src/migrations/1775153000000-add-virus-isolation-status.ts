import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVirusIsolationStatus1775153000000 implements MigrationInterface {
  name = 'AddVirusIsolationStatus1775153000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // PostgreSQL requires committing the current transaction before adding enum values
    await queryRunner.query(`
      ALTER TYPE "public"."samples_samplestatus_enum"
      ADD VALUE IF NOT EXISTS 'virus-isolation'
    `);
  }

  public async down(): Promise<void> {
    // Note: PostgreSQL does not support dropping enum values directly.
    // This would require recreating the enum type, which is complex.
    // Left as a no-op for safety.
  }
}
