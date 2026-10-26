---
title: Environment Variables
description: Reference for the environment variables used by the Dharini backend, web app, mobile app and Docker Compose
---

This page lists the environment variables read by each Dharini component. It was checked against the code on the `staging` branch. The repository also ships example files you can copy:

| Component | Example file |
|---|---|
| Backend, web build, Docker Compose | `.env.example` (repository root, copied to `.env`) |
| Web (stand-alone) | `web/.env.example` |
| Mobile app | `mobile/.env.example` |

With Docker Compose, a single `.env` file at the repository root feeds the backend (`env_file`), the web container and pgAdmin.

In the tables below:

- **Required to start** means the backend crashes or refuses to start without the variable.
- **Required** means the feature does not work without it, but the process starts.
- **Optional** means a default is used or the feature is skipped.

## Backend

### Application

| Variable | Required | Default | Description |
|---|---|---|---|
| `NODE_ENV` | Required | none | Environment name. Use `development`, `staging` or `production`. See below. |
| `PORT` | Optional | `4000` | Port the API listens on. The Compose file publishes `4000`, so change both together. |
| `CORS_ORIGINS` | Required to start (any `NODE_ENV` other than `development`) | none | Comma-separated list of browser origins allowed to call the API. See below. |
| `FRONTEND_PLATFORM` | Required | none | Base URL of the web app, used to build invitation links. **Must end with `/`**. See below. |
| `NEXT_PUBLIC_API_URL` | Optional | none | The backend also reads this to set the server URL in the OpenAPI document served at `/docs`. Use the same value as the web app. |
| `ALLOW_FIXED_OTP` | Optional | `false` | When `true`, every login OTP is `123456`. Ignored when `NODE_ENV=production`. Never enable it on a deployment that holds real data. |

#### `NODE_ENV`

Any value other than `development` is treated as a deployed environment. The backend then:

- runs pending database migrations at startup, and exits if a migration fails;
- loads the GeoLens map-layer seed data in the background after it starts listening;
- turns TypeORM `synchronize` off (it is on only in `development`);
- requires `CORS_ORIGINS`;
- enables database SSL by default for `production` and `staging` (see `DB_SSL`).

In every environment, `NODE_ENV` is also part of the S3 key of each uploaded file (`<S3_FOLDER>/<NODE_ENV>/<timestamp>_<filename>`). Changing it later makes existing files unreachable under the new key, so keep it stable for a given bucket.

`production` also disables the fixed test OTP, even when `ALLOW_FIXED_OTP=true`.

#### `CORS_ORIGINS`

Each entry must be a bare origin: `scheme://host[:port]`, with no path and no trailing slash. A value of `*` is rejected, as is any entry that is not a valid `http`/`https` origin; the backend does not start in either case. List every web app that calls the API from a browser, for example the web frontend and the mobile-web build:

```dotenv
CORS_ORIGINS=https://dharini.example.org,https://mobile.dharini.example.org
```

In `development`, any `localhost` or `127.0.0.1` port is allowed automatically and the variable may be empty. The native mobile app, server-side calls and the pipeline webhook send no `Origin` header and are not affected.

#### `FRONTEND_PLATFORM`

The invitation link is built by plain concatenation (`${FRONTEND_PLATFORM}project-invitation/<token>`), so the value must end with a slash:

```dotenv
FRONTEND_PLATFORM=https://dharini.example.org/
```

### Database

| Variable | Required | Default | Description |
|---|---|---|---|
| `DB_HOST` | Required to start | none | PostgreSQL host. `postgres` in Docker Compose, or your managed database endpoint. |
| `DB_PORT` | Optional | `5432` | PostgreSQL port. |
| `DB_USERNAME` | Required to start | none | Database user. Compose also uses it to create the database user. |
| `DB_PASSWORD` | Required to start | none | Database password. |
| `DB_DATABASE` | Required to start | none | Database name. |
| `DB_SSL` | Optional | auto | `true` enables SSL (certificate not verified); `false` disables it. If unset, SSL is on when `NODE_ENV` is `production` or `staging`, or when the host contains `rds.amazonaws.com`, and off otherwise. Set `false` explicitly when the database is the Compose `postgres` container and `NODE_ENV=production`, because that container does not offer SSL. |
| `DB_POOL_MAX` | Optional | `20` | Maximum connections in the pool. Keep it below the server's `max_connections`. |
| `DB_POOL_MIN` | Optional | `2` | Minimum connections kept open. |
| `DB_POOL_IDLE_TIMEOUT_MS` | Optional | `30000` | Idle time before a pooled connection is closed. |
| `DB_POOL_CONN_TIMEOUT_MS` | Optional | `5000` | Time to wait for a free connection before failing. |
| `DB_STATEMENT_TIMEOUT_MS` | Optional | `15000` | Queries running longer than this are cancelled. |

