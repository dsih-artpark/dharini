import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory } from '../casl/abitlity.factory';
import {
  CHECK_POLICIES_KEY,
  PolicyHandlerCallback,
} from '../decorators/check-policy.decorator';
import {
  SERVICE_SCOPED_KEY,
  TENANT_AGNOSTIC_KEY,
} from '../decorators/tenant-scope.decorator';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // getAllAndOverride, not get(handler): a controller may declare one
    // policy for all of its routes (e.g. a reference-data controller where
    // every route needs the same check), and a method-level @CheckPolicies
    // then overrides it. Reading only the handler silently ignored the
    // class-level form, which - now that a missing policy is fatal - would
    // turn it into a 403 on every route of such a controller.
    const handlers =
      this.reflector.getAllAndOverride<PolicyHandlerCallback[]>(
        CHECK_POLICIES_KEY,
        [context.getHandler(), context.getClass()],
      ) || [];
    const req = context.switchToHttp().getRequest();

    if (!req.user || Object.keys(req.user).length === 0)
      throw new ForbiddenException('User not authenticated');

    // Method-level metadata wins over the controller's, so a mixed controller
    // (mostly reference data, one tenant-scoped route) can annotate per route.
    const tenantAgnostic = this.reflector.getAllAndOverride<boolean>(
      TENANT_AGNOSTIC_KEY,
      [context.getHandler(), context.getClass()],
    );
    const serviceScoped = this.reflector.getAllAndOverride<string | boolean>(
      SERVICE_SCOPED_KEY,
      [context.getHandler(), context.getClass()],
    );

    const ability = await this.abilityFactory.defineAbility(req, {
      tenantAgnostic: !!tenantAgnostic,
      serviceScoped: !!serviceScoped,
    });

    // A route with no @CheckPolicies at all used to pass unconditionally,
    // because `[].every(...)` is true. Treat that as a mistake rather than as
    // "public": any route behind this guard must state what it requires.
    if (!handlers.length)
      throw new ForbiddenException(
        'Route is guarded but declares no policy; add @CheckPolicies.',
      );

    return handlers.every((handler) => handler(ability, req));
  }
}
