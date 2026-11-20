import 'package:es_platform_mobile/views/samplecollection/models/review_sample_groups.dart';
import 'package:es_platform_mobile/views/samplecollection/models/sample_data.dart';
import 'package:flutter_test/flutter_test.dart';

SampleData sample(
  String name, {
  String? flowType,
  Map<String, dynamic>? animal,
  Map<String, dynamic>? metadata,
}) =>
    SampleData(
      replicates: 'not collected',
      photos: const [],
      diseases: const [],
      originalSampleBarcode: name,
      barcode: name,
      comments: '',
      sampleType: '$name-type',
      sampleName: name,
      metadata:
          metadata ?? (animal == null ? null : {'animalMetadata': animal}),
      flowType: flowType,
    );

List<String> names(List<SampleData> samples) =>
    samples.map((s) => s.sampleName).toList();

void main() {
  group('groupReviewSamples', () {
    test(
        'a clinical sample without a tag or bird ID is clinical, not '
        'environmental', () {
      // The reported case: Both flow, Muzzle Swab with no animal ID entered,
      // then Air in the environmental flow.
      final groups = groupReviewSamples([
        sample('Muzzle Swab',
            flowType: 'Clinical',
            animal: {'localAnimalId': 'animal_1', 'animalTagId': ''}),
        sample('Air', flowType: 'Environmental'),
      ]);

      expect(groups.animals, hasLength(1));
      expect(groups.animals.single.displayId, isNull);
      expect(names(groups.animals.single.samples), ['Muzzle Swab']);
      expect(names(groups.environmental), ['Air']);
    });

    test('groups clinical samples per animal, in collection order', () {
      final groups = groupReviewSamples([
        sample('Blood', flowType: 'Clinical', animal: {'animalTagId': 'T-2'}),
        sample('Swab', flowType: 'Clinical', animal: {'birdId': 'B-1'}),
        sample('Serum', flowType: 'Clinical', animal: {'animalTagId': 'T-2'}),
      ]);

      expect(groups.animals.map((a) => a.displayId), ['T-2', 'B-1']);
      expect(names(groups.animals.first.samples), ['Blood', 'Serum']);
      expect(groups.environmental, isEmpty);
    });

    test('keeps two animals without IDs apart', () {
      final groups = groupReviewSamples([
        sample('Blood', flowType: 'Clinical', animal: {'localAnimalId': 'a1'}),
        sample('Swab', flowType: 'Clinical', animal: {'localAnimalId': 'a2'}),
      ]);

      expect(groups.animals, hasLength(2));
      expect(groups.animals.map((a) => a.displayId), [null, null]);
    });

    test('groups a reused animal by its record ID', () {
      final groups = groupReviewSamples([
        sample('Blood',
            flowType: 'Clinical',
            animal: {'selectedAnimalMetadataId': 'id-1', 'animalTagId': null}),
        sample('Swab',
            flowType: 'Clinical',
            animal: {'selectedAnimalMetadataId': 'id-1', 'animalTagId': null}),
      ]);

      expect(groups.animals, hasLength(1));
      expect(names(groups.animals.single.samples), ['Blood', 'Swab']);
    });

    test('a clinical sample with no animal details is still clinical', () {
      // Diseases with no animal questions skip the animal form.
      final groups = groupReviewSamples([sample('Swab', flowType: 'Clinical')]);

      expect(groups.animals, hasLength(1));
      expect(groups.environmental, isEmpty);
    });

    test('an environmental sample stays environmental whatever it carries', () {
      final groups = groupReviewSamples([
        sample('Air', flowType: 'Environmental', animal: {'animalTagId': 'T'}),
      ]);

      expect(groups.animals, isEmpty);
      expect(names(groups.environmental), ['Air']);
    });

    group('samples from drafts saved before the flow was recorded', () {
      test('are clinical when they carry animal details', () {
        final groups = groupReviewSamples([
          sample('Swab', animal: {'localAnimalId': 'a1'}),
          sample('Blood', metadata: {'animalTagId': 'T-9'}),
        ]);

        expect(groups.animals.map((a) => a.displayId), [null, 'T-9']);
        expect(groups.environmental, isEmpty);
      });

      test('are environmental otherwise', () {
        final groups = groupReviewSamples([
          sample('Air'),
          sample('Water', metadata: {'waterSource': 'pond'}),
        ]);

        expect(groups.animals, isEmpty);
        expect(names(groups.environmental), ['Air', 'Water']);
      });
    });
  });

  group('SampleData.flowType', () {
    test('survives a draft round trip', () {
      final restored =
          SampleData.fromJson(sample('Swab', flowType: 'Clinical').toJson());

      expect(restored.flowType, 'Clinical');
    });

    test('is left out of the JSON when unknown', () {
      expect(sample('Swab').toJson().containsKey('flowType'), isFalse);
      expect(SampleData.fromJson(sample('Swab').toJson()).flowType, isNull);
    });
  });
}
