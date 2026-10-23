// ignore_for_file: unnecessary_null_comparison

import 'package:design_system/design_system.dart';
import 'package:es_platform_mobile/hooks/api.dart';
import 'package:es_platform_mobile/hooks/auth.dart';
import 'package:es_platform_mobile/hooks/species.dart';
import 'package:es_platform_mobile/managers/location_manager.dart';
import 'package:es_platform_mobile/providers/connectivity_provider.dart';
import 'package:es_platform_mobile/providers/sync_service_provider.dart';
import 'package:es_platform_mobile/services/database_service.dart';
import 'package:es_platform_mobile/services/sync_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:fquery/fquery.dart';
import 'package:geolocator/geolocator.dart';
import 'package:go_router/go_router.dart';

class OnboardingScreen extends HookWidget {
  const OnboardingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final project = useProject();
    final profile = useProfile();
    final isSyncing = useState(false);
    final queryClient = useQueryClient();

    final sites = useSites();
    final api = useEsApiClient();
    final projectId = useCurrentProjectId();
    final currentLocation = useState<Position?>(null);
    final selectedDistance = useState<int>(4000);

    useRegions('state');
    useCacheAllDistricts();
    useSampleType();
    useSpecies();
    useNearbySites(
      currentLocation.value?.latitude,
      currentLocation.value?.longitude,
      selectedDistance.value.toDouble(),
    );

    useEffect(() {
      if (sites.isSuccess) {
        print('[SYNC] Syncing network sites to Hive...');
        syncNetworkSitesToHive(sites.data!);
      }
      return null;
    }, [sites.data]);

    final syncMessage = useState<String?>(null);

    // offline db sync
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

        // Step 2: Ensure location
        var lat = currentLocation.value?.latitude;
        var lon = currentLocation.value?.longitude;

        if (lat == null || lon == null) {
          try {
            final location = await LocationManager.ensureLocation(context);
            currentLocation.value = location;
            lat = location?.latitude;
            lon = location?.longitude;
            print('[Sync] Location fetched: ($lat, $lon)');
          } catch (e) {
            throw Exception('Failed to fetch location: $e');
          }
        }

        // Step 3: Prefetch and ensure completion
        if (lat != null && lon != null) {
          print('[Sync] Prefetching nearby sites for all distances...');
          // await prefetchAllNearbySites(
          //   api: api,
          //   projectId: projectId,
          //   latitude: lat,
          //   longitude: lon,
          //   distances: distanceOptions,
          // );
          await prefetchAllNearbySites(
            api: api,
            projectId: projectId,
            latitude: lat,
            longitude: lon,
          );

          print('[Sync] Prefetching nearby sites completed.');
        } else {
          throw Exception('Location unavailable, cannot prefetch sites.');
        }

