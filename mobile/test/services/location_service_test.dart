import 'dart:async';

import 'package:es_platform_mobile/managers/location_manager.dart';
import 'package:es_platform_mobile/services/location_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:geolocator/geolocator.dart';

/// DHR-443: on the mobile web app, Create Site failed with "Unsupported
/// operation: getLastKnownPosition is not supported on the web platform".
/// Whenever the browser could not return a position, LocationService fell
/// back to getLastKnownPosition, which geolocator_web always throws for, and
/// the raw error reached the user.
class FakeGeolocator extends GeolocatorPlatform {
  LocationPermission permission = LocationPermission.whileInUse;
  Future<Position> Function() currentPosition = () async => fakePosition;
  Position? lastKnown;
  bool lastKnownThrows = false;
  int lastKnownCalls = 0;
  int openAppSettingsCalls = 0;
  LocationSettings? lastSettings;

  @override
  Future<bool> isLocationServiceEnabled() async => true;

  @override
  Future<LocationPermission> checkPermission() async => permission;

  @override
  Future<LocationPermission> requestPermission() async => permission;

  @override
  Future<Position> getCurrentPosition({LocationSettings? locationSettings}) {
    lastSettings = locationSettings;
    return currentPosition();
  }

  @override
  Future<Position?> getLastKnownPosition({
    bool forceLocationManager = false,
  }) async {
    lastKnownCalls++;
    if (lastKnownThrows) {
      throw UnsupportedError(
          'getLastKnownPosition is not supported on the web platform');
    }
    return lastKnown;
  }

  @override
  Future<bool> openAppSettings() {
    openAppSettingsCalls++;
    throw UnsupportedError('openAppSettings is not supported');
  }
}

final fakePosition = Position(
  latitude: 12.97,
  longitude: 77.59,
  timestamp: DateTime(2026, 10, 6),
  accuracy: 10,
  altitude: 0,
  altitudeAccuracy: 0,
  heading: 0,
  headingAccuracy: 0,
  speed: 0,
  speedAccuracy: 0,
);

void main() {
  late FakeGeolocator geolocator;

  setUp(() {
    geolocator = FakeGeolocator();
    GeolocatorPlatform.instance = geolocator;
  });

  tearDown(() => LocationService.debugIsWebOverride = null);

  group('LocationService on web', () {
    setUp(() {
      LocationService.debugIsWebOverride = true;
      // Browsers have no cached position: geolocator_web always throws.
      geolocator.lastKnownThrows = true;
    });

    test('returns unavailable instead of throwing when the browser has no fix',
        () async {
      geolocator.currentPosition =
          () => throw const PositionUpdateException('Position unavailable');

      final result = await LocationService.getLocation();

      expect(result.status, LocationStatus.unavailable);
      expect(result.position, isNull);
      expect(geolocator.lastKnownCalls, 0);
    });

    test('returns unavailable when the browser times out', () async {
      geolocator.currentPosition = () => throw TimeoutException('timed out');

      final result = await LocationService.getLocation();

      expect(result.status, LocationStatus.unavailable);
      expect(geolocator.lastKnownCalls, 0);
    });

    test('gives the browser a time limit so the request is cancelled',
        () async {
      await LocationService.getLocation();

      expect(geolocator.lastSettings?.timeLimit, const Duration(seconds: 30));
    });

    test('reports a block during the request as denied forever', () async {
      geolocator.currentPosition =
          () => throw const PermissionDeniedException('User denied');

      final result = await LocationService.getLocation();

      expect(result.status, LocationStatus.deniedForever);
    });

    test('returns the position when the browser provides one', () async {
      final result = await LocationService.getLocation();

      expect(result.status, LocationStatus.granted);
      expect(result.position, fakePosition);
    });
  });

  group('LocationService on device', () {
    setUp(() => LocationService.debugIsWebOverride = false);

    test('falls back to the last known position when there is no fix',
        () async {
      geolocator.currentPosition =
          () => throw const PositionUpdateException('No fix');
      geolocator.lastKnown = fakePosition;

      final result = await LocationService.getLocation();

      expect(result.status, LocationStatus.granted);
      expect(result.position, fakePosition);
      expect(result.isLastKnown, isTrue);
    });

    test('returns unavailable when there is no last known position either',
        () async {
      geolocator.currentPosition = () => throw TimeoutException('timed out');

      final result = await LocationService.getLocation();

      expect(result.status, LocationStatus.unavailable);
      expect(result.position, isNull);
    });

    test('never throws, even if the last known lookup fails', () async {
      geolocator.currentPosition =
          () => throw const PositionUpdateException('No fix');
      geolocator.lastKnownThrows = true;

      final result = await LocationService.getLocation();

      expect(result.status, LocationStatus.unavailable);
    });

    test('keeps the device request without a platform time limit', () async {
      await LocationService.getLocation();

      expect(geolocator.lastSettings?.timeLimit, isNull);
    });
  });

  group('LocationManager.ensureLocation on web', () {
    setUp(() {
      LocationService.debugIsWebOverride = true;
      geolocator.lastKnownThrows = true;
    });

    Future<List<Object?>> runEnsureLocation(WidgetTester tester) async {
      final outcome = <Object?>[];
      await tester.pumpWidget(MaterialApp(
        home: Builder(
          builder: (context) => TextButton(
            onPressed: () async {
              outcome.add(await LocationManager.ensureLocation(context));
            },
            child: const Text('Locate'),
          ),
        ),
      ));
      await tester.tap(find.text('Locate'));
      await tester.pumpAndSettle();
      return outcome;
    }

    testWidgets('explains an unavailable location instead of the raw error',
        (tester) async {
      geolocator.currentPosition =
          () => throw const PositionUpdateException('Position unavailable');

      final outcome = await runEnsureLocation(tester);

      expect(find.text('Location Unavailable'), findsOneWidget);
      expect(find.textContaining('getLastKnownPosition'), findsNothing);

      await tester.tap(find.text('OK'));
      await tester.pumpAndSettle();

      expect(find.byType(AlertDialog), findsNothing);
      expect(outcome, [null]);
    });

    testWidgets(
        'a blocked browser shows how to allow it, and the dialog can be closed',
        (tester) async {
      geolocator.permission = LocationPermission.deniedForever;

      final outcome = await runEnsureLocation(tester);

      expect(find.text('Location Not Available'), findsOneWidget);
      // No "Open Settings": browsers cannot open app settings.
      expect(find.text('Open Settings'), findsNothing);

      await tester.tap(find.text('OK'));
      await tester.pumpAndSettle();

      expect(find.byType(AlertDialog), findsNothing);
      expect(geolocator.openAppSettingsCalls, 0);
      expect(outcome, [null]);
    });
  });

  group('LocationManager.ensureLocation on device', () {
    setUp(() => LocationService.debugIsWebOverride = false);

    testWidgets('closes the dialog even if opening app settings fails',
        (tester) async {
      geolocator.permission = LocationPermission.deniedForever;
      await tester.pumpWidget(MaterialApp(
        home: Builder(
          builder: (context) => TextButton(
            onPressed: () => LocationManager.ensureLocation(context),
            child: const Text('Locate'),
          ),
        ),
      ));
      await tester.tap(find.text('Locate'));
      await tester.pumpAndSettle();

      await tester.tap(find.text('Open Settings'));
      await tester.pumpAndSettle();

      expect(find.byType(AlertDialog), findsNothing);
      expect(geolocator.openAppSettingsCalls, 1);
    });
  });
}
