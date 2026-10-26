import 'package:built_collection/built_collection.dart';
import 'package:es_client/es_client.dart';
import 'package:es_platform_mobile/utils/tenant_roles.dart';
import 'package:flutter_test/flutter_test.dart';

/// Mirrors `backend/src/common/authorization/role-matching.spec.ts`. When that
/// file's expectations change, these must change with it.

final _epoch = DateTime.utc(2026, 1, 1);

Permission _permission(String action, String subject) => Permission((b) => b
  ..id = '$action-$subject'
  ..action = action
  ..subject = subject
  ..createdAt = _epoch
  ..updatedAt = _epoch);

UserProfileResponseDataRole _role({
  required String scope,
  String name = 'a-role',
  List<Permission> permissions = const [],
}) =>
    UserProfileResponseDataRole((b) => b
      ..id = name
      ..name = name
      ..scope = scope
      ..type = 'predefined'
      ..status = UserProfileResponseDataRoleStatusEnum.active
      ..createdAt = _epoch
      ..updatedAt = _epoch
      ..permissions.replace(BuiltList<Permission>(permissions)));

UserProfileResponseDataUserRole _userRole({
  required String scope,
  String name = 'a-role',
  List<Permission> permissions = const [],
  String? project,
  String? team,
}) =>
    UserProfileResponseDataUserRole((b) => b
      ..id = '$name-${project ?? 'none'}'
      ..project = project
      ..team = team
      ..status = UserProfileResponseDataUserRoleStatusEnum.active
      ..role.replace(_role(scope: scope, name: name, permissions: permissions)));

UserProfileResponseData _profile(
        List<UserProfileResponseDataUserRole> roles) =>
    UserProfileResponseData((b) => b
      ..id = 'u1'
      ..roles.replace(BuiltList<UserProfileResponseDataUserRole>(roles)));

void main() {
  group('permissionSatisfies', () {
    test('treats manage as any action on that subject', () {
      expect(permissionSatisfies(_permission('manage', 'site'), 'delete', 'site'),
          isTrue);
    });

    test('treats manage-all as any action on any subject', () {
      expect(permissionSatisfies(_permission('manage', 'all'), 'delete', 'sample'),
          isTrue);
    });

    test('does not let read on one subject leak to another', () {
      expect(permissionSatisfies(_permission('read', 'site'), 'read', 'sample'),
          isFalse);
    });

    test('does not let read satisfy a write', () {
      expect(permissionSatisfies(_permission('read', 'site'), 'update', 'site'),
          isFalse);
    });
  });

  group('a user with a different role in each project', () {
    // The case mobile multi-tenancy exists for. Before this, the app assumed
    // one project per user and took `data.first`.
    final profile = _profile([
      _userRole(
          scope: 'project',
          name: 'project-admin',
          project: 'p-alpha',
          permissions: [_permission('manage', 'site')]),
      _userRole(
          scope: 'project',
          name: 'project-viewer',
          project: 'p-beta',
          permissions: [_permission('read', 'site')]),
    ]);

    test('applies only the role belonging to the project being acted on', () {
      expect(canInContext(profile, 'delete', 'site', projectId: 'p-alpha'), isTrue);
      expect(canInContext(profile, 'delete', 'site', projectId: 'p-beta'), isFalse);
      expect(canInContext(profile, 'read', 'site', projectId: 'p-beta'), isTrue);
    });

    test('grants nothing for a project the user holds no role in', () {
      expect(canInContext(profile, 'read', 'site', projectId: 'p-gamma'), isFalse);
    });

    test('grants nothing when no project is named', () {
      expect(canInContext(profile, 'read', 'site'), isFalse);
    });

    test('rolesForProject returns only that project\'s roles', () {
      expect(rolesForProject(profile, 'p-alpha').map((r) => r.role?.name),
          ['project-admin']);
      expect(rolesForProject(profile, null), isEmpty);
    });
  });

  group('teamIdForProject', () {
    final profile = _profile([
      _userRole(scope: 'team', name: 'collector', project: 'p1', team: 't1'),
      _userRole(scope: 'team', name: 'lab-member', project: 'p2', team: 't2'),
      _userRole(scope: 'workspace', name: 'workspace-admin'),
    ]);

    test('resolves the team the user holds within that project', () {
      expect(teamIdForProject(profile, 'p1'), 't1');
      expect(teamIdForProject(profile, 'p2'), 't2');
    });

    test('returns null for a project the user has no team role in', () {
      // A workspace-admin has no team at all. `profile.team` (the legacy
      // singular column) was null for exactly these users, which is what
      // crashed the screens that dereferenced it.
      expect(teamIdForProject(profile, 'p3'), isNull);
      expect(teamIdForProject(profile, null), isNull);
    });
  });

  group('scope precedence', () {
    test('system scope ignores project context entirely', () {
      final superAdmin = _profile([
        _userRole(
            scope: 'system',
            name: 'super-admin',
            permissions: [_permission('manage', 'all')]),
      ]);

      expect(canInContext(superAdmin, 'delete', 'sample', projectId: 'anything'),
          isTrue);
      expect(isSuperAdmin(superAdmin), isTrue);
    });

    test('a workspace role never widens a narrower project role', () {
      final both = _profile([
        _userRole(
            scope: 'project',
            project: 'p1',
            permissions: [_permission('read', 'visit')]),
        _userRole(
            scope: 'workspace',
            name: 'workspace-admin',
            permissions: [_permission('manage', 'visit')]),
      ]);

      expect(canInContext(both, 'read', 'visit', projectId: 'p1', workspaceId: 'w1'),
          isTrue);
      expect(
          canInContext(both, 'delete', 'visit', projectId: 'p1', workspaceId: 'w1'),
          isFalse);
    });

    test('a workspace role does not apply with no workspace in context', () {
      // Workspace roles carry no project id. Treating that as "every project"
      // is how an admin of one workspace gets rights over another's projects.
      final admin = _profile([
        _userRole(
            scope: 'workspace',
            name: 'workspace-admin',
            permissions: [_permission('manage', 'project')]),
      ]);

      expect(canInContext(admin, 'create', 'project', projectId: 'p-somewhere'),
          isFalse);
      expect(canInContext(admin, 'create', 'project', workspaceId: 'w1'), isTrue);
    });
  });
}
