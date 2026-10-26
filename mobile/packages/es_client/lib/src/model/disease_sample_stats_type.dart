//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'disease_sample_stats_type.g.dart';

/// DiseaseSampleStatsType
///
/// Properties:
/// * [totalSamples] 
/// * [testedSamples] 
@BuiltValue()
abstract class DiseaseSampleStatsType implements Built<DiseaseSampleStatsType, DiseaseSampleStatsTypeBuilder> {
  @BuiltValueField(wireName: r'totalSamples')
  num get totalSamples;

  @BuiltValueField(wireName: r'testedSamples')
  num get testedSamples;

  DiseaseSampleStatsType._();

  factory DiseaseSampleStatsType([void updates(DiseaseSampleStatsTypeBuilder b)]) = _$DiseaseSampleStatsType;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(DiseaseSampleStatsTypeBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<DiseaseSampleStatsType> get serializer => _$DiseaseSampleStatsTypeSerializer();
}

class _$DiseaseSampleStatsTypeSerializer implements PrimitiveSerializer<DiseaseSampleStatsType> {
  @override
  final Iterable<Type> types = const [DiseaseSampleStatsType, _$DiseaseSampleStatsType];

  @override
  final String wireName = r'DiseaseSampleStatsType';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    DiseaseSampleStatsType object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'totalSamples';
    yield serializers.serialize(
      object.totalSamples,
      specifiedType: const FullType(num),
    );
    yield r'testedSamples';
    yield serializers.serialize(
      object.testedSamples,
      specifiedType: const FullType(num),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    DiseaseSampleStatsType object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required DiseaseSampleStatsTypeBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'totalSamples':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.totalSamples = valueDes;
          break;
        case r'testedSamples':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.testedSamples = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  DiseaseSampleStatsType deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = DiseaseSampleStatsTypeBuilder();
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


