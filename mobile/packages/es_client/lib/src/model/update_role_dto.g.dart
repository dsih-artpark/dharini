// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_role_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$UpdateRoleDto extends UpdateRoleDto {
  @override
  final String? name;
  @override
  final BuiltList<String>? permissions;

  factory _$UpdateRoleDto([void Function(UpdateRoleDtoBuilder)? updates]) =>
      (UpdateRoleDtoBuilder()..update(updates))._build();

  _$UpdateRoleDto._({this.name, this.permissions}) : super._();
  @override
  UpdateRoleDto rebuild(void Function(UpdateRoleDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UpdateRoleDtoBuilder toBuilder() => UpdateRoleDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UpdateRoleDto &&
        name == other.name &&
        permissions == other.permissions;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, name.hashCode);
    _$hash = $jc(_$hash, permissions.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UpdateRoleDto')
          ..add('name', name)
          ..add('permissions', permissions))
        .toString();
  }
}

class UpdateRoleDtoBuilder
    implements Builder<UpdateRoleDto, UpdateRoleDtoBuilder> {
  _$UpdateRoleDto? _$v;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  ListBuilder<String>? _permissions;
  ListBuilder<String> get permissions =>
      _$this._permissions ??= ListBuilder<String>();
  set permissions(ListBuilder<String>? permissions) =>
      _$this._permissions = permissions;

  UpdateRoleDtoBuilder() {
    UpdateRoleDto._defaults(this);
  }

  UpdateRoleDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _name = $v.name;
      _permissions = $v.permissions?.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UpdateRoleDto other) {
    _$v = other as _$UpdateRoleDto;
  }

  @override
  void update(void Function(UpdateRoleDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UpdateRoleDto build() => _build();

  _$UpdateRoleDto _build() {
    _$UpdateRoleDto _$result;
    try {
      _$result = _$v ??
          _$UpdateRoleDto._(
            name: name,
            permissions: _permissions?.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'permissions';
        _permissions?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'UpdateRoleDto', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
