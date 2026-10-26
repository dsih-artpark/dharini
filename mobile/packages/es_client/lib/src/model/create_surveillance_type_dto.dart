//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'create_surveillance_type_dto.g.dart';

/// CreateSurveillanceTypeDto
///
/// Properties:
/// * [name] - Surveillance type name
@BuiltValue()
abstract class CreateSurveillanceTypeDto implements Built<CreateSurveillanceTypeDto, CreateSurveillanceTypeDtoBuilder> {
  /// Surveillance type name
  @BuiltValueField(wireName: r'name')
  String get name;

  CreateSurveillanceTypeDto._();

  factory CreateSurveillanceTypeDto([void updates(CreateSurveillanceTypeDtoBuilder b)]) = _$CreateSurveillanceTypeDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(CreateSurveillanceTypeDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<CreateSurveillanceTypeDto> get serializer => _$CreateSurveillanceTypeDtoSerializer();
}

class _$CreateSurveillanceTypeDtoSerializer implements PrimitiveSerializer<CreateSurveillanceTypeDto> {
  @override
  final Iterable<Type> types = const [CreateSurveillanceTypeDto, _$CreateSurveillanceTypeDto];

  @override
  final String wireName = r'CreateSurveillanceTypeDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    CreateSurveillanceTypeDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'name';
    yield serializers.serialize(
      object.name,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    CreateSurveillanceTypeDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required CreateSurveillanceTypeDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'name':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
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
  CreateSurveillanceTypeDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = CreateSurveillanceTypeDtoBuilder();
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


