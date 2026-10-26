// ignore_for_file: deprecated_member_use, unused_element

import 'package:dartx/dartx.dart';
import 'package:design_system/design_system.dart';
import 'package:es_platform_mobile/domain/extensions/model_extension.dart';
import 'package:es_platform_mobile/domain/permissions.dart';
import 'package:es_platform_mobile/hooks/api.dart';
import 'package:es_platform_mobile/hooks/auth.dart';
import 'package:es_platform_mobile/hooks/permissions.dart';
import 'package:es_platform_mobile/hooks/species.dart';
import 'package:es_platform_mobile/hooks/visit_drafts.dart';
import 'package:es_platform_mobile/providers/connectivity_provider.dart';
import 'package:es_platform_mobile/providers/sync_service_provider.dart';
import 'package:es_platform_mobile/services/database_service.dart';
import 'package:es_platform_mobile/services/sync_service.dart';
import 'package:es_platform_mobile/utils/tenant_roles.dart';
import 'package:es_platform_mobile/views/home/admin_activity_overview.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:fquery/fquery.dart';
import 'package:go_router/go_router.dart';
import 'package:hive_flutter/hive_flutter.dart';

import '../../utils/configs/constants.dart';
import '../../widgets/network_status_indicator.dart';
import 'action_card.dart';
import 'past_visit_card.dart';
import 'package:es_platform_mobile/widgets/visit_card.dart';

class Home extends HookWidget {
  const Home({super.key});

  @override
  Widget build(BuildContext context) {
    final project = useProject();
    final profile = useProfile();
    final isSyncing = useState(false);
    final queryClient = useQueryClient();

    final sites = useSites();
    final api = useEsApiClient();
    final projectId = useCurrentProjectId();
    useRegions('state');
    useCacheAllDistricts();
    useSampleType();
    useSpecies();
    final manager = usePermissionManager();

    useEffect(() {
      if (projectId != null) {
        print('[Home] Invalidating site queries for project: $projectId');
        queryClient.invalidateQueries(QueryKeys.sites(projectId));
      }
      return null;
    }, [projectId]);

    useEffect(() {
      if (sites.isSuccess && sites.data != null && sites.data!.isNotEmpty) {
        print('[Home] Syncing fresh site data to Hive...');
        syncNetworkSitesToHive(sites.data!);
      }
      return null;
    }, [sites.data]);

    final hasTokenChecked = useState(false);

    useEffect(() {
      () async {
        try {
          // Validate or refresh token BEFORE any API call (e.g. useSites, sync)
          await api.getAuthApi(); // Implement this in your auth service
          print('[Auth] Token is valid or refreshed.');
        } catch (e) {
          print('[Auth] ❌ Failed to ensure token: $e');
        } finally {
          hasTokenChecked.value = true;
        }
      }();
      return null;
    }, []);

    Future<void> refreshSitesData() async {
      if (sites.isSuccess) {
        print('[Home] Refreshing sites data and syncing to Hive...');
        await syncNetworkSitesToHive(sites.data!);
      } else {
        print('[Home] ⚠️ Cannot sync to Hive: Sites data not ready');
      }
    }

    final syncMessage = useState<String?>(null);

    Future<void> handleSync() async {
      print('[Sync] Starting syncChangesToServerQueue...');
      isSyncing.value = true;
      syncMessage.value = null;

      try {
        if (projectId == null || projectId.isEmpty) {
          throw Exception('Cannot sync: Missing projectId');
        }

        // Step 1: Sync local changes
        await syncChangesToServerQueue(api, projectId);
        print('[Sync] Local changes synced successfully.');
        syncMessage.value = 'Local changes synced successfully';
      } catch (e) {
        print('[Sync] Failed to sync changes: $e');
        syncMessage.value = 'Failed to sync changes: $e';
      } finally {
        isSyncing.value = false;
      }
    }

    useEffect(() {
      print('[Home] useEffect triggered with projectId: $projectId');
      if (projectId != null && !isSyncing.value) {
        handleSync();
      }
      return null;
    }, [projectId]);

    final canCreateVisits = manager.can(UserAction.Create, Subject.Visit,
        resourceProjectId: project.data?.id,
        resourceTeamId: teamIdForProject(profile.data, project.data?.id));
    final siteCards = sites.data
            ?.where(
                (e) => e.createdAt.isAfter(DateTime.now() - Duration(days: 7)))
            .map((s) {
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: ActionCard(
              farmName: s.name,
              location: [
                s.location?.region?.name,
                s.farmType,
              ].where((p) => p != null && p.isNotEmpty).join(" | "),
              isNew: true,
            ),
          );
        }).toList() ??
        [];