The database needs the PostGIS extension. The Compose file uses `postgis/postgis:16-3.4-alpine`.

### Redis and job queue

| Variable | Required | Default | Description |
|---|---|---|---|
| `REDIS_HOST` | Required to start | none | Redis host, used for caching and BullMQ queues. `redis` in Docker Compose. |
| `REDIS_PORT` | Required | none | Redis port. There is no default; always set it. Usually `6379`. |
| `QUEUE` | Required to start | none | Name of the BullMQ queue. The backend fails with "Queue name must be provided" if it is missing. |
| `JOB_SCHEDULER` | Required to start | none | ID of the BullMQ job scheduler that creates scheduled visits. This is a name, not a switch; any stable string works, for example `visit-scheduler`. |
| `JOB_SCHEDULE_REPEAT_PATTERN` | Required to start | none | Cron expression for the scheduler. `0 0 * * *` runs once a day at midnight. |

### File storage (S3 or S3-compatible)

| Variable | Required | Default | Description |
|---|---|---|---|
| `S3_BUCKET` | Required to start | none | Bucket for uploaded files and sequencing data. |
| `S3_REGION` | Optional | `us-east-1` | AWS region. Use any value (for example `garage`) for S3-compatible storage. |
| `S3_ACCESSKEYID` | Optional | none | Access key. If this or `S3_SECRETACCESSKEY` is empty, the AWS SDK default credential chain is used (for example an instance role). |
| `S3_SECRETACCESSKEY` | Optional | none | Secret key. |
| `S3_ENDPOINT` | Optional | AWS default | Endpoint URL for S3-compatible storage such as Garage (`http://garage:3900`). Leave empty for AWS S3. Path-style addressing is always used. |
| `S3_PUBLIC_URL` | Optional | none | Address a browser can reach, for storage whose `S3_ENDPOINT` is only resolvable inside Docker (the bundled Garage profile). Signed upload URLs that start with `S3_ENDPOINT` are rewritten to start with this value. Not needed on AWS S3. |
| `S3_FOLDER` | Required | none | Key prefix for all uploads. There is no default; an unset value produces keys starting with `undefined/`. |
| `SIGNED_URL_EXPIRY` | Required | none | Lifetime of signed upload and download URLs, in seconds. Set it (for example `3600`); sequencing uploads fall back to their own default when it is unset, other uploads do not. |
| `MAX_FILE_ALLOW_UPLOAD` | Optional | `10` | Maximum number of files accepted in a single image-upload request. It is a count, not a size. The size limit per file is fixed at 25 MB. |
| `DEFAULT_IMAGE_THUMBNAIL` | Required | none | File name of the placeholder thumbnail. Photos whose key contains this name are left out of image lists. Set it to the name of your placeholder, for example `default_thumbnail.png`. |

### Authentication

| Variable | Required | Default | Description |
|---|---|---|---|
| `JWT_SECRET` | Required to start | none | Secret that signs access tokens and invitation tokens. Use a long random value and keep it private. |

Generate a secret with:

```bash
openssl rand -base64 48
```

### First super admin

At startup the seeder creates a super-admin user from these variables, unless a user with that email already exists. `jobs/db/wipedata.sh` reads the same variables.

| Variable | Required | Default | Description |
|---|---|---|---|
| `SUPER_ADMIN_EMAIL` | Optional | none | Email of the first super admin. Leave empty to skip creating one, for example when you use self-serve signup instead. |
| `SUPER_ADMIN_FIRST_NAME` | Optional | `Super` | First name. |
| `SUPER_ADMIN_LAST_NAME` | Optional | `Admin` | Last name. |
| `SUPER_ADMIN_PHONE` | Optional | none | Phone number, needed only to sign in by SMS. Must not belong to another user. |

### Email

Email is sent over SMTP. If `SMTP_HOST` is not set, email is not sent.

| Variable | Required | Default | Description |
|---|---|---|---|
| `EMAIL_FROM` | Required | none | Sender address. With providers such as AWS SES or Resend, the address or its domain must be verified with the provider or sends are rejected. |
| `SMTP_HOST` | Optional | none | SMTP server host. For AWS SES use the endpoint of the region where your sending domain is verified, for example `email-smtp.ap-south-1.amazonaws.com`. |
| `SMTP_PORT` | Optional | `587` | `587` connects with STARTTLS; `465` connects with implicit TLS. |
| `SMTP_USER` | Optional | none | SMTP username. For AWS SES, create SMTP credentials in the SES console (*SMTP settings > Create SMTP credentials*); this is not an AWS console login. |
| `SMTP_PASS` | Optional | none | SMTP password. |

