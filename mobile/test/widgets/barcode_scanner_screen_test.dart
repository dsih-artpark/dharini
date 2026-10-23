import 'package:es_platform_mobile/views/samplecollection/scanner/scan_confirm_sheet.dart';
import 'package:es_platform_mobile/views/samplecollection/scanner/scan_session_dock.dart';
import 'package:es_platform_mobile/views/samplecollection/scanner/scanner_viewfinder.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void _noop() {}

Widget _wrap(Widget child) => MaterialApp(
      home:
          Scaffold(body: Align(alignment: Alignment.bottomCenter, child: child)),
    );

Widget _wrapViewfinder(Widget child) => MaterialApp(
      home: Scaffold(body: SizedBox(width: 390, height: 700, child: child)),
    );

void main() {
  group('ScanConfirmSheet', () {
    testWidgets('never accepts on its own — only an explicit tap commits',
        (WidgetTester tester) async {
      int accepts = 0;

      await tester.pumpWidget(_wrap(ScanConfirmSheet(
        verdict: ScanVerdict.verified,
        isSingleShot: false,
        onRescan: () {},
        onAccept: () => accepts++,
      )));

      // The old build popped after 1400ms. Sit well past that.
      await tester.pump(const Duration(seconds: 5));
      expect(accepts, 0, reason: 'nothing may commit without a tap');

      await tester.tap(find.text('Add & continue'));
      await tester.pump();
      expect(accepts, 1);
    });

    testWidgets('keeps the accept button in place but disabled while checking',
        (WidgetTester tester) async {
      await tester.pumpWidget(_wrap(const ScanConfirmSheet(
        verdict: ScanVerdict.checking,
        isSingleShot: false,
        onRescan: _noop,
      )));

      // Present, so the row does not jump when the check resolves.
      expect(find.text('Add & continue'), findsOneWidget);
      expect(
        tester.widget<TextButton>(
          find.ancestor(
            of: find.text('Add & continue'),
            matching: find.byType(TextButton),
          ),
        ).onPressed,
        isNull,
      );
    });

    testWidgets('cannot accept a rejected barcode',
        (WidgetTester tester) async {
      int accepts = 0;

      await tester.pumpWidget(_wrap(ScanConfirmSheet(
        verdict: ScanVerdict.rejected,
        isSingleShot: false,
        onRescan: () {},
        onAccept: () => accepts++,
      )));

      await tester.tap(find.text('Add & continue'));
      await tester.pump();
      expect(accepts, 0);
      expect(find.text('Scan another'), findsOneWidget);
    });

    testWidgets('labels the accept button for a single-shot caller',
        (WidgetTester tester) async {
      await tester.pumpWidget(_wrap(ScanConfirmSheet(
        verdict: ScanVerdict.verified,
        isSingleShot: true,
        onRescan: () {},
        onAccept: () {},
      )));

      expect(find.text('Use barcode'), findsOneWidget);
      expect(find.text('Add & continue'), findsNothing);
    });

    testWidgets('rescan is reachable while a check is still running',
        (WidgetTester tester) async {
      int rescans = 0;

      await tester.pumpWidget(_wrap(ScanConfirmSheet(
        verdict: ScanVerdict.checking,
        isSingleShot: false,
        onRescan: () => rescans++,
      )));

      await tester.tap(find.text('Rescan'));
      expect(rescans, 1);
    });
  });

  group('ScanSessionDock', () {
    testWidgets('counts the session on the Done button',
        (WidgetTester tester) async {
      await tester.pumpWidget(_wrap(ScanSessionDock(
        accepted: const <String>['BC-001', 'BC-002', 'BC-003'],
        isSingleShot: false,
        onUndo: (_) {},
        onManualEntry: () {},
        onDone: () {},
      )));

      expect(find.text('Done · 3'), findsOneWidget);
      expect(find.text('BC-001'), findsOneWidget);
      expect(find.text('BC-003'), findsOneWidget);
    });

    testWidgets('invites a first scan when the session is empty',
        (WidgetTester tester) async {
      await tester.pumpWidget(_wrap(ScanSessionDock(
        accepted: const <String>[],
        isSingleShot: false,
        onUndo: (_) {},
        onManualEntry: () {},
        onDone: () {},
      )));

      expect(find.text('No barcodes yet'), findsOneWidget);
      expect(find.text('Done'), findsOneWidget);
    });

    testWidgets('a chip reports which barcode to undo',
        (WidgetTester tester) async {
      final SemanticsHandle handle = tester.ensureSemantics();
      final List<String> undone = <String>[];

      await tester.pumpWidget(_wrap(ScanSessionDock(
        accepted: const <String>['BC-001', 'BC-002'],
        isSingleShot: false,
        onUndo: undone.add,
        onManualEntry: () {},
        onDone: () {},
      )));

      // Chips render newest-first, so the leading remove button is BC-002's.
      await tester.tap(find.bySemanticsLabel('Remove BC-002'));
      expect(undone, <String>['BC-002']);

      handle.dispose();
    });

    testWidgets('a single-shot session shows no chips or Done',
        (WidgetTester tester) async {
      await tester.pumpWidget(_wrap(ScanSessionDock(
        accepted: const <String>[],
        isSingleShot: true,
        onUndo: (_) {},
        onManualEntry: () {},
        onDone: () {},
      )));

      expect(find.text('No barcodes yet'), findsNothing);
      expect(find.textContaining('Done'), findsNothing);
      expect(find.text('Enter manually'), findsOneWidget);
    });
  });

  group('ScannerViewfinder verdict card', () {
    const Animation<double> stillSweep = AlwaysStoppedAnimation<double>(0.5);

    testWidgets('guides the collector while the camera is looking',
        (WidgetTester tester) async {
      await tester.pumpWidget(_wrapViewfinder(const ScannerViewfinder(
        sweep: stillSweep,
        status: ViewfinderStatus.live,
      )));

      expect(find.text('Point at the barcode'), findsOneWidget);
    });

    testWidgets('does not claim the camera is paused while confirming',
        (WidgetTester tester) async {
      await tester.pumpWidget(_wrapViewfinder(const ScannerViewfinder(
        sweep: stillSweep,
        status: ViewfinderStatus.verified,
        barcode: 'BC-2024-0031',
      )));

      expect(find.text('Camera paused'), findsNothing);
      expect(find.text('Point at the barcode'), findsNothing);
    });

    testWidgets('shows the barcode on the frame once verified',
        (WidgetTester tester) async {
      await tester.pumpWidget(_wrapViewfinder(const ScannerViewfinder(
        sweep: stillSweep,
        status: ViewfinderStatus.verified,
        barcode: 'BC-2024-0031',
      )));

      expect(find.text('BC-2024-0031'), findsOneWidget);
      expect(find.byIcon(Icons.check_rounded), findsOneWidget);
    });

    testWidgets('shows the barcode and the reason when rejected',
        (WidgetTester tester) async {
      await tester.pumpWidget(_wrapViewfinder(const ScannerViewfinder(
        sweep: stillSweep,
        status: ViewfinderStatus.rejected,
        barcode: 'BC-001',
        rejectionMessage: 'BC-001 is already assigned to another sample.',
      )));

      expect(find.text('BC-001'), findsOneWidget);
      expect(find.textContaining('already assigned'), findsOneWidget);
      expect(find.byIcon(Icons.check_rounded), findsNothing);
    });

    testWidgets('shows a spinner with the barcode while checking',
        (WidgetTester tester) async {
      await tester.pumpWidget(_wrapViewfinder(const ScannerViewfinder(
        sweep: stillSweep,
        status: ViewfinderStatus.checking,
        barcode: 'BC-001',
      )));

      expect(find.text('BC-001'), findsOneWidget);
      expect(find.byType(CircularProgressIndicator), findsOneWidget);
    });

    testWidgets('announces the verdict to screen readers',
        (WidgetTester tester) async {
      final SemanticsHandle handle = tester.ensureSemantics();

      await tester.pumpWidget(_wrapViewfinder(const ScannerViewfinder(
        sweep: stillSweep,
        status: ViewfinderStatus.verified,
        barcode: 'BC-2024-0031',
      )));

      expect(find.bySemanticsLabel('Verified, BC-2024-0031'), findsOneWidget);

      handle.dispose();
    });
  });

  group('ScannerViewfinder geometry', () {
    // The scrim cutout and the corner brackets are painted from this one Rect,
    // which is what keeps them from drifting apart at different screen sizes.
    test('the window is horizontally centred at every size', () {
      for (final Size size in <Size>[
        const Size(320, 560),
        const Size(390, 844),
        const Size(430, 932),
        const Size(768, 1024),
      ]) {
        final Rect window = ScannerViewfinder.windowFor(size);
        expect(
          window.center.dx,
          closeTo(size.width / 2, 0.01),
          reason: 'off-centre at $size',
        );
      }
    });

    test('the window stays inside its bounds', () {
      for (final Size size in <Size>[
        const Size(320, 560),
        const Size(390, 844),
        const Size(768, 1024),
      ]) {
        final Rect window = ScannerViewfinder.windowFor(size);
        expect(window.left, greaterThanOrEqualTo(0));
        expect(window.top, greaterThanOrEqualTo(0));
        expect(window.right, lessThanOrEqualTo(size.width));
        expect(window.bottom, lessThanOrEqualTo(size.height));
      }
    });

    test('the window sits above centre, leaving room for the dock', () {
      const Size size = Size(390, 844);
      final Rect window = ScannerViewfinder.windowFor(size);

      expect(window.center.dy, lessThan(size.height / 2));
    });

    test('the window keeps a barcode-friendly landscape aspect', () {
      final Rect window = ScannerViewfinder.windowFor(const Size(390, 844));

      expect(window.width, greaterThan(window.height));
    });
  });
}
