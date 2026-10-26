import 'package:es_platform_mobile/utils/collection_plan_edit.dart';
import 'package:flutter_test/flutter_test.dart';

/// The edit collection plan form shows the stored duration in months and
/// sends days. It used to show 180 days as "6.0", which `int.tryParse` then
/// read back as nothing, so an untouched duration was saved as 0. Both plan
/// forms take the web's start date rules.
void main() {
  group('durationMonthsText', () {
    test('shows whole months without a decimal', () {
      expect(durationMonthsText(180), '6');
      expect(durationMonthsText(30), '1');
      expect(durationMonthsText(90.0), '3');
    });

    test('is empty when there is no duration, as for one-time plans', () {
      expect(durationMonthsText(null), '');
      expect(durationMonthsText(0), '');
    });

    test('shows a duration that is not whole months as it is', () {
      expect(durationMonthsText(45), '1.5');
      expect(durationMonthsText(31), '1.03');
    });
  });

  group('durationDaysToSave', () {
    test('saves an untouched 180-day duration as 180', () {
      final shown = durationMonthsText(180);
      expect(shown, '6');
      expect(
        durationDaysToSave(shown, initialText: shown, storedDays: 180),
        180,
      );
    });

    test('keeps an untouched duration that is not whole months', () {
      expect(durationDaysToSave('1.5', initialText: '1.5', storedDays: 45), 45);
    });

    test('saves a new duration as months of 30 days', () {
      expect(durationDaysToSave('2', initialText: '6', storedDays: 180), 60);
    });

    test('has nothing to save for an entry that is not whole months', () {
      expect(durationDaysToSave('1.5', initialText: '6', storedDays: 180),
          isNull);
      expect(durationDaysToSave('', initialText: '6', storedDays: 180),
          isNull);
    });
  });

  group('durationError', () {
    String? error(String text, {String initial = '6', bool once = false}) =>
        durationError(text, initialText: initial, isOneTime: once);

    test('accepts the stored duration and whole months', () {
      expect(error('6'), isNull);
      expect(error('1.5', initial: '1.5'), isNull);
      expect(error('12'), isNull);
    });

    test('requires a duration for a repeating plan', () {
      expect(error(''), 'Collection duration is required');
      expect(error('  '), 'Collection duration is required');
    });

    test('refuses zero, negative and part months', () {
      // 0 is left in the field after switching from one-time back.
      for (final entry in ['0', '-1', '1.5', 'six']) {
        expect(error(entry), 'Enter the duration in whole months, at least 1');
      }
    });

    test('does not ask a one-time plan for a duration', () {
      expect(error('', once: true), isNull);
      expect(error('0', once: true), isNull);
    });
  });

  group('CollectionPlanFormValues.differsFrom', () {
    const weeklyMondays = CollectionPlanFormValues(
      interval: '7',
      days: ['monday'],
      time: '09:00:00',
      duration: '6',
    );
    CollectionPlanFormValues edited({
      String interval = '7',
      List<String> days = const ['monday'],
      String duration = '6',
    }) =>
        CollectionPlanFormValues(
          interval: interval,
          days: days,
          time: '09:00:00',
          duration: duration,
        );

    test('sees no change in the plan the form opened with', () {
      expect(edited().differsFrom(weeklyMondays), isFalse);
    });

    test('sees a frequency change with the same days', () {
      for (final interval in ['14', '30', '90']) {
        expect(edited(interval: interval).differsFrom(weeklyMondays), isTrue,
            reason: 'weekly → $interval');
      }
      final monthly = edited(interval: '30');
      expect(edited(interval: '14').differsFrom(monthly), isTrue);
      expect(edited(interval: '90').differsFrom(monthly), isTrue);
    });

    test('sees a change of day and of duration', () {
      expect(edited(days: ['tuesday']).differsFrom(weeklyMondays), isTrue);
      expect(edited(duration: '3').differsFrom(weeklyMondays), isTrue);
    });

    test('ignores day order and case', () {
      const twoDays = CollectionPlanFormValues(
        interval: '7',
        days: ['monday', 'thursday'],
        time: '09:00:00',
        duration: '6',
      );
      expect(
        edited(days: ['Thursday', 'monday']).differsFrom(twoDays),
        isFalse,
      );
    });

    test('sees a moved start date, but not the same day at another time', () {
      final fromSaved = CollectionPlanFormValues(
        interval: '7',
        days: const ['monday'],
        time: '09:00:00',
        duration: '6',
        startDate: DateTime(2026, 9, 7),
      );
      CollectionPlanFormValues startingOn(DateTime day) =>
          CollectionPlanFormValues(
            interval: '7',
            days: const ['monday'],
            time: '09:00:00',
            duration: '6',
            startDate: day,
          );

      expect(startingOn(DateTime(2026, 9, 14)).differsFrom(fromSaved), isTrue);
      expect(startingOn(DateTime(2026, 9, 7, 15)).differsFrom(fromSaved),
          isFalse);
    });
  });

  group('earliestStartDate', () {
    test('is the same day one month ago', () {
      expect(earliestStartDate(DateTime(2026, 10, 14, 18)),
          DateTime(2026, 9, 14));
    });

    test('clamps to the last day of a shorter month, as the web does', () {
      expect(earliestStartDate(DateTime(2026, 3, 31)), DateTime(2026, 2, 28));
      expect(earliestStartDate(DateTime(2028, 3, 31)), DateTime(2028, 2, 29));
    });

    test('crosses from January back to December', () {
      expect(earliestStartDate(DateTime(2027, 1, 14)), DateTime(2026, 12, 14));
    });
  });

  group('savedStartDay', () {
    test('is the UTC date the API sends, as the web form reads it', () {
      expect(savedStartDay(DateTime.parse('2026-09-25T00:00:00.000Z')),
          DateTime(2026, 9, 25));
    });

    test('is null for a site without a start date', () {
      expect(savedStartDay(null), isNull);
    });
  });

  group('startDateError', () {
    final today = DateTime(2026, 10, 14, 11);

    test('requires a start date', () {
      expect(startDateError(null, today: today),
          'Collection start date is required.');
    });

    test('accepts today, a later date and the earliest date', () {
      for (final day in [
        DateTime(2026, 10, 14),
        DateTime(2027, 1, 5),
        DateTime(2026, 9, 14),
      ]) {
        expect(startDateError(day, today: today), isNull, reason: '$day');
      }
    });

    test('refuses a new start more than a month back', () {
      expect(startDateError(DateTime(2026, 9, 13), today: today),
          'Collection start date cannot be more than 1 month in the past.');
    });

    test('keeps a saved start date that is now more than a month back', () {
      final saved = DateTime(2026, 7, 1);
      expect(startDateError(saved, saved: saved, today: today), isNull);
      expect(
        startDateError(DateTime(2026, 7, 2), saved: saved, today: today),
        isNotNull,
      );
    });
  });

  group('sending the start date', () {
    test('sends midnight UTC on the picked day', () {
      expect(startDateToSave(DateTime(2026, 9, 25, 15, 30)),
          DateTime.utc(2026, 9, 25));
    });

    test('names the weekday a one-time plan collects on', () {
      expect(weekdayName(DateTime(2026, 9, 7)), 'monday');
      expect(weekdayName(DateTime(2026, 9, 13)), 'sunday');
    });
  });
}
