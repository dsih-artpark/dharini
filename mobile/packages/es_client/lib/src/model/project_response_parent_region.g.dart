// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'project_response_parent_region.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const ProjectResponseParentRegionRegionTypeEnum
    _$projectResponseParentRegionRegionTypeEnum_country =
    const ProjectResponseParentRegionRegionTypeEnum._('country');
const ProjectResponseParentRegionRegionTypeEnum
    _$projectResponseParentRegionRegionTypeEnum_state =
    const ProjectResponseParentRegionRegionTypeEnum._('state');
const ProjectResponseParentRegionRegionTypeEnum
    _$projectResponseParentRegionRegionTypeEnum_district =
    const ProjectResponseParentRegionRegionTypeEnum._('district');
const ProjectResponseParentRegionRegionTypeEnum
    _$projectResponseParentRegionRegionTypeEnum_subdistrict =
    const ProjectResponseParentRegionRegionTypeEnum._('subdistrict');
const ProjectResponseParentRegionRegionTypeEnum
    _$projectResponseParentRegionRegionTypeEnum_city =
    const ProjectResponseParentRegionRegionTypeEnum._('city');
const ProjectResponseParentRegionRegionTypeEnum
    _$projectResponseParentRegionRegionTypeEnum_unknownDefaultOpenApi =
    const ProjectResponseParentRegionRegionTypeEnum._('unknownDefaultOpenApi');

ProjectResponseParentRegionRegionTypeEnum
    _$projectResponseParentRegionRegionTypeEnumValueOf(String name) {
  switch (name) {
    case 'country':
      return _$projectResponseParentRegionRegionTypeEnum_country;
    case 'state':
      return _$projectResponseParentRegionRegionTypeEnum_state;
    case 'district':
      return _$projectResponseParentRegionRegionTypeEnum_district;
    case 'subdistrict':
      return _$projectResponseParentRegionRegionTypeEnum_subdistrict;
    case 'city':
      return _$projectResponseParentRegionRegionTypeEnum_city;
    case 'unknownDefaultOpenApi':
      return _$projectResponseParentRegionRegionTypeEnum_unknownDefaultOpenApi;
    default:
      return _$projectResponseParentRegionRegionTypeEnum_unknownDefaultOpenApi;
  }
}

final BuiltSet<ProjectResponseParentRegionRegionTypeEnum>
    _$projectResponseParentRegionRegionTypeEnumValues = BuiltSet<
        ProjectResponseParentRegionRegionTypeEnum>(const <ProjectResponseParentRegionRegionTypeEnum>[
  _$projectResponseParentRegionRegionTypeEnum_country,
  _$projectResponseParentRegionRegionTypeEnum_state,
  _$projectResponseParentRegionRegionTypeEnum_district,
  _$projectResponseParentRegionRegionTypeEnum_subdistrict,
  _$projectResponseParentRegionRegionTypeEnum_city,
  _$projectResponseParentRegionRegionTypeEnum_unknownDefaultOpenApi,
]);

Serializer<ProjectResponseParentRegionRegionTypeEnum>
    _$projectResponseParentRegionRegionTypeEnumSerializer =
    _$ProjectResponseParentRegionRegionTypeEnumSerializer();

class _$ProjectResponseParentRegionRegionTypeEnumSerializer
    implements PrimitiveSerializer<ProjectResponseParentRegionRegionTypeEnum> {
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
    ProjectResponseParentRegionRegionTypeEnum
  ];
  @override
  final String wireName = 'ProjectResponseParentRegionRegionTypeEnum';

  @override
  Object serialize(Serializers serializers,
          ProjectResponseParentRegionRegionTypeEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  ProjectResponseParentRegionRegionTypeEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      ProjectResponseParentRegionRegionTypeEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$ProjectResponseParentRegion extends ProjectResponseParentRegion {
  @override
  final String id;
  @override
  final ProjectResponseParentRegionRegionTypeEnum regionType;
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

  factory _$ProjectResponseParentRegion(
          [void Function(ProjectResponseParentRegionBuilder)? updates]) =>
      (ProjectResponseParentRegionBuilder()..update(updates))._build();

  _$ProjectResponseParentRegion._(
      {required this.id,
      required this.regionType,
      this.lgdCode,
      required this.localName,
      required this.name,
      required this.createdAt,
      required this.updatedAt})
      : super._();
  @override
  ProjectResponseParentRegion rebuild(
          void Function(ProjectResponseParentRegionBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ProjectResponseParentRegionBuilder toBuilder() =>
      ProjectResponseParentRegionBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ProjectResponseParentRegion &&
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
    return (newBuiltValueToStringHelper(r'ProjectResponseParentRegion')
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

class ProjectResponseParentRegionBuilder
    implements
        Builder<ProjectResponseParentRegion,
            ProjectResponseParentRegionBuilder> {
  _$ProjectResponseParentRegion? _$v;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  ProjectResponseParentRegionRegionTypeEnum? _regionType;
  ProjectResponseParentRegionRegionTypeEnum? get regionType =>
      _$this._regionType;
  set regionType(ProjectResponseParentRegionRegionTypeEnum? regionType) =>
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

  ProjectResponseParentRegionBuilder() {
    ProjectResponseParentRegion._defaults(this);
  }

  ProjectResponseParentRegionBuilder get _$this {
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
  void replace(ProjectResponseParentRegion other) {
    _$v = other as _$ProjectResponseParentRegion;
  }

  @override
  void update(void Function(ProjectResponseParentRegionBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ProjectResponseParentRegion build() => _build();

  _$ProjectResponseParentRegion _build() {
    final _$result = _$v ??
        _$ProjectResponseParentRegion._(
          id: BuiltValueNullFieldError.checkNotNull(
              id, r'ProjectResponseParentRegion', 'id'),
          regionType: BuiltValueNullFieldError.checkNotNull(
              regionType, r'ProjectResponseParentRegion', 'regionType'),
          lgdCode: lgdCode,
          localName: BuiltValueNullFieldError.checkNotNull(
              localName, r'ProjectResponseParentRegion', 'localName'),
          name: BuiltValueNullFieldError.checkNotNull(
              name, r'ProjectResponseParentRegion', 'name'),
          createdAt: BuiltValueNullFieldError.checkNotNull(
              createdAt, r'ProjectResponseParentRegion', 'createdAt'),
          updatedAt: BuiltValueNullFieldError.checkNotNull(
              updatedAt, r'ProjectResponseParentRegion', 'updatedAt'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
