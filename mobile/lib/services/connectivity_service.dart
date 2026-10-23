import 'dart:async';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:http/http.dart' as http;

import 'package:connectivity_plus/connectivity_plus.dart';

enum NetworkStatus { online, offline }

/// Real-time connectivity service.
///
/// Combines two signals to detect the actual internet state:
///  1. `connectivity_plus` stream — fires on interface changes (WiFi/mobile on/off).
///  2. A dynamic periodic timer — catches "connected to WiFi but no internet" situations.
///     - Offline: Polls aggressively every 3s to detect restoration instantly.
///     - Online: Polls every 15s to conserve battery and bandwidth.
///
/// Integrates with HTTP interceptors to instantly transition to offline on failure.
class ConnectivityService {
  static final ConnectivityService _instance = ConnectivityService._internal();

  factory ConnectivityService() => _instance;

  ConnectivityService._internal() {
    _init();
  }

  final _connectivity = Connectivity();
  final _controller = StreamController<NetworkStatus>.broadcast();
  StreamSubscription? _connectivitySub;
  Timer? _pingTimer;

  NetworkStatus _currentStatus = NetworkStatus.online;

  /// The latest known status — available synchronously without awaiting.
  NetworkStatus get currentStatus => _currentStatus;

  /// Stream of status updates. Emits whenever status changes.
  Stream<NetworkStatus> get status => _controller.stream;

  Future<void> _init() async {
    // 1. Check immediately on startup so we have a real value right away.
    final initial = await checkConnectivity();
    _emit(initial);

    // 2. React to interface-level connectivity changes.
    _connectivitySub = _connectivity.onConnectivityChanged
        .asyncMap(_getNetworkStatusWithInternetCheck)
        .listen(_emit);

    // 3. Start dynamic ping timer.
    _startPingTimer();
  }

  void _emit(NetworkStatus status) {
    if (_currentStatus != status) {
      _currentStatus = status;
      if (!_controller.isClosed) {
        _controller.add(status);
      }
      // Restart the ping timer to adjust the polling interval dynamically
      _startPingTimer();
    }
  }

  /// Start or reschedule the dynamic ping timer.
  void _startPingTimer() {
    _pingTimer?.cancel();

    // Aggressive polling when offline to detect recovery instantly.
    // Lightweight polling when online to save battery/bandwidth.
    final interval = _currentStatus == NetworkStatus.offline
        ? const Duration(seconds: 3)
        : const Duration(seconds: 15);

    _pingTimer = Timer(interval, () async {
      final status = await checkConnectivity();
      _emit(status);
      _startPingTimer(); // Reschedule
    });
  }

  /// Instantly transitions the service to offline status.
  /// Call this when an HTTP request fails due to socket or network timeout errors.
  void forceOfflineCheck() {
    _emit(NetworkStatus.offline);
    _startPingTimer(); // Instantly switch to aggressive polling
  }

  /// One-shot connectivity check — performs a real network lookup.
  Future<NetworkStatus> checkConnectivity() async {
    final result = await _connectivity.checkConnectivity();
    return _getNetworkStatusWithInternetCheck(result);
  }

  Future<NetworkStatus> _getNetworkStatusWithInternetCheck(
      ConnectivityResult result) async {
    if (result == ConnectivityResult.none) {
      return NetworkStatus.offline;
    }

    try {
      // Use http instead of dart:io's InternetAddress (not available on web).
      // Web cross-origin HTTP HEAD requests to external domains can fail due to CORS.
      // But we timeout very quickly (2 seconds) to keep it near-instant.
      final response = await http
          .head(Uri.parse('https://www.google.com'))
          .timeout(const Duration(seconds: 2));
      return response.statusCode < 500
          ? NetworkStatus.online
          : NetworkStatus.offline;
    } catch (_) {
      // CORS or network failure.
      // On Web, if google.com fails (likely CORS), since result != ConnectivityResult.none,
      // the browser interface is online. We fallback to online to avoid blocking Web clients.
      if (kIsWeb) {
        return NetworkStatus.online;
      }
      return NetworkStatus.offline;
    }
  }

  void dispose() {
    _connectivitySub?.cancel();
    _pingTimer?.cancel();
    _controller.close();
  }
}
