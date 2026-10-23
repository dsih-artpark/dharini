// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'project_statistic_by_diseases_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ProjectStatisticByDiseasesResponseData
    extends ProjectStatisticByDiseasesResponseData {
  @override
  final String diseasesName;
  @override
  final String diseaseSName;
  @override
  final num siteCount;

  factory _$ProjectStatisticByDiseasesResponseData(
          [void Function(ProjectStatisticByDiseasesResponseDataBuilder)?
              updates]) =>
      (ProjectStatisticByDiseasesResponseDataBuilder()..update(updates))
          ._build();

  _$ProjectStatisticByDiseasesResponseData._(
      {required this.diseasesName,
      required this.diseaseSName,
      required this.siteCount})
      : super._();
  @override
  ProjectStatisticByDiseasesResponseData rebuild(
          void Function(ProjectStatisticByDiseasesResponseDataBuilder)
              updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ProjectStatisticByDiseasesResponseDataBuilder toBuilder() =>
      ProjectStatisticByDiseasesResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ProjectStatisticByDiseasesResponseData &&
        diseasesName == other.diseasesName &&
        diseaseSName == other.diseaseSName &&
        siteCount == other.siteCount;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, diseasesName.hashCode);
    _$hash = $jc(_$hash, diseaseSName.hashCode);
    _$hash = $jc(_$hash, siteCount.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(
            r'ProjectStatisticByDiseasesResponseData')
          ..add('diseasesName', diseasesName)
          ..add('diseaseSName', diseaseSName)
          ..add('siteCount', siteCount))
        .toString();
  }
}

class ProjectStatisticByDiseasesResponseDataBuilder
    implements
        Builder<ProjectStatisticByDiseasesResponseData,
            ProjectStatisticByDiseasesResponseDataBuilder> {
  _$ProjectStatisticByDiseasesResponseData? _$v;

  String? _diseasesName;
  String? get diseasesName => _$this._diseasesName;
  set diseasesName(String? diseasesName) => _$this._diseasesName = diseasesName;

  String? _diseaseSName;
  String? get diseaseSName => _$this._diseaseSName;
  set diseaseSName(String? diseaseSName) => _$this._diseaseSName = diseaseSName;

  num? _siteCount;
  num? get siteCount => _$this._siteCount;
  set siteCount(num? siteCount) => _$this._siteCount = siteCount;

  ProjectStatisticByDiseasesResponseDataBuilder() {
    ProjectStatisticByDiseasesResponseData._defaults(this);
  }

  ProjectStatisticByDiseasesResponseDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _diseasesName = $v.diseasesName;
      _diseaseSName = $v.diseaseSName;
      _siteCount = $v.siteCount;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(ProjectStatisticByDiseasesResponseData other) {
    _$v = other as _$ProjectStatisticByDiseasesResponseData;
  }

  @override
  void update(
      void Function(ProjectStatisticByDiseasesResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ProjectStatisticByDiseasesResponseData build() => _build();

  _$ProjectStatisticByDiseasesResponseData _build() {
    final _$result = _$v ??
        _$ProjectStatisticByDiseasesResponseData._(
          diseasesName: BuiltValueNullFieldError.checkNotNull(diseasesName,
              r'ProjectStatisticByDiseasesResponseData', 'diseasesName'),
          diseaseSName: BuiltValueNullFieldError.checkNotNull(diseaseSName,
              r'ProjectStatisticByDiseasesResponseData', 'diseaseSName'),
          siteCount: BuiltValueNullFieldError.checkNotNull(siteCount,
              r'ProjectStatisticByDiseasesResponseData', 'siteCount'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
