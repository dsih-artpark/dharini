// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_role.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const UserRoleStatusEnum _$userRoleStatusEnum_active =
    const UserRoleStatusEnum._('active');
const UserRoleStatusEnum _$userRoleStatusEnum_inactive =
    const UserRoleStatusEnum._('inactive');
const UserRoleStatusEnum _$userRoleStatusEnum_deleted =
    const UserRoleStatusEnum._('deleted');
const UserRoleStatusEnum _$userRoleStatusEnum_unknownDefaultOpenApi =
    const UserRoleStatusEnum._('unknownDefaultOpenApi');

UserRoleStatusEnum _$userRoleStatusEnumValueOf(String name) {
  switch (name) {
    case 'active':
      return _$userRoleStatusEnum_active;
    case 'inactive':
      return _$userRoleStatusEnum_inactive;
    case 'deleted':
      return _$userRoleStatusEnum_deleted;
    case 'unknownDefaultOpenApi':
      return _$userRoleStatusEnum_unknownDefaultOpenApi;
    default:
      return _$userRoleStatusEnum_unknownDefaultOpenApi;
  }
}

final BuiltSet<UserRoleStatusEnum> _$userRoleStatusEnumValues =
    BuiltSet<UserRoleStatusEnum>(const <UserRoleStatusEnum>[
  _$userRoleStatusEnum_active,
  _$userRoleStatusEnum_inactive,
  _$userRoleStatusEnum_deleted,
  _$userRoleStatusEnum_unknownDefaultOpenApi,
]);

Serializer<UserRoleStatusEnum> _$userRoleStatusEnumSerializer =
    _$UserRoleStatusEnumSerializer();

class _$UserRoleStatusEnumSerializer
    implements PrimitiveSerializer<UserRoleStatusEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'active': 'active',
    'inactive': 'inactive',
    'deleted': 'deleted',
    'unknownDefaultOpenApi': 'unknown_default_open_api',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'active': 'active',
    'inactive': 'inactive',
    'deleted': 'deleted',
    'unknown_default_open_api': 'unknownDefaultOpenApi',
  };

  @override
  final Iterable<Type> types = const <Type>[UserRoleStatusEnum];
  @override
  final String wireName = 'UserRoleStatusEnum';

  @override
  Object serialize(Serializers serializers, UserRoleStatusEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  UserRoleStatusEnum deserialize(Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      UserRoleStatusEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$UserRole extends UserRole {
  @override
  final Workspace? workspace;
  @override
  final String id;
  @override
  final String? team;
  @override
  final String? project;
  @override
  final UserRoleStatusEnum status;

  factory _$UserRole([void Function(UserRoleBuilder)? updates]) =>
      (UserRoleBuilder()..update(updates))._build();

  _$UserRole._(
      {this.workspace,
      required this.id,
      this.team,
      this.project,
      required this.status})
      : super._();
  @override
  UserRole rebuild(void Function(UserRoleBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UserRoleBuilder toBuilder() => UserRoleBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UserRole &&
        workspace == other.workspace &&
        id == other.id &&
        team == other.team &&
        project == other.project &&
        status == other.status;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, workspace.hashCode);
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, team.hashCode);
    _$hash = $jc(_$hash, project.hashCode);
    _$hash = $jc(_$hash, status.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UserRole')
          ..add('workspace', workspace)
          ..add('id', id)
          ..add('team', team)
          ..add('project', project)
          ..add('status', status))
        .toString();
  }
}

class UserRoleBuilder implements Builder<UserRole, UserRoleBuilder> {
  _$UserRole? _$v;

  WorkspaceBuilder? _workspace;
  WorkspaceBuilder get workspace => _$this._workspace ??= WorkspaceBuilder();
  set workspace(WorkspaceBuilder? workspace) => _$this._workspace = workspace;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  String? _team;
  String? get team => _$this._team;
  set team(String? team) => _$this._team = team;

  String? _project;
  String? get project => _$this._project;
  set project(String? project) => _$this._project = project;

  UserRoleStatusEnum? _status;
  UserRoleStatusEnum? get status => _$this._status;
  set status(UserRoleStatusEnum? status) => _$this._status = status;

  UserRoleBuilder() {
    UserRole._defaults(this);
  }

  UserRoleBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _workspace = $v.workspace?.toBuilder();
      _id = $v.id;
      _team = $v.team;
      _project = $v.project;
      _status = $v.status;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UserRole other) {
    _$v = other as _$UserRole;
  }

  @override
  void update(void Function(UserRoleBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UserRole build() => _build();

  _$UserRole _build() {
    _$UserRole _$result;
    try {
      _$result = _$v ??
          _$UserRole._(
            workspace: _workspace?.build(),
            id: BuiltValueNullFieldError.checkNotNull(id, r'UserRole', 'id'),
            team: team,
            project: project,
            status: BuiltValueNullFieldError.checkNotNull(
                status, r'UserRole', 'status'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'workspace';
        _workspace?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'UserRole', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
