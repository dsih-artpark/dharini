import { MigrationInterface, QueryRunner } from 'typeorm';

export class BackfillMissingVisits1770876901000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log(
      'Starting migration: Backfill missing visits for sites with collectors',
    );

    // Find sites with collectors but no visits
    // This query is idempotent - it only finds sites that have no visits at all
    const sitesWithoutVisits = await queryRunner.query(`
      SELECT
        s.id,
        s."collectionStartDate",
        s."collectionFrequencyInterval",
        s."collectionLastScheduleDate",
        s.collector_id,
        s."projectId"
      FROM sites s
      LEFT JOIN visits v ON v."siteId" = s.id
      WHERE s.collector_id IS NOT NULL
        AND s."collectionStartDate" IS NOT NULL
        AND s."collectionFrequencyInterval" IS NOT NULL
        AND s."collectionDuration" IS NOT NULL
        AND s."collectionExpiryDate" IS NOT NULL
        AND s.status = 'active'
        AND v.id IS NULL
    `);

    console.log(
      `Found ${sitesWithoutVisits.length} sites with collectors but no visits`,
    );

    for (const site of sitesWithoutVisits) {
      console.log(`Processing site ${site.id}`);

      // Get collector's team
      const userTeam = await queryRunner.query(
        `SELECT "teamId" FROM users WHERE id = $1`,
        [site.collector_id],
      );

      if (!userTeam.length || !userTeam[0].teamId) {
        console.log(`  Skipping - collector has no team assigned`);
        continue;
      }

      // Calculate next visit date - must be in the future
      const now = new Date();
      const startDate = new Date(site.collectionStartDate);
      const intervalDays = site.collectionFrequencyInterval;

      // Find the next visit date that's in the future
      const nextVisitDate = new Date(startDate);
      while (nextVisitDate <= now) {
        nextVisitDate.setDate(nextVisitDate.getDate() + intervalDays);
      }

      // Create the visit
      await queryRunner.query(
        `
        INSERT INTO visits (
          "siteId",
          "collectorId",
          "teamId",
          "projectId",
          "visitScheduledAt",
          "visitStatus",
          "isCompleted",
          status
        )
        VALUES ($1, $2, $3, $4, $5, 'upcoming', false, 'active')
      `,
        [
          site.id,
          site.collector_id,
          userTeam[0].teamId,
          site.projectId,
          nextVisitDate,
        ],
      );

      // Update collectionLastScheduleDate on the site
      await queryRunner.query(
        `UPDATE sites SET "collectionLastScheduleDate" = $1 WHERE id = $2`,
        [nextVisitDate, site.id],
      );

      console.log(
        `  Created visit scheduled for ${nextVisitDate.toISOString()}`,
      );
    }

    console.log('Migration completed successfully');
  }

  public async down(): Promise<void> {
    console.log('Rolling back migration: Backfill missing visits');
    console.log(
      'WARNING: Cannot automatically identify and remove visits created by this migration.',
    );
    console.log(
      'Manual intervention may be required if rollback is necessary.',
    );
  }
}
