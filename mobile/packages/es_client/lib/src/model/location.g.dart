// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'location.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$Location extends Location {
  @override
  final LocationCoordinates? coordinates;
  @override
  final SiteResponseRegion? region;
  @override
  final String id;

  factory _$Location([void Function(LocationBuilder)? updates]) =>
      (LocationBuilder()..update(updates))._build();

  _$Location._({this.coordinates, this.region, required this.id}) : super._();
  @override
  Location rebuild(void Function(LocationBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  LocationBuilder toBuilder() => LocationBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is Location &&
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
    return (newBuiltValueToStringHelper(r'Location')
          ..add('coordinates', coordinates)
          ..add('region', region)
          ..add('id', id))
        .toString();
  }
}

class LocationBuilder implements Builder<Location, LocationBuilder> {
  _$Location? _$v;

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

  LocationBuilder() {
    Location._defaults(this);
  }

  LocationBuilder get _$this {
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
  void replace(Location other) {
    _$v = other as _$Location;
  }

  @override
  void update(void Function(LocationBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  Location build() => _build();

  _$Location _build() {
    _$Location _$result;
    try {
      _$result = _$v ??
          _$Location._(
            coordinates: _coordinates?.build(),
            region: _region?.build(),
            id: BuiltValueNullFieldError.checkNotNull(id, r'Location', 'id'),
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
            r'Location', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
