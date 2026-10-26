import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RedisCacheService } from '../cache/redis-cache.service';

const OTP_ATTEMPT_PREFIX = 'otp-attempts:';
const OTP_MAX_ATTEMPTS = 5;
const OTP_ATTEMPT_WINDOW_SECONDS = 15 * 60;

/**
 * Per-contact OTP verification brute-force guard, shared by every OTP
 * verification path (previously private to OtpService, and only applied to
 * one of the two verification flows). A 6-digit OTP with a short lifetime is
 * ~1M guesses; unlimited attempts makes that trivially brute-forceable
 * within the window. Cap attempts per contact rather than relying on IP
 * throttling alone - an attacker can rotate IPs but not the victim's
 * email/phone.
 */
@Injectable()
export class OtpAttemptGuardService {
  constructor(private readonly cacheService: RedisCacheService) {}

  /**
   * Key the attempt counter on whichever contact was supplied, so a caller
   * can't reset their own budget by alternating email and phone.
   */
  key(contact: { email?: string; phone?: string }): string {
    const identifier = String(contact.email ?? contact.phone ?? '')
      .toLowerCase()
      .trim();
    return `${OTP_ATTEMPT_PREFIX}${identifier}`;
  }

  /**
   * Throws once the attempt budget is exhausted for this key. Fails OPEN if
   * Redis is unreachable - RedisCacheService swallows connection errors and
   * reports a miss. Locking every user out because the cache is down would
   * be the worse failure.
   */
  async assertAttemptsRemaining(key: string): Promise<number> {
    const attempts = (await this.cacheService.get<number>(key)) ?? 0;
    if (attempts >= OTP_MAX_ATTEMPTS) {
      throw new HttpException(
        'Too many incorrect OTP attempts. Please request a new code.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    return attempts;
  }

  async recordFailedAttempt(key: string, attempts: number): Promise<void> {
    await this.cacheService.set(key, attempts + 1, OTP_ATTEMPT_WINDOW_SECONDS);
  }

  async clear(key: string): Promise<void> {
    await this.cacheService.del(key);
  }
}
