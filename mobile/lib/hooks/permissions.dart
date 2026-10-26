import 'package:es_platform_mobile/domain/permissions.dart';
import 'package:es_platform_mobile/hooks/auth.dart';
import 'package:es_platform_mobile/utils/permission_manager.dart';
import 'package:flutter_hooks/flutter_hooks.dart';

/// Hook to get an instance of [PermissionManager] based on the current user profile.
///
/// The instance is memoized and only recreated if the profile data changes.
PermissionManager usePermissionManager() {
  final profile = useProfile();

  // Memoize the PermissionManager instance
  final manager = useMemoized(
    () => PermissionManager(profile.data),
    [profile.data], // Re-run memoization only when profile data changes
  );

  return manager;
}

/// Convenience hook to check if the current user has a specific permission.
///
/// Returns `true` if the user has the permission, `false` otherwise.
/// Handles loading/error states of the profile by returning `false`.
bool useHasPermission(UserAction action, Subject subject) {
  final manager = usePermissionManager();
  return manager.can(action, subject);
}
