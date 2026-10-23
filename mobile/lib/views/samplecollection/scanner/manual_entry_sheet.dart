import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'scanner_theme.dart';

/// Asks for a barcode by keyboard, for labels the camera cannot read.
///
/// Returns the trimmed entry, or null if dismissed. The value still goes
/// through the same duplicate and remote checks as a camera scan.
Future<String?> showManualEntrySheet(BuildContext context) {
  return showModalBottomSheet<String>(
    context: context,
    isScrollControlled: true,
    backgroundColor: ScannerTheme.panel,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
    ),
    builder: (BuildContext sheetContext) => const _ManualEntrySheet(),
  );
}

class _ManualEntrySheet extends StatefulWidget {
  const _ManualEntrySheet();

  @override
  State<_ManualEntrySheet> createState() => _ManualEntrySheetState();
}

class _ManualEntrySheetState extends State<_ManualEntrySheet> {
  final TextEditingController _controller = TextEditingController();
  bool _hasText = false;

  @override
  void initState() {
    super.initState();
    _controller.addListener(() {
      final bool hasText = _controller.text.trim().isNotEmpty;
      if (hasText != _hasText) setState(() => _hasText = hasText);
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _submit() {
    final String value = _controller.text.trim();
    if (value.isEmpty) return;
    Navigator.of(context).pop(value);
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        left: 16,
        right: 16,
        top: 20,
        bottom: MediaQuery.of(context).viewInsets.bottom +
            MediaQuery.of(context).padding.bottom +
            20,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text('ENTER BARCODE', style: ScannerTheme.eyebrow),
          const SizedBox(height: 12),
          TextField(
            controller: _controller,
            autofocus: true,
            textCapitalization: TextCapitalization.characters,
            textInputAction: TextInputAction.done,
            onSubmitted: (_) => _submit(),
            inputFormatters: <TextInputFormatter>[
              FilteringTextInputFormatter.deny(RegExp(r'\s')),
            ],
            style: ScannerTheme.barcodeReadout.copyWith(fontSize: 20),
            cursorColor: ScannerTheme.signal,
            decoration: InputDecoration(
              hintText: 'BC-0000',
              hintStyle: ScannerTheme.barcodeReadout.copyWith(
                fontSize: 20,
                color: ScannerTheme.readoutWeak.withValues(alpha: 0.5),
              ),
              filled: true,
              fillColor: Colors.white.withValues(alpha: 0.05),
              contentPadding:
                  const EdgeInsets.symmetric(horizontal: 14, vertical: 16),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: const BorderSide(color: ScannerTheme.rule),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: const BorderSide(color: ScannerTheme.rule),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: const BorderSide(color: ScannerTheme.signal),
              ),
            ),
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            height: 50,
            child: TextButton(
              onPressed: _hasText ? _submit : null,
              style: TextButton.styleFrom(
                backgroundColor: ScannerTheme.signal,
                disabledBackgroundColor: Colors.white.withValues(alpha: 0.06),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              child: Text(
                'Check barcode',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                  color: _hasText
                      ? Colors.white
                      : ScannerTheme.readoutWeak.withValues(alpha: 0.6),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
