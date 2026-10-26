// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'search_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$SearchResponseData extends SearchResponseData {
  @override
  final BuiltList<ProjectSearchResponseData> projects;
  @override
  final BuiltList<SiteSearchResponseData> sites;
  @override
  final BuiltList<DiseaseSearchResponseData> diseases;

  factory _$SearchResponseData(
          [void Function(SearchResponseDataBuilder)? updates]) =>
      (SearchResponseDataBuilder()..update(updates))._build();

  _$SearchResponseData._(
      {required this.projects, required this.sites, required this.diseases})
      : super._();
  @override
  SearchResponseData rebuild(
          void Function(SearchResponseDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  SearchResponseDataBuilder toBuilder() =>
      SearchResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is SearchResponseData &&
        projects == other.projects &&
        sites == other.sites &&
        diseases == other.diseases;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, projects.hashCode);
    _$hash = $jc(_$hash, sites.hashCode);
    _$hash = $jc(_$hash, diseases.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'SearchResponseData')
          ..add('projects', projects)
          ..add('sites', sites)
          ..add('diseases', diseases))
        .toString();
  }
}

class SearchResponseDataBuilder
    implements Builder<SearchResponseData, SearchResponseDataBuilder> {
  _$SearchResponseData? _$v;

  ListBuilder<ProjectSearchResponseData>? _projects;
  ListBuilder<ProjectSearchResponseData> get projects =>
      _$this._projects ??= ListBuilder<ProjectSearchResponseData>();
  set projects(ListBuilder<ProjectSearchResponseData>? projects) =>
      _$this._projects = projects;

  ListBuilder<SiteSearchResponseData>? _sites;
  ListBuilder<SiteSearchResponseData> get sites =>
      _$this._sites ??= ListBuilder<SiteSearchResponseData>();
  set sites(ListBuilder<SiteSearchResponseData>? sites) =>
      _$this._sites = sites;

  ListBuilder<DiseaseSearchResponseData>? _diseases;
  ListBuilder<DiseaseSearchResponseData> get diseases =>
      _$this._diseases ??= ListBuilder<DiseaseSearchResponseData>();
  set diseases(ListBuilder<DiseaseSearchResponseData>? diseases) =>
      _$this._diseases = diseases;

  SearchResponseDataBuilder() {
    SearchResponseData._defaults(this);
  }

  SearchResponseDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _projects = $v.projects.toBuilder();
      _sites = $v.sites.toBuilder();
      _diseases = $v.diseases.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(SearchResponseData other) {
    _$v = other as _$SearchResponseData;
  }

  @override
  void update(void Function(SearchResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  SearchResponseData build() => _build();

  _$SearchResponseData _build() {
    _$SearchResponseData _$result;
    try {
      _$result = _$v ??
          _$SearchResponseData._(
            projects: projects.build(),
            sites: sites.build(),
            diseases: diseases.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'projects';
        projects.build();
        _$failedField = 'sites';
        sites.build();
        _$failedField = 'diseases';
        diseases.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'SearchResponseData', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
