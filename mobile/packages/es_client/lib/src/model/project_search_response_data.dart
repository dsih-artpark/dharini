//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'project_search_response_data.g.dart';

/// ProjectSearchResponseData
///
/// Properties:
/// * [id] 
/// * [name] 
@BuiltValue()
abstract class ProjectSearchResponseData implements Built<ProjectSearchResponseData, ProjectSearchResponseDataBuilder> {
  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'name')
  String get name;

  ProjectSearchResponseData._();

  factory ProjectSearchResponseData([void updates(ProjectSearchResponseDataBuilder b)]) = _$ProjectSearchResponseData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ProjectSearchResponseDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ProjectSearchResponseData> get serializer => _$ProjectSearchResponseDataSerializer();
}

class _$ProjectSearchResponseDataSerializer implements PrimitiveSerializer<ProjectSearchResponseData> {
  @override
  final Iterable<Type> types = const [ProjectSearchResponseData, _$ProjectSearchResponseData];

  @override
  final String wireName = r'ProjectSearchResponseData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ProjectSearchResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
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
    ProjectSearchResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ProjectSearchResponseDataBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
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
  ProjectSearchResponseData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ProjectSearchResponseDataBuilder();
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


