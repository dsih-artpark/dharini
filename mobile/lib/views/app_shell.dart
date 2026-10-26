import 'package:design_system/design_system.dart';
import 'package:es_platform_mobile/domain/permissions.dart';
import 'package:es_platform_mobile/hooks/permissions.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:es_platform_mobile/hooks/auth.dart';
import 'package:es_platform_mobile/providers/connectivity_provider.dart';
import 'package:es_platform_mobile/utils/tenant_roles.dart';
import '../utils/extensions/go_router.dart';

class AppShell extends HookWidget {
  const AppShell({
    required this.child,
    super.key,
  });

  final Widget child;

  @override
  Widget build(BuildContext context) {
    final profile = useProfile();
    final projectId = useCurrentProjectId();
    final String currentLocation = GoRouter.of(context).location();
    final manager = usePermissionManager();
    bool canViewTeam = false;

    // Check if user has collector-admin role - improved check

    if (profile.data != null && profile.data!.roles.isNotEmpty) {
      canViewTeam = manager.can(UserAction.Read, Subject.TeamMember,
          resourceProjectId: projectId,
          resourceTeamId: teamIdForProject(profile.data, projectId));
      print('Current location: $currentLocation');
    }

    print('Is collector admin: $canViewTeam');

    // Post-login project gate: once the profile has loaded, if no project
    // resolves (useCurrentProjectId() is null — useProject()'s resolution
    // leaves it null when there is either no project or more than one), send
    // the user to the picker rather than leaving them stranded on whichever
    // shell route they landed on.
    //
    // Deliberately redirects for a ZERO-project user too. The picker owns the
    // "you're not assigned to a project yet, contact your administrator"
    // empty state; gating this on "has at least one project" made that state
    // unreachable and left those users on a shell route with no project and
    // no explanation. Waits for the list to load first so a slow fetch can't
    // be mistaken for "no projects".
    final availableProjects = useAvailableProjects();
    final projectsLoaded = availableProjects.data != null;

    useEffect(() {
      if (profile.data != null && projectId == null && projectsLoaded) {
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (context.mounted) {
            context.go('/select-project');
          }
        });
      }
      return null;
    }, [profile.data, projectId, projectsLoaded]);

    // Create navigation items conditionally
    final List<NavigationItem> navigationItems = <NavigationItem>[
      NavigationItem(
        label: 'Home',
        icon: const Icon(Icons.home_outlined, color: Colors.grey),
        onTap: () => context.go('/'),
      ),
      NavigationItem(
        label: 'Visits',
        icon: const Icon(Icons.assignment_outlined, color: Colors.grey),
        onTap: () => context.go('/visits', extra: {'from': 'home'}),
      ),
      NavigationItem(
        label: 'Sites',
        icon: const Icon(Icons.location_on_outlined, color: Colors.grey),
        onTap: () =>
            context.go('/sites', extra: {'showSuccessSnackbar': false}),
      ),

      // Conditionally add Team tab only for collector-admin
      if (canViewTeam)
        NavigationItem(
          label: 'Team',
          icon: const Icon(Icons.group_outlined, color: Colors.grey),
          onTap: () {
            // ScaffoldMessenger.of(context).showSnackBar(
            //   const SnackBar(
            //     content: Text('Coming Soon'),
            //     duration: Duration(seconds: 2),
            //   ),
            // );
            context.go('/team');
          },
        ),

      NavigationItem(
        label: 'Profile',
        icon: const Icon(Icons.person_outline, color: Colors.grey),
        onTap: () => context.go('/profile'),
      ),
    ];

    // Check if we should show bottom navigation
    final bool showBottomNav = !(currentLocation.startsWith('/site-details') ||
        currentLocation.startsWith('/edit-site') ||
        currentLocation.startsWith('/collection-details'));

    final isOnline = context.isOnline;

    return Scaffold(
      body: Stack(
        children: [
          child,
          AnimatedPositioned(
            duration: const Duration(milliseconds: 350),
            curve: Curves.easeInOutCubic,
            top: isOnline
                ? -100.0 // Guaranteed to be fully offscreen at the top when online
                : MediaQuery.of(context).padding.top + 8, // Slides down just below the safe area when offline
            left: 16,
            right: 16,
            child: Material(
              color: Colors.transparent,
              elevation: 6,
              shadowColor: Colors.black26,
              borderRadius: BorderRadius.circular(30),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                decoration: BoxDecoration(
                  color: AppColors.warningLight,
                  borderRadius: BorderRadius.circular(30),
                  border: Border.all(
                    color: AppColors.onWarningLight.withOpacity(0.4),
                    width: 1.2,
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(
                      Icons.cloud_off_rounded,
                      color: AppColors.onWarningLight,
                      size: 18,
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'You are working offline. Changes will sync when online.',
                        style: AppTypography.textTheme.bodySmall?.copyWith(
                          color: AppColors.onWarningLight,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: showBottomNav
          ? AppBottomNavBar(
              activeIndex:
                  _calculateSelectedIndex(currentLocation, canViewTeam),
              navigationItems: navigationItems,
            )
          : null,
    );
  }

  int _calculateSelectedIndex(String currentLocation, bool isCollectorAdmin) {
    // Create paths list based on whether Team tab is shown
    final List<String> paths;

    if (isCollectorAdmin) {
      paths = <String>[
        '',
        '/visits',
        '/sites',
        '/team',
        '/profile',
      ];
    } else {
      paths = <String>[
        '',
        '/visits',
        '/sites',
        '/profile',
      ];
    }

    // Check exact matches first
    final int exactIndex = paths.indexOf(currentLocation);
    if (exactIndex != -1) return exactIndex;

    // Check if location starts with any path (except /home)
    for (int i = 1; i < paths.length; i++) {
      if (currentLocation.startsWith('${paths[i]}/')) return i;
    }

    return 0; // Default to home
  }
}
