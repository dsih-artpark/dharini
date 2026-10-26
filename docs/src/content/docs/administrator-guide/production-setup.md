---
title: Production Setup
description: Complete guide for deploying Dharini in production
---

This guide walks through deploying Dharini on a single Linux server with Docker Compose. You can host the supporting services in two ways:

| | Managed cloud services | Self-hosted |
|---|---|---|
| Database | AWS RDS PostgreSQL (or another managed PostgreSQL 16 with PostGIS) | Bundled `postgres` container (PostgreSQL 16 + PostGIS 3.4) |
| File storage | AWS S3 | Bundled [Garage](https://garagehq.deuxfleurs.fr/) container (S3-compatible) |
| Redis | Bundled `redis` container | Bundled `redis` container |

Both options use the same application containers. Choose per component; for example, you can use RDS with Garage. Steps that differ are marked **Managed** or **Self-hosted**.

For a step-by-step Windows 11 (WSL 2) walkthrough of the fully self-hosted option, see `deploy-readme.md` in the repository root.

## Prerequisites

- A Linux server (Ubuntu 24.04 LTS recommended) with at least 2 vCPUs and 4 GB of RAM (for example, a t3.medium).
- A domain name pointing at the server
- Ports 80 and 443 open to the internet, and SSH restricted to your own IP
- Docker Engine with the Compose plugin
- A working SMTP email server or SMS provider (Twilio). Users sign in with a one-time password (OTP) sent by email or SMS, so nobody can log in without one of these.
- Managed option only: an AWS account with permission to create RDS instances, S3 buckets and IAM users

## Step 1: Prepare the database

### Managed: AWS RDS

1. In the RDS console, choose **Create database** and select **PostgreSQL 16.x**.
2. Pick the **Production** template, a strong master password, and an instance class suited to your load (db.t3.micro is enough to try it out).
3. Place the instance in the same VPC as your server. Set **Public access** to **No**.
4. Enable storage encryption and automated backups (7 days or more).
5. In the RDS security group, allow inbound TCP 5432 from the server's security group.
6. Connect once and create the extensions the application needs:

```bash
PGSSLMODE=require psql -h <rds-endpoint> -U postgres -d postgres
```

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

The migrations create `pg_trgm` themselves, but not PostGIS or `uuid-ossp`, so those two must exist before the first start. See [Database Setup](/administrator-guide/database-setup/) for details.

In `.env`, set `DB_HOST` to the RDS endpoint (not `postgres`), `DB_SSL=true`, and the matching `DB_USERNAME`, `DB_PASSWORD` and `DB_DATABASE`. `deploy.sh` then does not start the bundled PostgreSQL container.

### Self-hosted: bundled PostgreSQL

Nothing to create. The `postgres` service uses the `postgis/postgis:16-3.4-alpine` image. It creates the database named in `DB_DATABASE` with the user and password from `DB_USERNAME` and `DB_PASSWORD`, and enables PostGIS in it. Data is kept in the `postgres_data` Docker volume.

Keep `DB_HOST=postgres` in `.env`: `deploy.sh` starts the bundled container only for that value (or `postgres16-postgis`). Any other `DB_HOST` is treated as an external database.

The bundled container does not accept SSL connections, so you must set `DB_SSL=false` in `.env` (see Step 5).

Port 5432 is published on `127.0.0.1` only, so it is not reachable from other machines. Use an SSH tunnel for remote access.

## Step 2: Prepare file storage

The backend stores photos and sequencing files in one S3 bucket and reads the district map files from it. All files sit under the `S3_FOLDER` prefix.

### Managed: AWS S3

1. Create a bucket (for example `dharini-prod-storage`) in the same region as your server. Keep **Block Public Access** on and enable encryption.
2. Create an IAM user with read, write and list access to that bucket only, and generate an access key.
3. Add the CORS rule described below.

### Self-hosted: Garage

Garage runs from the separate `garage` compose profile, using `garage.toml` in the repository root.

1. **Set the two secrets in `garage.toml` before first use.** Replace the `REPLACE_WITH_RPC_SECRET` and `REPLACE_WITH_ADMIN_TOKEN` placeholders with fresh values from `openssl rand -hex 32`. `setup.sh` does this for you. Garage will not start while `rpc_secret` is still the placeholder.
2. Start Garage and set it up once:

```bash
docker compose --profile garage up -d garage

NODE_ID=$(docker exec garage /garage node id | cut -d'@' -f1)
docker exec garage /garage layout assign "$NODE_ID" --zone local-dc --capacity 100G
docker exec garage /garage layout apply --version 1

docker exec garage /garage bucket create dharini-bucket
docker exec garage /garage key create dharini-key
docker exec garage /garage bucket allow --read --write --owner dharini-bucket --key dharini-key
```

3. Copy the key ID and secret printed by `key create` into `S3_ACCESSKEYID` and `S3_SECRETACCESSKEY` in `.env`.
4. In `.env`, use `S3_ENDPOINT=http://garage:3900` (the address the backend uses inside the Docker network), `S3_REGION=garage` or any value, and `S3_BUCKET=dharini-bucket`.
5. Browsers cannot reach `http://garage:3900`. Expose Garage's S3 port through your reverse proxy (for example at `https://dharini.example.org/s3`) and set `S3_PUBLIC_URL` to that address. The backend rewrites the internal endpoint to this public address in the upload URLs it hands to browsers. See [Nginx Configuration](/administrator-guide/nginx-configuration/).

The repository also has a `setup.sh` helper that automates this for Ubuntu. Read it before running it: it also installs Docker and the AWS CLI, hard-codes the bucket name `dharini-bucket` and the folder `uploads`, and its secret-generation step only works if `garage.toml` still contains `REPLACE_WITH_RPC_SECRET` and `REPLACE_WITH_ADMIN_TOKEN` placeholders. If those are not present it skips the step and keeps whatever secrets are in the file, so replace them by hand as above.

### Bucket CORS rule

Sequencing files (up to 5 GB each) are uploaded straight from the user's browser to the bucket with a presigned `PUT` URL. They do not pass through the backend. The bucket therefore needs a CORS rule that allows your web origin, or the browser blocks every upload.

Save this as `cors.json`, replacing the origin with your web app's address (the same value you put in `CORS_ORIGINS`):

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://dharini.example.org"],
      "AllowedMethods": ["PUT", "GET", "HEAD"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3600
    }
  ]
}
```

Apply it with the AWS CLI. For AWS S3:

```bash
aws s3api put-bucket-cors --bucket dharini-prod-storage --cors-configuration file://cors.json
```

For Garage, add `--endpoint-url http://localhost:3900` and export the Garage key as `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

