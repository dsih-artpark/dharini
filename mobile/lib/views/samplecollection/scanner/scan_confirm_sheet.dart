import 'package:flutter/material.dart';

import 'scanner_theme.dart';

/// What the scanner has concluded about the barcode currently in hand.
enum ScanVerdict { checking, verified, rejected }

/// The actions offered while a barcode is held for confirmation.
///
/// The verdict and the barcode itself are shown on the viewfinder card, where
/// the collector is already looking. This sheet carries only the decision, so
/// it stays short and leaves the frozen frame visible.
///
/// Nothing is committed until [onAccept] fires — there is no timer here.
class ScanConfirmSheet extends StatelessWidget {
  const ScanConfirmSheet({
    required this.verdict,
    required this.isSingleShot,
    required this.onRescan,
    this.onAccept,
    super.key,
  });

  final ScanVerdict verdict;
  final bool isSingleShot;
  final VoidCallback onRescan;

  /// Null until the barcode is verified. The button stays in place but
  /// disabled, so the row does not jump as the check resolves.
  final VoidCallback? onAccept;

  @override
  Widget build(BuildContext context) {
    final bool canAccept = verdict == ScanVerdict.verified && onAccept != null;
    final Color accent = verdict == ScanVerdict.rejected
        ? ScannerTheme.reject
        : ScannerTheme.verified;

    return Container(
      decoration: BoxDecoration(
        color: ScannerTheme.panel,
        border: Border(top: BorderSide(color: accent.withValues(alpha: 0.5))),
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 14, 16, 12),
          child: Row(
            children: <Widget>[
              Expanded(
                child: _SheetButton(
                  label: verdict == ScanVerdict.rejected
                      ? 'Scan another'
                      : 'Rescan',
                  onPressed: onRescan,
                  filled: false,
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                flex: 2,
                child: _SheetButton(
                  label: isSingleShot ? 'Use barcode' : 'Add & continue',
                  onPressed: canAccept ? onAccept : null,
                  filled: true,
                  accent: ScannerTheme.verified,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _SheetButton extends StatelessWidget {
  const _SheetButton({
    required this.label,
    required this.onPressed,
    required this.filled,
    this.accent,
  });

  final String label;
  final VoidCallback? onPressed;
  final bool filled;
  final Color? accent;

  @override
  Widget build(BuildContext context) {
    final bool enabled = onPressed != null;
    final Color background = filled
        ? (accent ?? ScannerTheme.signal)
        : Colors.white.withValues(alpha: 0.06);
    final Color foreground =
        filled ? ScannerTheme.ground : ScannerTheme.readout;

    return SizedBox(
      height: 50,
      child: TextButton(
        onPressed: onPressed,
        style: TextButton.styleFrom(
          backgroundColor: background,
          disabledBackgroundColor: Colors.white.withValues(alpha: 0.06),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
            side: filled && enabled
                ? BorderSide.none
                : const BorderSide(color: ScannerTheme.rule),
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w600,
            color: enabled
                ? foreground
                : ScannerTheme.readoutWeak.withValues(alpha: 0.6),
          ),
        ),
      ),
    );
  }
}
