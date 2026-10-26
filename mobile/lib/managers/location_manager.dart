import 'package:es_platform_mobile/services/location_service.dart';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';

class LocationManager {
  static Future<Position?> ensureLocation(BuildContext context) async {
    final result = await LocationService.getLocation();

    switch (result.status) {
      case LocationStatus.granted:
        return result.position;

      case LocationStatus.serviceDisabled:
        await _showServiceDisabledDialog(context);
        return null;

      case LocationStatus.denied:
        await _showPermissionDeniedDialog(context);
        return null;

      case LocationStatus.deniedForever:
        await _showPermissionDeniedForeverDialog(context);
        return null;
    }
  }

  static Future<void> _showServiceDisabledDialog(BuildContext context) async {
    await showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text("Location Disabled"),
        content: const Text("Please enable location services."),
        actions: [
          TextButton(
            onPressed: () {
              Geolocator.openLocationSettings();
              Navigator.pop(context);
            },
            child: const Text("Open Settings"),
          ),
        ],
      ),
    );
  }

  static Future<void> _showPermissionDeniedDialog(BuildContext context) async {
    await showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text("Permission Required"),
        content: const Text("Please allow location permission."),
        actions: [
          TextButton(
            onPressed: () {
              Geolocator.requestPermission();
              Navigator.pop(context);
            },
            child: const Text("Try Again"),
          ),
        ],
      ),
    );
  }

  static Future<void> _showPermissionDeniedForeverDialog(
      BuildContext context) async {
    await showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text("Permission Permanently Denied"),
        content: const Text("Open app settings and allow location."),
        actions: [
          TextButton(
            onPressed: () {
              Geolocator.openAppSettings();
              Navigator.pop(context);
            },
            child: const Text("Open Settings"),
          ),
        ],
      ),
    );
  }
}
