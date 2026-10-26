import { useAtomValue } from "jotai";
import { usePathname } from "next/navigation";
import { userAtom } from "@/src/store/userAtom";
import { currentWorkspaceAtom } from "@/src/store/currentWorkspaceAtom";
import {
  administersWorkspace,
  canInContext,
  isSystemRole,
  rolesForProject,
  rolesGrant,
  Scope,
} from "@/src/lib/authorization/role-matching";

const useRouteProjectId = () => {
  const pathname = usePathname();
  const match = pathname?.match(/^\/projects\/([^/]+)/);
  return match?.[1] ?? "";
};

/**
 * Resolve which project a permission check should be evaluated against.
 *
 * Precedence: an explicit id the caller already knows > the `/projects/:id`
 * route segment > `user.project` (a project/team-scoped member's one fixed
 * assignment - reliable, not a guess).
 *
 * Deliberately does NOT fall back to `user.projects?.[0]?.id`: a
 * multi-project user with no route/forced context has no "current" project,
 * and picking an arbitrary one from their list would silently evaluate
 * permissions against a project that isn't the one being acted on. Callers
 * rendering project-scoped UI outside a `/projects/:id` route must pass an
 * explicit project id (e.g. from the entity being acted on, or a page-level
 * project resolver) - see `useCurrentProjectResolver` for pages that already
 * track "which project is this page showing".
 */
const useResolveProjectId = () => {
  const user = useAtomValue(userAtom);
  const routeProjectId = useRouteProjectId();

  return (forcedProjectId?: string) =>
    forcedProjectId || routeProjectId || user?.project?.id || undefined;
};

/**
 * `(action, subject, forcedProjectId?, forcedTeamId?) => boolean`
 *
 * Evaluates the real backend cascade (system > project/team > workspace, see
 * `role-matching.ts`) against the resolved project and the current
 * workspace. When no project resolves, project/team roles can never match
 * (by construction of `matchRolesForContext`), so the check falls straight
 * through to workspace-scoped and system roles for `currentWorkspaceAtom` -
 * it never guesses a project to widen or narrow the answer.
 */
export const useHasPermission = () => {
  const user = useAtomValue(userAtom);
  const currentWorkspace = useAtomValue(currentWorkspaceAtom);
  const resolveProjectId = useResolveProjectId();

  return (
    action: string,
    subject: string,
    forcedProjectId?: string,
    forcedTeamId?: string,
  ) =>
    canInContext(user, action, subject, {
      projectId: resolveProjectId(forcedProjectId),
      workspaceId: currentWorkspace?.id,
      teamId: forcedTeamId,
    });
};

export const useIsSuperAdmin = () => {
  const user = useAtomValue(userAtom);
  return (user?.roles ?? []).some(isSystemRole);
};

// 4.3: distinguishes a workspace-admin from a super-admin so the "Admin" nav
// link (and anything else gated to "isSuperAdmin" that should really also
// include a workspace's own admin) can extend visibility accordingly.
//
// A7: scoped to currentWorkspaceAtom - an admin of workspace A must not get
// admin UI while viewing workspace B. Routed through the shared
// `administersWorkspace` predicate (role-matching.ts) rather than an inline
// name check, so it stays in step with the backend's definition of
// workspace adminship.
export const useIsWorkspaceAdmin = () => {
  const user = useAtomValue(userAtom);
  const currentWorkspace = useAtomValue(currentWorkspaceAtom);
  return administersWorkspace(user, currentWorkspace?.id);
};

/**
 * Can the user import data into at least one project in the current
 * workspace? Drives visibility of the "Upload" sidebar item only - the
 * /upload page does the exact per-project `create data-import` filtering.
 *
 * Deliberately not derived from `user.projects`: the profile only fills it
 * from project/team-scoped roles, so a workspace-admin (the primary
 * uploader) would always get an empty list. Checking the roles' own
 * permissions needs no project list and no extra request. It can
 * over-approximate (e.g. a project role in another workspace); the page's
 * empty state covers that.
 */
export const useCanUploadAnywhere = () => {
  const user = useAtomValue(userAtom);
  const currentWorkspace = useAtomValue(currentWorkspaceAtom);

  return (user?.roles ?? []).some((userRole) => {
    if (isSystemRole(userRole)) return true;
    const scope = userRole.role?.scope;
    const inContext =
      scope === Scope.Project ||
      scope === Scope.Team ||
      (scope === Scope.Workspace &&
        !!currentWorkspace?.id &&
        userRole.workspace?.id === currentWorkspace.id);
    return inContext && rolesGrant([userRole], "create", "data-import");
  });
};

/**
 * Richer permission API for new code. Prefer this over `useHasPermission`
 * when a component wants more than a single yes/no, e.g. listing the roles
 * that apply in a project, or checking a subject/action pair against a
 * specific project+team without relying on route inference.
 */
export const usePermissions = () => {
  const user = useAtomValue(userAtom);
  const currentWorkspace = useAtomValue(currentWorkspaceAtom);
  const resolveProjectId = useResolveProjectId();
  const isSuperAdmin = useIsSuperAdmin();
  const isWorkspaceAdmin = administersWorkspace(user, currentWorkspace?.id);

  const can = (
    action: string,
    subject: string,
    ctx?: { projectId?: string; teamId?: string },
  ) =>
    canInContext(user, action, subject, {
      projectId: resolveProjectId(ctx?.projectId),
      workspaceId: currentWorkspace?.id,
      teamId: ctx?.teamId,
    });

  const rolesInProject = (projectId?: string) =>
    rolesForProject(user, projectId);

  return { can, rolesInProject, isSuperAdmin, isWorkspaceAdmin };
};
