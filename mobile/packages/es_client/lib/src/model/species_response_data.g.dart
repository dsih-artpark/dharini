// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'species_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$SpeciesResponseData extends SpeciesResponseData {
  @override
  final String id;
  @override
  final String name;
  @override
  final String? emojiIcon;
  @override
  final BuiltList<String>? diseaseShortNames;
  @override
  final String? abbreviation;
  @override
  final bool active;
  @override
  final DateTime createdAt;
  @override
  final DateTime updatedAt;

  factory _$SpeciesResponseData(
          [void Function(SpeciesResponseDataBuilder)? updates]) =>
      (SpeciesResponseDataBuilder()..update(updates))._build();

  _$SpeciesResponseData._(
      {required this.id,
      required this.name,
      this.emojiIcon,
      this.diseaseShortNames,
      this.abbreviation,
      required this.active,
      required this.createdAt,
      required this.updatedAt})
      : super._();
  @override
  SpeciesResponseData rebuild(
          void Function(SpeciesResponseDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  SpeciesResponseDataBuilder toBuilder() =>
      SpeciesResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is SpeciesResponseData &&
        id == other.id &&
        name == other.name &&
        emojiIcon == other.emojiIcon &&
        diseaseShortNames == other.diseaseShortNames &&
        abbreviation == other.abbreviation &&
        active == other.active &&
        createdAt == other.createdAt &&
        updatedAt == other.updatedAt;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, name.hashCode);
    _$hash = $jc(_$hash, emojiIcon.hashCode);
    _$hash = $jc(_$hash, diseaseShortNames.hashCode);
    _$hash = $jc(_$hash, abbreviation.hashCode);
    _$hash = $jc(_$hash, active.hashCode);
    _$hash = $jc(_$hash, createdAt.hashCode);
    _$hash = $jc(_$hash, updatedAt.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'SpeciesResponseData')
          ..add('id', id)
          ..add('name', name)
          ..add('emojiIcon', emojiIcon)
          ..add('diseaseShortNames', diseaseShortNames)
          ..add('abbreviation', abbreviation)
          ..add('active', active)
          ..add('createdAt', createdAt)
          ..add('updatedAt', updatedAt))
        .toString();
  }
}

class SpeciesResponseDataBuilder
    implements Builder<SpeciesResponseData, SpeciesResponseDataBuilder> {
  _$SpeciesResponseData? _$v;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  String? _emojiIcon;
  String? get emojiIcon => _$this._emojiIcon;
  set emojiIcon(String? emojiIcon) => _$this._emojiIcon = emojiIcon;

  ListBuilder<String>? _diseaseShortNames;
  ListBuilder<String> get diseaseShortNames =>
      _$this._diseaseShortNames ??= ListBuilder<String>();
  set diseaseShortNames(ListBuilder<String>? diseaseShortNames) =>
      _$this._diseaseShortNames = diseaseShortNames;

  String? _abbreviation;
  String? get abbreviation => _$this._abbreviation;
  set abbreviation(String? abbreviation) => _$this._abbreviation = abbreviation;

  bool? _active;
  bool? get active => _$this._active;
  set active(bool? active) => _$this._active = active;

  DateTime? _createdAt;
  DateTime? get createdAt => _$this._createdAt;
  set createdAt(DateTime? createdAt) => _$this._createdAt = createdAt;

  DateTime? _updatedAt;
  DateTime? get updatedAt => _$this._updatedAt;
  set updatedAt(DateTime? updatedAt) => _$this._updatedAt = updatedAt;

  SpeciesResponseDataBuilder() {
    SpeciesResponseData._defaults(this);
  }

  SpeciesResponseDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _name = $v.name;
      _emojiIcon = $v.emojiIcon;
      _diseaseShortNames = $v.diseaseShortNames?.toBuilder();
      _abbreviation = $v.abbreviation;
      _active = $v.active;
      _createdAt = $v.createdAt;
      _updatedAt = $v.updatedAt;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(SpeciesResponseData other) {
    _$v = other as _$SpeciesResponseData;
  }

  @override
  void update(void Function(SpeciesResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  SpeciesResponseData build() => _build();

  _$SpeciesResponseData _build() {
    _$SpeciesResponseData _$result;
    try {
      _$result = _$v ??
          _$SpeciesResponseData._(
            id: BuiltValueNullFieldError.checkNotNull(
                id, r'SpeciesResponseData', 'id'),
            name: BuiltValueNullFieldError.checkNotNull(
                name, r'SpeciesResponseData', 'name'),
            emojiIcon: emojiIcon,
            diseaseShortNames: _diseaseShortNames?.build(),
            abbreviation: abbreviation,
            active: BuiltValueNullFieldError.checkNotNull(
                active, r'SpeciesResponseData', 'active'),
            createdAt: BuiltValueNullFieldError.checkNotNull(
                createdAt, r'SpeciesResponseData', 'createdAt'),
            updatedAt: BuiltValueNullFieldError.checkNotNull(
                updatedAt, r'SpeciesResponseData', 'updatedAt'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'diseaseShortNames';
        _diseaseShortNames?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'SpeciesResponseData', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
