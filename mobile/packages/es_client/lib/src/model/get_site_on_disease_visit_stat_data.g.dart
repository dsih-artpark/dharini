// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'get_site_on_disease_visit_stat_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$GetSiteOnDiseaseVisitStatData extends GetSiteOnDiseaseVisitStatData {
  @override
  final num totalPresent;
  @override
  final num totalVisited;

  factory _$GetSiteOnDiseaseVisitStatData(
          [void Function(GetSiteOnDiseaseVisitStatDataBuilder)? updates]) =>
      (GetSiteOnDiseaseVisitStatDataBuilder()..update(updates))._build();

  _$GetSiteOnDiseaseVisitStatData._(
      {required this.totalPresent, required this.totalVisited})
      : super._();
  @override
  GetSiteOnDiseaseVisitStatData rebuild(
          void Function(GetSiteOnDiseaseVisitStatDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  GetSiteOnDiseaseVisitStatDataBuilder toBuilder() =>
      GetSiteOnDiseaseVisitStatDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is GetSiteOnDiseaseVisitStatData &&
        totalPresent == other.totalPresent &&
        totalVisited == other.totalVisited;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, totalPresent.hashCode);
    _$hash = $jc(_$hash, totalVisited.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'GetSiteOnDiseaseVisitStatData')
          ..add('totalPresent', totalPresent)
          ..add('totalVisited', totalVisited))
        .toString();
  }
}

class GetSiteOnDiseaseVisitStatDataBuilder
    implements
        Builder<GetSiteOnDiseaseVisitStatData,
            GetSiteOnDiseaseVisitStatDataBuilder> {
  _$GetSiteOnDiseaseVisitStatData? _$v;

  num? _totalPresent;
  num? get totalPresent => _$this._totalPresent;
  set totalPresent(num? totalPresent) => _$this._totalPresent = totalPresent;

  num? _totalVisited;
  num? get totalVisited => _$this._totalVisited;
  set totalVisited(num? totalVisited) => _$this._totalVisited = totalVisited;

  GetSiteOnDiseaseVisitStatDataBuilder() {
    GetSiteOnDiseaseVisitStatData._defaults(this);
  }

  GetSiteOnDiseaseVisitStatDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _totalPresent = $v.totalPresent;
      _totalVisited = $v.totalVisited;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(GetSiteOnDiseaseVisitStatData other) {
    _$v = other as _$GetSiteOnDiseaseVisitStatData;
  }

  @override
  void update(void Function(GetSiteOnDiseaseVisitStatDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  GetSiteOnDiseaseVisitStatData build() => _build();

  _$GetSiteOnDiseaseVisitStatData _build() {
    final _$result = _$v ??
        _$GetSiteOnDiseaseVisitStatData._(
          totalPresent: BuiltValueNullFieldError.checkNotNull(
              totalPresent, r'GetSiteOnDiseaseVisitStatData', 'totalPresent'),
          totalVisited: BuiltValueNullFieldError.checkNotNull(
              totalVisited, r'GetSiteOnDiseaseVisitStatData', 'totalVisited'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
