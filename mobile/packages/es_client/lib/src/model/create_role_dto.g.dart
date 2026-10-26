// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_role_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$CreateRoleDto extends CreateRoleDto {
  @override
  final String name;
  @override
  final BuiltList<String> permissions;

  factory _$CreateRoleDto([void Function(CreateRoleDtoBuilder)? updates]) =>
      (CreateRoleDtoBuilder()..update(updates))._build();

  _$CreateRoleDto._({required this.name, required this.permissions})
      : super._();
  @override
  CreateRoleDto rebuild(void Function(CreateRoleDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  CreateRoleDtoBuilder toBuilder() => CreateRoleDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is CreateRoleDto &&
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
    return (newBuiltValueToStringHelper(r'CreateRoleDto')
          ..add('name', name)
          ..add('permissions', permissions))
        .toString();
  }
}

class CreateRoleDtoBuilder
    implements Builder<CreateRoleDto, CreateRoleDtoBuilder> {
  _$CreateRoleDto? _$v;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  ListBuilder<String>? _permissions;
  ListBuilder<String> get permissions =>
      _$this._permissions ??= ListBuilder<String>();
  set permissions(ListBuilder<String>? permissions) =>
      _$this._permissions = permissions;

  CreateRoleDtoBuilder() {
    CreateRoleDto._defaults(this);
  }

  CreateRoleDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _name = $v.name;
      _permissions = $v.permissions.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(CreateRoleDto other) {
    _$v = other as _$CreateRoleDto;
  }

  @override
  void update(void Function(CreateRoleDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  CreateRoleDto build() => _build();

  _$CreateRoleDto _build() {
    _$CreateRoleDto _$result;
    try {
      _$result = _$v ??
          _$CreateRoleDto._(
            name: BuiltValueNullFieldError.checkNotNull(
                name, r'CreateRoleDto', 'name'),
            permissions: permissions.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'permissions';
        permissions.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'CreateRoleDto', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
