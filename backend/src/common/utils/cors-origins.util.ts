/**
 * Parses CORS_ORIGINS (a comma-separated list of browser origins, e.g.
 * `https://demo.dharini.artpark.ai,https://in.dharini.artpark.ai`) into
 * normalised origins. Throws on anything that isn't a bare http(s) origin —
 * including `*` — so a typo fails at startup instead of silently blocking or
 * allowing browsers.
 */
export function parseCorsOrigins(raw: string | undefined): string[] {
  return (raw ?? '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      let url: URL;
      try {
        url = new URL(entry);
      } catch {
        throw new Error(
          `CORS_ORIGINS: "${entry}" is not a valid origin (expected e.g. https://demo.dharini.artpark.ai)`,
        );
      }
      // A browser's Origin header is scheme://host[:port] only, so an entry
      // with a path, query or credentials could never match one.
      const isBareOrigin =
        (url.protocol === 'https:' || url.protocol === 'http:') &&
        !url.username &&
        !url.password &&
        url.pathname === '/' &&
        !url.search &&
        !url.hash;
      if (!isBareOrigin) {
        throw new Error(
          `CORS_ORIGINS: "${entry}" must be a bare origin like https://host[:port], with no path`,
        );
      }
      return url.origin; // lower-cased, trailing slash and default port dropped
    });
}

/** Any port on localhost / 127.0.0.1, e.g. Next.js on :3000 or Flutter web. */
export function isLocalhostOrigin(origin: string): boolean {
  try {
    const { protocol, hostname } = new URL(origin);
    return (
      (protocol === 'http:' || protocol === 'https:') &&
      (hostname === 'localhost' || hostname === '127.0.0.1')
    );
  } catch {
    return false;
  }
}
