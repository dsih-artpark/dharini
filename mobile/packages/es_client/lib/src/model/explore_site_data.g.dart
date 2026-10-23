// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'explore_site_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ExploreSiteData extends ExploreSiteData {
  @override
  final BuiltList<DiseaseSiteStat> siteData;
  @override
  final num diseaseFreeSiteCount;
  @override
  final BuiltList<DiseaseFreeSite> diseaseFreeSitesCoordinates;

  factory _$ExploreSiteData([void Function(ExploreSiteDataBuilder)? updates]) =>
      (ExploreSiteDataBuilder()..update(updates))._build();

  _$ExploreSiteData._(
      {required this.siteData,
      required this.diseaseFreeSiteCount,
      required this.diseaseFreeSitesCoordinates})
      : super._();
  @override
  ExploreSiteData rebuild(void Function(ExploreSiteDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ExploreSiteDataBuilder toBuilder() => ExploreSiteDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ExploreSiteData &&
        siteData == other.siteData &&
        diseaseFreeSiteCount == other.diseaseFreeSiteCount &&
        diseaseFreeSitesCoordinates == other.diseaseFreeSitesCoordinates;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, siteData.hashCode);
    _$hash = $jc(_$hash, diseaseFreeSiteCount.hashCode);
    _$hash = $jc(_$hash, diseaseFreeSitesCoordinates.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'ExploreSiteData')
          ..add('siteData', siteData)
          ..add('diseaseFreeSiteCount', diseaseFreeSiteCount)
          ..add('diseaseFreeSitesCoordinates', diseaseFreeSitesCoordinates))
        .toString();
  }
}

class ExploreSiteDataBuilder
    implements Builder<ExploreSiteData, ExploreSiteDataBuilder> {
  _$ExploreSiteData? _$v;

  ListBuilder<DiseaseSiteStat>? _siteData;
  ListBuilder<DiseaseSiteStat> get siteData =>
      _$this._siteData ??= ListBuilder<DiseaseSiteStat>();
  set siteData(ListBuilder<DiseaseSiteStat>? siteData) =>
      _$this._siteData = siteData;

  num? _diseaseFreeSiteCount;
  num? get diseaseFreeSiteCount => _$this._diseaseFreeSiteCount;
  set diseaseFreeSiteCount(num? diseaseFreeSiteCount) =>
      _$this._diseaseFreeSiteCount = diseaseFreeSiteCount;

  ListBuilder<DiseaseFreeSite>? _diseaseFreeSitesCoordinates;
  ListBuilder<DiseaseFreeSite> get diseaseFreeSitesCoordinates =>
      _$this._diseaseFreeSitesCoordinates ??= ListBuilder<DiseaseFreeSite>();
  set diseaseFreeSitesCoordinates(
          ListBuilder<DiseaseFreeSite>? diseaseFreeSitesCoordinates) =>
      _$this._diseaseFreeSitesCoordinates = diseaseFreeSitesCoordinates;

  ExploreSiteDataBuilder() {
    ExploreSiteData._defaults(this);
  }

  ExploreSiteDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _siteData = $v.siteData.toBuilder();
      _diseaseFreeSiteCount = $v.diseaseFreeSiteCount;
      _diseaseFreeSitesCoordinates = $v.diseaseFreeSitesCoordinates.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(ExploreSiteData other) {
    _$v = other as _$ExploreSiteData;
  }

  @override
  void update(void Function(ExploreSiteDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ExploreSiteData build() => _build();

  _$ExploreSiteData _build() {
    _$ExploreSiteData _$result;
    try {
      _$result = _$v ??
          _$ExploreSiteData._(
            siteData: siteData.build(),
            diseaseFreeSiteCount: BuiltValueNullFieldError.checkNotNull(
                diseaseFreeSiteCount,
                r'ExploreSiteData',
                'diseaseFreeSiteCount'),
            diseaseFreeSitesCoordinates: diseaseFreeSitesCoordinates.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'siteData';
        siteData.build();

        _$failedField = 'diseaseFreeSitesCoordinates';
        diseaseFreeSitesCoordinates.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'ExploreSiteData', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
