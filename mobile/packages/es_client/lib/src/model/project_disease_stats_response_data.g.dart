// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'project_disease_stats_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ProjectDiseaseStatsResponseData
    extends ProjectDiseaseStatsResponseData {
  @override
  final num? visitedSites;
  @override
  final num? notVisitedSites;
  @override
  final BuiltList<DiseaseStatistics> diseaseStatistics;
  @override
  final num? totalSiteCount;
  @override
  final String id;
  @override
  final String name;

  factory _$ProjectDiseaseStatsResponseData(
          [void Function(ProjectDiseaseStatsResponseDataBuilder)? updates]) =>
      (ProjectDiseaseStatsResponseDataBuilder()..update(updates))._build();

  _$ProjectDiseaseStatsResponseData._(
      {this.visitedSites,
      this.notVisitedSites,
      required this.diseaseStatistics,
      this.totalSiteCount,
      required this.id,
      required this.name})
      : super._();
  @override
  ProjectDiseaseStatsResponseData rebuild(
          void Function(ProjectDiseaseStatsResponseDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ProjectDiseaseStatsResponseDataBuilder toBuilder() =>
      ProjectDiseaseStatsResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ProjectDiseaseStatsResponseData &&
        visitedSites == other.visitedSites &&
        notVisitedSites == other.notVisitedSites &&
        diseaseStatistics == other.diseaseStatistics &&
        totalSiteCount == other.totalSiteCount &&
        id == other.id &&
        name == other.name;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, visitedSites.hashCode);
    _$hash = $jc(_$hash, notVisitedSites.hashCode);
    _$hash = $jc(_$hash, diseaseStatistics.hashCode);
    _$hash = $jc(_$hash, totalSiteCount.hashCode);
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, name.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'ProjectDiseaseStatsResponseData')
          ..add('visitedSites', visitedSites)
          ..add('notVisitedSites', notVisitedSites)
          ..add('diseaseStatistics', diseaseStatistics)
          ..add('totalSiteCount', totalSiteCount)
          ..add('id', id)
          ..add('name', name))
        .toString();
  }
}

class ProjectDiseaseStatsResponseDataBuilder
    implements
        Builder<ProjectDiseaseStatsResponseData,
            ProjectDiseaseStatsResponseDataBuilder> {
  _$ProjectDiseaseStatsResponseData? _$v;

  num? _visitedSites;
  num? get visitedSites => _$this._visitedSites;
  set visitedSites(num? visitedSites) => _$this._visitedSites = visitedSites;

  num? _notVisitedSites;
  num? get notVisitedSites => _$this._notVisitedSites;
  set notVisitedSites(num? notVisitedSites) =>
      _$this._notVisitedSites = notVisitedSites;

  ListBuilder<DiseaseStatistics>? _diseaseStatistics;
  ListBuilder<DiseaseStatistics> get diseaseStatistics =>
      _$this._diseaseStatistics ??= ListBuilder<DiseaseStatistics>();
  set diseaseStatistics(ListBuilder<DiseaseStatistics>? diseaseStatistics) =>
      _$this._diseaseStatistics = diseaseStatistics;

  num? _totalSiteCount;
  num? get totalSiteCount => _$this._totalSiteCount;
  set totalSiteCount(num? totalSiteCount) =>
      _$this._totalSiteCount = totalSiteCount;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  ProjectDiseaseStatsResponseDataBuilder() {
    ProjectDiseaseStatsResponseData._defaults(this);
  }

  ProjectDiseaseStatsResponseDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _visitedSites = $v.visitedSites;
      _notVisitedSites = $v.notVisitedSites;
      _diseaseStatistics = $v.diseaseStatistics.toBuilder();
      _totalSiteCount = $v.totalSiteCount;
      _id = $v.id;
      _name = $v.name;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(ProjectDiseaseStatsResponseData other) {
    _$v = other as _$ProjectDiseaseStatsResponseData;
  }

  @override
  void update(void Function(ProjectDiseaseStatsResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ProjectDiseaseStatsResponseData build() => _build();

  _$ProjectDiseaseStatsResponseData _build() {
    _$ProjectDiseaseStatsResponseData _$result;
    try {
      _$result = _$v ??
          _$ProjectDiseaseStatsResponseData._(
            visitedSites: visitedSites,
            notVisitedSites: notVisitedSites,
            diseaseStatistics: diseaseStatistics.build(),
            totalSiteCount: totalSiteCount,
            id: BuiltValueNullFieldError.checkNotNull(
                id, r'ProjectDiseaseStatsResponseData', 'id'),
            name: BuiltValueNullFieldError.checkNotNull(
                name, r'ProjectDiseaseStatsResponseData', 'name'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'diseaseStatistics';
        diseaseStatistics.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'ProjectDiseaseStatsResponseData', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
