//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/project_statistics.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'project_statistics_response.g.dart';

/// ProjectStatisticsResponse
///
/// Properties:
/// * [success] 
/// * [message] 
/// * [data] 
@BuiltValue()
abstract class ProjectStatisticsResponse implements Built<ProjectStatisticsResponse, ProjectStatisticsResponseBuilder> {
  @BuiltValueField(wireName: r'success')
  bool get success;

  @BuiltValueField(wireName: r'message')
  String get message;

  @BuiltValueField(wireName: r'data')
  ProjectStatistics get data;

  ProjectStatisticsResponse._();

  factory ProjectStatisticsResponse([void updates(ProjectStatisticsResponseBuilder b)]) = _$ProjectStatisticsResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ProjectStatisticsResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ProjectStatisticsResponse> get serializer => _$ProjectStatisticsResponseSerializer();
}

class _$ProjectStatisticsResponseSerializer implements PrimitiveSerializer<ProjectStatisticsResponse> {
  @override
  final Iterable<Type> types = const [ProjectStatisticsResponse, _$ProjectStatisticsResponse];

  @override
  final String wireName = r'ProjectStatisticsResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ProjectStatisticsResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'success';
    yield serializers.serialize(
      object.success,
      specifiedType: const FullType(bool),
    );
    yield r'message';
    yield serializers.serialize(
      object.message,
      specifiedType: const FullType(String),
    );
    yield r'data';
    yield serializers.serialize(
      object.data,
      specifiedType: const FullType(ProjectStatistics),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    ProjectStatisticsResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ProjectStatisticsResponseBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'success':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.success = valueDes;
          break;
        case r'message':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.message = valueDes;
          break;
        case r'data':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(ProjectStatistics),
          ) as ProjectStatistics;
          result.data.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  ProjectStatisticsResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ProjectStatisticsResponseBuilder();
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


