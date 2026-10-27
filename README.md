# Dharini

One Health surveillance platform for integrated disease monitoring: field sample collection with an offline-first Android app, a laboratory workflow, and dashboards and maps. The repository holds the backend API, the web app and the mobile app.

**Documentation: <https://dharini.artpark.ai>** (user guides, administrator guide, API reference)

## Where to start

| I want to | Go to |
| --- | --- |
| Try Dharini on my computer | [Try it locally](#try-it-locally) |
| Run it for my organisation | [Run it on a server](#run-it-on-a-server) |
| Know what each setting does | [`.env.example`](.env.example) (grouped and commented), then the [Environment Variables](https://dharini.artpark.ai/administrator-guide/environment-variables/) reference |
| Get or build the Android app | [Android app](#android-app) |
| Use Dharini as a collector, lab technician or admin | [User guide](https://dharini.artpark.ai/user-guide/field-collector/) |
| Change the code | [Develop](#develop) and [CONTRIBUTING.md](CONTRIBUTING.md) |
| Report a security problem | [SECURITY.md](SECURITY.md) |

---

## Try it locally

You need Docker with Docker Compose V2 (`docker compose`, not `docker-compose`).

```bash
git clone https://github.com/dsih-artpark/dharini.git
cd dharini
./quickstart.sh
```

This creates a `.env` with random secrets, starts everything and prints the address (<http://localhost:3000>) and a test login. `./quickstart.sh --build` builds the images from your checkout instead of pulling them. The test login uses a fixed one-time code, so use it for trying things out only.

---

## Run it on a server

### What you need

- A Linux server with Docker and Docker Compose V2, and `curl`
- A domain name, with Nginx in front for HTTPS (see [Nginx Configuration](https://dharini.artpark.ai/administrator-guide/nginx-configuration/))
- S3-compatible file storage: an AWS S3 bucket, or the bundled [Garage](https://garagehq.deuxfleurs.fr/)
- A way to send sign-in codes: email (any SMTP server) or SMS (Twilio)

PostgreSQL with PostGIS and Redis are included. You can use your own database instead.

**1. Download the deployment files.** The images are published to Docker Hub, so nothing is built and you do not need the source code.

```bash
mkdir dharini && cd dharini
curl -fsSLO https://raw.githubusercontent.com/dsih-artpark/dharini/production/docker-compose.yml
curl -fsSLO https://raw.githubusercontent.com/dsih-artpark/dharini/production/deploy.sh
curl -fsSL  https://raw.githubusercontent.com/dsih-artpark/dharini/production/.env.example -o .env
chmod +x deploy.sh
```

Keep the folder name `dharini`: Docker Compose uses it to name the database volume.

**2. Fill in `.env`.** Work through section 1 (**Required**) and section 2 (**Sign-in**) of the file. Everything after that is optional or has a working default.

**3. Start it.**

```bash
./deploy.sh production
```

`deploy.sh` pulls the images, starts every service and waits until they are healthy. The first start loads reference data and can take a few minutes. The backend creates the super admin from `SUPER_ADMIN_EMAIL`; sign in with that email and a one-time code.

**4. Put it behind HTTPS.** The backend (port 4000) and web app (port 3000) listen on all interfaces, so front them with Nginx or a firewall. PostgreSQL, Redis and pgAdmin listen on `127.0.0.1` only. The [Production Setup](https://dharini.artpark.ai/administrator-guide/production-setup/) guide covers storage, DNS, Nginx and SSL step by step.

**Update.** Download `docker-compose.yml` and `deploy.sh` again (the two `curl` lines above), then run `./deploy.sh production`.

**Roll back.** `IMAGE_TAG=sha-abc1234 ./deploy.sh production` runs a specific earlier build. Every build is also tagged with its commit.

### More

- Windows server (WSL 2) with local storage: [`deploy-readme.md`](deploy-readme.md)
- Deploying from GitHub Actions: [CI/CD with GitHub Actions](https://dharini.artpark.ai/administrator-guide/github-actions/)
- Problems: [Troubleshooting](https://dharini.artpark.ai/administrator-guide/troubleshooting/)

---

## Android app

The app has your API address built in, so each deployment builds its own. The **Mobile CI** workflow does this on GitHub and publishes the APK as a GitHub Release; link that release in `NEXT_PUBLIC_APK_DOWNLOAD_URL` and the web landing page and login dialog show an Android app button. You can also build it yourself. If you also serve the mobile web build, set `NEXT_PUBLIC_MOBILE_WEB_URL` to its address to show a Mobile web button. See [Mobile App](https://dharini.artpark.ai/administrator-guide/mobile-app/) in the administrator guide.

---

## Develop

To build the images from your checkout and run the whole stack:

```bash
cp .env.example .env     # set DB_PASSWORD, JWT_SECRET and CORS_ORIGINS at least
docker compose --profile development up --build
```

Each part can also run on its own:

```bash
cd backend && npm install && npm run start:dev   # API on :4000
cd web && npm install && npm run dev             # web app on :3000
cd mobile                                        # see mobile/README.md
```

Branches, pull requests, checks and coding standards are in [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Repository layout

```text
backend/          NestJS API (TypeORM, PostgreSQL + PostGIS)
web/              Next.js web app
mobile/           Flutter app (see mobile/README.md)
docs/             Documentation site
docker-compose.yml, deploy.sh, quickstart.sh, .env.example
```

`docker-compose.yml` groups services into profiles: `development`, `staging` and `production` (Redis, backend, frontend, and pgAdmin in the first two; `development` also has PostgreSQL), plus the optional `bundled-db` (PostgreSQL, which `deploy.sh` adds when `DB_HOST=postgres`), `garage` (S3 storage) and `mobile-web` (serves the Flutter web build from `./mobile-web`).

| Service | Port | Reachable from |
| --- | --- | --- |
| Web app | 3000 | all interfaces |
| Backend API | 4000 | all interfaces |
| PostgreSQL | 5432 | this machine only |
| Redis | 6379 | this machine only |
| pgAdmin (`development`, `staging`) | 5050 | this machine only |
| Garage S3 (optional) | 3900–3903 | this machine only |
| Mobile web (optional) | 3002 | all interfaces |

---

## License

Dharini is licensed under the [Apache License 2.0](LICENSE). Copyright and trademark notices are in [`NOTICE`](NOTICE).

Third-party software, fonts, images and online services keep their own licences and terms, listed in [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md). Datasets keep the licences of their sources, listed in [`DATA_SOURCES.md`](DATA_SOURCES.md).

The Dharini and ARTPARK names and logos are trademarks of ARTPARK and are not covered by the Apache License.
