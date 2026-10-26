//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'visit_summary_response_data.g.dart';

/// VisitSummaryResponseData
///
/// Properties:
/// * [visitCount] 
/// * [totalSampleCollected] 
/// * [pendingVisitsIndividual] 
/// * [overdueVisits] 
/// * [pendingVisits] 
/// * [completedVisits] 
@BuiltValue()
abstract class VisitSummaryResponseData implements Built<VisitSummaryResponseData, VisitSummaryResponseDataBuilder> {
  @BuiltValueField(wireName: r'visitCount')
  num get visitCount;

  @BuiltValueField(wireName: r'totalSampleCollected')
  num get totalSampleCollected;

  @BuiltValueField(wireName: r'pendingVisitsIndividual')
  num get pendingVisitsIndividual;

  @BuiltValueField(wireName: r'overdueVisits')
  num get overdueVisits;

  @BuiltValueField(wireName: r'pendingVisits')
  num get pendingVisits;

  @BuiltValueField(wireName: r'completedVisits')
  num get completedVisits;

  VisitSummaryResponseData._();

  factory VisitSummaryResponseData([void updates(VisitSummaryResponseDataBuilder b)]) = _$VisitSummaryResponseData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(VisitSummaryResponseDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<VisitSummaryResponseData> get serializer => _$VisitSummaryResponseDataSerializer();
}

class _$VisitSummaryResponseDataSerializer implements PrimitiveSerializer<VisitSummaryResponseData> {
  @override
  final Iterable<Type> types = const [VisitSummaryResponseData, _$VisitSummaryResponseData];

  @override
  final String wireName = r'VisitSummaryResponseData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    VisitSummaryResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'visitCount';
    yield serializers.serialize(
      object.visitCount,
      specifiedType: const FullType(num),
    );
    yield r'totalSampleCollected';
    yield serializers.serialize(
      object.totalSampleCollected,
      specifiedType: const FullType(num),
    );
    yield r'pendingVisitsIndividual';
    yield serializers.serialize(
      object.pendingVisitsIndividual,
      specifiedType: const FullType(num),
    );
    yield r'overdueVisits';
    yield serializers.serialize(
      object.overdueVisits,
      specifiedType: const FullType(num),
    );
    yield r'pendingVisits';
    yield serializers.serialize(
      object.pendingVisits,
      specifiedType: const FullType(num),
    );
    yield r'completedVisits';
    yield serializers.serialize(
      object.completedVisits,
      specifiedType: const FullType(num),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    VisitSummaryResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required VisitSummaryResponseDataBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'visitCount':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.visitCount = valueDes;
          break;
        case r'totalSampleCollected':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.totalSampleCollected = valueDes;
          break;
        case r'pendingVisitsIndividual':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.pendingVisitsIndividual = valueDes;
          break;
        case r'overdueVisits':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.overdueVisits = valueDes;
          break;
        case r'pendingVisits':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.pendingVisits = valueDes;
          break;
        case r'completedVisits':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.completedVisits = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  VisitSummaryResponseData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = VisitSummaryResponseDataBuilder();
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


