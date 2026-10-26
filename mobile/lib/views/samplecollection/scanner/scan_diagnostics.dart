import 'package:es_platform_mobile/utils/sentry_scrubber.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

/// Records what goes wrong while a collector scans, so a problem in the field
/// (a label that will not read, a camera that will not start) can be seen in
/// Sentry.
///
/// It sends reasons, counts, timings and barcode *formats and lengths*, never
/// the barcode value. One instance lives for one scanner screen. A reason is
/// reported at most once per screen, so a camera stuck in a retry loop cannot
/// flood Sentry; every step is still kept as a breadcrumb.
class ScanDiagnostics {
  ScanDiagnostics({DateTime Function()? now}) : _now = now ?? DateTime.now;

  final DateTime Function() _now;
  final Set<String> _reported = <String>{};

  DateTime? _liveSince;
  int _reads = 0;
  int _unreadable = 0;

  /// A manual entry this long after the camera went live, with no label read,
  /// counts as the collector giving up on scanning.
  static const Duration giveUpAfter = Duration(seconds: 10);

  /// The camera is running and looking for a barcode.
  void cameraLive() {
    if (_liveSince != null) return;
    _liveSince = _now();
    _breadcrumb('camera live');
  }

  /// A barcode was read.
  void read(Barcode barcode) {
    _reads++;
    _breadcrumb('barcode read', {
      'format': barcode.format.name,
      'length': barcode.rawValue?.length,
    });
  }

  /// The camera saw a code but could not turn it into text.
  void unreadable(Barcode barcode) {
    _unreadable++;
    // The camera reports this several times a second while the label is in
    // view, so only the first is a breadcrumb; the count goes in the report.
    if (_unreadable == 1) {
      _breadcrumb('barcode seen but not readable', {
        'format': barcode.format.name,
      });
    }
  }

  /// A barcode was refused. [kind] is a short reason code such as
  /// `already_in_session` or `server_rejected`. The rejection message itself
  /// is not sent: it quotes the barcode ("Barcode "BMM001" already exists").
  void rejected(String kind, {int? length}) {
    _breadcrumb('barcode rejected', {
      'kind': kind,
      'length': length,
    });
  }

  /// The barcode could not be checked against the project, usually a
  /// connection problem. The failed API call is reported separately.
  void validationUnavailable() => _breadcrumb('barcode check unavailable');

  /// The camera did not start or stopped working.
  void cameraError(MobileScannerException error) {
    final code = error.errorCode;
    // Permission denied is something the collector fixes in Settings, so it is
    // informational; anything else points to a device or app fault.
    final level = code == MobileScannerErrorCode.permissionDenied
        ? SentryLevel.info
        : SentryLevel.warning;
    _report(
      'camera_${code.name}',
      'Barcode scanner: camera ${code.name}',
      level: level,
      data: {
        'error_code': code.name,
        if (error.errorDetails?.message != null)
          'details': SentryScrubber.maskText(error.errorDetails!.message!),
      },
    );
  }

  /// Starting or stopping the camera threw. Errors that only mean the
  /// controller was already running or already torn down are expected during
  /// normal use and stay breadcrumbs.
  void cameraCallFailed(String action, Object error, StackTrace stack) {
    final expected = error is MobileScannerException &&
        (error.errorCode == MobileScannerErrorCode.controllerAlreadyInitialized ||
            error.errorCode == MobileScannerErrorCode.controllerDisposed ||
            error.errorCode == MobileScannerErrorCode.controllerUninitialized);
    if (expected) {
      _breadcrumb('camera $action ignored', {
        'error_code': error.errorCode.name,
      });
      return;
    }
    if (error is MobileScannerException) {
      cameraError(error);
      return;
    }
    _report(
      'camera_${action}_failed',
      'Barcode scanner: camera $action failed',
      level: SentryLevel.warning,
      error: error,
      stack: stack,
    );
  }

  /// The collector opened manual entry. If the camera had been running for a
  /// while without reading a label, that is a scan that did not work.
  void manualEntryOpened({Map<String, dynamic>? camera}) {
    final live = _liveSince;
    final seconds = live == null ? null : _now().difference(live).inSeconds;
    final gaveUp = _reads == 0 &&
        (_unreadable > 0 ||
            (seconds != null && seconds >= giveUpAfter.inSeconds));

    final data = <String, dynamic>{
      'seconds_since_camera_live': seconds,
      'reads': _reads,
      'unreadable': _unreadable,
      ...?camera,
    };
    if (gaveUp) {
      _report(
        'manual_entry_after_failed_scan',
        'Barcode scanner: manual entry after scan did not read',
        level: SentryLevel.info,
        data: data,
      );
    } else {
      _breadcrumb('manual entry opened', data);
    }
  }

  /// The scanner screen closed. [accepted] is how many barcodes the collector
  /// took, by camera or by hand. Leaving with none after the camera had been
  /// running a while means the label would not scan and manual entry was not
  /// used either.
  void closed({required int accepted}) {
    final live = _liveSince;
    if (accepted > 0 || live == null) return;
    final seconds = _now().difference(live).inSeconds;
    if (seconds < giveUpAfter.inSeconds) return;
    if (_reported.contains('manual_entry_after_failed_scan')) return;
    _report(
      'left_without_scan',
      'Barcode scanner: closed without a barcode',
      level: SentryLevel.info,
      data: {
        'seconds_since_camera_live': seconds,
        'reads': _reads,
        'unreadable': _unreadable,
      },
    );
  }

  void _breadcrumb(String message, [Map<String, dynamic>? data]) {
    Sentry.addBreadcrumb(Breadcrumb(
      category: 'scanner',
      message: message,
      level: SentryLevel.info,
      data: data,
    ));
  }

  void _report(
    String reason,
    String message, {
    required SentryLevel level,
    Map<String, dynamic>? data,
    Object? error,
    StackTrace? stack,
  }) {
    _breadcrumb(message, data);
    if (!_reported.add(reason)) return;

    void scope(Scope s) {
      s.level = level;
      s.setTag('scanner.reason', reason);
      if (data != null) s.setContexts('scanner', data);
    }

    if (error != null) {
      Sentry.captureException(error, stackTrace: stack, withScope: scope);
    } else {
      Sentry.captureMessage(message, level: level, withScope: scope);
    }
  }
}
