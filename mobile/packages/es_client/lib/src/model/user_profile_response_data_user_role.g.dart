// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_profile_response_data_user_role.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const UserProfileResponseDataUserRoleStatusEnum
    _$userProfileResponseDataUserRoleStatusEnum_active =
    const UserProfileResponseDataUserRoleStatusEnum._('active');
const UserProfileResponseDataUserRoleStatusEnum
    _$userProfileResponseDataUserRoleStatusEnum_inactive =
    const UserProfileResponseDataUserRoleStatusEnum._('inactive');
const UserProfileResponseDataUserRoleStatusEnum
    _$userProfileResponseDataUserRoleStatusEnum_deleted =
    const UserProfileResponseDataUserRoleStatusEnum._('deleted');
const UserProfileResponseDataUserRoleStatusEnum
    _$userProfileResponseDataUserRoleStatusEnum_unknownDefaultOpenApi =
    const UserProfileResponseDataUserRoleStatusEnum._('unknownDefaultOpenApi');

UserProfileResponseDataUserRoleStatusEnum
    _$userProfileResponseDataUserRoleStatusEnumValueOf(String name) {
  switch (name) {
    case 'active':
      return _$userProfileResponseDataUserRoleStatusEnum_active;
    case 'inactive':
      return _$userProfileResponseDataUserRoleStatusEnum_inactive;
    case 'deleted':
      return _$userProfileResponseDataUserRoleStatusEnum_deleted;
    case 'unknownDefaultOpenApi':
      return _$userProfileResponseDataUserRoleStatusEnum_unknownDefaultOpenApi;
    default:
      return _$userProfileResponseDataUserRoleStatusEnum_unknownDefaultOpenApi;
  }
}

final BuiltSet<UserProfileResponseDataUserRoleStatusEnum>
    _$userProfileResponseDataUserRoleStatusEnumValues = BuiltSet<
        UserProfileResponseDataUserRoleStatusEnum>(const <UserProfileResponseDataUserRoleStatusEnum>[
  _$userProfileResponseDataUserRoleStatusEnum_active,
  _$userProfileResponseDataUserRoleStatusEnum_inactive,
  _$userProfileResponseDataUserRoleStatusEnum_deleted,
  _$userProfileResponseDataUserRoleStatusEnum_unknownDefaultOpenApi,
]);

Serializer<UserProfileResponseDataUserRoleStatusEnum>
    _$userProfileResponseDataUserRoleStatusEnumSerializer =
    _$UserProfileResponseDataUserRoleStatusEnumSerializer();

class _$UserProfileResponseDataUserRoleStatusEnumSerializer
    implements PrimitiveSerializer<UserProfileResponseDataUserRoleStatusEnum> {
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
  final Iterable<Type> types = const <Type>[
    UserProfileResponseDataUserRoleStatusEnum
  ];
  @override
  final String wireName = 'UserProfileResponseDataUserRoleStatusEnum';

  @override
  Object serialize(Serializers serializers,
          UserProfileResponseDataUserRoleStatusEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  UserProfileResponseDataUserRoleStatusEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      UserProfileResponseDataUserRoleStatusEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$UserProfileResponseDataUserRole
    extends UserProfileResponseDataUserRole {
  @override
  final UserProfileResponseDataRole? role;
  @override
  final Workspace? workspace;
  @override
  final String id;
  @override
  final String? team;
  @override
  final String? project;
  @override
  final UserProfileResponseDataUserRoleStatusEnum status;

  factory _$UserProfileResponseDataUserRole(
          [void Function(UserProfileResponseDataUserRoleBuilder)? updates]) =>
      (UserProfileResponseDataUserRoleBuilder()..update(updates))._build();

  _$UserProfileResponseDataUserRole._(
      {this.role,
      this.workspace,
      required this.id,
      this.team,
      this.project,
      required this.status})
      : super._();
  @override
  UserProfileResponseDataUserRole rebuild(
          void Function(UserProfileResponseDataUserRoleBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UserProfileResponseDataUserRoleBuilder toBuilder() =>
      UserProfileResponseDataUserRoleBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UserProfileResponseDataUserRole &&
        role == other.role &&
        workspace == other.workspace &&
        id == other.id &&
        team == other.team &&
        project == other.project &&
        status == other.status;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, role.hashCode);
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
    return (newBuiltValueToStringHelper(r'UserProfileResponseDataUserRole')
          ..add('role', role)
          ..add('workspace', workspace)
          ..add('id', id)
          ..add('team', team)
          ..add('project', project)
          ..add('status', status))
        .toString();
  }
}

class UserProfileResponseDataUserRoleBuilder
    implements
        Builder<UserProfileResponseDataUserRole,
            UserProfileResponseDataUserRoleBuilder> {
  _$UserProfileResponseDataUserRole? _$v;

  UserProfileResponseDataRoleBuilder? _role;
  UserProfileResponseDataRoleBuilder get role =>
      _$this._role ??= UserProfileResponseDataRoleBuilder();
  set role(UserProfileResponseDataRoleBuilder? role) => _$this._role = role;

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

  UserProfileResponseDataUserRoleStatusEnum? _status;
  UserProfileResponseDataUserRoleStatusEnum? get status => _$this._status;
  set status(UserProfileResponseDataUserRoleStatusEnum? status) =>
      _$this._status = status;

  UserProfileResponseDataUserRoleBuilder() {
    UserProfileResponseDataUserRole._defaults(this);
  }

  UserProfileResponseDataUserRoleBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _role = $v.role?.toBuilder();
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
  void replace(UserProfileResponseDataUserRole other) {
    _$v = other as _$UserProfileResponseDataUserRole;
  }

  @override
  void update(void Function(UserProfileResponseDataUserRoleBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UserProfileResponseDataUserRole build() => _build();

  _$UserProfileResponseDataUserRole _build() {
    _$UserProfileResponseDataUserRole _$result;
    try {
      _$result = _$v ??
          _$UserProfileResponseDataUserRole._(
            role: _role?.build(),
            workspace: _workspace?.build(),
            id: BuiltValueNullFieldError.checkNotNull(
                id, r'UserProfileResponseDataUserRole', 'id'),
            team: team,
            project: project,
            status: BuiltValueNullFieldError.checkNotNull(
                status, r'UserProfileResponseDataUserRole', 'status'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'role';
        _role?.build();
        _$failedField = 'workspace';
        _workspace?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'UserProfileResponseDataUserRole', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
