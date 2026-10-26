// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'disease_response_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$DiseaseResponseDto extends DiseaseResponseDto {
  @override
  final String id;
  @override
  final String name;
  @override
  final String shortName;
  @override
  final num index;

  factory _$DiseaseResponseDto(
          [void Function(DiseaseResponseDtoBuilder)? updates]) =>
      (DiseaseResponseDtoBuilder()..update(updates))._build();

  _$DiseaseResponseDto._(
      {required this.id,
      required this.name,
      required this.shortName,
      required this.index})
      : super._();
  @override
  DiseaseResponseDto rebuild(
          void Function(DiseaseResponseDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  DiseaseResponseDtoBuilder toBuilder() =>
      DiseaseResponseDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is DiseaseResponseDto &&
        id == other.id &&
        name == other.name &&
        shortName == other.shortName &&
        index == other.index;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, name.hashCode);
    _$hash = $jc(_$hash, shortName.hashCode);
    _$hash = $jc(_$hash, index.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'DiseaseResponseDto')
          ..add('id', id)
          ..add('name', name)
          ..add('shortName', shortName)
          ..add('index', index))
        .toString();
  }
}

class DiseaseResponseDtoBuilder
    implements Builder<DiseaseResponseDto, DiseaseResponseDtoBuilder> {
  _$DiseaseResponseDto? _$v;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  String? _shortName;
  String? get shortName => _$this._shortName;
  set shortName(String? shortName) => _$this._shortName = shortName;

  num? _index;
  num? get index => _$this._index;
  set index(num? index) => _$this._index = index;

  DiseaseResponseDtoBuilder() {
    DiseaseResponseDto._defaults(this);
  }

  DiseaseResponseDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _name = $v.name;
      _shortName = $v.shortName;
      _index = $v.index;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(DiseaseResponseDto other) {
    _$v = other as _$DiseaseResponseDto;
  }

  @override
  void update(void Function(DiseaseResponseDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  DiseaseResponseDto build() => _build();

  _$DiseaseResponseDto _build() {
    final _$result = _$v ??
        _$DiseaseResponseDto._(
          id: BuiltValueNullFieldError.checkNotNull(
              id, r'DiseaseResponseDto', 'id'),
          name: BuiltValueNullFieldError.checkNotNull(
              name, r'DiseaseResponseDto', 'name'),
          shortName: BuiltValueNullFieldError.checkNotNull(
              shortName, r'DiseaseResponseDto', 'shortName'),
          index: BuiltValueNullFieldError.checkNotNull(
              index, r'DiseaseResponseDto', 'index'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
