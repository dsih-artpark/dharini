// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_workspace_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$UpdateWorkspaceDto extends UpdateWorkspaceDto {
  @override
  final String name;

  factory _$UpdateWorkspaceDto(
          [void Function(UpdateWorkspaceDtoBuilder)? updates]) =>
      (UpdateWorkspaceDtoBuilder()..update(updates))._build();

  _$UpdateWorkspaceDto._({required this.name}) : super._();
  @override
  UpdateWorkspaceDto rebuild(
          void Function(UpdateWorkspaceDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UpdateWorkspaceDtoBuilder toBuilder() =>
      UpdateWorkspaceDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UpdateWorkspaceDto && name == other.name;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, name.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UpdateWorkspaceDto')
          ..add('name', name))
        .toString();
  }
}

class UpdateWorkspaceDtoBuilder
    implements Builder<UpdateWorkspaceDto, UpdateWorkspaceDtoBuilder> {
  _$UpdateWorkspaceDto? _$v;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  UpdateWorkspaceDtoBuilder() {
    UpdateWorkspaceDto._defaults(this);
  }

  UpdateWorkspaceDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _name = $v.name;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UpdateWorkspaceDto other) {
    _$v = other as _$UpdateWorkspaceDto;
  }

  @override
  void update(void Function(UpdateWorkspaceDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UpdateWorkspaceDto build() => _build();

  _$UpdateWorkspaceDto _build() {
    final _$result = _$v ??
        _$UpdateWorkspaceDto._(
          name: BuiltValueNullFieldError.checkNotNull(
              name, r'UpdateWorkspaceDto', 'name'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
