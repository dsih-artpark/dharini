import 'dart:async';
import 'package:flutter/foundation.dart'
    show debugPrint, kIsWeb, visibleForTesting;
import 'package:geolocator/geolocator.dart';

enum LocationStatus {
  granted,
  denied,
  deniedForever,
  serviceDisabled,

  /// Permission is fine but no position could be obtained (no fix, timed
  /// out, or the platform reported an error).
  unavailable,
}

class LocationResult {
  final LocationStatus status;
  final Position? position;
  final bool isLastKnown; // Indicates if this is a cached/last known position

  LocationResult(this.status, this.position, {this.isLastKnown = false});
}

class LocationService {
  /// Timeout duration for GPS location fetch (useful for airplane mode scenarios)
  static const Duration _locationTimeout = Duration(seconds: 30);

  /// `kIsWeb` is a compile-time constant; tests flip this to cover web.
  @visibleForTesting
  static bool? debugIsWebOverride;

  static bool get isWeb => debugIsWebOverride ?? kIsWeb;

  /// Resolves the device position. Never throws: every failure is reported
  /// through [LocationResult.status] so callers can show a proper message
  /// instead of a raw platform error.
  static Future<LocationResult> getLocation() async {
    try {
      return await _getLocation();
    } catch (e) {
      debugPrint('[Location] Unexpected error: $e');
      return LocationResult(LocationStatus.unavailable, null);
    }
  }

  static Future<LocationResult> _getLocation() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      return LocationResult(LocationStatus.serviceDisabled, null);
    }

    LocationPermission permission = await Geolocator.checkPermission();

    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();

      if (permission == LocationPermission.denied) {
        return LocationResult(LocationStatus.denied, null);
      }
    }

    if (permission == LocationPermission.deniedForever) {
      return LocationResult(LocationStatus.deniedForever, null);
    }

    try {
      final position = await Geolocator.getCurrentPosition(
        locationSettings: LocationSettings(
          accuracy: LocationAccuracy.high,
          // Browsers wait forever without a timeout; give them the same limit
          // so the request is actually cancelled, not just abandoned.
          timeLimit: isWeb ? _locationTimeout : null,
        ),
      ).timeout(_locationTimeout);

      return LocationResult(LocationStatus.granted, position);
    } on PermissionDeniedException {
      // Blocked while the request was in flight (e.g. the browser prompt).
      // A browser block sticks until the user changes the site settings.
      return LocationResult(
        isWeb ? LocationStatus.deniedForever : LocationStatus.denied,
        null,
      );
    } catch (e) {
      // Timeout, no fix, or a platform error: fall back to the last known
      // position where the platform keeps one.
      debugPrint('[Location] Current position unavailable: $e');
      final lastKnown = await _lastKnownPosition();
      if (lastKnown != null) {
        return LocationResult(
          LocationStatus.granted,
          lastKnown,
          isLastKnown: true,
        );
      }
      return LocationResult(LocationStatus.unavailable, null);
    }
  }

  static Future<Position?> _lastKnownPosition() async {
    // Browsers have no cached position: geolocator_web throws
    // "getLastKnownPosition is not supported on the web platform".
    if (isWeb) return null;
    try {
      return await Geolocator.getLastKnownPosition();
    } catch (e) {
      debugPrint('[Location] Last known position unavailable: $e');
      return null;
    }
  }
}
