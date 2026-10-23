import 'dart:convert';
import 'dart:typed_data';

import 'package:built_collection/built_collection.dart';
import 'package:dio/dio.dart';
import 'package:es_client/es_client.dart';
import 'package:es_platform_mobile/utils/visit_selection.dart';
import 'package:flutter_test/flutter_test.dart';

/// A new site's generated schedule: weekly on Sundays from Sat 2026-10-10 for
/// 30 days, i.e. rounds 1-5. The backend inserts these in one transaction, so
/// they share `createdAt` and the API may return them in any order.
final _round1 = DateTime.utc(2026, 10, 11);
final _schedule = [
  _visit('r1', _round1),
  _visit('r2', DateTime.utc(2026, 10, 18)),
  _visit('r3', DateTime.utc(2026, 10, 25)),
  _visit('r4', DateTime.utc(2026, 11, 1)),
  _visit('r5', DateTime.utc(2026, 11, 8)),
];

VisitResponseData _visit(
  String id,
  DateTime scheduledAt, {
  VisitStatus? status,
  bool isCompleted = false,
}) {
  final createdAt = DateTime.utc(2026, 10, 10, 12);
  return VisitResponseData((b) => b
    ..id = id
    ..site.id = 'site-1'
    ..site.name = 'Demo'
    ..site.siteCode = '5388940'
    ..site.createdAt = createdAt
    ..collector.replace(User((u) => u..id = 'collector-1'))
    ..visitScheduledAt = scheduledAt
    ..visitStatus = status ?? VisitStatus.upcoming
    ..isCompleted = isCompleted
    ..createdAt = createdAt
    ..updatedAt = createdAt
    ..samples = ListBuilder<VisitSampleData>());
}

List<List<T>> _permutations<T>(List<T> items) {
  if (items.length <= 1) return [items];
  return [
    for (var i = 0; i < items.length; i++)
      for (final rest in _permutations([...items]..removeAt(i)))
        [items[i], ...rest],
  ];
}

/// Answers each request with the visits [respond] returns for it and records
/// every outgoing request.
class _VisitsAdapter implements HttpClientAdapter {
  _VisitsAdapter(this.respond, {this.totalPages = 1});

  final List<VisitResponseData> Function(RequestOptions request) respond;
  final int totalPages;
  final requests = <RequestOptions>[];
  RequestOptions? captured;

