// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'region_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const RegionResponseDataRegionTypeEnum
    _$regionResponseDataRegionTypeEnum_country =
    const RegionResponseDataRegionTypeEnum._('country');
const RegionResponseDataRegionTypeEnum
    _$regionResponseDataRegionTypeEnum_state =
    const RegionResponseDataRegionTypeEnum._('state');
const RegionResponseDataRegionTypeEnum
    _$regionResponseDataRegionTypeEnum_district =
    const RegionResponseDataRegionTypeEnum._('district');
const RegionResponseDataRegionTypeEnum
    _$regionResponseDataRegionTypeEnum_subdistrict =
    const RegionResponseDataRegionTypeEnum._('subdistrict');
const RegionResponseDataRegionTypeEnum _$regionResponseDataRegionTypeEnum_city =
    const RegionResponseDataRegionTypeEnum._('city');
const RegionResponseDataRegionTypeEnum
    _$regionResponseDataRegionTypeEnum_unknownDefaultOpenApi =
    const RegionResponseDataRegionTypeEnum._('unknownDefaultOpenApi');

RegionResponseDataRegionTypeEnum _$regionResponseDataRegionTypeEnumValueOf(
    String name) {
  switch (name) {
    case 'country':
      return _$regionResponseDataRegionTypeEnum_country;
    case 'state':
      return _$regionResponseDataRegionTypeEnum_state;
    case 'district':
      return _$regionResponseDataRegionTypeEnum_district;
    case 'subdistrict':
      return _$regionResponseDataRegionTypeEnum_subdistrict;
    case 'city':
      return _$regionResponseDataRegionTypeEnum_city;
    case 'unknownDefaultOpenApi':
      return _$regionResponseDataRegionTypeEnum_unknownDefaultOpenApi;
    default:
      return _$regionResponseDataRegionTypeEnum_unknownDefaultOpenApi;
  }
}

final BuiltSet<RegionResponseDataRegionTypeEnum>
    _$regionResponseDataRegionTypeEnumValues = BuiltSet<
        RegionResponseDataRegionTypeEnum>(const <RegionResponseDataRegionTypeEnum>[
  _$regionResponseDataRegionTypeEnum_country,
  _$regionResponseDataRegionTypeEnum_state,
  _$regionResponseDataRegionTypeEnum_district,
  _$regionResponseDataRegionTypeEnum_subdistrict,
  _$regionResponseDataRegionTypeEnum_city,
  _$regionResponseDataRegionTypeEnum_unknownDefaultOpenApi,
]);

Serializer<RegionResponseDataRegionTypeEnum>
    _$regionResponseDataRegionTypeEnumSerializer =
    _$RegionResponseDataRegionTypeEnumSerializer();

class _$RegionResponseDataRegionTypeEnumSerializer
    implements PrimitiveSerializer<RegionResponseDataRegionTypeEnum> {
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
  final Iterable<Type> types = const <Type>[RegionResponseDataRegionTypeEnum];
  @override
  final String wireName = 'RegionResponseDataRegionTypeEnum';

  @override
  Object serialize(
          Serializers serializers, RegionResponseDataRegionTypeEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  RegionResponseDataRegionTypeEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      RegionResponseDataRegionTypeEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$RegionResponseData extends RegionResponseData {
  @override
  final BuiltList<Region>? subRegions;
  @override
  final Region? parentRegion;
  @override
  final String id;
  @override
  final RegionResponseDataRegionTypeEnum regionType;
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

  factory _$RegionResponseData(
          [void Function(RegionResponseDataBuilder)? updates]) =>
      (RegionResponseDataBuilder()..update(updates))._build();

  _$RegionResponseData._(
      {this.subRegions,
      this.parentRegion,
      required this.id,
      required this.regionType,
      this.lgdCode,
      required this.localName,
      required this.name,
      required this.createdAt,
      required this.updatedAt})
      : super._();
  @override
  RegionResponseData rebuild(
          void Function(RegionResponseDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  RegionResponseDataBuilder toBuilder() =>
      RegionResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is RegionResponseData &&
        subRegions == other.subRegions &&
        parentRegion == other.parentRegion &&
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
    _$hash = $jc(_$hash, subRegions.hashCode);
    _$hash = $jc(_$hash, parentRegion.hashCode);
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
    return (newBuiltValueToStringHelper(r'RegionResponseData')
          ..add('subRegions', subRegions)
          ..add('parentRegion', parentRegion)
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

class RegionResponseDataBuilder
    implements Builder<RegionResponseData, RegionResponseDataBuilder> {
  _$RegionResponseData? _$v;

  ListBuilder<Region>? _subRegions;
  ListBuilder<Region> get subRegions =>
      _$this._subRegions ??= ListBuilder<Region>();
  set subRegions(ListBuilder<Region>? subRegions) =>
      _$this._subRegions = subRegions;

  RegionBuilder? _parentRegion;
  RegionBuilder get parentRegion => _$this._parentRegion ??= RegionBuilder();
  set parentRegion(RegionBuilder? parentRegion) =>
      _$this._parentRegion = parentRegion;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  RegionResponseDataRegionTypeEnum? _regionType;
  RegionResponseDataRegionTypeEnum? get regionType => _$this._regionType;
  set regionType(RegionResponseDataRegionTypeEnum? regionType) =>
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

  RegionResponseDataBuilder() {
    RegionResponseData._defaults(this);
  }

  RegionResponseDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _subRegions = $v.subRegions?.toBuilder();
      _parentRegion = $v.parentRegion?.toBuilder();
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
  void replace(RegionResponseData other) {
    _$v = other as _$RegionResponseData;
  }

  @override
  void update(void Function(RegionResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  RegionResponseData build() => _build();

  _$RegionResponseData _build() {
    _$RegionResponseData _$result;
    try {
      _$result = _$v ??
          _$RegionResponseData._(
            subRegions: _subRegions?.build(),
            parentRegion: _parentRegion?.build(),
            id: BuiltValueNullFieldError.checkNotNull(
                id, r'RegionResponseData', 'id'),
            regionType: BuiltValueNullFieldError.checkNotNull(
                regionType, r'RegionResponseData', 'regionType'),
            lgdCode: lgdCode,
            localName: BuiltValueNullFieldError.checkNotNull(
                localName, r'RegionResponseData', 'localName'),
            name: BuiltValueNullFieldError.checkNotNull(
                name, r'RegionResponseData', 'name'),
            createdAt: BuiltValueNullFieldError.checkNotNull(
                createdAt, r'RegionResponseData', 'createdAt'),
            updatedAt: BuiltValueNullFieldError.checkNotNull(
                updatedAt, r'RegionResponseData', 'updatedAt'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'subRegions';
        _subRegions?.build();
        _$failedField = 'parentRegion';
        _parentRegion?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'RegionResponseData', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
