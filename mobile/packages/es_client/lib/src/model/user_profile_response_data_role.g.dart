// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_profile_response_data_role.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const UserProfileResponseDataRoleStatusEnum
    _$userProfileResponseDataRoleStatusEnum_active =
    const UserProfileResponseDataRoleStatusEnum._('active');
const UserProfileResponseDataRoleStatusEnum
    _$userProfileResponseDataRoleStatusEnum_inactive =
    const UserProfileResponseDataRoleStatusEnum._('inactive');
const UserProfileResponseDataRoleStatusEnum
    _$userProfileResponseDataRoleStatusEnum_deleted =
    const UserProfileResponseDataRoleStatusEnum._('deleted');
const UserProfileResponseDataRoleStatusEnum
    _$userProfileResponseDataRoleStatusEnum_unknownDefaultOpenApi =
    const UserProfileResponseDataRoleStatusEnum._('unknownDefaultOpenApi');

UserProfileResponseDataRoleStatusEnum
    _$userProfileResponseDataRoleStatusEnumValueOf(String name) {
  switch (name) {
    case 'active':
      return _$userProfileResponseDataRoleStatusEnum_active;
    case 'inactive':
      return _$userProfileResponseDataRoleStatusEnum_inactive;
    case 'deleted':
      return _$userProfileResponseDataRoleStatusEnum_deleted;
    case 'unknownDefaultOpenApi':
      return _$userProfileResponseDataRoleStatusEnum_unknownDefaultOpenApi;
    default:
      return _$userProfileResponseDataRoleStatusEnum_unknownDefaultOpenApi;
  }
}

final BuiltSet<UserProfileResponseDataRoleStatusEnum>
    _$userProfileResponseDataRoleStatusEnumValues = BuiltSet<
        UserProfileResponseDataRoleStatusEnum>(const <UserProfileResponseDataRoleStatusEnum>[
  _$userProfileResponseDataRoleStatusEnum_active,
  _$userProfileResponseDataRoleStatusEnum_inactive,
  _$userProfileResponseDataRoleStatusEnum_deleted,
  _$userProfileResponseDataRoleStatusEnum_unknownDefaultOpenApi,
]);

Serializer<UserProfileResponseDataRoleStatusEnum>
    _$userProfileResponseDataRoleStatusEnumSerializer =
    _$UserProfileResponseDataRoleStatusEnumSerializer();

class _$UserProfileResponseDataRoleStatusEnumSerializer
    implements PrimitiveSerializer<UserProfileResponseDataRoleStatusEnum> {
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
    UserProfileResponseDataRoleStatusEnum
  ];
  @override
  final String wireName = 'UserProfileResponseDataRoleStatusEnum';

  @override
  Object serialize(
          Serializers serializers, UserProfileResponseDataRoleStatusEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  UserProfileResponseDataRoleStatusEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      UserProfileResponseDataRoleStatusEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$UserProfileResponseDataRole extends UserProfileResponseDataRole {
  @override
  final BuiltList<Permission> permissions;
  @override
  final String id;
  @override
  final String name;
  @override
  final String scope;
  @override
  final String type;
  @override
  final UserProfileResponseDataRoleStatusEnum status;
  @override
  final DateTime createdAt;
  @override
  final DateTime updatedAt;

  factory _$UserProfileResponseDataRole(
          [void Function(UserProfileResponseDataRoleBuilder)? updates]) =>
      (UserProfileResponseDataRoleBuilder()..update(updates))._build();

  _$UserProfileResponseDataRole._(
      {required this.permissions,
      required this.id,
      required this.name,
      required this.scope,
      required this.type,
      required this.status,
      required this.createdAt,
      required this.updatedAt})
      : super._();
  @override
  UserProfileResponseDataRole rebuild(
          void Function(UserProfileResponseDataRoleBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UserProfileResponseDataRoleBuilder toBuilder() =>
      UserProfileResponseDataRoleBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UserProfileResponseDataRole &&
        permissions == other.permissions &&
        id == other.id &&
        name == other.name &&
        scope == other.scope &&
        type == other.type &&
        status == other.status &&
        createdAt == other.createdAt &&
        updatedAt == other.updatedAt;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, permissions.hashCode);
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, name.hashCode);
    _$hash = $jc(_$hash, scope.hashCode);
    _$hash = $jc(_$hash, type.hashCode);
    _$hash = $jc(_$hash, status.hashCode);
    _$hash = $jc(_$hash, createdAt.hashCode);
    _$hash = $jc(_$hash, updatedAt.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UserProfileResponseDataRole')
          ..add('permissions', permissions)
          ..add('id', id)
          ..add('name', name)
          ..add('scope', scope)
          ..add('type', type)
          ..add('status', status)
          ..add('createdAt', createdAt)
          ..add('updatedAt', updatedAt))
        .toString();
  }
}

