import { SetMetadata } from '@nestjs/common';
import { AppAbility } from '../casl/abitlity.factory';

export type PolicyHandlerCallback = (ability: AppAbility, req?: any) => boolean;

export const CHECK_POLICIES_KEY = 'check_policies';
export const CheckPolicies = (
  ...handlers: ((ability: AppAbility, req: any) => boolean)[]
) => SetMetadata(CHECK_POLICIES_KEY, handlers);

/**
 * Explicitly requires nothing beyond a valid JWT.
 *
 * `PoliciesGuard` now rejects any route it guards that declares no policy at
 * all, because "no handler" used to mean "everyone passes" by accident. Use
 * this where that really is the intent — typically read-only global reference
 * lists that no seeded role holds a dedicated permission for — so the decision
 * is visible and greppable instead of implied by an omission.
 */
export const AnyAuthenticated: PolicyHandlerCallback = () => true;
