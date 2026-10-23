import { generateOtp, shouldUseFixedTestOtp } from './generate-otp';

describe('shouldUseFixedTestOtp', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('is off by default when ALLOW_FIXED_OTP is unset', () => {
    delete process.env.ALLOW_FIXED_OTP;
    process.env.NODE_ENV = 'development';
    expect(shouldUseFixedTestOtp()).toBe(false);
  });

  it('is off for any misconfigured/unrecognized NODE_ENV value when the flag is unset', () => {
    // The bug this replaces: the old NODE_ENV-allowlist design defaulted to
    // the fixed OTP for anything outside staging/demo/production, including
    // typos. Now NODE_ENV alone can never turn it on.
    delete process.env.ALLOW_FIXED_OTP;
    process.env.NODE_ENV = 'stage'; // typo for "staging" - a real one found in this repo's .env
    expect(shouldUseFixedTestOtp()).toBe(false);
  });

  it('turns on only with the explicit flag set to the literal string "true"', () => {
    process.env.ALLOW_FIXED_OTP = 'true';
    process.env.NODE_ENV = 'development';
    expect(shouldUseFixedTestOtp()).toBe(true);
  });

  it('rejects truthy-but-not-"true" values', () => {
    process.env.ALLOW_FIXED_OTP = '1';
    process.env.NODE_ENV = 'development';
    expect(shouldUseFixedTestOtp()).toBe(false);
  });

  it('is hard-vetoed by NODE_ENV=production even if the flag is on', () => {
    process.env.ALLOW_FIXED_OTP = 'true';
    process.env.NODE_ENV = 'production';
    expect(shouldUseFixedTestOtp()).toBe(false);
  });
});

describe('generateOtp', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('returns the fixed 123456 only when shouldUseFixedTestOtp is true', () => {
    process.env.ALLOW_FIXED_OTP = 'true';
    process.env.NODE_ENV = 'demo';
    expect(generateOtp()).toBe(123456);
  });

  it('returns a random 6-digit OTP otherwise', () => {
    delete process.env.ALLOW_FIXED_OTP;
    process.env.NODE_ENV = 'production';
    const otp = generateOtp();
    expect(otp).toBeGreaterThanOrEqual(100000);
    expect(otp).toBeLessThanOrEqual(999999);
  });
});
