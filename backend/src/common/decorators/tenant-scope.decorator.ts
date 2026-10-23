import { SetMetadata } from '@nestjs/common';

/**
 * Tenant-scope opt-ins for `PoliciesGuard` / `AbilityFactory`.
 *
 * By default a route that resolves neither a `:projectId` nor a `:workspaceId`
 * is **denied**. Before this existed, such routes silently fell back to "grant
 * every permission the user holds anywhere", which is what let a workspace-A
 * admin act on workspace-B data through any route whose param wasn't literally
 * named `:projectId`.
 *
 * A route escapes that deny only by declaring *why* it has no tenant param.
 * Both decorators have the same runtime effect (the ability is built from the
 * union of the user's permissions); they differ in what they promise, so the
 * two cases can be audited separately with a grep.
 */

export const TENANT_AGNOSTIC_KEY = 'tenant_agnostic';
export const SERVICE_SCOPED_KEY = 'service_scoped';

/**
 * The route serves genuinely global reference data that belongs to no tenant
 * (diseases, regions, kits, locations, species, surveillance types, roles,
 * permissions). There is nothing to scope, so the permission union is the
 * correct and complete check.
 *
 * Do not use this on anything that reads project-owned rows.
 */
export const TenantAgnostic = () => SetMetadata(TENANT_AGNOSTIC_KEY, true);

/**
 * The route serves tenant-owned data but carries no tenant route param — the
 * acting user's own memberships decide what it returns. The ability layer
 * cannot help here, so **the service is responsible for filtering** by the
 * caller's accessible projects/workspaces (see
 * `common/functions/tenant-scope.ts`).
 *
 * `@param reason` a short note naming the service-side guarantee, so the
 * annotation is reviewable on its own.
 */
export const ServiceScoped = (reason: string) =>
  SetMetadata(SERVICE_SCOPED_KEY, reason || true);
