import 'dart:convert';
import 'dart:typed_data';

import 'package:dio/dio.dart';
import 'package:es_client/es_client.dart';
import 'package:es_platform_mobile/hooks/api.dart';
import 'package:flutter_test/flutter_test.dart';

/// Captures the outgoing [RequestOptions] and answers with an empty payload so
/// no real network call is made.
class _CapturingAdapter implements HttpClientAdapter {
  RequestOptions? captured;

  @override
  Future<ResponseBody> fetch(
    RequestOptions options,
    Stream<Uint8List>? requestStream,
    Future<void>? cancelFuture,
  ) async {
    captured = options;
    return ResponseBody.fromString(
      jsonEncode({'success': true, 'message': 'ok', 'data': <dynamic>[]}),
      200,
      headers: {
        Headers.contentTypeHeader: [Headers.jsonContentType],
      },
    );
  }

  @override
  void close({bool force = false}) {}
}

void main() {
  late EsClient client;
  late _CapturingAdapter adapter;

  setUp(() {
    client = EsClient(basePathOverride: 'https://example.test/api');
    adapter = _CapturingAdapter();
    client.dio.httpClientAdapter = adapter;
  });

  /// [declaresSecurity] false overrides the generated `secure` extra with an
  /// empty list, standing in for an endpoint whose backend guard was added
  /// after the client was last generated. That is the case `applyAuthToken`
  /// exists to cover, and the only one the generated interceptor misses.
  Future<void> callRegions({bool declaresSecurity = true}) async {
    try {
      await client.getRegionApi().regionControllerFindAll(
            type: 'state',
            select: 'id,name',
            extra: declaresSecurity
                ? null
                : <String, dynamic>{'secure': <Map<String, String>>[]},
          );
    } on DioException {
      // Deserialising the stub payload may fail; only the request matters here.
    }
  }

  test('regions request carries the bearer token', () async {
    applyAuthToken(client, 'test-token');

    await callRegions();

    expect(adapter.captured!.headers['Authorization'], 'Bearer test-token');
  });

  test('token is attached even when the endpoint declares no security',
      () async {
    applyAuthToken(client, 'test-token');

    await callRegions(declaresSecurity: false);

    expect(adapter.captured!.headers['Authorization'], 'Bearer test-token');
  });

  test('clearing the token drops the header', () async {
    applyAuthToken(client, 'test-token');
    applyAuthToken(client, '');

    await callRegions();

    expect(adapter.captured!.headers.containsKey('Authorization'), isFalse);
  });
}
