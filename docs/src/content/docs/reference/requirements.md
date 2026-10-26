---
title: Software Requirements & Specifications
description: System requirements, dependencies, and technical specifications for Dharini platform deployment
---

This document specifies the software requirements, dependencies, and technical specifications for developing and deploying the Dharini platform.

## Runtime Requirements

### Backend

| Component | Version | Notes |
|-----------|---------|-------|
| Node.js | 22.x LTS | Required for NestJS runtime |
| PostgreSQL | 16.x | With PostGIS 3.4 extension |
| Redis | Any current release (Compose uses the unpinned `redis:alpine` image) | Job queue (BullMQ) and cache |

### Web Frontend

| Component | Version | Notes |
|-----------|---------|-------|
| Node.js | 22.x LTS | Required for Next.js |
| Browser Support | Chrome 64+, Edge 79+, Firefox 67+, Safari 12+ | The browsers Next.js 15 builds for (its default target; newer versions of these are fine) |

### Mobile App

| Component | Version | Notes |
|-----------|---------|---------|
| Flutter SDK | 3.29.0 (pinned in `mobile/.fvmrc`; `pubspec.yaml` allows ≥3.16.0) | Cross-platform framework |
| Dart SDK | ^3.5.4 | Language runtime |
| Android | API 23+ (Android 6.0) | Minimum supported version (`minSdk`) |
| iOS | 12.0+ | Minimum supported version (planned) |

---

