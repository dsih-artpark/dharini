//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'location_coordinates.g.dart';

/// LocationCoordinates
///
/// Properties:
/// * [coordinates] 
/// * [type] 
@BuiltValue()
abstract class LocationCoordinates implements Built<LocationCoordinates, LocationCoordinatesBuilder> {
  @BuiltValueField(wireName: r'coordinates')
  BuiltList<num> get coordinates;

  @BuiltValueField(wireName: r'type')
  String get type;

  LocationCoordinates._();

  factory LocationCoordinates([void updates(LocationCoordinatesBuilder b)]) = _$LocationCoordinates;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(LocationCoordinatesBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<LocationCoordinates> get serializer => _$LocationCoordinatesSerializer();
}

class _$LocationCoordinatesSerializer implements PrimitiveSerializer<LocationCoordinates> {
  @override
  final Iterable<Type> types = const [LocationCoordinates, _$LocationCoordinates];

  @override
  final String wireName = r'LocationCoordinates';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    LocationCoordinates object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'coordinates';
    yield serializers.serialize(
      object.coordinates,
      specifiedType: const FullType(BuiltList, [FullType(num)]),
    );
    yield r'type';
    yield serializers.serialize(
      object.type,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    LocationCoordinates object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required LocationCoordinatesBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'coordinates':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(num)]),
          ) as BuiltList<num>;
          result.coordinates.replace(valueDes);
          break;
        case r'type':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.type = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  LocationCoordinates deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = LocationCoordinatesBuilder();
    final serializedList = (serialized as Iterable<Object?>).toList();
    final unhandled = <Object?>[];
    _deserializeProperties(
      serializers,
      serialized,
      specifiedType: specifiedType,
      serializedList: serializedList,
      unhandled: unhandled,
      result: result,
    );
    return result.build();
  }
}


