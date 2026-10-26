export const USER_AUTH_CACHE_PREFIX = 'user-auth:';
export const PROJECT_MEMBERS_CACHE_PREFIX = 'project-members:';
/**
 * Which workspace owns a project. Read by AbilityFactory on every
 * authenticated request carrying a :projectId, so it must be invalidated
 * whenever a project is created, deleted, or moved between workspaces.
 */
export const PROJECT_TENANT_CACHE_PREFIX = 'project-tenant:';

export const CacheKeys = {
  userAuth: (userId: string) => `${USER_AUTH_CACHE_PREFIX}${userId}`,
  projectMembers: (projectId: string) =>
    `${PROJECT_MEMBERS_CACHE_PREFIX}${projectId}`,
  projectTenant: (projectId: string) =>
    `${PROJECT_TENANT_CACHE_PREFIX}${projectId}`,
};
