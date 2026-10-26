//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'verify_otp_response_data.g.dart';

/// VerifyOtpResponseData
///
/// Properties:
/// * [accessToken] 
@BuiltValue()
abstract class VerifyOtpResponseData implements Built<VerifyOtpResponseData, VerifyOtpResponseDataBuilder> {
  @BuiltValueField(wireName: r'accessToken')
  String get accessToken;

  VerifyOtpResponseData._();

  factory VerifyOtpResponseData([void updates(VerifyOtpResponseDataBuilder b)]) = _$VerifyOtpResponseData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(VerifyOtpResponseDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<VerifyOtpResponseData> get serializer => _$VerifyOtpResponseDataSerializer();
}

class _$VerifyOtpResponseDataSerializer implements PrimitiveSerializer<VerifyOtpResponseData> {
  @override
  final Iterable<Type> types = const [VerifyOtpResponseData, _$VerifyOtpResponseData];

  @override
  final String wireName = r'VerifyOtpResponseData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    VerifyOtpResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'accessToken';
    yield serializers.serialize(
      object.accessToken,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    VerifyOtpResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required VerifyOtpResponseDataBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'accessToken':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.accessToken = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  VerifyOtpResponseData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = VerifyOtpResponseDataBuilder();
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


