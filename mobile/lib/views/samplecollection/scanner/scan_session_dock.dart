import 'package:flutter/material.dart';

import 'scanner_theme.dart';

/// The persistent bottom rail of the scanner.
///
/// This is the one surface that never leaves the screen during a session. Its
/// contents change, but its position does not, so the collector's eye never has
/// to re-find their progress — that is what the old push/pop-per-barcode flow
/// gave up.
class ScanSessionDock extends StatelessWidget {
  const ScanSessionDock({
    required this.accepted,
    required this.isSingleShot,
    required this.onUndo,
    required this.onManualEntry,
    required this.onDone,
    super.key,
  });

  /// Barcodes taken so far, in capture order.
  final List<String> accepted;

  /// Single-shot callers close on accept, so they never show chips or Done.
  final bool isSingleShot;

  /// Drops one barcode from the session.
  final ValueChanged<String> onUndo;

  final VoidCallback onManualEntry;

  /// Closes the scanner, returning everything taken so far.
  final VoidCallback onDone;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: ScannerTheme.panel,
        border: Border(top: BorderSide(color: ScannerTheme.rule)),
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 14, 16, 12),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              if (!isSingleShot) ...<Widget>[
                _ChipRail(accepted: accepted, onUndo: onUndo),
                const SizedBox(height: 14),
              ],
              Row(
                children: <Widget>[
                  Expanded(
                    child: _DockButton(
                      icon: Icons.keyboard_alt_outlined,
                      label: 'Enter manually',
                      onPressed: onManualEntry,
                      filled: false,
                    ),
                  ),
                  if (!isSingleShot) ...<Widget>[
                    const SizedBox(width: 10),
                    Expanded(
                      child: _DockButton(
                        icon: Icons.check_rounded,
                        label: accepted.isEmpty
                            ? 'Done'
                            : 'Done · ${accepted.length}',
                        onPressed: onDone,
                        filled: true,
                      ),
                    ),
                  ],
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// The accumulating record of the session: one chip per barcode, oldest first.
class _ChipRail extends StatelessWidget {
  const _ChipRail({required this.accepted, required this.onUndo});

  final List<String> accepted;
  final ValueChanged<String> onUndo;

  @override
  Widget build(BuildContext context) {
    if (accepted.isEmpty) {
      return SizedBox(
        height: 34,
        child: Row(
          children: <Widget>[
            const Icon(Icons.radio_button_unchecked,
                size: 14, color: ScannerTheme.readoutWeak),
            const SizedBox(width: 8),
            Text('No barcodes yet', style: ScannerTheme.body),
          ],
        ),
      );
    }

    return SizedBox(
      height: 34,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        reverse: true,
        itemCount: accepted.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (BuildContext context, int index) {
          // Reversed so the newest chip sits under the thumb without scrolling.
          final String barcode = accepted[accepted.length - 1 - index];
          return _ScanChip(barcode: barcode, onRemove: () => onUndo(barcode));
        },
      ),
    );
  }
}

class _ScanChip extends StatelessWidget {
  const _ScanChip({required this.barcode, required this.onRemove});

  final String barcode;
  final VoidCallback onRemove;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: BoxDecoration(
        color: ScannerTheme.verified.withValues(alpha: 0.10),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: ScannerTheme.verified.withValues(alpha: 0.35),
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.only(left: 10),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            const Icon(Icons.check_rounded,
                size: 13, color: ScannerTheme.verified),
            const SizedBox(width: 6),
            Text(barcode, style: ScannerTheme.barcodeChip),
            Semantics(
              container: true,
              button: true,
              label: 'Remove $barcode',
              child: InkWell(
                onTap: onRemove,
                borderRadius: BorderRadius.circular(8),
                child: const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 10),
                  child: Icon(Icons.close_rounded,
                      size: 13, color: ScannerTheme.readoutWeak),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _DockButton extends StatelessWidget {
  const _DockButton({
    required this.icon,
    required this.label,
    required this.onPressed,
    required this.filled,
  });

  final IconData icon;
  final String label;
  final VoidCallback onPressed;
  final bool filled;

  @override
  Widget build(BuildContext context) {
    final Color foreground =
        filled ? Colors.white : ScannerTheme.readout.withValues(alpha: 0.9);

    return SizedBox(
      height: 48,
      child: TextButton.icon(
        onPressed: onPressed,
        icon: Icon(icon, size: 18, color: foreground),
        label: Text(
          label,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: foreground,
          ),
        ),
        style: TextButton.styleFrom(
          backgroundColor:
              filled ? ScannerTheme.signal : Colors.white.withValues(alpha: 0.06),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
            side: filled
                ? BorderSide.none
                : const BorderSide(color: ScannerTheme.rule),
          ),
        ),
      ),
    );
  }
}
