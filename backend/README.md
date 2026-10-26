# Dharini Backend

The REST API for Dharini, a One Health disease surveillance and sample collection platform. It serves the web dashboard (`web/`) and the mobile app (`mobile/`).

## Tech Stack

- **NestJS 11** (TypeScript) on Node.js 22
- **PostgreSQL 16 + PostGIS 3.4** via **TypeORM**
- **Redis** for caching and **BullMQ** job queues
- **JWT + Passport** authentication, **CASL** authorization
- **S3-compatible storage** for media uploads (AWS S3 or local Garage)
- **Swagger / OpenAPI** documentation generated at startup

## Repository Structure

```
backend/
├── src/
│   ├── main.ts             # Bootstrap: security middleware, CORS, Swagger, migrations, seeding
│   ├── app.module.ts       # Root module and TypeORM configuration
│   ├── modules/            # Feature modules (auth, projects, sites, visits, samples, lab-tests, ...)
│   ├── entities/           # TypeORM entities
│   ├── migrations/         # TypeORM migrations
│   ├── common/             # Guards, decorators, authorization, cache, SMS, OTP, utilities
│   ├── shared/             # Global validation pipe and exception filters
│   └── seeder/             # Reference data seeding (including GeoLens datasets)
├── script/                 # One-off maintenance scripts and SQL
├── test/                   # End-to-end test configuration
├── ormconfig.ts            # TypeORM DataSource used by the migration CLI
└── Dockerfile
```

## Prerequisites

- Node.js 22 (see the root `.nvmrc`)
- Docker with Docker Compose V2

All commands below assume you start from the root of the `dharini` monorepo.

## Environment Configuration

Configuration is read from environment variables. The root `.env.example` documents every variable (database, Redis, S3, JWT, CORS, SMS, mail, and more).

```bash
cp .env.example .env            # Used by Docker Compose
cp .env.example backend/.env    # Used when running the backend directly with npm
```

For local development, edit `backend/.env`:

```bash
NODE_ENV=development
DB_HOST=localhost
REDIS_HOST=localhost
DB_PASSWORD=<choose a password>   # must match the value in the root .env used by the postgres container
JWT_SECRET=<any long random string>
```

Never commit `.env` files. They are git-ignored.

## Running Locally

### Option A: backend on your machine, databases in Docker (recommended for development)

```bash
docker compose --profile development up -d postgres redis

cd backend
npm install
npm run start:dev
```

### Option B: everything in Docker

```bash
docker compose --profile development up --build backend
```

This builds the image from your checkout. Without `--build`, Compose pulls the published `dharini-backend` image.

The API is available at **http://localhost:4000**.

## API Documentation

Swagger UI is served at **http://localhost:4000/docs** on any running instance. The raw OpenAPI JSON is available at `/docs-json`.

Behind the production nginx configuration, these are exposed at `/api/docs`.

## Database and Migrations

How the schema is managed depends on `NODE_ENV`:

| `NODE_ENV`      | Schema                                                   | Seeding                    |
| --------------- | -------------------------------------------------------- | -------------------------- |
| `development`   | TypeORM `synchronize` updates the schema from entities   | Skipped                    |
| any other value | Pending migrations run automatically on startup          | Reference data is seeded   |

Migrations live in `src/migrations/`. The migration CLI reads compiled files from `dist/`, so **build before running migration commands**:

```bash
cd backend
npm run build

npm run migration:run       # Apply pending migrations
npm run migration:revert    # Revert the most recent migration
```

To generate a migration after changing an entity, run it against a database that has been migrated (not synchronized), so the diff is accurate:

```bash
npm run build
npm run typeorm -- migration:generate src/migrations/<MigrationName>
```

Review the generated SQL before committing. Every schema change must include a migration.

## Development Commands

Run from `backend/`:

| Command               | Description                          |
| --------------------- | ------------------------------------ |
| `npm run start:dev`   | Start in watch mode                  |
| `npm run start:debug` | Start in watch mode with debugger    |
| `npm run build`       | Compile to `dist/`                   |
| `npm run start:prod`  | Run the compiled build               |

## Testing

| Command            | Description                       |
| ------------------ | --------------------------------- |
| `npm test`         | Run unit tests (Jest, `*.spec.ts`) |
| `npm run test:watch` | Run tests in watch mode         |
| `npm run test:cov` | Run tests with a coverage report  |

Unit tests live next to the code they test under `src/`.

## Linting and Formatting

| Command          | Description                                   |
| ---------------- | --------------------------------------------- |
| `npm run lint`   | Run ESLint and auto-fix issues                |
| `npm run format` | Format code with Prettier                     |

Run both before opening a pull request.

## Contributing

See the root [CONTRIBUTING.md](../CONTRIBUTING.md) for branch naming, commit conventions, and the pull request process, and [SECURITY.md](../SECURITY.md) for reporting vulnerabilities.
