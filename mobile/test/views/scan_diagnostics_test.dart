import 'dart:convert';

import 'package:es_platform_mobile/views/samplecollection/scanner/scan_diagnostics.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

const _secret = 'NA/EN/26-07/102001';

Barcode _barcode({String? value = _secret}) =>
    Barcode(rawValue: value, format: BarcodeFormat.code128);

void main() {
  late List<SentryEvent> events;
  late List<Breadcrumb> crumbs;
  late DateTime clock;
  late ScanDiagnostics diagnostics;

  setUp(() async {
    events = <SentryEvent>[];
    crumbs = <Breadcrumb>[];
    clock = DateTime(2026, 1, 1, 9);
    await Sentry.init((o) {
      o.dsn = 'https://public@example.invalid/1';
      o.beforeSend = (event, hint) {
        events.add(event);
        return null; // nothing leaves the test
      };
      o.beforeBreadcrumb = (crumb, hint) {
        if (crumb != null) crumbs.add(crumb);
        return crumb;
      };
    });
    diagnostics = ScanDiagnostics(now: () => clock);
  });

  tearDown(Sentry.close);

  Future<void> settle() => Future<void>.delayed(Duration.zero);

  String everything() => jsonEncode([
        ...events.map((e) => e.toJson()),
        ...crumbs.map((c) => c.toJson()),
      ]);

  test('never includes the barcode value', () async {
    diagnostics.cameraLive();
    diagnostics.read(_barcode());
    diagnostics.rejected('already_in_session', length: _secret.length);
    clock = clock.add(const Duration(minutes: 1));
    diagnostics.manualEntryOpened();
    await settle();
    expect(everything(), isNot(contains('102001')));
    expect(everything(), contains('"length":${_secret.length}'));
    expect(everything(), contains('code128'));
  });

  test('a camera fault is reported once per screen, not on every rebuild',
      () async {
    final error =
        MobileScannerException(errorCode: MobileScannerErrorCode.genericError);
    for (var i = 0; i < 5; i++) {
      diagnostics.cameraError(error);
    }
    await settle();
    expect(events, hasLength(1));
    expect(events.single.tags!['scanner.reason'], 'camera_genericError');
    expect(events.single.level, SentryLevel.warning);
  });

  test('permission denied is informational', () async {
    diagnostics.cameraError(MobileScannerException(
        errorCode: MobileScannerErrorCode.permissionDenied));
    await settle();
    expect(events.single.level, SentryLevel.info);
  });

  test('start/stop races during teardown stay breadcrumbs', () async {
    diagnostics.cameraCallFailed(
      'start',
      MobileScannerException(
          errorCode: MobileScannerErrorCode.controllerDisposed),
      StackTrace.current,
    );
    await settle();
    expect(events, isEmpty);
    expect(crumbs.map((c) => c.message), contains('camera start ignored'));
  });

  test('an unexpected start failure is reported', () async {
    diagnostics.cameraCallFailed(
        'start', StateError('boom'), StackTrace.current);
    await settle();
    expect(events, hasLength(1));
    expect(events.single.tags!['scanner.reason'], 'camera_start_failed');
  });

  group('manual entry', () {
    test('soon after opening the scanner is not a failure', () async {
      diagnostics.cameraLive();
      clock = clock.add(const Duration(seconds: 3));
      diagnostics.manualEntryOpened();
      await settle();
      expect(events, isEmpty);
    });

    test('after the camera ran a while with nothing read is reported',
        () async {
      diagnostics.cameraLive();
      clock = clock.add(const Duration(seconds: 25));
      diagnostics.manualEntryOpened(camera: {'torch': 'off'});
      await settle();
      expect(events, hasLength(1));
      final ctx = events.single.contexts['scanner'] as Map;
      expect(ctx['seconds_since_camera_live'], 25);
      expect(ctx['reads'], 0);
      expect(ctx['torch'], 'off');
    });

    test('after a code was seen but unreadable is reported straight away',
        () async {
      diagnostics.cameraLive();
      diagnostics.unreadable(_barcode(value: null));
      diagnostics.manualEntryOpened();
      await settle();
      expect(events, hasLength(1));
      expect((events.single.contexts['scanner'] as Map)['unreadable'], 1);
    });

    test('is not a failure once a label has been read', () async {
      diagnostics.cameraLive();
      diagnostics.read(_barcode());
      clock = clock.add(const Duration(minutes: 5));
      diagnostics.manualEntryOpened();
      await settle();
      expect(events, isEmpty);
    });
  });

  group('closed', () {
    test('after a while with nothing scanned is reported', () async {
      diagnostics.cameraLive();
      clock = clock.add(const Duration(seconds: 30));
      diagnostics.closed(accepted: 0);
      await settle();
      expect(events, hasLength(1));
      expect(events.single.tags!['scanner.reason'], 'left_without_scan');
    });

    test('is quiet when a barcode was taken, even by hand', () async {
      diagnostics.cameraLive();
      clock = clock.add(const Duration(seconds: 30));
      diagnostics.closed(accepted: 1);
      await settle();
      expect(events, isEmpty);
    });

    test('is quiet when the collector left straight away', () async {
      diagnostics.cameraLive();
      clock = clock.add(const Duration(seconds: 2));
      diagnostics.closed(accepted: 0);
      await settle();
      expect(events, isEmpty);
    });

    test('does not repeat a manual-entry report', () async {
      diagnostics.cameraLive();
      clock = clock.add(const Duration(seconds: 30));
      diagnostics.manualEntryOpened();
      diagnostics.closed(accepted: 0);
      await settle();
      expect(events, hasLength(1));
      expect(events.single.tags!['scanner.reason'],
          'manual_entry_after_failed_scan');
    });
  });

  test('repeated unreadable frames add one breadcrumb, not a flood', () {
    for (var i = 0; i < 40; i++) {
      diagnostics.unreadable(_barcode(value: null));
    }
    expect(crumbs.where((c) => c.category == 'scanner'), hasLength(1));
  });

  test('server rejection sends the reason, never the barcode', () {
    diagnostics.rejected('server_rejected', length: _secret.length);
    final text = everything();
    expect(text, contains('server_rejected'));
    expect(text, contains('"length":${_secret.length}'));
    expect(text, isNot(contains(_secret)));
  });
}
