import { createHmac, timingSafeEqual } from 'crypto';

const SIGNATURE_PREFIX = 'sha256=';
const DEFAULT_FRESHNESS_TOLERANCE_S = 5 * 60;

/**
 * Computes the hex HMAC-SHA256 the pipeline signs a delivery with:
 * `HMAC(secret, "{timestamp}." + rawBody)`.
 *
 * `rawBody` must be the exact bytes that came off the wire — re-serialising
 * the parsed JSON body (e.g. `JSON.stringify(req.body)`) will not reproduce
 * the sender's signature, since key order, whitespace, and number formatting
 * are not guaranteed to round-trip.
 */
export function computeWebhookSignature(
  rawBody: Buffer | string,
  timestamp: string,
  secret: string,
): string {
  const bodyBuffer = Buffer.isBuffer(rawBody)
    ? rawBody
    : Buffer.from(rawBody, 'utf8');
  const signedPayload = Buffer.concat([
    Buffer.from(`${timestamp}.`, 'utf8'),
    bodyBuffer,
  ]);
  return createHmac('sha256', secret).update(signedPayload).digest('hex');
}

/**
 * Verifies the `X-Dharini-Signature` header against the raw request body in
 * constant time. Never throws — a malformed header, a length mismatch, or a
 * genuine mismatch all just return false, so a caller can turn this straight
 * into a 401 without a try/catch.
 *
 * `crypto.timingSafeEqual` throws (rather than returning false) when the two
 * buffers differ in length, so the length is checked explicitly first.
 */
export function verifyWebhookSignature(
  rawBody: Buffer | string,
  timestamp: string | undefined,
  signatureHeader: string | undefined,
  secret: string,
): boolean {
  if (!signatureHeader || !timestamp || !secret) return false;
  if (!signatureHeader.startsWith(SIGNATURE_PREFIX)) return false;

  const providedHex = signatureHeader.slice(SIGNATURE_PREFIX.length);
  const expectedHex = computeWebhookSignature(rawBody, timestamp, secret);

  const providedBuf = Buffer.from(providedHex, 'hex');
  const expectedBuf = Buffer.from(expectedHex, 'hex');

  if (providedBuf.length !== expectedBuf.length) return false;

  return timingSafeEqual(providedBuf, expectedBuf);
}

/**
 * True when `timestampHeader` (unix seconds, `X-Dharini-Timestamp`) is
 * within `toleranceS` of now, in either direction.
 *
 * The signature covers the timestamp, but that alone gives no replay
 * protection — a captured, validly-signed request could otherwise be
 * replayed indefinitely. Symmetric tolerance also rejects a timestamp far in
 * the future, guarding against clock manipulation.
 */
export function isTimestampFresh(
  timestampHeader: string | undefined,
  toleranceS: number = DEFAULT_FRESHNESS_TOLERANCE_S,
  nowS: number = Math.floor(Date.now() / 1000),
): boolean {
  if (!timestampHeader) return false;
  const ts = Number(timestampHeader);
  if (!Number.isFinite(ts)) return false;
  return Math.abs(nowS - ts) <= toleranceS;
}
