const SENSITIVE_KEYS = new Set([
  'otp',
  'password',
  'invitetoken',
  'token',
  'authorization',
  'email',
  'contactnumber',
  'text',
  'html',
]);

/**
 * Walks an object/array and replaces known-sensitive keys with
 * '[REDACTED]', case-insensitively. For the rare case where logging a
 * structural summary of a request/response is genuinely useful - most call
 * sites should just not log the payload at all.
 */
export function redactForLog(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redactForLog);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, val]) => [
        key,
        SENSITIVE_KEYS.has(key.toLowerCase())
          ? '[REDACTED]'
          : redactForLog(val),
      ]),
    );
  }
  return value;
}
