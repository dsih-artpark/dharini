import 'sample_data.dart';

/// One animal's clinical samples on the review screen.
class ReviewAnimalGroup {
  ReviewAnimalGroup(this.displayId);

  /// The animal tag or bird ID the collector entered, or null if none was.
  final String? displayId;
  final List<SampleData> samples = [];
}

/// Samples split the way the review screen lists them.
class ReviewSampleGroups {
  const ReviewSampleGroups(this.animals, this.environmental);

  /// One entry per animal, in the order the animals were collected.
  final List<ReviewAnimalGroup> animals;
  final List<SampleData> environmental;
}

/// Splits [samples] into clinical samples, grouped per animal, and
/// environmental samples.
///
/// Whether a sample is clinical comes from the flow it was collected in, not
/// from an ID being entered: the animal tag and bird IDs are optional, so a
/// clinical sample without one must still be listed as clinical.
ReviewSampleGroups groupReviewSamples(List<SampleData> samples) {
  final animals = <String, ReviewAnimalGroup>{};
  final environmental = <SampleData>[];

  for (final sample in samples) {
    final animal = animalDetailsOf(sample);
    if (!_isClinical(sample, animal)) {
      environmental.add(sample);
      continue;
    }
    final displayId = _text(animal?['animalTagId']) ?? _text(animal?['birdId']);
    animals
        .putIfAbsent(_animalKey(animal), () => ReviewAnimalGroup(displayId))
        .samples
        .add(sample);
  }

  return ReviewSampleGroups(animals.values.toList(), environmental);
}

/// The animal details a clinical sample carries, or null if it has none.
Map<String, dynamic>? animalDetailsOf(SampleData sample) {
  final metadata = sample.metadata;
  if (metadata == null) return null;
  final nested = metadata['animalMetadata'];
  if (nested is Map) return Map<String, dynamic>.from(nested);
  // Older samples kept the animal's ID at the top level of the metadata.
  final hasTopLevelId = _text(metadata['animalTagId']) != null ||
      _text(metadata['birdId']) != null;
  return hasTopLevelId ? metadata : null;
}

bool _isClinical(SampleData sample, Map<String, dynamic>? animal) {
  final flowType = sample.flowType;
  if (flowType != null) return flowType == 'Clinical';
  // Drafts saved before samples recorded their flow: only clinical samples
  // carry an animal's details.
  return animal != null;
}

/// Tells animals apart the same way the backend does when it saves a visit:
/// a reused animal's record ID, then the tag ID, then the bird ID, then the
/// ID the app creates for an animal entered without either.
String _animalKey(Map<String, dynamic>? animal) {
  final existing = _text(animal?['selectedAnimalMetadataId']);
  if (existing != null) return 'existing:$existing';
  final tag = _text(animal?['animalTagId']);
  if (tag != null) return 'tag:$tag';
  final bird = _text(animal?['birdId']);
  if (bird != null) return 'bird:$bird';
  final local = _text(animal?['localAnimalId']);
  if (local != null) return 'local:$local';
  // Clinical samples with no animal details at all (e.g. the disease asks no
  // animal questions) share one group.
  return 'unidentified';
}

String? _text(Object? value) {
  final text = value?.toString().trim();
  return text == null || text.isEmpty ? null : text;
}
