import 'package:built_collection/built_collection.dart';
import 'package:es_client/es_client.dart';
import 'package:es_platform_mobile/utils/visited_by.dart';
import 'package:flutter_test/flutter_test.dart';

User user(String id, [String? firstName]) => User((b) => b
  ..id = id
  ..firstName = firstName);

VisitResponseData visit({List<User>? visitedBy, User? collector}) =>
    VisitResponseData((b) => b
      ..id = 'v1'
      ..visitScheduledAt = DateTime.utc(2026, 11, 5)
      ..visitStatus = VisitStatus.completed
      ..isCompleted = true
      ..createdAt = DateTime.utc(2026, 11, 1)
      ..updatedAt = DateTime.utc(2026, 11, 5)
      ..site.replace(VisitSiteData((s) => s
        ..id = 's1'
        ..name = 'Farm'
        ..createdAt = DateTime.utc(2026, 10, 1)))
      ..visitedBy = visitedBy == null ? null : ListBuilder<User>(visitedBy)
      ..collector = collector?.toBuilder());

void main() {
  group('visitedByIdsFromQueued', () {
    test('reads a list, or the single id an older build queued', () {
      expect(visitedByIdsFromQueued(['u1', 'u2']), ['u1', 'u2']);
      expect(visitedByIdsFromQueued('u1'), ['u1']);
    });

    test('drops blanks and anything that is not an id', () {
      expect(visitedByIdsFromQueued(''), isEmpty);
      expect(visitedByIdsFromQueued(null), isEmpty);
      expect(visitedByIdsFromQueued(['u1', '', 7]), ['u1']);
    });
  });

  group('submissionVisitorIds', () {
    final collectors = [user('u2'), user('u1'), user('u3')];

    test('puts the submitter first, then the ticked collectors in site order',
        () {
      expect(submissionVisitorIds('u1', collectors, {'u3', 'u2'}),
          ['u1', 'u2', 'u3']);
    });

    test('is just the submitter when nobody else is ticked', () {
      expect(submissionVisitorIds('u1', collectors, {}), ['u1']);
    });

    test('ignores ticks for anyone who is not a collector of the site', () {
      expect(submissionVisitorIds('u1', collectors, {'u9'}), ['u1']);
    });
  });

  group('visitorsOf', () {
    test('lists everyone who was at the visit, submitter first', () {
      final visitors = visitorsOf(visit(
        visitedBy: [user('u1'), user('u2')],
        collector: user('c1'),
      ));
      expect(visitors.map((v) => v.id), ['u1', 'u2']);
    });

    test('falls back to the assignee for a visit with no visitors recorded',
        () {
      expect(visitorsOf(visit(collector: user('c1'))).map((v) => v.id),
          ['c1']);
      expect(visitorsOf(visit(visitedBy: [], collector: user('c1')))
          .map((v) => v.id), ['c1']);
    });
  });
}
