# Third-Party Notices

Dharini's own code is licensed under the [Apache License 2.0](LICENSE). Dharini
also includes, or depends on, software, fonts, images and online services made
by others. They keep their own licences and terms, which this file lists.

Datasets are listed separately in [DATA_SOURCES.md](DATA_SOURCES.md).

Last reviewed: 2026-10-06.

## Contents

1. [Components with extra conditions or closed source](#1-components-with-extra-conditions-or-closed-source)
2. [Separate programs run alongside Dharini](#2-separate-programs-run-alongside-dharini)
3. [Online services](#3-online-services)
4. [Fonts, images and logos](#4-fonts-images-and-logos)
5. [Notices required by Apache-2.0 components](#5-notices-required-by-apache-20-components)
6. [Open-source packages](#6-open-source-packages)

---

## 1. Components with extra conditions or closed source

These are the only parts of Dharini that are not under a permissive
open-source licence. None of them stores Dharini's data, and each has an open
alternative.

| Component                                                                                                                                                            | Used for                                            | Licence or terms                                                                                                                                                                                                                | Open alternative                                                                                                   |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| [Google ML Kit barcode scanning](https://developers.google.com/ml-kit/terms), included by [`mobile_scanner`](https://pub.dev/packages/mobile_scanner) (BSD-3-Clause) | Scanning sample barcodes in the Android app         | Closed source; free to use and redistribute in apps under the ML Kit Terms of Service. On iOS, `mobile_scanner` uses Apple's built-in Vision framework instead                                                                  | A ZXing-based scanner plugin                                                                                       |
| [Google Play Services Location](https://developers.google.com/android/guides/overview), included by [`geolocator`](https://pub.dev/packages/geolocator) (MIT)        | GPS location in the Android app                     | Closed source; free; requires Google Play services on the phone                                                                                                                                                                 | Android's built-in location service, which `geolocator` can use instead through its `forceLocationManager` setting |
| [`react-leaflet`](https://github.com/PaulLeCam/react-leaflet) 4.2 and `@react-leaflet/core` 2.1                                                                      | Maps in the web app                                 | [Hippocratic License 2.1](https://firstdonoharm.dev/version/2/1/license/): permissive, with added conditions that forbid use which violates human rights. Not an OSI-approved licence. Dharini's use is within these conditions | [Leaflet](https://leafletjs.com) (BSD-2-Clause), which `react-leaflet` is built on                                 |
| [`sharp`](https://sharp.pixelplumbing.com) (Apache-2.0), with its prebuilt [libvips](https://github.com/lovell/sharp-libvips)                                        | Image resizing in the web and documentation servers | libvips is LGPL-3.0-or-later. It is loaded as a separate library and is not modified                                                                                                                                            | Not needed; libvips is itself open source                                                                          |
| [`buffers`](https://github.com/substack/node-buffers) 0.1.1, included by `exceljs` → `unzipper` → `binary`                                                           | Reading Excel files in the backend                  | States no licence. Its sibling packages `chainsaw`, `traverse` and `pause`, by the same authors, are MIT                                                                                                                        | Removed by upgrading `exceljs` when a release drops this chain                                                     |

Dual-licensed packages are used under their permissive option: `dompurify`
(MPL-2.0 or Apache-2.0) under Apache-2.0, and `jszip` (MIT or GPL-3.0) under
MIT.

`caniuse-lite`, the browser-support data used by Next.js, is licensed CC BY 4.0
(credit: Alexis Deveria, [caniuse.com](https://caniuse.com)).

## 2. Separate programs run alongside Dharini

Dharini's Docker Compose setup runs these unchanged, as separate programs. Their
licences place no conditions on Dharini's code.

| Program                                                                      | Image                           | Used for                                                         | Licence                                                                                                                                                  |
| ---------------------------------------------------------------------------- | ------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [PostgreSQL](https://www.postgresql.org) with [PostGIS](https://postgis.net) | `postgis/postgis:16-3.4-alpine` | Database                                                         | PostgreSQL Licence; PostGIS is GPL-2.0-or-later                                                                                                          |
| [Redis](https://redis.io)                                                    | `redis:alpine`                  | Job queues and cache                                             | Redis 8 is offered under RSALv2, SSPLv1 or AGPL-3.0; Dharini uses it under AGPL-3.0. [Valkey](https://valkey.io) (BSD-3-Clause) is a drop-in replacement |
| [Garage](https://garagehq.deuxfleurs.fr)                                     | `dxflrs/garage:v2.2.0`          | Optional self-hosted file storage                                | AGPL-3.0. Any S3-compatible storage can be used instead                                                                                                  |
| [pgAdmin 4](https://www.pgadmin.org)                                         | `dpage/pgadmin4`                | Optional database admin tool                                     | PostgreSQL Licence                                                                                                                                       |
| [Node.js](https://nodejs.org) on [Alpine Linux](https://alpinelinux.org)     | `node:22-alpine`                | Base of the backend and web images                   | Node.js: MIT. Alpine: a mix of open-source licences, including GPL-2.0 for BusyBox                                                                       |
| [nginx](https://nginx.org) on Alpine Linux                                   | `nginx:alpine`                  | Serves the Flutter web build; also the recommended reverse proxy | BSD-2-Clause                                                                                                                                             |

## 3. Online services

Each organisation running Dharini signs up for the services it wants, under that
service's own terms, and supplies its own keys in the settings.

| Service                                                                                                                                                                   | Used for                                                          | Required?                                                     | Alternative                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------ |
| [Twilio](https://www.twilio.com)                                                                                                                                          | SMS login codes and invitations                                   | Only for SMS login. Email login works without it              | Any SMS gateway with an HTTP API                             |
| An SMTP email server (for example AWS SES)                                                                                               | Login codes and notifications by email                            | Yes, one of them                                              | Any SMTP server, including self-hosted ones                  |
| AWS S3 or any S3-compatible storage                                                                                                                                       | Photos and files                                                  | Yes                                                           | Garage or MinIO, self-hosted                                 |
| [OpenStreetMap](https://www.openstreetmap.org/copyright) tiles                                                                                                            | Default background map (web)                                      | Yes, or another map provider                                  | Any tile server, including self-hosted                       |
| [Esri World Imagery](https://www.esri.com/en-us/legal/terms/full-master-agreement), [CARTO](https://carto.com/attributions), [OpenTopoMap](https://opentopomap.org/about) | Optional map styles (web)                                         | No                                                            | —                                                            |
| [Stadia Maps](https://stadiamaps.com/terms-of-service/), Esri World Imagery                                                                                               | Background maps (mobile)                                          | Yes today; set in `mobile/lib/utils/map_tile_provider.dart`   | OpenStreetMap or a self-hosted tile server                   |
| [OpenStreetMap Nominatim](https://operations.osmfoundation.org/policies/nominatim/)                                                                                       | Place search                                                      | No. The free service allows at most one request per second    | A self-hosted Nominatim                                      |
| [OpenWeatherMap](https://openweathermap.org)                                                                                                                              | Weather cards in GeoLens                                          | No; needs a key                                               | —                                                            |
| [Open-Meteo](https://open-meteo.com/en/terms)                                                                                                                             | Historical weather in GeoLens                                     | No. Its free API is for non-commercial use; data is CC BY 4.0 | A paid Open-Meteo plan, or self-hosted Open-Meteo (AGPL-3.0) |
| [eBird API](https://www.birds.cornell.edu/home/ebird-api-terms-of-use/) (Cornell Lab of Ornithology)                                                                      | Bird observations in GeoLens                                      | No; needs a key                                               | —                                                            |
| [NCBI E-utilities](https://www.ncbi.nlm.nih.gov/home/about/policies/)                                                                                                     | Fetching public genome sequences by accession number              | No                                                            | Upload FASTQ files directly                                  |
| Sequencing analysis pipeline, set with `PIPELINE_URL`                                                                                                                     | Genomic analysis of uploaded sequencing data                      | No; needed only for genomic analysis                          | —                                                            |
| [PostHog](https://posthog.com)                                                                                                                                            | Usage analytics                                                   | No; off unless a key is set                                   | Self-hosted PostHog                                          |
| [Sentry](https://sentry.io)                                                                                                                                               | Error reports                                                     | No; off unless a key is set                                   | Self-hosted Sentry                                           |
| [Google Fonts](https://developers.google.com/fonts/faq/privacy)                                                                                                           | The web app loads Geist and Noto Serif from Google's servers      | Yes today                                                     | Serve the font files from Dharini itself                     |
| `www.google.com`                                                                                                                                                          | The mobile app checks for an internet connection by contacting it | Yes today                                                     | Any reliable address, such as the Dharini server             |

## 4. Fonts, images and logos

| Item                                                            | Where                                                                                          | Licence or owner                                                                               | Credit or condition                                                                                                                                                         |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Noto Serif](https://fonts.google.com/noto/specimen/Noto+Serif) | `mobile/assets/fonts/`, `mobile/widgetbook/assets/fonts/`; loaded from Google Fonts on the web | SIL Open Font License 1.1                                                                      | The licence text must accompany the font files                                                                                                                              |
| [Geist](https://vercel.com/font)                                | Same as above                                                                                  | SIL Open Font License 1.1                                                                      | Same as above                                                                                                                                                               |
| Android robot                                                   | `web/public/images/android-logo.svg`                                                           | Google, [CC BY 3.0](https://developer.android.com/distribute/marketing-tools/brand-guidelines) | "The Android robot is reproduced or modified from work created and shared by Google and used according to terms described in the Creative Commons 3.0 Attribution License." |
| Default profile picture                                         | Loaded from `cdn.pixabay.com` by the mobile app                                                | [Pixabay Content License](https://pixabay.com/service/license-summary/)                        | None required                                                                                                                                                               |
| Dharini and ARTPARK names and logos                             | Throughout                                                                                     | Trademarks of ARTPARK; **not licensed under Apache-2.0**                                       | See [NOTICE](NOTICE)                                                                                                                                                        |

## 5. Notices required by Apache-2.0 components

Apache-2.0 requires that these components' `NOTICE` files travel with them.

**swagger-ui-dist** (API reference page in the backend)

```text
swagger-ui
Copyright 2020-2021 SmartBear Software Inc.
```

**@ucast/core, @ucast/js, @ucast/mongo, @ucast/mongo2js** (permission checks in
the backend)

```text
Copyright 2020 Sergii Stotskyi <sergiy.stotskiy@gmail.com>
```

## 6. Open-source packages

Everything not listed above is under a permissive open-source licence. Counts of
the packages shipped in each component, as of the date at the top of this file:

| Licence                                                                                                         | Backend |     Web | Docs site |
| --------------------------------------------------------------------------------------------------------------- | ------: | ------: | --------: |
| MIT (including MIT-0 and MIT-style)                                                                             |     310 |     285 |       340 |
| Apache-2.0                                                                                                      |     111 |      21 |         7 |
| ISC                                                                                                             |      39 |      40 |        12 |
| BSD-2-Clause and BSD-3-Clause                                                                                   |      16 |      19 |        13 |
| Listed in section 1                                                                                             |       2 |       6 |         1 |
| Other permissive (0BSD, Unlicense, BlueOak-1.0.0, CC0-1.0, Python-2.0, and combinations of permissive licences) |       5 |       6 |         6 |
| **Total**                                                                                                       | **483** | **377** |   **379** |

The Flutter mobile app's packages are under BSD-3-Clause, MIT and Apache-2.0,
apart from the Android components in section 1.

Each package's own licence file is included with it when installed (in
`node_modules/` for npm packages, and in the pub cache for Flutter packages).
To list them yourself:

```bash
# npm components (run inside backend/, web/ or docs/)
npx license-checker-rseidelsohn --production --summary

# Flutter app (run inside mobile/)
flutter pub deps --style=list
```
