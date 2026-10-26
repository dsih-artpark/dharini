// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'location_coordinates.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$LocationCoordinates extends LocationCoordinates {
  @override
  final BuiltList<num> coordinates;
  @override
  final String type;

  factory _$LocationCoordinates(
          [void Function(LocationCoordinatesBuilder)? updates]) =>
      (LocationCoordinatesBuilder()..update(updates))._build();

  _$LocationCoordinates._({required this.coordinates, required this.type})
      : super._();
  @override
  LocationCoordinates rebuild(
          void Function(LocationCoordinatesBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  LocationCoordinatesBuilder toBuilder() =>
      LocationCoordinatesBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is LocationCoordinates &&
        coordinates == other.coordinates &&
        type == other.type;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, coordinates.hashCode);
    _$hash = $jc(_$hash, type.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'LocationCoordinates')
          ..add('coordinates', coordinates)
          ..add('type', type))
        .toString();
  }
}

class LocationCoordinatesBuilder
    implements Builder<LocationCoordinates, LocationCoordinatesBuilder> {
  _$LocationCoordinates? _$v;

  ListBuilder<num>? _coordinates;
  ListBuilder<num> get coordinates =>
      _$this._coordinates ??= ListBuilder<num>();
  set coordinates(ListBuilder<num>? coordinates) =>
      _$this._coordinates = coordinates;

  String? _type;
  String? get type => _$this._type;
  set type(String? type) => _$this._type = type;

  LocationCoordinatesBuilder() {
    LocationCoordinates._defaults(this);
  }

  LocationCoordinatesBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _coordinates = $v.coordinates.toBuilder();
      _type = $v.type;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(LocationCoordinates other) {
    _$v = other as _$LocationCoordinates;
  }

  @override
  void update(void Function(LocationCoordinatesBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  LocationCoordinates build() => _build();

  _$LocationCoordinates _build() {
    _$LocationCoordinates _$result;
    try {
      _$result = _$v ??
          _$LocationCoordinates._(
            coordinates: coordinates.build(),
            type: BuiltValueNullFieldError.checkNotNull(
                type, r'LocationCoordinates', 'type'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'coordinates';
        coordinates.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'LocationCoordinates', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
