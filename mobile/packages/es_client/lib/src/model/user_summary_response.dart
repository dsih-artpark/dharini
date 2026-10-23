//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/user_response_type.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'user_summary_response.g.dart';

/// UserSummaryResponse
///
/// Properties:
/// * [success] 
/// * [message] 
/// * [data] 
@BuiltValue()
abstract class UserSummaryResponse implements Built<UserSummaryResponse, UserSummaryResponseBuilder> {
  @BuiltValueField(wireName: r'success')
  bool get success;

  @BuiltValueField(wireName: r'message')
  String get message;

  @BuiltValueField(wireName: r'data')
  UserResponseType get data;

  UserSummaryResponse._();

  factory UserSummaryResponse([void updates(UserSummaryResponseBuilder b)]) = _$UserSummaryResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UserSummaryResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<UserSummaryResponse> get serializer => _$UserSummaryResponseSerializer();
}

class _$UserSummaryResponseSerializer implements PrimitiveSerializer<UserSummaryResponse> {
  @override
  final Iterable<Type> types = const [UserSummaryResponse, _$UserSummaryResponse];

  @override
  final String wireName = r'UserSummaryResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    UserSummaryResponse object, {
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
      specifiedType: const FullType(UserResponseType),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    UserSummaryResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UserSummaryResponseBuilder result,
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
            specifiedType: const FullType(UserResponseType),
          ) as UserResponseType;
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
  UserSummaryResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UserSummaryResponseBuilder();
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


