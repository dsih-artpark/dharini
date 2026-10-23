// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'site_search_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$SiteSearchResponseData extends SiteSearchResponseData {
  @override
  final String projectId;
  @override
  final String id;
  @override
  final String name;

  factory _$SiteSearchResponseData(
          [void Function(SiteSearchResponseDataBuilder)? updates]) =>
      (SiteSearchResponseDataBuilder()..update(updates))._build();

  _$SiteSearchResponseData._(
      {required this.projectId, required this.id, required this.name})
      : super._();
  @override
  SiteSearchResponseData rebuild(
          void Function(SiteSearchResponseDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  SiteSearchResponseDataBuilder toBuilder() =>
      SiteSearchResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is SiteSearchResponseData &&
        projectId == other.projectId &&
        id == other.id &&
        name == other.name;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, projectId.hashCode);
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, name.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'SiteSearchResponseData')
          ..add('projectId', projectId)
          ..add('id', id)
          ..add('name', name))
        .toString();
  }
}

class SiteSearchResponseDataBuilder
    implements Builder<SiteSearchResponseData, SiteSearchResponseDataBuilder> {
  _$SiteSearchResponseData? _$v;

  String? _projectId;
  String? get projectId => _$this._projectId;
  set projectId(String? projectId) => _$this._projectId = projectId;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  SiteSearchResponseDataBuilder() {
    SiteSearchResponseData._defaults(this);
  }

  SiteSearchResponseDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _projectId = $v.projectId;
      _id = $v.id;
      _name = $v.name;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(SiteSearchResponseData other) {
    _$v = other as _$SiteSearchResponseData;
  }

  @override
  void update(void Function(SiteSearchResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  SiteSearchResponseData build() => _build();

  _$SiteSearchResponseData _build() {
    final _$result = _$v ??
        _$SiteSearchResponseData._(
          projectId: BuiltValueNullFieldError.checkNotNull(
              projectId, r'SiteSearchResponseData', 'projectId'),
          id: BuiltValueNullFieldError.checkNotNull(
              id, r'SiteSearchResponseData', 'id'),
          name: BuiltValueNullFieldError.checkNotNull(
              name, r'SiteSearchResponseData', 'name'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
