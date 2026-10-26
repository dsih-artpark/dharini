//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'monitor_dashboard_summary.g.dart';

/// MonitorDashboardSummary
///
/// Properties:
/// * [totalSamples] 
/// * [processedSamples] 
/// * [positivityRate] 
/// * [positiveSamples] 
/// * [negativeSamples] 
/// * [positiveSites] 
/// * [inconclusiveSamples] 
@BuiltValue()
abstract class MonitorDashboardSummary implements Built<MonitorDashboardSummary, MonitorDashboardSummaryBuilder> {
  @BuiltValueField(wireName: r'totalSamples')
  num get totalSamples;

  @BuiltValueField(wireName: r'processedSamples')
  num get processedSamples;

  @BuiltValueField(wireName: r'positivityRate')
  num get positivityRate;

  @BuiltValueField(wireName: r'positiveSamples')
  num? get positiveSamples;

  @BuiltValueField(wireName: r'negativeSamples')
  num? get negativeSamples;

  @BuiltValueField(wireName: r'positiveSites')
  num get positiveSites;

  @BuiltValueField(wireName: r'inconclusiveSamples')
  num get inconclusiveSamples;

  MonitorDashboardSummary._();

  factory MonitorDashboardSummary([void updates(MonitorDashboardSummaryBuilder b)]) = _$MonitorDashboardSummary;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(MonitorDashboardSummaryBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<MonitorDashboardSummary> get serializer => _$MonitorDashboardSummarySerializer();
}

class _$MonitorDashboardSummarySerializer implements PrimitiveSerializer<MonitorDashboardSummary> {
  @override
  final Iterable<Type> types = const [MonitorDashboardSummary, _$MonitorDashboardSummary];

  @override
  final String wireName = r'MonitorDashboardSummary';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    MonitorDashboardSummary object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'totalSamples';
    yield serializers.serialize(
      object.totalSamples,
      specifiedType: const FullType(num),
    );
    yield r'processedSamples';
    yield serializers.serialize(
      object.processedSamples,
      specifiedType: const FullType(num),
    );
    yield r'positivityRate';
    yield serializers.serialize(
      object.positivityRate,
      specifiedType: const FullType(num),
    );
    if (object.positiveSamples != null) {
      yield r'positiveSamples';
      yield serializers.serialize(
        object.positiveSamples,
        specifiedType: const FullType(num),
      );
    }
    if (object.negativeSamples != null) {
      yield r'negativeSamples';
      yield serializers.serialize(
        object.negativeSamples,
        specifiedType: const FullType(num),
      );
    }
    yield r'positiveSites';
    yield serializers.serialize(
      object.positiveSites,
      specifiedType: const FullType(num),
    );
    yield r'inconclusiveSamples';
    yield serializers.serialize(
      object.inconclusiveSamples,
      specifiedType: const FullType(num),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    MonitorDashboardSummary object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required MonitorDashboardSummaryBuilder result,
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
        case r'processedSamples':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.processedSamples = valueDes;
          break;
        case r'positivityRate':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.positivityRate = valueDes;
          break;
        case r'positiveSamples':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.positiveSamples = valueDes;
          break;
        case r'negativeSamples':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.negativeSamples = valueDes;
          break;
        case r'positiveSites':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.positiveSites = valueDes;
          break;
        case r'inconclusiveSamples':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.inconclusiveSamples = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  MonitorDashboardSummary deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = MonitorDashboardSummaryBuilder();
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


