/// A plain Dart model representing an animal metadata record fetched from the
/// backend. Used for display in the animal selection card list before clinical
/// sample collection starts.
class AnimalMetadataModel {
  final String id;
  final String? animalTagId;
  final String? birdId;
  final String? speciesId;
  final String? speciesName;
  final String? speciesEmoji;
  final String? breed;
  final int? ageYears;
  final int? ageMonths;
  final String? gender;
  final String? vaccinationStage;
  final bool feverObserved;
  final DateTime? createdAt;

  const AnimalMetadataModel({
    required this.id,
    this.animalTagId,
    this.birdId,
    this.speciesId,
    this.speciesName,
    this.speciesEmoji,
    this.breed,
    this.ageYears,
    this.ageMonths,
    this.gender,
    this.vaccinationStage,
    this.feverObserved = false,
    this.createdAt,
  });

  factory AnimalMetadataModel.fromJson(Map<String, dynamic> json) {
    final speciesJson = json['species'];
    final species = speciesJson != null
        ? Map<String, dynamic>.from(speciesJson as Map)
        : null;
    return AnimalMetadataModel(
      id: json['id']?.toString() ?? '',
      animalTagId: json['animalTagId']?.toString(),
      birdId: json['birdId']?.toString(),
      speciesId: species?['id']?.toString(),
      speciesName: species?['name']?.toString(),
      speciesEmoji: species?['emojiIcon']?.toString(),
      breed: json['breed']?.toString(),
      ageYears: _toInt(json['ageYears']),
      ageMonths: _toInt(json['ageMonths']),
      gender: json['gender']?.toString(),
      vaccinationStage: json['vaccinationStage']?.toString(),
      feverObserved: json['feverObserved'] == true,
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'].toString())
          : null,
    );
  }

  static int? _toInt(dynamic value) {
    if (value == null) return null;
    if (value is int) return value;
    if (value is double) return value.round();
    return int.tryParse(value.toString());
  }

  /// Display label: species emoji + name, or a fallback.
  String get speciesLabel {
    final emoji = speciesEmoji ?? '';
    final name = speciesName ?? 'Unknown species';
    return emoji.isEmpty ? name : '$emoji $name';
  }

  /// Short identifier string shown on the card (tag ID or bird ring ID).
  String get primaryId => animalTagId ?? birdId ?? '';

  /// Short human-readable age string.
  String get ageLabel {
    if (ageYears == null && ageMonths == null) return '';
    final parts = <String>[];
    if ((ageYears ?? 0) > 0) parts.add('${ageYears}y');
    if ((ageMonths ?? 0) > 0) parts.add('${ageMonths}m');
    return parts.join(' ');
  }

  /// Build the map that is stored in `answers` when this animal is selected.
  /// Only the `selectedAnimalMetadataId` key is needed — the backend resolves
  /// the rest. We also keep a copy of display fields so the UI can show them.
  Map<String, dynamic> toSelectedAnswers() => {
        'selectedAnimalMetadataId': id,
        // Mirror fields for local display only (not re-sent if ID is used)
        'animalTagId': animalTagId,
        'birdId': birdId,
        'species': speciesId,
        'breed': breed,
        'ageYears': ageYears,
        'ageMonths': ageMonths,
        'gender': gender,
      };
}