For Gmail, use `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, your Gmail address as `SMTP_USER` and an [app password](https://support.google.com/accounts/answer/185833) as `SMTP_PASS`.

For [Resend](https://resend.com/docs/send-with-smtp), use `SMTP_HOST=smtp.resend.com`, `SMTP_PORT=465` or `587`, `SMTP_USER=resend` and your Resend API key as `SMTP_PASS`.

### SMS

SMS is used to send one-time passwords and invitations.

| Variable | Required | Default | Description |
|---|---|---|---|
| `SMS_PROVIDER` | Optional | `twilio` | `twilio` sends real SMS. `console` sends nothing and writes messages to the backend log; use it for local work only. |
| `TWILIO_ACCOUNT_SID` | Required with `twilio` | none | Twilio account SID. It must start with `AC`. |
| `TWILIO_AUTH_TOKEN` | Required with `twilio` | none | Twilio auth token. |
| `TWILIO_FROM_NUMBER` | Required with `twilio` | none | Sender phone number in E.164 format. |

The backend starts without Twilio values (even with `SMS_PROVIDER=twilio`), but sending an SMS then fails. Leave the three Twilio variables empty if `SMS_PROVIDER=console`.

### Genomic sequencing pipeline

Dharini submits sequencing runs to an external pipeline service. The three variables marked "required to start" are read when the backend boots. They must be defined, but an empty value is accepted, so if you do not use sequencing, set them empty (`PIPELINE_URL=`) and the backend still starts. Sequencing requests will not work until they hold real values.

| Variable | Required | Default | Description |
|---|---|---|---|
| `PIPELINE_URL` | Required to start (may be empty) | none | Base URL of the pipeline service. |
| `PIPELINE_CALLBACK_URL` | Required to start (may be empty) | none | URL the pipeline calls back with run results. It must be reachable from the pipeline service and point at this backend's webhook. Each deployment sets its own, even if several share one pipeline. |
| `WEBHOOK_SECRET` | Required to start (may be empty) | none | Shared secret used to verify callbacks from the pipeline. Set the same value on the pipeline side. |
| `PIPELINE_API_KEY` | Optional | none | Sent as the `X-API-Key` header when not empty. |
| `NCBI_API_KEY` | Optional | none | NCBI API key, used when looking up sequence metadata. Raises the NCBI rate limit. |
| `SEQUENCING_UPLOAD_PREFIX` | Optional | `genomic-sequencing/uploads` | Key prefix for uploaded sequencing files. It must match the pipeline service's own setting exactly. |
| `SEQUENCING_RUNS_PREFIX` | Optional | `genomic-sequencing/runs` | Key prefix for run output. |
| `SEQUENCING_MAX_UPLOAD_BYTES` | Optional | `5368709120` (5 GB) | Largest accepted sequencing upload, in bytes. |
| `SEQUENCING_RECONCILE_AFTER_S` | Optional | `3600` | Age in seconds after which a run that is not finished is checked against the pipeline. Lower it where the webhook cannot reach the backend (for example on a laptop). |

### GeoLens API keys

GeoLens fetches bird sightings and weather from third-party services. Each deployment should supply its own keys and not share them between environments.

| Variable | Required | Default | Description |
|---|---|---|---|
| `EBIRD_API_KEY` | Optional | none | API key for [eBird](https://documenter.getpostman.com/view/664302/S1ENwy59). Bird layers do not load without it. |
| `OWM_API_KEY` | Optional | none | API key for [OpenWeatherMap](https://openweathermap.org/api). Weather layers do not load without it. |

### GeoLens data files

| Variable | Required | Default | Description |
|---|---|---|---|
| `GEOLENS_DATA_DIR` | Optional | none | Folder the seeder reads GeoLens data files from, before its built-in folder. Use it to load the poultry farm and livestock market lists, which Dharini does not ship. `docker-compose.yml` sets it to `/app/geolens-data` and mounts `./geolens-data` there read-only. See `DATA_SOURCES.md` in the repository for the file names and columns. |

## Web app

The web app reads its configuration from `NEXT_PUBLIC_*` variables **when the container starts**, not when the image is built. The browser gets them from `/runtime-config` on the web server, so the published image works for any deployment. After changing one in `.env`, recreate the container; no rebuild is needed:

```bash
docker compose --profile production up -d frontend
```

| Variable | Required | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Required | none | Public URL at which the browser reaches the backend. The backend itself has no `/api` prefix. Example: `http://localhost:4000` in development; `https://dharini.example.org/api` behind Nginx set up as in the [Nginx guide](/administrator-guide/nginx-configuration), which removes the `/api` prefix before passing requests on. |
| `NEXT_PUBLIC_APP_ENV` | Optional | none (`.env.example`: `production`) | Environment label: `local`, `development`, `staging`, `production` or `demo`. `staging` and `demo` show a banner saying the environment holds test data; other values show none. |
| `NEXT_PUBLIC_SUPER_ADMIN_LAB_FLOW` | Optional | `false` | Set to `true` to enable the lab flow for the super admin role. |
| `NEXT_PUBLIC_APK_DOWNLOAD_URL` | Optional | none | Link the login page's Android download button points to, for example the GitHub Release link from [Mobile App](/administrator-guide/mobile-app/). If empty, the button is hidden. |
| `NODE_VERSION` | Optional | `22` | Node.js version when building the web image yourself (`--build`). Not used with the published image. |

