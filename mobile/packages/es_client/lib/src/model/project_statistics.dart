//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/disease.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'project_statistics.g.dart';

/// ProjectStatistics
///
/// Properties:
/// * [disease] 
/// * [totalProjectLocations] 
/// * [totalProjects] 
@BuiltValue()
abstract class ProjectStatistics implements Built<ProjectStatistics, ProjectStatisticsBuilder> {
  @BuiltValueField(wireName: r'disease')
  Disease? get disease;

  @BuiltValueField(wireName: r'totalProjectLocations')
  num get totalProjectLocations;

  @BuiltValueField(wireName: r'totalProjects')
  num get totalProjects;

  ProjectStatistics._();

  factory ProjectStatistics([void updates(ProjectStatisticsBuilder b)]) = _$ProjectStatistics;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ProjectStatisticsBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ProjectStatistics> get serializer => _$ProjectStatisticsSerializer();
}

class _$ProjectStatisticsSerializer implements PrimitiveSerializer<ProjectStatistics> {
  @override
  final Iterable<Type> types = const [ProjectStatistics, _$ProjectStatistics];

  @override
  final String wireName = r'ProjectStatistics';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ProjectStatistics object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.disease != null) {
      yield r'disease';
      yield serializers.serialize(
        object.disease,
        specifiedType: const FullType(Disease),
      );
    }
    yield r'totalProjectLocations';
    yield serializers.serialize(
      object.totalProjectLocations,
      specifiedType: const FullType(num),
    );
    yield r'totalProjects';
    yield serializers.serialize(
      object.totalProjects,
      specifiedType: const FullType(num),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    ProjectStatistics object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ProjectStatisticsBuilder result,
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
        case r'totalProjectLocations':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.totalProjectLocations = valueDes;
          break;
        case r'totalProjects':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.totalProjects = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  ProjectStatistics deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ProjectStatisticsBuilder();
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


