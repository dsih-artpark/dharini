// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'site_response_parent_region.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const SiteResponseParentRegionRegionTypeEnum
    _$siteResponseParentRegionRegionTypeEnum_country =
    const SiteResponseParentRegionRegionTypeEnum._('country');
const SiteResponseParentRegionRegionTypeEnum
    _$siteResponseParentRegionRegionTypeEnum_state =
    const SiteResponseParentRegionRegionTypeEnum._('state');
const SiteResponseParentRegionRegionTypeEnum
    _$siteResponseParentRegionRegionTypeEnum_district =
    const SiteResponseParentRegionRegionTypeEnum._('district');
const SiteResponseParentRegionRegionTypeEnum
    _$siteResponseParentRegionRegionTypeEnum_subdistrict =
    const SiteResponseParentRegionRegionTypeEnum._('subdistrict');
const SiteResponseParentRegionRegionTypeEnum
    _$siteResponseParentRegionRegionTypeEnum_city =
    const SiteResponseParentRegionRegionTypeEnum._('city');
const SiteResponseParentRegionRegionTypeEnum
    _$siteResponseParentRegionRegionTypeEnum_unknownDefaultOpenApi =
    const SiteResponseParentRegionRegionTypeEnum._('unknownDefaultOpenApi');

SiteResponseParentRegionRegionTypeEnum
    _$siteResponseParentRegionRegionTypeEnumValueOf(String name) {
  switch (name) {
    case 'country':
      return _$siteResponseParentRegionRegionTypeEnum_country;
    case 'state':
      return _$siteResponseParentRegionRegionTypeEnum_state;
    case 'district':
      return _$siteResponseParentRegionRegionTypeEnum_district;
    case 'subdistrict':
      return _$siteResponseParentRegionRegionTypeEnum_subdistrict;
    case 'city':
      return _$siteResponseParentRegionRegionTypeEnum_city;
    case 'unknownDefaultOpenApi':
      return _$siteResponseParentRegionRegionTypeEnum_unknownDefaultOpenApi;
    default:
      return _$siteResponseParentRegionRegionTypeEnum_unknownDefaultOpenApi;
  }
}

final BuiltSet<SiteResponseParentRegionRegionTypeEnum>
    _$siteResponseParentRegionRegionTypeEnumValues = BuiltSet<
        SiteResponseParentRegionRegionTypeEnum>(const <SiteResponseParentRegionRegionTypeEnum>[
  _$siteResponseParentRegionRegionTypeEnum_country,
  _$siteResponseParentRegionRegionTypeEnum_state,
  _$siteResponseParentRegionRegionTypeEnum_district,
  _$siteResponseParentRegionRegionTypeEnum_subdistrict,
  _$siteResponseParentRegionRegionTypeEnum_city,
  _$siteResponseParentRegionRegionTypeEnum_unknownDefaultOpenApi,
]);

Serializer<SiteResponseParentRegionRegionTypeEnum>
    _$siteResponseParentRegionRegionTypeEnumSerializer =
    _$SiteResponseParentRegionRegionTypeEnumSerializer();

class _$SiteResponseParentRegionRegionTypeEnumSerializer
    implements PrimitiveSerializer<SiteResponseParentRegionRegionTypeEnum> {
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
  final Iterable<Type> types = const <Type>[
    SiteResponseParentRegionRegionTypeEnum
  ];
  @override
  final String wireName = 'SiteResponseParentRegionRegionTypeEnum';

  @override
  Object serialize(Serializers serializers,
          SiteResponseParentRegionRegionTypeEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  SiteResponseParentRegionRegionTypeEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      SiteResponseParentRegionRegionTypeEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$SiteResponseParentRegion extends SiteResponseParentRegion {
  @override
  final String id;
  @override
  final SiteResponseParentRegionRegionTypeEnum regionType;
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

  factory _$SiteResponseParentRegion(
          [void Function(SiteResponseParentRegionBuilder)? updates]) =>
      (SiteResponseParentRegionBuilder()..update(updates))._build();

  _$SiteResponseParentRegion._(
      {required this.id,
      required this.regionType,
      this.lgdCode,
      required this.localName,
      required this.name,
      required this.createdAt,
      required this.updatedAt})
      : super._();
  @override
  SiteResponseParentRegion rebuild(
          void Function(SiteResponseParentRegionBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  SiteResponseParentRegionBuilder toBuilder() =>
      SiteResponseParentRegionBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is SiteResponseParentRegion &&
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
    return (newBuiltValueToStringHelper(r'SiteResponseParentRegion')
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

class SiteResponseParentRegionBuilder
    implements
        Builder<SiteResponseParentRegion, SiteResponseParentRegionBuilder> {
  _$SiteResponseParentRegion? _$v;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  SiteResponseParentRegionRegionTypeEnum? _regionType;
  SiteResponseParentRegionRegionTypeEnum? get regionType => _$this._regionType;
  set regionType(SiteResponseParentRegionRegionTypeEnum? regionType) =>
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

  SiteResponseParentRegionBuilder() {
    SiteResponseParentRegion._defaults(this);
  }

  SiteResponseParentRegionBuilder get _$this {
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
  void replace(SiteResponseParentRegion other) {
    _$v = other as _$SiteResponseParentRegion;
  }

  @override
  void update(void Function(SiteResponseParentRegionBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  SiteResponseParentRegion build() => _build();

  _$SiteResponseParentRegion _build() {
    final _$result = _$v ??
        _$SiteResponseParentRegion._(
          id: BuiltValueNullFieldError.checkNotNull(
              id, r'SiteResponseParentRegion', 'id'),
          regionType: BuiltValueNullFieldError.checkNotNull(
              regionType, r'SiteResponseParentRegion', 'regionType'),
          lgdCode: lgdCode,
          localName: BuiltValueNullFieldError.checkNotNull(
              localName, r'SiteResponseParentRegion', 'localName'),
          name: BuiltValueNullFieldError.checkNotNull(
              name, r'SiteResponseParentRegion', 'name'),
          createdAt: BuiltValueNullFieldError.checkNotNull(
              createdAt, r'SiteResponseParentRegion', 'createdAt'),
          updatedAt: BuiltValueNullFieldError.checkNotNull(
              updatedAt, r'SiteResponseParentRegion', 'updatedAt'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
