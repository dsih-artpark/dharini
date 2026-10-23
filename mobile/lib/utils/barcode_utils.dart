/// Helpers for generating sequential sample barcodes.
class BarcodeUtils {
  BarcodeUtils._();

  /// Matches any prefix followed by a trailing run of digits, e.g.
  /// `BMM001` -> (`BMM`, `001`) and `NA/EN/26-07/102001` -> (`NA/EN/26-07/`,
  /// `102001`).
  static final RegExp _trailingNumber = RegExp(r'^(.*?)(\d+)$');

  /// Generates [count] barcodes from [base] by incrementing its trailing
  /// number, preserving the original zero padding.
  ///
  /// `('NA/EN/26-07/102001', 3)` -> `[.../102001, .../102002, .../102003]`.
  ///
  /// When [base] has no trailing number to increment (e.g. `WW-SITE`), falls
  /// back to appending a 1-based index.
  static List<String> generateSequence(String base, int count) {
    if (count <= 0) return const [];
    if (count == 1) return [base];

    final match = _trailingNumber.firstMatch(base);
    // tryParse guards against digit runs too long for a 64-bit int.
    final startNum =
        match != null ? int.tryParse(match.group(2)!) : null;

    if (match == null || startNum == null) {
      return List.generate(count, (i) => '$base${i + 1}');
    }

    final prefix = match.group(1)!;
    final padding = match.group(2)!.length;

    return List.generate(
      count,
      (i) => '$prefix${(startNum + i).toString().padLeft(padding, '0')}',
    );
  }
}
