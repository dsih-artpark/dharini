import 'package:design_system/design_system.dart';
import 'package:es_client/es_client.dart';
import 'package:es_platform_mobile/hooks/auth.dart';
import 'package:es_platform_mobile/hooks/tenant.dart';
import 'package:es_platform_mobile/services/database_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';

/// One screen listing every project the user belongs to, grouped under
/// workspace headers. A field collector cares about the project; the
/// workspace is a grouping label, not a decision they need to make — hence
/// one screen, not workspace-then-project.
///
/// Follows the app's "confirm on tap, no auto-advance" convention: tapping a
/// project row IS the confirmation. There is no separate "Continue" step, no
/// timer, no screen-bounce.
///
/// The route name (`/select-project`) and this class name are a contract
/// with the router wiring done elsewhere — do not rename either.
///
/// [next] is where to go once a project is chosen; defaults to home. The
/// post-login redirect from onboarding passes `/onboarding` so a
/// multi-project user still gets the welcome screen, location prompt and
/// initial sync that single-project users get.
class TenantPickerScreen extends HookWidget {
  const TenantPickerScreen({super.key, this.next});

  final String? next;

  @override
  Widget build(BuildContext context) {
    final projectsQuery = useAvailableProjects();
    final selectProject = useSelectProject();

    // Which project (if any) the user just tapped and is currently being
    // persisted. Used only to disable further taps and show a small inline
    // spinner on that one row while the choice is being confirmed.
    final selectingId = useState<String?>(null);

    Future<void> handleSelect(ProjectResponseDataExtended project) async {
      if (selectingId.value != null) return;
      selectingId.value = project.id;
      try {
        await selectProject(
          project: project,
          workspaceId: project.workspace?.id,
        );
        if (context.mounted) context.go(next ?? '/');
      } catch (e) {
        selectingId.value = null;
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Could not select project: $e')),
          );
        }
      }
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(56),
        child: HeaderNavigation(title: 'Select a project'),
      ),
      body: SafeArea(
        child: Builder(
          builder: (context) {
            if (projectsQuery.isLoading) {
              return const Center(child: CircularProgressIndicator());
            }

            if (projectsQuery.isError) {
              return _ErrorState(onRetry: projectsQuery.refetch);
            }

            final projects = projectsQuery.data ?? const [];
            if (projects.isEmpty) {
              return const _EmptyState();
            }

            final groups = _groupByWorkspace(projects);
            final isFlat = groups.length == 1 && groups.first.name == null;
            final pendingCounts = DatabaseService.pendingCountByProject();

            return ListView(
              padding: Spacing.p(4),
              children: isFlat
                  ? [
                      for (final project in groups.first.projects)
                        _ProjectTile(
                          project: project,
                          pendingCount: pendingCounts[project.id] ?? 0,
                          isSelecting: selectingId.value == project.id,
                          onTap: () => handleSelect(project),
                        ),
                    ]
                  : [
                      for (final group in groups) ...[
                        Padding(
                          padding: Spacing.pb(2),
                          child: Text(
                            '${(group.name ?? 'Other').toUpperCase()} · '
                            '${group.projects.length} '
                            '${group.projects.length == 1 ? 'project' : 'projects'}',
                            style: AppTypography.textTheme.labelLarge
                                ?.copyWith(color: AppColors.labletestgrey),
                          ),
                        ),
                        for (final project in group.projects)
                          _ProjectTile(
                            project: project,
                            pendingCount: pendingCounts[project.id] ?? 0,
                            isSelecting: selectingId.value == project.id,
                            onTap: () => handleSelect(project),
                          ),
                        SizedBox(height: Spacing.space(4)),
                      ],
                    ],
            );
          },
        ),
      ),
    );
  }
}

/// One workspace header and the projects under it. [name] is null for the
/// bucket of projects the server returned without a workspace.
class _WorkspaceGroup {
  _WorkspaceGroup(this.name);

  final String? name;
  final List<ProjectResponseDataExtended> projects = [];
}

int _byName(String a, String b) => a.toLowerCase().compareTo(b.toLowerCase());

/// Groups by workspace *id* (two workspaces can share a name), with
/// workspaces and the projects within each sorted by name, and the
/// no-workspace bucket last.
List<_WorkspaceGroup> _groupByWorkspace(
  List<ProjectResponseDataExtended> projects,
) {
  final byId = <String?, _WorkspaceGroup>{};
  for (final project in projects) {
    final workspace = project.workspace;
    byId
        .putIfAbsent(workspace?.id, () => _WorkspaceGroup(workspace?.name))
        .projects
        .add(project);
  }

  final groups = byId.values.toList()
    ..sort((a, b) {
      if (a.name == null) return b.name == null ? 0 : 1;
      if (b.name == null) return -1;
      return _byName(a.name!, b.name!);
    });
  for (final group in groups) {
    group.projects.sort((a, b) => _byName(a.name, b.name));
  }
  return groups;
}

class _ProjectTile extends StatelessWidget {
  const _ProjectTile({
    required this.project,
    required this.pendingCount,
    required this.isSelecting,
    required this.onTap,
  });

  final ProjectResponseDataExtended project;
  final int pendingCount;
  final bool isSelecting;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: Spacing.pb(2),
      child: Material(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(12),
        child: InkWell(
          borderRadius: BorderRadius.circular(12),
          onTap: isSelecting ? null : onTap,
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.borderLight),
            ),
            padding: Spacing.p(4),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        project.name,
                        style: AppTypography.textTheme.bodyLarge
                            ?.copyWith(color: AppColors.textStrong),
                      ),
                      SizedBox(height: Spacing.space(1)),
                      Text(
                        project.code,
                        style: AppTypography.textTheme.bodySmall
                            ?.copyWith(color: AppColors.labletestgrey),
                      ),
                    ],
                  ),
                ),
                if (pendingCount > 0) ...[
                  AppBadge.secondary(
                    child: Text('$pendingCount pending'),
                  ),
                  SizedBox(width: Spacing.space(2)),
                ],
                if (isSelecting)
                  const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                else
                  const Icon(Icons.chevron_right,
                      color: AppColors.iconSecondary),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  const _EmptyState();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: Spacing.p(6),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.folder_off_outlined,
                size: 48, color: AppColors.iconSecondary),
            SizedBox(height: Spacing.space(4)),
            Text(
              "You're not assigned to a project yet. Contact your "
              'administrator.',
              textAlign: TextAlign.center,
              style: AppTypography.textTheme.bodyMedium
                  ?.copyWith(color: AppColors.labletestgrey),
            ),
          ],
        ),
      ),
    );
  }
}

class _ErrorState extends StatelessWidget {
  const _ErrorState({required this.onRetry});

  final Future<void> Function() onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: Spacing.p(6),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              "Couldn't load your projects. Check your connection and try "
              'again.',
              textAlign: TextAlign.center,
              style: AppTypography.textTheme.bodyMedium
                  ?.copyWith(color: AppColors.labletestgrey),
            ),
            SizedBox(height: Spacing.space(4)),
            AppButton(
              variant: ButtonVariant.outline,
              onPressed: () => onRetry(),
              child: const Text('Retry'),
            ),
          ],
        ),
      ),
    );
  }
}
