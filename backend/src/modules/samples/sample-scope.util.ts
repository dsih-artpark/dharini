/**
 * Sentinel projectId used by super-admins to request lab data across every
 * project at once (instead of a single project UUID).
 */
export const ALL_PROJECTS = 'all';

/**
 * Whether a samples query should be constrained to a single project.
 *
 * Returns false for the "all" sentinel and for missing ids, in which case the
 * caller must NOT add a project predicate. Skipping the predicate is only ever
 * reached for System-scope (super-admin) users; team-scoped users are filtered
 * by team regardless, so this can never widen their access.
 */
export function shouldScopeToProject(projectId?: string | null): boolean {
  return !!projectId && projectId !== ALL_PROJECTS;
}
