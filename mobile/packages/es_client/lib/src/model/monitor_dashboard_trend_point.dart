//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'monitor_dashboard_trend_point.g.dart';

/// MonitorDashboardTrendPoint
///
/// Properties:
/// * [period] 
/// * [totalSamples] 
/// * [positiveSamples] 
/// * [negativeSamples] 
@BuiltValue()
abstract class MonitorDashboardTrendPoint implements Built<MonitorDashboardTrendPoint, MonitorDashboardTrendPointBuilder> {
  @BuiltValueField(wireName: r'period')
  DateTime get period;

  @BuiltValueField(wireName: r'totalSamples')
  num get totalSamples;

  @BuiltValueField(wireName: r'positiveSamples')
  num get positiveSamples;

  @BuiltValueField(wireName: r'negativeSamples')
  num get negativeSamples;

  MonitorDashboardTrendPoint._();

  factory MonitorDashboardTrendPoint([void updates(MonitorDashboardTrendPointBuilder b)]) = _$MonitorDashboardTrendPoint;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(MonitorDashboardTrendPointBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<MonitorDashboardTrendPoint> get serializer => _$MonitorDashboardTrendPointSerializer();
}

class _$MonitorDashboardTrendPointSerializer implements PrimitiveSerializer<MonitorDashboardTrendPoint> {
  @override
  final Iterable<Type> types = const [MonitorDashboardTrendPoint, _$MonitorDashboardTrendPoint];

  @override
  final String wireName = r'MonitorDashboardTrendPoint';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    MonitorDashboardTrendPoint object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'period';
    yield serializers.serialize(
      object.period,
      specifiedType: const FullType(DateTime),
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
    yield r'negativeSamples';
    yield serializers.serialize(
      object.negativeSamples,
      specifiedType: const FullType(num),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    MonitorDashboardTrendPoint object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required MonitorDashboardTrendPointBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'period':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.period = valueDes;
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
        case r'negativeSamples':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.negativeSamples = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  MonitorDashboardTrendPoint deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = MonitorDashboardTrendPointBuilder();
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


