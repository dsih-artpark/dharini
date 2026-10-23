// Session-expiry helpers shared by the middleware (edge runtime), setToken
// (server), the API client and the login page (browser), so nothing here may
// import server- or browser-only code.

export const LOGIN_ROUTE = "/";
export const SESSION_EXPIRED_REASON = "session-expired";

// Pages anyone can open without signing in.
export const PUBLIC_ROUTES: RegExp[] = [
  /^\/project-invitation\/[A-Za-z0-9._!-]+$/,
  /^\/signup(?:\/.*)?$/,
  /^\/privacy\/?$/,
  /^\/workspace-invitation\/[A-Za-z0-9._!-]+$/,
];

// How long the auth cookie outlives its token. While an expired token is
// still in the cookie, the middleware can tell "session expired" apart from
// "never signed in" and send the user to the login page with that reason.
export const EXPIRED_TOKEN_GRACE_SECONDS = 60 * 60 * 24;

/**
 * The token's `exp` in milliseconds, or null if it has none or isn't a JWT.
 * Not verified: only the backend can do that.
 */
export function getTokenExpiry(token: string): number | null {
  const payload = token.split(".")[1];
  if (!payload) return null;
  try {
    const { exp } = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    );
    return typeof exp === "number" ? exp * 1000 : null;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string, now = Date.now()): boolean {
  const expiry = getTokenExpiry(token);
  return expiry !== null && expiry <= now;
}

/** The login page and public routes: pages with no session to expire. */
export function isPublicPath(pathname: string): boolean {
  return (
    pathname === LOGIN_ROUTE ||
    PUBLIC_ROUTES.some((route) => route.test(pathname))
  );
}

/**
 * Login page URL that says "Session Expired" and returns to [redirectTo]
 * after signing in.
 */
export function sessionExpiredLoginPath(redirectTo: string): string {
  const params = new URLSearchParams({
    reason: SESSION_EXPIRED_REASON,
    redirectTo,
  });
  return `${LOGIN_ROUTE}?${params}`;
}
