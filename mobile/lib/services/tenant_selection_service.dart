import 'package:hive/hive.dart';

/// Which workspace and project the user is currently working in.
///
/// Persisted in its own Hive box rather than in `apiCache`, because that box is
/// cleared on logout and whenever cached responses are invalidated — the
/// selection has to outlive both. Opened lazily, like `ApiCache`, so it does
/// not depend on `DatabaseService.initialize()` having run first.
///
/// The selection is a *hint*, never an authority: it is always validated
/// against the project list the server actually returns before being used to
/// scope anything (see `useProject`). A user removed from a project must not
/// keep scoping queries by its id just because it is still on disk — that is
/// the mobile equivalent of the web's cross-workspace contamination bug.
class TenantSelectionService {
  static const String _boxName = 'tenantSelection';
  static const String _projectKey = 'selectedProjectId';
  static const String _workspaceKey = 'selectedWorkspaceId';

  static Future<Box> _box() => Hive.openBox(_boxName);

  static Future<String?> getSelectedProjectId() async =>
      (await _box()).get(_projectKey) as String?;

  static Future<String?> getSelectedWorkspaceId() async =>
      (await _box()).get(_workspaceKey) as String?;

  /// Record the user's choice. `workspaceId` may be null on app versions
  /// talking to a backend that does not yet return a project's workspace.
  static Future<void> select({
    required String projectId,
    String? workspaceId,
  }) async {
    final box = await _box();
    await box.put(_projectKey, projectId);
    if (workspaceId == null) {
      await box.delete(_workspaceKey);
    } else {
      await box.put(_workspaceKey, workspaceId);
    }
  }

  /// Forget the selection — on logout, or when the selected project is no
  /// longer one the user can reach.
  static Future<void> clear() async {
    final box = await _box();
    await box.delete(_projectKey);
    await box.delete(_workspaceKey);
  }
}
