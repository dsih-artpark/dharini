import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

/**
 * Rate limit counted per logged-in user rather than per IP, so colleagues
 * behind one office IP don't share a limit. Runs after the global
 * JwtAuthGuard, which sets `req.user`; falls back to the IP without one.
 */
@Injectable()
export class MlThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    return req.user?.id ? `user:${req.user.id}` : req.ip;
  }
}
