//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:es_client/src/model/disease.dart';
import 'package:es_client/src/model/project_response_region.dart';
import 'package:es_client/src/model/user.dart';
import 'package:es_client/src/model/workspace.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'project_response_data.g.dart';

/// ProjectResponseData
///
/// Properties:
/// * [id] 
/// * [name] 
/// * [code] 
/// * [workspace] 
/// * [projectAdmins] 
/// * [diseases] 
/// * [regions] 
@BuiltValue()
abstract class ProjectResponseData implements Built<ProjectResponseData, ProjectResponseDataBuilder> {
  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'name')
  String get name;

  @BuiltValueField(wireName: r'code')
  String get code;

  @BuiltValueField(wireName: r'workspace')
  Workspace? get workspace;

  @BuiltValueField(wireName: r'projectAdmins')
  BuiltList<User> get projectAdmins;

  @BuiltValueField(wireName: r'diseases')
  BuiltList<Disease> get diseases;

  @BuiltValueField(wireName: r'regions')
  BuiltList<ProjectResponseRegion> get regions;

  ProjectResponseData._();

  factory ProjectResponseData([void updates(ProjectResponseDataBuilder b)]) = _$ProjectResponseData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ProjectResponseDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ProjectResponseData> get serializer => _$ProjectResponseDataSerializer();
}

class _$ProjectResponseDataSerializer implements PrimitiveSerializer<ProjectResponseData> {
  @override
  final Iterable<Type> types = const [ProjectResponseData, _$ProjectResponseData];

  @override
  final String wireName = r'ProjectResponseData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ProjectResponseData object, {
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
    yield r'code';
    yield serializers.serialize(
      object.code,
      specifiedType: const FullType(String),
    );
    if (object.workspace != null) {
      yield r'workspace';
      yield serializers.serialize(
        object.workspace,
        specifiedType: const FullType.nullable(Workspace),
      );
    }
    yield r'projectAdmins';
    yield serializers.serialize(
      object.projectAdmins,
      specifiedType: const FullType(BuiltList, [FullType(User)]),
    );
    yield r'diseases';
    yield serializers.serialize(
      object.diseases,
      specifiedType: const FullType(BuiltList, [FullType(Disease)]),
    );
    yield r'regions';
    yield serializers.serialize(
      object.regions,
      specifiedType: const FullType(BuiltList, [FullType(ProjectResponseRegion)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    ProjectResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ProjectResponseDataBuilder result,
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
        case r'code':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.code = valueDes;
          break;
        case r'workspace':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(Workspace),
          ) as Workspace?;
          if (valueDes == null) continue;
          result.workspace.replace(valueDes);
          break;
        case r'projectAdmins':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(User)]),
          ) as BuiltList<User>;
          result.projectAdmins.replace(valueDes);
          break;
        case r'diseases':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(Disease)]),
          ) as BuiltList<Disease>;
          result.diseases.replace(valueDes);
          break;
        case r'regions':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(ProjectResponseRegion)]),
          ) as BuiltList<ProjectResponseRegion>;
          result.regions.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  ProjectResponseData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ProjectResponseDataBuilder();
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


