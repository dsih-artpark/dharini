// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'animal_metadata_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$AnimalMetadataData extends AnimalMetadataData {
  @override
  final String id;
  @override
  final String? animalTagId;
  @override
  final String? birdId;
  @override
  final AnimalMetadataSpecies? species;
  @override
  final String? breed;
  @override
  final num? ageYears;
  @override
  final num? ageMonths;
  @override
  final String? gender;
  @override
  final String? vaccinationStage;
  @override
  final BuiltList<String>? diseaseHistory;
  @override
  final num? averageMilkProductionPerDayWithinOneYear;
  @override
  final num? averageMilkProductionPerDayBeforeOneYear;
  @override
  final bool feverObserved;
  @override
  final DateTime? firstNoticedDate;
  @override
  final BuiltList<String>? vectors;
  @override
  final bool dropInFeedIntake;
  @override
  final bool dropInWaterIntake;
  @override
  final bool dropInEggProduction;
  @override
  final DateTime createdAt;

  factory _$AnimalMetadataData(
          [void Function(AnimalMetadataDataBuilder)? updates]) =>
      (AnimalMetadataDataBuilder()..update(updates))._build();

  _$AnimalMetadataData._(
      {required this.id,
      this.animalTagId,
      this.birdId,
      this.species,
      this.breed,
      this.ageYears,
      this.ageMonths,
      this.gender,
      this.vaccinationStage,
      this.diseaseHistory,
      this.averageMilkProductionPerDayWithinOneYear,
      this.averageMilkProductionPerDayBeforeOneYear,
      required this.feverObserved,
      this.firstNoticedDate,
      this.vectors,
      required this.dropInFeedIntake,
      required this.dropInWaterIntake,
      required this.dropInEggProduction,
      required this.createdAt})
      : super._();
  @override
  AnimalMetadataData rebuild(
          void Function(AnimalMetadataDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AnimalMetadataDataBuilder toBuilder() =>
      AnimalMetadataDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AnimalMetadataData &&
        id == other.id &&
        animalTagId == other.animalTagId &&
        birdId == other.birdId &&
        species == other.species &&
        breed == other.breed &&
        ageYears == other.ageYears &&
        ageMonths == other.ageMonths &&
        gender == other.gender &&
        vaccinationStage == other.vaccinationStage &&
        diseaseHistory == other.diseaseHistory &&
        averageMilkProductionPerDayWithinOneYear ==
            other.averageMilkProductionPerDayWithinOneYear &&
        averageMilkProductionPerDayBeforeOneYear ==
            other.averageMilkProductionPerDayBeforeOneYear &&
        feverObserved == other.feverObserved &&
        firstNoticedDate == other.firstNoticedDate &&
        vectors == other.vectors &&
        dropInFeedIntake == other.dropInFeedIntake &&
        dropInWaterIntake == other.dropInWaterIntake &&
        dropInEggProduction == other.dropInEggProduction &&
        createdAt == other.createdAt;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, animalTagId.hashCode);
    _$hash = $jc(_$hash, birdId.hashCode);
    _$hash = $jc(_$hash, species.hashCode);
    _$hash = $jc(_$hash, breed.hashCode);
    _$hash = $jc(_$hash, ageYears.hashCode);
    _$hash = $jc(_$hash, ageMonths.hashCode);
    _$hash = $jc(_$hash, gender.hashCode);
    _$hash = $jc(_$hash, vaccinationStage.hashCode);
    _$hash = $jc(_$hash, diseaseHistory.hashCode);
    _$hash = $jc(_$hash, averageMilkProductionPerDayWithinOneYear.hashCode);
    _$hash = $jc(_$hash, averageMilkProductionPerDayBeforeOneYear.hashCode);
    _$hash = $jc(_$hash, feverObserved.hashCode);
    _$hash = $jc(_$hash, firstNoticedDate.hashCode);
    _$hash = $jc(_$hash, vectors.hashCode);
    _$hash = $jc(_$hash, dropInFeedIntake.hashCode);
    _$hash = $jc(_$hash, dropInWaterIntake.hashCode);
    _$hash = $jc(_$hash, dropInEggProduction.hashCode);
    _$hash = $jc(_$hash, createdAt.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'AnimalMetadataData')
          ..add('id', id)
          ..add('animalTagId', animalTagId)
          ..add('birdId', birdId)
          ..add('species', species)
          ..add('breed', breed)
          ..add('ageYears', ageYears)
          ..add('ageMonths', ageMonths)
          ..add('gender', gender)
          ..add('vaccinationStage', vaccinationStage)
          ..add('diseaseHistory', diseaseHistory)
          ..add('averageMilkProductionPerDayWithinOneYear',
              averageMilkProductionPerDayWithinOneYear)
          ..add('averageMilkProductionPerDayBeforeOneYear',
              averageMilkProductionPerDayBeforeOneYear)
          ..add('feverObserved', feverObserved)
          ..add('firstNoticedDate', firstNoticedDate)
          ..add('vectors', vectors)
          ..add('dropInFeedIntake', dropInFeedIntake)
          ..add('dropInWaterIntake', dropInWaterIntake)
          ..add('dropInEggProduction', dropInEggProduction)
          ..add('createdAt', createdAt))
        .toString();
  }
}

