//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/disease_sample_stats_response_data.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'disease_stats_response_data.g.dart';

/// DiseaseStatsResponseData
///
/// Properties:
/// * [diseaseStats] 
@BuiltValue()
abstract class DiseaseStatsResponseData implements Built<DiseaseStatsResponseData, DiseaseStatsResponseDataBuilder> {
  @BuiltValueField(wireName: r'diseaseStats')
  DiseaseSampleStatsResponseData get diseaseStats;

  DiseaseStatsResponseData._();

  factory DiseaseStatsResponseData([void updates(DiseaseStatsResponseDataBuilder b)]) = _$DiseaseStatsResponseData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(DiseaseStatsResponseDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<DiseaseStatsResponseData> get serializer => _$DiseaseStatsResponseDataSerializer();
}

class _$DiseaseStatsResponseDataSerializer implements PrimitiveSerializer<DiseaseStatsResponseData> {
  @override
  final Iterable<Type> types = const [DiseaseStatsResponseData, _$DiseaseStatsResponseData];

  @override
  final String wireName = r'DiseaseStatsResponseData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    DiseaseStatsResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'diseaseStats';
    yield serializers.serialize(
      object.diseaseStats,
      specifiedType: const FullType(DiseaseSampleStatsResponseData),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    DiseaseStatsResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required DiseaseStatsResponseDataBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'diseaseStats':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DiseaseSampleStatsResponseData),
          ) as DiseaseSampleStatsResponseData;
          result.diseaseStats.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  DiseaseStatsResponseData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = DiseaseStatsResponseDataBuilder();
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


