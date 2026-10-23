import 'package:flutter/material.dart';

import 'scanner_theme.dart';

/// What the viewfinder is showing over the camera frame.
enum ViewfinderStatus {
  /// Camera running, looking for a barcode.
  live,

  /// Camera stopped by the collector.
  paused,

  /// A barcode is in hand and being checked.
  checking,

  /// A barcode is in hand and can be used.
  verified,

  /// A barcode is in hand and cannot be used.
  rejected,
}

/// The dimmed camera overlay: a clear window with corner brackets and a sweep
/// line, everything outside it scrimmed.
///
/// The scrim cutout and the brackets are painted from the same [Rect], so they
/// cannot drift apart the way separately-positioned widgets can.
class ScannerViewfinder extends StatelessWidget {
  const ScannerViewfinder({
    required this.sweep,
    required this.status,
    this.barcode,
    this.rejectionMessage,
    this.showSweep = true,
    super.key,
  });

  /// Sweep line position within the window, 0 (top) to 1 (bottom).
  final Animation<double> sweep;

  final ViewfinderStatus status;

  /// The barcode in hand, shown on the verdict card beneath the window.
  final String? barcode;

  /// Why the barcode cannot be used; only read when [status] is rejected.
  final String? rejectionMessage;

  /// False under reduced motion, where a frozen sweep line would read as a
  /// stray mark rather than as scanning.
  final bool showSweep;

  bool get _isLive => status == ViewfinderStatus.live;

  /// The verdict colour, which the brackets take so the whole frame reads as
  /// the answer rather than just the card.
  Color get _accent => switch (status) {
        ViewfinderStatus.live => ScannerTheme.signal,
        ViewfinderStatus.verified => ScannerTheme.verified,
        ViewfinderStatus.rejected => ScannerTheme.reject,
        ViewfinderStatus.paused || ViewfinderStatus.checking =>
          ScannerTheme.readoutWeak,
      };

  /// The clear window, derived from the space the viewfinder is given.
  ///
  /// Sized to a barcode's landscape aspect and sat above centre, which leaves
  /// room for the dock without the collector's hand covering the target.
  static Rect windowFor(Size size) {
    final double width = (size.width - 48).clamp(160.0, 320.0);
    final double height = width * 0.52;
    final double top = (size.height - height) * 0.38;
    return Rect.fromLTWH((size.width - width) / 2, top, width, height);
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        final Size size = constraints.biggest;
        final Rect window = windowFor(size);

        return Stack(
          children: <Widget>[
            Positioned.fill(
              child: RepaintBoundary(
                child: AnimatedBuilder(
                  animation: sweep,
                  builder: (BuildContext context, _) => CustomPaint(
                    painter: _ViewfinderPainter(
                      window: window,
                      sweep: sweep.value,
                      accent: _accent,
                      isLive: _isLive,
                      showSweep: showSweep,
                    ),
                  ),
                ),
              ),
            ),
            Positioned(
              top: window.bottom + 18,
              left: 20,
              right: 20,
              child: Center(
                child: switch (status) {
                  ViewfinderStatus.live =>
                    const _GuidanceLine('Point at the barcode'),
                  ViewfinderStatus.paused =>
                    const _GuidanceLine('Camera paused'),
                  ViewfinderStatus.checking ||
                  ViewfinderStatus.verified ||
                  ViewfinderStatus.rejected =>
                    _VerdictCard(
                      status: status,
                      accent: _accent,
                      barcode: barcode ?? '',
                      rejectionMessage: rejectionMessage,
                    ),
                },
              ),
            ),
          ],
        );
      },
    );
  }
}

class _ViewfinderPainter extends CustomPainter {
  _ViewfinderPainter({
    required this.window,
    required this.sweep,
    required this.accent,
    required this.isLive,
    required this.showSweep,
  });

  final Rect window;
  final double sweep;
  final Color accent;
  final bool isLive;
  final bool showSweep;

  static const double _radius = 14;
  static const double _bracket = 30;

  @override
  void paint(Canvas canvas, Size size) {
    final RRect cutout =
        RRect.fromRectAndRadius(window, const Radius.circular(_radius));

    // Scrim everything outside the window.
    canvas.drawPath(
      Path.combine(
        PathOperation.difference,
        Path()..addRect(Offset.zero & size),
        Path()..addRRect(cutout),
      ),
      Paint()
        ..color = Colors.black.withValues(alpha: ScannerTheme.scrimOpacity),
    );

    // Sweep line, clipped to the window so it reads as travelling through it.
    if (isLive && showSweep) {
      canvas.save();
      canvas.clipRRect(cutout);
      final double y = window.top + window.height * sweep;
      canvas.drawRect(
        Rect.fromLTRB(window.left, y - 22, window.right, y + 2),
        Paint()
          ..shader = LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: <Color>[
              accent.withValues(alpha: 0),
              accent.withValues(alpha: 0.28),
            ],
          ).createShader(
            Rect.fromLTRB(window.left, y - 22, window.right, y + 2),
          ),
      );
      canvas.drawLine(
        Offset(window.left, y),
        Offset(window.right, y),
        Paint()
          ..color = accent
          ..strokeWidth = 2,
      );
      canvas.restore();
    }

