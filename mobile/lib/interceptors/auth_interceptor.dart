import 'package:dio/dio.dart';
import 'package:es_platform_mobile/services/analytics_service.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../router.dart';

/// A Dio interceptor that handles authentication-related tasks,
/// specifically 401 Unauthorized errors to trigger logout/redirect.
class AuthInterceptor extends Interceptor {
  final storage = const FlutterSecureStorage();
  static const String accessTokenKey = 'es_access_token';

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    if (err.response?.statusCode == 401) {
      // Check if we are already on the login page to avoid infinite redirect loops
      final currentPath = router.routerDelegate.currentConfiguration.uri.path;
      final isPublicPath = publicPaths.any((path) =>
          currentPath == path || currentPath.startsWith(path));

      if (!isPublicPath) {
        print('[AuthInterceptor] received 401. Clearing token and redirecting to login.');

        // Clear tokens from all possible storage locations
        await Analytics.reset();
        await storage.delete(key: accessTokenKey);

        // Redirect to login screen
        router.go('/auth/login');
      }
    }
    handler.next(err);
  }
}
