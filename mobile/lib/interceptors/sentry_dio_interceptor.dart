import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

/// A Dio interceptor that logs all HTTP requests and responses to Sentry.
class SentryDioInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    // Add breadcrumb for the request
    Sentry.addBreadcrumb(Breadcrumb(
      category: 'http.request',
      type: 'http',
      level: SentryLevel.info,
      message: '${options.method} ${options.uri}',
      data: {
        'url': options.uri.toString(),
        'method': options.method,
        'headers': _sanitizeHeaders(options.headers),
        'payload': _truncatePayload(options.data),
      },
    ));

    // Also log to console for debugging
    final hasAuth = options.headers.containsKey('Authorization') || 
                    options.headers.containsKey('authorization');
    print('[HTTP] → ${options.method} ${options.uri} (Auth: ${hasAuth ? 'YES' : 'NO'})');

    handler.next(options);
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    // Add breadcrumb for the response
    Sentry.addBreadcrumb(Breadcrumb(
      category: 'http.response',
      type: 'http',
      level: SentryLevel.info,
      message:
          '${response.statusCode} ${response.requestOptions.method} ${response.requestOptions.uri}',
      data: {
        'url': response.requestOptions.uri.toString(),
        'method': response.requestOptions.method,
        'status_code': response.statusCode,
        'response': _truncatePayload(response.data),
      },
    ));

    // Also log to console for debugging
    print(
        '[HTTP] ← ${response.statusCode} ${response.requestOptions.method} ${response.requestOptions.uri}');
    print('[HTTP] ← Response: ${_truncatePayload(response.data)}');

    handler.next(response);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    // Extract the backend's exact error message for a cleaner Sentry title
    String? backendMessage;
    if (err.response?.data is Map) {
      backendMessage = err.response?.data['message']?.toString();
    } else if (err.response?.data is String) {
      backendMessage = err.response?.data.toString();
    }

    final exceptionToCapture =
        backendMessage != null && backendMessage.isNotEmpty
            ? Exception(
                'API Error ${err.response?.statusCode ?? ''}: $backendMessage')
            : err;

    // Capture error in Sentry with full context
    Sentry.captureException(
      exceptionToCapture,
      stackTrace: err.stackTrace,
      withScope: (scope) {
        scope.setContexts('http_error', {
          'url': err.requestOptions.uri.toString(),
          'method': err.requestOptions.method,
          'status_code': err.response?.statusCode,
          'request_payload': _truncatePayload(err.requestOptions.data),
          'response_data': _truncatePayload(err.response?.data),
          'error_message': err.message,
          'dio_exception_details': err.toString(),
        });
      },
    );

    // Also add breadcrumb for the error
    Sentry.addBreadcrumb(Breadcrumb(
      category: 'http.error',
      type: 'http',
      level: SentryLevel.error,
      message:
          '${err.response?.statusCode ?? 'ERROR'} ${err.requestOptions.method} ${err.requestOptions.uri}',
      data: {
        'url': err.requestOptions.uri.toString(),
        'method': err.requestOptions.method,
        'status_code': err.response?.statusCode,
        'error': err.message,
        'request_payload': _truncatePayload(err.requestOptions.data),
        'response_data': _truncatePayload(err.response?.data),
      },
    ));

    // Also log to console for debugging
    print(
        '[HTTP] ✗ ${err.response?.statusCode ?? 'ERROR'} ${err.requestOptions.method} ${err.requestOptions.uri}');
    print('[HTTP] ✗ Error: ${err.message}');
    if (err.response?.data != null) {
      print('[HTTP] ✗ Response: ${_truncatePayload(err.response?.data)}');
    }

    handler.next(err);
  }

  /// Truncate payload to avoid sending too much data to Sentry
  String _truncatePayload(dynamic data, {int maxLength = 2000}) {
    if (data == null) return 'null';

    try {
      String stringified;
      if (data is String) {
        stringified = data;
      } else if (data is Map || data is List) {
        stringified = jsonEncode(data);
      } else {
        stringified = data.toString();
      }

      if (stringified.length > maxLength) {
        return '${stringified.substring(0, maxLength)}... [TRUNCATED]';
      }
      return stringified;
    } catch (e) {
      return '[Unable to serialize: ${data.runtimeType}]';
    }
  }

  /// Sanitize headers to remove sensitive information
  Map<String, dynamic> _sanitizeHeaders(Map<String, dynamic> headers) {
    final sanitized = Map<String, dynamic>.from(headers);

    // Mask sensitive headers
    const sensitiveKeys = ['authorization', 'cookie', 'x-api-key'];
    for (final key in sensitiveKeys) {
      if (sanitized.containsKey(key)) {
        sanitized[key] = '[REDACTED]';
      }
      // Also check case-insensitive
      final lowerKey = key.toLowerCase();
      sanitized.removeWhere((k, v) {
        if (k.toLowerCase() == lowerKey) {
          sanitized[k] = '[REDACTED]';
          return false;
        }
        return false;
      });
    }

    return sanitized;
  }
}
