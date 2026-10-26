/// Why a barcode cannot be taken into the current scanning session.
enum ScanRejection {
  /// Already assigned to a sample outside this session.
  assignedElsewhere,

  /// Already captured earlier in this same session.
  alreadyInSession,

  /// Every slot in this session is filled.
  sessionFull,
}

/// The accumulated state of one continuous scanning session.
///
/// The scanner screen stays open across many scans, so the running list of
/// accepted barcodes lives here rather than in widget state. Keeping it as
/// plain Dart means the accept/reject rules are testable without a camera.
///
/// [maxCount] of 1 models the single-shot callers (a row's scan button, the
/// replicate flow, the metadata screen); anything higher models a batch.
class ScanSession {
  ScanSession({
    required this.maxCount,
    Iterable<String> existingBarcodes = const <String>[],
    this.alreadyScanned = 0,
    this.totalCount,
  })  : assert(maxCount >= 1, 'A session needs at least one slot'),
        _existing = existingBarcodes.map((String b) => b.trim()).toSet();

  /// How many barcodes this session may take before it is full.
  final int maxCount;

  /// Barcodes already assigned elsewhere, which this session must not reuse.
  final Set<String> _existing;

  /// Barcodes assigned before this session opened, for the progress readout.
  final int alreadyScanned;

  /// Total slots across the whole group, for the progress readout. Falls back
  /// to [maxCount] when the caller does not track a wider total.
  final int? totalCount;

  final List<String> _accepted = <String>[];

  /// Barcodes taken so far, in capture order.
  List<String> get accepted => List<String>.unmodifiable(_accepted);

  bool get isFull => _accepted.length >= maxCount;

  bool get isEmpty => _accepted.isEmpty;

  /// True when accepting a barcode should close the scanner immediately.
  bool get isSingleShot => maxCount == 1;

  /// Filled slots across the whole group, including work done before this
  /// session opened.
  int get progressCount => alreadyScanned + _accepted.length;

  /// Total slots across the whole group.
  int get progressTotal => totalCount ?? maxCount;

  /// Returns null when [barcode] can be taken, or the reason it cannot.
  ScanRejection? check(String barcode) {
    final String value = barcode.trim();
    if (_accepted.contains(value)) return ScanRejection.alreadyInSession;
    if (_existing.contains(value)) return ScanRejection.assignedElsewhere;
    if (isFull) return ScanRejection.sessionFull;
    return null;
  }

  /// Takes [barcode] into the session. Returns null on success, or the reason
  /// it was refused.
  ScanRejection? add(String barcode) {
    final ScanRejection? rejection = check(barcode);
    if (rejection != null) return rejection;
    _accepted.add(barcode.trim());
    return null;
  }

  /// Drops the most recent barcode, returning it, or null if there is none.
  String? undoLast() {
    if (_accepted.isEmpty) return null;
    return _accepted.removeLast();
  }

  /// Drops [barcode] wherever it sits in the session. Returns true if it was
  /// there. Freeing the slot also makes the barcode acceptable again.
  bool remove(String barcode) => _accepted.remove(barcode.trim());

  /// Human-readable copy for a refusal, naming the barcode it refers to.
  String messageFor(ScanRejection rejection, String barcode) {
    final String value = barcode.trim();
    switch (rejection) {
      case ScanRejection.alreadyInSession:
        return '$value was already scanned in this session.';
      case ScanRejection.assignedElsewhere:
        return '$value is already assigned to another sample.';
      case ScanRejection.sessionFull:
        return 'All $progressTotal samples already have a barcode.';
    }
  }
}
