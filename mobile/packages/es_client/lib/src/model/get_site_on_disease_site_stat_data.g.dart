// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'get_site_on_disease_site_stat_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$GetSiteOnDiseaseSiteStatData extends GetSiteOnDiseaseSiteStatData {
  @override
  final num totalPresent;
  @override
  final num totalPositive;

  factory _$GetSiteOnDiseaseSiteStatData(
          [void Function(GetSiteOnDiseaseSiteStatDataBuilder)? updates]) =>
      (GetSiteOnDiseaseSiteStatDataBuilder()..update(updates))._build();

  _$GetSiteOnDiseaseSiteStatData._(
      {required this.totalPresent, required this.totalPositive})
      : super._();
  @override
  GetSiteOnDiseaseSiteStatData rebuild(
          void Function(GetSiteOnDiseaseSiteStatDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  GetSiteOnDiseaseSiteStatDataBuilder toBuilder() =>
      GetSiteOnDiseaseSiteStatDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is GetSiteOnDiseaseSiteStatData &&
        totalPresent == other.totalPresent &&
        totalPositive == other.totalPositive;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, totalPresent.hashCode);
    _$hash = $jc(_$hash, totalPositive.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'GetSiteOnDiseaseSiteStatData')
          ..add('totalPresent', totalPresent)
          ..add('totalPositive', totalPositive))
        .toString();
  }
}

class GetSiteOnDiseaseSiteStatDataBuilder
    implements
        Builder<GetSiteOnDiseaseSiteStatData,
            GetSiteOnDiseaseSiteStatDataBuilder> {
  _$GetSiteOnDiseaseSiteStatData? _$v;

  num? _totalPresent;
  num? get totalPresent => _$this._totalPresent;
  set totalPresent(num? totalPresent) => _$this._totalPresent = totalPresent;

  num? _totalPositive;
  num? get totalPositive => _$this._totalPositive;
  set totalPositive(num? totalPositive) =>
      _$this._totalPositive = totalPositive;

  GetSiteOnDiseaseSiteStatDataBuilder() {
    GetSiteOnDiseaseSiteStatData._defaults(this);
  }

  GetSiteOnDiseaseSiteStatDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _totalPresent = $v.totalPresent;
      _totalPositive = $v.totalPositive;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(GetSiteOnDiseaseSiteStatData other) {
    _$v = other as _$GetSiteOnDiseaseSiteStatData;
  }

  @override
  void update(void Function(GetSiteOnDiseaseSiteStatDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  GetSiteOnDiseaseSiteStatData build() => _build();

  _$GetSiteOnDiseaseSiteStatData _build() {
    final _$result = _$v ??
        _$GetSiteOnDiseaseSiteStatData._(
          totalPresent: BuiltValueNullFieldError.checkNotNull(
              totalPresent, r'GetSiteOnDiseaseSiteStatData', 'totalPresent'),
          totalPositive: BuiltValueNullFieldError.checkNotNull(
              totalPositive, r'GetSiteOnDiseaseSiteStatData', 'totalPositive'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
