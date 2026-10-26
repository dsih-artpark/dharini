// ignore_for_file: deprecated_member_use
import 'dart:collection';
import 'dart:convert';
import 'dart:typed_data';

import 'package:dio/dio.dart';
import 'package:es_platform_mobile/interceptors/sentry_dio_interceptor.dart';
import 'package:es_platform_mobile/utils/sentry_scrubber.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

const _token =
    'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTYifQ.c2lnbmF0dXJlLXZhbHVl';

/// A map that cannot be read, standing in for any data the scrubber fails on.
class _UnreadableMap extends MapBase<String, dynamic> {
  @override
  dynamic operator [](Object? key) => throw StateError('unreadable');

  @override
  void operator []=(String key, dynamic value) {}

  @override
  void clear() {}

  @override
  Iterable<String> get keys => throw StateError('unreadable');

  @override
  dynamic remove(Object? key) => null;
}

/// Answers every request with [status] and [headers]; no network.
class _StatusAdapter implements HttpClientAdapter {
  _StatusAdapter(this.status, {this.headers = const {}});

  final int status;
  final Map<String, List<String>> headers;

  @override
  Future<ResponseBody> fetch(
    RequestOptions options,
    Stream<Uint8List>? requestStream,
    Future<void>? cancelFuture,
  ) async {
    return ResponseBody.fromString(
      jsonEncode({'message': 'Unauthorized'}),
      status,
      headers: {
        Headers.contentTypeHeader: [Headers.jsonContentType],
        ...headers,
      },
    );
  }

  @override
  void close({bool force = false}) {}
}