class AnimalMetadataDataBuilder
    implements Builder<AnimalMetadataData, AnimalMetadataDataBuilder> {
  _$AnimalMetadataData? _$v;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  String? _animalTagId;
  String? get animalTagId => _$this._animalTagId;
  set animalTagId(String? animalTagId) => _$this._animalTagId = animalTagId;

  String? _birdId;
  String? get birdId => _$this._birdId;
  set birdId(String? birdId) => _$this._birdId = birdId;

  AnimalMetadataSpeciesBuilder? _species;
  AnimalMetadataSpeciesBuilder get species =>
      _$this._species ??= AnimalMetadataSpeciesBuilder();
  set species(AnimalMetadataSpeciesBuilder? species) =>
      _$this._species = species;

  String? _breed;
  String? get breed => _$this._breed;
  set breed(String? breed) => _$this._breed = breed;

  num? _ageYears;
  num? get ageYears => _$this._ageYears;
  set ageYears(num? ageYears) => _$this._ageYears = ageYears;

  num? _ageMonths;
  num? get ageMonths => _$this._ageMonths;
  set ageMonths(num? ageMonths) => _$this._ageMonths = ageMonths;

  String? _gender;
  String? get gender => _$this._gender;
  set gender(String? gender) => _$this._gender = gender;

  String? _vaccinationStage;
  String? get vaccinationStage => _$this._vaccinationStage;
  set vaccinationStage(String? vaccinationStage) =>
      _$this._vaccinationStage = vaccinationStage;

  ListBuilder<String>? _diseaseHistory;
  ListBuilder<String> get diseaseHistory =>
      _$this._diseaseHistory ??= ListBuilder<String>();
  set diseaseHistory(ListBuilder<String>? diseaseHistory) =>
      _$this._diseaseHistory = diseaseHistory;

  num? _averageMilkProductionPerDayWithinOneYear;
  num? get averageMilkProductionPerDayWithinOneYear =>
      _$this._averageMilkProductionPerDayWithinOneYear;
  set averageMilkProductionPerDayWithinOneYear(
          num? averageMilkProductionPerDayWithinOneYear) =>
      _$this._averageMilkProductionPerDayWithinOneYear =
          averageMilkProductionPerDayWithinOneYear;

  num? _averageMilkProductionPerDayBeforeOneYear;
  num? get averageMilkProductionPerDayBeforeOneYear =>
      _$this._averageMilkProductionPerDayBeforeOneYear;
  set averageMilkProductionPerDayBeforeOneYear(
          num? averageMilkProductionPerDayBeforeOneYear) =>
      _$this._averageMilkProductionPerDayBeforeOneYear =
          averageMilkProductionPerDayBeforeOneYear;

  bool? _feverObserved;
  bool? get feverObserved => _$this._feverObserved;
  set feverObserved(bool? feverObserved) =>
      _$this._feverObserved = feverObserved;

  DateTime? _firstNoticedDate;
  DateTime? get firstNoticedDate => _$this._firstNoticedDate;
  set firstNoticedDate(DateTime? firstNoticedDate) =>
      _$this._firstNoticedDate = firstNoticedDate;

  ListBuilder<String>? _vectors;
  ListBuilder<String> get vectors => _$this._vectors ??= ListBuilder<String>();
  set vectors(ListBuilder<String>? vectors) => _$this._vectors = vectors;

  bool? _dropInFeedIntake;
  bool? get dropInFeedIntake => _$this._dropInFeedIntake;
  set dropInFeedIntake(bool? dropInFeedIntake) =>
      _$this._dropInFeedIntake = dropInFeedIntake;

  bool? _dropInWaterIntake;
  bool? get dropInWaterIntake => _$this._dropInWaterIntake;
  set dropInWaterIntake(bool? dropInWaterIntake) =>
      _$this._dropInWaterIntake = dropInWaterIntake;

  bool? _dropInEggProduction;
  bool? get dropInEggProduction => _$this._dropInEggProduction;
  set dropInEggProduction(bool? dropInEggProduction) =>
      _$this._dropInEggProduction = dropInEggProduction;

  DateTime? _createdAt;
  DateTime? get createdAt => _$this._createdAt;
  set createdAt(DateTime? createdAt) => _$this._createdAt = createdAt;

  AnimalMetadataDataBuilder() {
    AnimalMetadataData._defaults(this);
  }

  AnimalMetadataDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _animalTagId = $v.animalTagId;
      _birdId = $v.birdId;
      _species = $v.species?.toBuilder();
      _breed = $v.breed;
      _ageYears = $v.ageYears;
      _ageMonths = $v.ageMonths;
      _gender = $v.gender;
      _vaccinationStage = $v.vaccinationStage;
      _diseaseHistory = $v.diseaseHistory?.toBuilder();
      _averageMilkProductionPerDayWithinOneYear =
          $v.averageMilkProductionPerDayWithinOneYear;
      _averageMilkProductionPerDayBeforeOneYear =
          $v.averageMilkProductionPerDayBeforeOneYear;
      _feverObserved = $v.feverObserved;
      _firstNoticedDate = $v.firstNoticedDate;
      _vectors = $v.vectors?.toBuilder();
      _dropInFeedIntake = $v.dropInFeedIntake;
      _dropInWaterIntake = $v.dropInWaterIntake;
      _dropInEggProduction = $v.dropInEggProduction;
      _createdAt = $v.createdAt;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(AnimalMetadataData other) {
    _$v = other as _$AnimalMetadataData;
  }

  @override
  void update(void Function(AnimalMetadataDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  AnimalMetadataData build() => _build();

  _$AnimalMetadataData _build() {
    _$AnimalMetadataData _$result;
    try {
      _$result = _$v ??
          _$AnimalMetadataData._(
            id: BuiltValueNullFieldError.checkNotNull(
                id, r'AnimalMetadataData', 'id'),
            animalTagId: animalTagId,
            birdId: birdId,
            species: _species?.build(),
            breed: breed,
            ageYears: ageYears,
            ageMonths: ageMonths,
            gender: gender,
            vaccinationStage: vaccinationStage,
            diseaseHistory: _diseaseHistory?.build(),
            averageMilkProductionPerDayWithinOneYear:
                averageMilkProductionPerDayWithinOneYear,
            averageMilkProductionPerDayBeforeOneYear:
                averageMilkProductionPerDayBeforeOneYear,
            feverObserved: BuiltValueNullFieldError.checkNotNull(
                feverObserved, r'AnimalMetadataData', 'feverObserved'),
            firstNoticedDate: firstNoticedDate,
            vectors: _vectors?.build(),
            dropInFeedIntake: BuiltValueNullFieldError.checkNotNull(
                dropInFeedIntake, r'AnimalMetadataData', 'dropInFeedIntake'),
            dropInWaterIntake: BuiltValueNullFieldError.checkNotNull(
                dropInWaterIntake, r'AnimalMetadataData', 'dropInWaterIntake'),
            dropInEggProduction: BuiltValueNullFieldError.checkNotNull(
                dropInEggProduction,
                r'AnimalMetadataData',
                'dropInEggProduction'),
            createdAt: BuiltValueNullFieldError.checkNotNull(
                createdAt, r'AnimalMetadataData', 'createdAt'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'species';
        _species?.build();

        _$failedField = 'diseaseHistory';
        _diseaseHistory?.build();

        _$failedField = 'vectors';
        _vectors?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'AnimalMetadataData', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
