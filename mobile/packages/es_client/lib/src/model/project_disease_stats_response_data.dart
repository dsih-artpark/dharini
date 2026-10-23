//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:es_client/src/model/disease_statistics.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'project_disease_stats_response_data.g.dart';

/// ProjectDiseaseStatsResponseData
///
/// Properties:
/// * [visitedSites] 
/// * [notVisitedSites] 
/// * [diseaseStatistics] 
/// * [totalSiteCount] 
/// * [id] 
/// * [name] 
@BuiltValue()
abstract class ProjectDiseaseStatsResponseData implements Built<ProjectDiseaseStatsResponseData, ProjectDiseaseStatsResponseDataBuilder> {
  @BuiltValueField(wireName: r'visitedSites')
  num? get visitedSites;

  @BuiltValueField(wireName: r'notVisitedSites')
  num? get notVisitedSites;

  @BuiltValueField(wireName: r'diseaseStatistics')
  BuiltList<DiseaseStatistics> get diseaseStatistics;

  @BuiltValueField(wireName: r'totalSiteCount')
  num? get totalSiteCount;

  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'name')
  String get name;

  ProjectDiseaseStatsResponseData._();

  factory ProjectDiseaseStatsResponseData([void updates(ProjectDiseaseStatsResponseDataBuilder b)]) = _$ProjectDiseaseStatsResponseData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ProjectDiseaseStatsResponseDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ProjectDiseaseStatsResponseData> get serializer => _$ProjectDiseaseStatsResponseDataSerializer();
}

class _$ProjectDiseaseStatsResponseDataSerializer implements PrimitiveSerializer<ProjectDiseaseStatsResponseData> {
  @override
  final Iterable<Type> types = const [ProjectDiseaseStatsResponseData, _$ProjectDiseaseStatsResponseData];

  @override
  final String wireName = r'ProjectDiseaseStatsResponseData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ProjectDiseaseStatsResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.visitedSites != null) {
      yield r'visitedSites';
      yield serializers.serialize(
        object.visitedSites,
        specifiedType: const FullType(num),
      );
    }
    if (object.notVisitedSites != null) {
      yield r'notVisitedSites';
      yield serializers.serialize(
        object.notVisitedSites,
        specifiedType: const FullType(num),
      );
    }
    yield r'diseaseStatistics';
    yield serializers.serialize(
      object.diseaseStatistics,
      specifiedType: const FullType(BuiltList, [FullType(DiseaseStatistics)]),
    );
    if (object.totalSiteCount != null) {
      yield r'totalSiteCount';
      yield serializers.serialize(
        object.totalSiteCount,
        specifiedType: const FullType(num),
      );
    }
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(String),
    );
    yield r'name';
    yield serializers.serialize(
      object.name,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    ProjectDiseaseStatsResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ProjectDiseaseStatsResponseDataBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'visitedSites':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.visitedSites = valueDes;
          break;
        case r'notVisitedSites':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.notVisitedSites = valueDes;
          break;
        case r'diseaseStatistics':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(DiseaseStatistics)]),
          ) as BuiltList<DiseaseStatistics>;
          result.diseaseStatistics.replace(valueDes);
          break;
        case r'totalSiteCount':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.totalSiteCount = valueDes;
          break;
        case r'id':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.id = valueDes;
          break;
        case r'name':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.name = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  ProjectDiseaseStatsResponseData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ProjectDiseaseStatsResponseDataBuilder();
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


