//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'submit_visit_response.g.dart';

/// SubmitVisitResponse
///
/// Properties:
/// * [success] 
/// * [message] 
@BuiltValue()
abstract class SubmitVisitResponse implements Built<SubmitVisitResponse, SubmitVisitResponseBuilder> {
  @BuiltValueField(wireName: r'success')
  bool get success;

  @BuiltValueField(wireName: r'message')
  String get message;

  SubmitVisitResponse._();

  factory SubmitVisitResponse([void updates(SubmitVisitResponseBuilder b)]) = _$SubmitVisitResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(SubmitVisitResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<SubmitVisitResponse> get serializer => _$SubmitVisitResponseSerializer();
}

class _$SubmitVisitResponseSerializer implements PrimitiveSerializer<SubmitVisitResponse> {
  @override
  final Iterable<Type> types = const [SubmitVisitResponse, _$SubmitVisitResponse];

  @override
  final String wireName = r'SubmitVisitResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    SubmitVisitResponse object, {
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
  }

  @override
  Object serialize(
    Serializers serializers,
    SubmitVisitResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required SubmitVisitResponseBuilder result,
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
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  SubmitVisitResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = SubmitVisitResponseBuilder();
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


