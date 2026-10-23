import 'package:flutter_test/flutter_test.dart';
import 'package:es_platform_mobile/utils/visit_flow_resumer.dart';
import 'package:es_platform_mobile/views/samplecollection/models/sample_data.dart';

void main() {
  group('VisitFlowResumer.parseSelectedSamples', () {
    test('round-trips a list of SampleTypeCount JSON maps', () {
      final raw = [
        SampleTypeCount(
                type: 'Swab', count: 2, sampleId: 'st1', emojiIcon: '🧪')
            .toJson(),
        SampleTypeCount(type: 'Blood', count: 1, sampleId: 'st2').toJson(),
      ];

      final result = VisitFlowResumer.parseSelectedSamples(raw);

      expect(result, hasLength(2));
      expect(result[0].sampleId, 'st1');
      expect(result[0].type, 'Swab');
      expect(result[0].count, 2);
      expect(result[1].sampleId, 'st2');
      expect(result[1].count, 1);
    });

    test('returns empty list for null or non-list input', () {
      expect(VisitFlowResumer.parseSelectedSamples(null), isEmpty);
      expect(VisitFlowResumer.parseSelectedSamples('nonsense'), isEmpty);
    });
  });
}
