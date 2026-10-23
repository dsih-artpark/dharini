import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';

import '../providers/connectivity_provider.dart';
import '../providers/sync_service_provider.dart';
import '../services/connectivity_service.dart';
import '../services/sync_service.dart';

class SyncStatusWidget extends HookWidget {
  const SyncStatusWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final syncStatus = useState<SyncStatus>(SyncStatus.idle);

    final networkStatus = context.networkStatus;

    useEffect(() {
      final syncSubscription = context.syncService.syncStatus.listen((status) {
        syncStatus.value = status;
      });

      // Start auto-sync immediately if we're already online.
      if (networkStatus == NetworkStatus.online) {
        context.syncService.startAutoSync();
      }

      return () {
        syncSubscription.cancel();
        context.syncService.stopAutoSync();
      };
    }, []);

    // React to network changes to start/stop auto-sync.
    useEffect(() {
      if (networkStatus == NetworkStatus.online) {
        context.syncService.sync();
        context.syncService.startAutoSync();
      } else {
        context.syncService.stopAutoSync();
      }
      return null;
    }, [networkStatus]);

    return Container(
      padding: const EdgeInsets.all(8.0),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          _buildNetworkIcon(networkStatus),
          const SizedBox(width: 8),
          _buildSyncStatus(syncStatus.value),
          if (networkStatus == NetworkStatus.offline) const SizedBox(width: 8),
          if (networkStatus == NetworkStatus.offline)
            const Text(
              'Offline Mode',
              style: TextStyle(
                color: Colors.orange,
                fontWeight: FontWeight.bold,
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildNetworkIcon(NetworkStatus status) {
    return Icon(
      status == NetworkStatus.online ? Icons.wifi : Icons.wifi_off,
      color: status == NetworkStatus.online ? Colors.green : Colors.orange,
    );
  }

  Widget _buildSyncStatus(SyncStatus status) {
    switch (status) {
      case SyncStatus.syncing:
        return const SizedBox(
          width: 16,
          height: 16,
          child: CircularProgressIndicator(
            strokeWidth: 2,
          ),
        );
      case SyncStatus.completed:
        return const Icon(
          Icons.check_circle,
          color: Colors.green,
          size: 16,
        );
      case SyncStatus.error:
        return const Icon(
          Icons.error,
          color: Colors.red,
          size: 16,
        );
      case SyncStatus.idle:
        return const SizedBox(width: 16);
    }
  }
}
