import 'package:design_system/design_system.dart';
import 'package:flutter/material.dart';

/// Scanner-local tokens.
///
/// The camera feed forces a dark ground, and the app's light-surface semantic
/// colours (`onSuccessLight`, `errorDark`) do not hold up against it. These
/// derive from the brand palette but are tuned for legibility over video, and
/// are deliberately scoped to this screen rather than added to the shared
/// design system.
abstract final class ScannerTheme {
  /// The ground behind the camera and beneath the dock.
  static const Color ground = Color(0xFF0A0D14);

  /// Chrome and dock surfaces, one step up from [ground].
  static const Color panel = Color(0xFF141A26);

  /// A hairline between panel sections.
  static const Color rule = Color(0xFF232B3A);

  /// The brand blue at dark-surface luminance. Marks anything the scanner is
  /// actively doing: brackets, sweep, progress.
  static const Color signal = AppColors.primaryDark;

  /// Verdict: this barcode is good.
  static const Color verified = Color(0xFF34D399);

  /// Verdict: this barcode cannot be used.
  static const Color reject = Color(0xFFF87171);

  /// Primary readout text on dark surfaces.
  static const Color readout = Color(0xFFE6E8EB);

  /// Secondary text on dark surfaces.
  static const Color readoutWeak = Color(0xFF8B95A7);

  /// The dimming laid over the camera outside the reticle window.
  static const double scrimOpacity = 0.62;

  /// The barcode value is the one string the collector must read digit by
  /// digit, so it gets a monospace face and generous tracking that no other
  /// screen in the app uses.
  static const TextStyle barcodeReadout = TextStyle(
    fontFamily: 'monospace',
    fontSize: 24,
    height: 1.2,
    fontWeight: FontWeight.w600,
    letterSpacing: 2.4,
    color: readout,
  );

  /// The same treatment at chip size.
  static const TextStyle barcodeChip = TextStyle(
    fontFamily: 'monospace',
    fontSize: 12,
    height: 1.2,
    fontWeight: FontWeight.w500,
    letterSpacing: 0.8,
    color: readout,
  );

  /// Instrument-panel eyebrow: short, uppercase, widely tracked.
  static const TextStyle eyebrow = TextStyle(
    fontSize: 11,
    height: 1.2,
    fontWeight: FontWeight.w600,
    letterSpacing: 1.6,
    color: readoutWeak,
  );

  /// Guidance and status copy.
  static const TextStyle body = TextStyle(
    fontSize: 14,
    height: 1.4,
    fontWeight: FontWeight.w400,
    color: readoutWeak,
  );

  /// True when the platform asks for reduced motion; the sweep and chip
  /// entrance animations sit still rather than looping.
  static bool prefersReducedMotion(BuildContext context) =>
      MediaQuery.maybeDisableAnimationsOf(context) ?? false;
}