## Step 3: Prepare the server

Install Docker on the server (Ubuntu example):

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release git

sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io \
  docker-buildx-plugin docker-compose-plugin

sudo usermod -aG docker $USER
sudo systemctl enable --now docker
```

Log out and back in so the group change takes effect, then check:

```bash
docker --version
docker compose version
```

## Step 4: Download the deployment files

The server needs only `docker-compose.yml`, `deploy.sh` and your `.env`. The application images are pulled from `dsihartpark` on Docker Hub (see Step 6), so nothing is built and the source code is not needed. Keep the folder name `dharini`: Docker Compose uses it as the project name, and the database volume is named after it.

```bash
mkdir dharini && cd dharini
curl -fsSLO https://raw.githubusercontent.com/dsih-artpark/dharini/production/docker-compose.yml
curl -fsSLO https://raw.githubusercontent.com/dsih-artpark/dharini/production/deploy.sh
curl -fsSL  https://raw.githubusercontent.com/dsih-artpark/dharini/production/.env.example -o .env
chmod +x deploy.sh
```

(`.env` starts as a copy of `.env.example`.)

## Step 5: Configure environment variables

Edit the `.env` you downloaded in Step 4. Docker Compose and the backend container both read it from this folder.

The backend reads some variables with a strict check at startup. If a required one is missing, the container crashes or never starts listening on port 4000. This is the smallest set that starts:

```bash
# Application
NODE_ENV=production
PORT=4000

# Database
DB_HOST=postgres                 # bundled container; or your RDS endpoint
DB_PORT=5432
DB_DATABASE=dharini_db
DB_USERNAME=postgres
DB_PASSWORD=<strong-password>
DB_SSL=false                     # false for the bundled container; true (or unset) for RDS

# Redis (bundled container)
REDIS_HOST=redis
REDIS_PORT=6379

# Object storage (see Step 2)
S3_REGION=<region>
S3_BUCKET=<bucket-name>
S3_ACCESSKEYID=<access-key-id>
S3_SECRETACCESSKEY=<secret-access-key>
S3_ENDPOINT=<endpoint>           # AWS: https://s3.<region>.amazonaws.com; Garage: http://garage:3900
S3_PUBLIC_URL=                   # Garage only: public address of the /s3 proxy
S3_FOLDER=uploads

# Security
JWT_SECRET=<long-random-string>  # for example: openssl rand -hex 32

# CORS: browser origins allowed to call the API (no path, no trailing slash, no "*")
CORS_ORIGINS=https://dharini.example.org

