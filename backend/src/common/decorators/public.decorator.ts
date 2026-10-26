import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Opts a route (or a whole controller) out of the global `JwtAuthGuard`
 * registered as `APP_GUARD` in `AppModule`. Every other route requires a
 * valid JWT by default.
 *
 * This only skips authentication. It does not make a route public if the
 * route is also behind `PoliciesGuard`: that guard still rejects a request
 * with no `req.user`, so the combination fails closed with a 403.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
