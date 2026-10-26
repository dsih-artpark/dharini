// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'get_site_on_disease_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$GetSiteOnDiseaseResponseData extends GetSiteOnDiseaseResponseData {
  @override
  final GetSiteOnDiseaseSiteStatData sites;
  @override
  final GetSiteOnDiseaseVisitStatData visits;
  @override
  final GetSiteOnSampleVisitStatData samples;

  factory _$GetSiteOnDiseaseResponseData(
          [void Function(GetSiteOnDiseaseResponseDataBuilder)? updates]) =>
      (GetSiteOnDiseaseResponseDataBuilder()..update(updates))._build();

  _$GetSiteOnDiseaseResponseData._(
      {required this.sites, required this.visits, required this.samples})
      : super._();
  @override
  GetSiteOnDiseaseResponseData rebuild(
          void Function(GetSiteOnDiseaseResponseDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  GetSiteOnDiseaseResponseDataBuilder toBuilder() =>
      GetSiteOnDiseaseResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is GetSiteOnDiseaseResponseData &&
        sites == other.sites &&
        visits == other.visits &&
        samples == other.samples;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, sites.hashCode);
    _$hash = $jc(_$hash, visits.hashCode);
    _$hash = $jc(_$hash, samples.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'GetSiteOnDiseaseResponseData')
          ..add('sites', sites)
          ..add('visits', visits)
          ..add('samples', samples))
        .toString();
  }
}

class GetSiteOnDiseaseResponseDataBuilder
    implements
        Builder<GetSiteOnDiseaseResponseData,
            GetSiteOnDiseaseResponseDataBuilder> {
  _$GetSiteOnDiseaseResponseData? _$v;

  GetSiteOnDiseaseSiteStatDataBuilder? _sites;
  GetSiteOnDiseaseSiteStatDataBuilder get sites =>
      _$this._sites ??= GetSiteOnDiseaseSiteStatDataBuilder();
  set sites(GetSiteOnDiseaseSiteStatDataBuilder? sites) =>
      _$this._sites = sites;

  GetSiteOnDiseaseVisitStatDataBuilder? _visits;
  GetSiteOnDiseaseVisitStatDataBuilder get visits =>
      _$this._visits ??= GetSiteOnDiseaseVisitStatDataBuilder();
  set visits(GetSiteOnDiseaseVisitStatDataBuilder? visits) =>
      _$this._visits = visits;

  GetSiteOnSampleVisitStatDataBuilder? _samples;
  GetSiteOnSampleVisitStatDataBuilder get samples =>
      _$this._samples ??= GetSiteOnSampleVisitStatDataBuilder();
  set samples(GetSiteOnSampleVisitStatDataBuilder? samples) =>
      _$this._samples = samples;

  GetSiteOnDiseaseResponseDataBuilder() {
    GetSiteOnDiseaseResponseData._defaults(this);
  }

  GetSiteOnDiseaseResponseDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _sites = $v.sites.toBuilder();
      _visits = $v.visits.toBuilder();
      _samples = $v.samples.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(GetSiteOnDiseaseResponseData other) {
    _$v = other as _$GetSiteOnDiseaseResponseData;
  }

  @override
  void update(void Function(GetSiteOnDiseaseResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  GetSiteOnDiseaseResponseData build() => _build();

  _$GetSiteOnDiseaseResponseData _build() {
    _$GetSiteOnDiseaseResponseData _$result;
    try {
      _$result = _$v ??
          _$GetSiteOnDiseaseResponseData._(
            sites: sites.build(),
            visits: visits.build(),
            samples: samples.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'sites';
        sites.build();
        _$failedField = 'visits';
        visits.build();
        _$failedField = 'samples';
        samples.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'GetSiteOnDiseaseResponseData', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