  @override
  Future<ResponseBody> fetch(
    RequestOptions options,
    Stream<Uint8List>? requestStream,
    Future<void>? cancelFuture,
  ) async {
    captured = options;
    requests.add(options);
    final data = respond(options)
        .map((v) =>
            standardSerializers.serializeWith(VisitResponseData.serializer, v))
        .toList();
    return ResponseBody.fromString(
      jsonEncode({
        'success': true,
        'message': 'ok',
        'data': data,
        'page': 1,
        'limit': 10,
        'total': data.length,
        'totalPages': totalPages,
      }),
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
  group('pickEarliestUpcomingVisit', () {
    test('picks round 1 for every possible response order', () {
      final orders = _permutations(_schedule);
      expect(orders, hasLength(120));

      for (final order in orders) {
        expect(pickEarliestUpcomingVisit(order)?.id, 'r1',
            reason: 'order: ${order.map((v) => v.id).join(', ')}');
      }
    });

    test('picks round 1 when the API returns round 2 or round 5 first', () {
      final round2First = [
        _schedule[1],
        _schedule[0],
        ..._schedule.skip(2),
      ];
      final round5First = _schedule.reversed.toList();

      expect(pickEarliestUpcomingVisit(round2First)?.id, 'r1');
      expect(pickEarliestUpcomingVisit(round5First)?.id, 'r1');
    });

    test('skips completed and non-upcoming visits even when earlier', () {
      final visits = [
        _visit('r5', DateTime.utc(2026, 11, 8)),
        _visit('done', DateTime.utc(2026, 10, 4), isCompleted: true),
        _visit('overdue', DateTime.utc(2026, 10, 5),
            status: VisitStatus.overdue),
        _visit('skipped', DateTime.utc(2026, 10, 6),
            status: VisitStatus.skipped),
        _visit('r2', DateTime.utc(2026, 10, 18)),
      ];

      expect(pickEarliestUpcomingVisit(visits)?.id, 'r2');
    });

    test('breaks a scheduledAt tie on id regardless of order', () {
      final a = _visit('a', _round1);
      final b = _visit('b', _round1);

      expect(pickEarliestUpcomingVisit([a, b])?.id, 'a');
      expect(pickEarliestUpcomingVisit([b, a])?.id, 'a');
    });

    test('returns null when nothing is eligible', () {
      expect(pickEarliestUpcomingVisit(const <VisitResponseData>[]), isNull);
      expect(
        pickEarliestUpcomingVisit([
          _visit('done', _round1, isCompleted: true),
          _visit('overdue', _round1, status: VisitStatus.overdue),
        ]),
        isNull,
      );
    });
  });

  group('fetchUpcomingVisits', () {
    late EsClient client;
    late _VisitsAdapter adapter;

    setUp(() {
      client = EsClient(basePathOverride: 'https://example.test/api');
      adapter = _VisitsAdapter((_) => _schedule.reversed.toList());
      client.dio.httpClientAdapter = adapter;
    });

    test('asks for the site\'s upcoming visits so paging starts at round 1',
        () async {
      await fetchUpcomingVisits(client, projectId: 'PNIAW2', siteId: 'site-1');

      final request = adapter.captured!;
      expect(request.path, endsWith('/projects/PNIAW2/visits'));
      expect(request.queryParameters['siteId'], 'site-1');
      expect(request.queryParameters['visitStatus'], 'upcoming');
    });

    test('returns every upcoming visit in the response', () async {
      final visits = await fetchUpcomingVisits(client,
          projectId: 'PNIAW2', siteId: 'site-1');

      expect(visits.map((v) => v.id), ['r5', 'r4', 'r3', 'r2', 'r1']);
    });
  });

  group('pickEarliestOverdueVisit', () {
    // The plan's rounds from 14 Sep, read on 14 Oct: all are overdue.
    final overdueRounds = [
      _visit('r1', DateTime.utc(2026, 9, 14)),
      _visit('r2', DateTime.utc(2026, 9, 21)),
      _visit('r3', DateTime.utc(2026, 9, 28)),
      _visit('r4', DateTime.utc(2026, 10, 5)),
      _visit('r5', DateTime.utc(2026, 10, 12)),
    ];
    final today = _queuedAt(DateTime(2026, 10, 14, 10));

    test('picks round 1 for every possible response order', () {
      for (final order in _permutations(overdueRounds)) {
        expect(pickEarliestOverdueVisit(order, today)?.id, 'r1',
            reason: 'order: ${order.map((v) => v.id).join(', ')}');
      }
    });

    test('ignores completed, skipped and not-yet-due visits', () {
      final visits = [
        _visit('done', DateTime.utc(2026, 9, 1), isCompleted: true),
        _visit('skipped', DateTime.utc(2026, 9, 2),
            status: VisitStatus.skipped),
        _visit('today', DateTime.utc(2026, 10, 14)),
        _visit('later', DateTime.utc(2026, 10, 20)),
        _visit('r3', DateTime.utc(2026, 9, 28)),
      ];

      expect(pickEarliestOverdueVisit(visits, today)?.id, 'r3');
    });

    test('a stored overdue status counts as overdue too', () {
      final visits = [_visit('r1', _round1, status: VisitStatus.overdue)];

      expect(pickEarliestOverdueVisit(visits, today)?.id, 'r1');
    });

    test('returns null when no visit is overdue', () {
      expect(
          pickEarliestOverdueVisit(const <VisitResponseData>[], today), isNull);
      expect(
        pickEarliestOverdueVisit(
            [_visit('today', DateTime.utc(2026, 10, 14))], today),
        isNull,
      );
    });
  });

  group('pickVisitForQueuedVisit', () {
    final overdue = [
      _visit('r1', DateTime.utc(2026, 9, 14)),
      _visit('r2', DateTime.utc(2026, 9, 21)),
    ];
    final todaysVisit = _visit('today', DateTime.utc(2026, 10, 14));
    final collected = _queuedAt(DateTime(2026, 10, 14, 11));

    test('a visit from site creation attaches to the earliest overdue round',
        () {
      final picked = pickVisitForQueuedVisit(
        attachToOverdue: true,
        overdue: overdue,
        upcoming: [todaysVisit],
        queuedAt: collected,
      );

      expect(picked?.id, 'r1');
    });

    test('a visit from site creation with no overdue round merges into the day',
        () {
      final picked = pickVisitForQueuedVisit(
        attachToOverdue: true,
        overdue: const [],
        upcoming: [todaysVisit],
        queuedAt: collected,
      );

      expect(picked?.id, 'today');
    });

    test('any other visit still merges only into the visit on its day', () {
      final picked = pickVisitForQueuedVisit(
        attachToOverdue: false,
        overdue: overdue,
        upcoming: [todaysVisit],
        queuedAt: collected,
      );

      expect(picked?.id, 'today');
    });

    test('a site starting in the future is not merged into', () {
      // Current builds queue no visit for such a site (planStartsAfterToday).
      // One queued by an older build is not merged into a later day's visit.
      final picked = pickVisitForQueuedVisit(
        attachToOverdue: true,
        overdue: const [],
        upcoming: [_visit('start', DateTime.utc(2026, 10, 16))],
        queuedAt: collected,
      );

      expect(picked, isNull);
    });

    test('returns null for an unreadable queued time', () {
      expect(
        pickVisitForQueuedVisit(
          attachToOverdue: true,
          overdue: overdue,
          upcoming: [todaysVisit],
          queuedAt: null,
        ),
        isNull,
      );
    });
  });

  group('planStartsAfterToday', () {
    // A local wall-clock time, passed as UTC the way create_site does.
    final now = DateTime(2026, 10, 15, 11).toUtc();

    test('a plan starting tomorrow or later starts after today', () {
      expect(planStartsAfterToday(DateTime(2026, 10, 16), now), isTrue);
      expect(planStartsAfterToday(DateTime(2026, 10, 20), now), isTrue);
    });

    test('a plan starting today or earlier does not', () {
      expect(planStartsAfterToday(DateTime(2026, 10, 15), now), isFalse);
      expect(planStartsAfterToday(DateTime(2026, 9, 15), now), isFalse);
    });

    test('compares calendar days, not times', () {
      // The form's default start is the moment it opened, not midnight.
      expect(
          planStartsAfterToday(DateTime(2026, 10, 15, 23, 59), now), isFalse);
      // At 23:59, tomorrow's start is still later; at 00:01 it is today.
      expect(
          planStartsAfterToday(
              DateTime(2026, 10, 16), DateTime(2026, 10, 15, 23, 59).toUtc()),
          isTrue);
      expect(
          planStartsAfterToday(
              DateTime(2026, 10, 16), DateTime(2026, 10, 16, 0, 1).toUtc()),
          isFalse);
    });

    test('no start date is not later', () {
      expect(planStartsAfterToday(null, now), isFalse);
    });
  });

  group('fetchOverdueVisits', () {
    late EsClient client;

    setUp(() {
      client = EsClient(basePathOverride: 'https://example.test/api');
    });

    test('asks for the site\'s overdue visits, 100 to a page', () async {
      final adapter = _VisitsAdapter((_) => const []);
      client.dio.httpClientAdapter = adapter;

      await fetchOverdueVisits(client, projectId: 'PNIAW2', siteId: 'site-1');

      final request = adapter.captured!;
      expect(request.queryParameters['siteId'], 'site-1');
      expect(request.queryParameters['visitStatus'], 'overdue');
      expect(request.queryParameters['limit'].toString(), '100');
    });

    test('reads every page, so the earliest round on the last page is found',
        () async {
      // Newest first, as the backend lists overdue visits: round 1 is last.
      final pages = {
        '1': [_visit('r5', DateTime.utc(2026, 10, 12))],
        '2': [_visit('r4', DateTime.utc(2026, 10, 5))],
        '3': [_visit('r1', DateTime.utc(2026, 9, 14))],
      };
      final adapter = _VisitsAdapter(
        (request) => pages[request.queryParameters['page'].toString()] ?? [],
        totalPages: 3,
      );
      client.dio.httpClientAdapter = adapter;

      final visits = await fetchOverdueVisits(client,
          projectId: 'PNIAW2', siteId: 'site-1');

      expect(adapter.requests, hasLength(3));
      expect(visits.map((v) => v.id), ['r5', 'r4', 'r1']);
      expect(
        pickEarliestOverdueVisit(visits, _queuedAt(DateTime(2026, 10, 14, 10)))
            ?.id,
        'r1',
      );
    });
  });

  // These build each queued visit from a local wall-clock time and store it
  // the way createLocalVisit() does, so they hold in any time zone. Run them
  // with TZ=Asia/Kolkata too: there, 00:30 local is the previous day in UTC.
  group('pickSameDayUpcomingVisit', () {
    // The site's generated schedule, stored at 00:00 UTC of each day.
    final startsToday = [
      _visit('start', DateTime.utc(2026, 10, 10)), // Saturday
      _visit('mon-1', DateTime.utc(2026, 10, 12)),
      _visit('mon-2', DateTime.utc(2026, 10, 19)),
    ];
    final startsTomorrow = [
      _visit('start', DateTime.utc(2026, 10, 11)), // Sunday
      _visit('sun-2', DateTime.utc(2026, 10, 18)),
    ];

    test('site starting today: merges into its generated start-date visit', () {
      final collected = _queuedAt(DateTime(2026, 10, 10, 10));

      expect(pickSameDayUpcomingVisit(startsToday, collected)?.id, 'start');
    });

    test('site starting tomorrow: today\'s visit does not merge into it', () {
      final collected = _queuedAt(DateTime(2026, 10, 10, 10));

      expect(pickSameDayUpcomingVisit(startsTomorrow, collected), isNull);
    });

    test('collected at 00:30 still merges into that day\'s start-date visit',
        () {
      // In IST this is 19:00 UTC on the 9th; the UTC date would miss it.
      final collected = _queuedAt(DateTime(2026, 10, 10, 0, 30));

      expect(pickSameDayUpcomingVisit(startsToday, collected)?.id, 'start');
    });

    test('collected at 23:59 merges into that day, not the next day', () {
      final collected = _queuedAt(DateTime(2026, 10, 10, 23, 59));

      expect(
        pickSameDayUpcomingVisit(
                [...startsToday, _visit('next', DateTime.utc(2026, 10, 11))],
                collected)
            ?.id,
        'start',
      );
      expect(pickSameDayUpcomingVisit(startsTomorrow, collected), isNull);
    });

    test('collected just after midnight does not merge into the day before',
        () {
      final collected = _queuedAt(DateTime(2026, 10, 11, 0, 15));

      expect(
        pickSameDayUpcomingVisit(
            [_visit('start', DateTime.utc(2026, 10, 10))], collected),
        isNull,
      );
    });

    test('reads a generated visit as its UTC date in every time zone', () {
      // West of UTC, 2026-10-10T00:00Z is the evening of the 9th locally.
      final collected = _queuedAt(DateTime(2026, 10, 10, 20));

      expect(pickSameDayUpcomingVisit(startsToday, collected)?.id, 'start');
    });

    test('reads a phone-posted server visit on its local day', () {
      final evening = _visit('evening', DateTime(2026, 10, 10, 23, 30));
      final nextMorning = _visit('next', DateTime(2026, 10, 11, 0, 30));

      expect(
        pickSameDayUpcomingVisit(
                [nextMorning, evening], _queuedAt(DateTime(2026, 10, 10, 8)))
            ?.id,
        'evening',
      );
    });

    test('offline: a visit synced days later does not merge into a later one',
        () {
      // Collected on the start date, synced on Monday the 12th: the backend's
      // upcoming list no longer includes the 10th.
      final collected = _queuedAt(DateTime(2026, 10, 10, 10));

      expect(pickSameDayUpcomingVisit(startsToday.skip(1), collected), isNull);
    });

    test('skips a same-day visit that is completed or no longer upcoming', () {
      final collected = _queuedAt(DateTime(2026, 10, 10, 10));

      expect(
        pickSameDayUpcomingVisit([
          _visit('done', DateTime.utc(2026, 10, 10), isCompleted: true),
          _visit('skipped', DateTime.utc(2026, 10, 10),
              status: VisitStatus.skipped),
          ...startsToday.skip(1),
        ], collected),
        isNull,
      );
    });

    test('returns null for an unreadable queued time', () {
      expect(pickSameDayUpcomingVisit(startsToday, null), isNull);
    });
  });

  group('pickVisitScheduledAt', () {
    test('matches a microsecond capture time to the millisecond stored', () {
      final queued = DateTime.parse('2026-10-11T09:30:00.250123Z');
      final stored = _visit('dup', DateTime.utc(2026, 10, 11, 9, 30, 0, 250));

      expect(pickVisitScheduledAt([..._schedule, stored], queued)?.id, 'dup');
    });

    test('ignores another millisecond and visits that are no longer open', () {
      final queued = DateTime.utc(2026, 10, 11, 9, 30, 0, 250);

      expect(
        pickVisitScheduledAt([
          _visit('off-by-1ms', DateTime.utc(2026, 10, 11, 9, 30, 0, 251)),
          _visit('done', queued, isCompleted: true),
          _visit('skipped', queued, status: VisitStatus.skipped),
        ], queued),
        isNull,
      );
    });
  });

  group('fetchFallbackVisit', () {
    /// Serves [upcoming] for `visitStatus=upcoming` and [all] otherwise, the
    /// way the backend answers the two lookups.
    ({EsClient client, _VisitsAdapter adapter}) serve({
      required List<VisitResponseData> all,
      required List<VisitResponseData> upcoming,
    }) {
      final adapter = _VisitsAdapter((request) =>
          request.queryParameters['visitStatus'] == 'upcoming'
              ? upcoming
              : all);
      final client = EsClient(basePathOverride: 'https://example.test/api')
        ..dio.httpClientAdapter = adapter;
      return (client: client, adapter: adapter);
    }

    test(
        'lost POST response: recovers the visit it created rather than an '
        'earlier slot the same day', () async {
      // Captured on the round-1 day, after that slot's 00:00 UTC start. The
      // POST created `dup`, then its response was lost.
      const queued = '2026-10-11T09:30:00.250123Z';
      final dup = _visit('dup', DateTime.utc(2026, 10, 11, 9, 30, 0, 250));
      final server = serve(
        all: [dup, ..._schedule.reversed],
        upcoming: [_schedule.first, dup, ..._schedule.skip(1)],
      );

      final visit = await fetchFallbackVisit(server.client,
          projectId: 'PNIAW2', siteId: 'site-1', queuedScheduledAt: queued);

      expect(visit?.id, 'dup');
      expect(server.adapter.requests, hasLength(1));
      expect(
          server.adapter.requests.single.queryParameters['siteId'], 'site-1');
      expect(
          server.adapter.requests.single.queryParameters
              .containsKey('visitStatus'),
          isFalse);
    });

    test('lost POST response: recovers a visit queued on an earlier day',
        () async {
      // Captured offline two days before round 1, so the backend's upcoming
      // filter (scheduled today or later) would drop it.
      const queued = '2026-10-09T15:00:00.000Z';
      final dup = _visit('dup', DateTime.utc(2026, 10, 9, 15));
      final server =
          serve(all: [dup, ..._schedule.reversed], upcoming: _schedule);

      final visit = await fetchFallbackVisit(server.client,
          projectId: 'PNIAW2', siteId: 'site-1', queuedScheduledAt: queued);

      expect(visit?.id, 'dup');
    });

    test('falls back to the upcoming visit on the day the visit was collected',
        () async {
      // 09:30 UTC on round 1's day is the same local date from UTC-9 to UTC+14.
      const queued = '2026-10-11T09:30:00.250123Z';
      final server = serve(
        all: _schedule.reversed.toList(),
        upcoming: _schedule.reversed.toList(),
      );

      final visit = await fetchFallbackVisit(server.client,
          projectId: 'PNIAW2', siteId: 'site-1', queuedScheduledAt: queued);

      expect(visit?.id, 'r1');
      expect(server.adapter.requests, hasLength(2));
      expect(server.adapter.requests.last.queryParameters['visitStatus'],
          'upcoming');
    });

    test(
        'site starting tomorrow: with nothing recovered, keeps the visit '
        'queued instead of falling back to tomorrow\'s visit', () async {
      // Round 1 is on the 11th; this visit was collected on the 10th.
      final queued = _queuedAt(DateTime(2026, 10, 10, 10)).toIso8601String();
      final server = serve(
        all: _schedule.reversed.toList(),
        upcoming: _schedule.reversed.toList(),
      );

      final visit = await fetchFallbackVisit(server.client,
          projectId: 'PNIAW2', siteId: 'site-1', queuedScheduledAt: queued);

      expect(visit, isNull);
    });

    test('collected at 00:30: falls back to that day\'s start-date visit',
        () async {
      // In IST this is queued as 19:00 UTC on the 10th, the day before.
      final queued = _queuedAt(DateTime(2026, 10, 11, 0, 30)).toIso8601String();
      final server = serve(
        all: _schedule.reversed.toList(),
        upcoming: _schedule.reversed.toList(),
      );

      final visit = await fetchFallbackVisit(server.client,
          projectId: 'PNIAW2', siteId: 'site-1', queuedScheduledAt: queued);

      expect(visit?.id, 'r1');
    });

    test('every retry recovers the same visit the lost POST created', () async {
      const queued = '2026-10-11T09:30:00.250123Z';
      final dup = _visit('dup', DateTime.utc(2026, 10, 11, 9, 30, 0, 250));
      final server = serve(
        all: [dup, ..._schedule.reversed],
        upcoming: [_schedule.first, dup, ..._schedule.skip(1)],
      );

      final ids = [
        for (var attempt = 0; attempt < 3; attempt++)
          (await fetchFallbackVisit(server.client,
                  projectId: 'PNIAW2',
                  siteId: 'site-1',
                  queuedScheduledAt: queued))
              ?.id,
      ];

      expect(ids, ['dup', 'dup', 'dup']);
    });

    test('an unreadable queued time keeps the visit queued without a lookup',
        () async {
      final server =
          serve(all: _schedule.reversed.toList(), upcoming: _schedule);

      final visit = await fetchFallbackVisit(server.client,
          projectId: 'PNIAW2', siteId: 'site-1', queuedScheduledAt: 'garbled');

      expect(visit, isNull);
      expect(server.adapter.requests, isEmpty);
    });
  });
}

/// A visit created on the phone at the local wall-clock time [collectedAt],
/// read back from the sync queue the way createLocalVisit() stores it.
DateTime _queuedAt(DateTime collectedAt) =>
    DateTime.parse(collectedAt.toUtc().toIso8601String());