# Visit scheduling queue (BullMQ)
QUEUE=dharini-queue
JOB_SCHEDULER=visit-scheduler
JOB_SCHEDULE_REPEAT_PATTERN=0 0 * * *

# Links in invitation emails and SMS. Must end with a slash.
FRONTEND_PLATFORM=https://dharini.example.org/

# Genomics pipeline: all three are read at startup and must be set,
# even if you do not use sequencing (they may be left empty).
PIPELINE_URL=
PIPELINE_CALLBACK_URL=
WEBHOOK_SECRET=

# Email (SMTP) and SMS
EMAIL_FROM=noreply@dharini.example.org
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMS_PROVIDER=twilio              # or "console" to print messages to the log
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=

# Web frontend (read when the container starts; see note below)
NEXT_PUBLIC_API_URL=https://dharini.example.org/api
NEXT_PUBLIC_APP_ENV=production
```

Notes:

- `CORS_ORIGINS` is mandatory outside development. If it is empty, the backend logs an error and never starts listening. List every browser origin that calls the API, including the mobile web app if you serve it.
- `FRONTEND_PLATFORM` is joined to paths by plain concatenation, so the trailing slash matters.
- `PIPELINE_CALLBACK_URL` is the public URL where the sequencing pipeline posts results back, which is `https://dharini.example.org/api/sequencing/pipeline/webhook` when you proxy the API under `/api/`. `WEBHOOK_SECRET` is the shared secret used to sign those callbacks.
- The `NEXT_PUBLIC_*` values are read when the `frontend` container starts, so the published image works for any deployment. After changing one, restart the container (see [Updating](#updating)). `NEXT_PUBLIC_APK_DOWNLOAD_URL` is empty by default, which hides the app download button on the login page. See [Mobile App](/administrator-guide/mobile-app/) for where the APK link comes from.
- `NEXT_PUBLIC_API_URL` is the address browsers use to reach the backend. The backend itself has no `/api` prefix; the `/api` here comes from the reverse proxy in [Nginx Configuration](/administrator-guide/nginx-configuration/).

See [Environment Variables](/administrator-guide/environment-variables/) for what every variable does and for the optional ones.

## Step 6: Start the services

```bash
./deploy.sh production
```

The script pulls the images and runs `docker compose --profile production up -d --wait`. It starts every service in the profile (`redis`, `backend`, `frontend`), plus `mobile-web` once a Flutter web build has been put in the `mobile-web` folder. It adds `postgres` when `DB_HOST` in `.env` is `postgres` (or `postgres16-postgis`), the bundled database, and `garage` when `S3_ENDPOINT` points at it. With any other `DB_HOST`, such as an RDS endpoint, the bundled database does not start. It waits until the services are healthy, which can take a few minutes on the first start. When you run `docker compose` yourself with the bundled database, add `--profile bundled-db`.

The images are published by GitHub Actions when a pull request is merged into `staging` or `production`, as `dharini-backend` and `dharini-frontend`. They are tagged with the branch name and `sha-<short commit>` (linux/amd64 only). Compose picks the tag from `IMAGE_TAG` (default `production`) and the registry from `IMAGE_REGISTRY` (default `dsihartpark` on Docker Hub). A fork can publish its own images and point `IMAGE_REGISTRY` at them. To build from the checkout instead, run `./deploy.sh production --build`.

- `pgadmin` is only in the `development` and `staging` profiles. For the database, use `psql` over an SSH tunnel.
- `mobile-web` is not published. It serves a Flutter web build made for your deployment from the `mobile-web` folder; see [Mobile App](/administrator-guide/mobile-app/#mobile-web).

Check that the containers are up:

```bash
docker compose --profile production --profile bundled-db ps
```

With the bundled Postgres, the backend starts after the database reports healthy. With an external database (RDS), it exits and Docker restarts it until the database is reachable, so a few restarts on the first start are normal.

### What happens when the backend starts

When `NODE_ENV` is anything other than `development`, the backend does the following, in this order:

1. **Runs pending database migrations.** If a migration fails, the process exits. You do not run migrations by hand.
2. **Runs the seeder.** It loads the country, state and district `regions` if that table is empty, creates or reconciles the pre-defined roles and permissions, diseases, surveillance types and sample types, and creates the first super-admin account if `SUPER_ADMIN_EMAIL` is set (see Step 9). It is safe to run on every start.
3. **Starts listening** on `PORT` (default 4000).
4. **Loads GeoLens map layers in the background.** The layers are about 525,000 rows (wetlands and water bodies) loaded from about 77 MB of compressed files built into the image. No poultry farm or livestock market list is included: put your own files in the `geolens-data` folder, as `DATA_SOURCES.md` in the repository explains. This runs once into empty tables. The API works while it runs; the GeoLens map layers stay empty until it finishes. Failures are logged and do not stop the server.

Follow the progress with:

```bash
docker logs backend -f
```

Look for `Migrations completed.` and `Database seeded successfully.`

## Step 7: Load reference data

The backend loads the `regions` table (country, states, districts) from `regions.sql` at startup, when the table is empty. You do not load it by hand.

## Step 8: Set up Nginx, SSL and DNS

Install Nginx and Certbot:

```bash
sudo apt-get install -y nginx certbot python3-certbot-nginx
```

Create the Nginx configuration as described in [Nginx Configuration](/administrator-guide/nginx-configuration/), then obtain a certificate:

```bash
sudo certbot --nginx -d dharini.example.org
```

Add a DNS A record for your domain pointing at the server's public IP address (TTL 300 is a good starting value).

## Step 9: Create the first admin

There are two ways to get a first administrator. Both sign in with an OTP, so working email or SMS delivery is required.

**Self-serve signup.** Anyone can open the web app and sign up. Signup verifies the person's email or phone with an OTP, then creates a new workspace and makes that person the workspace administrator (`workspace-admin`). This is the normal route for a new deployment. It needs a configured email provider (`RESEND_API_KEY` or `SMTP_*`) or SMS provider (`TWILIO_*`).

**First super admin.** Set `SUPER_ADMIN_EMAIL` in `.env` before the first start, and optionally `SUPER_ADMIN_FIRST_NAME`, `SUPER_ADMIN_LAST_NAME` and `SUPER_ADMIN_PHONE` (see [Environment Variables](/administrator-guide/environment-variables/#first-super-admin)). The seeder then creates a super-admin account with those details, and you sign in as that user with an OTP sent to that address or number. It only creates the account if no user with that email exists, so changing the variables later does not rename an existing account. If `SUPER_ADMIN_EMAIL` is empty, no super admin is created.

You can then invite other users from the web app.

## Step 10: Verify the deployment

1. Check the backend health endpoint:

   ```bash
   curl http://localhost:4000/health
   ```

   It returns `{"status":"ok", ...}`. Through Nginx the address is `https://dharini.example.org/api/health`. The backend container has a Docker healthcheck on this endpoint (with a 300-second start period), so `docker compose ps` shows `healthy` once it answers.

2. Open `https://dharini.example.org`. The login page should load.
3. Open `https://dharini.example.org/api/docs`. The API documentation should load.
4. Sign in and confirm you receive the OTP.
5. Check the logs for errors:

   ```bash
   docker logs backend --tail 100
   docker logs frontend --tail 100
   ```

## Updating

```bash
curl -fsSLO https://raw.githubusercontent.com/dsih-artpark/dharini/production/docker-compose.yml
curl -fsSLO https://raw.githubusercontent.com/dsih-artpark/dharini/production/deploy.sh && chmod +x deploy.sh
./deploy.sh production
```

The two downloads refresh `docker-compose.yml` and `deploy.sh`; the script then pulls the newest `production` images and recreates the containers that changed. Volumes are kept. The backend applies new migrations and re-runs the seeder on startup. Take a database backup before updating (see [Database Setup](/administrator-guide/database-setup/)).

To deploy from GitHub Actions instead of by hand, see [CI/CD with GitHub Actions](/administrator-guide/github-actions/).

Changing `.env` needs no new image. Re-run `./deploy.sh production` (or `docker compose --profile production up -d`) to apply it. This includes `NEXT_PUBLIC_*` values.

### Rolling back

Every published build also has a `sha-<short commit>` tag. Run an earlier one with:

```bash
IMAGE_TAG=sha-abc1234 ./deploy.sh production
```

Migrations are not undone by this. Restore a database backup if the newer version changed the schema.

## Post-Deployment

- Set up monitoring and log collection
- Configure automated database backups
- Put the backend (4000) and frontend (3000) ports behind Nginx and a firewall. They are published on all interfaces. Postgres, Redis, pgAdmin and Garage listen on `127.0.0.1` only
- Test the main flows: login, creating a project, a visit, and a sample

## Next Steps

- [Environment Variables](/administrator-guide/environment-variables/) - Full configuration reference
- [Nginx Configuration](/administrator-guide/nginx-configuration/) - Detailed reverse proxy setup
- [Database Setup](/administrator-guide/database-setup/) - Migrations, backups and tuning
- [Troubleshooting](/administrator-guide/troubleshooting/) - Common issues and fixes
