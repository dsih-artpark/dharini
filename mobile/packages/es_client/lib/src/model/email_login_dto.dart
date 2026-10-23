//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'email_login_dto.g.dart';

/// EmailLoginDto
///
/// Properties:
/// * [email] - The email used for login
@BuiltValue()
abstract class EmailLoginDto implements Built<EmailLoginDto, EmailLoginDtoBuilder> {
  /// The email used for login
  @BuiltValueField(wireName: r'email')
  String get email;

  EmailLoginDto._();

  factory EmailLoginDto([void updates(EmailLoginDtoBuilder b)]) = _$EmailLoginDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(EmailLoginDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<EmailLoginDto> get serializer => _$EmailLoginDtoSerializer();
}

class _$EmailLoginDtoSerializer implements PrimitiveSerializer<EmailLoginDto> {
  @override
  final Iterable<Type> types = const [EmailLoginDto, _$EmailLoginDto];

  @override
  final String wireName = r'EmailLoginDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    EmailLoginDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'email';
    yield serializers.serialize(
      object.email,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    EmailLoginDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required EmailLoginDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'email':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.email = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  EmailLoginDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = EmailLoginDtoBuilder();
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


