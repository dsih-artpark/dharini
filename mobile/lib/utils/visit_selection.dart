import 'package:es_client/es_client.dart';

/// Returns the earliest upcoming, not-yet-completed visit by
/// `visitScheduledAt`, or null when there is none.
///
/// Creating a site makes the backend generate its whole schedule in one
/// transaction, so those visits share `createdAt` and can come back from
/// `GET /visits` in any order. Taking the first eligible item submitted the
/// new site's visit as round 2 or round 5 instead of round 1, so this never
/// trusts response order. Equal schedule times fall back to `id`, matching the
/// backend's `visitScheduledAt ASC, id ASC` ordering for upcoming visits.
VisitResponseData? pickEarliestUpcomingVisit(
    Iterable<VisitResponseData> visits) {
  VisitResponseData? earliest;
  for (final visit in visits) {
    if (visit.visitStatus != VisitStatus.upcoming || visit.isCompleted) {
      continue;
    }
    if (earliest == null || _compareSchedule(visit, earliest) < 0) {
      earliest = visit;
    }
  }
  return earliest;
}

int _compareSchedule(VisitResponseData a, VisitResponseData b) {
  final bySchedule = a.visitScheduledAt.compareTo(b.visitScheduledAt);
  return bySchedule != 0 ? bySchedule : a.id.compareTo(b.id);
}

/// Returns the open visit scheduled at [scheduledAt], or null. Compared to
/// the millisecond: the phone sends microseconds, but the backend truncates
/// to milliseconds when it stores the visit.
VisitResponseData? pickVisitScheduledAt(
    Iterable<VisitResponseData> visits, DateTime scheduledAt) {
  final target = scheduledAt.millisecondsSinceEpoch;
  return pickEarliestUpcomingVisit(
      visits.where((v) => v.visitScheduledAt.millisecondsSinceEpoch == target));
}

/// Returns the open visit scheduled for the calendar day a visit queued at
/// [queuedAt] was collected on, or null when there is none (or [queuedAt] is
/// null). A queued visit must never merge into a visit on another day: a site
/// starting tomorrow would file today's samples under tomorrow's visit.
///
/// The two timestamps mean different things, so each is read on its own
/// terms. [queuedAt] is the moment the visit was created on this phone, so
/// its day is the phone's local date. A generated (planned) server visit is
/// stored at 00:00 UTC of its calendar day, so its day is its UTC date; read
/// in local time it is 05:30 the same day in IST but the evening before west
/// of UTC. A server visit at any other time was posted from a phone and is
/// read like [queuedAt].
VisitResponseData? pickSameDayUpcomingVisit(
    Iterable<VisitResponseData> visits, DateTime? queuedAt) {
  if (queuedAt == null) return null;
  final day = _localDay(queuedAt);
  return pickEarliestUpcomingVisit(
      visits.where((v) => _scheduledDay(v.visitScheduledAt) == day));
}

/// Returns the earliest visit scheduled before the day of [now] that is still
/// open (not completed, not skipped), or null when there is none. These are
/// the overdue rounds of a plan, which are never stored as overdue: a visit
/// nobody completed keeps status `upcoming`, so overdue is read from the date.
VisitResponseData? pickEarliestOverdueVisit(
    Iterable<VisitResponseData> visits, DateTime now) {
  final today = _localDay(now);
  VisitResponseData? earliest;
  for (final visit in visits) {
    if (visit.isCompleted || !_isOpen(visit.visitStatus)) continue;
    if (!_scheduledDay(visit.visitScheduledAt).isBefore(today)) continue;
    if (earliest == null || _compareSchedule(visit, earliest) < 0) {
      earliest = visit;
    }
  }
  return earliest;
}

bool _isOpen(VisitStatus status) =>
    status == VisitStatus.upcoming || status == VisitStatus.overdue;

/// Chooses the server visit a queued visit merges into, or null to post it as
/// a new visit.
///
/// A visit queued by site creation ([attachToOverdue]) is the collector
/// starting now, so it takes the earliest overdue round of the plan, the one
/// being collected, rather than a second visit today. With no overdue round it
/// merges into the visit on the day it was collected, as before.
VisitResponseData? pickVisitForQueuedVisit({
  required bool attachToOverdue,
  required Iterable<VisitResponseData> overdue,
  required Iterable<VisitResponseData> upcoming,
  required DateTime? queuedAt,
}) {
  if (queuedAt == null) return null;
  if (attachToOverdue) {
    final round = pickEarliestOverdueVisit(overdue, queuedAt);
    if (round != null) return round;
  }
  return pickSameDayUpcomingVisit(upcoming, queuedAt);
}

