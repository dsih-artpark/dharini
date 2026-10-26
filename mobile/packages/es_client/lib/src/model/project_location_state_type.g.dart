// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'project_location_state_type.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ProjectLocationStateType extends ProjectLocationStateType {
  @override
  final String id;
  @override
  final String regionType;
  @override
  final num lgdcode;
  @override
  final String localname;
  @override
  final String name;
  @override
  final DateTime createdat;
  @override
  final DateTime updatedat;

  factory _$ProjectLocationStateType(
          [void Function(ProjectLocationStateTypeBuilder)? updates]) =>
      (ProjectLocationStateTypeBuilder()..update(updates))._build();

  _$ProjectLocationStateType._(
      {required this.id,
      required this.regionType,
      required this.lgdcode,
      required this.localname,
      required this.name,
      required this.createdat,
      required this.updatedat})
      : super._();
  @override
  ProjectLocationStateType rebuild(
          void Function(ProjectLocationStateTypeBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ProjectLocationStateTypeBuilder toBuilder() =>
      ProjectLocationStateTypeBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ProjectLocationStateType &&
        id == other.id &&
        regionType == other.regionType &&
        lgdcode == other.lgdcode &&
        localname == other.localname &&
        name == other.name &&
        createdat == other.createdat &&
        updatedat == other.updatedat;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, regionType.hashCode);
    _$hash = $jc(_$hash, lgdcode.hashCode);
    _$hash = $jc(_$hash, localname.hashCode);
    _$hash = $jc(_$hash, name.hashCode);
    _$hash = $jc(_$hash, createdat.hashCode);
    _$hash = $jc(_$hash, updatedat.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'ProjectLocationStateType')
          ..add('id', id)
          ..add('regionType', regionType)
          ..add('lgdcode', lgdcode)
          ..add('localname', localname)
          ..add('name', name)
          ..add('createdat', createdat)
          ..add('updatedat', updatedat))
        .toString();
  }
}

class ProjectLocationStateTypeBuilder
    implements
        Builder<ProjectLocationStateType, ProjectLocationStateTypeBuilder> {
  _$ProjectLocationStateType? _$v;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  String? _regionType;
  String? get regionType => _$this._regionType;
  set regionType(String? regionType) => _$this._regionType = regionType;

  num? _lgdcode;
  num? get lgdcode => _$this._lgdcode;
  set lgdcode(num? lgdcode) => _$this._lgdcode = lgdcode;

  String? _localname;
  String? get localname => _$this._localname;
  set localname(String? localname) => _$this._localname = localname;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  DateTime? _createdat;
  DateTime? get createdat => _$this._createdat;
  set createdat(DateTime? createdat) => _$this._createdat = createdat;

  DateTime? _updatedat;
  DateTime? get updatedat => _$this._updatedat;
  set updatedat(DateTime? updatedat) => _$this._updatedat = updatedat;

  ProjectLocationStateTypeBuilder() {
    ProjectLocationStateType._defaults(this);
  }

  ProjectLocationStateTypeBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _regionType = $v.regionType;
      _lgdcode = $v.lgdcode;
      _localname = $v.localname;
      _name = $v.name;
      _createdat = $v.createdat;
      _updatedat = $v.updatedat;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(ProjectLocationStateType other) {
    _$v = other as _$ProjectLocationStateType;
  }

  @override
  void update(void Function(ProjectLocationStateTypeBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ProjectLocationStateType build() => _build();

  _$ProjectLocationStateType _build() {
    final _$result = _$v ??
        _$ProjectLocationStateType._(
          id: BuiltValueNullFieldError.checkNotNull(
              id, r'ProjectLocationStateType', 'id'),
          regionType: BuiltValueNullFieldError.checkNotNull(
              regionType, r'ProjectLocationStateType', 'regionType'),
          lgdcode: BuiltValueNullFieldError.checkNotNull(
              lgdcode, r'ProjectLocationStateType', 'lgdcode'),
          localname: BuiltValueNullFieldError.checkNotNull(
              localname, r'ProjectLocationStateType', 'localname'),
          name: BuiltValueNullFieldError.checkNotNull(
              name, r'ProjectLocationStateType', 'name'),
          createdat: BuiltValueNullFieldError.checkNotNull(
              createdat, r'ProjectLocationStateType', 'createdat'),
          updatedat: BuiltValueNullFieldError.checkNotNull(
              updatedat, r'ProjectLocationStateType', 'updatedat'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
