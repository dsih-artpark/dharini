// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_region_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const UpdateRegionDtoStatusEnum _$updateRegionDtoStatusEnum_active =
    const UpdateRegionDtoStatusEnum._('active');
const UpdateRegionDtoStatusEnum _$updateRegionDtoStatusEnum_inactive =
    const UpdateRegionDtoStatusEnum._('inactive');
const UpdateRegionDtoStatusEnum _$updateRegionDtoStatusEnum_deleted =
    const UpdateRegionDtoStatusEnum._('deleted');
const UpdateRegionDtoStatusEnum
    _$updateRegionDtoStatusEnum_unknownDefaultOpenApi =
    const UpdateRegionDtoStatusEnum._('unknownDefaultOpenApi');

UpdateRegionDtoStatusEnum _$updateRegionDtoStatusEnumValueOf(String name) {
  switch (name) {
    case 'active':
      return _$updateRegionDtoStatusEnum_active;
    case 'inactive':
      return _$updateRegionDtoStatusEnum_inactive;
    case 'deleted':
      return _$updateRegionDtoStatusEnum_deleted;
    case 'unknownDefaultOpenApi':
      return _$updateRegionDtoStatusEnum_unknownDefaultOpenApi;
    default:
      return _$updateRegionDtoStatusEnum_unknownDefaultOpenApi;
  }
}

final BuiltSet<UpdateRegionDtoStatusEnum> _$updateRegionDtoStatusEnumValues =
    BuiltSet<UpdateRegionDtoStatusEnum>(const <UpdateRegionDtoStatusEnum>[
  _$updateRegionDtoStatusEnum_active,
  _$updateRegionDtoStatusEnum_inactive,
  _$updateRegionDtoStatusEnum_deleted,
  _$updateRegionDtoStatusEnum_unknownDefaultOpenApi,
]);

const UpdateRegionDtoRegionTypeEnum _$updateRegionDtoRegionTypeEnum_country =
    const UpdateRegionDtoRegionTypeEnum._('country');
const UpdateRegionDtoRegionTypeEnum _$updateRegionDtoRegionTypeEnum_state =
    const UpdateRegionDtoRegionTypeEnum._('state');
const UpdateRegionDtoRegionTypeEnum _$updateRegionDtoRegionTypeEnum_district =
    const UpdateRegionDtoRegionTypeEnum._('district');
const UpdateRegionDtoRegionTypeEnum
    _$updateRegionDtoRegionTypeEnum_subdistrict =
    const UpdateRegionDtoRegionTypeEnum._('subdistrict');
const UpdateRegionDtoRegionTypeEnum _$updateRegionDtoRegionTypeEnum_city =
    const UpdateRegionDtoRegionTypeEnum._('city');
const UpdateRegionDtoRegionTypeEnum
    _$updateRegionDtoRegionTypeEnum_unknownDefaultOpenApi =
    const UpdateRegionDtoRegionTypeEnum._('unknownDefaultOpenApi');

UpdateRegionDtoRegionTypeEnum _$updateRegionDtoRegionTypeEnumValueOf(
    String name) {
  switch (name) {
    case 'country':
      return _$updateRegionDtoRegionTypeEnum_country;
    case 'state':
      return _$updateRegionDtoRegionTypeEnum_state;
    case 'district':
      return _$updateRegionDtoRegionTypeEnum_district;
    case 'subdistrict':
      return _$updateRegionDtoRegionTypeEnum_subdistrict;
    case 'city':
      return _$updateRegionDtoRegionTypeEnum_city;
    case 'unknownDefaultOpenApi':
      return _$updateRegionDtoRegionTypeEnum_unknownDefaultOpenApi;
    default:
      return _$updateRegionDtoRegionTypeEnum_unknownDefaultOpenApi;
  }
}

final BuiltSet<UpdateRegionDtoRegionTypeEnum>
    _$updateRegionDtoRegionTypeEnumValues = BuiltSet<
        UpdateRegionDtoRegionTypeEnum>(const <UpdateRegionDtoRegionTypeEnum>[
  _$updateRegionDtoRegionTypeEnum_country,
  _$updateRegionDtoRegionTypeEnum_state,
  _$updateRegionDtoRegionTypeEnum_district,
  _$updateRegionDtoRegionTypeEnum_subdistrict,
  _$updateRegionDtoRegionTypeEnum_city,
  _$updateRegionDtoRegionTypeEnum_unknownDefaultOpenApi,
]);

