import { redactForLog } from './redact-for-log';

describe('redactForLog', () => {
  it('redacts known-sensitive keys, case-insensitively', () => {
    const result = redactForLog({
      OTP: 123456,
      email: 'a@example.com',
      contactNumber: '9876543210',
      inviteToken: 'abc123',
      firstName: 'Anil',
    });

    expect(result).toEqual({
      OTP: '[REDACTED]',
      email: '[REDACTED]',
      contactNumber: '[REDACTED]',
      inviteToken: '[REDACTED]',
      firstName: 'Anil',
    });
  });

  it('redacts nested objects and arrays', () => {
    const result = redactForLog({
      invites: [
        { email: 'a@example.com', role: 'collector' },
        { email: 'b@example.com', role: 'lab-admin' },
      ],
    });

    expect(result).toEqual({
      invites: [
        { email: '[REDACTED]', role: 'collector' },
        { email: '[REDACTED]', role: 'lab-admin' },
      ],
    });
  });

  it('leaves primitives and non-sensitive fields untouched', () => {
    expect(redactForLog('hello')).toBe('hello');
    expect(redactForLog(42)).toBe(42);
    expect(redactForLog(null)).toBe(null);
    expect(redactForLog({ count: 3, projectId: 'p1' })).toEqual({
      count: 3,
      projectId: 'p1',
    });
  });
});
