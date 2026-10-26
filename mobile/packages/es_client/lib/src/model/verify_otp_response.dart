//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/verify_otp_response_data.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'verify_otp_response.g.dart';

/// VerifyOtpResponse
///
/// Properties:
/// * [success] 
/// * [message] 
/// * [data] 
@BuiltValue()
abstract class VerifyOtpResponse implements Built<VerifyOtpResponse, VerifyOtpResponseBuilder> {
  @BuiltValueField(wireName: r'success')
  bool get success;

  @BuiltValueField(wireName: r'message')
  String get message;

  @BuiltValueField(wireName: r'data')
  VerifyOtpResponseData get data;

  VerifyOtpResponse._();

  factory VerifyOtpResponse([void updates(VerifyOtpResponseBuilder b)]) = _$VerifyOtpResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(VerifyOtpResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<VerifyOtpResponse> get serializer => _$VerifyOtpResponseSerializer();
}

class _$VerifyOtpResponseSerializer implements PrimitiveSerializer<VerifyOtpResponse> {
  @override
  final Iterable<Type> types = const [VerifyOtpResponse, _$VerifyOtpResponse];

  @override
  final String wireName = r'VerifyOtpResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    VerifyOtpResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'success';
    yield serializers.serialize(
      object.success,
      specifiedType: const FullType(bool),
    );
    yield r'message';
    yield serializers.serialize(
      object.message,
      specifiedType: const FullType(String),
    );
    yield r'data';
    yield serializers.serialize(
      object.data,
      specifiedType: const FullType(VerifyOtpResponseData),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    VerifyOtpResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required VerifyOtpResponseBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'success':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.success = valueDes;
          break;
        case r'message':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.message = valueDes;
          break;
        case r'data':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(VerifyOtpResponseData),
          ) as VerifyOtpResponseData;
          result.data.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  VerifyOtpResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = VerifyOtpResponseBuilder();
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


