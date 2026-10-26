// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'species.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$Species extends Species {
  @override
  final String? emojiIcon;
  @override
  final BuiltList<String>? diseaseShortNames;
  @override
  final String? abbreviation;
  @override
  final String id;
  @override
  final String name;
  @override
  final bool active;
  @override
  final DateTime createdAt;
  @override
  final DateTime updatedAt;

  factory _$Species([void Function(SpeciesBuilder)? updates]) =>
      (SpeciesBuilder()..update(updates))._build();

  _$Species._(
      {this.emojiIcon,
      this.diseaseShortNames,
      this.abbreviation,
      required this.id,
      required this.name,
      required this.active,
      required this.createdAt,
      required this.updatedAt})
      : super._();
  @override
  Species rebuild(void Function(SpeciesBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  SpeciesBuilder toBuilder() => SpeciesBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is Species &&
        emojiIcon == other.emojiIcon &&
        diseaseShortNames == other.diseaseShortNames &&
        abbreviation == other.abbreviation &&
        id == other.id &&
        name == other.name &&
        active == other.active &&
        createdAt == other.createdAt &&
        updatedAt == other.updatedAt;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, emojiIcon.hashCode);
    _$hash = $jc(_$hash, diseaseShortNames.hashCode);
    _$hash = $jc(_$hash, abbreviation.hashCode);
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, name.hashCode);
    _$hash = $jc(_$hash, active.hashCode);
    _$hash = $jc(_$hash, createdAt.hashCode);
    _$hash = $jc(_$hash, updatedAt.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'Species')
          ..add('emojiIcon', emojiIcon)
          ..add('diseaseShortNames', diseaseShortNames)
          ..add('abbreviation', abbreviation)
          ..add('id', id)
          ..add('name', name)
          ..add('active', active)
          ..add('createdAt', createdAt)
          ..add('updatedAt', updatedAt))
        .toString();
  }
}

class SpeciesBuilder implements Builder<Species, SpeciesBuilder> {
  _$Species? _$v;

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

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  bool? _active;
  bool? get active => _$this._active;
  set active(bool? active) => _$this._active = active;

  DateTime? _createdAt;
  DateTime? get createdAt => _$this._createdAt;
  set createdAt(DateTime? createdAt) => _$this._createdAt = createdAt;

  DateTime? _updatedAt;
  DateTime? get updatedAt => _$this._updatedAt;
  set updatedAt(DateTime? updatedAt) => _$this._updatedAt = updatedAt;

  SpeciesBuilder() {
    Species._defaults(this);
  }

  SpeciesBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _emojiIcon = $v.emojiIcon;
      _diseaseShortNames = $v.diseaseShortNames?.toBuilder();
      _abbreviation = $v.abbreviation;
      _id = $v.id;
      _name = $v.name;
      _active = $v.active;
      _createdAt = $v.createdAt;
      _updatedAt = $v.updatedAt;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(Species other) {
    _$v = other as _$Species;
  }

  @override
  void update(void Function(SpeciesBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  Species build() => _build();

  _$Species _build() {
    _$Species _$result;
    try {
      _$result = _$v ??
          _$Species._(
            emojiIcon: emojiIcon,
            diseaseShortNames: _diseaseShortNames?.build(),
            abbreviation: abbreviation,
            id: BuiltValueNullFieldError.checkNotNull(id, r'Species', 'id'),
            name:
                BuiltValueNullFieldError.checkNotNull(name, r'Species', 'name'),
            active: BuiltValueNullFieldError.checkNotNull(
                active, r'Species', 'active'),
            createdAt: BuiltValueNullFieldError.checkNotNull(
                createdAt, r'Species', 'createdAt'),
            updatedAt: BuiltValueNullFieldError.checkNotNull(
                updatedAt, r'Species', 'updatedAt'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'diseaseShortNames';
        _diseaseShortNames?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'Species', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
