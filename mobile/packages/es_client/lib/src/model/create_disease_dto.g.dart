// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_disease_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$CreateDiseaseDto extends CreateDiseaseDto {
  @override
  final String name;
  @override
  final String shortName;
  @override
  final String code;

  factory _$CreateDiseaseDto(
          [void Function(CreateDiseaseDtoBuilder)? updates]) =>
      (CreateDiseaseDtoBuilder()..update(updates))._build();

  _$CreateDiseaseDto._(
      {required this.name, required this.shortName, required this.code})
      : super._();
  @override
  CreateDiseaseDto rebuild(void Function(CreateDiseaseDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  CreateDiseaseDtoBuilder toBuilder() =>
      CreateDiseaseDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is CreateDiseaseDto &&
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
    return (newBuiltValueToStringHelper(r'CreateDiseaseDto')
          ..add('name', name)
          ..add('shortName', shortName)
          ..add('code', code))
        .toString();
  }
}

class CreateDiseaseDtoBuilder
    implements Builder<CreateDiseaseDto, CreateDiseaseDtoBuilder> {
  _$CreateDiseaseDto? _$v;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  String? _shortName;
  String? get shortName => _$this._shortName;
  set shortName(String? shortName) => _$this._shortName = shortName;

  String? _code;
  String? get code => _$this._code;
  set code(String? code) => _$this._code = code;

  CreateDiseaseDtoBuilder() {
    CreateDiseaseDto._defaults(this);
  }

  CreateDiseaseDtoBuilder get _$this {
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
  void replace(CreateDiseaseDto other) {
    _$v = other as _$CreateDiseaseDto;
  }

  @override
  void update(void Function(CreateDiseaseDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  CreateDiseaseDto build() => _build();

  _$CreateDiseaseDto _build() {
    final _$result = _$v ??
        _$CreateDiseaseDto._(
          name: BuiltValueNullFieldError.checkNotNull(
              name, r'CreateDiseaseDto', 'name'),
          shortName: BuiltValueNullFieldError.checkNotNull(
              shortName, r'CreateDiseaseDto', 'shortName'),
          code: BuiltValueNullFieldError.checkNotNull(
              code, r'CreateDiseaseDto', 'code'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
