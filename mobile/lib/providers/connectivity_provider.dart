import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import '../services/connectivity_service.dart';

/// Provides a single [ConnectivityService] instance to the widget tree.
///
/// Use [context.connectivity] to get the service.
/// Use [context.isOnline] to get the *current* status synchronously — no
/// need to subscribe to the stream or wait for an async check.
class ConnectivityProvider extends HookWidget {
  final Widget child;

  const ConnectivityProvider({
    Key? key,
    required this.child,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final connectivityService = useMemoized(() => ConnectivityService());

    // Rebuild this scope widget whenever connectivity status changes so that
    // [context.isOnline] always reflects the latest value.
    final networkStatus =
        useState<NetworkStatus>(connectivityService.currentStatus);

    useEffect(() {
      final sub = connectivityService.status.listen((status) {
        networkStatus.value = status;
      });
      return sub.cancel;
    }, [connectivityService]);

    useEffect(() {
      return () {
        connectivityService.dispose();
      };
    }, [connectivityService]);

    return _ConnectivityScope(
      connectivityService: connectivityService,
      currentStatus: networkStatus.value,
      child: child,
    );
  }
}

class _ConnectivityScope extends InheritedWidget {
  final ConnectivityService connectivityService;
  final NetworkStatus currentStatus;

  const _ConnectivityScope({
    required this.connectivityService,
    required this.currentStatus,
    required super.child,
  });

  static _ConnectivityScope _of(BuildContext context) {
    final scope =
        context.dependOnInheritedWidgetOfExactType<_ConnectivityScope>();
    if (scope == null) {
      throw StateError('No ConnectivityProvider found in context');
    }
    return scope;
  }

  @override
  bool updateShouldNotify(_ConnectivityScope oldWidget) {
    return currentStatus != oldWidget.currentStatus ||
        connectivityService != oldWidget.connectivityService;
  }
}

/// Extension methods for easy access from any [BuildContext].
extension ConnectivityContext on BuildContext {
  /// The underlying [ConnectivityService] (for streaming or one-shot checks).
  ConnectivityService get connectivity =>
      _ConnectivityScope._of(this).connectivityService;

  /// The latest network status — synchronous, always up-to-date.
  NetworkStatus get networkStatus => _ConnectivityScope._of(this).currentStatus;

  /// Convenience bool — true when the device has verified internet access.
  bool get isOnline =>
      _ConnectivityScope._of(this).currentStatus == NetworkStatus.online;
}
