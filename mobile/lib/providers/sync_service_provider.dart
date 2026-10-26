import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:fquery/fquery.dart';
import '../providers/connectivity_provider.dart';
import '../services/connectivity_service.dart';
import '../services/sync_service.dart';
import '../hooks/api.dart';
import '../hooks/auth.dart';
import '../services/photo_upload_manager.dart';

class SyncServiceProvider extends HookWidget {
  final Widget child;

  const SyncServiceProvider({
    Key? key,
    required this.child,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final client = useEsApiClient();
    final queryClient = useQueryClient();
    final projectId = useCurrentProjectId();

    // Use the non-hook-based photo manager for background sync. Memoized
    // because it is a key of the SyncService memo below: a fresh instance on
    // every build (e.g. each connectivity change) recreated the SyncService.
    final photoManager = useMemoized(
      () => PhotoUploadManager(
        (localPath) => PhotoUploadManager.uploadPhotoToApi(client, localPath),
      ),
      [client],
    );

    // Create SyncService instance with QueryClient for query invalidation.
    final syncService = useMemoized(
      () => SyncService(
        client,
        photoManager,
        queryClient: queryClient,
        projectId: projectId,
      ),
      [client, photoManager, queryClient, projectId],
    );

    // Read the ConnectivityService in build (not inside useEffect), because
    // InheritedWidget lookups are not allowed inside HookState.initState.
    final connectivityService = context.connectivity;

    // Start auto-sync timer and wire up connectivity-restoration sync.
    useEffect(() {
      // Run background sync every 5 minutes.
      syncService.startAutoSync(interval: const Duration(minutes: 5));

      // Also trigger an immediate sync whenever network is restored so that
      // queued sites/visits upload as soon as the field worker regains signal,
      // without waiting up to 5 minutes for the next timer tick.
      final sub = connectivityService.status.listen((status) {
        if (status == NetworkStatus.online) {
          debugPrint(
              '[SyncServiceProvider] Network restored — triggering sync');
          syncService.sync();
        }
      });

      return () {
        sub.cancel();
        syncService.dispose();
      };
    }, [syncService, connectivityService]);

    return _SyncServiceScope(
      syncService: syncService,
      child: child,
    );
  }
}

class _SyncServiceScope extends InheritedWidget {
  final SyncService syncService;

  const _SyncServiceScope({
    required this.syncService,
    required super.child,
  });

  static SyncService of(BuildContext context) {
    final scope =
        context.dependOnInheritedWidgetOfExactType<_SyncServiceScope>();
    if (scope == null) {
      throw StateError('No SyncServiceProvider found in context');
    }
    return scope.syncService;
  }

  @override
  bool updateShouldNotify(_SyncServiceScope oldWidget) {
    return syncService != oldWidget.syncService;
  }
}

// Extension method for easier access
extension SyncServiceContext on BuildContext {
  SyncService get syncService => _SyncServiceScope.of(this);
}
