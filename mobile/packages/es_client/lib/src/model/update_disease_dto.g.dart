// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_disease_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$UpdateDiseaseDto extends UpdateDiseaseDto {
  @override
  final String? name;
  @override
  final String? shortName;
  @override
  final String? code;

  factory _$UpdateDiseaseDto(
          [void Function(UpdateDiseaseDtoBuilder)? updates]) =>
      (UpdateDiseaseDtoBuilder()..update(updates))._build();

  _$UpdateDiseaseDto._({this.name, this.shortName, this.code}) : super._();
  @override
  UpdateDiseaseDto rebuild(void Function(UpdateDiseaseDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UpdateDiseaseDtoBuilder toBuilder() =>
      UpdateDiseaseDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UpdateDiseaseDto &&
        name == other.name &&
        shortName == other.shortName &&
        code == other.code;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, name.hashCode);
    _$hash = $jc(_$hash, shortName.hashCode);
    _$hash = $jc(_$hash, code.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UpdateDiseaseDto')
          ..add('name', name)
          ..add('shortName', shortName)
          ..add('code', code))
        .toString();
  }
}

class UpdateDiseaseDtoBuilder
    implements Builder<UpdateDiseaseDto, UpdateDiseaseDtoBuilder> {
  _$UpdateDiseaseDto? _$v;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  String? _shortName;
  String? get shortName => _$this._shortName;
  set shortName(String? shortName) => _$this._shortName = shortName;

  String? _code;
  String? get code => _$this._code;
  set code(String? code) => _$this._code = code;

  UpdateDiseaseDtoBuilder() {
    UpdateDiseaseDto._defaults(this);
  }

  UpdateDiseaseDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _name = $v.name;
      _shortName = $v.shortName;
      _code = $v.code;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UpdateDiseaseDto other) {
    _$v = other as _$UpdateDiseaseDto;
  }

  @override
  void update(void Function(UpdateDiseaseDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UpdateDiseaseDto build() => _build();

  _$UpdateDiseaseDto _build() {
    final _$result = _$v ??
        _$UpdateDiseaseDto._(
          name: name,
          shortName: shortName,
          code: code,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