Serializer<UpdateRegionDtoStatusEnum> _$updateRegionDtoStatusEnumSerializer =
    _$UpdateRegionDtoStatusEnumSerializer();
Serializer<UpdateRegionDtoRegionTypeEnum>
    _$updateRegionDtoRegionTypeEnumSerializer =
    _$UpdateRegionDtoRegionTypeEnumSerializer();

class _$UpdateRegionDtoStatusEnumSerializer
    implements PrimitiveSerializer<UpdateRegionDtoStatusEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'active': 'active',
    'inactive': 'inactive',
    'deleted': 'deleted',
    'unknownDefaultOpenApi': 'unknown_default_open_api',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'active': 'active',
    'inactive': 'inactive',
    'deleted': 'deleted',
    'unknown_default_open_api': 'unknownDefaultOpenApi',
  };

  @override
  final Iterable<Type> types = const <Type>[UpdateRegionDtoStatusEnum];
  @override
  final String wireName = 'UpdateRegionDtoStatusEnum';

  @override
  Object serialize(Serializers serializers, UpdateRegionDtoStatusEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  UpdateRegionDtoStatusEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      UpdateRegionDtoStatusEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$UpdateRegionDtoRegionTypeEnumSerializer
    implements PrimitiveSerializer<UpdateRegionDtoRegionTypeEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'country': 'country',
    'state': 'state',
    'district': 'district',
    'subdistrict': 'subdistrict',
    'city': 'city',
    'unknownDefaultOpenApi': 'unknown_default_open_api',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'country': 'country',
    'state': 'state',
    'district': 'district',
    'subdistrict': 'subdistrict',
    'city': 'city',
    'unknown_default_open_api': 'unknownDefaultOpenApi',
  };

  @override
  final Iterable<Type> types = const <Type>[UpdateRegionDtoRegionTypeEnum];
  @override
  final String wireName = 'UpdateRegionDtoRegionTypeEnum';

  @override
  Object serialize(
          Serializers serializers, UpdateRegionDtoRegionTypeEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  UpdateRegionDtoRegionTypeEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      UpdateRegionDtoRegionTypeEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$UpdateRegionDto extends UpdateRegionDto {
  @override
  final UpdateRegionDtoStatusEnum? status;
  @override
  final UpdateRegionDtoRegionTypeEnum regionType;
  @override
  final String name;

  factory _$UpdateRegionDto([void Function(UpdateRegionDtoBuilder)? updates]) =>
      (UpdateRegionDtoBuilder()..update(updates))._build();

  _$UpdateRegionDto._(
      {this.status, required this.regionType, required this.name})
      : super._();
  @override
  UpdateRegionDto rebuild(void Function(UpdateRegionDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UpdateRegionDtoBuilder toBuilder() => UpdateRegionDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UpdateRegionDto &&
        status == other.status &&
        regionType == other.regionType &&
        name == other.name;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, status.hashCode);
    _$hash = $jc(_$hash, regionType.hashCode);
    _$hash = $jc(_$hash, name.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UpdateRegionDto')
          ..add('status', status)
          ..add('regionType', regionType)
          ..add('name', name))
        .toString();
  }
}

class UpdateRegionDtoBuilder
    implements Builder<UpdateRegionDto, UpdateRegionDtoBuilder> {
  _$UpdateRegionDto? _$v;

  UpdateRegionDtoStatusEnum? _status;
  UpdateRegionDtoStatusEnum? get status => _$this._status;
  set status(UpdateRegionDtoStatusEnum? status) => _$this._status = status;

  UpdateRegionDtoRegionTypeEnum? _regionType;
  UpdateRegionDtoRegionTypeEnum? get regionType => _$this._regionType;
  set regionType(UpdateRegionDtoRegionTypeEnum? regionType) =>
      _$this._regionType = regionType;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  UpdateRegionDtoBuilder() {
    UpdateRegionDto._defaults(this);
  }

  UpdateRegionDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _status = $v.status;
      _regionType = $v.regionType;
      _name = $v.name;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UpdateRegionDto other) {
    _$v = other as _$UpdateRegionDto;
  }

  @override
  void update(void Function(UpdateRegionDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UpdateRegionDto build() => _build();

  _$UpdateRegionDto _build() {
    final _$result = _$v ??
        _$UpdateRegionDto._(
          status: status,
          regionType: BuiltValueNullFieldError.checkNotNull(
              regionType, r'UpdateRegionDto', 'regionType'),
          name: BuiltValueNullFieldError.checkNotNull(
              name, r'UpdateRegionDto', 'name'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
