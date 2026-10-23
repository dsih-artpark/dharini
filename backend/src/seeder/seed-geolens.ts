/**
 * GeoLens Data Seeder
 *
 * Seeds the bio_wetlands, bio_poultry_farms, bio_cattle_markets, and
 * bio_water_boundaries tables from the CSV/GeoJSON files in src/seeder/data/,
 * plus the folder named by GEOLENS_DATA_DIR when that is set.
 *
 * Runs automatically in the background after the API starts listening (see
 * main.ts). To run it by hand:
 *   npx ts-node src/seeder/seed-geolens.ts          (from backend/)
 *   node dist/src/seeder/seed-geolens.js            (inside the container)
 */

import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import * as zlib from 'zlib';

config();

const DATA_DIR = path.resolve(process.cwd(), 'src/seeder/data');

/**
 * Optional second source folder, set with GEOLENS_DATA_DIR. It is searched
 * before DATA_DIR, so a deployment can supply files that are not in the image
 * (the poultry-farm and cattle-market lists) by mounting a folder, and can
 * also replace a bundled file. Unset by default.
 */
const EXTRA_DATA_DIR = process.env.GEOLENS_DATA_DIR?.trim()
  ? path.resolve(process.env.GEOLENS_DATA_DIR.trim())
  : null;

// ─── Source file resolution ─────────────────────────────────────────────────
/**
 * The data directory ships gzipped in git - the uncompressed sources total
 * ~335 MB, and india_natural_water_only.geojson alone is over GitHub's 100 MB
 * per-file limit. Compression is applied at the file's original precision, so
 * `gunzip -c x.gz | diff - x` is empty: nothing is lost relative to the source.
 *
 * A plain file wins over its .gz when both exist, so a developer can drop an
 * updated export in place without re-compressing first. Deployments only ever
 * have the .gz, which makes the choice unambiguous there. GEOLENS_DATA_DIR, when
 * set, is searched before the built-in folder.
 */
function resolveSource(
  fileName: string,
): { path: string; gzipped: boolean } | null {
  for (const dir of [EXTRA_DATA_DIR, DATA_DIR]) {
    if (!dir) continue;

    const plain = path.join(dir, fileName);
    if (fs.existsSync(plain)) return { path: plain, gzipped: false };

    const gz = `${plain}.gz`;
    if (fs.existsSync(gz)) return { path: gz, gzipped: true };
  }

  return null;
}

/** Where resolveSource looked, for the "not found" log lines. */
function searchedDirs(): string {
  return [EXTRA_DATA_DIR, DATA_DIR].filter(Boolean).join(', ');
}

/** Read a (possibly gzipped) UTF-8 text file fully into memory. */
function readSourceText(source: { path: string; gzipped: boolean }): string {
  const buf = fs.readFileSync(source.path);
  const text = source.gzipped
    ? zlib
        .gunzipSync(buf, { maxOutputLength: 512 * 1024 * 1024 })
        .toString('utf-8')
    : buf.toString('utf-8');
  // Strip BOM if present
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

/**
 * Iterate a (possibly gzipped) text file one line at a time.
 *
 * The GeoJSON source is ~309 MB uncompressed, which readFileSync + JSON.parse
 * would hold in memory twice over. It is written one feature per line, so
 * streaming keeps the seeder's footprint flat regardless of file size.
 */
function streamSourceLines(source: {
  path: string;
  gzipped: boolean;
}): readline.Interface {
  const fileStream = fs.createReadStream(source.path);
  const input = source.gzipped
    ? fileStream.pipe(zlib.createGunzip())
    : fileStream;
  return readline.createInterface({ input, crlfDelay: Infinity });
}

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

// ─── CSV Parser (no external dependency) ────────────────────────────────────
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
  }
  result.push(current.trim());
  return result;
}

// ─── Seed-once guard ────────────────────────────────────────────────────────
type Query = (sql: string, params?: unknown[]) => Promise<any>;

