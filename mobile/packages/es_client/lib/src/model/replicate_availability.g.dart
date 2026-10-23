// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'replicate_availability.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const ReplicateAvailability _$available =
    const ReplicateAvailability._('available');
const ReplicateAvailability _$notCollected =
    const ReplicateAvailability._('notCollected');
const ReplicateAvailability _$unknownDefaultOpenApi =
    const ReplicateAvailability._('unknownDefaultOpenApi');

ReplicateAvailability _$valueOf(String name) {
  switch (name) {
    case 'available':
      return _$available;
    case 'notCollected':
      return _$notCollected;
    case 'unknownDefaultOpenApi':
      return _$unknownDefaultOpenApi;
    default:
      return _$unknownDefaultOpenApi;
  }
}

final BuiltSet<ReplicateAvailability> _$values =
    BuiltSet<ReplicateAvailability>(const <ReplicateAvailability>[
  _$available,
  _$notCollected,
  _$unknownDefaultOpenApi,
]);

class _$ReplicateAvailabilityMeta {
  const _$ReplicateAvailabilityMeta();
  ReplicateAvailability get available => _$available;
  ReplicateAvailability get notCollected => _$notCollected;
  ReplicateAvailability get unknownDefaultOpenApi => _$unknownDefaultOpenApi;
  ReplicateAvailability valueOf(String name) => _$valueOf(name);
  BuiltSet<ReplicateAvailability> get values => _$values;
}

abstract class _$ReplicateAvailabilityMixin {
  // ignore: non_constant_identifier_names
  _$ReplicateAvailabilityMeta get ReplicateAvailability =>
      const _$ReplicateAvailabilityMeta();
}

Serializer<ReplicateAvailability> _$replicateAvailabilitySerializer =
    _$ReplicateAvailabilitySerializer();

class _$ReplicateAvailabilitySerializer
    implements PrimitiveSerializer<ReplicateAvailability> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'available': 'available',
    'notCollected': 'not collected',
    'unknownDefaultOpenApi': 'unknown_default_open_api',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'available': 'available',
    'not collected': 'notCollected',
    'unknown_default_open_api': 'unknownDefaultOpenApi',
  };

  @override
  final Iterable<Type> types = const <Type>[ReplicateAvailability];
  @override
  final String wireName = 'ReplicateAvailability';

  @override
  Object serialize(Serializers serializers, ReplicateAvailability object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  ReplicateAvailability deserialize(Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      ReplicateAvailability.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