/// Whether a collection plan starts on a later calendar day than [now], both
/// read as the phone's local date. A site created with such a plan gets no
/// visit until its start date, as on the web: a visit posted today would sort
/// before the start-date visit and take round 1. No start date is not later.
bool planStartsAfterToday(DateTime? startDate, DateTime now) {
  if (startDate == null) return false;
  return _localDay(startDate).isAfter(_localDay(now));
}

DateTime _localDay(DateTime moment) {
  final local = moment.toLocal();
  return DateTime.utc(local.year, local.month, local.day);
}

DateTime _scheduledDay(DateTime scheduledAt) {
  final utc = scheduledAt.toUtc();
  final utcDay = DateTime.utc(utc.year, utc.month, utc.day);
  return utc == utcDay ? utcDay : _localDay(scheduledAt);
}

/// Resolves the server visit for a queued visit whose `POST /visits` failed.
///
/// A lost response can hide a POST that did create the visit. That visit has
/// the queued entry's exact `visitScheduledAt`, so it wins; otherwise it is
/// left behind as a duplicate that later shows as overdue. Only when there is
/// no such visit does this fall back to an upcoming visit on the day the
/// queued visit was collected. With neither, it returns null and the entry
/// stays queued for the next retry.
Future<VisitResponseData?> fetchFallbackVisit(
  EsClient api, {
  required String projectId,
  required String siteId,
  required String queuedScheduledAt,
}) async {
  final scheduledAt = DateTime.tryParse(queuedScheduledAt);
  if (scheduledAt == null) return null;

  // Unfiltered on purpose: a visit queued offline on an earlier day is
  // scheduled in the past, which the `upcoming` filter drops. The default
  // sort is newest-created first, so a visit the POST just created is on
  // page 1.
  final response = await api.getProjectsApi().projectsControllerGetVisits(
        projectId: projectId,
        siteId: siteId,
      );
  final recovered = pickVisitScheduledAt(
      response.data?.data ?? const <VisitResponseData>[], scheduledAt);
  if (recovered != null) return recovered;

  return pickSameDayUpcomingVisit(
      await fetchUpcomingVisits(api, projectId: projectId, siteId: siteId),
      scheduledAt);
}

/// Fetches the site's upcoming visits.
///
/// Filtering on `upcoming` makes the backend sort by `visitScheduledAt ASC`
/// before paging. Without the filter it sorts by `createdAt DESC` and only
/// returns the first page (10 by default), so a schedule longer than one page
/// could leave the earliest visits off it entirely.
Future<List<VisitResponseData>> fetchUpcomingVisits(
  EsClient api, {
  required String projectId,
  required String siteId,
}) async {
  final response = await api.getProjectsApi().projectsControllerGetVisits(
        projectId: projectId,
        siteId: siteId,
        visitStatus: 'upcoming',
      );
  return response.data?.data.toList() ?? const <VisitResponseData>[];
}

/// Fetches every overdue visit of the site, page by page.
///
/// The backend lists overdue visits newest first, so the earliest, the round
/// to collect, can sit on a later page than the first.
Future<List<VisitResponseData>> fetchOverdueVisits(
  EsClient api, {
  required String projectId,
  required String siteId,
}) async {
  const pageSize = 100;
  final visits = <VisitResponseData>[];
  for (var page = 1;; page++) {
    final response = await api.getProjectsApi().projectsControllerGetVisits(
          projectId: projectId,
          siteId: siteId,
          visitStatus: 'overdue',
          page: page,
          limit: pageSize,
        );
    final body = response.data;
    if (body == null) break;
    visits.addAll(body.data);
    if (body.data.isEmpty || page >= (body.totalPages ?? 1)) break;
  }
  return visits;
}

/// Looks up the server visit a visit from site creation merges into: the
/// earliest overdue round, else the visit on the day it was collected. Rounds in
/// [claimed] belong to another queued visit and are skipped.
///
/// Throws when a lookup fails. The caller must then keep the visit queued, since
/// posting it would add a second visit for the round. Null means there is
/// nothing to merge into, and the visit is posted.
Future<VisitResponseData?> fetchAttachTarget(
  EsClient api, {
  required String projectId,
  required String siteId,
  required DateTime? queuedAt,
  Set<String> claimed = const {},
}) async {
  if (queuedAt == null) return null;
  final upcoming =
      await fetchUpcomingVisits(api, projectId: projectId, siteId: siteId);
  final overdue =
      await fetchOverdueVisits(api, projectId: projectId, siteId: siteId);
  return pickVisitForQueuedVisit(
    attachToOverdue: true,
    overdue: overdue.where((v) => !claimed.contains(v.id)),
    upcoming: upcoming.where((v) => !claimed.contains(v.id)),
    queuedAt: queuedAt,
  );
}
