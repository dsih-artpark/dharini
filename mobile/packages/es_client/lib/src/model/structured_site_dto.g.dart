// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'structured_site_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$StructuredSiteDto extends StructuredSiteDto {
  @override
  final BuiltList<CreatePayloadDto> sites;
  @override
  final BuiltList<VisitDto> visits;
  @override
  final BuiltList<SampleDto> samples;
  @override
  final BuiltList<LabTestDto> labTests;

  factory _$StructuredSiteDto(
          [void Function(StructuredSiteDtoBuilder)? updates]) =>
      (StructuredSiteDtoBuilder()..update(updates))._build();

  _$StructuredSiteDto._(
      {required this.sites,
      required this.visits,
      required this.samples,
      required this.labTests})
      : super._();
  @override
  StructuredSiteDto rebuild(void Function(StructuredSiteDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  StructuredSiteDtoBuilder toBuilder() =>
      StructuredSiteDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is StructuredSiteDto &&
        sites == other.sites &&
        visits == other.visits &&
        samples == other.samples &&
        labTests == other.labTests;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, sites.hashCode);
    _$hash = $jc(_$hash, visits.hashCode);
    _$hash = $jc(_$hash, samples.hashCode);
    _$hash = $jc(_$hash, labTests.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'StructuredSiteDto')
          ..add('sites', sites)
          ..add('visits', visits)
          ..add('samples', samples)
          ..add('labTests', labTests))
        .toString();
  }
}

class StructuredSiteDtoBuilder
    implements Builder<StructuredSiteDto, StructuredSiteDtoBuilder> {
  _$StructuredSiteDto? _$v;

  ListBuilder<CreatePayloadDto>? _sites;
  ListBuilder<CreatePayloadDto> get sites =>
      _$this._sites ??= ListBuilder<CreatePayloadDto>();
  set sites(ListBuilder<CreatePayloadDto>? sites) => _$this._sites = sites;

  ListBuilder<VisitDto>? _visits;
  ListBuilder<VisitDto> get visits =>
      _$this._visits ??= ListBuilder<VisitDto>();
  set visits(ListBuilder<VisitDto>? visits) => _$this._visits = visits;

  ListBuilder<SampleDto>? _samples;
  ListBuilder<SampleDto> get samples =>
      _$this._samples ??= ListBuilder<SampleDto>();
  set samples(ListBuilder<SampleDto>? samples) => _$this._samples = samples;

  ListBuilder<LabTestDto>? _labTests;
  ListBuilder<LabTestDto> get labTests =>
      _$this._labTests ??= ListBuilder<LabTestDto>();
  set labTests(ListBuilder<LabTestDto>? labTests) =>
      _$this._labTests = labTests;

  StructuredSiteDtoBuilder() {
    StructuredSiteDto._defaults(this);
  }

  StructuredSiteDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _sites = $v.sites.toBuilder();
      _visits = $v.visits.toBuilder();
      _samples = $v.samples.toBuilder();
      _labTests = $v.labTests.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(StructuredSiteDto other) {
    _$v = other as _$StructuredSiteDto;
  }

  @override
  void update(void Function(StructuredSiteDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  StructuredSiteDto build() => _build();

  _$StructuredSiteDto _build() {
    _$StructuredSiteDto _$result;
    try {
      _$result = _$v ??
          _$StructuredSiteDto._(
            sites: sites.build(),
            visits: visits.build(),
            samples: samples.build(),
            labTests: labTests.build(),
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
        _$failedField = 'labTests';
        labTests.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'StructuredSiteDto', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
