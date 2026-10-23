//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'update_location_dto.g.dart';

/// UpdateLocationDto
///
/// Properties:
/// * [regionId] - Id of the district
/// * [latitude] - current location latitude
/// * [longitude] - current location longitude
@BuiltValue()
abstract class UpdateLocationDto implements Built<UpdateLocationDto, UpdateLocationDtoBuilder> {
  /// Id of the district
  @BuiltValueField(wireName: r'regionId')
  String? get regionId;

  /// current location latitude
  @BuiltValueField(wireName: r'latitude')
  num? get latitude;

  /// current location longitude
  @BuiltValueField(wireName: r'longitude')
  num? get longitude;

  UpdateLocationDto._();

  factory UpdateLocationDto([void updates(UpdateLocationDtoBuilder b)]) = _$UpdateLocationDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UpdateLocationDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<UpdateLocationDto> get serializer => _$UpdateLocationDtoSerializer();
}

class _$UpdateLocationDtoSerializer implements PrimitiveSerializer<UpdateLocationDto> {
  @override
  final Iterable<Type> types = const [UpdateLocationDto, _$UpdateLocationDto];

  @override
  final String wireName = r'UpdateLocationDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    UpdateLocationDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.regionId != null) {
      yield r'regionId';
      yield serializers.serialize(
        object.regionId,
        specifiedType: const FullType(String),
      );
    }
    if (object.latitude != null) {
      yield r'latitude';
      yield serializers.serialize(
        object.latitude,
        specifiedType: const FullType(num),
      );
    }
    if (object.longitude != null) {
      yield r'longitude';
      yield serializers.serialize(
        object.longitude,
        specifiedType: const FullType(num),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    UpdateLocationDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UpdateLocationDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'regionId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.regionId = valueDes;
          break;
        case r'latitude':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.latitude = valueDes;
          break;
        case r'longitude':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.longitude = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  UpdateLocationDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UpdateLocationDtoBuilder();
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


