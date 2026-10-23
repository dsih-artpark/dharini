// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'project_search_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ProjectSearchResponseData extends ProjectSearchResponseData {
  @override
  final String id;
  @override
  final String name;

  factory _$ProjectSearchResponseData(
          [void Function(ProjectSearchResponseDataBuilder)? updates]) =>
      (ProjectSearchResponseDataBuilder()..update(updates))._build();

  _$ProjectSearchResponseData._({required this.id, required this.name})
      : super._();
  @override
  ProjectSearchResponseData rebuild(
          void Function(ProjectSearchResponseDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ProjectSearchResponseDataBuilder toBuilder() =>
      ProjectSearchResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ProjectSearchResponseData &&
        id == other.id &&
        name == other.name;
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
    return (newBuiltValueToStringHelper(r'ProjectSearchResponseData')
          ..add('id', id)
          ..add('name', name))
        .toString();
  }
}

class ProjectSearchResponseDataBuilder
    implements
        Builder<ProjectSearchResponseData, ProjectSearchResponseDataBuilder> {
  _$ProjectSearchResponseData? _$v;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  ProjectSearchResponseDataBuilder() {
    ProjectSearchResponseData._defaults(this);
  }

  ProjectSearchResponseDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _name = $v.name;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(ProjectSearchResponseData other) {
    _$v = other as _$ProjectSearchResponseData;
  }

  @override
  void update(void Function(ProjectSearchResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ProjectSearchResponseData build() => _build();

  _$ProjectSearchResponseData _build() {
    final _$result = _$v ??
        _$ProjectSearchResponseData._(
          id: BuiltValueNullFieldError.checkNotNull(
              id, r'ProjectSearchResponseData', 'id'),
          name: BuiltValueNullFieldError.checkNotNull(
              name, r'ProjectSearchResponseData', 'name'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
