import 'package:es_platform_mobile/services/location_service.dart';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';

class LocationManager {
  /// Returns the device position, or null after telling the user why it
  /// could not be read. Never throws.
  static Future<Position?> ensureLocation(BuildContext context) async {
    final result = await LocationService.getLocation();
    if (!context.mounted) {
      return result.status == LocationStatus.granted ? result.position : null;
    }

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

      case LocationStatus.unavailable:
        await _showLocationUnavailableDialog(context);
        return null;
    }
  }

  // Browsers cannot open device or app settings (geolocator_web throws
  // UnsupportedError), so on web the dialogs explain where to go instead.
  static const _browserSettingsHint =
      'Allow location for this site in your browser: click the icon at the '
      'left of the address bar and turn Location on.';

  static Future<void> _showServiceDisabledDialog(BuildContext context) async {
    await showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text("Location Disabled"),
        content: Text(
          LocationService.isWeb
              ? "Location is turned off on this device. Turn it on in your "
                  "device's settings, then try again."
              : "Please enable location services.",
        ),
        actions: [
          if (LocationService.isWeb)
            _okButton(dialogContext)
          else
            TextButton(
              onPressed: () {
                Navigator.pop(dialogContext);
                _openSafely(Geolocator.openLocationSettings);
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
      builder: (dialogContext) => AlertDialog(
        title: const Text("Permission Required"),
        content: const Text("Please allow location permission."),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(dialogContext);
              _openSafely(Geolocator.requestPermission);
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
      builder: (dialogContext) => AlertDialog(
        // On web the plugin also reports "denied forever" when the browser
        // was allowed but could not get a fix, so cover both there.
        title: Text(LocationService.isWeb
            ? "Location Not Available"
            : "Permission Permanently Denied"),
        content: Text(
          LocationService.isWeb
              ? "$_browserSettingsHint Also make sure location is turned on "
                  "for this device, then try again."
              : "Open app settings and allow location.",
        ),
        actions: [
          if (LocationService.isWeb)
            _okButton(dialogContext)
          else
            TextButton(
              onPressed: () {
                Navigator.pop(dialogContext);
                _openSafely(Geolocator.openAppSettings);
              },
              child: const Text("Open Settings"),
            ),
        ],
      ),
    );
  }

  static Future<void> _showLocationUnavailableDialog(
      BuildContext context) async {
    await showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text("Location Unavailable"),
        content: Text(
          LocationService.isWeb
              ? "We couldn't get your current location. Make sure location is "
                  "turned on for this device and allowed for this site in "
                  "your browser, then try again."
              : "We couldn't get your current location. Check that location "
                  "is turned on, move to an open area, then try again.",
        ),
        actions: [_okButton(dialogContext)],
      ),
    );
  }

  static Widget _okButton(BuildContext dialogContext) => TextButton(
        onPressed: () => Navigator.pop(dialogContext),
        child: const Text("OK"),
      );

  /// Settings/permission calls can throw on some platforms; a failed call
  /// must not leave the user stuck.
  static Future<void> _openSafely(Future<Object?> Function() action) async {
    try {
      await action();
    } catch (e) {
      debugPrint('[Location] Settings action failed: $e');
    }
  }
}
