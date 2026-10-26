// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'region.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const RegionRegionTypeEnum _$regionRegionTypeEnum_country =
    const RegionRegionTypeEnum._('country');
const RegionRegionTypeEnum _$regionRegionTypeEnum_state =
    const RegionRegionTypeEnum._('state');
const RegionRegionTypeEnum _$regionRegionTypeEnum_district =
    const RegionRegionTypeEnum._('district');
const RegionRegionTypeEnum _$regionRegionTypeEnum_subdistrict =
    const RegionRegionTypeEnum._('subdistrict');
const RegionRegionTypeEnum _$regionRegionTypeEnum_city =
    const RegionRegionTypeEnum._('city');
const RegionRegionTypeEnum _$regionRegionTypeEnum_unknownDefaultOpenApi =
    const RegionRegionTypeEnum._('unknownDefaultOpenApi');

RegionRegionTypeEnum _$regionRegionTypeEnumValueOf(String name) {
  switch (name) {
    case 'country':
      return _$regionRegionTypeEnum_country;
    case 'state':
      return _$regionRegionTypeEnum_state;
    case 'district':
      return _$regionRegionTypeEnum_district;
    case 'subdistrict':
      return _$regionRegionTypeEnum_subdistrict;
    case 'city':
      return _$regionRegionTypeEnum_city;
    case 'unknownDefaultOpenApi':
      return _$regionRegionTypeEnum_unknownDefaultOpenApi;
    default:
      return _$regionRegionTypeEnum_unknownDefaultOpenApi;
  }
}

final BuiltSet<RegionRegionTypeEnum> _$regionRegionTypeEnumValues =
    BuiltSet<RegionRegionTypeEnum>(const <RegionRegionTypeEnum>[
  _$regionRegionTypeEnum_country,
  _$regionRegionTypeEnum_state,
  _$regionRegionTypeEnum_district,
  _$regionRegionTypeEnum_subdistrict,
  _$regionRegionTypeEnum_city,
  _$regionRegionTypeEnum_unknownDefaultOpenApi,
]);

Serializer<RegionRegionTypeEnum> _$regionRegionTypeEnumSerializer =
    _$RegionRegionTypeEnumSerializer();

class _$RegionRegionTypeEnumSerializer
    implements PrimitiveSerializer<RegionRegionTypeEnum> {
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
  final Iterable<Type> types = const <Type>[RegionRegionTypeEnum];
  @override
  final String wireName = 'RegionRegionTypeEnum';

  @override
  Object serialize(Serializers serializers, RegionRegionTypeEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  RegionRegionTypeEnum deserialize(Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      RegionRegionTypeEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$Region extends Region {
  @override
  final String id;
  @override
  final RegionRegionTypeEnum regionType;
  @override
  final String? lgdCode;
  @override
  final String localName;
  @override
  final String name;
  @override
  final DateTime createdAt;
  @override
  final DateTime updatedAt;

  factory _$Region([void Function(RegionBuilder)? updates]) =>
      (RegionBuilder()..update(updates))._build();

  _$Region._(
      {required this.id,
      required this.regionType,
      this.lgdCode,
      required this.localName,
      required this.name,
      required this.createdAt,
      required this.updatedAt})
      : super._();
  @override
  Region rebuild(void Function(RegionBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  RegionBuilder toBuilder() => RegionBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is Region &&
        id == other.id &&
        regionType == other.regionType &&
        lgdCode == other.lgdCode &&
        localName == other.localName &&
        name == other.name &&
        createdAt == other.createdAt &&
        updatedAt == other.updatedAt;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, regionType.hashCode);
    _$hash = $jc(_$hash, lgdCode.hashCode);
    _$hash = $jc(_$hash, localName.hashCode);
    _$hash = $jc(_$hash, name.hashCode);
    _$hash = $jc(_$hash, createdAt.hashCode);
    _$hash = $jc(_$hash, updatedAt.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'Region')
          ..add('id', id)
          ..add('regionType', regionType)
          ..add('lgdCode', lgdCode)
          ..add('localName', localName)
          ..add('name', name)
          ..add('createdAt', createdAt)
          ..add('updatedAt', updatedAt))
        .toString();
  }
}

class RegionBuilder implements Builder<Region, RegionBuilder> {
  _$Region? _$v;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  RegionRegionTypeEnum? _regionType;
  RegionRegionTypeEnum? get regionType => _$this._regionType;
  set regionType(RegionRegionTypeEnum? regionType) =>
      _$this._regionType = regionType;

  String? _lgdCode;
  String? get lgdCode => _$this._lgdCode;
  set lgdCode(String? lgdCode) => _$this._lgdCode = lgdCode;

  String? _localName;
  String? get localName => _$this._localName;
  set localName(String? localName) => _$this._localName = localName;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  DateTime? _createdAt;
  DateTime? get createdAt => _$this._createdAt;
  set createdAt(DateTime? createdAt) => _$this._createdAt = createdAt;

  DateTime? _updatedAt;
  DateTime? get updatedAt => _$this._updatedAt;
  set updatedAt(DateTime? updatedAt) => _$this._updatedAt = updatedAt;

  RegionBuilder() {
    Region._defaults(this);
  }

  RegionBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _regionType = $v.regionType;
      _lgdCode = $v.lgdCode;
      _localName = $v.localName;
      _name = $v.name;
      _createdAt = $v.createdAt;
      _updatedAt = $v.updatedAt;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(Region other) {
    _$v = other as _$Region;
  }

  @override
  void update(void Function(RegionBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  Region build() => _build();

  _$Region _build() {
    final _$result = _$v ??
        _$Region._(
          id: BuiltValueNullFieldError.checkNotNull(id, r'Region', 'id'),
          regionType: BuiltValueNullFieldError.checkNotNull(
              regionType, r'Region', 'regionType'),
          lgdCode: lgdCode,
          localName: BuiltValueNullFieldError.checkNotNull(
              localName, r'Region', 'localName'),
          name: BuiltValueNullFieldError.checkNotNull(name, r'Region', 'name'),
          createdAt: BuiltValueNullFieldError.checkNotNull(
              createdAt, r'Region', 'createdAt'),
          updatedAt: BuiltValueNullFieldError.checkNotNull(
              updatedAt, r'Region', 'updatedAt'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