/**
 * Fills `table` from scratch exactly once, or leaves it alone.
 *
 * Everything runs in one transaction: a transaction-scoped advisory lock so
 * two instances starting against the same database can't both seed it, an
 * emptiness check, then `fill` doing every insert through `query`. A table
 * that already has rows is never touched, so nothing is ever duplicated, and a
 * failure part-way through rolls back to an empty table rather than leaving a
 * half-seeded one that every later run would skip. The next run just retries.
 *
 * The trade-off: an updated source file is not re-applied to a table that
 * already has data.
 */
async function seedTableOnce(
  ds: DataSource,
  table: string,
  fill: (query: Query) => Promise<void>,
): Promise<void> {
  await ds.transaction(async (manager) => {
    const query: Query = (sql, params) => manager.query(sql, params);

    const [{ locked }] = await query(
      `SELECT pg_try_advisory_xact_lock(hashtext($1)) AS locked`,
      [`geolens-seed:${table}`],
    );
    if (!locked) {
      console.log(
        `  ⏭ ${table} is being seeded by another instance, skipping.`,
      );
      return;
    }

    const [{ populated }] = await query(
      `SELECT EXISTS (SELECT 1 FROM ${table}) AS populated`,
    );
    if (populated) {
      console.log(`  ✓ ${table} already has data, skipping.`);
      return;
    }

    await fill(query);
  });
}

// ─── 1. Seed Wetlands ───────────────────────────────────────────────────────
async function seedWetlands(ds: DataSource): Promise<void> {
  const source = resolveSource('wetlands_merged.csv');
  if (!source) {
    console.log(
      `  ⚠ wetlands_merged.csv(.gz) not found in ${searchedDirs()}, skipping.`,
    );
    return;
  }

  await seedTableOnce(ds, 'bio_wetlands', async (query) => {
    console.log(`  📄 Reading ${path.basename(source.path)}...`);
    const content = readSourceText(source);
    const lines = content.split(/\r?\n/).filter((l) => l.trim());
    // const headers = parseCsvLine(lines[0]);
    console.log(`  📊 ${lines.length - 1} rows to insert...`);

    const BATCH = 1000;
    let inserted = 0;

    for (let i = 1; i < lines.length; i += BATCH) {
      const batch = lines.slice(i, i + BATCH);
      const values: string[] = [];
      const params: any[] = [];
      let paramIdx = 1;

      for (const line of batch) {
        const cols = parseCsvLine(line);
        if (cols.length < 9) continue;

        const srNo = parseInt(cols[0]) || null;
        const state = cols[1] || '';
        const district = cols[2] || '';
        const longitude = parseFloat(cols[3]) || 0;
        const latitude = parseFloat(cols[4]) || 0;
        const wetlandTypeCode = parseInt(cols[5]) || null;
        const wetlandTypeDesc = cols[6] || null;
        const areaHa = parseFloat(cols[7]) || null;
        const name = cols[8] || null;
        const status = cols[9] || null;

        values.push(
          `($${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++})`,
        );
        params.push(
          srNo,
          state,
          district,
          longitude,
          latitude,
          wetlandTypeCode,
          wetlandTypeDesc,
          areaHa,
          name,
          status,
        );
      }

      if (values.length > 0) {
        await query(
          `INSERT INTO bio_wetlands ("srNo", state, district, longitude, latitude, "wetlandTypeCode", "wetlandTypeDescription", "areaHa", name, status)
         VALUES ${values.join(', ')}`,
          params,
        );
        inserted += values.length;
        if (inserted % 10000 === 0 || i + BATCH >= lines.length) {
          console.log(`    → ${inserted} / ${lines.length - 1} rows`);
        }
      }
    }
    console.log(`  ✅ Seeded ${inserted} wetlands.`);
  });
}

