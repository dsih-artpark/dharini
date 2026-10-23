// The fixed test OTP must never be reachable by accident. Two independent
// conditions are required - an explicit opt-in flag (defaults off; unset or
// misconfigured means off) AND NODE_ENV is not literally 'production' (a
// hard interlock that survives the flag being left on in a prod .env by
// mistake). NODE_ENV alone can only veto the fixed OTP, never enable it -
// unlike the previous NODE_ENV-allowlist design, an incorrect/unset
// NODE_ENV value can't accidentally turn it on.
export function shouldUseFixedTestOtp(): boolean {
  return (
    process.env.ALLOW_FIXED_OTP === 'true' &&
    process.env.NODE_ENV !== 'production'
  );
}

export function generateOtp(): number {
  return shouldUseFixedTestOtp()
    ? 123456
    : Math.floor(100000 + Math.random() * 900000);
}
