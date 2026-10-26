import 'package:flutter_test/flutter_test.dart';
import 'package:es_platform_mobile/utils/barcode_utils.dart';

void main() {
  group('BarcodeUtils.generateSequence', () {
    test('increments the trailing number of a slash-separated barcode', () {
      expect(
        BarcodeUtils.generateSequence('NA/EN/26-07/102001', 3),
        ['NA/EN/26-07/102001', 'NA/EN/26-07/102002', 'NA/EN/26-07/102003'],
      );
    });

    test('increments a simple letter-then-digit prefix', () {
      expect(
        BarcodeUtils.generateSequence('BMM001', 3),
        ['BMM001', 'BMM002', 'BMM003'],
      );
    });

    test('preserves zero padding and widens only on overflow', () {
      expect(
        BarcodeUtils.generateSequence('BMM008', 4),
        ['BMM008', 'BMM009', 'BMM010', 'BMM011'],
      );
      expect(
        BarcodeUtils.generateSequence('BMM999', 2),
        ['BMM999', 'BMM1000'],
      );
    });

    test('increments only the last digit run, leaving earlier ones intact', () {
      expect(
        BarcodeUtils.generateSequence('NA/EN/26-07/999', 2),
        ['NA/EN/26-07/999', 'NA/EN/26-07/1000'],
      );
    });

    test('returns the base unchanged for a single sample', () {
      expect(BarcodeUtils.generateSequence('NA/EN/26-07/102001', 1),
          ['NA/EN/26-07/102001']);
    });

    test('returns empty for non-positive counts', () {
      expect(BarcodeUtils.generateSequence('BMM001', 0), isEmpty);
      expect(BarcodeUtils.generateSequence('BMM001', -1), isEmpty);
    });

    test('appends an index when there is no trailing number', () {
      expect(
        BarcodeUtils.generateSequence('WW-SITE', 3),
        ['WW-SITE1', 'WW-SITE2', 'WW-SITE3'],
      );
    });

    test('appends an index when the trailing digits overflow a 64-bit int', () {
      final base = 'WW/${'9' * 25}';
      expect(
        BarcodeUtils.generateSequence(base, 2),
        ['${base}1', '${base}2'],
      );
    });
  });
}