The web container itself sets `PORT=3000` and `HOSTNAME=0.0.0.0` (in `docker-compose.yml`).

## Mobile app

The mobile app reads `mobile/.env` and bundles it into the app at build time. Copy `mobile/.env.example` to `mobile/.env` before building. Rebuild the app to change a value.

| Variable | Required | Default | Description |
|---|---|---|---|
| `API_BASE_URL` | Required | empty | URL at which the app reaches the backend, the same as the web app's `NEXT_PUBLIC_API_URL`. Example: `https://dharini.example.org/api`. |
| `MAP_API_KEY` | Optional | none | [Stadia Maps](https://stadiamaps.com/) API key for map tiles. |
| `SENTRY_DSN` | Optional | empty | Sentry DSN for crash reports. If empty, Sentry is not used. See [Error reporting](/administrator-guide/mobile-app/#error-reporting-sentry). |
| `SENTRY_ENV` | Optional | `production` | Environment tag on Sentry events. |

The release build also needs Android signing values. They are used by the build scripts and CI, not by the app at runtime:

| Variable | Description |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | Base64-encoded Android keystore. |
| `ANDROID_STORE_PASSWORD` | Keystore password. |
| `ANDROID_KEY_ALIAS` | Key alias in the keystore. |
| `ANDROID_KEY_PASSWORD` | Key password. |

Keep the keystore and its passwords out of git.

## Docker Compose

| Variable | Required | Default | Description |
|---|---|---|---|
| `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` | Required | none | Also used to create the `postgres` container's database and user (see [Database](#database)). |
| `PGADMIN_DEFAULT_EMAIL` | Required for pgAdmin | none | Login email for the pgAdmin web interface on `127.0.0.1:5050`. pgAdmin runs in the `development` and `staging` profiles only. Must be a valid email address format. |
| `PGADMIN_DEFAULT_PASSWORD` | Required for pgAdmin | none | Login password for pgAdmin. Use a strong password. |
| `NODE_VERSION` | Optional | `22` | Node.js version when building the web image yourself (`--build`). |
| `IMAGE_TAG` | Optional | `production` | Tag of the published images to run: `staging`, `production` or `sha-<short commit>`. `deploy.sh` sets it to the profile name unless you set it, so `IMAGE_TAG=sha-abc1234 ./deploy.sh production` runs one specific build. |
| `IMAGE_REGISTRY` | Optional | `dsihartpark` | Docker Hub namespace (or `registry/namespace`) that `dharini-backend` and `dharini-frontend` are pulled from. Change it if you publish your own images. |

The web `NEXT_PUBLIC_*` values are also read by Compose; see the sections above.

## Example `.env` files

Replace every `change-me` and `<...>` value. Keep real values out of git.

### Development

This is a local setup with the Compose `development` profile. Because `NODE_ENV=development`, the backend creates the schema itself, allows any `localhost` origin, and skips the GeoLens seeding step. The fixed OTP `123456` and the console SMS provider avoid the need for Twilio.

```dotenv
NODE_ENV=development
ALLOW_FIXED_OTP=true

# Database
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=dharini_db
DB_USERNAME=postgres
DB_PASSWORD=change-me
DB_SSL=false

# Redis and job queue
REDIS_HOST=redis
REDIS_PORT=6379
QUEUE=dharini-queue
JOB_SCHEDULER=visit-scheduler
JOB_SCHEDULE_REPEAT_PATTERN=0 0 * * *

# Storage (local Garage; use the "garage" Compose profile)
S3_ENDPOINT=http://garage:3900
S3_PUBLIC_URL=http://localhost:3900
S3_REGION=garage
S3_ACCESSKEYID=change-me
S3_SECRETACCESSKEY=change-me
S3_BUCKET=dharini-bucket
S3_FOLDER=uploads
SIGNED_URL_EXPIRY=3600
MAX_FILE_ALLOW_UPLOAD=10
DEFAULT_IMAGE_THUMBNAIL=default_thumbnail.png

# Authentication, links, CORS
JWT_SECRET=change-me-dev-only
FRONTEND_PLATFORM=http://localhost:3000/
CORS_ORIGINS=http://localhost:3000

# Email (not sent when SMTP_HOST is not set)
EMAIL_FROM=noreply@example.com

# SMS
SMS_PROVIDER=console

# Sequencing pipeline (unused: defined but empty)
PIPELINE_URL=
PIPELINE_CALLBACK_URL=
WEBHOOK_SECRET=

# Web (read when the container starts)
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:4000

# pgAdmin
PGADMIN_DEFAULT_EMAIL=admin@example.com
PGADMIN_DEFAULT_PASSWORD=change-me
```

### Production

```dotenv
NODE_ENV=production
ALLOW_FIXED_OTP=false

# Database (managed PostgreSQL with PostGIS; SSL is on by default in production)
DB_HOST=your-database.example.com
DB_PORT=5432
DB_DATABASE=dharini_db
DB_USERNAME=dharini
DB_PASSWORD=<generate with openssl rand -base64 32>
DB_POOL_MAX=20

# Redis and job queue
REDIS_HOST=redis
REDIS_PORT=6379
QUEUE=dharini-queue
JOB_SCHEDULER=visit-scheduler
JOB_SCHEDULE_REPEAT_PATTERN=0 0 * * *

# Storage (AWS S3; leave S3_ENDPOINT and S3_PUBLIC_URL empty)
S3_REGION=ap-south-1
S3_BUCKET=your-dharini-bucket
S3_ACCESSKEYID=<access key id>
S3_SECRETACCESSKEY=<secret access key>
S3_ENDPOINT=
S3_PUBLIC_URL=
S3_FOLDER=dharini
SIGNED_URL_EXPIRY=3600
MAX_FILE_ALLOW_UPLOAD=10
DEFAULT_IMAGE_THUMBNAIL=default_thumbnail.png

# Authentication, links, CORS
JWT_SECRET=<generate with openssl rand -base64 48>
FRONTEND_PLATFORM=https://dharini.example.org/
CORS_ORIGINS=https://dharini.example.org

# Email (SMTP)
EMAIL_FROM=noreply@dharini.example.org
SMTP_HOST=email-smtp.ap-south-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=<SES SMTP username>
SMTP_PASS=<SES SMTP password>

# SMS
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=<ACxxxxxxxx>
TWILIO_AUTH_TOKEN=<auth token>
TWILIO_FROM_NUMBER=<+E.164 sender number>

# Sequencing pipeline (leave empty if you do not use sequencing)
PIPELINE_URL=https://pipeline.example.com
PIPELINE_CALLBACK_URL=https://dharini.example.org/api/sequencing/pipeline/webhook
WEBHOOK_SECRET=<generate with openssl rand -base64 48>

# First super admin (created at startup if no user has this email)
SUPER_ADMIN_EMAIL=admin@dharini.example.org

# GeoLens (optional)
EBIRD_API_KEY=
OWM_API_KEY=
GEOLENS_DATA_DIR=

# Web (read when the container starts; recreate the container after changes)
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_API_URL=https://dharini.example.org/api
NEXT_PUBLIC_APK_DOWNLOAD_URL=https://github.com/<owner>/<repo>/releases/latest/download/dharini.apk
```

`PIPELINE_CALLBACK_URL` must be the public address of the backend's `POST /sequencing/pipeline/webhook` route, as the pipeline service reaches it (with the `/api` prefix when Nginx is set up as in the Nginx guide).

If the database is the Compose `postgres` container rather than a managed service, add `DB_SSL=false`.

## Security best practices

1. Never commit `.env` files to git.
2. Use strong, unique passwords for all credentials.
3. Rotate secrets regularly (`JWT_SECRET`, `WEBHOOK_SECRET`, API keys). Changing `JWT_SECRET` signs every user out.
4. Use an IAM role instead of access keys where the host allows it (leave `S3_ACCESSKEYID` and `S3_SECRETACCESSKEY` empty).
5. Restrict access to the S3 bucket, the database and pgAdmin.
6. Enable encryption for the database and the bucket.
7. Use separate values for each environment; never reuse production secrets in development.
8. Keep `ALLOW_FIXED_OTP=false` anywhere real users log in.
