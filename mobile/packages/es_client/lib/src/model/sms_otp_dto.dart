//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'sms_otp_dto.g.dart';

/// SmsOtpDto
///
/// Properties:
/// * [contactNumber] - Contact number of the recipient
/// * [message] - Contact number of the recipient
@BuiltValue()
abstract class SmsOtpDto implements Built<SmsOtpDto, SmsOtpDtoBuilder> {
  /// Contact number of the recipient
  @BuiltValueField(wireName: r'contactNumber')
  String get contactNumber;

  /// Contact number of the recipient
  @BuiltValueField(wireName: r'message')
  String get message;

  SmsOtpDto._();

  factory SmsOtpDto([void updates(SmsOtpDtoBuilder b)]) = _$SmsOtpDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(SmsOtpDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<SmsOtpDto> get serializer => _$SmsOtpDtoSerializer();
}

class _$SmsOtpDtoSerializer implements PrimitiveSerializer<SmsOtpDto> {
  @override
  final Iterable<Type> types = const [SmsOtpDto, _$SmsOtpDto];

  @override
  final String wireName = r'SmsOtpDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    SmsOtpDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'contactNumber';
    yield serializers.serialize(
      object.contactNumber,
      specifiedType: const FullType(String),
    );
    yield r'message';
    yield serializers.serialize(
      object.message,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    SmsOtpDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required SmsOtpDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'contactNumber':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.contactNumber = valueDes;
          break;
        case r'message':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.message = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  SmsOtpDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = SmsOtpDtoBuilder();
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


