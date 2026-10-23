//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/visit_summary_response_data.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'visit_summary_response.g.dart';

/// VisitSummaryResponse
///
/// Properties:
/// * [success] 
/// * [message] 
/// * [data] 
@BuiltValue()
abstract class VisitSummaryResponse implements Built<VisitSummaryResponse, VisitSummaryResponseBuilder> {
  @BuiltValueField(wireName: r'success')
  bool get success;

  @BuiltValueField(wireName: r'message')
  String get message;

  @BuiltValueField(wireName: r'data')
  VisitSummaryResponseData get data;

  VisitSummaryResponse._();

  factory VisitSummaryResponse([void updates(VisitSummaryResponseBuilder b)]) = _$VisitSummaryResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(VisitSummaryResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<VisitSummaryResponse> get serializer => _$VisitSummaryResponseSerializer();
}

class _$VisitSummaryResponseSerializer implements PrimitiveSerializer<VisitSummaryResponse> {
  @override
  final Iterable<Type> types = const [VisitSummaryResponse, _$VisitSummaryResponse];

  @override
  final String wireName = r'VisitSummaryResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    VisitSummaryResponse object, {
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
      specifiedType: const FullType(VisitSummaryResponseData),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    VisitSummaryResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required VisitSummaryResponseBuilder result,
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
            specifiedType: const FullType(VisitSummaryResponseData),
          ) as VisitSummaryResponseData;
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
  VisitSummaryResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = VisitSummaryResponseBuilder();
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


