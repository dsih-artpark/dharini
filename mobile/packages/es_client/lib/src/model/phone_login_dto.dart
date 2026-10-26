//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'phone_login_dto.g.dart';

/// PhoneLoginDto
///
/// Properties:
/// * [phone] - The phone number used for login
@BuiltValue()
abstract class PhoneLoginDto implements Built<PhoneLoginDto, PhoneLoginDtoBuilder> {
  /// The phone number used for login
  @BuiltValueField(wireName: r'phone')
  String get phone;

  PhoneLoginDto._();

  factory PhoneLoginDto([void updates(PhoneLoginDtoBuilder b)]) = _$PhoneLoginDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(PhoneLoginDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<PhoneLoginDto> get serializer => _$PhoneLoginDtoSerializer();
}

class _$PhoneLoginDtoSerializer implements PrimitiveSerializer<PhoneLoginDto> {
  @override
  final Iterable<Type> types = const [PhoneLoginDto, _$PhoneLoginDto];

  @override
  final String wireName = r'PhoneLoginDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    PhoneLoginDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'phone';
    yield serializers.serialize(
      object.phone,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    PhoneLoginDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required PhoneLoginDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'phone':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.phone = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  PhoneLoginDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = PhoneLoginDtoBuilder();
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


