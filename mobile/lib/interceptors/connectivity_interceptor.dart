import 'package:dio/dio.dart';
import '../services/connectivity_service.dart';

/// Interceptor that listens to all outbound network requests.
///
/// If any HTTP request fails due to a network connection error, DNS resolution
/// failure, or request timeout, it instantly triggers a force-offline check
/// on the [ConnectivityService], transitioning the UI and app state to
/// offline mode immediately.
class ConnectivityInterceptor extends Interceptor {
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    if (err.type == DioExceptionType.connectionTimeout ||
        err.type == DioExceptionType.sendTimeout ||
        err.type == DioExceptionType.receiveTimeout ||
        err.type == DioExceptionType.connectionError) {
      print('[ConnectivityInterceptor] Connection failure intercepted. Instantly forcing offline check.');
      ConnectivityService().forceOfflineCheck();
    }
    super.onError(err, handler);
  }
}
