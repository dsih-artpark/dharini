// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'most_positive_site_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$MostPositiveSiteResponseData extends MostPositiveSiteResponseData {
  @override
  final BuiltList<SiteStatType> siteStats;

  factory _$MostPositiveSiteResponseData(
          [void Function(MostPositiveSiteResponseDataBuilder)? updates]) =>
      (MostPositiveSiteResponseDataBuilder()..update(updates))._build();

  _$MostPositiveSiteResponseData._({required this.siteStats}) : super._();
  @override
  MostPositiveSiteResponseData rebuild(
          void Function(MostPositiveSiteResponseDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  MostPositiveSiteResponseDataBuilder toBuilder() =>
      MostPositiveSiteResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is MostPositiveSiteResponseData &&
        siteStats == other.siteStats;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, siteStats.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'MostPositiveSiteResponseData')
          ..add('siteStats', siteStats))
        .toString();
  }
}

class MostPositiveSiteResponseDataBuilder
    implements
        Builder<MostPositiveSiteResponseData,
            MostPositiveSiteResponseDataBuilder> {
  _$MostPositiveSiteResponseData? _$v;

  ListBuilder<SiteStatType>? _siteStats;
  ListBuilder<SiteStatType> get siteStats =>
      _$this._siteStats ??= ListBuilder<SiteStatType>();
  set siteStats(ListBuilder<SiteStatType>? siteStats) =>
      _$this._siteStats = siteStats;

  MostPositiveSiteResponseDataBuilder() {
    MostPositiveSiteResponseData._defaults(this);
  }

  MostPositiveSiteResponseDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _siteStats = $v.siteStats.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(MostPositiveSiteResponseData other) {
    _$v = other as _$MostPositiveSiteResponseData;
  }

  @override
  void update(void Function(MostPositiveSiteResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  MostPositiveSiteResponseData build() => _build();

  _$MostPositiveSiteResponseData _build() {
    _$MostPositiveSiteResponseData _$result;
    try {
      _$result = _$v ??
          _$MostPositiveSiteResponseData._(
            siteStats: siteStats.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'siteStats';
        siteStats.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'MostPositiveSiteResponseData', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
