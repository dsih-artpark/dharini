//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'signup_dto.g.dart';

/// SignupDto
///
/// Properties:
/// * [email] - Email for the new workspace owner
/// * [phone] - Phone number for the new workspace owner
@BuiltValue()
abstract class SignupDto implements Built<SignupDto, SignupDtoBuilder> {
  /// Email for the new workspace owner
  @BuiltValueField(wireName: r'email')
  String? get email;

  /// Phone number for the new workspace owner
  @BuiltValueField(wireName: r'phone')
  String? get phone;

  SignupDto._();

  factory SignupDto([void updates(SignupDtoBuilder b)]) = _$SignupDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(SignupDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<SignupDto> get serializer => _$SignupDtoSerializer();
}

class _$SignupDtoSerializer implements PrimitiveSerializer<SignupDto> {
  @override
  final Iterable<Type> types = const [SignupDto, _$SignupDto];

  @override
  final String wireName = r'SignupDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    SignupDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.email != null) {
      yield r'email';
      yield serializers.serialize(
        object.email,
        specifiedType: const FullType(String),
      );
    }
    if (object.phone != null) {
      yield r'phone';
      yield serializers.serialize(
        object.phone,
        specifiedType: const FullType(String),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    SignupDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required SignupDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'email':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.email = valueDes;
          break;
        case r'phone':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
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
  SignupDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = SignupDtoBuilder();
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


