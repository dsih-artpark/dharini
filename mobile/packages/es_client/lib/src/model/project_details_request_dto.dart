//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'project_details_request_dto.g.dart';

/// ProjectDetailsRequestDto
///
/// Properties:
/// * [projectId] - Project IDs
@BuiltValue()
abstract class ProjectDetailsRequestDto implements Built<ProjectDetailsRequestDto, ProjectDetailsRequestDtoBuilder> {
  /// Project IDs
  @BuiltValueField(wireName: r'projectId')
  BuiltList<String> get projectId;

  ProjectDetailsRequestDto._();

  factory ProjectDetailsRequestDto([void updates(ProjectDetailsRequestDtoBuilder b)]) = _$ProjectDetailsRequestDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ProjectDetailsRequestDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ProjectDetailsRequestDto> get serializer => _$ProjectDetailsRequestDtoSerializer();
}

class _$ProjectDetailsRequestDtoSerializer implements PrimitiveSerializer<ProjectDetailsRequestDto> {
  @override
  final Iterable<Type> types = const [ProjectDetailsRequestDto, _$ProjectDetailsRequestDto];

  @override
  final String wireName = r'ProjectDetailsRequestDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ProjectDetailsRequestDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'projectId';
    yield serializers.serialize(
      object.projectId,
      specifiedType: const FullType(BuiltList, [FullType(String)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    ProjectDetailsRequestDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ProjectDetailsRequestDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'projectId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(String)]),
          ) as BuiltList<String>;
          result.projectId.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  ProjectDetailsRequestDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ProjectDetailsRequestDtoBuilder();
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


