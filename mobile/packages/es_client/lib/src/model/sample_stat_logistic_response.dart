//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:es_client/src/model/sample_stat_logistic_response_data.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'sample_stat_logistic_response.g.dart';

/// SampleStatLogisticResponse
///
/// Properties:
/// * [success] 
/// * [message] 
/// * [data] 
@BuiltValue()
abstract class SampleStatLogisticResponse implements Built<SampleStatLogisticResponse, SampleStatLogisticResponseBuilder> {
  @BuiltValueField(wireName: r'success')
  bool get success;

  @BuiltValueField(wireName: r'message')
  String get message;

  @BuiltValueField(wireName: r'data')
  BuiltList<SampleStatLogisticResponseData> get data;

  SampleStatLogisticResponse._();

  factory SampleStatLogisticResponse([void updates(SampleStatLogisticResponseBuilder b)]) = _$SampleStatLogisticResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(SampleStatLogisticResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<SampleStatLogisticResponse> get serializer => _$SampleStatLogisticResponseSerializer();
}

class _$SampleStatLogisticResponseSerializer implements PrimitiveSerializer<SampleStatLogisticResponse> {
  @override
  final Iterable<Type> types = const [SampleStatLogisticResponse, _$SampleStatLogisticResponse];

  @override
  final String wireName = r'SampleStatLogisticResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    SampleStatLogisticResponse object, {
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
      specifiedType: const FullType(BuiltList, [FullType(SampleStatLogisticResponseData)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    SampleStatLogisticResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required SampleStatLogisticResponseBuilder result,
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
            specifiedType: const FullType(BuiltList, [FullType(SampleStatLogisticResponseData)]),
          ) as BuiltList<SampleStatLogisticResponseData>;
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
  SampleStatLogisticResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = SampleStatLogisticResponseBuilder();
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