// ─── 2. Seed Poultry Farms ──────────────────────────────────────────────────
async function seedPoultryFarms(ds: DataSource): Promise<void> {
  const source = resolveSource('list-of-poultry-farms-in-india.csv');
  if (!source) {
    console.log(
      `  ⚠ list-of-poultry-farms-in-india.csv(.gz) not found in ${searchedDirs()}, skipping.`,
    );
    return;
  }

  await seedTableOnce(ds, 'bio_poultry_farms', async (query) => {
    console.log(`  📄 Reading ${path.basename(source.path)}...`);
    const content = readSourceText(source);
    const lines = content.split(/\r?\n/).filter((l) => l.trim());
    console.log(`  📊 ${lines.length - 1} rows to insert...`);

    const BATCH = 500;
    let inserted = 0;

    for (let i = 1; i < lines.length; i += BATCH) {
      const batch = lines.slice(i, i + BATCH);
      const values: string[] = [];
      const params: any[] = [];
      let paramIdx = 1;

      for (const line of batch) {
        const cols = parseCsvLine(line);
        if (cols.length < 5) continue;

        const lat = parseFloat(cols[4]);
        const lng = parseFloat(cols[5]);
        if (isNaN(lat) || isNaN(lng)) continue;

        const name = (cols[0] || '').substring(0, 255) || 'Unknown';
        const address = cols[1] || null;
        const phone = (cols[2] || '').substring(0, 50) || null;
        const email = (cols[3] || '').substring(0, 255) || null;
        const url = (cols[6] || '').substring(0, 500) || null;
        const ratingCount = parseInt(cols[7]) || 0;
        const starCount = parseFloat(cols[8]) || 0;
        const country = (cols[9] || '').substring(0, 100) || null;
        const state = (cols[10] || '').substring(0, 100) || null;
        const city = (cols[11] || '').substring(0, 100) || null;
        const zip = (cols[12] || '').substring(0, 20) || null;

        values.push(
          `($${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++})`,
        );
        params.push(
          name,
          address,
          phone,
          email,
          lat,
          lng,
          url,
          ratingCount,
          starCount,
          country,
          state,
          city,
          zip,
        );
      }

      if (values.length > 0) {
        await query(
          `INSERT INTO bio_poultry_farms (name, address, phone, email, latitude, longitude, url, "ratingCount", "starCount", country, state, city, zip)
         VALUES ${values.join(', ')}`,
          params,
        );
        inserted += values.length;
        if (inserted % 5000 === 0 || i + BATCH >= lines.length) {
          console.log(`    → ${inserted} / ${lines.length - 1} rows`);
        }
      }
    }
    console.log(`  ✅ Seeded ${inserted} poultry farms.`);
  });
}

// ─── 3. Seed Cattle Markets ─────────────────────────────────────────────────
/**
 * The source file records an unknown trading day as the literal string "NA" or
 * "ambiguous" (551 of 822 rows). Store those as NULL so consumers can tell an
 * unknown day from a real one without knowing the sentinel values.
 */
function normalizeOperatingDay(raw: string): string | null {
  const value = (raw || '').trim();
  if (!value) return null;
  const lowered = value.toLowerCase();
  if (lowered === 'na' || lowered === 'n/a' || lowered === 'ambiguous') {
    return null;
  }
  return value.substring(0, 50);
}

