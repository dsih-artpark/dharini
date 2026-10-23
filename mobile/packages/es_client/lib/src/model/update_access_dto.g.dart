// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_access_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$UpdateAccessDto extends UpdateAccessDto {
  @override
  final BuiltList<String>? roles;
  @override
  final String? workspaceId;
  @override
  final String? userId;
  @override
  final String? roleId;

  factory _$UpdateAccessDto([void Function(UpdateAccessDtoBuilder)? updates]) =>
      (UpdateAccessDtoBuilder()..update(updates))._build();

  _$UpdateAccessDto._({this.roles, this.workspaceId, this.userId, this.roleId})
      : super._();
  @override
  UpdateAccessDto rebuild(void Function(UpdateAccessDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UpdateAccessDtoBuilder toBuilder() => UpdateAccessDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UpdateAccessDto &&
        roles == other.roles &&
        workspaceId == other.workspaceId &&
        userId == other.userId &&
        roleId == other.roleId;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, roles.hashCode);
    _$hash = $jc(_$hash, workspaceId.hashCode);
    _$hash = $jc(_$hash, userId.hashCode);
    _$hash = $jc(_$hash, roleId.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UpdateAccessDto')
          ..add('roles', roles)
          ..add('workspaceId', workspaceId)
          ..add('userId', userId)
          ..add('roleId', roleId))
        .toString();
  }
}

class UpdateAccessDtoBuilder
    implements Builder<UpdateAccessDto, UpdateAccessDtoBuilder> {
  _$UpdateAccessDto? _$v;

  ListBuilder<String>? _roles;
  ListBuilder<String> get roles => _$this._roles ??= ListBuilder<String>();
  set roles(ListBuilder<String>? roles) => _$this._roles = roles;

  String? _workspaceId;
  String? get workspaceId => _$this._workspaceId;
  set workspaceId(String? workspaceId) => _$this._workspaceId = workspaceId;

  String? _userId;
  String? get userId => _$this._userId;
  set userId(String? userId) => _$this._userId = userId;

  String? _roleId;
  String? get roleId => _$this._roleId;
  set roleId(String? roleId) => _$this._roleId = roleId;

  UpdateAccessDtoBuilder() {
    UpdateAccessDto._defaults(this);
  }

  UpdateAccessDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _roles = $v.roles?.toBuilder();
      _workspaceId = $v.workspaceId;
      _userId = $v.userId;
      _roleId = $v.roleId;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UpdateAccessDto other) {
    _$v = other as _$UpdateAccessDto;
  }

  @override
  void update(void Function(UpdateAccessDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UpdateAccessDto build() => _build();

  _$UpdateAccessDto _build() {
    _$UpdateAccessDto _$result;
    try {
      _$result = _$v ??
          _$UpdateAccessDto._(
            roles: _roles?.build(),
            workspaceId: workspaceId,
            userId: userId,
            roleId: roleId,
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'roles';
        _roles?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'UpdateAccessDto', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
