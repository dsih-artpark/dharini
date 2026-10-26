//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/disease_sample_stats_type.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'disease_sample_stats_response_data.g.dart';

/// DiseaseSampleStatsResponseData
///
/// Properties:
/// * [diseaseName] 
@BuiltValue()
abstract class DiseaseSampleStatsResponseData implements Built<DiseaseSampleStatsResponseData, DiseaseSampleStatsResponseDataBuilder> {
  @BuiltValueField(wireName: r'diseaseName')
  DiseaseSampleStatsType get diseaseName;

  DiseaseSampleStatsResponseData._();

  factory DiseaseSampleStatsResponseData([void updates(DiseaseSampleStatsResponseDataBuilder b)]) = _$DiseaseSampleStatsResponseData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(DiseaseSampleStatsResponseDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<DiseaseSampleStatsResponseData> get serializer => _$DiseaseSampleStatsResponseDataSerializer();
}

class _$DiseaseSampleStatsResponseDataSerializer implements PrimitiveSerializer<DiseaseSampleStatsResponseData> {
  @override
  final Iterable<Type> types = const [DiseaseSampleStatsResponseData, _$DiseaseSampleStatsResponseData];

  @override
  final String wireName = r'DiseaseSampleStatsResponseData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    DiseaseSampleStatsResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'diseaseName';
    yield serializers.serialize(
      object.diseaseName,
      specifiedType: const FullType(DiseaseSampleStatsType),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    DiseaseSampleStatsResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required DiseaseSampleStatsResponseDataBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'diseaseName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DiseaseSampleStatsType),
          ) as DiseaseSampleStatsType;
          result.diseaseName.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  DiseaseSampleStatsResponseData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = DiseaseSampleStatsResponseDataBuilder();
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