async function seedCattleMarkets(ds: DataSource): Promise<void> {
  const source = resolveSource('cattle-market.csv');
  if (!source) {
    console.log(
      `  ⚠ cattle-market.csv(.gz) not found in ${searchedDirs()}, skipping.`,
    );
    return;
  }

  await seedTableOnce(ds, 'bio_cattle_markets', async (query) => {
    console.log(`  📄 Reading ${path.basename(source.path)}...`);
    const content = readSourceText(source);
    const lines = content.split(/\r?\n/).filter((l) => l.trim());
    console.log(`  📊 ${lines.length - 1} rows to insert...`);

    const BATCH = 500;
    let inserted = 0;
    let skipped = 0;

    for (let i = 1; i < lines.length; i += BATCH) {
      const batch = lines.slice(i, i + BATCH);
      const values: string[] = [];
      const params: any[] = [];
      let paramIdx = 1;

      for (const line of batch) {
        // market_name, operating_day, latitude, longitude,
        // lgd_district, district, lgd_state, state, remark
        const cols = parseCsvLine(line);
        if (cols.length < 8) {
          skipped++;
          continue;
        }

        const lat = parseFloat(cols[2]);
        const lng = parseFloat(cols[3]);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
          skipped++;
          continue;
        }

        const name = (cols[0] || '').substring(0, 255) || 'Unknown';
        const operatingDay = normalizeOperatingDay(cols[1]);
        const lgdDistrictCode = (cols[4] || '').substring(0, 10) || null;
        const district = (cols[5] || '').substring(0, 100);
        const lgdStateCode = (cols[6] || '').substring(0, 10) || null;
        const state = (cols[7] || '').substring(0, 100);
        // `remark` (cols[8]) is intentionally dropped - free-text sourcing notes.

        values.push(
          `($${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++})`,
        );
        params.push(
          name,
          operatingDay,
          lat,
          lng,
          state,
          district,
          lgdStateCode,
          lgdDistrictCode,
        );
      }

      if (values.length > 0) {
        await query(
          `INSERT INTO bio_cattle_markets (name, "operatingDay", latitude, longitude, state, district, "lgdStateCode", "lgdDistrictCode")
         VALUES ${values.join(', ')}`,
          params,
        );
        inserted += values.length;
      }
    }
    console.log(
      `  ✅ Seeded ${inserted} cattle markets${skipped ? ` (${skipped} rows skipped).` : '.'}`,
    );
  });
}

// ─── 4. Seed Water Boundaries (GeoJSON) ─────────────────────────────────────
async function seedWaterBoundaries(ds: DataSource): Promise<void> {
  const source = resolveSource('india_natural_water_only.geojson');
  if (!source) {
    console.log(
      `  ⚠ india_natural_water_only.geojson(.gz) not found in ${searchedDirs()}, skipping.`,
    );
    return;
  }

  await seedTableOnce(ds, 'bio_water_boundaries', async (query) => {
    console.log(
      `  📄 Streaming ${path.basename(source.path)} (this may take a moment)...`,
    );

    const BATCH = 200;
    let inserted = 0;
    let malformed = 0;
    let batch: {
      osmId: string | null;
      code: number | null;
      fclass: string | null;
      name: string | null;
      geomJson: string;
    }[] = [];

    const flush = async () => {
      if (!batch.length) return;
      const values: string[] = [];
      const params: any[] = [];
      let paramIdx = 1;
      for (const f of batch) {
        values.push(
          `($${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, ST_SetSRID(ST_GeomFromGeoJSON($${paramIdx++}), 4326))`,
        );
        params.push(f.osmId, f.code, f.fclass, f.name, f.geomJson);
      }
      await query(
        `INSERT INTO bio_water_boundaries ("osmId", code, fclass, name, geometry)
       VALUES ${values.join(', ')}`,
        params,
      );
      inserted += batch.length;
      if (inserted % 50000 < BATCH) {
        console.log(`    → ${inserted} features`);
      }
      batch = [];
    };

    // The file is a FeatureCollection written one feature per line, so it can be
    // consumed a line at a time instead of holding all ~309 MB (and its parsed
    // object graph) in memory. Structural lines - the opening braces, the
    // "features": [ header, the closing ] } - simply don't parse as a Feature and
    // are skipped.
    for await (const rawLine of streamSourceLines(source)) {
      const line = rawLine.trim().replace(/,$/, '');
      if (!line.startsWith('{') || !line.includes('"Feature"')) continue;

      let feat: any;
      try {
        feat = JSON.parse(line);
      } catch {
        malformed++;
        continue;
      }
      if (!feat || feat.type !== 'Feature' || !feat.geometry) {
        malformed++;
        continue;
      }

      const props = feat.properties || {};
      batch.push({
        osmId: props.osm_id ? String(props.osm_id).substring(0, 50) : null,
        code: props.code ? parseInt(props.code) : null,
        fclass: props.fclass ? String(props.fclass).substring(0, 50) : null,
        name: props.name ? String(props.name).substring(0, 255) : null,
        geomJson: JSON.stringify(feat.geometry),
      });

      if (batch.length >= BATCH) await flush();
    }
    await flush();

    if (inserted === 0) {
      // Not one-feature-per-line (e.g. a re-exported, fully minified file).
      // Fall back to parsing the whole document rather than seeding nothing.
      console.log(
        '  ⚠ No features found line-by-line; falling back to a full parse.',
      );
      const geojson = JSON.parse(readSourceText(source));
      for (const feat of geojson.features || []) {
        const props = feat.properties || {};
        batch.push({
          osmId: props.osm_id ? String(props.osm_id).substring(0, 50) : null,
          code: props.code ? parseInt(props.code) : null,
          fclass: props.fclass ? String(props.fclass).substring(0, 50) : null,
          name: props.name ? String(props.name).substring(0, 255) : null,
          geomJson: JSON.stringify(feat.geometry),
        });
        if (batch.length >= BATCH) await flush();
      }
      await flush();
    }

    console.log(
      `  ✅ Seeded ${inserted} water boundaries${malformed ? ` (${malformed} lines skipped).` : '.'}`,
    );
  });
}

