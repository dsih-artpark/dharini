# Contributing to Dharini

Thank you for your interest in contributing to Dharini, a One Health disease surveillance and sample collection platform. Every contribution helps, whether it's a typo fix, a bug report or a new feature.

This guide explains how to set up the project, how we work, and what we look for in a pull request.

## Table of Contents

- [Ways to Contribute](#ways-to-contribute)
- [Repository Structure](#repository-structure)
- [Development Setup](#development-setup)
- [Branch Naming](#branch-naming)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Community Expectations](#community-expectations)
- [License](#license)

## Ways to Contribute

### Bug reports

Before opening an issue, search the existing issues to avoid duplicates. A good bug report includes:

- What you expected to happen and what actually happened
- Steps to reproduce
- Which part is affected (backend, web, mobile or docs) and your environment (OS, browser, device, app version)
- Relevant logs or screenshots, **with all personal data, phone numbers, tokens and credentials removed**

> **Security issues:** please do not report vulnerabilities in public issues. Follow the private reporting process in our [Security Policy](SECURITY.md) instead.

### Documentation improvements

User, administrator and reference documentation lives in [`docs/`](docs/) and is published at [dharini.artpark.ai](https://dharini.artpark.ai). We welcome corrections, clarifications and new guides.

### Feature development

For anything beyond a small change, please **open an issue first** to discuss the idea. This helps avoid duplicate work and makes sure the feature fits the project's direction.

### Testing

You can help by writing unit and integration tests, improving coverage in untested areas, or trying pre-release builds and reporting what you find.

## Repository Structure

| Directory     | Stack                                    | Description                        |
| ------------- | ---------------------------------------- | ---------------------------------- |
| `backend/`    | NestJS 11, TypeORM, PostgreSQL + PostGIS | REST API                           |
| `web/`        | Next.js 15, React 18, Tailwind CSS       | Web dashboard and lab workflow     |
| `mobile/`     | Flutter (Dart 3.5), BLoC, Hive           | Offline-first field collection app |
| `docs/`       | Astro + Starlight                        | Documentation site                 |

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) 22 (see [`.nvmrc`](.nvmrc))
- [Docker](https://docs.docker.com/get-docker/) with Docker Compose V2
- [Flutter](https://docs.flutter.dev/get-started/install) ≥ 3.16 (mobile only)

### 1. Clone the repository

```bash
git clone https://github.com/dsih-artpark/dharini.git
cd dharini
```

### 2. Configure environment

```bash
cp .env.example .env               # Used by Docker Compose
cp .env.example backend/.env       # Used when running the backend outside Docker
cp web/.env.example web/.env
cp mobile/.env.example mobile/.env
```

For local development, set `NODE_ENV=development`, and set `DB_HOST` and `REDIS_HOST` to `localhost` in `backend/.env`. **Never commit `.env` files or real credentials.**

### 3. Start supporting services

```bash
docker compose --profile development up -d postgres redis
```

### 4. Install dependencies and run

**Backend** (http://localhost:4000, API docs at `/docs`)

```bash
cd backend
npm install
npm run migration:run
npm run start:dev
```

**Web** (http://localhost:3000)

```bash
cd web
npm install
npm run dev
```

**Mobile**

```bash
cd mobile
dart pub global activate melos
melos bootstrap
flutter run
```

**Docs** (http://localhost:4321)

```bash
cd docs
npm install
npm run dev
```

To run the full stack in containers instead: `docker compose --profile development up --build`. This builds the images from your checkout; without `--build`, Compose pulls the published ones.

## Branch Naming

Create a new branch from the latest `staging` for each change. `staging` is where contributions land; `production` is the stable branch and is updated by a pull request from `staging`. Use one of these prefixes:

| Prefix     | Purpose                            | Example                      |
| ---------- | ---------------------------------- | ---------------------------- |
| `feature/` | New functionality                  | `feature/sample-bulk-export` |
| `fix/`     | Bug fixes                          | `fix/visit-date-timezone`    |
| `chore/`   | Tooling, dependencies, maintenance | `chore/upgrade-nestjs`       |
| `docs/`    | Documentation only                 | `docs/lab-technician-guide`  |

Use short, lowercase, hyphen-separated descriptions.

## Pull Request Process

1. **Create a branch** following the naming conventions above.
2. **Keep changes focused.** One pull request should address one concern. Split unrelated changes into separate PRs.
3. **Run linting and tests locally** for every part of the repo you touched (see below) and make sure they pass. CI only checks that each component builds, so this step is your responsibility.
4. **Open a pull request** against `staging`. The pull request template is filled in for you; please complete it. Include:
   - A clear title that follows the [commit conventions](#commit-messages)
   - A description of what changed and why
   - A link to the related issue (e.g. `Closes #123`)
   - Screenshots or recordings for UI changes
   - Notes on any database migrations or new environment variables
5. **Get a review.** Both `staging` and `production` need one approving review and passing CI checks before a merge. Respond to feedback by pushing new commits. Once the PR is approved, a maintainer will merge it.

The checks that must pass are **Build Backend**, **Build Web** and **Build Mobile (Flutter)** (the `Smoke Test - Build Verification` workflow, which runs on pull requests to `staging` and `production`). When a PR is merged, container images for that branch are published automatically.

### Pre-submission checklist

| Area       | Commands                                                          |
| ---------- | ----------------------------------------------------------------- |
| Backend    | `npm run lint` · `npm run format` · `npm test`                    |
| Web        | `npm run lint` · `npm run format` · `npm run build`               |
| Mobile     | `melos run analyze` · `melos run format:check` · `melos run test` |
| Docs       | `npm run build`                                                   |

### API changes and the OpenAPI spec

The backend's OpenAPI spec is committed at [`docs/public/openapi/openapi.json`](docs/public/openapi/openapi.json). The docs site renders it as the [API Reference](https://dharini.artpark.ai/api-reference/) and serves the raw file at `/openapi/openapi.json`.

If your change adds, removes or modifies a controller route, DTO, entity field exposed in a response, or Swagger decorator, regenerate the spec and commit it with your change:

```bash
cd backend
npm run openapi:generate
```

No database or Redis is needed; the script builds the backend and scans it without starting the server. The **OpenAPI Spec Check** workflow fails any pull request that touches `backend/` if the committed file doesn't match what the code generates.

## Coding Standards

These standards are checked by contributors running the pre-submission commands locally and by maintainers during review. CI does not currently enforce linting or formatting. The automatic pull request checks are the three build checks above (Build Backend also runs the backend tests), plus the OpenAPI Spec Check when `backend/` or the OpenAPI file changes.

- **TypeScript (backend, web):** code must pass **ESLint** and be formatted with **Prettier** using the configs in each package.
- **Dart / Flutter (mobile):** code must pass **`flutter analyze`** with no warnings and be formatted with **`dart format`**. Lint rules are defined in `mobile/packages/analysis_config`.
- **General:**
  - Follow the existing patterns and naming in the area you're changing.
  - Avoid `any` in TypeScript; prefer explicit types.
  - Add or update tests for behaviour changes.
  - Never log personal data, OTPs, tokens or secrets.
  - Include a TypeORM migration for any schema change.

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <short summary>
```

| Type        | Use for                                               |
| ----------- | ----------------------------------------------------- |
| `feat:`     | A new feature                                         |
| `fix:`      | A bug fix                                             |
| `docs:`     | Documentation-only changes                            |
| `chore:`    | Tooling, build, dependencies, maintenance             |
| `refactor:` | Code changes that neither fix a bug nor add a feature |
| `test:`     | Adding or updating tests                              |

Common scopes: `backend`, `web`, `mobile`, `docs`, `auth`, `lab`, `seeder`.

**Examples**

```
feat(mobile): allow offline editing of pending visits
fix(backend): number seq_id from the highest ID used this year
docs: add troubleshooting steps for PostGIS setup
```

Write the summary in the imperative mood ("add", not "added"), keep it under ~72 characters, and use the commit body to explain *why* when it isn't obvious.

## Community Expectations

We want Dharini to be a welcoming, respectful and inclusive project. When participating:

- Be respectful and constructive, especially in code review.
- Assume good intent and be patient with newcomers.
- Keep discussions focused on the work.
- Respect the sensitivity of health and location data. Never share real patient, farmer or field data in issues, PRs or test fixtures.

Harassment or abusive behaviour of any kind will not be tolerated. All participants are expected to follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## License

Dharini is licensed under the [Apache License 2.0](LICENSE). Unless you state otherwise, anything you submit for inclusion is licensed under the same terms, as section 5 of the licence describes.

If your change adds a third-party library, font, image, dataset or online service, declare it in [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) or [`DATA_SOURCES.md`](DATA_SOURCES.md) in the same pull request. Do not add data or code whose licence does not allow us to redistribute it.

---

Questions? Open a [discussion or issue](https://github.com/dsih-artpark/dharini/issues). We're happy to help.
