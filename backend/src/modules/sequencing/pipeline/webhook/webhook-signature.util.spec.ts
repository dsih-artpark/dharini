import {
  computeWebhookSignature,
  isTimestampFresh,
  verifyWebhookSignature,
} from './webhook-signature.util';

const SECRET = 'test-webhook-secret';
const TIMESTAMP = '1755598800';
const BODY = JSON.stringify({ event: 'run.completed', delivery_id: 'd-1' });

function sign(body: string, timestamp: string, secret = SECRET): string {
  return `sha256=${computeWebhookSignature(body, timestamp, secret)}`;
}

describe('verifyWebhookSignature', () => {
  it('accepts a signature computed over the exact raw body and timestamp', () => {
    const signature = sign(BODY, TIMESTAMP);

    expect(verifyWebhookSignature(BODY, TIMESTAMP, signature, SECRET)).toBe(
      true,
    );
  });

  it('accepts when the raw body is given as a Buffer, matching a string-derived signature', () => {
    const signature = sign(BODY, TIMESTAMP);

    expect(
      verifyWebhookSignature(
        Buffer.from(BODY, 'utf8'),
        TIMESTAMP,
        signature,
        SECRET,
      ),
    ).toBe(true);
  });

  it('rejects a body tampered with after signing', () => {
    const signature = sign(BODY, TIMESTAMP);
    const tamperedBody = JSON.stringify({
      event: 'run.completed',
      delivery_id: 'd-2',
    });

    expect(
      verifyWebhookSignature(tamperedBody, TIMESTAMP, signature, SECRET),
    ).toBe(false);
  });

  it('rejects when the timestamp used to verify differs from the one signed', () => {
    const signature = sign(BODY, TIMESTAMP);

    expect(verifyWebhookSignature(BODY, '1755598801', signature, SECRET)).toBe(
      false,
    );
  });

  it('rejects a re-serialised body even when semantically identical', () => {
    // Same keys/values, different key order — proves the check is byte-exact,
    // not a JSON-semantic comparison.
    const rawBody = '{"a":1,"b":2}';
    const reserialised = '{"b":2,"a":1}';
    const signature = sign(rawBody, TIMESTAMP);

    expect(
      verifyWebhookSignature(reserialised, TIMESTAMP, signature, SECRET),
    ).toBe(false);
  });

  it('does not crash on a signature of the wrong length (guards timingSafeEqual)', () => {
    expect(() =>
      verifyWebhookSignature(BODY, TIMESTAMP, 'sha256=abcd', SECRET),
    ).not.toThrow();
    expect(verifyWebhookSignature(BODY, TIMESTAMP, 'sha256=abcd', SECRET)).toBe(
      false,
    );
  });

  it('does not crash on a non-hex signature', () => {
    expect(() =>
      verifyWebhookSignature(
        BODY,
        TIMESTAMP,
        'sha256=not-hex-at-all!!',
        SECRET,
      ),
    ).not.toThrow();
  });

  it('rejects when the sha256= prefix is missing', () => {
    const raw = computeWebhookSignature(BODY, TIMESTAMP, SECRET);

    expect(verifyWebhookSignature(BODY, TIMESTAMP, raw, SECRET)).toBe(false);
  });

  it('rejects when the header, timestamp, or secret is missing', () => {
    const signature = sign(BODY, TIMESTAMP);

    expect(verifyWebhookSignature(BODY, TIMESTAMP, undefined, SECRET)).toBe(
      false,
    );
    expect(verifyWebhookSignature(BODY, undefined, signature, SECRET)).toBe(
      false,
    );
    expect(verifyWebhookSignature(BODY, TIMESTAMP, signature, '')).toBe(false);
  });

  it('rejects a signature computed with the wrong secret', () => {
    const signature = sign(BODY, TIMESTAMP, 'a-different-secret');

    expect(verifyWebhookSignature(BODY, TIMESTAMP, signature, SECRET)).toBe(
      false,
    );
  });
});

describe('isTimestampFresh', () => {
  const nowS = 1755598800;

  it('accepts a timestamp from right now', () => {
    expect(isTimestampFresh(String(nowS), 300, nowS)).toBe(true);
  });

  it('accepts a timestamp just inside the 5 minute tolerance', () => {
    expect(isTimestampFresh(String(nowS - 299), 300, nowS)).toBe(true);
  });

  it('rejects a timestamp older than 5 minutes (a 10 minute old delivery)', () => {
    expect(isTimestampFresh(String(nowS - 600), 300, nowS)).toBe(false);
  });

  it('rejects a timestamp far in the future', () => {
    expect(isTimestampFresh(String(nowS + 600), 300, nowS)).toBe(false);
  });

  it('rejects a missing or non-numeric timestamp', () => {
    expect(isTimestampFresh(undefined, 300, nowS)).toBe(false);
    expect(isTimestampFresh('not-a-number', 300, nowS)).toBe(false);
  });
});
