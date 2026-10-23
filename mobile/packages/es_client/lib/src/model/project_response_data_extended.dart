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

part 'project_response_data_extended.g.dart';

/// ProjectResponseDataExtended
///
/// Properties:
/// * [id] 
/// * [name] 
/// * [code] 
/// * [workspace] 
/// * [projectAdmins] 
/// * [diseases] 
/// * [regions] 
/// * [totalSiteCount] 
@BuiltValue()
abstract class ProjectResponseDataExtended implements Built<ProjectResponseDataExtended, ProjectResponseDataExtendedBuilder> {
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

  @BuiltValueField(wireName: r'totalSiteCount')
  num? get totalSiteCount;

  ProjectResponseDataExtended._();

  factory ProjectResponseDataExtended([void updates(ProjectResponseDataExtendedBuilder b)]) = _$ProjectResponseDataExtended;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ProjectResponseDataExtendedBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ProjectResponseDataExtended> get serializer => _$ProjectResponseDataExtendedSerializer();
}

class _$ProjectResponseDataExtendedSerializer implements PrimitiveSerializer<ProjectResponseDataExtended> {
  @override
  final Iterable<Type> types = const [ProjectResponseDataExtended, _$ProjectResponseDataExtended];

  @override
  final String wireName = r'ProjectResponseDataExtended';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ProjectResponseDataExtended object, {
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
    if (object.totalSiteCount != null) {
      yield r'totalSiteCount';
      yield serializers.serialize(
        object.totalSiteCount,
        specifiedType: const FullType(num),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    ProjectResponseDataExtended object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ProjectResponseDataExtendedBuilder result,
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
        case r'totalSiteCount':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.totalSiteCount = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  ProjectResponseDataExtended deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ProjectResponseDataExtendedBuilder();
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


