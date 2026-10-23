import * as path from 'path';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { DateTime } from 'luxon';
import { calculateAllCollectionDates } from '../src/common/functions/site-collection';

config({ path: path.resolve(__dirname, '../.env') });

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'dharini_db',
  ssl: false,
  logging: false,
});

async function run() {
  console.log('Connecting to database...');
  await AppDataSource.initialize();
  console.log('Connected.');

  const sites = await AppDataSource.query(`
    SELECT 
      s.id,
      s.name,
      s."collectionStartDate",
      s."collectionExpiryDate",
      s."collectionDuration",
      s."collectionFrequencyInterval",
      s."collectionDayOfWeek",
      s."collectionLastScheduleDate",
      s.collector_id,
      s."projectId"
    FROM sites s
    WHERE s.status = 'active'
      AND s.collector_id IS NOT NULL
      AND s."collectionStartDate" IS NOT NULL
      AND s."collectionFrequencyInterval" IS NOT NULL
  `);

  console.log(`Found ${sites.length} active sites with collection plans.`);

  const today = DateTime.utc().startOf('day');

  for (const site of sites) {
    console.log(`\nProcessing site: "${site.name}" (ID: ${site.id})`);

    // Get collector's team
    const users = await AppDataSource.query(
      `SELECT "teamId" FROM users WHERE id = $1`,
      [site.collector_id],
    );
    const teamId = users.length ? users[0].teamId : null;

    if (!teamId) {
      console.warn(`  Skipping: Collector ${site.collector_id} has no team assigned.`);
      continue;
    }

    const scheduledDates = calculateAllCollectionDates(
      {
        collectionStartDate: site.collectionStartDate,
        collectionExpiryDate: site.collectionExpiryDate,
        collectionDuration: site.collectionDuration,
        collectionFrequencyInterval: site.collectionFrequencyInterval,
        collectionDayOfWeek: site.collectionDayOfWeek,
      },
      { fromDate: today },
    );

    console.log(`  Calculated ${scheduledDates.length} total scheduled collection dates.`);

    let createdCount = 0;
    for (const dt of scheduledDates) {
      const visitDateStr = dt.toISODate(); // YYYY-MM-DD
      const startOfDay = dt.startOf('day').toISO();
      const endOfDay = dt.endOf('day').toISO();

      // Check if visit already exists on this day for this site
      const existing = await AppDataSource.query(
        `SELECT id, "visitStatus" FROM visits 
         WHERE "siteId" = $1 
           AND "visitScheduledAt" >= $2 
           AND "visitScheduledAt" <= $3`,
        [site.id, startOfDay, endOfDay],
      );

      if (existing.length === 0) {
        await AppDataSource.query(
          `INSERT INTO visits (
            id,
            "siteId",
            "collectorId",
            "teamId",
            "projectId",
            "questionSetId",
            "visitScheduledAt",
            "visitStatus",
            "isCompleted",
            "createdAt",
            "updatedAt"
          ) VALUES (
            uuid_generate_v4(),
            $1,
            $2,
            $3,
            $4,
            'qs-1',
            $5,
            'upcoming',
            false,
            NOW(),
            NOW()
          )`,
          [site.id, site.collector_id, teamId, site.projectId, dt.toISO()],
        );
        createdCount++;
        console.log(`  + Created visit for: ${visitDateStr}`);
      } else {
        console.log(`  = Visit already exists for: ${visitDateStr} (Status: ${existing[0].visitStatus})`);
      }
    }

    if (scheduledDates.length > 0) {
      const lastDate = scheduledDates[scheduledDates.length - 1];
      await AppDataSource.query(
        `UPDATE sites SET "collectionLastScheduleDate" = $1 WHERE id = $2`,
        [lastDate.toISO(), site.id],
      );
    }

    console.log(`  Done: ${createdCount} new visits created for site "${site.name}".`);
  }

  await AppDataSource.destroy();
  console.log('\nAll done. Database connection closed.');
}

run().catch((err) => {
  console.error('Fatal error during backfill:', err);
  process.exit(1);
});
