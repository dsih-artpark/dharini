// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_workspace_member_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$UpdateWorkspaceMemberDto extends UpdateWorkspaceMemberDto {
  @override
  final String roleId;

  factory _$UpdateWorkspaceMemberDto(
          [void Function(UpdateWorkspaceMemberDtoBuilder)? updates]) =>
      (UpdateWorkspaceMemberDtoBuilder()..update(updates))._build();

  _$UpdateWorkspaceMemberDto._({required this.roleId}) : super._();
  @override
  UpdateWorkspaceMemberDto rebuild(
          void Function(UpdateWorkspaceMemberDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UpdateWorkspaceMemberDtoBuilder toBuilder() =>
      UpdateWorkspaceMemberDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UpdateWorkspaceMemberDto && roleId == other.roleId;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, roleId.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UpdateWorkspaceMemberDto')
          ..add('roleId', roleId))
        .toString();
  }
}

class UpdateWorkspaceMemberDtoBuilder
    implements
        Builder<UpdateWorkspaceMemberDto, UpdateWorkspaceMemberDtoBuilder> {
  _$UpdateWorkspaceMemberDto? _$v;

  String? _roleId;
  String? get roleId => _$this._roleId;
  set roleId(String? roleId) => _$this._roleId = roleId;

  UpdateWorkspaceMemberDtoBuilder() {
    UpdateWorkspaceMemberDto._defaults(this);
  }

  UpdateWorkspaceMemberDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _roleId = $v.roleId;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UpdateWorkspaceMemberDto other) {
    _$v = other as _$UpdateWorkspaceMemberDto;
  }

  @override
  void update(void Function(UpdateWorkspaceMemberDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UpdateWorkspaceMemberDto build() => _build();

  _$UpdateWorkspaceMemberDto _build() {
    final _$result = _$v ??
        _$UpdateWorkspaceMemberDto._(
          roleId: BuiltValueNullFieldError.checkNotNull(
              roleId, r'UpdateWorkspaceMemberDto', 'roleId'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
