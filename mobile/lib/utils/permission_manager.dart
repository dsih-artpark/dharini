import 'package:es_client/es_client.dart';
import 'package:es_platform_mobile/domain/permissions.dart';

/// Manages permission checks based on user profile data.
class PermissionManager {
  final UserProfileResponseData? profileData;
  // Removed pre-calculated set, as scope checks require iterating through roles
  // final Set<String> _effectivePermissions = {};

  PermissionManager(this.profileData) {
    // _extractPermissions(); // No longer needed
  }

  // Removed _extractPermissions as logic moved to can()

  /// Checks if the user has the specified permission, optionally checking against resource scope.
  ///
  /// - action: The action being performed (e.g., Action.Update).
  /// - subject: The type of resource being acted upon (e.g., Subject.Site).
  /// - resourceTeamId: The ID of the team the specific resource belongs to.
  /// - resourceProjectId: The ID of the project the specific resource belongs to.
  ///
  /// Returns `true` if the user has the permission considering roles, actions, subjects, wildcards, and scope.
  bool can(UserAction action, Subject subject,
      {String? resourceTeamId, String? resourceProjectId}) {
    // No profile or no roles? No permission.
    if (profileData?.roles == null || profileData!.roles.isEmpty) {
      print("Permission check failed: No profile data or roles.");
      return false;
    }

    for (final userRole in profileData!.roles) {
      // --- Basic Role Checks ---
      if (userRole.status != UserProfileResponseDataUserRoleStatusEnum.active) {
        // print("Skipping inactive userRole link: ${userRole.id}");
        continue; // Skip inactive role assignments
      }
      if (userRole.role == null) {
        // print("Skipping userRole with null role definition: ${userRole.id}");
        continue; // Skip if role definition is missing
      }
      final UserProfileResponseDataRole definedRole = userRole.role!;
      if (definedRole.status != UserProfileResponseDataRoleStatusEnum.active) {
        // print("Skipping inactive role definition: ${definedRole.id} (${definedRole.name})");
        continue; // Skip inactive role definitions
      }
      if (definedRole.permissions.isEmpty) {
        // print("Skipping role with no permissions: ${definedRole.id} (${definedRole.name})");
        continue; // Skip roles with no permissions defined
      }
      // ------------------------

      // --- Get Context for this Role ---
      final String roleItselfScope = definedRole.scope;
      final String roleContextTeamId = userRole.team ?? '';
      final String roleContextProjectId = userRole.project ?? '';
      // ----------------------------------

      for (final Permission perm in definedRole.permissions) {
        final String? permActionStr = perm.action;
        final String? permSubjectStr = perm.subject;
        final String? permItselfScope = perm.scope;

        if (permActionStr == null || permSubjectStr == null) {
          // print("Skipping invalid permission entry (null action/subject): ${perm.id}");
          continue; // Skip invalid permission entries
        }

        // 1. Check if this permission grants the basic action/subject ability
        bool actionSubjectMatch = _checkActionSubjectMatch(
            requestedAction: action,
            requestedSubject: subject,
            permissionActionStr: permActionStr,
            permissionSubjectStr: permSubjectStr);

        if (actionSubjectMatch) {
          // 2. Basic permission granted, now check scope
          // Effective scope: Permission's own scope takes precedence, fallback to Role's scope.
          final String effectiveScope = permItselfScope ?? roleItselfScope;
          // print("Match found: ${permActionStr}:${permSubjectStr}. Effective Scope: $effectiveScope (Perm Scope: ${permItselfScope}, Role Scope: ${roleItselfScope})");

          if (effectiveScope == 'team') {
            // Permission requires team scope match.
            if (resourceTeamId == null) {
              // Let's be strict: if scope is team, resourceTeamId MUST be provided and match.
              continue; // Check next permission or role
            }
            if (resourceTeamId == roleContextTeamId) {
              return true; // Correct team context for this permission
            }
            // print("Scope mismatch (Team): Resource Team: $resourceTeamId != Role Context Team: $roleContextTeamId");
          } else if (effectiveScope == 'project') {
            // Permission requires project scope match.
            if (resourceProjectId == null) {
              continue; // Strict check
            }
            if (resourceProjectId == roleContextProjectId) {
              return true; // Correct project context
            }
            // print("Scope mismatch (Project): Resource Project: $resourceProjectId != Role Context Project: $roleContextProjectId");
          } else {
            // No specific scope (global?) or unhandled scope.
            // Grant based on action/subject match alone.
            print(
                "Permission GRANTED (Non-Team/Project Scope or No Scope): Action: ${action.value}, Subject: ${subject.value}, Effective Scope: $effectiveScope");
            return true;
          }
        } // end if actionSubjectMatch
      } // end loop permissions
    } // end loop roles

    // If no matching permission with valid scope found across all roles
    print(
        "Permission DENIED: Action: ${action.value}, Subject: ${subject.value}, Resource Team: $resourceTeamId, Resource Project: $resourceProjectId. No matching permission/scope found.");
    return false;
  }

  /// Helper method for simpler checks, often used with Visibility or disabling widgets.
  bool cannot(UserAction action, Subject subject,
      {String? resourceTeamId, String? resourceProjectId}) {
    return !can(action, subject,
        resourceTeamId: resourceTeamId, resourceProjectId: resourceProjectId);
  }

  // Helper for action/subject matching including wildcards
  bool _checkActionSubjectMatch(
      {required UserAction requestedAction,
      required Subject requestedSubject,
      required String permissionActionStr,
      required String permissionSubjectStr}) {
    final UserAction? pAction = UserAction.fromString(permissionActionStr);
    final Subject? pSubject = Subject.fromString(permissionSubjectStr);

    if (pAction == null || pSubject == null)
      return false; // Unknown permission action/subject from API

    // 1. Exact match
    if (pAction == requestedAction && pSubject == requestedSubject) return true;
    // 2. Manage action on specific subject
    if (pAction == UserAction.Manage && pSubject == requestedSubject)
      return true;
    // 3. Specific action on 'all' subject
    if (pAction == requestedAction && pSubject == Subject.All) return true;
    // 4. Manage action on 'all' subject
    if (pAction == UserAction.Manage && pSubject == Subject.All) return true;

    return false;
  }
}