// ─── Main ───────────────────────────────────────────────────────────────────
const LAYERS: [label: string, seed: (ds: DataSource) => Promise<void>][] = [
  ['Wetlands', seedWetlands],
  ['Poultry Farms', seedPoultryFarms],
  ['Cattle Markets', seedCattleMarkets],
  ['Water Boundaries', seedWaterBoundaries],
];

/**
 * Seeds every GeoLens map layer that is still empty.
 *
 * Each layer is independent: one failing is logged and the rest still run. A
 * failed layer's transaction has already rolled back (see seedTableOnce), so
 * its table is left empty for the next run to retry. This never throws, so a
 * bad layer can't take the API down with it.
 *
 * @param externalDs - An already-initialized DataSource to reuse (e.g. from NestJS).
 *                     If omitted, the function creates and manages its own connection.
 * @returns the labels of the layers that failed (empty when all succeeded).
 */
export async function seedGeoLensData(
  externalDs?: DataSource,
): Promise<string[]> {
  const isExternal = !!externalDs;
  const ds = externalDs ?? AppDataSource;

  console.log('🌱 GeoLens Data Seeder');
  console.log('─'.repeat(50));
  console.log(
    `  DB: ${ds.options.database}@${(ds.options as any).host}:${(ds.options as any).port}`,
  );

  const failed: string[] = [];
  try {
    if (!isExternal) {
      await ds.initialize();
      console.log('  ✓ Connected to database\n');
    }

    for (const [label, seed] of LAYERS) {
      console.log(`▶ Seeding ${label}...`);
      try {
        await seed(ds);
      } catch (err) {
        console.error(
          `  ❌ ${label} failed; its table was left unchanged:`,
          err,
        );
        failed.push(label);
      }
      console.log('');
    }
  } catch (err) {
    console.error('❌ GeoLens seeding could not start:', err);
    failed.push(...LAYERS.map(([label]) => label));
  } finally {
    if (!isExternal && ds.isInitialized) {
      await ds.destroy();
    }
  }

  if (failed.length) {
    console.error(
      `⚠ GeoLens seeding finished with failures: ${failed.join(', ')}`,
    );
  } else {
    console.log('🎉 GeoLens seeding complete.');
  }
  return failed;
}

// Run directly (see the usage note at the top of this file).
if (require.main === module) {
  void seedGeoLensData().then((failed) => {
    process.exitCode = failed.length ? 1 : 0;
  });
}
