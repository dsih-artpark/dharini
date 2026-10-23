//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'sample_stat_logistic_response_data.g.dart';

/// SampleStatLogisticResponseData
///
/// Properties:
/// * [totalCollected] 
/// * [totalUnclear] 
/// * [totalPositive] 
/// * [totalNegative] 
@BuiltValue()
abstract class SampleStatLogisticResponseData implements Built<SampleStatLogisticResponseData, SampleStatLogisticResponseDataBuilder> {
  @BuiltValueField(wireName: r'totalCollected')
  num get totalCollected;

  @BuiltValueField(wireName: r'totalUnclear')
  num get totalUnclear;

  @BuiltValueField(wireName: r'totalPositive')
  num get totalPositive;

  @BuiltValueField(wireName: r'totalNegative')
  num get totalNegative;

  SampleStatLogisticResponseData._();

  factory SampleStatLogisticResponseData([void updates(SampleStatLogisticResponseDataBuilder b)]) = _$SampleStatLogisticResponseData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(SampleStatLogisticResponseDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<SampleStatLogisticResponseData> get serializer => _$SampleStatLogisticResponseDataSerializer();
}

class _$SampleStatLogisticResponseDataSerializer implements PrimitiveSerializer<SampleStatLogisticResponseData> {
  @override
  final Iterable<Type> types = const [SampleStatLogisticResponseData, _$SampleStatLogisticResponseData];

  @override
  final String wireName = r'SampleStatLogisticResponseData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    SampleStatLogisticResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'totalCollected';
    yield serializers.serialize(
      object.totalCollected,
      specifiedType: const FullType(num),
    );
    yield r'totalUnclear';
    yield serializers.serialize(
      object.totalUnclear,
      specifiedType: const FullType(num),
    );
    yield r'totalPositive';
    yield serializers.serialize(
      object.totalPositive,
      specifiedType: const FullType(num),
    );
    yield r'totalNegative';
    yield serializers.serialize(
      object.totalNegative,
      specifiedType: const FullType(num),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    SampleStatLogisticResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required SampleStatLogisticResponseDataBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'totalCollected':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.totalCollected = valueDes;
          break;
        case r'totalUnclear':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.totalUnclear = valueDes;
          break;
        case r'totalPositive':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.totalPositive = valueDes;
          break;
        case r'totalNegative':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.totalNegative = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  SampleStatLogisticResponseData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = SampleStatLogisticResponseDataBuilder();
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


