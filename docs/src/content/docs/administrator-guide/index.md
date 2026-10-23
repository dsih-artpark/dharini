---
title: Administrator Guide
description: Guide for system administrators deploying Dharini
---

This guide covers deploying Dharini on your own server, from preparing the database and file storage to running the application behind a reverse proxy.

Dharini runs as a set of Docker Compose services (backend, web frontend, Redis, and optionally Postgres, Garage, pgAdmin and the mobile web app). You choose where the database and file storage live:

- **Managed cloud services.** Use AWS RDS PostgreSQL (with PostGIS) for the database and an AWS S3 bucket for files.
- **Self-hosted.** Use the bundled PostgreSQL 16 + PostGIS container and the bundled [Garage](https://garagehq.deuxfleurs.fr/) container, which provides S3-compatible storage. Nothing leaves your own server. This also works on a Windows server through WSL 2 (see `deploy-readme.md` in the repository root).

You can mix the two, for example RDS with Garage.

Deploying Dharini requires:

- A Linux server (Ubuntu 24.04 recommended) with Docker and Docker Compose
- PostgreSQL 16 with PostGIS (managed, or the bundled container)
- S3-compatible object storage (AWS S3, or the bundled Garage container), with a CORS rule for browser uploads
- Nginx as a reverse proxy, and SSL certificates via Certbot
- An SMTP email server or an SMS provider (Twilio), because users sign in with a one-time password

The backend applies database migrations and loads its reference data automatically when it starts, so there is no separate migration step.

## Where to start

1. **Short version:** the [README](https://github.com/dsih-artpark/dharini#run-it-on-a-server) has the four steps: download two files, fill in `.env`, run `./deploy.sh production`, put it behind HTTPS.
2. **Full version:** follow [Production Setup](/administrator-guide/production-setup/) from top to bottom. It covers the database, file storage, `.env`, Nginx, SSL and DNS.
3. **Keep it running:** [Updating and rolling back](/administrator-guide/production-setup/#updating), [CI/CD with GitHub Actions](/administrator-guide/github-actions/), [Troubleshooting](/administrator-guide/troubleshooting/).
4. **Phones:** [Mobile App](/administrator-guide/mobile-app/) for the Android app and its download link.

## All pages

- [Production Setup](/administrator-guide/production-setup/) - Complete deployment guide, for managed or self-hosted infrastructure
- [Environment Variables](/administrator-guide/environment-variables/) - Configuration reference
- [Nginx Configuration](/administrator-guide/nginx-configuration/) - Reverse proxy setup
- [Database Setup](/administrator-guide/database-setup/) - PostgreSQL, migrations, backups and tuning
- [CI/CD with GitHub Actions](/administrator-guide/github-actions/) - Workflows, variables and secrets
- [Mobile App](/administrator-guide/mobile-app/) - Build and publish the Android app
- [Troubleshooting](/administrator-guide/troubleshooting/) - Common issues and solutions
