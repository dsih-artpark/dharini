//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'monitor_dashboard_disease_positive.g.dart';

/// MonitorDashboardDiseasePositive
///
/// Properties:
/// * [diseaseId] 
/// * [diseaseName] 
/// * [diseaseShortName] 
/// * [diseaseIndex] 
/// * [positiveSamples] 
@BuiltValue()
abstract class MonitorDashboardDiseasePositive implements Built<MonitorDashboardDiseasePositive, MonitorDashboardDiseasePositiveBuilder> {
  @BuiltValueField(wireName: r'diseaseId')
  String get diseaseId;

  @BuiltValueField(wireName: r'diseaseName')
  String get diseaseName;

  @BuiltValueField(wireName: r'diseaseShortName')
  String get diseaseShortName;

  @BuiltValueField(wireName: r'diseaseIndex')
  num get diseaseIndex;

  @BuiltValueField(wireName: r'positiveSamples')
  num get positiveSamples;

  MonitorDashboardDiseasePositive._();

  factory MonitorDashboardDiseasePositive([void updates(MonitorDashboardDiseasePositiveBuilder b)]) = _$MonitorDashboardDiseasePositive;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(MonitorDashboardDiseasePositiveBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<MonitorDashboardDiseasePositive> get serializer => _$MonitorDashboardDiseasePositiveSerializer();
}

class _$MonitorDashboardDiseasePositiveSerializer implements PrimitiveSerializer<MonitorDashboardDiseasePositive> {
  @override
  final Iterable<Type> types = const [MonitorDashboardDiseasePositive, _$MonitorDashboardDiseasePositive];

  @override
  final String wireName = r'MonitorDashboardDiseasePositive';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    MonitorDashboardDiseasePositive object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'diseaseId';
    yield serializers.serialize(
      object.diseaseId,
      specifiedType: const FullType(String),
    );
    yield r'diseaseName';
    yield serializers.serialize(
      object.diseaseName,
      specifiedType: const FullType(String),
    );
    yield r'diseaseShortName';
    yield serializers.serialize(
      object.diseaseShortName,
      specifiedType: const FullType(String),
    );
    yield r'diseaseIndex';
    yield serializers.serialize(
      object.diseaseIndex,
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
    MonitorDashboardDiseasePositive object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required MonitorDashboardDiseasePositiveBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'diseaseId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.diseaseId = valueDes;
          break;
        case r'diseaseName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.diseaseName = valueDes;
          break;
        case r'diseaseShortName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.diseaseShortName = valueDes;
          break;
        case r'diseaseIndex':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.diseaseIndex = valueDes;
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
  MonitorDashboardDiseasePositive deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = MonitorDashboardDiseasePositiveBuilder();
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


