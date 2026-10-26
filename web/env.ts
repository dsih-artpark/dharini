// Deployment settings are read when the app runs, not when it is built, so one
// image works for every deployment. The server reads process.env; the browser
// reads window.__ENV, which the root layout loads from /runtime-config
// before the app starts. The variable names keep their NEXT_PUBLIC_ prefix.

type ENV = {
  APP_ENV: "local" | "development" | "staging" | "production" | "demo";
  API_URL: string;
  SUPER_ADMIN_LAB_FLOW: string | undefined;
  APK_DOWNLOAD_URL: string | undefined;
};

declare global {
  interface Window {
    __ENV?: Record<string, string | undefined>;
  }
}

export const PUBLIC_ENV_NAMES = [
  "NEXT_PUBLIC_APP_ENV",
  "NEXT_PUBLIC_API_URL",
  "NEXT_PUBLIC_SUPER_ADMIN_LAB_FLOW",
  "NEXT_PUBLIC_APK_DOWNLOAD_URL",
] as const;

// Looked up by name on purpose: `process.env.NEXT_PUBLIC_X` written out would
// be replaced with its build-time value.
function read(name: (typeof PUBLIC_ENV_NAMES)[number]): string | undefined {
  const source = typeof window === "undefined" ? process.env : window.__ENV;
  return source?.[name] || undefined;
}

// Every property is read when it is used, not when this file loads. The browser
// can run the app's code before the settings script has run, and a value read
// too early would be undefined for good (for example an API client created with
// no address).
export const env: ENV = {
  get APP_ENV() {
    return read("NEXT_PUBLIC_APP_ENV") as ENV["APP_ENV"];
  },
  get API_URL() {
    return read("NEXT_PUBLIC_API_URL") as string;
  },
  get SUPER_ADMIN_LAB_FLOW() {
    return read("NEXT_PUBLIC_SUPER_ADMIN_LAB_FLOW");
  },
  get APK_DOWNLOAD_URL() {
    return read("NEXT_PUBLIC_APK_DOWNLOAD_URL");
  },
};
