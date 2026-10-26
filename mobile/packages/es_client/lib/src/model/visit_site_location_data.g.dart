// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'visit_site_location_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$VisitSiteLocationData extends VisitSiteLocationData {
  @override
  final LocationCoordinates? coordinates;
  @override
  final SiteResponseRegion? region;
  @override
  final String id;

  factory _$VisitSiteLocationData(
          [void Function(VisitSiteLocationDataBuilder)? updates]) =>
      (VisitSiteLocationDataBuilder()..update(updates))._build();

  _$VisitSiteLocationData._({this.coordinates, this.region, required this.id})
      : super._();
  @override
  VisitSiteLocationData rebuild(
          void Function(VisitSiteLocationDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  VisitSiteLocationDataBuilder toBuilder() =>
      VisitSiteLocationDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is VisitSiteLocationData &&
        coordinates == other.coordinates &&
        region == other.region &&
        id == other.id;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, coordinates.hashCode);
    _$hash = $jc(_$hash, region.hashCode);
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'VisitSiteLocationData')
          ..add('coordinates', coordinates)
          ..add('region', region)
          ..add('id', id))
        .toString();
  }
}

class VisitSiteLocationDataBuilder
    implements Builder<VisitSiteLocationData, VisitSiteLocationDataBuilder> {
  _$VisitSiteLocationData? _$v;

  LocationCoordinatesBuilder? _coordinates;
  LocationCoordinatesBuilder get coordinates =>
      _$this._coordinates ??= LocationCoordinatesBuilder();
  set coordinates(LocationCoordinatesBuilder? coordinates) =>
      _$this._coordinates = coordinates;

  SiteResponseRegionBuilder? _region;
  SiteResponseRegionBuilder get region =>
      _$this._region ??= SiteResponseRegionBuilder();
  set region(SiteResponseRegionBuilder? region) => _$this._region = region;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  VisitSiteLocationDataBuilder() {
    VisitSiteLocationData._defaults(this);
  }

  VisitSiteLocationDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _coordinates = $v.coordinates?.toBuilder();
      _region = $v.region?.toBuilder();
      _id = $v.id;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(VisitSiteLocationData other) {
    _$v = other as _$VisitSiteLocationData;
  }

  @override
  void update(void Function(VisitSiteLocationDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  VisitSiteLocationData build() => _build();

  _$VisitSiteLocationData _build() {
    _$VisitSiteLocationData _$result;
    try {
      _$result = _$v ??
          _$VisitSiteLocationData._(
            coordinates: _coordinates?.build(),
            region: _region?.build(),
            id: BuiltValueNullFieldError.checkNotNull(
                id, r'VisitSiteLocationData', 'id'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'coordinates';
        _coordinates?.build();
        _$failedField = 'region';
        _region?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'VisitSiteLocationData', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
