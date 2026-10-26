//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/disease.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'suspected_positives_data.g.dart';

/// SuspectedPositivesData
///
/// Properties:
/// * [disease] 
/// * [sampleCount] 
/// * [isSuspectedPositive] 
@BuiltValue()
abstract class SuspectedPositivesData implements Built<SuspectedPositivesData, SuspectedPositivesDataBuilder> {
  @BuiltValueField(wireName: r'disease')
  Disease? get disease;

  @BuiltValueField(wireName: r'sampleCount')
  num? get sampleCount;

  @BuiltValueField(wireName: r'isSuspectedPositive')
  bool? get isSuspectedPositive;

  SuspectedPositivesData._();

  factory SuspectedPositivesData([void updates(SuspectedPositivesDataBuilder b)]) = _$SuspectedPositivesData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(SuspectedPositivesDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<SuspectedPositivesData> get serializer => _$SuspectedPositivesDataSerializer();
}

class _$SuspectedPositivesDataSerializer implements PrimitiveSerializer<SuspectedPositivesData> {
  @override
  final Iterable<Type> types = const [SuspectedPositivesData, _$SuspectedPositivesData];

  @override
  final String wireName = r'SuspectedPositivesData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    SuspectedPositivesData object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.disease != null) {
      yield r'disease';
      yield serializers.serialize(
        object.disease,
        specifiedType: const FullType(Disease),
      );
    }
    if (object.sampleCount != null) {
      yield r'sampleCount';
      yield serializers.serialize(
        object.sampleCount,
        specifiedType: const FullType(num),
      );
    }
    if (object.isSuspectedPositive != null) {
      yield r'isSuspectedPositive';
      yield serializers.serialize(
        object.isSuspectedPositive,
        specifiedType: const FullType(bool),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    SuspectedPositivesData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required SuspectedPositivesDataBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'disease':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(Disease),
          ) as Disease?;
          if (valueDes == null) continue;
          result.disease.replace(valueDes);
          break;
        case r'sampleCount':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.sampleCount = valueDes;
          break;
        case r'isSuspectedPositive':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(bool),
          ) as bool?;
          if (valueDes == null) continue;
          result.isSuspectedPositive = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  SuspectedPositivesData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = SuspectedPositivesDataBuilder();
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


