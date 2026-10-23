import 'package:flutter_test/flutter_test.dart';
import 'package:es_platform_mobile/views/samplecollection/widgets/animal_metadata_card.dart';

void main() {
  group('AnimalCardInfo.fromMetadata', () {
    test('null or empty map → isEmpty, nothing extracted', () {
      expect(AnimalCardInfo.fromMetadata(null).isEmpty, isTrue);
      expect(AnimalCardInfo.fromMetadata(const {}).isEmpty, isTrue);
    });

    test('FMD/LSD keys: animalTagId + species', () {
      final info = AnimalCardInfo.fromMetadata(const {
        'animalTagId': 'ABC123',
        'species': 'species-uuid-1',
      });

      expect(info.identifier, 'ABC123');
      expect(info.identifierLabel, 'Tag');
      expect(info.speciesId, 'species-uuid-1');
      expect(info.isEmpty, isFalse);
    });

    test('avian-flu keys: birdId + species_AI', () {
      final info = AnimalCardInfo.fromMetadata(const {
        'birdId': 'BIRD-9',
        'species_AI': 'species-uuid-2',
      });

      expect(info.identifier, 'BIRD-9');
      expect(info.identifierLabel, 'Bird');
      expect(info.speciesId, 'species-uuid-2');
    });

    test('prefers animalTagId over birdId when both present', () {
      final info = AnimalCardInfo.fromMetadata(const {
        'animalTagId': 'TAG-1',
        'birdId': 'BIRD-1',
      });

      expect(info.identifier, 'TAG-1');
      expect(info.identifierLabel, 'Tag');
    });

    test('prefers species over species_AI when both present', () {
      final info = AnimalCardInfo.fromMetadata(const {
        'species': 'primary',
        'species_AI': 'secondary',
      });

      expect(info.speciesId, 'primary');
    });

    test('blank / whitespace-only values are treated as absent', () {
      final info = AnimalCardInfo.fromMetadata(const {
        'animalTagId': '   ',
        'birdId': '',
        'species': '  ',
      });

      expect(info.identifier, isNull);
      expect(info.identifierLabel, isNull);
      expect(info.speciesId, isNull);
      expect(info.isEmpty, isTrue);
    });

    test('species-only metadata is not empty (identifier optional)', () {
      final info = AnimalCardInfo.fromMetadata(const {
        'species': 'species-uuid-3',
      });

      expect(info.identifier, isNull);
      expect(info.speciesId, 'species-uuid-3');
      expect(info.isEmpty, isFalse);
    });

    test('non-string values are coerced to string', () {
      final info = AnimalCardInfo.fromMetadata(const {'animalTagId': 12345});
      expect(info.identifier, '12345');
    });
  });
}
