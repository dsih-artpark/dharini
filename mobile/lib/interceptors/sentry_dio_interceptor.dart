import 'package:dio/dio.dart';
import 'package:es_platform_mobile/utils/sentry_scrubber.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

/// A Dio interceptor that records HTTP activity in Sentry breadcrumbs and
/// reports failed requests.
///
/// It never sends request or response *values*, URLs with IDs or query
/// strings, or headers. It sends the route template, method, status code and
/// the shape of the payloads (field names and types). See [SentryScrubber].
class SentryDioInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    final route = SentryScrubber.routeOf(options.uri);

    Sentry.addBreadcrumb(Breadcrumb(
      category: 'http.request',
      type: 'http',
      level: SentryLevel.info,
      message: '${options.method} $route',
      data: {
        'route': route,
        'method': options.method,
        'query_keys': options.uri.queryParameters.keys.toList(),
        'payload_shape': SentryScrubber.describeShape(options.data),
      },
    ));

    handler.next(options);
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    final request = response.requestOptions;
    final route = SentryScrubber.routeOf(request.uri);

    Sentry.addBreadcrumb(Breadcrumb(
      category: 'http.response',
      type: 'http',
      level: SentryLevel.info,
      message: '${response.statusCode} ${request.method} $route',
      data: {
        'route': route,
        'method': request.method,
        'status_code': response.statusCode,
        'response_shape': SentryScrubber.describeShape(response.data),
      },
    ));

    handler.next(response);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    final request = err.requestOptions;
    final route = SentryScrubber.routeOf(request.uri);
    final statusCode = err.response?.statusCode;

    // The backend's own message gives a readable Sentry title. It can echo
    // user input (e.g. "phone 98xxxxxxxx is invalid"), so it is masked.
    final backendMessage = _backendMessage(err.response?.data);
    final exceptionToCapture = backendMessage != null
        ? Exception('API Error ${statusCode ?? ''}: $backendMessage')
        : err;

    final context = <String, dynamic>{
      'route': route,
      'method': request.method,
      'status_code': statusCode,
      'dio_error_type': err.type.name,
      'request_shape': SentryScrubber.describeShape(request.data),
      'response_shape': SentryScrubber.describeShape(err.response?.data),
      'error_message': err.message == null
          ? null
          : SentryScrubber.maskText(err.message!),
    };
    // Lets a Sentry event be matched to the backend's own logs. Not
    // `headers.value()`: it throws when the header is repeated, which would
    // replace this error and skip the 401 handling in AuthInterceptor.
    final requestIds = err.response?.headers['x-request-id'];
    if (requestIds != null && requestIds.isNotEmpty) {
      context['request_id'] = requestIds.first;
    }

    Sentry.captureException(
      exceptionToCapture,
      stackTrace: err.stackTrace,
      withScope: (scope) {
        scope.setTag('http.route', '${request.method} $route');
        if (statusCode != null) scope.setTag('http.status', '$statusCode');
        scope.setTag('dio.error_type', err.type.name);
        scope.setContexts('http_error', context);
      },
    );

    Sentry.addBreadcrumb(Breadcrumb(
      category: 'http.error',
      type: 'http',
      level: SentryLevel.error,
      message: '${statusCode ?? 'ERROR'} ${request.method} $route',
      data: context,
    ));

    handler.next(err);
  }

  String? _backendMessage(dynamic data) {
    Object? message;
    if (data is Map) {
      message = data['message'];
    } else if (data is String) {
      message = data;
    }
    if (message == null) return null;
    final text = message is List ? message.join(', ') : message.toString();
    if (text.isEmpty) return null;
    return SentryScrubber.maskText(text);
  }
}
