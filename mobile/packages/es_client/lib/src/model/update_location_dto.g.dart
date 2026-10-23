// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_location_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$UpdateLocationDto extends UpdateLocationDto {
  @override
  final String? regionId;
  @override
  final num? latitude;
  @override
  final num? longitude;

  factory _$UpdateLocationDto(
          [void Function(UpdateLocationDtoBuilder)? updates]) =>
      (UpdateLocationDtoBuilder()..update(updates))._build();

  _$UpdateLocationDto._({this.regionId, this.latitude, this.longitude})
      : super._();
  @override
  UpdateLocationDto rebuild(void Function(UpdateLocationDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UpdateLocationDtoBuilder toBuilder() =>
      UpdateLocationDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UpdateLocationDto &&
        regionId == other.regionId &&
        latitude == other.latitude &&
        longitude == other.longitude;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, regionId.hashCode);
    _$hash = $jc(_$hash, latitude.hashCode);
    _$hash = $jc(_$hash, longitude.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UpdateLocationDto')
          ..add('regionId', regionId)
          ..add('latitude', latitude)
          ..add('longitude', longitude))
        .toString();
  }
}

class UpdateLocationDtoBuilder
    implements Builder<UpdateLocationDto, UpdateLocationDtoBuilder> {
  _$UpdateLocationDto? _$v;

  String? _regionId;
  String? get regionId => _$this._regionId;
  set regionId(String? regionId) => _$this._regionId = regionId;

  num? _latitude;
  num? get latitude => _$this._latitude;
  set latitude(num? latitude) => _$this._latitude = latitude;

  num? _longitude;
  num? get longitude => _$this._longitude;
  set longitude(num? longitude) => _$this._longitude = longitude;

  UpdateLocationDtoBuilder() {
    UpdateLocationDto._defaults(this);
  }

  UpdateLocationDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _regionId = $v.regionId;
      _latitude = $v.latitude;
      _longitude = $v.longitude;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UpdateLocationDto other) {
    _$v = other as _$UpdateLocationDto;
  }

  @override
  void update(void Function(UpdateLocationDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UpdateLocationDto build() => _build();

  _$UpdateLocationDto _build() {
    final _$result = _$v ??
        _$UpdateLocationDto._(
          regionId: regionId,
          latitude: latitude,
          longitude: longitude,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
