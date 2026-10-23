//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'verify_signup_dto.g.dart';

/// VerifySignupDto
///
/// Properties:
/// * [email] - Email used for signup
/// * [phone] - Phone number used for signup
/// * [otp] - OTP sent to the email/phone
/// * [firstName] - First name of the new workspace owner
/// * [lastName] - Last name of the new workspace owner
/// * [workspaceName] - Name of the new workspace to create
@BuiltValue()
abstract class VerifySignupDto implements Built<VerifySignupDto, VerifySignupDtoBuilder> {
  /// Email used for signup
  @BuiltValueField(wireName: r'email')
  String? get email;

  /// Phone number used for signup
  @BuiltValueField(wireName: r'phone')
  String? get phone;

  /// OTP sent to the email/phone
  @BuiltValueField(wireName: r'otp')
  num get otp;

  /// First name of the new workspace owner
  @BuiltValueField(wireName: r'firstName')
  String get firstName;

  /// Last name of the new workspace owner
  @BuiltValueField(wireName: r'lastName')
  String? get lastName;

  /// Name of the new workspace to create
  @BuiltValueField(wireName: r'workspaceName')
  String get workspaceName;

  VerifySignupDto._();

  factory VerifySignupDto([void updates(VerifySignupDtoBuilder b)]) = _$VerifySignupDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(VerifySignupDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<VerifySignupDto> get serializer => _$VerifySignupDtoSerializer();
}

class _$VerifySignupDtoSerializer implements PrimitiveSerializer<VerifySignupDto> {
  @override
  final Iterable<Type> types = const [VerifySignupDto, _$VerifySignupDto];

  @override
  final String wireName = r'VerifySignupDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    VerifySignupDto object, {
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
    yield r'otp';
    yield serializers.serialize(
      object.otp,
      specifiedType: const FullType(num),
    );
    yield r'firstName';
    yield serializers.serialize(
      object.firstName,
      specifiedType: const FullType(String),
    );
    if (object.lastName != null) {
      yield r'lastName';
      yield serializers.serialize(
        object.lastName,
        specifiedType: const FullType(String),
      );
    }
    yield r'workspaceName';
    yield serializers.serialize(
      object.workspaceName,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    VerifySignupDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required VerifySignupDtoBuilder result,
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
        case r'otp':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.otp = valueDes;
          break;
        case r'firstName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.firstName = valueDes;
          break;
        case r'lastName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.lastName = valueDes;
          break;
        case r'workspaceName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.workspaceName = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  VerifySignupDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = VerifySignupDtoBuilder();
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


