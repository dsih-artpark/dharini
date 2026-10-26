import 'dart:async';
import 'package:geolocator/geolocator.dart';

enum LocationStatus {
  granted,
  denied,
  deniedForever,
  serviceDisabled,
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

  static Future<LocationResult> getLocation() async {
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
      // Try to get current position with a timeout
      final position = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.high,
        ),
      ).timeout(
        _locationTimeout,
        onTimeout: () async {
          // On timeout, attempt to get last known position as fallback
          final lastKnown = await Geolocator.getLastKnownPosition();
          if (lastKnown != null) {
            return lastKnown;
          }
          throw TimeoutException('Could not get location within $_locationTimeout');
        },
      );

      return LocationResult(LocationStatus.granted, position);
    } on TimeoutException {
      final lastKnown = await Geolocator.getLastKnownPosition();
      if (lastKnown != null) {
        return LocationResult(LocationStatus.granted, lastKnown, isLastKnown: true);
      }
      return LocationResult(LocationStatus.granted, null);
    } catch (e) {
      final lastKnown = await Geolocator.getLastKnownPosition();
      if (lastKnown != null) {
        return LocationResult(LocationStatus.granted, lastKnown, isLastKnown: true);
      }
      rethrow;
    }
  }
}
