// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'disease_free_site.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$DiseaseFreeSite extends DiseaseFreeSite {
  @override
  final LocationCoordinates coordinates;
  @override
  final String siteName;
  @override
  final num totalSampleCount;
  @override
  final num totalPositiveSampleCount;

  factory _$DiseaseFreeSite([void Function(DiseaseFreeSiteBuilder)? updates]) =>
      (DiseaseFreeSiteBuilder()..update(updates))._build();

  _$DiseaseFreeSite._(
      {required this.coordinates,
      required this.siteName,
      required this.totalSampleCount,
      required this.totalPositiveSampleCount})
      : super._();
  @override
  DiseaseFreeSite rebuild(void Function(DiseaseFreeSiteBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  DiseaseFreeSiteBuilder toBuilder() => DiseaseFreeSiteBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is DiseaseFreeSite &&
        coordinates == other.coordinates &&
        siteName == other.siteName &&
        totalSampleCount == other.totalSampleCount &&
        totalPositiveSampleCount == other.totalPositiveSampleCount;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, coordinates.hashCode);
    _$hash = $jc(_$hash, siteName.hashCode);
    _$hash = $jc(_$hash, totalSampleCount.hashCode);
    _$hash = $jc(_$hash, totalPositiveSampleCount.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'DiseaseFreeSite')
          ..add('coordinates', coordinates)
          ..add('siteName', siteName)
          ..add('totalSampleCount', totalSampleCount)
          ..add('totalPositiveSampleCount', totalPositiveSampleCount))
        .toString();
  }
}

class DiseaseFreeSiteBuilder
    implements Builder<DiseaseFreeSite, DiseaseFreeSiteBuilder> {
  _$DiseaseFreeSite? _$v;

  LocationCoordinatesBuilder? _coordinates;
  LocationCoordinatesBuilder get coordinates =>
      _$this._coordinates ??= LocationCoordinatesBuilder();
  set coordinates(LocationCoordinatesBuilder? coordinates) =>
      _$this._coordinates = coordinates;

  String? _siteName;
  String? get siteName => _$this._siteName;
  set siteName(String? siteName) => _$this._siteName = siteName;

  num? _totalSampleCount;
  num? get totalSampleCount => _$this._totalSampleCount;
  set totalSampleCount(num? totalSampleCount) =>
      _$this._totalSampleCount = totalSampleCount;

  num? _totalPositiveSampleCount;
  num? get totalPositiveSampleCount => _$this._totalPositiveSampleCount;
  set totalPositiveSampleCount(num? totalPositiveSampleCount) =>
      _$this._totalPositiveSampleCount = totalPositiveSampleCount;

  DiseaseFreeSiteBuilder() {
    DiseaseFreeSite._defaults(this);
  }

  DiseaseFreeSiteBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _coordinates = $v.coordinates.toBuilder();
      _siteName = $v.siteName;
      _totalSampleCount = $v.totalSampleCount;
      _totalPositiveSampleCount = $v.totalPositiveSampleCount;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(DiseaseFreeSite other) {
    _$v = other as _$DiseaseFreeSite;
  }

  @override
  void update(void Function(DiseaseFreeSiteBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  DiseaseFreeSite build() => _build();

  _$DiseaseFreeSite _build() {
    _$DiseaseFreeSite _$result;
    try {
      _$result = _$v ??
          _$DiseaseFreeSite._(
            coordinates: coordinates.build(),
            siteName: BuiltValueNullFieldError.checkNotNull(
                siteName, r'DiseaseFreeSite', 'siteName'),
            totalSampleCount: BuiltValueNullFieldError.checkNotNull(
                totalSampleCount, r'DiseaseFreeSite', 'totalSampleCount'),
            totalPositiveSampleCount: BuiltValueNullFieldError.checkNotNull(
                totalPositiveSampleCount,
                r'DiseaseFreeSite',
                'totalPositiveSampleCount'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'coordinates';
        coordinates.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'DiseaseFreeSite', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
