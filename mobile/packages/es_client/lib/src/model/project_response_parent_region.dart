//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'project_response_parent_region.g.dart';

/// ProjectResponseParentRegion
///
/// Properties:
/// * [id] 
/// * [regionType] 
/// * [lgdCode] 
/// * [localName] 
/// * [name] 
/// * [createdAt] 
/// * [updatedAt] 
@BuiltValue()
abstract class ProjectResponseParentRegion implements Built<ProjectResponseParentRegion, ProjectResponseParentRegionBuilder> {
  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'regionType')
  ProjectResponseParentRegionRegionTypeEnum get regionType;
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

  ProjectResponseParentRegion._();

  factory ProjectResponseParentRegion([void updates(ProjectResponseParentRegionBuilder b)]) = _$ProjectResponseParentRegion;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ProjectResponseParentRegionBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ProjectResponseParentRegion> get serializer => _$ProjectResponseParentRegionSerializer();
}

class _$ProjectResponseParentRegionSerializer implements PrimitiveSerializer<ProjectResponseParentRegion> {
  @override
  final Iterable<Type> types = const [ProjectResponseParentRegion, _$ProjectResponseParentRegion];

  @override
  final String wireName = r'ProjectResponseParentRegion';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ProjectResponseParentRegion object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(String),
    );
    yield r'regionType';
    yield serializers.serialize(
      object.regionType,
      specifiedType: const FullType(ProjectResponseParentRegionRegionTypeEnum),
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
    ProjectResponseParentRegion object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ProjectResponseParentRegionBuilder result,
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
        case r'regionType':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(ProjectResponseParentRegionRegionTypeEnum),
          ) as ProjectResponseParentRegionRegionTypeEnum;
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
  ProjectResponseParentRegion deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ProjectResponseParentRegionBuilder();
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


class ProjectResponseParentRegionRegionTypeEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'country')
  static const ProjectResponseParentRegionRegionTypeEnum country = _$projectResponseParentRegionRegionTypeEnum_country;
  @BuiltValueEnumConst(wireName: r'state')
  static const ProjectResponseParentRegionRegionTypeEnum state = _$projectResponseParentRegionRegionTypeEnum_state;
  @BuiltValueEnumConst(wireName: r'district')
  static const ProjectResponseParentRegionRegionTypeEnum district = _$projectResponseParentRegionRegionTypeEnum_district;
  @BuiltValueEnumConst(wireName: r'subdistrict')
  static const ProjectResponseParentRegionRegionTypeEnum subdistrict = _$projectResponseParentRegionRegionTypeEnum_subdistrict;
  @BuiltValueEnumConst(wireName: r'city')
  static const ProjectResponseParentRegionRegionTypeEnum city = _$projectResponseParentRegionRegionTypeEnum_city;
  @BuiltValueEnumConst(wireName: r'unknown_default_open_api', fallback: true)
  static const ProjectResponseParentRegionRegionTypeEnum unknownDefaultOpenApi = _$projectResponseParentRegionRegionTypeEnum_unknownDefaultOpenApi;

  static Serializer<ProjectResponseParentRegionRegionTypeEnum> get serializer => _$projectResponseParentRegionRegionTypeEnumSerializer;

  const ProjectResponseParentRegionRegionTypeEnum._(String name): super(name);

  static BuiltSet<ProjectResponseParentRegionRegionTypeEnum> get values => _$projectResponseParentRegionRegionTypeEnumValues;
  static ProjectResponseParentRegionRegionTypeEnum valueOf(String name) => _$projectResponseParentRegionRegionTypeEnumValueOf(name);
}

