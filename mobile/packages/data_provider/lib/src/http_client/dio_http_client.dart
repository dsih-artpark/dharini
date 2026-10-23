import 'package:barrel_files_annotation/barrel_files_annotation.dart';
import 'package:dio/dio.dart';

import 'api_exception.dart';
import 'http_client.dart';

/// Implementation of [HttpClient] using Dio
@includeInBarrelFile
class DioHttpClient implements HttpClient {
  DioHttpClient({
    Dio? dio,
    String? baseUrl,
    String? authToken,
    Map<String, String>? defaultHeaders,
    List<Interceptor>? interceptors,
  })  : dio = dio ?? Dio(),
        _baseUrl = baseUrl ?? 'http://localhost:4000',
        _authToken = authToken {
    this.dio.options = BaseOptions(
      baseUrl: _baseUrl,
      headers: <String, String>{
        'Content-Type': 'application/json',
        ...?defaultHeaders,
      },
    );

    this.dio.interceptors.addAll(<Interceptor>[
      _authInterceptor(),
      LogInterceptor(
        requestBody: true,
        responseBody: true,
      ),
      ...?interceptors,
    ]);
  }

  final Dio dio;
  final String _baseUrl;
  String? _authToken;

  @override
  String? get authToken => _authToken;

  Interceptor _authInterceptor() => InterceptorsWrapper(
        onRequest: (RequestOptions options, RequestInterceptorHandler handler) {
          if (_authToken != null) {
            options.headers['Authorization'] = 'Bearer $_authToken';
          }
          return handler.next(options);
        },
      );

  @override
  void updateAuthToken(String? token) {
    _authToken = token;
  }

  @override
  Future<T> request<T>({
    required String path,
    required String method,
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Map<String, String>? headers,
    bool requiresAuth = true,
  }) async {
    try {
      // ignore: inference_failure_on_function_invocation, always_specify_types
      final response = await dio.request(
        path,
        data: data,
        queryParameters: queryParameters,
        options: Options(
          method: method,
          headers: headers,
        ),
      );
      return response.data as T;
    } on DioException catch (e) {
      throw ApiException(
        message: e.message ?? 'Unknown error',
        statusCode: e.response?.statusCode,
        data: e.response?.data,
      );
    }
  }

  @override
  Future<T> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    Map<String, String>? headers,
    bool requiresAuth = true,
  }) =>
      request<T>(
        path: path,
        method: 'GET',
        queryParameters: queryParameters,
        headers: headers,
        requiresAuth: requiresAuth,
      );

  @override
  Future<T> post<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Map<String, String>? headers,
    bool requiresAuth = true,
  }) =>
      request<T>(
        path: path,
        method: 'POST',
        data: data,
        queryParameters: queryParameters,
        headers: headers,
        requiresAuth: requiresAuth,
      );

  @override
  Future<T> put<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Map<String, String>? headers,
    bool requiresAuth = true,
  }) =>
      request<T>(
        path: path,
        method: 'PUT',
        data: data,
        queryParameters: queryParameters,
        headers: headers,
        requiresAuth: requiresAuth,
      );

  @override
  Future<T> patch<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Map<String, String>? headers,
    bool requiresAuth = true,
  }) =>
      request<T>(
        path: path,
        method: 'PATCH',
        data: data,
        queryParameters: queryParameters,
        headers: headers,
        requiresAuth: requiresAuth,
      );

  @override
  Future<T> delete<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Map<String, String>? headers,
    bool requiresAuth = true,
  }) =>
      request<T>(
        path: path,
        method: 'DELETE',
        data: data,
        queryParameters: queryParameters,
        headers: headers,
        requiresAuth: requiresAuth,
      );
}
