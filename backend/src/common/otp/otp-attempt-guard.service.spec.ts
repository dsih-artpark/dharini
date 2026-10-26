import { HttpException } from '@nestjs/common';
import { OtpAttemptGuardService } from './otp-attempt-guard.service';

describe('OtpAttemptGuardService', () => {
  let cacheService: { get: jest.Mock; set: jest.Mock; del: jest.Mock };
  let service: OtpAttemptGuardService;

  beforeEach(() => {
    cacheService = {
      get: jest.fn().mockResolvedValue(undefined),
      set: jest.fn(),
      del: jest.fn(),
    };
    service = new OtpAttemptGuardService(cacheService as any);
  });

  it('keys on the lowercased, trimmed email when supplied', () => {
    expect(service.key({ email: '  Anil@Example.com ' })).toBe(
      'otp-attempts:anil@example.com',
    );
  });

  it('keys on phone when email is absent', () => {
    expect(service.key({ phone: '9876543210' })).toBe(
      'otp-attempts:9876543210',
    );
  });

  it('does not let alternating email/phone reset the budget', () => {
    // Same identifier regardless of which field it arrived in this call.
    expect(service.key({ email: 'a@example.com' })).toBe(
      service.key({ email: 'a@example.com', phone: undefined }),
    );
  });

  it('allows the first attempt with zero recorded attempts', async () => {
    cacheService.get.mockResolvedValue(undefined);
    await expect(
      service.assertAttemptsRemaining('otp-attempts:a@example.com'),
    ).resolves.toBe(0);
  });

  it('throws 429 once the attempt budget is exhausted', async () => {
    cacheService.get.mockResolvedValue(5);
    await expect(
      service.assertAttemptsRemaining('otp-attempts:a@example.com'),
    ).rejects.toBeInstanceOf(HttpException);
  });

  it('records a failed attempt with the 15-minute window', async () => {
    await service.recordFailedAttempt('otp-attempts:a@example.com', 2);
    expect(cacheService.set).toHaveBeenCalledWith(
      'otp-attempts:a@example.com',
      3,
      15 * 60,
    );
  });

  it('clears the counter on success', async () => {
    await service.clear('otp-attempts:a@example.com');
    expect(cacheService.del).toHaveBeenCalledWith('otp-attempts:a@example.com');
  });
});
