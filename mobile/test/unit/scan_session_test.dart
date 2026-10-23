import 'package:es_platform_mobile/views/samplecollection/scanner/scan_session.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('ScanSession accumulation', () {
    test('takes barcodes in capture order', () {
      final ScanSession session = ScanSession(maxCount: 3);

      expect(session.add('BC-001'), isNull);
      expect(session.add('BC-002'), isNull);

      expect(session.accepted, <String>['BC-001', 'BC-002']);
    });

    test('trims surrounding whitespace before storing', () {
      final ScanSession session = ScanSession(maxCount: 2)..add('  BC-001 ');

      expect(session.accepted, <String>['BC-001']);
    });

    test('exposes an unmodifiable view of accepted barcodes', () {
      final ScanSession session = ScanSession(maxCount: 2)..add('BC-001');

      expect(() => session.accepted.add('BC-999'), throwsUnsupportedError);
    });

    test('is full once every slot is taken', () {
      final ScanSession session = ScanSession(maxCount: 2);
      expect(session.isFull, isFalse);

      session
        ..add('BC-001')
        ..add('BC-002');

      expect(session.isFull, isTrue);
    });
  });

  group('ScanSession rejection rules', () {
    test('refuses a barcode assigned to another sample', () {
      final ScanSession session = ScanSession(
        maxCount: 3,
        existingBarcodes: <String>['BC-001'],
      );

      expect(session.check('BC-001'), ScanRejection.assignedElsewhere);
      expect(session.add('BC-001'), ScanRejection.assignedElsewhere);
      expect(session.accepted, isEmpty);
    });

    test('refuses a barcode already captured in this session', () {
      final ScanSession session = ScanSession(maxCount: 3)..add('BC-001');

      expect(session.add('BC-001'), ScanRejection.alreadyInSession);
      expect(session.accepted, <String>['BC-001']);
    });

    test('refuses anything once the session is full', () {
      final ScanSession session = ScanSession(maxCount: 1)..add('BC-001');

      expect(session.add('BC-002'), ScanRejection.sessionFull);
      expect(session.accepted, <String>['BC-001']);
    });

    test('allows a barcode the caller excluded from the existing set', () {
      // A row re-scanning its own barcode: the caller omits it from
      // existingBarcodes, so the session must not treat it as a duplicate.
      final ScanSession session = ScanSession(
        maxCount: 1,
        existingBarcodes: <String>['BC-002', 'BC-003'],
      );

      expect(session.check('BC-001'), isNull);
    });

    test('names the barcode in the refusal message', () {
      final ScanSession session = ScanSession(
        maxCount: 2,
        existingBarcodes: <String>['BC-001'],
      );

      expect(
        session.messageFor(ScanRejection.assignedElsewhere, 'BC-001'),
        contains('BC-001'),
      );
    });
  });

  group('ScanSession undo', () {
    test('drops the most recent barcode and returns it', () {
      final ScanSession session = ScanSession(maxCount: 3)
        ..add('BC-001')
        ..add('BC-002');

      expect(session.undoLast(), 'BC-002');
      expect(session.accepted, <String>['BC-001']);
    });

    test('frees the slot so the session is no longer full', () {
      final ScanSession session = ScanSession(maxCount: 1)..add('BC-001');
      expect(session.isFull, isTrue);

      session.undoLast();

      expect(session.isFull, isFalse);
      expect(session.add('BC-002'), isNull);
    });

    test('allows re-scanning a barcode that was undone', () {
      final ScanSession session = ScanSession(maxCount: 2)..add('BC-001');
      session.undoLast();

      expect(session.add('BC-001'), isNull);
    });

    test('returns null when there is nothing to undo', () {
      expect(ScanSession(maxCount: 2).undoLast(), isNull);
    });

    test('removes a barcode from the middle of the session', () {
      final ScanSession session = ScanSession(maxCount: 3)
        ..add('BC-001')
        ..add('BC-002')
        ..add('BC-003');

      expect(session.remove('BC-002'), isTrue);
      expect(session.accepted, <String>['BC-001', 'BC-003']);
    });

    test('reports false when removing something not in the session', () {
      final ScanSession session = ScanSession(maxCount: 3)..add('BC-001');

      expect(session.remove('BC-999'), isFalse);
      expect(session.accepted, <String>['BC-001']);
    });

    test('a removed barcode becomes acceptable again', () {
      final ScanSession session = ScanSession(maxCount: 2)..add('BC-001');
      session.remove('BC-001');

      expect(session.add('BC-001'), isNull);
    });
  });

  group('ScanSession progress', () {
    test('counts work done before the session opened', () {
      final ScanSession session = ScanSession(
        maxCount: 5,
        alreadyScanned: 3,
        totalCount: 8,
      )..add('BC-004');

      expect(session.progressCount, 4);
      expect(session.progressTotal, 8);
    });

    test('falls back to maxCount when no wider total is given', () {
      expect(ScanSession(maxCount: 4).progressTotal, 4);
    });
  });

  group('ScanSession mode', () {
    test('a single slot is single-shot', () {
      expect(ScanSession(maxCount: 1).isSingleShot, isTrue);
      expect(ScanSession(maxCount: 2).isSingleShot, isFalse);
    });

    test('rejects a session with no slots', () {
      expect(() => ScanSession(maxCount: 0), throwsAssertionError);
    });
  });
}
