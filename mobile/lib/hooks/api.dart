import 'package:data_provider/data_provider.dart';
import 'package:es_client/es_client.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:es_platform_mobile/interceptors/auth_interceptor.dart';
import 'package:es_platform_mobile/interceptors/sentry_dio_interceptor.dart';
import 'package:es_platform_mobile/router.dart';

/// This can be used to provide a [EsClient] throughout the application.
class EsClientProvider extends InheritedWidget {
  static final String accessTokenKey = 'es_access_token';
  final EsClient esClient;
  final storage = FlutterSecureStorage();
  final DioHttpClient? httpClient;

  EsClientProvider({
    super.key,
    required String baseUrl,
    required super.child,
    this.httpClient,
    String? initialToken,
  }) : esClient = EsClient(basePathOverride: baseUrl) {
    // Add Sentry interceptor to log all API requests
    esClient.dio.interceptors.add(SentryDioInterceptor());
    // Add Auth interceptor to handle 401 errors
    esClient.dio.interceptors.add(AuthInterceptor());

    esClient.dio.options.receiveTimeout = const Duration(seconds: 30);
    esClient.dio.options.connectTimeout = const Duration(seconds: 30);

    if (initialToken != null && initialToken.isNotEmpty) {
      _setToken(initialToken);
    }
    loadToken();
  }

  @override
  bool updateShouldNotify(InheritedWidget oldWidget) => oldWidget != this;

  static EsClientProvider of(BuildContext context) {
    final EsClientProvider? result =
        context.dependOnInheritedWidgetOfExactType<EsClientProvider>();
    assert(result != null, 'EsClientProvider not found');
    return result!;
  }

  updateToken(String token) {
    _setToken(token);
    storage.write(key: accessTokenKey, value: token);
  }

  void _setToken(String token) {
    applyAuthToken(esClient, token);
    httpClient?.updateAuthToken(token);
  }

  Future<void> loadToken() async {
    final token = await storage.read(key: accessTokenKey);
    if (token != null && token.isNotEmpty) {
      _setToken(token);
    }
  }

  Future<void> logout() async {
    await storage.delete(key: accessTokenKey);
    applyAuthToken(esClient, '');
    httpClient?.updateAuthToken(null);
    router.go('/auth/login');
  }

  Future<bool> isAuthenticated() async {
    final token = await storage.read(key: accessTokenKey);
    return token != null && token.isNotEmpty;
  }
}

/// Applies [token] to every request made through [client].
///
/// `setBearerAuth` alone is not enough: the generated `BearerAuthInterceptor`
/// only adds the header when the endpoint's `secure` extra declares bearer
/// auth. Endpoints generated before their backend guard existed (regions,
/// media, kits, geolens, sequencing) have an empty `secure` extra, so they were
/// sent unauthenticated and came back 401. Setting the header on the Dio
/// instance covers those too. Pass an empty [token] to clear it.
void applyAuthToken(EsClient client, String token) {
  if (token.isEmpty) {
    client.dio.options.headers.remove('Authorization');
    // `setBearerAuth('bearer', '')` would store an empty string, and the
    // generated interceptor only skips a token that is null. Drop the entry
    // so a logged-out client stops sending `Authorization: Bearer ` entirely.
    for (final interceptor
        in client.dio.interceptors.whereType<BearerAuthInterceptor>()) {
      interceptor.tokens.remove('bearer');
    }
    return;
  }
  client.setBearerAuth('bearer', token);
  client.dio.options.headers['Authorization'] = 'Bearer $token';
}

EsClient useEsApiClient() {
  final context = useContext();
  return EsClientProvider.of(context).esClient;
}

Function(String) useUpdateToken() {
  final context = useContext();
  return EsClientProvider.of(context).updateToken;
}

Future<bool> Function() useIsAuthenticated(BuildContext context) {
  return EsClientProvider.of(context).isAuthenticated;
}
