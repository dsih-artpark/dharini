import 'package:es_platform_mobile/views/samplecollection/widgets/sample_count_stepper.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('clampCount', () {
    test('passes values already within range through unchanged', () {
      expect(clampCount(0, max: 999), 0);
      expect(clampCount(20, max: 999), 20);
      expect(clampCount(999, max: 999), 999);
    });

    test('clamps negatives up to 0', () {
      expect(clampCount(-1, max: 999), 0);
      expect(clampCount(-50, max: 999), 0);
    });

    test('clamps values above max down to max', () {
      expect(clampCount(1000, max: 999), 999);
      expect(clampCount(51, max: 50), 50);
    });
  });

  group('SampleCountStepper', () {
    testWidgets('tapping + increments and tapping - decrements', (tester) async {
      int? last;
      await tester.pumpWidget(_Host(onChanged: (v) => last = v));

      await tester.tap(find.byIcon(Icons.add));
      await tester.pump();
      expect(last, 1);

      await tester.tap(find.byIcon(Icons.add));
      await tester.pump();
      expect(last, 2);

      await tester.tap(find.byIcon(Icons.remove));
      await tester.pump();
      expect(last, 1);
    });

    testWidgets('- does nothing at 0 (cannot go negative)', (tester) async {
      int? last;
      await tester.pumpWidget(_Host(onChanged: (v) => last = v));

      await tester.tap(find.byIcon(Icons.remove));
      await tester.pump();
      // No change emitted; the field still shows the default 0.
      expect(last, isNull);
      expect(find.text('0'), findsOneWidget);
    });

    testWidgets('+ stops at the max count', (tester) async {
      int? last;
      await tester.pumpWidget(
        _Host(initial: 5, maxCount: 5, onChanged: (v) => last = v),
      );

      await tester.tap(find.byIcon(Icons.add));
      await tester.pump();
      expect(last, isNull);
    });

    testWidgets('typing a number reports that value', (tester) async {
      int? last;
      await tester.pumpWidget(_Host(onChanged: (v) => last = v));

      await tester.enterText(find.byType(TextField), '20');
      await tester.pump();
      expect(last, 20);
    });

    testWidgets('typing above the cap clamps to max', (tester) async {
      // maxCount 50 allows 2 digits, so '99' gets through the length limiter
      // and must be clamped down to 50.
      int? last;
      await tester.pumpWidget(_Host(maxCount: 50, onChanged: (v) => last = v));

      await tester.enterText(find.byType(TextField), '99');
      await tester.pump();
      expect(last, 50);
      expect(find.text('50'), findsOneWidget);
    });

    testWidgets('clearing the field reports 0', (tester) async {
      int? last;
      await tester.pumpWidget(_Host(initial: 7, onChanged: (v) => last = v));

      await tester.enterText(find.byType(TextField), '');
      await tester.pump();
      expect(last, 0);
    });
  });
}

/// Test harness that owns the count the way the real screen does: it feeds each
/// [SampleCountStepper.onChanged] value back in as the new `count`, and forwards
/// it to the test's [onChanged] spy.
class _Host extends StatefulWidget {
  const _Host({
    required this.onChanged,
    this.initial = 0,
    this.maxCount = 999,
  });

  final ValueChanged<int> onChanged;
  final int initial;
  final int maxCount;

  @override
  State<_Host> createState() => _HostState();
}

class _HostState extends State<_Host> {
  late int _current = widget.initial;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        body: SampleCountStepper(
          count: _current,
          maxCount: widget.maxCount,
          onChanged: (value) {
            setState(() => _current = value);
            widget.onChanged(value);
          },
        ),
      ),
    );
  }
}