    canvas.drawPath(
      _brackets(),
      Paint()
        ..color = accent
        ..style = PaintingStyle.stroke
        ..strokeWidth = 3
        ..strokeCap = StrokeCap.round,
    );
  }

  /// Four corner brackets that follow the window's corner radius. Corners
  /// alone, rather than a full frame, keep the target area unobstructed.
  Path _brackets() {
    const double r = _radius;
    const double b = _bracket;
    final Rect w = window;

    return Path()
      // Top-left
      ..moveTo(w.left, w.top + r + b)
      ..lineTo(w.left, w.top + r)
      ..arcToPoint(Offset(w.left + r, w.top), radius: const Radius.circular(r))
      ..lineTo(w.left + r + b, w.top)
      // Top-right
      ..moveTo(w.right - r - b, w.top)
      ..lineTo(w.right - r, w.top)
      ..arcToPoint(Offset(w.right, w.top + r), radius: const Radius.circular(r))
      ..lineTo(w.right, w.top + r + b)
      // Bottom-right
      ..moveTo(w.right, w.bottom - r - b)
      ..lineTo(w.right, w.bottom - r)
      ..arcToPoint(Offset(w.right - r, w.bottom),
          radius: const Radius.circular(r))
      ..lineTo(w.right - r - b, w.bottom)
      // Bottom-left
      ..moveTo(w.left + r + b, w.bottom)
      ..lineTo(w.left + r, w.bottom)
      ..arcToPoint(Offset(w.left, w.bottom - r),
          radius: const Radius.circular(r))
      ..lineTo(w.left, w.bottom - r - b);
  }

  @override
  bool shouldRepaint(_ViewfinderPainter old) =>
      old.window != window ||
      old.sweep != sweep ||
      old.accent != accent ||
      old.isLive != isLive ||
      old.showSweep != showSweep;
}

/// Guidance shown under the window while the camera is looking.
class _GuidanceLine extends StatelessWidget {
  const _GuidanceLine(this.text);

  final String text;

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      textAlign: TextAlign.center,
      style: ScannerTheme.body.copyWith(
        color: ScannerTheme.readout.withValues(alpha: 0.85),
        shadows: const <Shadow>[Shadow(color: Colors.black87, blurRadius: 8)],
      ),
    );
  }
}

/// The verdict, sat directly under the frozen frame.
///
/// This is where the collector is already looking when a barcode is read, so
/// the answer is delivered here rather than only at the bottom of the screen.
/// The card is opaque: a barcode has to be checked digit by digit and cannot
/// float over camera noise.
class _VerdictCard extends StatelessWidget {
  const _VerdictCard({
    required this.status,
    required this.accent,
    required this.barcode,
    this.rejectionMessage,
  });

  final ViewfinderStatus status;
  final Color accent;
  final String barcode;
  final String? rejectionMessage;

  @override
  Widget build(BuildContext context) {
    final bool rejected = status == ViewfinderStatus.rejected;

    return Semantics(
      container: true,
      liveRegion: true,
      // The card's parts read as fragments on their own; announce the whole
      // verdict as one sentence instead.
      excludeSemantics: true,
      label: switch (status) {
        ViewfinderStatus.checking => 'Checking $barcode',
        ViewfinderStatus.verified => 'Verified, $barcode',
        ViewfinderStatus.rejected =>
          'Cannot use $barcode. ${rejectionMessage ?? ''}',
        _ => barcode,
      },
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 340),
        child: DecoratedBox(
          decoration: BoxDecoration(
            color: ScannerTheme.panel,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: accent.withValues(alpha: 0.55)),
            boxShadow: const <BoxShadow>[
              BoxShadow(color: Colors.black54, blurRadius: 16, spreadRadius: 2),
            ],
          ),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: <Widget>[
                    _VerdictMark(status: status, accent: accent),
                    const SizedBox(width: 10),
                    Flexible(
                      child: Text(
                        barcode,
                        style: ScannerTheme.barcodeReadout.copyWith(
                          fontSize: 19,
                          color: rejected
                              ? ScannerTheme.readout.withValues(alpha: 0.75)
                              : ScannerTheme.readout,
                          decoration:
                              rejected ? TextDecoration.lineThrough : null,
                          decorationColor: ScannerTheme.reject,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
                if (rejected && rejectionMessage != null) ...<Widget>[
                  const SizedBox(height: 8),
                  Text(
                    rejectionMessage!,
                    style: ScannerTheme.body.copyWith(
                      color: ScannerTheme.reject,
                      height: 1.35,
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _VerdictMark extends StatelessWidget {
  const _VerdictMark({required this.status, required this.accent});

  final ViewfinderStatus status;
  final Color accent;

  @override
  Widget build(BuildContext context) {
    if (status == ViewfinderStatus.checking) {
      return const SizedBox(
        width: 20,
        height: 20,
        child: CircularProgressIndicator(
          strokeWidth: 2,
          color: ScannerTheme.readoutWeak,
        ),
      );
    }

    return Container(
      width: 22,
      height: 22,
      decoration: BoxDecoration(color: accent, shape: BoxShape.circle),
      child: Icon(
        status == ViewfinderStatus.verified
            ? Icons.check_rounded
            : Icons.priority_high_rounded,
        size: 15,
        color: ScannerTheme.ground,
      ),
    );
  }
}
