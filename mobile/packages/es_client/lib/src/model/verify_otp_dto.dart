//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'verify_otp_dto.g.dart';

/// VerifyOtpDto
///
/// Properties:
/// * [email] - Email
/// * [phone] - Phone
/// * [otp] - OTP
@BuiltValue()
abstract class VerifyOtpDto implements Built<VerifyOtpDto, VerifyOtpDtoBuilder> {
  /// Email
  @BuiltValueField(wireName: r'email')
  String? get email;

  /// Phone
  @BuiltValueField(wireName: r'phone')
  num? get phone;

  /// OTP
  @BuiltValueField(wireName: r'otp')
  num get otp;

  VerifyOtpDto._();

  factory VerifyOtpDto([void updates(VerifyOtpDtoBuilder b)]) = _$VerifyOtpDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(VerifyOtpDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<VerifyOtpDto> get serializer => _$VerifyOtpDtoSerializer();
}

class _$VerifyOtpDtoSerializer implements PrimitiveSerializer<VerifyOtpDto> {
  @override
  final Iterable<Type> types = const [VerifyOtpDto, _$VerifyOtpDto];

  @override
  final String wireName = r'VerifyOtpDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    VerifyOtpDto object, {
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
        specifiedType: const FullType(num),
      );
    }
    yield r'otp';
    yield serializers.serialize(
      object.otp,
      specifiedType: const FullType(num),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    VerifyOtpDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required VerifyOtpDtoBuilder result,
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
            specifiedType: const FullType.nullable(num),
          ) as num?;
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
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  VerifyOtpDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = VerifyOtpDtoBuilder();
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


