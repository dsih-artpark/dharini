---
title: Mobile App
description: Build the Android app and give people a download link
---

The mobile app is built per deployment: your API address, map key and monitoring keys are compiled in. There is no generic published APK. The settings come from `mobile/.env`; copy `mobile/.env.example` and fill it in.

| Variable                          | Used for                                                                   |
| --------------------------------- | -------------------------------------------------------------------------- |
| `API_BASE_URL`                    | Your backend address                                                       |
| `MAP_API_KEY`                     | Map tiles ([Stadia Maps](https://stadiamaps.com/))                         |
| `SENTRY_DSN`, `SENTRY_ENV`        | Error reporting (optional, see [Error reporting](#error-reporting-sentry)) |

## Error reporting (Sentry)

Set `SENTRY_DSN` to send crash reports to Sentry. Leave it empty to turn them off. Only the mobile app uses Sentry.

A report holds the stack trace, app and device details, and for a failed API call the method, route (record IDs replaced), status code, and the field names and types of the request and response. It holds no request or response values, query values, headers, tokens, user identity, screenshots or console output. Emails, phone numbers, long digit runs, URLs and coordinates in error messages are masked, and so are the values of fields such as names, contact details, addresses, GPS, disease data and photos. Long messages are cut short, and a report that cannot be masked is dropped rather than sent. Barcode scanner problems (camera failures, labels that would not scan) are reported with the reason and counts, never the barcode.

Two things to check:

- Masking of free text is pattern-based. A name written as a field (`ownerName: …`) is masked, but a name in a plain sentence of a backend error message is not recognised.
- Retention, storage region, access and IP address storage are set in your Sentry project, not in the app.

## Build the APK

You need Java 17 and [FVM](https://fvm.app/). The Flutter version is pinned in `mobile/.fvmrc`.

```bash
cd mobile
cp .env.example .env        # then edit it
fvm install
fvm dart run melos bootstrap
fvm dart run melos run schema:generate
fvm dart run melos run barrel:generate
fvm flutter build apk --release
```

The APK is written to `mobile/build/app/outputs/flutter-apk/app-release.apk`.

### Signing

The release build reads the keystore from `KEYSTORE_FILE`, `KEYSTORE_PASSWORD`, `KEY_ALIAS` and `KEY_PASSWORD`, or from `mobile/android/key.properties` (`storeFile` defaults to `release-keystore.jks` in `mobile/android/app/`). To create a keystore and `key.properties`, run `./setup-keystore.sh` from the repository root. Android only installs an update that is signed with the same key as the installed app, so back up the keystore and its passwords. Keep them out of git.

## Publish it

The landing page and login dialog of the web app show an Android app button when `NEXT_PUBLIC_APK_DOWNLOAD_URL` is set (it is hidden when empty). Point it at wherever the APK is hosted. The easiest place is a GitHub Release made by the Mobile CI workflow (below). Any other host works too: a static file server, object storage or Nginx. After changing the value, recreate the `frontend` container with `docker compose --profile production up -d frontend` (`docker compose restart` does not re-read `.env`).

On an Ubuntu server with the build tools installed (`./setup-mobile.sh` installs them), `./deploy-mobile.sh` builds the APK and the web build, names the APK `dharini-v<version>.apk` in `mobile/build/app/outputs/flutter-apk/`, and copies the web build into `./mobile-web`. It does not upload the APK anywhere.

## Mobile web

`flutter build web --release` in `mobile/` produces a web build of the same app, with your API address compiled in (`API_BASE_URL` in `mobile/.env`). It is served by a small nginx container from the `mobile-web` folder next to `docker-compose.yml`, so nothing is built on the server:

```bash
mkdir -p mobile-web && cp -r mobile/build/web/. mobile-web/
docker compose --profile mobile-web up -d mobile-web
```

It listens on port 3002. Add its address to `CORS_ORIGINS` in `.env`, and set `NEXT_PUBLIC_MOBILE_WEB_URL` to it so the landing page and login dialog link to it, then recreate the `frontend` container with `docker compose --profile production up -d frontend` (`docker compose restart` does not re-read `.env`). Later builds only need the files copied again: new files are served at once, with no restart. Once `mobile-web/index.html` exists, `./deploy.sh` keeps the container running as part of every deployment.

## GitHub Actions

The **Mobile CI** workflow (`.github/workflows/mobile-ci.yml`) builds a signed APK and the web build on a GitHub runner. Run it manually (**Actions**, **Mobile CI**, **Run workflow**) on the `staging` or `production` branch.

| Branch       | Release                                                                                                                                | Asset                 | Link                                                                                     |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------------------------------------------------------------------- |
| `production` | `v<version>` from `mobile/pubspec.yaml`, marked latest                                                                                 | `dharini.apk`         | `https://github.com/<owner>/<repo>/releases/latest/download/dharini.apk`                 |
| `staging`    | pre-release `staging-v<version>` (one per version, replaced if you run it again for the same version), plus a copy as `staging-latest` | `dharini-staging.apk` | `https://github.com/<owner>/<repo>/releases/download/staging-latest/dharini-staging.apk` |

On `production`, the run fails early if the release `v<version>` already exists. Bump `version:` in `mobile/pubspec.yaml`, or run the workflow with the `replace_existing` input to replace it. `staging` needs no version bump: running it again for the same version replaces that version's APK, and earlier staging versions stay for comparison. The APK is also kept as a workflow artifact for 7 days.

### Versioning

Bump `version:` in `mobile/pubspec.yaml` once, when the next release cycle starts (after the production release). Staging rebuilds then reuse the version while you fix problems, and production releases follow one version after another with no gaps. The workflow sets Android's version code from the run number (`--build-number`), so a rebuilt APK of the same version still installs as an update over the previous one.

The workflow needs these secrets, set on the repository or in the `staging` / `production` environment:

- Signing: `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`, `ANDROID_STORE_PASSWORD`
- App settings: `API_BASE_URL`, `MAP_API_KEY` (the older `STADIA_API_KEY` also works), `SENTRY_DSN`, `SENTRY_ENV`
- Optional, only to also deploy the Flutter web build to a server: `HOST`, `USERNAME`, `SSH_PRIVATE_KEY`, `JUMP_HOST`, `JUMP_USER`, `JUMP_KEY`

When `HOST` is set, the workflow copies the web build into `deploy/dharini/mobile-web` on the server and makes sure the `mobile-web` container is running. Run Deploy to server at least once first, so `docker-compose.yml` is there. Without `HOST`, that part is skipped.

### Keeping an existing download address

If people already use an address such as `https://your-site/download`, make Nginx redirect it to the release link instead of serving a page:

```nginx
location = /download {
    return 302 https://github.com/<owner>/<repo>/releases/latest/download/dharini.apk;
}
```

## Build and distribute your own APK

The app needs your API address and signing key, so build your own APK.

**With GitHub**

1. Fork the repository and enable Actions in the fork. Workflows in a fork are disabled until you do.
2. Add the signing and app-setting secrets above. Leave the server secrets out.
3. Run **Mobile CI** on the fork's `production` branch.
4. Set `NEXT_PUBLIC_APK_DOWNLOAD_URL` on your web deployment to `https://github.com/<your-user>/<your-fork>/releases/latest/download/dharini.apk`, then recreate the `frontend` container (see [Publish it](#publish-it)).

A GitHub release asset can be up to 2 GiB, and anyone can download it from a public repository without a GitHub account.

**Without GitHub**

Build the APK as described above, host the file anywhere (a static file server, object storage or Nginx), and set `NEXT_PUBLIC_APK_DOWNLOAD_URL` to its address.
