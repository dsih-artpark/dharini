//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/lookup_user_result.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'lookup_user_response.g.dart';

/// LookupUserResponse
///
/// Properties:
/// * [success] 
/// * [message] 
/// * [data] 
@BuiltValue()
abstract class LookupUserResponse implements Built<LookupUserResponse, LookupUserResponseBuilder> {
  @BuiltValueField(wireName: r'success')
  bool get success;

  @BuiltValueField(wireName: r'message')
  String get message;

  @BuiltValueField(wireName: r'data')
  LookupUserResult get data;

  LookupUserResponse._();

  factory LookupUserResponse([void updates(LookupUserResponseBuilder b)]) = _$LookupUserResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(LookupUserResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<LookupUserResponse> get serializer => _$LookupUserResponseSerializer();
}

class _$LookupUserResponseSerializer implements PrimitiveSerializer<LookupUserResponse> {
  @override
  final Iterable<Type> types = const [LookupUserResponse, _$LookupUserResponse];

  @override
  final String wireName = r'LookupUserResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    LookupUserResponse object, {
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
      specifiedType: const FullType(LookupUserResult),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    LookupUserResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required LookupUserResponseBuilder result,
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
            specifiedType: const FullType(LookupUserResult),
          ) as LookupUserResult;
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
  LookupUserResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = LookupUserResponseBuilder();
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


