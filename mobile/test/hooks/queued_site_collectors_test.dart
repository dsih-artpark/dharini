import 'package:es_platform_mobile/hooks/auth.dart';
import 'package:flutter_test/flutter_test.dart';

/// Site creations wait in the offline queue across an app update, so one
/// queued by a build from before sites had several collectors still carries
/// its collector as the single `collectionCollector` id.
void main() {
  group('collectorIdsFromQueued', () {
    test('reads a list, or the single id an older build queued', () {
      expect(collectorIdsFromQueued(['u1', 'u2']), ['u1', 'u2']);
      expect(collectorIdsFromQueued('u1'), ['u1']);
    });

    test('drops blanks and anything that is not an id', () {
      expect(collectorIdsFromQueued(''), isEmpty);
      expect(collectorIdsFromQueued(null), isEmpty);
      expect(collectorIdsFromQueued(['u1', '', 7]), ['u1']);
    });
  });

  group('upgradeQueuedSitePayload', () {
    test('moves an older build’s collector into collectionCollectors', () {
      expect(
        upgradeQueuedSitePayload({'name': 'Farm', 'collectionCollector': 'u1'}),
        {
          'name': 'Farm',
          'collectionCollectors': ['u1'],
        },
      );
    });

    test('drops an older build’s empty collector', () {
      expect(
        upgradeQueuedSitePayload({'name': 'Farm', 'collectionCollector': ''}),
        {'name': 'Farm'},
      );
    });

    test('leaves a current payload as it is', () {
      final payload = {
        'name': 'Farm',
        'collectionCollectors': ['u1', 'u2'],
      };
      expect(identical(upgradeQueuedSitePayload(payload), payload), isTrue);
    });
  });
}
