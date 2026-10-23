//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'project_location_state_type.g.dart';

/// ProjectLocationStateType
///
/// Properties:
/// * [id] 
/// * [regionType] 
/// * [lgdcode] 
/// * [localname] 
/// * [name] 
/// * [createdat] 
/// * [updatedat] 
@BuiltValue()
abstract class ProjectLocationStateType implements Built<ProjectLocationStateType, ProjectLocationStateTypeBuilder> {
  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'regionType')
  String get regionType;

  @BuiltValueField(wireName: r'lgdcode')
  num get lgdcode;

  @BuiltValueField(wireName: r'localname')
  String get localname;

  @BuiltValueField(wireName: r'name')
  String get name;

  @BuiltValueField(wireName: r'createdat')
  DateTime get createdat;

  @BuiltValueField(wireName: r'updatedat')
  DateTime get updatedat;

  ProjectLocationStateType._();

  factory ProjectLocationStateType([void updates(ProjectLocationStateTypeBuilder b)]) = _$ProjectLocationStateType;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ProjectLocationStateTypeBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ProjectLocationStateType> get serializer => _$ProjectLocationStateTypeSerializer();
}

class _$ProjectLocationStateTypeSerializer implements PrimitiveSerializer<ProjectLocationStateType> {
  @override
  final Iterable<Type> types = const [ProjectLocationStateType, _$ProjectLocationStateType];

  @override
  final String wireName = r'ProjectLocationStateType';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ProjectLocationStateType object, {
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
      specifiedType: const FullType(String),
    );
    yield r'lgdcode';
    yield serializers.serialize(
      object.lgdcode,
      specifiedType: const FullType(num),
    );
    yield r'localname';
    yield serializers.serialize(
      object.localname,
      specifiedType: const FullType(String),
    );
    yield r'name';
    yield serializers.serialize(
      object.name,
      specifiedType: const FullType(String),
    );
    yield r'createdat';
    yield serializers.serialize(
      object.createdat,
      specifiedType: const FullType(DateTime),
    );
    yield r'updatedat';
    yield serializers.serialize(
      object.updatedat,
      specifiedType: const FullType(DateTime),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    ProjectLocationStateType object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ProjectLocationStateTypeBuilder result,
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
            specifiedType: const FullType(String),
          ) as String;
          result.regionType = valueDes;
          break;
        case r'lgdcode':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.lgdcode = valueDes;
          break;
        case r'localname':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.localname = valueDes;
          break;
        case r'name':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.name = valueDes;
          break;
        case r'createdat':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.createdat = valueDes;
          break;
        case r'updatedat':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.updatedat = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  ProjectLocationStateType deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ProjectLocationStateTypeBuilder();
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


