// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_region_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const CreateRegionDtoRegionTypeEnum _$createRegionDtoRegionTypeEnum_country =
    const CreateRegionDtoRegionTypeEnum._('country');
const CreateRegionDtoRegionTypeEnum _$createRegionDtoRegionTypeEnum_state =
    const CreateRegionDtoRegionTypeEnum._('state');
const CreateRegionDtoRegionTypeEnum _$createRegionDtoRegionTypeEnum_district =
    const CreateRegionDtoRegionTypeEnum._('district');
const CreateRegionDtoRegionTypeEnum
    _$createRegionDtoRegionTypeEnum_subdistrict =
    const CreateRegionDtoRegionTypeEnum._('subdistrict');
const CreateRegionDtoRegionTypeEnum _$createRegionDtoRegionTypeEnum_city =
    const CreateRegionDtoRegionTypeEnum._('city');
const CreateRegionDtoRegionTypeEnum
    _$createRegionDtoRegionTypeEnum_unknownDefaultOpenApi =
    const CreateRegionDtoRegionTypeEnum._('unknownDefaultOpenApi');

CreateRegionDtoRegionTypeEnum _$createRegionDtoRegionTypeEnumValueOf(
    String name) {
  switch (name) {
    case 'country':
      return _$createRegionDtoRegionTypeEnum_country;
    case 'state':
      return _$createRegionDtoRegionTypeEnum_state;
    case 'district':
      return _$createRegionDtoRegionTypeEnum_district;
    case 'subdistrict':
      return _$createRegionDtoRegionTypeEnum_subdistrict;
    case 'city':
      return _$createRegionDtoRegionTypeEnum_city;
    case 'unknownDefaultOpenApi':
      return _$createRegionDtoRegionTypeEnum_unknownDefaultOpenApi;
    default:
      return _$createRegionDtoRegionTypeEnum_unknownDefaultOpenApi;
  }
}

final BuiltSet<CreateRegionDtoRegionTypeEnum>
    _$createRegionDtoRegionTypeEnumValues = BuiltSet<
        CreateRegionDtoRegionTypeEnum>(const <CreateRegionDtoRegionTypeEnum>[
  _$createRegionDtoRegionTypeEnum_country,
  _$createRegionDtoRegionTypeEnum_state,
  _$createRegionDtoRegionTypeEnum_district,
  _$createRegionDtoRegionTypeEnum_subdistrict,
  _$createRegionDtoRegionTypeEnum_city,
  _$createRegionDtoRegionTypeEnum_unknownDefaultOpenApi,
]);

Serializer<CreateRegionDtoRegionTypeEnum>
    _$createRegionDtoRegionTypeEnumSerializer =
    _$CreateRegionDtoRegionTypeEnumSerializer();

class _$CreateRegionDtoRegionTypeEnumSerializer
    implements PrimitiveSerializer<CreateRegionDtoRegionTypeEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'country': 'country',
    'state': 'state',
    'district': 'district',
    'subdistrict': 'subdistrict',
    'city': 'city',
    'unknownDefaultOpenApi': 'unknown_default_open_api',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'country': 'country',
    'state': 'state',
    'district': 'district',
    'subdistrict': 'subdistrict',
    'city': 'city',
    'unknown_default_open_api': 'unknownDefaultOpenApi',
  };

  @override
  final Iterable<Type> types = const <Type>[CreateRegionDtoRegionTypeEnum];
  @override
  final String wireName = 'CreateRegionDtoRegionTypeEnum';

  @override
  Object serialize(
          Serializers serializers, CreateRegionDtoRegionTypeEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  CreateRegionDtoRegionTypeEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      CreateRegionDtoRegionTypeEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$CreateRegionDto extends CreateRegionDto {
  @override
  final CreateRegionDtoRegionTypeEnum regionType;
  @override
  final String name;
  @override
  final String? parentId;

  factory _$CreateRegionDto([void Function(CreateRegionDtoBuilder)? updates]) =>
      (CreateRegionDtoBuilder()..update(updates))._build();

  _$CreateRegionDto._(
      {required this.regionType, required this.name, this.parentId})
      : super._();
  @override
  CreateRegionDto rebuild(void Function(CreateRegionDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  CreateRegionDtoBuilder toBuilder() => CreateRegionDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is CreateRegionDto &&
        regionType == other.regionType &&
        name == other.name &&
        parentId == other.parentId;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, regionType.hashCode);
    _$hash = $jc(_$hash, name.hashCode);
    _$hash = $jc(_$hash, parentId.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'CreateRegionDto')
          ..add('regionType', regionType)
          ..add('name', name)
          ..add('parentId', parentId))
        .toString();
  }
}

class CreateRegionDtoBuilder
    implements Builder<CreateRegionDto, CreateRegionDtoBuilder> {
  _$CreateRegionDto? _$v;

  CreateRegionDtoRegionTypeEnum? _regionType;
  CreateRegionDtoRegionTypeEnum? get regionType => _$this._regionType;
  set regionType(CreateRegionDtoRegionTypeEnum? regionType) =>
      _$this._regionType = regionType;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  String? _parentId;
  String? get parentId => _$this._parentId;
  set parentId(String? parentId) => _$this._parentId = parentId;

  CreateRegionDtoBuilder() {
    CreateRegionDto._defaults(this);
  }

  CreateRegionDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _regionType = $v.regionType;
      _name = $v.name;
      _parentId = $v.parentId;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(CreateRegionDto other) {
    _$v = other as _$CreateRegionDto;
  }

  @override
  void update(void Function(CreateRegionDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  CreateRegionDto build() => _build();

  _$CreateRegionDto _build() {
    final _$result = _$v ??
        _$CreateRegionDto._(
          regionType: BuiltValueNullFieldError.checkNotNull(
              regionType, r'CreateRegionDto', 'regionType'),
          name: BuiltValueNullFieldError.checkNotNull(
              name, r'CreateRegionDto', 'name'),
          parentId: parentId,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
