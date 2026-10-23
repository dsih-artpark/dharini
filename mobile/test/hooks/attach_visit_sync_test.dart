import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'package:built_collection/built_collection.dart';
import 'package:dio/dio.dart';
import 'package:es_client/es_client.dart';
import 'package:es_platform_mobile/hooks/auth.dart';
import 'package:es_platform_mobile/models/pending_submission.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:hive/hive.dart';

/// The site's plan started on Mon 14 Sep and runs weekly, so on 14 Oct all five
/// rounds are overdue and none is upcoming. Newest first, as the backend lists them.
final _rounds = [
  _visit('r5', DateTime.utc(2026, 10, 12)),
  _visit('r4', DateTime.utc(2026, 10, 5)),
  _visit('r3', DateTime.utc(2026, 9, 28)),
  _visit('r2', DateTime.utc(2026, 9, 21)),
  _visit('r1', DateTime.utc(2026, 9, 14)),
];

void main() {
  late Directory dir;
  late Box<dynamic> queue;
  late Box<dynamic> visits;
  late Box<dynamic> visitIdMap;

  setUp(() async {
    dir = Directory.systemTemp.createTempSync('attach_visit_sync');
    Hive.init(dir.path);
    queue = await Hive.openBox('syncQueue');
    visits = await Hive.openBox('visits');
    visitIdMap = await Hive.openBox('visitIdMap');
    await Hive.openBox('sites');
    await Hive.openBox('siteDto');
    await Hive.openBox('siteIdMap');
    await Hive.openBox<PendingVisitSubmission>('pendingSubmissions');
  });

  tearDown(() async {
    await Hive.deleteFromDisk();
    dir.deleteSync(recursive: true);
  });

  // Queued the way createLocalSite and createLocalVisit queue them, by a site
  // created on 14 Oct with a visit attached to the plan's overdue rounds.
  Future<void> queueSiteAndVisit() async {
    final site = CreateSiteDto((b) => b
      ..name = 'Hebbal Farm'
      ..regionId = 'district_572'
      ..latitude = 13.04
      ..longitude = 77.59
      ..collectionCollector = 'u1');
    final visit = CreateVisitDto((b) => b
      ..siteId = 'local-site-1'
      ..collectorId = 'u1'
      ..visitScheduledAt = DateTime(2026, 10, 14, 10).toUtc().toIso8601String()
      ..comment = '');
    await queue.add({
      'type': 'site',
      'id': 'local-site-1',
      'payload':
          standardSerializers.serializeWith(CreateSiteDto.serializer, site),
      'projectId': 'PNIAW2',
    });
    await queue.add({
      'type': 'visit',
      'id': 'local-visit-1',
      'payload':
          standardSerializers.serializeWith(CreateVisitDto.serializer, visit),
      'projectId': 'PNIAW2',
      'attachToOverdue': true,
    });
  }

  EsClient clientFor(_FakeServer server) {
    final api = EsClient(basePathOverride: 'https://example.test/api');
    api.dio.httpClientAdapter = server;
    return api;
  }

  test('a failed overdue lookup keeps the visit queued instead of posting it',
      () async {
    await queueSiteAndVisit();
    final server = _FakeServer(overdue: _rounds, overdueUp: false);

    await syncChangesToServerQueue(clientFor(server), 'PNIAW2');

    expect(server.sitesPosted, hasLength(1), reason: 'the site is created');
    expect(server.visitsPosted, isEmpty,
        reason: 'posting the visit would add a second visit for round 1');
    expect(queue.values.map((e) => e['id']), ['local-visit-1']);
  });

  test('the next run merges the visit into the earliest overdue round',
      () async {
    await queueSiteAndVisit();
    final server = _FakeServer(overdue: _rounds, overdueUp: false);
    final api = clientFor(server);
    await syncChangesToServerQueue(api, 'PNIAW2');

    server.overdueUp = true;
    await syncChangesToServerQueue(api, 'PNIAW2');

    expect(server.sitesPosted, hasLength(1),
        reason: 'the site is not re-posted');
    expect(server.visitsPosted, isEmpty);
    expect(visitIdMap.get('local-visit-1'), 'r1');
    expect(visits.containsKey('r1'), isTrue);
    expect(queue.isEmpty, isTrue);
  });

  test('a visit with no overdue round and no visit today is still posted',
      () async {
    await queueSiteAndVisit();
    final server = _FakeServer(overdue: const [], overdueUp: true);

    await syncChangesToServerQueue(clientFor(server), 'PNIAW2');

    expect(server.visitsPosted, hasLength(1));
    expect(visitIdMap.get('local-visit-1'), 'server-visit-1');
    expect(queue.isEmpty, isTrue);
  });
}

/// Answers the site, visit and overdue requests the sync makes, and records
/// the creates.
class _FakeServer implements HttpClientAdapter {
  _FakeServer({required this.overdue, required this.overdueUp});

  final List<VisitResponseData> overdue;

  /// When false the overdue lookup fails with a 500, as a dropped connection would.
  bool overdueUp;
  final sitesPosted = <RequestOptions>[];
  final visitsPosted = <RequestOptions>[];

  @override
  Future<ResponseBody> fetch(
    RequestOptions options,
    Stream<Uint8List>? requestStream,
    Future<void>? cancelFuture,
  ) async {
    final isPost = options.method == 'POST';
    if (isPost && options.path.endsWith('/sites')) {
      sitesPosted.add(options);
      return _json(201, {
        'success': true,
        'message': 'ok',
        'data': standardSerializers.serializeWith(
          SiteResponseData.serializer,
          SiteResponseData((b) => b
            ..id = 'site-1'
            ..name = 'Hebbal Farm'
            ..createdAt = DateTime.utc(2026, 10, 14)),
        ),
      });
    }
    if (isPost && options.path.endsWith('/visits')) {
      visitsPosted.add(options);
      return _json(201, {
        'success': true,
        'message': 'ok',
        'data': standardSerializers.serializeWith(
          VisitResponseData.serializer,
          _visit('server-visit-1', DateTime.utc(2026, 10, 14)),
        ),
      });
    }
    if (options.queryParameters['visitStatus'] == 'overdue') {
      if (!overdueUp) {
        return _json(500, {'success': false, 'message': 'lookup failed'});
      }
      return _page(overdue);
    }
    return _page(const []);
  }

  @override
  void close({bool force = false}) {}
}

ResponseBody _json(int status, Object body) => ResponseBody.fromString(
      jsonEncode(body),
      status,
      headers: {
        Headers.contentTypeHeader: [Headers.jsonContentType],
      },
    );

ResponseBody _page(List<VisitResponseData> visits) => _json(200, {
      'success': true,
      'message': 'ok',
      'data': [
        for (final visit in visits)
          standardSerializers.serializeWith(
              VisitResponseData.serializer, visit),
      ],
      'page': 1,
      'limit': 100,
      'total': visits.length,
      'totalPages': 1,
    });

VisitResponseData _visit(String id, DateTime scheduledAt) {
  final createdAt = DateTime.utc(2026, 10, 10, 12);
  return VisitResponseData((b) => b
    ..id = id
    ..site.id = 'site-1'
    ..site.name = 'Hebbal Farm'
    ..site.siteCode = '5388940'
    ..site.createdAt = createdAt
    ..collector.replace(User((u) => u..id = 'u1'))
    ..visitScheduledAt = scheduledAt
    ..visitStatus = VisitStatus.upcoming
    ..isCompleted = false
    ..createdAt = createdAt
    ..updatedAt = createdAt
    ..samples = ListBuilder<VisitSampleData>());
}
