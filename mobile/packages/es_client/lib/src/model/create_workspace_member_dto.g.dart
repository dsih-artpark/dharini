// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_workspace_member_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$CreateWorkspaceMemberDto extends CreateWorkspaceMemberDto {
  @override
  final String userId;
  @override
  final String roleId;

  factory _$CreateWorkspaceMemberDto(
          [void Function(CreateWorkspaceMemberDtoBuilder)? updates]) =>
      (CreateWorkspaceMemberDtoBuilder()..update(updates))._build();

  _$CreateWorkspaceMemberDto._({required this.userId, required this.roleId})
      : super._();
  @override
  CreateWorkspaceMemberDto rebuild(
          void Function(CreateWorkspaceMemberDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  CreateWorkspaceMemberDtoBuilder toBuilder() =>
      CreateWorkspaceMemberDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is CreateWorkspaceMemberDto &&
        userId == other.userId &&
        roleId == other.roleId;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, userId.hashCode);
    _$hash = $jc(_$hash, roleId.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'CreateWorkspaceMemberDto')
          ..add('userId', userId)
          ..add('roleId', roleId))
        .toString();
  }
}

class CreateWorkspaceMemberDtoBuilder
    implements
        Builder<CreateWorkspaceMemberDto, CreateWorkspaceMemberDtoBuilder> {
  _$CreateWorkspaceMemberDto? _$v;

  String? _userId;
  String? get userId => _$this._userId;
  set userId(String? userId) => _$this._userId = userId;

  String? _roleId;
  String? get roleId => _$this._roleId;
  set roleId(String? roleId) => _$this._roleId = roleId;

  CreateWorkspaceMemberDtoBuilder() {
    CreateWorkspaceMemberDto._defaults(this);
  }

  CreateWorkspaceMemberDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _userId = $v.userId;
      _roleId = $v.roleId;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(CreateWorkspaceMemberDto other) {
    _$v = other as _$CreateWorkspaceMemberDto;
  }

  @override
  void update(void Function(CreateWorkspaceMemberDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  CreateWorkspaceMemberDto build() => _build();

  _$CreateWorkspaceMemberDto _build() {
    final _$result = _$v ??
        _$CreateWorkspaceMemberDto._(
          userId: BuiltValueNullFieldError.checkNotNull(
              userId, r'CreateWorkspaceMemberDto', 'userId'),
          roleId: BuiltValueNullFieldError.checkNotNull(
              roleId, r'CreateWorkspaceMemberDto', 'roleId'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
