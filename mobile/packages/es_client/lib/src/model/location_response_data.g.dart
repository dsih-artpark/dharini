// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'location_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$LocationResponseData extends LocationResponseData {
  @override
  final LocationCoordinates? coordinates;
  @override
  final SiteResponseRegion? region;
  @override
  final String id;

  factory _$LocationResponseData(
          [void Function(LocationResponseDataBuilder)? updates]) =>
      (LocationResponseDataBuilder()..update(updates))._build();

  _$LocationResponseData._({this.coordinates, this.region, required this.id})
      : super._();
  @override
  LocationResponseData rebuild(
          void Function(LocationResponseDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  LocationResponseDataBuilder toBuilder() =>
      LocationResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is LocationResponseData &&
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
    return (newBuiltValueToStringHelper(r'LocationResponseData')
          ..add('coordinates', coordinates)
          ..add('region', region)
          ..add('id', id))
        .toString();
  }
}

class LocationResponseDataBuilder
    implements Builder<LocationResponseData, LocationResponseDataBuilder> {
  _$LocationResponseData? _$v;

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

  LocationResponseDataBuilder() {
    LocationResponseData._defaults(this);
  }

  LocationResponseDataBuilder get _$this {
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
  void replace(LocationResponseData other) {
    _$v = other as _$LocationResponseData;
  }

  @override
  void update(void Function(LocationResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  LocationResponseData build() => _build();

  _$LocationResponseData _build() {
    _$LocationResponseData _$result;
    try {
      _$result = _$v ??
          _$LocationResponseData._(
            coordinates: _coordinates?.build(),
            region: _region?.build(),
            id: BuiltValueNullFieldError.checkNotNull(
                id, r'LocationResponseData', 'id'),
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
            r'LocationResponseData', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
