import 'package:es_client/es_client.dart';
import 'package:fquery/fquery.dart';

import '../services/tenant_selection_service.dart';
import 'auth.dart';

/// Persists the user's project (and workspace, when known) choice and makes
/// sure every project-scoped query picks it up.
///
/// `QueryKeys` are already project-namespaced — `sites(projectId)`,
/// `visits(projectId)`, `collectors(projectId)`, `teamMembers(projectId)`,
/// ... — so switching project naturally lands on different cache keys for
/// all of that data; there is nothing to invalidate there, and doing so
/// would be an invalidation storm for no benefit. The one key that is NOT
/// project-namespaced is `QueryKeys.projects` itself — it holds the
/// *resolved current project* — so that is the only thing this updates.
/// It's seeded with the chosen project directly rather than invalidated: the
/// picker already has the object the server returned, and a refetch would
/// leave the previous [NoProjectSelectedException] visible until it lands,
/// which a screen gating on that error would misread. Once seeded,
/// `useCurrentProjectId()` (the single choke point `useSite`/`useVisits`/etc.
/// all depend on) picks up the new id, and every project-scoped hook
/// downstream naturally starts reading/writing under the new project's cache
/// keys.
typedef SelectProject = Future<void> Function({
  required ProjectResponseDataExtended project,
  String? workspaceId,
});

SelectProject useSelectProject() {
  final queryClient = useQueryClient();

  return ({
    required ProjectResponseDataExtended project,
    String? workspaceId,
  }) async {
    await TenantSelectionService.select(
      projectId: project.id,
      workspaceId: workspaceId,
    );
    queryClient.setQueryData<ProjectResponseDataExtended>(
      QueryKeys.projects,
      (_) => project,
    );
  };
}