    // 1. Listen to sync status
    final syncService = context.syncService;
    final syncStatus =
        useStream(syncService.syncStatus, initialData: SyncStatus.idle);

    // 2. Use global real-time connectivity state from ConnectivityProvider.
    final isOnline = context.isOnline;

    // 3. Listen to pending submissions
    final pendingCount = useState<int>(0);

    Future<void> checkPending() async {
      final pending = await DatabaseService.getSubmissionsToUpload();
      pendingCount.value = pending.length;
      print('pendingCount: \\${pendingCount.value}');
    }

    useEffect(() {
      if (isOnline) {
        print('[Network] Came online, triggering sync...');
        syncService.sync();
      }
      checkPending();
      return null;
    }, [isOnline]);

    // Update pending count when sync completes or errors, and show snackbar notification
    useEffect(() {
      if (syncStatus.data == SyncStatus.completed) {
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (context.mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Sync completed successfully'),
                backgroundColor: Colors.green,
                duration: Duration(seconds: 2),
              ),
            );
          }
        });

        if (projectId != null) {
          queryClient.invalidateQueries(QueryKeys.scheduledVisits(projectId,
              assignedTo: true, status: 'upcoming'));

          queryClient.invalidateQueries(QueryKeys.scheduledVisits(projectId,
              assignedTo: true, status: 'overdue'));

          queryClient.invalidateQueries(QueryKeys.completedVisits(projectId));
        }

        checkPending();
      } else if (syncStatus.data == SyncStatus.error) {
        final currentError = syncService.lastError ?? '';
        // Some errors are retriable (e.g. waiting for offline site/visit to
        // sync to server). Distinguish them from real failures so we don't
        // show a scary red snackbar for expected offline-first retries.
        final isRetriable = currentError.contains('Will retry automatically') ||
            currentError.contains('Waiting for');
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (context.mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                  isRetriable
                      ? 'Some visits are pending server sync. Will retry automatically.'
                      : (currentError.isNotEmpty
                          ? currentError
                          : 'Sync failed. Please try again.'),
                ),
                backgroundColor: isRetriable ? Colors.amber[800] : Colors.red,
                duration: Duration(seconds: isRetriable ? 3 : 5),
              ),
            );
          }
        });
        checkPending();
      }
      return null;
    }, [syncStatus.data]);

    // 5. Show indicator if syncing
    Widget syncIndicator = const SizedBox.shrink();
    if (syncStatus.data == SyncStatus.syncing) {
      syncIndicator = Material(
        color: Colors.yellow[700],
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 4.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const SizedBox(
                  width: 16,
                  height: 16,
                  child: CircularProgressIndicator(strokeWidth: 2)),
              const SizedBox(width: 8),
              const Text('Syncing pending visits...',
                  style: TextStyle(color: Colors.black)),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: AppColors.white,
      floatingActionButton: canCreateVisits
          ? FloatingActionButton.extended(
              backgroundColor: AppColors.textBlack,
              onPressed: () => context.go('/AddNewVisit', extra: {
                'collectorId': profile.data?.id ?? '',
                'isOnline': isOnline,
              }),
              icon: Icon(Icons.add),
              label: Text('Add Visit',
                  style: AppTypography.textTheme.buttonSmall.copyWith(
                    color: AppColors.white,
                  )),
            )
          : null,
      appBar: AppBar(
        backgroundColor: AppColors.primaryLight,
        elevation: 0,
        title: Row(
          children: <Widget>[
            Container(
              height: 36,
              width: 36,
              decoration: const BoxDecoration(
                image: DecorationImage(
                  image: AssetImage(
                    Assets.logo,
                  ),
                  fit: BoxFit.contain,
                  colorFilter: ColorFilter.mode(
                    Colors.white,
                    BlendMode.srcIn,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 8),
            Text(
              'Dharini',
              style: AppTypography.textTheme.bodyMedium?.copyWith(
                color: Colors.white,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
        actions: [
          const Center(
            child: Padding(
              padding: EdgeInsets.only(right: 4.0),
              child: NetworkStatusIndicator(),
            ),
          ),
          IconButton(
            icon: const Icon(
              Icons.notifications_outlined,
              color: AppColors.white,
              size: 26,
            ),
            onPressed: () {},
          ),
          if (pendingCount.value > 0)
            IconButton(
              icon: Stack(
                children: [
                  Icon(Icons.sync, color: Colors.white, size: 26),
                  Positioned(
                    right: 0,
                    top: 0,
                    child: Container(
                      padding: const EdgeInsets.all(2),
                      decoration: BoxDecoration(
                        color: Colors.red,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      constraints: const BoxConstraints(
                        minWidth: 16,
                        minHeight: 16,
                      ),
                      child: Text(
                        '${pendingCount.value}',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ),
                ],
              ),
              tooltip: 'Sync pending visits',
              onPressed: () {
                syncService.sync();
              },
            ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            syncIndicator,
            Expanded(
              child: RefreshIndicator(
                onRefresh: () async {
                  await refreshSitesData();
                },
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      // Hero Section
                      Container(
                        color: AppColors.primaryLight,
                        width: double.infinity,
                        padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: <Widget>[
                            const SizedBox(height: 16),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: <Widget>[
                                Text(
                                  profile.data?.firstName != null
                                      ? 'Hello, ${profile.data!.firstName}'
                                      : '',
                                  style: AppTypography.textTheme.displayMedium
                                      ?.copyWith(
                                    color: AppColors.white,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                if (siteCards.isNotEmpty)
                                  Text(
                                    'This week\'s updates for you',
                                    style: AppTypography.textTheme.bodyMedium
                                        ?.copyWith(
                                      color: AppColors.white,
                                      fontWeight: FontWeight.w400,
                                    ),
                                  ),
                              ],
                            ),
                            const SizedBox(height: 16),
                            if (siteCards.isNotEmpty)
                              SitesOverview(
                                  projectId: project.data?.id,
                                  cardsList: siteCards.length >= 3
                                      ? siteCards.sublist(0, 3)
                                      : siteCards),
                            const SizedBox(height: 8),
                          ],
                        ),
                      ),

                      // Upcoming Visits Section
                      const SizedBox(height: 24),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 24),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Upcoming Visits',
                              style: AppTypography.textTheme.displayLarge
                                  ?.copyWith(
                                fontWeight: FontWeight.w600,
                                color: AppColors.actionButtonDark,
                              ),
                            ),
                            TextButton(
                              onPressed: () => context
                                  .go('/visits?tab=0', extra: {'from': 'home'}),
                              child: Text('View All',
                                  style: AppTypography.textTheme.buttonSmall
                                      .copyWith(
                                          color: AppColors.buttonTextDefault)),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 12),
                      SizedBox(
                        height: 180,
                        child: UpcomingVisits(projectId: project.data?.id),
                      ),

                      // Activity Overview Section
                      const SizedBox(height: 24),
                      const AdminActivityOverview(),

                      // Past Visits Section
                      const SizedBox(height: 24),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 24),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Past Visits',
                              style: AppTypography.textTheme.displayLarge
                                  ?.copyWith(
                                fontWeight: FontWeight.w600,
                                color: AppColors.actionButtonDark,
                              ),
                            ),
                            TextButton(
                              onPressed: () => context
                                  .go('/visits?tab=1', extra: {'from': 'home'}),
                              child: Text('View All',
                                  style: AppTypography.textTheme.buttonSmall
                                      .copyWith(
                                          color: AppColors.buttonTextDefault)),
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 12),
                      SizedBox(
                        height: 200,
                        child: PastVisits(projectId: project.data?.id),
                      ),
                      const SizedBox(height: 24),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

(DateTime, DateTime) _getThisWeekDate() {
  final now = DateTime.now();
  final startOfWeek = now.subtract(Duration(days: now.weekday - 1));
  final startDate =
      DateTime(startOfWeek.year, startOfWeek.month, startOfWeek.day);
  final endOfWeek = startOfWeek.add(const Duration(days: 6));
  final endDate = DateTime(endOfWeek.year, endOfWeek.month, endOfWeek.day);
  return (startDate, endDate);
}

class PastVisits extends HookWidget {
  final String? projectId;

  const PastVisits({super.key, required this.projectId});

  @override
  Widget build(BuildContext context) {
    useListenable(Hive.box('completedVisits').listenable());

    final (startDate, endDate) = _getThisWeekDate();
    final visits = useCompletedVisit(
      startDate: startDate,
      endDate: endDate,
    );

    if (visits.isLoading) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }

    final visitCards = visits.data?.map((e) {
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: SizedBox(
              width: MediaQuery.of(context).size.width - 32,
              child: PastVisitCard(
                farmName: e.site.name,
                farmType: e.site.farmType ?? '',
                siteCode: e.site.siteCode ?? '',
                visitScheduledDate: e.visitScheduledAt.toLocal(),
                visitedDate: e.visitedAt?.toLocal(),
                visitStartedDate: e.visitStartedAt?.toLocal(),
                sampleCount: e.samples.length,
                sampleTypes: e.samples
                    .map((e) => e.sampleType?.name)
                    .whereNotNull()
                    .toList(),
              ),
            ),
          );
        }).toList() ??
        [];

    if (visitCards.isEmpty) {
      return const Center(
        child: Text('No past visits available'),
      );
    }

    return AppCarousel(
        height: 180,
        children:
            visitCards.length > 3 ? visitCards.sublist(0, 3) : visitCards);
  }
}

class UpcomingVisits extends HookWidget {
  final String? projectId;

  const UpcomingVisits({super.key, required this.projectId});

  @override
  Widget build(BuildContext context) {
    final profile = useProfile();
    final isCollectorAdmin = profile.data?.roles.isNotEmpty == true
        ? profile.data?.roles.first.role?.name == 'collector'
        : false;

    useListenable(Hive.box('visits').listenable());
    final draftIds = useDraftVisitIds();

    final visits = useScheduledVisits(
      // isCollectorAdmin,
      true,
      startDate: null,
      endDate: null,
      status: 'upcoming',
    );

    if (visits.isLoading) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }

    final rawVisits = visits.data?.toList() ?? [];
    final sortedVisits = rawVisits
      ..sort((a, b) => a.visitScheduledAt.compareTo(b.visitScheduledAt));

    final visitCards = sortedVisits.map((e) {
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: SizedBox(
              width: MediaQuery.of(context).size.width - 32,
              child: VisitCard(
                farmName: e.site.name,
                farmType: e.site.farmType ?? '',
                siteCode: e.site.siteCode ?? '',
                location: e.site.location?.region?.name ?? '',
                scheduledAt: e.visitScheduledAt.toLocal(),
                round: e.round,
                isInProgress: draftIds.contains(e.id),
                isRescheduled: e.rescheduledFrom != null,
                onTap: () {
                  context
                      .push('/collection-details', extra: {"visitDetails": e});
                },
              ),
            ),
          );
        }).toList();

    if (visitCards.isEmpty) {
      return const Center(
        child: Text('No upcoming visits scheduled'),
      );
    }

    return AppCarousel(
        height: 180,
        children:
            visitCards.length > 3 ? visitCards.sublist(0, 3) : visitCards);
  }
}

class SitesOverview extends HookWidget {
  final String? projectId;
  final List<Widget> cardsList;

  const SitesOverview(
      {super.key, required this.projectId, required this.cardsList});

  @override
  Widget build(BuildContext context) {
    return AppCarousel(height: 90, children: cardsList);
  }
}

// All unused elements below --->>
class _ActivityCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;

  const _ActivityCard({
    required this.title,
    required this.value,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: AppColors.white.withOpacity(0.2),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            icon,
            color: AppColors.white,
            size: 20,
          ),
        ),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              value,
              style: AppTypography.textTheme.displayLarge?.copyWith(
                color: AppColors.white,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              title,
              style: AppTypography.textTheme.bodySmall?.copyWith(
                color: AppColors.white.withOpacity(0.8),
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class _VisitMetric extends StatelessWidget {
  final String title;
  final String value;
  final Color color;

  const _VisitMetric({
    required this.title,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 160, // Adjust this width as needed to match your design
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
        decoration: BoxDecoration(
          border: Border.all(
            color: AppColors.borderLight,
            width: 1,
          ),
          borderRadius: BorderRadius.circular(6),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            Text(
              value,
              style: AppTypography.textTheme.bodyMedium?.copyWith(
                color: color,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(width: 16),
            Text(
              title,
              style: AppTypography.textTheme.bodyMedium?.copyWith(
                color: AppColors.labletestblack,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _VisitMetricNew extends StatelessWidget {
  final String title;
  final String value;
  final Color color;

  const _VisitMetricNew({
    required this.title,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Text(
          title,
          style: AppTypography.textTheme.bodySmall?.copyWith(
            color: AppColors.labletestblack.withOpacity(0.6),
          ),
        ),
        const SizedBox(width: 8),
        Text(
          value,
          style: AppTypography.textTheme.displaySmall?.copyWith(
            color: color,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }
}

class _TimePeriodTabs extends StatefulWidget {
  const _TimePeriodTabs();

  @override
  State<_TimePeriodTabs> createState() => _TimePeriodTabsState();
}

class _TimePeriodTabsState extends State<_TimePeriodTabs> {
  int _selectedIndex = 0;

  final List<String> _periods = ['This week', 'This month', '3 Months'];

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: List.generate(_periods.length, (index) {
          bool isSelected = _selectedIndex == index;
          return Padding(
            padding: EdgeInsets.only(right: 8),
            child: GestureDetector(
              onTap: () {
                setState(() {
                  _selectedIndex = index;
                });
              },
              child: Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: isSelected ? AppColors.primaryDark : AppColors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: isSelected
                      ? null
                      : Border.all(
                          color: AppColors.primaryDark.withOpacity(0.2),
                          width: 1),
                ),
                child: Text(
                  _periods[index],
                  style: AppTypography.textTheme.bodySmall?.copyWith(
                    color: isSelected ? AppColors.white : AppColors.primaryDark,
                  ),
                ),
              ),
            ),
          );
        }),
      ),
    );
  }
}

class _VisitCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String value;
  final Color color;

  const _VisitCard({
    required this.icon,
    required this.title,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          Icon(
            icon,
            color: color,
            size: 24,
          ),
          SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: AppTypography.textTheme.bodySmall?.copyWith(
                  color: color,
                  fontWeight: FontWeight.w600,
                ),
              ),
              SizedBox(height: 4),
              Text(
                value,
                style: AppTypography.textTheme.titleMedium?.copyWith(
                  color: color,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
