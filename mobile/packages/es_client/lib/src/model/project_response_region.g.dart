// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'project_response_region.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const ProjectResponseRegionRegionTypeEnum
    _$projectResponseRegionRegionTypeEnum_country =
    const ProjectResponseRegionRegionTypeEnum._('country');
const ProjectResponseRegionRegionTypeEnum
    _$projectResponseRegionRegionTypeEnum_state =
    const ProjectResponseRegionRegionTypeEnum._('state');
const ProjectResponseRegionRegionTypeEnum
    _$projectResponseRegionRegionTypeEnum_district =
    const ProjectResponseRegionRegionTypeEnum._('district');
const ProjectResponseRegionRegionTypeEnum
    _$projectResponseRegionRegionTypeEnum_subdistrict =
    const ProjectResponseRegionRegionTypeEnum._('subdistrict');
const ProjectResponseRegionRegionTypeEnum
    _$projectResponseRegionRegionTypeEnum_city =
    const ProjectResponseRegionRegionTypeEnum._('city');
const ProjectResponseRegionRegionTypeEnum
    _$projectResponseRegionRegionTypeEnum_unknownDefaultOpenApi =
    const ProjectResponseRegionRegionTypeEnum._('unknownDefaultOpenApi');

ProjectResponseRegionRegionTypeEnum
    _$projectResponseRegionRegionTypeEnumValueOf(String name) {
  switch (name) {
    case 'country':
      return _$projectResponseRegionRegionTypeEnum_country;
    case 'state':
      return _$projectResponseRegionRegionTypeEnum_state;
    case 'district':
      return _$projectResponseRegionRegionTypeEnum_district;
    case 'subdistrict':
      return _$projectResponseRegionRegionTypeEnum_subdistrict;
    case 'city':
      return _$projectResponseRegionRegionTypeEnum_city;
    case 'unknownDefaultOpenApi':
      return _$projectResponseRegionRegionTypeEnum_unknownDefaultOpenApi;
    default:
      return _$projectResponseRegionRegionTypeEnum_unknownDefaultOpenApi;
  }
}

final BuiltSet<ProjectResponseRegionRegionTypeEnum>
    _$projectResponseRegionRegionTypeEnumValues = BuiltSet<
        ProjectResponseRegionRegionTypeEnum>(const <ProjectResponseRegionRegionTypeEnum>[
  _$projectResponseRegionRegionTypeEnum_country,
  _$projectResponseRegionRegionTypeEnum_state,
  _$projectResponseRegionRegionTypeEnum_district,
  _$projectResponseRegionRegionTypeEnum_subdistrict,
  _$projectResponseRegionRegionTypeEnum_city,
  _$projectResponseRegionRegionTypeEnum_unknownDefaultOpenApi,
]);

Serializer<ProjectResponseRegionRegionTypeEnum>
    _$projectResponseRegionRegionTypeEnumSerializer =
    _$ProjectResponseRegionRegionTypeEnumSerializer();

class _$ProjectResponseRegionRegionTypeEnumSerializer
    implements PrimitiveSerializer<ProjectResponseRegionRegionTypeEnum> {
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
    ProjectResponseRegionRegionTypeEnum
  ];
  @override
  final String wireName = 'ProjectResponseRegionRegionTypeEnum';

  @override
  Object serialize(
          Serializers serializers, ProjectResponseRegionRegionTypeEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  ProjectResponseRegionRegionTypeEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      ProjectResponseRegionRegionTypeEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$ProjectResponseRegion extends ProjectResponseRegion {
  @override
  final ProjectResponseParentRegion? parentRegion;
  @override
  final String id;
  @override
  final ProjectResponseRegionRegionTypeEnum regionType;
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

  factory _$ProjectResponseRegion(
          [void Function(ProjectResponseRegionBuilder)? updates]) =>
      (ProjectResponseRegionBuilder()..update(updates))._build();

  _$ProjectResponseRegion._(
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
  ProjectResponseRegion rebuild(
          void Function(ProjectResponseRegionBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ProjectResponseRegionBuilder toBuilder() =>
      ProjectResponseRegionBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ProjectResponseRegion &&
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
    return (newBuiltValueToStringHelper(r'ProjectResponseRegion')
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

class ProjectResponseRegionBuilder
    implements Builder<ProjectResponseRegion, ProjectResponseRegionBuilder> {
  _$ProjectResponseRegion? _$v;

  ProjectResponseParentRegionBuilder? _parentRegion;
  ProjectResponseParentRegionBuilder get parentRegion =>
      _$this._parentRegion ??= ProjectResponseParentRegionBuilder();
  set parentRegion(ProjectResponseParentRegionBuilder? parentRegion) =>
      _$this._parentRegion = parentRegion;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  ProjectResponseRegionRegionTypeEnum? _regionType;
  ProjectResponseRegionRegionTypeEnum? get regionType => _$this._regionType;
  set regionType(ProjectResponseRegionRegionTypeEnum? regionType) =>
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

  ProjectResponseRegionBuilder() {
    ProjectResponseRegion._defaults(this);
  }

  ProjectResponseRegionBuilder get _$this {
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
  void replace(ProjectResponseRegion other) {
    _$v = other as _$ProjectResponseRegion;
  }

  @override
  void update(void Function(ProjectResponseRegionBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ProjectResponseRegion build() => _build();

  _$ProjectResponseRegion _build() {
    _$ProjectResponseRegion _$result;
    try {
      _$result = _$v ??
          _$ProjectResponseRegion._(
            parentRegion: _parentRegion?.build(),
            id: BuiltValueNullFieldError.checkNotNull(
                id, r'ProjectResponseRegion', 'id'),
            regionType: BuiltValueNullFieldError.checkNotNull(
                regionType, r'ProjectResponseRegion', 'regionType'),
            lgdCode: lgdCode,
            localName: BuiltValueNullFieldError.checkNotNull(
                localName, r'ProjectResponseRegion', 'localName'),
            name: BuiltValueNullFieldError.checkNotNull(
                name, r'ProjectResponseRegion', 'name'),
            createdAt: BuiltValueNullFieldError.checkNotNull(
                createdAt, r'ProjectResponseRegion', 'createdAt'),
            updatedAt: BuiltValueNullFieldError.checkNotNull(
                updatedAt, r'ProjectResponseRegion', 'updatedAt'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'parentRegion';
        _parentRegion?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'ProjectResponseRegion', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
