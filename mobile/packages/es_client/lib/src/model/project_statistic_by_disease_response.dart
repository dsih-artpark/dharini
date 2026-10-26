//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:es_client/src/model/project_statistic_by_diseases_response_data.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'project_statistic_by_disease_response.g.dart';

/// ProjectStatisticByDiseaseResponse
///
/// Properties:
/// * [success] 
/// * [message] 
/// * [data] 
@BuiltValue()
abstract class ProjectStatisticByDiseaseResponse implements Built<ProjectStatisticByDiseaseResponse, ProjectStatisticByDiseaseResponseBuilder> {
  @BuiltValueField(wireName: r'success')
  bool get success;

  @BuiltValueField(wireName: r'message')
  String get message;

  @BuiltValueField(wireName: r'data')
  BuiltList<ProjectStatisticByDiseasesResponseData> get data;

  ProjectStatisticByDiseaseResponse._();

  factory ProjectStatisticByDiseaseResponse([void updates(ProjectStatisticByDiseaseResponseBuilder b)]) = _$ProjectStatisticByDiseaseResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ProjectStatisticByDiseaseResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ProjectStatisticByDiseaseResponse> get serializer => _$ProjectStatisticByDiseaseResponseSerializer();
}

class _$ProjectStatisticByDiseaseResponseSerializer implements PrimitiveSerializer<ProjectStatisticByDiseaseResponse> {
  @override
  final Iterable<Type> types = const [ProjectStatisticByDiseaseResponse, _$ProjectStatisticByDiseaseResponse];

  @override
  final String wireName = r'ProjectStatisticByDiseaseResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ProjectStatisticByDiseaseResponse object, {
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
      specifiedType: const FullType(BuiltList, [FullType(ProjectStatisticByDiseasesResponseData)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    ProjectStatisticByDiseaseResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ProjectStatisticByDiseaseResponseBuilder result,
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
            specifiedType: const FullType(BuiltList, [FullType(ProjectStatisticByDiseasesResponseData)]),
          ) as BuiltList<ProjectStatisticByDiseasesResponseData>;
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
  ProjectStatisticByDiseaseResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ProjectStatisticByDiseaseResponseBuilder();
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


