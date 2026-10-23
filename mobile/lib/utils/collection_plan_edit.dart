// The collection plan forms, for a new plan and an edited one, follow the
// web's: a start date at most a month back, and a duration in months that the
// API stores in days, 30 to a month.

import 'dart:math';

const _weekdays = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

/// The earliest start date the forms offer: the same day one month ago,
/// clamped to that month's last day (31 Mar → 28/29 Feb), as on the web.
DateTime earliestStartDate(DateTime today) {
  final lastDayOfPrevMonth = DateTime(today.year, today.month, 0).day;
  return DateTime(
      today.year, today.month - 1, min(today.day, lastDayOfPrevMonth));
}

/// The day a site's saved start date falls on, as the web form shows it: the
/// UTC date the API sends. Null when the site has none.
DateTime? savedStartDay(DateTime? stored) {
  if (stored == null) return null;
  final utc = stored.toUtc();
  return DateTime(utc.year, utc.month, utc.day);
}

/// Whether [a] and [b] fall on the same calendar day; two nulls do.
bool isSameDay(DateTime? a, DateTime? b) {
  if (a == null || b == null) return a == null && b == null;
  return a.year == b.year && a.month == b.month && a.day == b.day;
}

/// The start date to send for [day], as the API reads it: midnight UTC.
DateTime startDateToSave(DateTime day) =>
    DateTime.utc(day.year, day.month, day.day);

/// The collection day of a one-time plan on [date], e.g. 'monday'.
String weekdayName(DateTime date) => _weekdays[date.weekday - 1];

/// What's wrong with the start date, or null. A site's [saved] start date is
/// kept as it is, even once it is more than a month back.
String? startDateError(
  DateTime? start, {
  DateTime? saved,
  required DateTime today,
}) {
  if (start == null) return 'Collection start date is required.';
  if (isSameDay(start, saved)) return null;
  final day = DateTime(start.year, start.month, start.day);
  if (day.isBefore(earliestStartDate(today))) {
    return 'Collection start date cannot be more than 1 month in the past.';
  }
  return null;
}

/// The months to show for a stored duration of [durationDays]: `6` for 180,
/// not `6.0`. A duration that isn't whole months shows as a decimal. Empty when
/// there is none, as for one-time plans, which store 0.
String durationMonthsText(Object? durationDays) {
  final days = num.tryParse('${durationDays ?? ''}');
  if (days == null || days <= 0) return '';
  if (days % 30 == 0) return '${days ~/ 30}';
  return (days / 30).toStringAsFixed(2).replaceFirst(RegExp(r'\.?0+$'), '');
}

/// The duration to send, in days. While the field still shows what the form
/// opened with, that is the stored duration, so an untouched duration is saved
/// as it was. Otherwise it is the whole months entered, or null when the entry
/// isn't a whole number.
int? durationDaysToSave(
  String text, {
  required String initialText,
  required Object? storedDays,
}) {
  final stored = num.tryParse('${storedDays ?? ''}');
  if (text.trim() == initialText.trim() && stored != null && stored > 0) {
    return stored.toInt();
  }
  final months = int.tryParse(text.trim());
  return months == null ? null : months * 30;
}

/// What's wrong with the duration field, or null. One-time plans have none.
String? durationError(
  String text, {
  required String initialText,
  required bool isOneTime,
}) {
  if (isOneTime) return null;
  final entered = text.trim();
  if (entered.isEmpty) return 'Collection duration is required';
  // The stored duration, which is saved as it is.
  if (entered == initialText.trim()) return null;
  final months = int.tryParse(entered);
  if (months == null || months <= 0) {
    return 'Enter the duration in whole months, at least 1';
  }
  return null;
}

/// A collection plan as the edit form holds it.
class CollectionPlanFormValues {
  const CollectionPlanFormValues({
    required this.interval,
    required this.days,
    required this.time,
    required this.duration,
    this.startDate,
  });

  /// `collectionFrequencyInterval` as text: '7' weekly, '14' fortnightly,
  /// '30' monthly, '90' quarterly, '1' daily, '0' one-time.
  final String interval;
  final Iterable<String> days;
  final String time;

  /// The duration field's text, in months.
  final String duration;

  /// The start date's day, or null when there is none.
  final DateTime? startDate;

  bool differsFrom(CollectionPlanFormValues other) {
    final ourDays = days.map((d) => d.toLowerCase()).toSet();
    final theirDays = other.days.map((d) => d.toLowerCase()).toSet();
    return interval.trim() != other.interval.trim() ||
        ourDays.length != theirDays.length ||
        !ourDays.containsAll(theirDays) ||
        time != other.time ||
        duration.trim() != other.duration.trim() ||
        !isSameDay(startDate, other.startDate);
  }
}
