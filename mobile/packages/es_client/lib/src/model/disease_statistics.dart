//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'disease_statistics.g.dart';

/// DiseaseStatistics
///
/// Properties:
/// * [diseaseShortName] 
/// * [totalSamples] 
/// * [positiveSamples] 
@BuiltValue()
abstract class DiseaseStatistics implements Built<DiseaseStatistics, DiseaseStatisticsBuilder> {
  @BuiltValueField(wireName: r'diseaseShortName')
  String get diseaseShortName;

  @BuiltValueField(wireName: r'totalSamples')
  num get totalSamples;

  @BuiltValueField(wireName: r'positiveSamples')
  num get positiveSamples;

  DiseaseStatistics._();

  factory DiseaseStatistics([void updates(DiseaseStatisticsBuilder b)]) = _$DiseaseStatistics;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(DiseaseStatisticsBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<DiseaseStatistics> get serializer => _$DiseaseStatisticsSerializer();
}

class _$DiseaseStatisticsSerializer implements PrimitiveSerializer<DiseaseStatistics> {
  @override
  final Iterable<Type> types = const [DiseaseStatistics, _$DiseaseStatistics];

  @override
  final String wireName = r'DiseaseStatistics';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    DiseaseStatistics object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'diseaseShortName';
    yield serializers.serialize(
      object.diseaseShortName,
      specifiedType: const FullType(String),
    );
    yield r'totalSamples';
    yield serializers.serialize(
      object.totalSamples,
      specifiedType: const FullType(num),
    );
    yield r'positiveSamples';
    yield serializers.serialize(
      object.positiveSamples,
      specifiedType: const FullType(num),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    DiseaseStatistics object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required DiseaseStatisticsBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'diseaseShortName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.diseaseShortName = valueDes;
          break;
        case r'totalSamples':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.totalSamples = valueDes;
          break;
        case r'positiveSamples':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.positiveSamples = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  DiseaseStatistics deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = DiseaseStatisticsBuilder();
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


