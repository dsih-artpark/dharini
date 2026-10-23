import 'package:es_platform_mobile/utils/collection_plan_edit.dart';
import 'package:es_platform_mobile/views/sites/widgets/shedulecollection.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

/// The create and edit collection plan screens share one schedule widget, so
/// both follow the web form's rules: a start date, Once on the start date's
/// day, Daily on every day, and the interval kept in intervalController,
/// which the edit screen compares with the stored one to tell a changed plan.
void main() {
  late TextEditingController interval;
  late TextEditingController frequency;
  late TextEditingController days;
  late TextEditingController time;
  late TextEditingController duration;
  late List<DateTime> sentStartDates;

  // As the edit screen fills the controllers for a stored plan.
  setUp(() {
    interval = TextEditingController(text: '7');
    frequency = TextEditingController(text: '1');
    days = TextEditingController(text: 'monday');
    time = TextEditingController(text: '09:00:00');
    duration = TextEditingController(text: durationMonthsText(180));
    sentStartDates = [];
  });

  // Mon 7 Sep 2026, more than a month before these tests run.
  final savedStart = DateTime(2026, 9, 7);

  Future<void> pumpSchedule(WidgetTester tester, {DateTime? saved}) =>
      tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: SingleChildScrollView(
              child: ScheduleCollectionWidget(
                intervalController: interval,
                frequencyController: frequency,
                dayOfWeekController: days,
                timeController: time,
                durationController: duration,
                savedStartDate: saved,
                onSubmit: (_, __, ___, ____, _____, startDate) =>
                    sentStartDates.add(startDate),
              ),
            ),
          ),
        ),
      );

  Future<void> chooseFrequency(
    WidgetTester tester,
    String from,
    String label,
  ) async {
    await tester.tap(find.text(from));
    await tester.pumpAndSettle();
    await tester.tap(find.text(label).last);
    await tester.pumpAndSettle();
  }

  CollectionPlanFormValues formValues() => CollectionPlanFormValues(
        interval: interval.text,
        days: days.text.split(', '),
        time: time.text,
        duration: duration.text,
      );

  testWidgets('a new frequency on the same day changes the sent interval',
      (tester) async {
    await pumpSchedule(tester, saved: savedStart);
    final opened = formValues();

    for (final (from, label, sent) in [
      ('Weekly', 'Fortnightly', '14'),
      ('Fortnightly', 'Monthly', '30'),
      ('Monthly', 'Fortnightly', '14'),
    ]) {
      await chooseFrequency(tester, from, label);
      expect(interval.text, sent, reason: label);
      expect(frequency.text, sent, reason: label);
      expect(formValues().differsFrom(opened), isTrue, reason: label);
    }

    // The day and the untouched duration stay as they were.
    expect(days.text, 'monday');
    expect(duration.text, '6');
    expect(
      durationDaysToSave(duration.text, initialText: '6', storedDays: 180),
      180,
    );
  });

  testWidgets('one-time collects on the start date\'s day, with no duration',
      (tester) async {
    // Wed 9 Sep 2026.
    await pumpSchedule(tester, saved: DateTime(2026, 9, 9));

    await chooseFrequency(tester, 'Weekly', 'Once');

    expect(interval.text, '0');
    expect(duration.text, '0');
    expect(days.text, 'wednesday');
    expect(sentStartDates.last, DateTime(2026, 9, 9));
    expect(
      durationError(duration.text, initialText: '6', isOneTime: true),
      isNull,
    );
  });

  testWidgets('the days Once or Daily set are not kept for a repeating plan',
      (tester) async {
    await pumpSchedule(tester, saved: savedStart);

    await chooseFrequency(tester, 'Weekly', 'Daily');
    expect(days.text.split(', '), hasLength(7));

    await chooseFrequency(tester, 'Daily', 'Monthly');
    expect(days.text, isEmpty);
    expect(interval.text, '30');
  });

  testWidgets('opens an edited plan on its saved start date', (tester) async {
    await pumpSchedule(tester, saved: savedStart);

    expect(find.text('07/09/2026'), findsOneWidget);
    // The interval stays as stored until another frequency is picked.
    expect(interval.text, '7');
    expect(frequency.text, '7');

    // Older than the picker's first date, it still opens the picker.
    await tester.tap(find.text('07/09/2026'));
    await tester.pumpAndSettle();
    expect(find.byType(DatePickerDialog), findsOneWidget);
  });

  testWidgets('opens a new plan on today, weekly', (tester) async {
    interval.text = '';
    frequency.text = '';
    days.text = '';
    duration.text = '';
    await pumpSchedule(tester);

    final today = DateTime.now();
    String two(int n) => n.toString().padLeft(2, '0');
    expect(find.text('${two(today.day)}/${two(today.month)}/${today.year}'),
        findsOneWidget);
    expect(find.text('Weekly'), findsOneWidget);
    expect(interval.text, '7');
    expect(frequency.text, '7');
  });

  testWidgets('a picked start date is sent, and moves a one-time plan\'s day',
      (tester) async {
    interval.text = '0';
    duration.text = '0';
    await pumpSchedule(tester);

    final today = DateTime.now();
    // Any other day of this month is within the picker's range.
    final pickDay = today.day == 1 ? 2 : 1;
    final picked = DateTime(today.year, today.month, pickDay);

    String two(int n) => n.toString().padLeft(2, '0');
    await tester
        .tap(find.text('${two(today.day)}/${two(today.month)}/${today.year}'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('$pickDay'));
    await tester.tap(find.text('OK'));
    await tester.pumpAndSettle();

    expect(sentStartDates.last, picked);
    expect(days.text, weekdayName(picked));
    expect(
      find.text('${two(pickDay)}/${two(today.month)}/${today.year}'),
      findsOneWidget,
    );
  });
}
