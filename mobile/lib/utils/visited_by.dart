import 'package:es_client/es_client.dart';

/// Everyone who was at a visit, its submitter first. A visit recorded before
/// visitedBy was filled in shows its assigned collector instead.
List<User> visitorsOf(VisitResponseData visit) {
  final visitors = visit.visitedBy?.toList() ?? const <User>[];
  if (visitors.isNotEmpty) return visitors;
  final collector = visit.collector;
  return collector == null ? const [] : [collector];
}

/// A visitor's full name, falling back to their email.
String visitorName(User user) {
  final name = '${user.firstName ?? ''} ${user.lastName ?? ''}'.trim();
  return name.isNotEmpty ? name : (user.email ?? '');
}

/// Visitor ids as a queued submission holds them: a list since visits have
/// several visitors, a single id (possibly empty) when an older build queued
/// it.
List<String> visitedByIdsFromQueued(Object? value) {
  final ids = value is String ? [value] : (value is List ? value : const []);
  return ids.whereType<String>().where((id) => id.isNotEmpty).toList();
}

/// The ids a submission records as its visitors: the submitter, then the
/// [ticked] collectors in the order the site lists them.
List<String> submissionVisitorIds(
  String submitterId,
  Iterable<User> siteCollectors,
  Set<String> ticked,
) =>
    [
      submitterId,
      ...siteCollectors
          .map((collector) => collector.id)
          .where((id) => id != submitterId && ticked.contains(id)),
    ];
