// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'site_stat_type.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$SiteStatType extends SiteStatType {
  @override
  final String district;
  @override
  final num positiveCount;
  @override
  final num totalSiteCount;

  factory _$SiteStatType([void Function(SiteStatTypeBuilder)? updates]) =>
      (SiteStatTypeBuilder()..update(updates))._build();

  _$SiteStatType._(
      {required this.district,
      required this.positiveCount,
      required this.totalSiteCount})
      : super._();
  @override
  SiteStatType rebuild(void Function(SiteStatTypeBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  SiteStatTypeBuilder toBuilder() => SiteStatTypeBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is SiteStatType &&
        district == other.district &&
        positiveCount == other.positiveCount &&
        totalSiteCount == other.totalSiteCount;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, district.hashCode);
    _$hash = $jc(_$hash, positiveCount.hashCode);
    _$hash = $jc(_$hash, totalSiteCount.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'SiteStatType')
          ..add('district', district)
          ..add('positiveCount', positiveCount)
          ..add('totalSiteCount', totalSiteCount))
        .toString();
  }
}

class SiteStatTypeBuilder
    implements Builder<SiteStatType, SiteStatTypeBuilder> {
  _$SiteStatType? _$v;

  String? _district;
  String? get district => _$this._district;
  set district(String? district) => _$this._district = district;

  num? _positiveCount;
  num? get positiveCount => _$this._positiveCount;
  set positiveCount(num? positiveCount) =>
      _$this._positiveCount = positiveCount;

  num? _totalSiteCount;
  num? get totalSiteCount => _$this._totalSiteCount;
  set totalSiteCount(num? totalSiteCount) =>
      _$this._totalSiteCount = totalSiteCount;

  SiteStatTypeBuilder() {
    SiteStatType._defaults(this);
  }

  SiteStatTypeBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _district = $v.district;
      _positiveCount = $v.positiveCount;
      _totalSiteCount = $v.totalSiteCount;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(SiteStatType other) {
    _$v = other as _$SiteStatType;
  }

  @override
  void update(void Function(SiteStatTypeBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  SiteStatType build() => _build();

  _$SiteStatType _build() {
    final _$result = _$v ??
        _$SiteStatType._(
          district: BuiltValueNullFieldError.checkNotNull(
              district, r'SiteStatType', 'district'),
          positiveCount: BuiltValueNullFieldError.checkNotNull(
              positiveCount, r'SiteStatType', 'positiveCount'),
          totalSiteCount: BuiltValueNullFieldError.checkNotNull(
              totalSiteCount, r'SiteStatType', 'totalSiteCount'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
