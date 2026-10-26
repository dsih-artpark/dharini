//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/lookup_user_match.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'lookup_user_result.g.dart';

/// LookupUserResult
///
/// Properties:
/// * [exists] - Whether an active user holds this identifier
/// * [user] 
@BuiltValue()
abstract class LookupUserResult implements Built<LookupUserResult, LookupUserResultBuilder> {
  /// Whether an active user holds this identifier
  @BuiltValueField(wireName: r'exists')
  bool get exists;

  @BuiltValueField(wireName: r'user')
  LookupUserMatch? get user;

  LookupUserResult._();

  factory LookupUserResult([void updates(LookupUserResultBuilder b)]) = _$LookupUserResult;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(LookupUserResultBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<LookupUserResult> get serializer => _$LookupUserResultSerializer();
}

class _$LookupUserResultSerializer implements PrimitiveSerializer<LookupUserResult> {
  @override
  final Iterable<Type> types = const [LookupUserResult, _$LookupUserResult];

  @override
  final String wireName = r'LookupUserResult';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    LookupUserResult object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'exists';
    yield serializers.serialize(
      object.exists,
      specifiedType: const FullType(bool),
    );
    if (object.user != null) {
      yield r'user';
      yield serializers.serialize(
        object.user,
        specifiedType: const FullType(LookupUserMatch),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    LookupUserResult object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required LookupUserResultBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'exists':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.exists = valueDes;
          break;
        case r'user':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(LookupUserMatch),
          ) as LookupUserMatch?;
          if (valueDes == null) continue;
          result.user.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  LookupUserResult deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = LookupUserResultBuilder();
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


