//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'update_surveillance_type_dto.g.dart';

/// UpdateSurveillanceTypeDto
///
/// Properties:
/// * [name] - Surveillance type name
@BuiltValue()
abstract class UpdateSurveillanceTypeDto implements Built<UpdateSurveillanceTypeDto, UpdateSurveillanceTypeDtoBuilder> {
  /// Surveillance type name
  @BuiltValueField(wireName: r'name')
  String? get name;

  UpdateSurveillanceTypeDto._();

  factory UpdateSurveillanceTypeDto([void updates(UpdateSurveillanceTypeDtoBuilder b)]) = _$UpdateSurveillanceTypeDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UpdateSurveillanceTypeDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<UpdateSurveillanceTypeDto> get serializer => _$UpdateSurveillanceTypeDtoSerializer();
}

class _$UpdateSurveillanceTypeDtoSerializer implements PrimitiveSerializer<UpdateSurveillanceTypeDto> {
  @override
  final Iterable<Type> types = const [UpdateSurveillanceTypeDto, _$UpdateSurveillanceTypeDto];

  @override
  final String wireName = r'UpdateSurveillanceTypeDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    UpdateSurveillanceTypeDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.name != null) {
      yield r'name';
      yield serializers.serialize(
        object.name,
        specifiedType: const FullType(String),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    UpdateSurveillanceTypeDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UpdateSurveillanceTypeDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'name':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.name = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  UpdateSurveillanceTypeDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UpdateSurveillanceTypeDtoBuilder();
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


