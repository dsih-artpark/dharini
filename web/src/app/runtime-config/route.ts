import { PUBLIC_ENV_NAMES } from "@/env";

// Serves the deployment settings to the browser as a script, so the same build
// can run against any API. Only the NEXT_PUBLIC_ names listed in env.ts are
// sent; nothing else in the environment is exposed.
export const dynamic = "force-dynamic";

export function GET() {
  const values: Record<string, string> = {};
  for (const name of PUBLIC_ENV_NAMES) {
    const value = process.env[name];
    if (value) values[name] = value;
  }
  // "<" is escaped so a value can never close the script tag it is loaded from.
  const body = `window.__ENV=${JSON.stringify(values).replace(/</g, "\\u003c")};`;
  return new Response(body, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
