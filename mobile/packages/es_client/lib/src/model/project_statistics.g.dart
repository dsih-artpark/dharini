// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'project_statistics.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ProjectStatistics extends ProjectStatistics {
  @override
  final Disease? disease;
  @override
  final num totalProjectLocations;
  @override
  final num totalProjects;

  factory _$ProjectStatistics(
          [void Function(ProjectStatisticsBuilder)? updates]) =>
      (ProjectStatisticsBuilder()..update(updates))._build();

  _$ProjectStatistics._(
      {this.disease,
      required this.totalProjectLocations,
      required this.totalProjects})
      : super._();
  @override
  ProjectStatistics rebuild(void Function(ProjectStatisticsBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ProjectStatisticsBuilder toBuilder() =>
      ProjectStatisticsBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ProjectStatistics &&
        disease == other.disease &&
        totalProjectLocations == other.totalProjectLocations &&
        totalProjects == other.totalProjects;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, disease.hashCode);
    _$hash = $jc(_$hash, totalProjectLocations.hashCode);
    _$hash = $jc(_$hash, totalProjects.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'ProjectStatistics')
          ..add('disease', disease)
          ..add('totalProjectLocations', totalProjectLocations)
          ..add('totalProjects', totalProjects))
        .toString();
  }
}

class ProjectStatisticsBuilder
    implements Builder<ProjectStatistics, ProjectStatisticsBuilder> {
  _$ProjectStatistics? _$v;

  DiseaseBuilder? _disease;
  DiseaseBuilder get disease => _$this._disease ??= DiseaseBuilder();
  set disease(DiseaseBuilder? disease) => _$this._disease = disease;

  num? _totalProjectLocations;
  num? get totalProjectLocations => _$this._totalProjectLocations;
  set totalProjectLocations(num? totalProjectLocations) =>
      _$this._totalProjectLocations = totalProjectLocations;

  num? _totalProjects;
  num? get totalProjects => _$this._totalProjects;
  set totalProjects(num? totalProjects) =>
      _$this._totalProjects = totalProjects;

  ProjectStatisticsBuilder() {
    ProjectStatistics._defaults(this);
  }

  ProjectStatisticsBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _disease = $v.disease?.toBuilder();
      _totalProjectLocations = $v.totalProjectLocations;
      _totalProjects = $v.totalProjects;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(ProjectStatistics other) {
    _$v = other as _$ProjectStatistics;
  }

  @override
  void update(void Function(ProjectStatisticsBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ProjectStatistics build() => _build();

  _$ProjectStatistics _build() {
    _$ProjectStatistics _$result;
    try {
      _$result = _$v ??
          _$ProjectStatistics._(
            disease: _disease?.build(),
            totalProjectLocations: BuiltValueNullFieldError.checkNotNull(
                totalProjectLocations,
                r'ProjectStatistics',
                'totalProjectLocations'),
            totalProjects: BuiltValueNullFieldError.checkNotNull(
                totalProjects, r'ProjectStatistics', 'totalProjects'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'disease';
        _disease?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'ProjectStatistics', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
