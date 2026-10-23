import 'package:es_client/es_client.dart';

/// Client-side mirror of the backend's role cascade.
///
/// The authority is `backend/src/common/authorization/role-matching.ts`; this
/// file exists so the app can decide what to *show* without a round trip, and
/// it must stay in step with that file. The server remains the enforcement
/// point — anything here is presentation only.
///
/// A user belongs to many projects and holds a DIFFERENT role in each, so every
/// question here takes the project it is being asked about. There is
/// deliberately no "the user's role" accessor: that concept does not exist in a
/// multi-tenant model, and the singular `user.team` / `user.project` fields it
/// used to come from are being retired.

/// CASL semantics, defined once: `manage` means any action, `all` any subject.
bool permissionSatisfies(Permission permission, String action, String subject) {
  if (permission.action == 'manage' && permission.subject == 'all') return true;
  if (permission.subject != subject && permission.subject != 'all') return false;
  return permission.action == action || permission.action == 'manage';
}

bool _isSystem(UserProfileResponseDataUserRole userRole) =>
    userRole.role?.scope == 'system';

/// Every role the user holds *in this specific project*.
List<UserProfileResponseDataUserRole> rolesForProject(
  UserProfileResponseData? profile,
  String? projectId,
) {
  if (profile == null || projectId == null) return const [];
  return profile.roles.where((r) => r.project == projectId).toList();
}

/// The team this user belongs to *within this project*.
///
/// Replaces `profile.team?.id`, which is the legacy singular column: it is null
/// for workspace admins and for anyone who signed themselves up, and it names
/// an arbitrary one of a multi-project user's teams.
String? teamIdForProject(
  UserProfileResponseData? profile,
  String? projectId,
) {
  for (final role in rolesForProject(profile, projectId)) {
    if (role.team != null) return role.team;
  }
  return null;
}

/// Which roles actually apply in a given tenant context.
///
/// Precedence, matching the backend exactly:
///   1. System scope       — unrestricted, context ignored.
///   2. Project/Team roles — must name this project, and this team when one
///                           is being asked about.
///   3. Workspace roles    — only when no project-level role matched, so a
///                           narrower project role is never widened by a
///                           workspace role the user also holds.
List<UserProfileResponseDataUserRole> matchRolesForContext(
  UserProfileResponseData? profile, {
  String? projectId,
  String? workspaceId,
  String? teamId,
}) {
  final all = profile?.roles.toList() ?? const <UserProfileResponseDataUserRole>[];

  final system = all.where(_isSystem).toList();
  if (system.isNotEmpty) return system;

  final projectRoles = all.where((r) {
    final scope = r.role?.scope;
    return (scope == 'project' || scope == 'team') &&
        projectId != null &&
        r.project == projectId &&
        (teamId == null || r.team == teamId);
  }).toList();

  if (projectRoles.isNotEmpty) return projectRoles;

  // Workspace roles carry no project id. Without a workspace to match against
  // they must NOT be treated as applying everywhere — that is precisely how an
  // admin of one workspace ends up with rights over another's projects.
  if (workspaceId == null) return const [];

  // LIMITATION: the generated `UserProfileResponseDataUserRole` has no
  // `workspace` field yet, so this cannot compare workspace ids the way the
  // backend does — it can only tell that the role is workspace-scoped. For a
  // user who administers exactly one workspace that is equivalent; for one who
  // administers several it is too permissive *for display purposes only*
  // (the server still enforces the real check).
  //
  // The backend now returns `workspace: {id, name}` on profile role rows.
  // Once es_client is regenerated (`mobile/scripts/gen-client.sh`), tighten
  // this to `r.workspace?.id == workspaceId` and delete this note.
  return all
      .where((r) => r.role?.scope == 'workspace' && r.project == null)
      .toList();
}

/// Can this user take `action` on `subject` in this context?
bool canInContext(
  UserProfileResponseData? profile,
  String action,
  String subject, {
  String? projectId,
  String? workspaceId,
  String? teamId,
}) {
  final matched = matchRolesForContext(
    profile,
    projectId: projectId,
    workspaceId: workspaceId,
    teamId: teamId,
  );
  if (matched.any(_isSystem)) return true;

  return matched.any(
    (userRole) => (userRole.role?.permissions ?? const <Permission>[])
        .any((permission) => permissionSatisfies(permission, action, subject)),
  );
}

bool isSuperAdmin(UserProfileResponseData? profile) =>
    (profile?.roles ?? const <UserProfileResponseDataUserRole>[]).any(_isSystem);
