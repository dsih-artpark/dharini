// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_workspace_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$CreateWorkspaceDto extends CreateWorkspaceDto {
  @override
  final String name;

  factory _$CreateWorkspaceDto(
          [void Function(CreateWorkspaceDtoBuilder)? updates]) =>
      (CreateWorkspaceDtoBuilder()..update(updates))._build();

  _$CreateWorkspaceDto._({required this.name}) : super._();
  @override
  CreateWorkspaceDto rebuild(
          void Function(CreateWorkspaceDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  CreateWorkspaceDtoBuilder toBuilder() =>
      CreateWorkspaceDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is CreateWorkspaceDto && name == other.name;
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
    return (newBuiltValueToStringHelper(r'CreateWorkspaceDto')
          ..add('name', name))
        .toString();
  }
}

class CreateWorkspaceDtoBuilder
    implements Builder<CreateWorkspaceDto, CreateWorkspaceDtoBuilder> {
  _$CreateWorkspaceDto? _$v;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  CreateWorkspaceDtoBuilder() {
    CreateWorkspaceDto._defaults(this);
  }

  CreateWorkspaceDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _name = $v.name;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(CreateWorkspaceDto other) {
    _$v = other as _$CreateWorkspaceDto;
  }

  @override
  void update(void Function(CreateWorkspaceDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  CreateWorkspaceDto build() => _build();

  _$CreateWorkspaceDto _build() {
    final _$result = _$v ??
        _$CreateWorkspaceDto._(
          name: BuiltValueNullFieldError.checkNotNull(
              name, r'CreateWorkspaceDto', 'name'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
