// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_species_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$UpdateSpeciesDto extends UpdateSpeciesDto {
  @override
  final String? name;
  @override
  final String? emojiIcon;
  @override
  final String? abbreviation;
  @override
  final BuiltList<String>? diseaseShortNames;
  @override
  final bool? active;

  factory _$UpdateSpeciesDto(
          [void Function(UpdateSpeciesDtoBuilder)? updates]) =>
      (UpdateSpeciesDtoBuilder()..update(updates))._build();

  _$UpdateSpeciesDto._(
      {this.name,
      this.emojiIcon,
      this.abbreviation,
      this.diseaseShortNames,
      this.active})
      : super._();
  @override
  UpdateSpeciesDto rebuild(void Function(UpdateSpeciesDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UpdateSpeciesDtoBuilder toBuilder() =>
      UpdateSpeciesDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UpdateSpeciesDto &&
        name == other.name &&
        emojiIcon == other.emojiIcon &&
        abbreviation == other.abbreviation &&
        diseaseShortNames == other.diseaseShortNames &&
        active == other.active;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, name.hashCode);
    _$hash = $jc(_$hash, emojiIcon.hashCode);
    _$hash = $jc(_$hash, abbreviation.hashCode);
    _$hash = $jc(_$hash, diseaseShortNames.hashCode);
    _$hash = $jc(_$hash, active.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UpdateSpeciesDto')
          ..add('name', name)
          ..add('emojiIcon', emojiIcon)
          ..add('abbreviation', abbreviation)
          ..add('diseaseShortNames', diseaseShortNames)
          ..add('active', active))
        .toString();
  }
}

class UpdateSpeciesDtoBuilder
    implements Builder<UpdateSpeciesDto, UpdateSpeciesDtoBuilder> {
  _$UpdateSpeciesDto? _$v;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  String? _emojiIcon;
  String? get emojiIcon => _$this._emojiIcon;
  set emojiIcon(String? emojiIcon) => _$this._emojiIcon = emojiIcon;

  String? _abbreviation;
  String? get abbreviation => _$this._abbreviation;
  set abbreviation(String? abbreviation) => _$this._abbreviation = abbreviation;

  ListBuilder<String>? _diseaseShortNames;
  ListBuilder<String> get diseaseShortNames =>
      _$this._diseaseShortNames ??= ListBuilder<String>();
  set diseaseShortNames(ListBuilder<String>? diseaseShortNames) =>
      _$this._diseaseShortNames = diseaseShortNames;

  bool? _active;
  bool? get active => _$this._active;
  set active(bool? active) => _$this._active = active;

  UpdateSpeciesDtoBuilder() {
    UpdateSpeciesDto._defaults(this);
  }

  UpdateSpeciesDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _name = $v.name;
      _emojiIcon = $v.emojiIcon;
      _abbreviation = $v.abbreviation;
      _diseaseShortNames = $v.diseaseShortNames?.toBuilder();
      _active = $v.active;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UpdateSpeciesDto other) {
    _$v = other as _$UpdateSpeciesDto;
  }

  @override
  void update(void Function(UpdateSpeciesDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UpdateSpeciesDto build() => _build();

  _$UpdateSpeciesDto _build() {
    _$UpdateSpeciesDto _$result;
    try {
      _$result = _$v ??
          _$UpdateSpeciesDto._(
            name: name,
            emojiIcon: emojiIcon,
            abbreviation: abbreviation,
            diseaseShortNames: _diseaseShortNames?.build(),
            active: active,
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'diseaseShortNames';
        _diseaseShortNames?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'UpdateSpeciesDto', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
