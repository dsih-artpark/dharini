# Dharini Web

The web application for Dharini, a One Health disease surveillance and sample collection platform. It provides the dashboard, disease monitoring, project and team management, the laboratory sample workflow, sequencing, and GeoLens map views. All data comes from the Dharini backend API (`backend/`).

## Tech Stack

- **Next.js 15** (App Router) with **React 18** and **TypeScript**
- **Tailwind CSS** for styling
- **Jotai** for client-side state
- **Axios** for HTTP requests to the backend
- **Leaflet / React Leaflet**, **Recharts**, and **D3** for maps and charts
- **PostHog** for optional product analytics

## Folder Structure

```
web/
├── src/
│   ├── app/
│   │   ├── (root)/          # Public routes: login (page.tsx), signup, invitations, workspace selection
│   │   ├── (dashboard)/     # Authenticated routes: home, monitor, manage, lab, projects, sequencing,
│   │   │                    #   geolens, comparison, team, settings, profile, project-onboarding
│   │   └── layout.tsx       # Root layout
│   ├── components/          # UI components grouped by feature (lab, monitor, manage, geolens, ui, ...)
│   ├── libs/                # apiClient.ts (Axios instance), presigned-URL upload helper
│   ├── lib/                 # Analytics, authorization helpers, feature flags
│   ├── store/               # Jotai atoms
│   ├── hooks/               # Shared React hooks
│   ├── types/               # Shared TypeScript types
│   ├── utils/               # Auth token handling, constants, helpers
│   └── middleware.ts        # Redirects unauthenticated users to the login page
├── public/                  # Static assets, map GeoJSON, and data files
├── env.ts                   # Typed access to environment variables
├── next.config.ts
└── Dockerfile
```

Within route folders, `page.tsx` renders the page and `loader.ts` holds the API calls for that route.

## Prerequisites

- Node.js 22 (see the root `.nvmrc`)
- A running Dharini backend. See [backend/README.md](../backend/README.md).

All commands below assume you start from the root of the `dharini` monorepo.

## Environment Variables

```bash
cp web/.env.example web/.env
```

| Variable                           | Required | Description                                                                                         |
| ---------------------------------- | -------- | --------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`              | Yes      | Base URL of the backend API, e.g. `http://localhost:4000`. Falls back to `http://localhost:4000` if unset. |
| `NEXT_PUBLIC_APP_ENV`              | Yes      | `local`, `development`, `staging`, `demo`, or `production`. `staging` and `demo` show a test-data warning banner. |
| `NEXT_PUBLIC_APK_DOWNLOAD_URL`     | No       | Android app download link shown on the login page.                                                  |
| `NEXT_PUBLIC_SUPER_ADMIN_LAB_FLOW` | No       | `true` enables the super-admin lab view across projects. Default `false`.                          |
| `NEXT_PUBLIC_POSTHOG_KEY`          | No       | PostHog project key. Analytics are disabled when unset.                                             |
| `NEXT_PUBLIC_POSTHOG_HOST`         | No       | PostHog host. Default `https://app.posthog.com`.                                                    |

All variables are prefixed `NEXT_PUBLIC_` and are visible in the browser. Never put secrets in them. They are read when the app starts, not when it is built, so one published image works for any deployment. Recreate the container after changing them. With Docker Compose, they are read from the root `.env`.

## Development

```bash
cd web
npm install
npm run dev
```

The app is available at **http://localhost:3000**.

## Build

```bash
npm run build
```

The build uses Next.js `standalone` output. To build and run it in a container from your checkout instead:

```bash
docker compose --profile development up --build frontend
```

Without `--build`, Compose pulls the published `dharini-frontend` image.

## Linting and Formatting

| Command          | Description                          |
| ---------------- | ------------------------------------ |
| `npm run lint`   | Run ESLint (`next lint`)             |
| `npm run format` | Format `src/` with Prettier          |

The web app does not have an automated test suite yet. Run `npm run lint` and `npm run build` before opening a pull request, and test your changes manually.

## How the Web App Talks to the Backend

- **API client:** all requests go through the Axios instance in `src/libs/apiClient.ts`, whose base URL is `NEXT_PUBLIC_API_URL`. Route-level API calls live in each route's `loader.ts`, and login calls live in `src/app/(root)/actions.ts`.
- **Login:** the user requests an OTP (`POST /auth/login`) and verifies it (`POST /auth/verify-otp`). The returned access token is stored in an `httpOnly` cookie named `authToken` (`src/utils/auth.ts`).
- **Authenticated requests:** a request interceptor reads the token through a server function and sends it as `Authorization: Bearer <token>`.
- **Session expiry:** a response interceptor logs the user out when the backend returns `401`.
- **Route protection:** `src/middleware.ts` redirects requests without the auth cookie to the login page, except for public routes such as signup and invitation links.
- **File uploads:** large files, such as sequencing data, are uploaded directly to S3 using presigned URLs from the backend (`src/libs/uploadViaPresignedUrl.ts`), so they never pass through the API server.
- **CORS:** because the browser calls the API directly, the web app's origin must be listed in the backend's `CORS_ORIGINS` outside development. In development, any `localhost` port is allowed.

## Contributing

See the root [CONTRIBUTING.md](../CONTRIBUTING.md) for branch naming, commit conventions, and the pull request process, and [SECURITY.md](../SECURITY.md) for reporting vulnerabilities.