## Development Environment

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Docker | 24.x+ | Container runtime |
| Docker Compose | 2.x+ | Multi-container orchestration |
| Git | 2.x+ | Version control |
| Node.js | 22.x LTS | Backend and web development |
| Flutter SDK | 3.29.0 (via [fvm](https://fvm.app)) | Mobile development |
| Android Studio | Latest | Android SDK and emulator |
| VS Code / IDE | Latest | Recommended IDE |

### Quick Start (Development)

```bash
# Clone repository
git clone https://github.com/dsih-artpark/dharini.git
cd dharini

# Copy environment template
cp .env.example .env

# Start development services
docker compose --profile development up -d --build

```

In development mode the backend creates the schema with TypeORM `synchronize`, so there is no migration step. Outside development, the backend runs pending migrations and the seeder on startup.

### Development Ports

| Service | Port | URL |
|---------|------|-----|
| Backend API | 4000 | http://localhost:4000 |
| Web Frontend | 3000 | http://localhost:3000 |
| Mobile web (Flutter web build) | 3002 | http://localhost:3002 |
| PostgreSQL | 5432 | localhost:5432 |
| Redis | 6379 | localhost:6379 |
| pgAdmin | 5050 | http://localhost:5050 |
| Garage (optional, `garage` profile) | 3900-3903 | S3 API on 3900, other ports for RPC, web and admin |

---

## Production Environment

### Infrastructure Requirements

| Component | Specification | Notes |
|-----------|---------------|-------|
| Compute | 2 vCPU, 4GB RAM minimum | t3.medium or equivalent |
| Database | PostgreSQL 16 with PostGIS | AWS RDS recommended |
| Storage | 50GB+ SSD | For database and logs |
| Object Storage | S3-compatible (AWS S3 or self-hosted Garage) | For media uploads and sequencing files |
| SSL | TLS 1.2+ | Required for HTTPS |

### AWS Services (Recommended)

| Service | Purpose |
|---------|---------|
| EC2 | Application hosting |
| RDS | Managed PostgreSQL |
| S3 | File storage (photos, reports) |
| Route 53 | DNS management |
| ACM | SSL certificates |

### Network Requirements

| Port | Protocol | Purpose |
|------|----------|---------|
| 22 | TCP | SSH access (restricted) |
| 80 | TCP | HTTP (redirects to HTTPS) |
| 443 | TCP | HTTPS |
| 5432 | TCP | PostgreSQL (internal only) |

---

## Software Dependencies

### Backend (NestJS)

**Core Framework:**
- NestJS 11.x
- TypeScript 5.x
- TypeORM 0.3.x

**Key Dependencies:**

| Package | Version | Purpose |
|---------|---------|---------|
| `@nestjs/passport` | 11.x | Authentication |
| `@nestjs/jwt` | 11.x | JWT tokens |
| `@nestjs/bullmq` | 11.x | Job queue |
| `bullmq` | 5.x | Queue engine |
| `@casl/ability` | 6.x | Authorization (RBAC) |
| `@aws-sdk/client-s3` | 3.x | S3 file uploads |
| `typeorm` | 0.3.x | Database ORM |
| `pg` | 8.x | PostgreSQL driver |
| `nodemailer` | 7.x | Email sending (SMTP) |
| `@nestjs/throttler` | 6.x | Rate limiting on auth routes |
| `@nestjs/schedule` | 6.x | Scheduled jobs |
| `helmet` | 8.x | Security headers |
| `ioredis` | 5.x | Redis client (cache) |
| `twilio` | 5.x | SMS/OTP |

### Web Frontend (Next.js)

**Core Framework:**
- Next.js 15.x (App Router)
- React 18.x
- TypeScript 5.x

**Key Dependencies:**

| Package | Version | Purpose |
|---------|---------|---------|
| `jotai` | 2.x | State management |
| `axios` | 1.x | HTTP client |
| `leaflet` | 1.9.x | Maps |
| `react-leaflet` | 4.x | React map components |
| `recharts` | 2.x | Charts/visualization |
| `tailwindcss` | 3.x | Styling |
| `next` | 15.4.x | Framework |

### Mobile (Flutter)

**Core Framework:**
- Flutter 3.29.0
- Dart ^3.5.4

**Key Dependencies:**

| Package | Version | Purpose |
|---------|---------|---------|
| `flutter_bloc` | 8.x | State management |
| `flutter_hooks` | 0.20.x | Hooks for widgets |
| `fquery` | 1.5.x | Data fetching/caching |
| `hive` | 2.x | Local database |
| `dio` | 5.x | HTTP client |
| `go_router` | 14.x | Navigation |
| `flutter_map` | 8.x | Maps |
| `geolocator` | 13.x | GPS location |
| `mobile_scanner` | 6.x | QR/barcode scanning |
| `sentry_flutter` | 9.x | Error tracking |

---

## Database Schema

### Core Entities

| Table | Description | Key Relations |
|-------|-------------|---------------|
| `users` | User accounts | → teams, roles |
| `projects` | Surveillance projects | → teams, sites, diseases |
| `teams` | Team organization | → users, projects |
| `roles` | Permission definitions | → users (via user_roles) |
| `sites` | Collection locations | → projects, visits (PostGIS geometry) |
| `visits` | Site visit records | → sites, samples, users |
| `samples` | Sample records | → visits, lab_tests, diseases |
| `lab_tests` | Test results | → samples, diseases |
| `diseases` | Disease definitions | → projects, samples |
| `sample_types` | Sample type catalog | → samples |
| `media` | Uploaded files | → S3 references |
| `workspaces` | Tenant organizations | → projects, members |
| `invites` | Pending invitations | → users, roles |
| `sequencing_*` | Sequencing submissions, jobs and pipeline webhook deliveries | → samples |
| `bio_*` | GeoLens reference layers (water boundaries, wetlands, poultry farms, cattle markets) | PostGIS geometry |

The list above is a summary. See [Database Setup](/administrator-guide/database-setup/) for details.

### Required Extensions

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

`pg_trgm` is created by a migration and is used for fast substring search. It is available in the standard PostgreSQL contrib package and in the `postgis/postgis` image.

---

## API Specifications

### Authentication

- **Method:** JWT Bearer tokens
- **Token Expiry:** 7 days (fixed in code, not configurable). The web app's cookie lasts one day longer than the token, so the app can tell an expired session from a missing one.
- **OTP Delivery:** SMS via Twilio, or email via SMTP

### API Documentation

- **Format:** OpenAPI 3.0 (Swagger)
- **Interactive UI:** `/docs` on the backend (`/api/docs` behind the Nginx layout)
- **Published spec:** [API Reference](/api-reference/), rendered from [`/openapi/openapi.json`](/openapi/openapi.json). The file is committed at `docs/public/openapi/openapi.json` and regenerated with `npm run openapi:generate` in `backend/`
- **Generated Client:** `es_client` package for mobile

### Rate Limiting

The backend limits the auth and OTP routes (login, OTP verification and resend, signup) to **10 requests per 60 seconds per IP address**. Other routes have no backend rate limit. If you need one, set it in the reverse proxy (see [Nginx Configuration](/administrator-guide/nginx-configuration/)).

---

## Security Requirements

### Authentication

- OTP-based login (SMS/email)
- JWT tokens signed with HS256 (`JWT_SECRET`), valid for 7 days
- httpOnly, SameSite=Lax cookies for web sessions, lasting as long as the token plus one day
- No token refresh: users sign in again when the token expires

### Authorization

- Role-based access control (CASL)
- Scope hierarchy: System → Workspace → Project → Team
- A global JWT guard covers every route; routes opt out with `@Public()`
- CASL policy guards on the controllers that expose project data
- Security headers (helmet) and a CORS allowlist (`CORS_ORIGINS`)

### Data Protection

- Serve every app over HTTPS. [Nginx Configuration](/administrator-guide/nginx-configuration/) shows the proxy layout.
- Encryption at rest is a setting of the services you use, not of Dharini. Enable storage encryption on the PostgreSQL database (for example RDS) and on the S3 bucket. [Production Setup](/administrator-guide/production-setup/) lists these steps.

---

## Offline Capability

- The mobile app stores its data in a local Hive database
- Data syncs with the backend in the background on a timer, and can also be synced by hand
- Photos are compressed on the phone before upload

---

## Monitoring & Observability

### Error Tracking

- **Service:** Sentry
- **Coverage:** Mobile app only
- **Data sent:** Stack traces, device details and the shape of failed requests, not their values. See [Error reporting](/administrator-guide/mobile-app/#error-reporting-sentry).

### Health Checks

| Endpoint | Purpose |
|----------|---------|
| `/health` | Backend liveness |
| `/docs` (`/api/docs` behind the Nginx layout) | API availability |

### Logging

- The backend writes plain-text logs to standard output (`console.log` and the NestJS logger); there is no structured JSON logging
- Retention is whatever your container runtime or log collector provides

---

## Environment Variables

See [Environment Variables Reference](/administrator-guide/environment-variables/) for the complete list of configuration options.

Required variables depend on which features you use (for example, `CORS_ORIGINS` is mandatory outside development, and sequencing needs the `PIPELINE_*` and `WEBHOOK_SECRET` keys). The reference lists which variables are required and which are optional.

---

## Deployment Profiles

Docker Compose supports multiple deployment profiles:

| Profile | Services | Use Case |
|---------|----------|----------|
| `development` | Postgres, Redis, pgAdmin, backend, web | Local development |
| `staging` | Redis, pgAdmin, backend, web | Staging |
| `production` | Redis, backend, web | Production |
| `bundled-db` | The bundled PostgreSQL | Add-on; `deploy.sh` adds it when `DB_HOST=postgres` |
| `garage` | Garage (self-hosted S3-compatible storage) | Add-on, combine with another profile |
| `mobile-web` | Flutter web build (port 3002) | Add-on; built per deployment, not published |

`deploy.sh` starts the bundled Postgres only when `DB_HOST` in `.env` is `postgres`. To use an external database such as RDS, set `DB_HOST` to its address and the other `DB_*` variables to match; the bundled container is then not started. Add `--profile garage` to run Garage as the object store.

On a server, use `./deploy.sh staging` or `./deploy.sh production`. It pulls the backend and web images from `dsihartpark` on Docker Hub (published when a pull request is merged into `staging` or `production`; override with `IMAGE_TAG` and `IMAGE_REGISTRY`) and starts the profile. See [Production Setup](/administrator-guide/production-setup/).

```bash
# Development (builds from the checkout)
docker compose --profile development up -d --build

# Production or staging server
./deploy.sh production
```

---

## Version Compatibility Matrix

| Component | Current Version |
|-----------|-----------------|
| Backend API | 0.1.0 |
| Web Frontend | 0.1.0 |
| Mobile App | 0.2.7 |
| Database Schema | Migration-based (run the latest migration) |

---

*Document generated from the staging branch. Last updated: October 2026.*
