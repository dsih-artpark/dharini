// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'farm_type.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const FarmType _$cattleFarm = const FarmType._('cattleFarm');
const FarmType _$poultryFarm = const FarmType._('poultryFarm');
const FarmType _$wetlandFarm = const FarmType._('wetlandFarm');
const FarmType _$unknownDefaultOpenApi =
    const FarmType._('unknownDefaultOpenApi');

FarmType _$valueOf(String name) {
  switch (name) {
    case 'cattleFarm':
      return _$cattleFarm;
    case 'poultryFarm':
      return _$poultryFarm;
    case 'wetlandFarm':
      return _$wetlandFarm;
    case 'unknownDefaultOpenApi':
      return _$unknownDefaultOpenApi;
    default:
      return _$unknownDefaultOpenApi;
  }
}

final BuiltSet<FarmType> _$values = BuiltSet<FarmType>(const <FarmType>[
  _$cattleFarm,
  _$poultryFarm,
  _$wetlandFarm,
  _$unknownDefaultOpenApi,
]);

class _$FarmTypeMeta {
  const _$FarmTypeMeta();
  FarmType get cattleFarm => _$cattleFarm;
  FarmType get poultryFarm => _$poultryFarm;
  FarmType get wetlandFarm => _$wetlandFarm;
  FarmType get unknownDefaultOpenApi => _$unknownDefaultOpenApi;
  FarmType valueOf(String name) => _$valueOf(name);
  BuiltSet<FarmType> get values => _$values;
}

abstract class _$FarmTypeMixin {
  // ignore: non_constant_identifier_names
  _$FarmTypeMeta get FarmType => const _$FarmTypeMeta();
}

Serializer<FarmType> _$farmTypeSerializer = _$FarmTypeSerializer();

class _$FarmTypeSerializer implements PrimitiveSerializer<FarmType> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'cattleFarm': 'cattle farm',
    'poultryFarm': 'poultry farm',
    'wetlandFarm': 'wetland farm',
    'unknownDefaultOpenApi': 'unknown_default_open_api',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'cattle farm': 'cattleFarm',
    'poultry farm': 'poultryFarm',
    'wetland farm': 'wetlandFarm',
    'unknown_default_open_api': 'unknownDefaultOpenApi',
  };

  @override
  final Iterable<Type> types = const <Type>[FarmType];
  @override
  final String wireName = 'FarmType';

  @override
  Object serialize(Serializers serializers, FarmType object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  FarmType deserialize(Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      FarmType.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
