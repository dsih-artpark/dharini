// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'project_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ProjectResponseData extends ProjectResponseData {
  @override
  final String id;
  @override
  final String name;
  @override
  final String code;
  @override
  final Workspace? workspace;
  @override
  final BuiltList<User> projectAdmins;
  @override
  final BuiltList<Disease> diseases;
  @override
  final BuiltList<ProjectResponseRegion> regions;

  factory _$ProjectResponseData(
          [void Function(ProjectResponseDataBuilder)? updates]) =>
      (ProjectResponseDataBuilder()..update(updates))._build();

  _$ProjectResponseData._(
      {required this.id,
      required this.name,
      required this.code,
      this.workspace,
      required this.projectAdmins,
      required this.diseases,
      required this.regions})
      : super._();
  @override
  ProjectResponseData rebuild(
          void Function(ProjectResponseDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ProjectResponseDataBuilder toBuilder() =>
      ProjectResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ProjectResponseData &&
        id == other.id &&
        name == other.name &&
        code == other.code &&
        workspace == other.workspace &&
        projectAdmins == other.projectAdmins &&
        diseases == other.diseases &&
        regions == other.regions;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, name.hashCode);
    _$hash = $jc(_$hash, code.hashCode);
    _$hash = $jc(_$hash, workspace.hashCode);
    _$hash = $jc(_$hash, projectAdmins.hashCode);
    _$hash = $jc(_$hash, diseases.hashCode);
    _$hash = $jc(_$hash, regions.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'ProjectResponseData')
          ..add('id', id)
          ..add('name', name)
          ..add('code', code)
          ..add('workspace', workspace)
          ..add('projectAdmins', projectAdmins)
          ..add('diseases', diseases)
          ..add('regions', regions))
        .toString();
  }
}

class ProjectResponseDataBuilder
    implements Builder<ProjectResponseData, ProjectResponseDataBuilder> {
  _$ProjectResponseData? _$v;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  String? _code;
  String? get code => _$this._code;
  set code(String? code) => _$this._code = code;

  WorkspaceBuilder? _workspace;
  WorkspaceBuilder get workspace => _$this._workspace ??= WorkspaceBuilder();
  set workspace(WorkspaceBuilder? workspace) => _$this._workspace = workspace;

  ListBuilder<User>? _projectAdmins;
  ListBuilder<User> get projectAdmins =>
      _$this._projectAdmins ??= ListBuilder<User>();
  set projectAdmins(ListBuilder<User>? projectAdmins) =>
      _$this._projectAdmins = projectAdmins;

  ListBuilder<Disease>? _diseases;
  ListBuilder<Disease> get diseases =>
      _$this._diseases ??= ListBuilder<Disease>();
  set diseases(ListBuilder<Disease>? diseases) => _$this._diseases = diseases;

  ListBuilder<ProjectResponseRegion>? _regions;
  ListBuilder<ProjectResponseRegion> get regions =>
      _$this._regions ??= ListBuilder<ProjectResponseRegion>();
  set regions(ListBuilder<ProjectResponseRegion>? regions) =>
      _$this._regions = regions;

  ProjectResponseDataBuilder() {
    ProjectResponseData._defaults(this);
  }

  ProjectResponseDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _name = $v.name;
      _code = $v.code;
      _workspace = $v.workspace?.toBuilder();
      _projectAdmins = $v.projectAdmins.toBuilder();
      _diseases = $v.diseases.toBuilder();
      _regions = $v.regions.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(ProjectResponseData other) {
    _$v = other as _$ProjectResponseData;
  }

  @override
  void update(void Function(ProjectResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ProjectResponseData build() => _build();

  _$ProjectResponseData _build() {
    _$ProjectResponseData _$result;
    try {
      _$result = _$v ??
          _$ProjectResponseData._(
            id: BuiltValueNullFieldError.checkNotNull(
                id, r'ProjectResponseData', 'id'),
            name: BuiltValueNullFieldError.checkNotNull(
                name, r'ProjectResponseData', 'name'),
            code: BuiltValueNullFieldError.checkNotNull(
                code, r'ProjectResponseData', 'code'),
            workspace: _workspace?.build(),
            projectAdmins: projectAdmins.build(),
            diseases: diseases.build(),
            regions: regions.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'workspace';
        _workspace?.build();
        _$failedField = 'projectAdmins';
        projectAdmins.build();
        _$failedField = 'diseases';
        diseases.build();
        _$failedField = 'regions';
        regions.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'ProjectResponseData', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
