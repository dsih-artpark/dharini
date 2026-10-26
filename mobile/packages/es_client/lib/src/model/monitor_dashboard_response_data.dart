//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/monitor_dashboard_summary.dart';
import 'package:built_collection/built_collection.dart';
import 'package:es_client/src/model/monitor_dashboard_disease_positive.dart';
import 'package:es_client/src/model/monitor_dashboard_trend_point.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'monitor_dashboard_response_data.g.dart';

/// MonitorDashboardResponseData
///
/// Properties:
/// * [summary] 
/// * [trend] 
/// * [diseasePositive] 
@BuiltValue()
abstract class MonitorDashboardResponseData implements Built<MonitorDashboardResponseData, MonitorDashboardResponseDataBuilder> {
  @BuiltValueField(wireName: r'summary')
  MonitorDashboardSummary get summary;

  @BuiltValueField(wireName: r'trend')
  BuiltList<MonitorDashboardTrendPoint> get trend;

  @BuiltValueField(wireName: r'diseasePositive')
  BuiltList<MonitorDashboardDiseasePositive> get diseasePositive;

  MonitorDashboardResponseData._();

  factory MonitorDashboardResponseData([void updates(MonitorDashboardResponseDataBuilder b)]) = _$MonitorDashboardResponseData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(MonitorDashboardResponseDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<MonitorDashboardResponseData> get serializer => _$MonitorDashboardResponseDataSerializer();
}

class _$MonitorDashboardResponseDataSerializer implements PrimitiveSerializer<MonitorDashboardResponseData> {
  @override
  final Iterable<Type> types = const [MonitorDashboardResponseData, _$MonitorDashboardResponseData];

  @override
  final String wireName = r'MonitorDashboardResponseData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    MonitorDashboardResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'summary';
    yield serializers.serialize(
      object.summary,
      specifiedType: const FullType(MonitorDashboardSummary),
    );
    yield r'trend';
    yield serializers.serialize(
      object.trend,
      specifiedType: const FullType(BuiltList, [FullType(MonitorDashboardTrendPoint)]),
    );
    yield r'diseasePositive';
    yield serializers.serialize(
      object.diseasePositive,
      specifiedType: const FullType(BuiltList, [FullType(MonitorDashboardDiseasePositive)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    MonitorDashboardResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required MonitorDashboardResponseDataBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'summary':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(MonitorDashboardSummary),
          ) as MonitorDashboardSummary;
          result.summary.replace(valueDes);
          break;
        case r'trend':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(MonitorDashboardTrendPoint)]),
          ) as BuiltList<MonitorDashboardTrendPoint>;
          result.trend.replace(valueDes);
          break;
        case r'diseasePositive':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(MonitorDashboardDiseasePositive)]),
          ) as BuiltList<MonitorDashboardDiseasePositive>;
          result.diseasePositive.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  MonitorDashboardResponseData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = MonitorDashboardResponseDataBuilder();
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