        syncMessage.value = 'Sync completed successfully';
      } catch (e) {
        print('[Sync] Error: $e');
        syncMessage.value = 'Failed to sync changes: $e';
      } finally {
        isSyncing.value = false;

        if ((syncMessage.value ?? '').contains('successfully')) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(syncMessage.value!),
              backgroundColor: Colors.green,
            ),
          );
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(syncMessage.value!),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    }

    useEffect(() {
      print('[Welcome] useEffect triggered with projectId: $projectId');

      Future<void> initiateSyncFlow() async {
        if (projectId == null || isSyncing.value) return;

        isSyncing.value = true; // Ensure loader is shown from the start

        try {
          final position = await LocationManager.ensureLocation(context);

          if (position == null) {
            throw Exception('Unable to get location.');
          }

          currentLocation.value = position;
        } catch (e) {
          debugPrint('Error getting location: $e');
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Failed to get current location: $e'),
              backgroundColor: Colors.red,
            ),
          );
          isSyncing.value = false;
          return;
        }

        await handleSync();
      }

      initiateSyncFlow();

      return null;
    }, [projectId]);

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

    // Update pending count when online status changes
    useEffect(() {
      checkPending();
      print("Is online =====> $isOnline");
      return null;
    }, [isOnline]);

    // Update pending count when sync completes or errors
    useEffect(() {
      if (syncStatus.data == SyncStatus.completed ||
          syncStatus.data == SyncStatus.error) {
        queryClient.invalidateQueries(QueryKeys.scheduledVisits(
            project.data?.id ?? '',
            assignedTo: true,
            status: 'upcoming'));
        checkPending();
      }
      return null;
    }, [syncStatus.data]);

    // No current project (zero, or several with none selected yet) is not a
    // load failure — the picker owns that state. AppShell does the same
    // redirect, but this route sits outside the shell. The picker comes back
    // here afterwards, so the location prompt and initial sync below still
    // run once a project is set.
    final needsProjectSelection = profile.data != null &&
        project.error is NoProjectSelectedException;

    useEffect(() {
      if (needsProjectSelection) {
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (context.mounted) context.go('/select-project?next=/onboarding');
        });
      }
      return null;
    }, [needsProjectSelection]);

    // Show loading state while data is being fetched
    if (project.isLoading || profile.isLoading || needsProjectSelection) {
      return Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF2A51A4)),
              ),
              const SizedBox(height: 16),
              Text(
                'Loading...',
                style: AppTypography.textTheme.bodyB2Regular.copyWith(
                  color: AppColors.textBlack,
                ),
              ),
            ],
          ),
        ),
      );
    }

    // Show error state if data fetch failed
    if (project.error != null || profile.error != null) {
      return Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(
                Icons.error_outline,
                color: Colors.red,
                size: 48,
              ),
              const SizedBox(height: 16),
              Text(
                'Failed to load data. Please try again.',
                style: AppTypography.textTheme.bodyB2Regular.copyWith(
                  color: AppColors.textBlack,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () {
                  project.refetch();
                  profile.refetch();
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF2A51A4),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: Text(
                  'Retry',
                  style: AppTypography.textTheme.buttonLarge.copyWith(
                    color: AppColors.white,
                  ),
                ),
              ),
            ],
          ),
        ),
      );
    }

    final diseaseNames = project.data?.diseases
            .map((e) => e.name)
            .where((e) => e != null)
            .cast<String>()
            .toList() ??
        [];

    final diseases = diseaseNames.length > 3
        ? '${diseaseNames.take(3).join(", ")} +${diseaseNames.length - 3}'
        : diseaseNames.join(", ");

    final regionNames = project.data?.regions
            .map((e) => e.name)
            .where((e) => e != null)
            .cast<String>()
            .toList() ??
        [];

    final locations = regionNames.length > 3
        ? '${regionNames.take(3).join(", ")} +${regionNames.length - 3}'
        : regionNames.join(", ");

    return Scaffold(
      resizeToAvoidBottomInset: false,
      body: Container(
        width: double.infinity,
        height: double.infinity,
        color: Colors.white,
        child: Column(
          children: [
            // Blue header section
            Container(
              width: double.infinity,
              padding: const EdgeInsets.only(
                left: 20,
                right: 20,
                top: 60,
                bottom: 30,
              ),
              decoration: const BoxDecoration(
                color: Color(0xFF2A51A4),
                borderRadius: BorderRadius.only(),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Welcome to ',
                    style: AppTypography.textTheme.bodyB2Regular.copyWith(
                      color: AppColors.white,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '${project.data?.name ?? ''}',
                    style: AppTypography.textTheme.headingH1.copyWith(
                      color: AppColors.white,
                    ),
                  ),
                  const SizedBox(height: 20),
                  Text(
                    'You\'ve been invited as',
                    style: AppTypography.textTheme.bodyB3Regular.copyWith(
                      color: AppColors.white,
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(vertical: 0),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      profile.data?.roles.isNotEmpty == true
                          ? (profile.data?.roles.first.role?.name ?? 'No Role')
                          : 'No Role',
                      style: AppTypography.textTheme.headingH2.copyWith(
                        color: AppColors.white,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Content section
            Expanded(
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (isSyncing.value) ...[
                      const LinearProgressIndicator(
                        minHeight: 4,
                        backgroundColor: Color(0xFFEEEEEE),
                        valueColor: AlwaysStoppedAnimation(Color(0xFF2A51A4)),
                      ),
                      const SizedBox(height: 16),
                    ],
                    Text(
                      'Project Details',
                      style: AppTypography.textTheme.headingH3.copyWith(
                        color: AppColors.textBlack,
                      ),
                    ),
                    const SizedBox(height: 20),
                    Text(
                      'PROJECT ADMIN',
                      style: AppTypography.textTheme.labelMMedium.copyWith(
                        color: AppColors.textWeak,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      project.data?.projectAdmins.isNotEmpty == true
                          ? '${project.data?.projectAdmins.first.firstName ?? ''} ${project.data?.projectAdmins.first.lastName ?? ''}'
                          : '',
                      style: AppTypography.textTheme.bodyB3Medium.copyWith(
                        color: AppColors.textBlack,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'DISEASES',
                      style: AppTypography.textTheme.labelMMedium.copyWith(
                        color: AppColors.textWeak,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      diseases,
                      style: AppTypography.textTheme.bodyB3Medium.copyWith(
                        color: AppColors.textBlack,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'LOCATIONS',
                      style: AppTypography.textTheme.labelMMedium.copyWith(
                        color: AppColors.textWeak,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      locations,
                      style: AppTypography.textTheme.bodyB3Medium.copyWith(
                        color: AppColors.textBlack,
                      ),
                    ),
                    const Divider(height: 40, color: Color(0xFFEEEEEE)),
                  ],
                ),
              ),
            ),

            // Button at bottom
            Container(
              width: double.infinity,
              padding: EdgeInsets.fromLTRB(
                20,
                16,
                20,
                16 + MediaQuery.of(context).padding.bottom,
              ),
              child: ElevatedButton(
                onPressed: isSyncing.value
                    ? null
                    : () {
                        context.go('/');
                      },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF2A51A4),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: Text(
                  'Get Started',
                  style: AppTypography.textTheme.buttonLarge.copyWith(
                    color: AppColors.white,
                  ),
                ),
              ),
            ),
            SizedBox(
              height: 10,
            )
          ],
        ),
      ),
    );
  }
}
