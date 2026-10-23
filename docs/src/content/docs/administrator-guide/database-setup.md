---
title: Database Setup
description: PostgreSQL configuration, migrations and maintenance for Dharini
---

Dharini uses PostgreSQL 16 with the PostGIS extension for geospatial data. You can run it as the bundled `postgres` container (image `postgis/postgis:16-3.4-alpine`) or on a managed service such as AWS RDS.

## Local Development

For local development, PostgreSQL runs in Docker via `docker-compose.yml`.

### Start PostgreSQL

```bash
docker compose --profile development up -d postgres
```

### Connect to Local Database

The commands below use the values from your `.env` file. Load them into your shell first (`set -a; . ./.env; set +a`) or type the values in.

```bash
docker exec -it postgres16-postgis psql -U "$DB_USERNAME" -d "$DB_DATABASE"
```

### Useful Commands

```sql
-- List all tables
\dt

-- Describe table structure
\d table_name

-- List all databases
\l

-- Connect to different database
\c database_name

-- Quit
\q
```

## Production Database

### Bundled container

In the `staging` and `production` profiles the `postgres` service creates the database from `DB_DATABASE`, `DB_USERNAME` and `DB_PASSWORD` and enables PostGIS in it. It does not accept SSL connections, so set `DB_SSL=false` in `.env` (see [SSL](#ssl)). It listens on `127.0.0.1:5432` only, so to connect from another machine use an SSH tunnel (`ssh -L 5432:127.0.0.1:5432 <server>`). Back up the `postgres_data` volume regularly.

### AWS RDS

See [Production Setup](/administrator-guide/production-setup/#step-1-prepare-the-database) for creating the instance. RDS needs SSL connections:

```bash
PGSSLMODE=require psql \
  -h your-database-instance.xxxxxxxxx.region.rds.amazonaws.com \
  -U postgres \
  -d postgres
```

### Required extensions

Three extensions are required:

| Extension | Used for | Created by |
|---|---|---|
| `postgis` | Site and region geometry (`geometry(Point,4326)` columns) | You (the bundled image enables it automatically) |
| `uuid-ossp` | `uuid_generate_v4()` defaults on primary keys | You (the bundled image enables it automatically) |
| `pg_trgm` | Trigram indexes for fast name search | The migration `1781000000000-AddStatisticsAndSearchIndexes` |

On a managed database, create the first two before the first start. The database user running the migrations also needs permission to create `pg_trgm`; on RDS, a user with `rds_superuser` can do this.

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

Verify:

```sql
SELECT extname, extversion FROM pg_extension;
```

### SSL

The backend decides whether to use SSL in this order:

1. `DB_SSL=true` turns SSL on (certificate verification is off, `rejectUnauthorized: false`).
2. `DB_SSL=false` turns SSL off.
3. If `DB_SSL` is not set, SSL is on when `NODE_ENV` is `production` or `staging`, or when `DB_HOST` contains `rds.amazonaws.com`. Otherwise it is off.

With the bundled container and `NODE_ENV=production`, step 3 would try SSL and the connection fails. Always set `DB_SSL=false` for the bundled container. For RDS you can leave it unset or set it to `true`.

### Connection pool

The backend sets up the connection pool from these variables (see [Environment Variables](/administrator-guide/environment-variables/)):

| Variable | Default | Meaning |
|---|---|---|
| `DB_POOL_MAX` | 20 | Maximum connections per backend process |
| `DB_POOL_MIN` | 2 | Minimum idle connections |
| `DB_POOL_IDLE_TIMEOUT_MS` | 30000 | Close a connection idle for this long |
| `DB_POOL_CONN_TIMEOUT_MS` | 5000 | Give up waiting for a free connection after this long |
| `DB_STATEMENT_TIMEOUT_MS` | 15000 | Cancel any query that runs longer than this |

Keep `DB_POOL_MAX` below your server's `max_connections`. If you see connection-timeout errors under load, raise `DB_POOL_MAX` first. A statement timeout of 15 seconds can cancel very large exports or data imports; raise `DB_STATEMENT_TIMEOUT_MS` if that happens.

## Database Migrations

Dharini uses TypeORM 0.3. Migration files are in `backend/src/migrations`.

### Migrations run automatically

When the backend starts with `NODE_ENV` set to anything but `development`, it applies all pending migrations before it does anything else, then runs the seeder. If a migration fails, the backend exits and the container restarts. Check the log with `docker logs backend --tail 100`. To apply new migrations in production, update the code and restart the backend. See [Production Setup](/administrator-guide/production-setup/#updating).

When `NODE_ENV=development`, migrations are skipped. TypeORM `synchronize` creates and updates the tables from the entity files instead. Do not run migrations on a database that was created by `synchronize`.

### Running migrations by hand (source tree only)

The CLI commands need the source tree and a build, because `backend/ormconfig.ts` loads entities and migrations from `dist/`. They do not work inside the production image, which contains only the compiled `dist` folder. Run them from a checkout of the repository, with database settings in `backend/.env` or the shell:

```bash
cd backend
npm install
npm run build

# Apply pending migrations
npm run migration:run

# Revert the last migration
npm run migration:revert

# List applied and pending migrations
npx typeorm-ts-node-commonjs -d ormconfig.ts migration:show
```

### Create a migration (developers)

After changing an entity, build first (the generator compares the compiled entities with the database), then generate. TypeORM 0.3 takes the migration path as an argument:

```bash
cd backend
npm run build
npx typeorm-ts-node-commonjs -d ormconfig.ts migration:generate src/migrations/DescribeChange
```

Review the generated file before committing it. Use a timestamp that is later than every existing migration.

### View migration status

Applied migrations are recorded in the `migrations` table:

```sql
SELECT * FROM migrations ORDER BY id;
```

## Database Schema

The main tables are listed below. The full definitions are in `backend/src/entities`.

**Users, access and tenancy**

- `workspaces` - Tenants. Self-serve signup creates one per new organisation
- `users` - User accounts
- `user_roles` - Which role a user has, and in which scope (system, workspace, project, team)
- `roles` and `permissions` - Pre-defined and custom roles and their permissions
- `teams` - Teams of users
- `invites` - Pending invitations to a project or team
- `otps` - One-time passwords for login and signup

**Surveillance**

- `projects` - Surveillance projects
- `sites` and `site_types` - Surveillance sites and their types
- `locations` - Site coordinates (PostGIS points)
- `regions` - Country, state, district and other administrative regions
- `visits` - Scheduled and completed site visits
- `diseases`, `surveillance_types` - Disease and surveillance definitions
- `species` and `animal_metadata` - Animal species and animal details recorded at a visit

**Samples and lab work**

- `samples` - Sample collection records
- `sample_types` - Sample type definitions
- `sample_audits` - Change history of samples
- `lab_tests` - Laboratory test results
- `kits` - Collection kits
- `medias` - Uploaded files and images

**Sequencing**

- `sequencing_jobs`, `sequencing_submissions` - Genomic sequencing runs and their submissions
- `pipeline_variants` - Variant results returned by the pipeline
- `pipeline_webhook_deliveries` - Log of webhook callbacks from the pipeline

**GeoLens map layers**

- `bio_wetlands`, `bio_poultry_farms`, `bio_water_boundaries`, `bio_cattle_markets` - Reference map data loaded by the startup seeder

## Initial Data Setup

### Seeder

The startup seeder (not the migrations) loads the reference data and creates the first super-admin account. It runs after the migrations every time the backend starts, and only when `NODE_ENV` is not `development`. It creates:

- country, state and district regions, if the `regions` table is empty
- roles and permissions
- diseases
- surveillance types
- sample types
- one super-admin account, if `SUPER_ADMIN_EMAIL` is set

Existing rows are kept, so running it repeatedly is safe. After the server is listening, the backend also loads the GeoLens map layers into the `bio_*` tables: about 525,000 rows of wetlands and water bodies, from about 77 MB of compressed files. It fills only tables that are empty. The poultry farm and livestock market tables stay empty unless you supply your own data. Put them in the `geolens-data` folder of the repository, which holds a README and example files (Docker Compose mounts it and sets `GEOLENS_DATA_DIR`); `DATA_SOURCES.md` in the repository has the file names and steps.

The super admin's details come from `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_FIRST_NAME`, `SUPER_ADMIN_LAST_NAME` and `SUPER_ADMIN_PHONE` (see [Environment Variables](/administrator-guide/environment-variables/#first-super-admin)). Set them before the first start. See [Production Setup](/administrator-guide/production-setup/#step-9-create-the-first-admin).

### Regions and district maps

The seeder fills an empty `regions` table from `regions.sql`. The district boundary files are uploaded separately: see [Production Setup](/administrator-guide/production-setup/#step-7-load-reference-data).

### Wipe and reinitialize a database

**Warning: This deletes all data.**

The script `jobs/db/wipedata.sh` is for local and staging databases running in the bundled Docker container. It is not set up for RDS. It empties the schema and inserts a super-admin user. Run `./jobs/db/wipedata.sh -h` to see its options (container, database, user, and the admin's name, email and phone). An admin email is required: pass it with `-e`, or set `SUPER_ADMIN_EMAIL`. The other admin details default to the other `SUPER_ADMIN_*` variables, or to "Super Admin" with no phone. Override them with `-n`, `-l` and `-p`, and set `-d` to your `DB_DATABASE` value.

## Backup and Restore

### Backup Database

#### Bundled container

```bash
docker exec postgres16-postgis pg_dump -U "$DB_USERNAME" "$DB_DATABASE" > backup.sql
```

#### RDS

```bash
PGSSLMODE=require pg_dump \
  -h your-database-instance.xxxxxxxxx.region.rds.amazonaws.com \
  -U postgres \
  -d postgres \
  > backup.sql
```

### Restore Database

#### Bundled container

```bash
docker exec -i postgres16-postgis psql -U "$DB_USERNAME" "$DB_DATABASE" < backup.sql
```

#### RDS

```bash
PGSSLMODE=require psql \
  -h your-database-instance.xxxxxxxxx.region.rds.amazonaws.com \
  -U postgres \
  -d postgres \
  < backup.sql
```

### Automated Backups (RDS)

RDS provides automated backups:

1. **Configure the backup retention period** (7 days or more is recommended)
2. **Set backup window** (time when backups occur)
3. **Enable point-in-time recovery** for granular restore

Access backups in RDS Console → Your instance → Maintenance & backups

## Performance Optimization

### Indexes

The migrations already create the indexes the application needs, including trigram indexes on project and site names and indexes on sample status and test results. List the indexes on a table with:

```sql
\d samples
```

Before adding your own, check that the column exists (column names are camelCase and must be quoted in SQL) and compare query plans with `EXPLAIN ANALYZE`. Indexes you create by hand are not tracked by migrations; add them as a migration if you want them on every deployment.

### Query Optimization

Monitor slow queries:

```sql
-- Enable slow query logging (RDS)
-- Set parameter group: log_min_duration_statement = 1000 (ms)

-- View slow queries (needs the pg_stat_statements extension)
SELECT query, calls, total_exec_time, mean_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

## Security

### RDS Security

1. **Network Isolation**:
   - Place RDS in private subnet
   - Only allow access from EC2 security group

2. **Encryption**:
   - Enable encryption at rest
   - Force SSL connections

3. **Credentials**:
   - Use strong passwords
   - Rotate credentials regularly
   - Store in AWS Secrets Manager (optional)

### Security Group Rules

RDS security group inbound rules:

| Type       | Port | Source              | Description     |
|------------|------|---------------------|-----------------|
| PostgreSQL | 5432 | EC2 security group  | Application access |

## Monitoring

### RDS CloudWatch Metrics

Monitor key metrics:

- **CPUUtilization** - Should stay below 80%
- **FreeableMemory** - Watch for memory pressure
- **DatabaseConnections** - Monitor connection usage
- **ReadLatency** / **WriteLatency** - Query performance

### Query Performance

Enable Performance Insights in RDS for detailed query analysis.

### Connection Count

Check active connections:

```sql
SELECT count(*) FROM pg_stat_activity;
```

View connection details:

```sql
SELECT
  datname,
  usename,
  application_name,
  client_addr,
  state,
  query
FROM pg_stat_activity
WHERE datname = 'postgres';
```

## Troubleshooting

### Cannot Connect to the Database

1. **Check security group** - Ensure EC2 instance can reach RDS
2. **Verify endpoint** - Confirm RDS endpoint is correct
3. **Test SSL connection**:
   ```bash
   PGSSLMODE=require psql -h your-endpoint -U postgres -d postgres
   ```

### SSL Connection Errors

If you see "no pg_hba.conf entry for host" errors:

```bash
# Always use SSL mode for RDS
PGSSLMODE=require psql -h your-rds-endpoint -U postgres -d postgres
```

The backend enables SSL automatically when `NODE_ENV` is `production` or `staging`, or when `DB_HOST` contains `rds.amazonaws.com`, unless `DB_SSL` overrides it. See [SSL](#ssl). If you use the bundled container, set `DB_SSL=false`.

### Migration Failures

Check backend logs:

```bash
docker logs backend --tail 100
```

Common issues:
- PostGIS or `uuid-ossp` extension not installed
- The database user cannot create the `pg_trgm` extension
- SSL mismatch (see [SSL](#ssl))
- Network connectivity to the database

### Database Performance Issues

1. **Check connection count**
2. **Review slow query log**
3. **Analyze explain plans** for slow queries:
   ```sql
   EXPLAIN ANALYZE SELECT ...;
   ```
4. **Rebuild indexes** if needed
5. **Scale RDS instance** if consistently high CPU/memory

## Next Steps

- [Troubleshooting](/administrator-guide/troubleshooting/) - Common issues and solutions
- [Production Setup](/administrator-guide/production-setup/) - Complete deployment guide