class UserProfileResponseDataRoleBuilder
    implements
        Builder<UserProfileResponseDataRole,
            UserProfileResponseDataRoleBuilder> {
  _$UserProfileResponseDataRole? _$v;

  ListBuilder<Permission>? _permissions;
  ListBuilder<Permission> get permissions =>
      _$this._permissions ??= ListBuilder<Permission>();
  set permissions(ListBuilder<Permission>? permissions) =>
      _$this._permissions = permissions;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  String? _scope;
  String? get scope => _$this._scope;
  set scope(String? scope) => _$this._scope = scope;

  String? _type;
  String? get type => _$this._type;
  set type(String? type) => _$this._type = type;

  UserProfileResponseDataRoleStatusEnum? _status;
  UserProfileResponseDataRoleStatusEnum? get status => _$this._status;
  set status(UserProfileResponseDataRoleStatusEnum? status) =>
      _$this._status = status;

  DateTime? _createdAt;
  DateTime? get createdAt => _$this._createdAt;
  set createdAt(DateTime? createdAt) => _$this._createdAt = createdAt;

  DateTime? _updatedAt;
  DateTime? get updatedAt => _$this._updatedAt;
  set updatedAt(DateTime? updatedAt) => _$this._updatedAt = updatedAt;

  UserProfileResponseDataRoleBuilder() {
    UserProfileResponseDataRole._defaults(this);
  }

  UserProfileResponseDataRoleBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _permissions = $v.permissions.toBuilder();
      _id = $v.id;
      _name = $v.name;
      _scope = $v.scope;
      _type = $v.type;
      _status = $v.status;
      _createdAt = $v.createdAt;
      _updatedAt = $v.updatedAt;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UserProfileResponseDataRole other) {
    _$v = other as _$UserProfileResponseDataRole;
  }

  @override
  void update(void Function(UserProfileResponseDataRoleBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UserProfileResponseDataRole build() => _build();

  _$UserProfileResponseDataRole _build() {
    _$UserProfileResponseDataRole _$result;
    try {
      _$result = _$v ??
          _$UserProfileResponseDataRole._(
            permissions: permissions.build(),
            id: BuiltValueNullFieldError.checkNotNull(
                id, r'UserProfileResponseDataRole', 'id'),
            name: BuiltValueNullFieldError.checkNotNull(
                name, r'UserProfileResponseDataRole', 'name'),
            scope: BuiltValueNullFieldError.checkNotNull(
                scope, r'UserProfileResponseDataRole', 'scope'),
            type: BuiltValueNullFieldError.checkNotNull(
                type, r'UserProfileResponseDataRole', 'type'),
            status: BuiltValueNullFieldError.checkNotNull(
                status, r'UserProfileResponseDataRole', 'status'),
            createdAt: BuiltValueNullFieldError.checkNotNull(
                createdAt, r'UserProfileResponseDataRole', 'createdAt'),
            updatedAt: BuiltValueNullFieldError.checkNotNull(
                updatedAt, r'UserProfileResponseDataRole', 'updatedAt'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'permissions';
        permissions.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'UserProfileResponseDataRole', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
