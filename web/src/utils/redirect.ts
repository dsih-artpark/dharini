const ORIGIN_PROBE = "http://app.invalid";

/**
 * Returns [value] when it is a path inside this app, otherwise null.
 *
 * `redirectTo` comes from the URL, so anyone can put anything in it. Sending a
 * user to an outside address after they log in is an open redirect, which is
 * used for phishing. Absolute URLs (`https://evil.example`), protocol-relative
 * ones (`//evil.example`) and backslash forms (`/\evil.example`) are refused.
 * Control characters are refused too: browsers drop tabs and line breaks
 * inside a URL, so `/<tab>/evil.example` becomes `//evil.example`.
 */
export function safeRedirectPath(value: string | null | undefined): string | null {
  if (!value || !value.startsWith("/")) return null;
  if (value.startsWith("//") || /[\u0000-\u001f\u007f\\]/.test(value)) {
    return null;
  }
  try {
    if (new URL(value, ORIGIN_PROBE).origin !== ORIGIN_PROBE) return null;
  } catch {
    return null;
  }
  return value;
}
