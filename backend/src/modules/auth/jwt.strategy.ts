import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../users/users.service';
import { RedisCacheService } from '../../common/cache/redis-cache.service';
import { CacheKeys } from '../../common/cache/cache-keys';

const USER_AUTH_CACHE_TTL_SECONDS = 60;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly userService: UserService,
    private readonly cacheService: RedisCacheService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const cacheKey = CacheKeys.userAuth(payload.subject);
    const cached =
      await this.cacheService.get<Record<string, unknown>>(cacheKey);
    if (cached) return cached;

    const user = await this.userService.findOne({ id: payload.subject });
    const result = { ...user };
    await this.cacheService.set(cacheKey, result, USER_AUTH_CACHE_TTL_SECONDS);
    return result;
  }
}
