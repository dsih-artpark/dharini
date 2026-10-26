// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'get_site_on_sample_visit_stat_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$GetSiteOnSampleVisitStatData extends GetSiteOnSampleVisitStatData {
  @override
  final num totalPresent;
  @override
  final num totalTested;

  factory _$GetSiteOnSampleVisitStatData(
          [void Function(GetSiteOnSampleVisitStatDataBuilder)? updates]) =>
      (GetSiteOnSampleVisitStatDataBuilder()..update(updates))._build();

  _$GetSiteOnSampleVisitStatData._(
      {required this.totalPresent, required this.totalTested})
      : super._();
  @override
  GetSiteOnSampleVisitStatData rebuild(
          void Function(GetSiteOnSampleVisitStatDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  GetSiteOnSampleVisitStatDataBuilder toBuilder() =>
      GetSiteOnSampleVisitStatDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is GetSiteOnSampleVisitStatData &&
        totalPresent == other.totalPresent &&
        totalTested == other.totalTested;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, totalPresent.hashCode);
    _$hash = $jc(_$hash, totalTested.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'GetSiteOnSampleVisitStatData')
          ..add('totalPresent', totalPresent)
          ..add('totalTested', totalTested))
        .toString();
  }
}

class GetSiteOnSampleVisitStatDataBuilder
    implements
        Builder<GetSiteOnSampleVisitStatData,
            GetSiteOnSampleVisitStatDataBuilder> {
  _$GetSiteOnSampleVisitStatData? _$v;

  num? _totalPresent;
  num? get totalPresent => _$this._totalPresent;
  set totalPresent(num? totalPresent) => _$this._totalPresent = totalPresent;

  num? _totalTested;
  num? get totalTested => _$this._totalTested;
  set totalTested(num? totalTested) => _$this._totalTested = totalTested;

  GetSiteOnSampleVisitStatDataBuilder() {
    GetSiteOnSampleVisitStatData._defaults(this);
  }

  GetSiteOnSampleVisitStatDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _totalPresent = $v.totalPresent;
      _totalTested = $v.totalTested;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(GetSiteOnSampleVisitStatData other) {
    _$v = other as _$GetSiteOnSampleVisitStatData;
  }

  @override
  void update(void Function(GetSiteOnSampleVisitStatDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  GetSiteOnSampleVisitStatData build() => _build();

  _$GetSiteOnSampleVisitStatData _build() {
    final _$result = _$v ??
        _$GetSiteOnSampleVisitStatData._(
          totalPresent: BuiltValueNullFieldError.checkNotNull(
              totalPresent, r'GetSiteOnSampleVisitStatData', 'totalPresent'),
          totalTested: BuiltValueNullFieldError.checkNotNull(
              totalTested, r'GetSiteOnSampleVisitStatData', 'totalTested'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