void main() {
  group('SentryScrubber.maskText', () {
    test('masks emails, phone numbers, OTP-like digits, JWTs and bearer tokens',
        () {
      final out = SentryScrubber.maskText(
        'user a.b+c@example.org phone 9876543210 or +91 98765 43210 '
        'otp 482913 jwt $_token Bearer abc.def',
      );
      expect(out, isNot(contains('example.org')));
      expect(out, isNot(contains('9876543210')));
      expect(out, isNot(contains('98765')));
      expect(out, isNot(contains('482913')));
      expect(out, isNot(contains('eyJ')));
      expect(out, isNot(contains('abc.def')));
    });

    test('keeps UUIDs so records can still be traced', () {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      expect(SentryScrubber.maskText('site $id not found'),
          'site $id not found');
    });

    test('keeps short numbers and plain words', () {
      expect(SentryScrubber.maskText('Visit 12 of 40 failed: 404'),
          'Visit 12 of 40 failed: 404');
    });

    test('truncates long text', () {
      final out = SentryScrubber.maskText('x' * 1000, maxLength: 50);
      expect(out.length, lessThan(80));
      expect(out, endsWith('[TRUNCATED]'));
    });
  });

  group('SentryScrubber.routeOf', () {
    test('drops host and query, replaces ids', () {
      final uri = Uri.parse(
          'https://api.example.org/api/sites/123e4567-e89b-12d3-a456-426614174000/visits/42?phone=9876543210');
      expect(SentryScrubber.routeOf(uri), '/api/sites/:id/visits/:id');
    });

    test('replaces an email or hex token used as a path segment', () {
      expect(
          SentryScrubber.routeOf(Uri.parse('https://x.org/users/a@b.org')),
          '/users/:id');
      expect(
          SentryScrubber.routeOf(
              Uri.parse('https://x.org/files/0123456789abcdef0123')),
          '/files/:id');
    });

    test('never reports invite tokens or free-form tails', () {
      expect(
          SentryScrubber.routeOf(
              Uri.parse('https://x.org/invites/accept/Xk3pQ9aB')),
          '/invites/:id/:id');
      expect(
          SentryScrubber.routeOf(
              Uri.parse('https://x.org/invites/accept/abcdefgh')),
          '/invites/:id/:id');
      expect(
          SentryScrubber.routeOf(
              Uri.parse('https://x.org/ml/birds/owner-photo/me.jpg')),
          '/ml/birds/:id/:id');
    });

    test('keeps fixed hyphenated route words', () {
      expect(
          SentryScrubber.routeOf(Uri.parse(
              'https://x.org/projects/42/samples/7/edit-details/extraction')),
          '/projects/:id/samples/:id/edit-details/extraction');
    });
  });

  group('SentryScrubber.describeShape', () {
    test('reports field names and types but never values', () {
      final shape = SentryScrubber.describeShape({
        'name': 'Ramesh Kumar Farm',
        'siteOwnerNumber': '9876543210',
        'pinCode': 560001,
        'latitude': 12.971598,
        'photos': ['a.jpg', 'b.jpg'],
        'address': null,
        'owner': {'email': 'owner@example.org'},
      });
      expect(shape, contains('name: string(17)'));
      expect(shape, contains('siteOwnerNumber: string(10)'));
      expect(shape, contains('pinCode: number'));
      expect(shape, contains('photos: list(2)[string(5)]'));
      expect(shape, contains('address: null'));
      expect(shape, contains('owner: {email: string(17)}'));
      for (final secret in [
        'Ramesh',
        '9876543210',
        '560001',
        '12.9715',
        'a.jpg',
        'owner@example.org',
      ]) {
        expect(shape, isNot(contains(secret)));
      }
    });

    test('reads JSON strings and falls back for non-JSON strings', () {
      expect(SentryScrubber.describeShape(jsonEncode({'otp': 123456})),
          '{otp: number}');
      expect(SentryScrubber.describeShape('{not json'), 'string(9)');
    });

    test('lists only the keys of multipart forms', () {
      final form = FormData.fromMap({
        'caption': 'private caption',
        'file': MultipartFile.fromBytes([1, 2, 3], filename: 'me.jpg'),
      });
      final shape = SentryScrubber.describeShape(form);
      expect(shape, contains('caption'));
      expect(shape, contains('file'));
      expect(shape, isNot(contains('private caption')));
      expect(shape, isNot(contains('me.jpg')));
    });

    test('stays bounded for deep and large input', () {
      dynamic deep = 'leaf';
      for (var i = 0; i < 30; i++) {
        deep = {'k': deep};
      }
      final wide = {for (var i = 0; i < 500; i++) 'field$i': 'value'};
      expect(SentryScrubber.describeShape(deep), contains('{...}'));
      expect(SentryScrubber.describeShape(wide).length, lessThan(1100));
    });
  });

  group('beforeBreadcrumb / beforeSend', () {
    test('mask message and data of a breadcrumb', () {
      final crumb = SentryScrubber.scrubBreadcrumb(
        Breadcrumb(
          message: 'login for a@b.org',
          data: {
            'token': _token,
            'nested': {'phone': '9876543210'},
            'list': ['otp 482913'],
            'count': 3,
          },
        ),
        Hint(),
      )!;
      final text = jsonEncode(crumb.toJson());
      expect(text, isNot(contains('a@b.org')));
      expect(text, isNot(contains('eyJ')));
      expect(text, isNot(contains('9876543210')));
      expect(text, isNot(contains('482913')));
      expect(crumb.data!['count'], 3);
    });

    test('mask exceptions, contexts, extra and breadcrumbs; drop user/request',
        () {
      final event = SentryEvent(
        message: SentryMessage('failed for a@b.org'),
        exceptions: [
          SentryException(type: 'Exception', value: 'otp 482913 rejected'),
        ],
        breadcrumbs: [Breadcrumb(message: 'phone 9876543210')],
        user: SentryUser(id: '1', email: 'a@b.org', ipAddress: '1.2.3.4'),
        request: SentryRequest(
            url: 'https://x.org/a?phone=9876543210', data: {'otp': 482913}),
      );
      event.contexts['http_error'] = {'response': _token};
      event.extra = {'note': 'call 9876543210'};

      final out = SentryScrubber.scrubEvent(event, Hint())!;

      expect(out.user, isNull);
      expect(out.request, isNull);
      expect(out.exceptions!.first.type, 'Exception');
      final text = jsonEncode(out.toJson());
      for (final secret in [
        'a@b.org',
        '482913',
        '9876543210',
        'eyJ',
        '1.2.3.4',
      ]) {
        expect(text, isNot(contains(secret)), reason: secret);
      }
    });
  });

  group('exception text', () {
    SentryException scrub(String type, String value) {
      final event = SentryEvent(
          exceptions: [SentryException(type: type, value: value)]);
      return SentryScrubber.scrubEvent(event, Hint())!.exceptions!.single;
    }

    test('a FormatException keeps its message but not the quoted input', () {
      final out = scrub('FormatException',
          'Unexpected character (at character 3)\n{"owner":"Ramesh Kumar"}\n  ^');
      expect(out.value, 'Unexpected character (at character 3)');
    });

    test('other exceptions keep their full message, masked', () {
      final message = 'Photo upload failed: ${'reason ' * 60}call 9876543210';
      final out = scrub('Exception', message);
      expect(out.value, contains('reason reason'));
      expect(out.value, isNot(contains('9876543210')));
      expect(out.value!.length, greaterThan(200));
    });

    test('an extremely long message is still bounded', () {
      expect(scrub('Exception', 'x' * 5000).value!.length, lessThan(1100));
    });
  });

  group('personal data that is not a pattern', () {
    test('masks the value of sensitive fields in free text, keeps the names',
        () {
      const cases = {
        '{siteOwnerName: Ramesh Kumar, village: Hosur, latitude: 12.97165, siteType: farm}':
            '{siteOwnerName: [Filtered], village: [Filtered], latitude: [Filtered], siteType: farm}',
        'suspectDiseaseData: [ASF, FMD], comment: owner reports 3 pigs died':
            'suspectDiseaseData: [Filtered], comment: [Filtered]',
        '{"phone":9876543210,"otp":482913}': '{"phone":[Filtered],"otp":[Filtered]}',
      };
      cases.forEach((input, expected) {
        expect(SentryScrubber.maskText(input), expected, reason: input);
      });
    });

    test('masks URLs, coordinates and spaced phone numbers', () {
      const cases = {
        'GET https://bkt.s3.ap-south-1.amazonaws.com/sites/a.jpg?X-Amz-Credential=AKIAIOSFODNN7EXAMPLE%2F20261026&X-Amz-Signature=ab12 failed':
            'GET [Filtered] failed',
        'at 12.971599,77.594566': 'at [Filtered],[Filtered]',
        'call 98765 43210': 'call [Filtered]',
      };
      cases.forEach((input, expected) {
        expect(SentryScrubber.maskText(input), expected, reason: input);
      });
    });

    test('keeps local record IDs so sync failures can be traced', () {
      expect(SentryScrubber.maskText('Skipped submission local-1729912345678'),
          'Skipped submission local-1729912345678');
    });

    test('masks sensitive fields by key whatever the type, keeps the rest', () {
      final crumb = SentryScrubber.scrubBreadcrumb(
        Breadcrumb(category: 'sync', data: {
          'siteOwnerName': 'Ramesh',
          'latitude': 12.9716,
          'photos': ['https://bkt.s3.amazonaws.com/sites/a.jpg'],
          'nested': {
            'diseaseQuestionnaireData': {'q1': 'yes'},
          },
          'original': 'local-1729912345678',
          'photo_count': 3,
          'payload_shape': '{name: string(12), latitude: number}',
        }),
        Hint(),
      )!;
      expect(crumb.data, {
        'siteOwnerName': '[Filtered]',
        'latitude': '[Filtered]',
        'photos': '[Filtered]',
        'nested': {'diseaseQuestionnaireData': '[Filtered]'},
        'original': 'local-1729912345678',
        'photo_count': 3,
        'payload_shape': '{name: string(12), latitude: number}',
      });
    });

    test('masks sensitive tags', () {
      final event = SentryEvent(tags: {
        'http.route': 'POST /auth/verify-otp',
        'owner_phone': '9876543210',
      });
      expect(SentryScrubber.scrubEvent(event, Hint())!.tags, {
        'http.route': 'POST /auth/verify-otp',
        'owner_phone': '[Filtered]',
      });
    });

    test('route words may hold short numbers; barcodes and UUIDs never pass',
        () {
      String route(String url) => SentryScrubber.routeOf(Uri.parse(url));
      expect(route('https://x.org/statistics/home-last-30-days'),
          '/statistics/home-last-30-days');
      expect(route('https://x.org/projects/42/validate-barcode/bmm-001'),
          '/projects/:id/validate-barcode/:id');
      expect(route('https://x.org/sites/abcdefab-1234-5678-9012-345678901234'),
          '/sites/:id');
    });
  });

  group('large error messages', () {
    // Masking runs on the UI thread when an error is reported. Before the scan
    // was bounded, a 20,000-character unbroken string took over 6 seconds,
    // long enough for Android to report the app as not responding.
    const budget = Duration(milliseconds: 500);
    const row = {
      'siteOwnerName': 'Ramesh Kumar',
      'phone': '9876543210',
      'latitude': 12.971599,
      'comment': 'pigs died',
    };

    final blobs = <String, String>{
      'one 100,000-character word': 'x' * 100000,
      'a 64,000-character hex dump': 'ab12' * 16000,
      'a 200 KB base64 image':
          base64Encode(List.generate(150000, (i) => (i * 7919) % 256)),
      'a 200 KB JSON body with personal data':
          jsonEncode(List.filled(2000, row)),
    };

    blobs.forEach((label, blob) {
      test('masks $label within the time budget', () {
        final watch = Stopwatch()..start();
        final out = SentryScrubber.maskText(blob, maxLength: 1000);
        expect(watch.elapsed, lessThan(budget));
        expect(out.length, lessThan(1100));
        expect(out, endsWith('[TRUNCATED]'));
        for (final secret in ['Ramesh', '9876543210', '12.971599', 'pigs']) {
          expect(out, isNot(contains(secret)), reason: secret);
        }
      });
    });

    test('scrubs an event with a huge exception message within the budget', () {
      final event = SentryEvent(exceptions: [
        SentryException(
          type: 'Exception',
          value: 'upload for a@b.org failed: ${'ab12' * 50000}',
        ),
      ]);
      final watch = Stopwatch()..start();
      final out = SentryScrubber.scrubEvent(event, Hint())!;
      expect(watch.elapsed, lessThan(budget));
      expect(out.exceptions!.single.value, startsWith('upload for [Filtered]'));
      expect(out.exceptions!.single.value!.length, lessThan(1100));
    });

    test('a value that starts just before the cut is still masked whole', () {
      final lead = 'x' * 290;
      for (final secret in [
        _token,
        'asha.kumar@example.org',
        '9876543210',
        'https://bkt.s3.amazonaws.com/a.jpg?X-Amz-Signature=abcdef',
      ]) {
        final out = SentryScrubber.maskText('$lead $secret ${'y' * 5000}',
            maxLength: 300);
        expect(out, startsWith('$lead [Filtere'), reason: secret);
        expect(out, endsWith('[TRUNCATED]'));
        expect(out, isNot(contains(secret.substring(0, 4))), reason: secret);
      }
    });

    test('text past the scanned part never surfaces when masking shortens it',
        () {
      // The URL ends just before the scan stops, so the email after it is cut
      // in half and could not be recognised.
      final url = 'https://bkt.s3.amazonaws.com/'.padRight(794, 'a');
      final out = SentryScrubber.maskText('$url asha.kumar@example.org',
          maxLength: 300);
      expect(out, '[Filtered]... [TRUNCATED]');
    });
  });

  group('fails closed', () {
    test('a breadcrumb that cannot be scrubbed is dropped', () {
      final crumb = Breadcrumb(
        message: 'phone 9876543210',
        data: {'nested': _UnreadableMap()},
      );
      expect(SentryScrubber.scrubBreadcrumb(crumb, Hint()), isNull);
    });

    test('an event that cannot be scrubbed is dropped', () {
      final event = SentryEvent(exceptions: [
        SentryException(type: 'Exception', value: 'otp 482913 rejected'),
      ]);
      event.contexts['custom'] = _UnreadableMap();
      expect(SentryScrubber.scrubEvent(event, Hint()), isNull);
    });

    test('a bad breadcrumb is left out and the rest of the event is kept', () {
      final event = SentryEvent(breadcrumbs: [
        Breadcrumb(message: 'sync started'),
        Breadcrumb(
          message: 'phone 9876543210',
          data: {'nested': _UnreadableMap()},
        ),
      ]);
      final out = SentryScrubber.scrubEvent(event, Hint())!;
      expect(out.breadcrumbs!.map((b) => b.message), ['sync started']);
    });
  });

  group('SentryDioInterceptor', () {
    test('breadcrumbs carry the route and shape, never values', () async {
      final crumbs = <Breadcrumb>[];
      await Sentry.init((o) {
        o.dsn = 'https://public@example.invalid/1';
        // Collect what would be recorded, without a network transport.
        o.beforeBreadcrumb = (crumb, hint) {
          if (crumb != null) crumbs.add(crumb);
          return null;
        };
      });
      addTearDown(Sentry.close);

      final interceptor = SentryDioInterceptor();
      final options = RequestOptions(
        path: 'https://api.example.org/auth/verify-otp',
        method: 'POST',
        queryParameters: {'phone': '9876543210'},
        data: {'phone': 9876543210, 'otp': 482913},
        headers: {'Authorization': 'Bearer $_token'},
      );
      interceptor.onRequest(options, RequestInterceptorHandler());
      interceptor.onResponse(
        Response(
          requestOptions: options,
          statusCode: 200,
          data: {
            'data': {'accessToken': _token}
          },
        ),
        ResponseInterceptorHandler(),
      );

      expect(crumbs, hasLength(2));
      final text = jsonEncode(crumbs.map((c) => c.toJson()).toList());
      expect(text, contains('/auth/verify-otp'));
      expect(text, contains('accessToken: string('));
      for (final secret in ['9876543210', '482913', 'eyJ', 'Bearer']) {
        expect(text, isNot(contains(secret)), reason: secret);
      }
    });

    test('a repeated x-request-id header does not disturb error handling',
        () async {
      final events = <SentryEvent>[];
      await Sentry.init((o) {
        o.dsn = 'https://public@example.invalid/1';
        o.beforeSend = (event, hint) {
          events.add(event);
          return null;
        };
      });
      addTearDown(Sentry.close);

      int? statusSeenNext;
      final dio = Dio(BaseOptions(baseUrl: 'https://api.example.org'))
        ..httpClientAdapter = _StatusAdapter(401, headers: {
          'x-request-id': ['req-1', 'req-2'],
        })
        ..interceptors.addAll([
          SentryDioInterceptor(),
          // Stands in for AuthInterceptor, which logs out on a 401.
          InterceptorsWrapper(onError: (err, handler) {
            statusSeenNext = err.response?.statusCode;
            handler.next(err);
          }),
        ]);

      await expectLater(
        dio.get<dynamic>('/sites'),
        throwsA(isA<DioException>()
            .having((e) => e.response?.statusCode, 'status', 401)),
      );
      expect(statusSeenNext, 401);

      for (var i = 0; i < 50 && events.isEmpty; i++) {
        await Future<void>.delayed(const Duration(milliseconds: 10));
      }
      expect((events.single.contexts['http_error'] as Map)['request_id'],
          'req-1');
    });
  });
}
