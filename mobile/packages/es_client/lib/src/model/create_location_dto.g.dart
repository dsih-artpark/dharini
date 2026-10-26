// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_location_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$CreateLocationDto extends CreateLocationDto {
  @override
  final String regionId;
  @override
  final num? latitude;
  @override
  final num? longitude;

  factory _$CreateLocationDto(
          [void Function(CreateLocationDtoBuilder)? updates]) =>
      (CreateLocationDtoBuilder()..update(updates))._build();

  _$CreateLocationDto._({required this.regionId, this.latitude, this.longitude})
      : super._();
  @override
  CreateLocationDto rebuild(void Function(CreateLocationDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  CreateLocationDtoBuilder toBuilder() =>
      CreateLocationDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is CreateLocationDto &&
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
    return (newBuiltValueToStringHelper(r'CreateLocationDto')
          ..add('regionId', regionId)
          ..add('latitude', latitude)
          ..add('longitude', longitude))
        .toString();
  }
}

class CreateLocationDtoBuilder
    implements Builder<CreateLocationDto, CreateLocationDtoBuilder> {
  _$CreateLocationDto? _$v;

  String? _regionId;
  String? get regionId => _$this._regionId;
  set regionId(String? regionId) => _$this._regionId = regionId;

  num? _latitude;
  num? get latitude => _$this._latitude;
  set latitude(num? latitude) => _$this._latitude = latitude;

  num? _longitude;
  num? get longitude => _$this._longitude;
  set longitude(num? longitude) => _$this._longitude = longitude;

  CreateLocationDtoBuilder() {
    CreateLocationDto._defaults(this);
  }

  CreateLocationDtoBuilder get _$this {
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
  void replace(CreateLocationDto other) {
    _$v = other as _$CreateLocationDto;
  }

  @override
  void update(void Function(CreateLocationDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  CreateLocationDto build() => _build();

  _$CreateLocationDto _build() {
    final _$result = _$v ??
        _$CreateLocationDto._(
          regionId: BuiltValueNullFieldError.checkNotNull(
              regionId, r'CreateLocationDto', 'regionId'),
          latitude: latitude,
          longitude: longitude,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
