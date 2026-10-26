//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:es_client/src/model/project_response_parent_region.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'project_response_region.g.dart';

/// ProjectResponseRegion
///
/// Properties:
/// * [parentRegion] 
/// * [id] 
/// * [regionType] 
/// * [lgdCode] 
/// * [localName] 
/// * [name] 
/// * [createdAt] 
/// * [updatedAt] 
@BuiltValue()
abstract class ProjectResponseRegion implements Built<ProjectResponseRegion, ProjectResponseRegionBuilder> {
  @BuiltValueField(wireName: r'parentRegion')
  ProjectResponseParentRegion? get parentRegion;

  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'regionType')
  ProjectResponseRegionRegionTypeEnum get regionType;
  // enum regionTypeEnum {  country,  state,  district,  subdistrict,  city,  };

  @BuiltValueField(wireName: r'lgdCode')
  String? get lgdCode;

  @BuiltValueField(wireName: r'localName')
  String get localName;

  @BuiltValueField(wireName: r'name')
  String get name;

  @BuiltValueField(wireName: r'createdAt')
  DateTime get createdAt;

  @BuiltValueField(wireName: r'updatedAt')
  DateTime get updatedAt;

  ProjectResponseRegion._();

  factory ProjectResponseRegion([void updates(ProjectResponseRegionBuilder b)]) = _$ProjectResponseRegion;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ProjectResponseRegionBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ProjectResponseRegion> get serializer => _$ProjectResponseRegionSerializer();
}

class _$ProjectResponseRegionSerializer implements PrimitiveSerializer<ProjectResponseRegion> {
  @override
  final Iterable<Type> types = const [ProjectResponseRegion, _$ProjectResponseRegion];

  @override
  final String wireName = r'ProjectResponseRegion';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ProjectResponseRegion object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.parentRegion != null) {
      yield r'parentRegion';
      yield serializers.serialize(
        object.parentRegion,
        specifiedType: const FullType(ProjectResponseParentRegion),
      );
    }
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(String),
    );
    yield r'regionType';
    yield serializers.serialize(
      object.regionType,
      specifiedType: const FullType(ProjectResponseRegionRegionTypeEnum),
    );
    if (object.lgdCode != null) {
      yield r'lgdCode';
      yield serializers.serialize(
        object.lgdCode,
        specifiedType: const FullType.nullable(String),
      );
    }
    yield r'localName';
    yield serializers.serialize(
      object.localName,
      specifiedType: const FullType(String),
    );
    yield r'name';
    yield serializers.serialize(
      object.name,
      specifiedType: const FullType(String),
    );
    yield r'createdAt';
    yield serializers.serialize(
      object.createdAt,
      specifiedType: const FullType(DateTime),
    );
    yield r'updatedAt';
    yield serializers.serialize(
      object.updatedAt,
      specifiedType: const FullType(DateTime),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    ProjectResponseRegion object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ProjectResponseRegionBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'parentRegion':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(ProjectResponseParentRegion),
          ) as ProjectResponseParentRegion?;
          if (valueDes == null) continue;
          result.parentRegion.replace(valueDes);
          break;
        case r'id':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.id = valueDes;
          break;
        case r'regionType':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(ProjectResponseRegionRegionTypeEnum),
          ) as ProjectResponseRegionRegionTypeEnum;
          result.regionType = valueDes;
          break;
        case r'lgdCode':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.lgdCode = valueDes;
          break;
        case r'localName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.localName = valueDes;
          break;
        case r'name':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.name = valueDes;
          break;
        case r'createdAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.createdAt = valueDes;
          break;
        case r'updatedAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.updatedAt = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  ProjectResponseRegion deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ProjectResponseRegionBuilder();
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


class ProjectResponseRegionRegionTypeEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'country')
  static const ProjectResponseRegionRegionTypeEnum country = _$projectResponseRegionRegionTypeEnum_country;
  @BuiltValueEnumConst(wireName: r'state')
  static const ProjectResponseRegionRegionTypeEnum state = _$projectResponseRegionRegionTypeEnum_state;
  @BuiltValueEnumConst(wireName: r'district')
  static const ProjectResponseRegionRegionTypeEnum district = _$projectResponseRegionRegionTypeEnum_district;
  @BuiltValueEnumConst(wireName: r'subdistrict')
  static const ProjectResponseRegionRegionTypeEnum subdistrict = _$projectResponseRegionRegionTypeEnum_subdistrict;
  @BuiltValueEnumConst(wireName: r'city')
  static const ProjectResponseRegionRegionTypeEnum city = _$projectResponseRegionRegionTypeEnum_city;
  @BuiltValueEnumConst(wireName: r'unknown_default_open_api', fallback: true)
  static const ProjectResponseRegionRegionTypeEnum unknownDefaultOpenApi = _$projectResponseRegionRegionTypeEnum_unknownDefaultOpenApi;

  static Serializer<ProjectResponseRegionRegionTypeEnum> get serializer => _$projectResponseRegionRegionTypeEnumSerializer;

  const ProjectResponseRegionRegionTypeEnum._(String name): super(name);

  static BuiltSet<ProjectResponseRegionRegionTypeEnum> get values => _$projectResponseRegionRegionTypeEnumValues;
  static ProjectResponseRegionRegionTypeEnum valueOf(String name) => _$projectResponseRegionRegionTypeEnumValueOf(name);
}

