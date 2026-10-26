Create a separate branch for each feature or bug fix.

Do not make any git commits directly. Provide a commit message inline, and let the user commit the changes for you manually.

## Project Structure

This is a **monorepo** for Dharini, a disease surveillance and sample collection platform:

```text
dharini/
├── backend/          # NestJS backend API (TypeScript)
├── web/              # Next.js 15 frontend (React 18, TypeScript)
├── mobile/           # Flutter mobile app (Dart)
└── docker-compose.yml
```

## Web App (`/web`)

- **Framework**: Next.js 15 (App Router), React 18, TypeScript
- **State**: Jotai
- **HTTP**: Axios (`/web/src/libs/apiClient.ts`)
- **Styling**: Tailwind CSS

### Key Directories
- `/web/src/app/(root)/` - Public routes (login page at `page.tsx`)
- `/web/src/app/(dashboard)/` - Protected routes with layout
  - `home/` - Dashboard
  - `monitor/` - Disease monitoring
  - `manage/` - Admin project management
  - `lab/` - Lab flow (sample processing)
  - `projects/[id]/` - Project details
- `/web/src/components/` - React components organized by feature
  - `lab/sample-accession/` - Lab workflow components (receiving, preprocessing, extraction, testing, completed)
- `/web/src/utils/auth.ts` - Token management

## Mobile App (`/mobile`)

- **Framework**: Flutter, Dart 3.5
- **State**: BLoC (flutter_bloc)
- **Routing**: Go Router (`/mobile/lib/router.dart`)
- **HTTP**: Dio
- **Local Storage**: Hive (offline-first)
- **Entry Point**: `/mobile/lib/main.dart` → `bootstrap.dart`

### Key Directories
- `/mobile/lib/views/auth/` - Login & onboarding
  - `login.dart` - Phone login with OTP
- `/mobile/lib/views/sites/` - Site management
  - `create_site.dart` - Site creation form
- `/mobile/lib/views/visits/` - Visit management
  - `add_new_visit.dart` - Visit creation
  - `add_visit_details.dart` - Visit details form
- `/mobile/lib/views/samplecollection/` - Sample collection workflow
  - `sucessess.dart` - Visit completion screen
- `/mobile/lib/services/`
  - `database_service.dart` - Hive local storage
  - `sync_service.dart` - Data synchronization
- `/mobile/packages/` - Local packages (repository, es_client, design_system)

## Backend (`/backend`)

- **Framework**: NestJS 11, TypeScript
- **Database**: PostgreSQL 16 + PostGIS (TypeORM)
- **Auth**: JWT + Passport
- **Key Modules**: auth, users, projects, sites, visits, samples, lab-tests, statistics

## Key Flows

### Web Login
`/web/src/app/(root)/page.tsx` → OTP via `actions.ts` → redirect to `/home`

### Mobile Login
`/mobile/lib/views/auth/login.dart` → OTP → `/auth/verify-otp` → home

### Lab Flow (Web)
Components in `/web/src/components/lab/sample-accession/`:
1. `sample-receiving.tsx`
2. `sample-preprocessing.tsx`
3. `sample-extraction.tsx`
4. `sample-testing.tsx`
5. `sample-accession-completed.tsx`

### Mobile Visit Flow
1. Login → 2. Site selection/creation → 3. Visit creation → 4. Sample collection → 5. Success screen
