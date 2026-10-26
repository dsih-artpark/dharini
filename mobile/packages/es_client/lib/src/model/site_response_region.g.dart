// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'site_response_region.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const SiteResponseRegionRegionTypeEnum
    _$siteResponseRegionRegionTypeEnum_country =
    const SiteResponseRegionRegionTypeEnum._('country');
const SiteResponseRegionRegionTypeEnum
    _$siteResponseRegionRegionTypeEnum_state =
    const SiteResponseRegionRegionTypeEnum._('state');
const SiteResponseRegionRegionTypeEnum
    _$siteResponseRegionRegionTypeEnum_district =
    const SiteResponseRegionRegionTypeEnum._('district');
const SiteResponseRegionRegionTypeEnum
    _$siteResponseRegionRegionTypeEnum_subdistrict =
    const SiteResponseRegionRegionTypeEnum._('subdistrict');
const SiteResponseRegionRegionTypeEnum _$siteResponseRegionRegionTypeEnum_city =
    const SiteResponseRegionRegionTypeEnum._('city');
const SiteResponseRegionRegionTypeEnum
    _$siteResponseRegionRegionTypeEnum_unknownDefaultOpenApi =
    const SiteResponseRegionRegionTypeEnum._('unknownDefaultOpenApi');

SiteResponseRegionRegionTypeEnum _$siteResponseRegionRegionTypeEnumValueOf(
    String name) {
  switch (name) {
    case 'country':
      return _$siteResponseRegionRegionTypeEnum_country;
    case 'state':
      return _$siteResponseRegionRegionTypeEnum_state;
    case 'district':
      return _$siteResponseRegionRegionTypeEnum_district;
    case 'subdistrict':
      return _$siteResponseRegionRegionTypeEnum_subdistrict;
    case 'city':
      return _$siteResponseRegionRegionTypeEnum_city;
    case 'unknownDefaultOpenApi':
      return _$siteResponseRegionRegionTypeEnum_unknownDefaultOpenApi;
    default:
      return _$siteResponseRegionRegionTypeEnum_unknownDefaultOpenApi;
  }
}

final BuiltSet<SiteResponseRegionRegionTypeEnum>
    _$siteResponseRegionRegionTypeEnumValues = BuiltSet<
        SiteResponseRegionRegionTypeEnum>(const <SiteResponseRegionRegionTypeEnum>[
  _$siteResponseRegionRegionTypeEnum_country,
  _$siteResponseRegionRegionTypeEnum_state,
  _$siteResponseRegionRegionTypeEnum_district,
  _$siteResponseRegionRegionTypeEnum_subdistrict,
  _$siteResponseRegionRegionTypeEnum_city,
  _$siteResponseRegionRegionTypeEnum_unknownDefaultOpenApi,
]);

Serializer<SiteResponseRegionRegionTypeEnum>
    _$siteResponseRegionRegionTypeEnumSerializer =
    _$SiteResponseRegionRegionTypeEnumSerializer();

class _$SiteResponseRegionRegionTypeEnumSerializer
    implements PrimitiveSerializer<SiteResponseRegionRegionTypeEnum> {
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
  final Iterable<Type> types = const <Type>[SiteResponseRegionRegionTypeEnum];
  @override
  final String wireName = 'SiteResponseRegionRegionTypeEnum';

  @override
  Object serialize(
          Serializers serializers, SiteResponseRegionRegionTypeEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  SiteResponseRegionRegionTypeEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      SiteResponseRegionRegionTypeEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$SiteResponseRegion extends SiteResponseRegion {
  @override
  final SiteResponseParentRegion? parentRegion;
  @override
  final String id;
  @override
  final SiteResponseRegionRegionTypeEnum regionType;
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

  factory _$SiteResponseRegion(
          [void Function(SiteResponseRegionBuilder)? updates]) =>
      (SiteResponseRegionBuilder()..update(updates))._build();

  _$SiteResponseRegion._(
      {this.parentRegion,
      required this.id,
      required this.regionType,
      this.lgdCode,
      required this.localName,
      required this.name,
      required this.createdAt,
      required this.updatedAt})
      : super._();
  @override
  SiteResponseRegion rebuild(
          void Function(SiteResponseRegionBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  SiteResponseRegionBuilder toBuilder() =>
      SiteResponseRegionBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is SiteResponseRegion &&
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
    return (newBuiltValueToStringHelper(r'SiteResponseRegion')
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

class SiteResponseRegionBuilder
    implements Builder<SiteResponseRegion, SiteResponseRegionBuilder> {
  _$SiteResponseRegion? _$v;

  SiteResponseParentRegionBuilder? _parentRegion;
  SiteResponseParentRegionBuilder get parentRegion =>
      _$this._parentRegion ??= SiteResponseParentRegionBuilder();
  set parentRegion(SiteResponseParentRegionBuilder? parentRegion) =>
      _$this._parentRegion = parentRegion;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  SiteResponseRegionRegionTypeEnum? _regionType;
  SiteResponseRegionRegionTypeEnum? get regionType => _$this._regionType;
  set regionType(SiteResponseRegionRegionTypeEnum? regionType) =>
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

  SiteResponseRegionBuilder() {
    SiteResponseRegion._defaults(this);
  }

  SiteResponseRegionBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
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
  void replace(SiteResponseRegion other) {
    _$v = other as _$SiteResponseRegion;
  }

  @override
  void update(void Function(SiteResponseRegionBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  SiteResponseRegion build() => _build();

  _$SiteResponseRegion _build() {
    _$SiteResponseRegion _$result;
    try {
      _$result = _$v ??
          _$SiteResponseRegion._(
            parentRegion: _parentRegion?.build(),
            id: BuiltValueNullFieldError.checkNotNull(
                id, r'SiteResponseRegion', 'id'),
            regionType: BuiltValueNullFieldError.checkNotNull(
                regionType, r'SiteResponseRegion', 'regionType'),
            lgdCode: lgdCode,
            localName: BuiltValueNullFieldError.checkNotNull(
                localName, r'SiteResponseRegion', 'localName'),
            name: BuiltValueNullFieldError.checkNotNull(
                name, r'SiteResponseRegion', 'name'),
            createdAt: BuiltValueNullFieldError.checkNotNull(
                createdAt, r'SiteResponseRegion', 'createdAt'),
            updatedAt: BuiltValueNullFieldError.checkNotNull(
                updatedAt, r'SiteResponseRegion', 'updatedAt'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'parentRegion';
        _parentRegion?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'SiteResponseRegion', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
