// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'workspace.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$Workspace extends Workspace {
  @override
  final String id;
  @override
  final String name;

  factory _$Workspace([void Function(WorkspaceBuilder)? updates]) =>
      (WorkspaceBuilder()..update(updates))._build();

  _$Workspace._({required this.id, required this.name}) : super._();
  @override
  Workspace rebuild(void Function(WorkspaceBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  WorkspaceBuilder toBuilder() => WorkspaceBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is Workspace && id == other.id && name == other.name;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, name.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'Workspace')
          ..add('id', id)
          ..add('name', name))
        .toString();
  }
}

class WorkspaceBuilder implements Builder<Workspace, WorkspaceBuilder> {
  _$Workspace? _$v;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  WorkspaceBuilder() {
    Workspace._defaults(this);
  }

  WorkspaceBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _name = $v.name;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(Workspace other) {
    _$v = other as _$Workspace;
  }

  @override
  void update(void Function(WorkspaceBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  Workspace build() => _build();

  _$Workspace _build() {
    final _$result = _$v ??
        _$Workspace._(
          id: BuiltValueNullFieldError.checkNotNull(id, r'Workspace', 'id'),
          name:
              BuiltValueNullFieldError.checkNotNull(name, r'Workspace', 'name'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
