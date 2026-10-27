---
title: CI/CD with GitHub Actions
description: What each workflow does and the variables and secrets they need
---

The repository's workflows build and check every pull request, publish Docker images when a pull request is merged, and can deploy those images to your servers. A fork gets the same workflows; nothing deploys until you add the variables and secrets below.

## Workflows

| Workflow | Runs | Needs |
|---|---|---|
| **Smoke Test** (`smoke-test.yml`) | Pull requests into `staging` or `production`; manual. Jobs: Build Backend (build and tests), Build Web, Build Mobile (Flutter) | Nothing |
| **OpenAPI Spec Check** (`openapi-check.yml`) | Pull requests that touch `backend/` or `docs/public/openapi/`; manual | Nothing |
| **Publish Docker images** (`publish-images.yml`) | Push to `staging` or `production`; manual | `DOCKERHUB_NAMESPACE` variable, `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` secrets |
| **Deploy to server** (`deploy.yml`) | Manual, or automatically after Publish Docker images (see below) | Server secrets in the `staging` / `production` environment |
| **Mobile CI** (`mobile-ci.yml`) | Manual, on `staging` or `production` | Signing and app secrets. See [Mobile App](/administrator-guide/mobile-app/) |
| **Deploy Documentation to Production** (`production-docs-deploy.yml`) | Manual, on `production` | The same server secrets as Deploy to server |

The last workflow copies the built docs site to `/var/www/dharini-docs` on a server with SSH and `sudo`. Skip it if you host `docs/dist` somewhere else.

## Branches and environments

`staging` and `production` are the two deployable branches. Create a GitHub **environment** with the same name for each (Settings, Environments). Deploy to server and Mobile CI pick the environment from the branch they run on, so each branch uses its own server and its own values. On the `production` environment, add required reviewers if you want a person to approve each deployment, and limit "Deployment branches" to `production`.

## Variables and secrets

Add these under Settings, Secrets and variables, Actions.

**Repository variables**

| Name | Value |
|---|---|
| `DOCKERHUB_NAMESPACE` | Docker Hub user or organization the images are pushed to. Publishing is skipped while this is unset |
| `AUTO_DEPLOY_STAGING`, `AUTO_DEPLOY_PRODUCTION` | Optional. `true` deploys that branch right after its images are published |

**Repository secrets**

| Name | Value |
|---|---|
| `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN` | Docker Hub login and an access token with Read & Write |

**Environment secrets** (set separately in `staging` and `production`)

| Name | Used by | Value |
|---|---|---|
| `HOST`, `USERNAME`, `SSH_PRIVATE_KEY` | Deploy to server, docs, Mobile CI web copy | The server and the user to connect as |
| `JUMP_HOST`, `JUMP_USER`, `JUMP_KEY` | Same | Only if you reach the server through a jump host |
| `API_BASE_URL`, `SENTRY_ENV` | Mobile CI | Differ between staging and production |
| `MAP_API_KEY`, `SENTRY_DSN` | Mobile CI | App settings |
| `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`, `ANDROID_STORE_PASSWORD` | Mobile CI | Signing. Use the same keystore for both environments |

A secret set on the repository is also visible to the environments, so values that are the same everywhere can go there.

## The server

Deploy to server logs in over SSH and works in the `deploy` folder of that user's home directory:

- `deploy/infra/root.env` holds the settings for that server. It is copied to `.env` on every deployment, so keep a separate file for staging and production. [Production Setup, Step 5](/administrator-guide/production-setup/) lists the variables the backend needs to start, and [Environment Variables](/administrator-guide/environment-variables/) describes all of them.
- Each run downloads the current `docker-compose.yml` and `deploy.sh` into `deploy/dharini` and runs `./deploy.sh`. Keep that folder name: Docker Compose uses it as the project name, and the database volume is named after it.
- The user needs Docker with Compose (`up --wait`) and `curl`. The server does not need git, and nothing is built on it.

### What differs between staging and production

Give each server its own value for these, and never reuse secrets between them:

| Variable | Staging | Production |
|---|---|---|
| `NEXT_PUBLIC_APP_ENV` | `staging` (shows a test-data banner) | `production` |
| `NEXT_PUBLIC_API_URL`, `CORS_ORIGINS`, `FRONTEND_PLATFORM` | The staging site's addresses | The production site's addresses |
| `DB_PASSWORD`, `JWT_SECRET`, `WEBHOOK_SECRET`, `S3_*` | Its own values | Its own values |
| `PIPELINE_CALLBACK_URL` | Staging backend address | Production backend address |
| `NEXT_PUBLIC_APK_DOWNLOAD_URL` | The `staging-latest` release link | The `releases/latest` link (see [Mobile App](/administrator-guide/mobile-app/)) |
| `NEXT_PUBLIC_MOBILE_WEB_URL` | The staging mobile web address | The production mobile web address |
| `NODE_ENV`, `ALLOW_FIXED_OTP` | `production`, or any other value with `ALLOW_FIXED_OTP=true` if testers should sign in with the fixed code `123456` | `production`, `ALLOW_FIXED_OTP` unset |
| `IMAGE_REGISTRY` | Your Docker Hub namespace if it is not `dsihartpark` | The same |

Then run Deploy to server on `staging` to try it, and on `production` when you are ready. To roll back, run it again with `image_tag` set to an earlier `sha-<commit>` from Docker Hub.

## Deploying without GitHub Actions

On any server with Docker, refresh the two files and run the script. This is all the workflow does:

```bash
curl -fsSLO https://raw.githubusercontent.com/dsih-artpark/dharini/production/docker-compose.yml
curl -fsSLO https://raw.githubusercontent.com/dsih-artpark/dharini/production/deploy.sh && chmod +x deploy.sh
./deploy.sh production
```

A cron job, or any tool that can run this over SSH, gives you continuous deployment without GitHub Actions.
