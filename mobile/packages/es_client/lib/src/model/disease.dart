//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'disease.g.dart';

/// Disease
///
/// Properties:
/// * [id] 
/// * [code] 
/// * [name] 
/// * [shortName] 
/// * [index] 
/// * [createdAt] 
/// * [updatedAt] 
/// * [status] 
@BuiltValue()
abstract class Disease implements Built<Disease, DiseaseBuilder> {
  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'code')
  String get code;

  @BuiltValueField(wireName: r'name')
  String get name;

  @BuiltValueField(wireName: r'shortName')
  String get shortName;

  @BuiltValueField(wireName: r'index')
  num get index;

  @BuiltValueField(wireName: r'createdAt')
  DateTime get createdAt;

  @BuiltValueField(wireName: r'updatedAt')
  DateTime get updatedAt;

  @BuiltValueField(wireName: r'status')
  DiseaseStatusEnum? get status;
  // enum statusEnum {  active,  inactive,  deleted,  };

  Disease._();

  factory Disease([void updates(DiseaseBuilder b)]) = _$Disease;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(DiseaseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<Disease> get serializer => _$DiseaseSerializer();
}

class _$DiseaseSerializer implements PrimitiveSerializer<Disease> {
  @override
  final Iterable<Type> types = const [Disease, _$Disease];

  @override
  final String wireName = r'Disease';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    Disease object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(String),
    );
    yield r'code';
    yield serializers.serialize(
      object.code,
      specifiedType: const FullType(String),
    );
    yield r'name';
    yield serializers.serialize(
      object.name,
      specifiedType: const FullType(String),
    );
    yield r'shortName';
    yield serializers.serialize(
      object.shortName,
      specifiedType: const FullType(String),
    );
    yield r'index';
    yield serializers.serialize(
      object.index,
      specifiedType: const FullType(num),
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
    if (object.status != null) {
      yield r'status';
      yield serializers.serialize(
        object.status,
        specifiedType: const FullType.nullable(DiseaseStatusEnum),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    Disease object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required DiseaseBuilder result,
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
        case r'code':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.code = valueDes;
          break;
        case r'name':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.name = valueDes;
          break;
        case r'shortName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.shortName = valueDes;
          break;
        case r'index':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.index = valueDes;
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
        case r'status':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(DiseaseStatusEnum),
          ) as DiseaseStatusEnum?;
          if (valueDes == null) continue;
          result.status = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  Disease deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = DiseaseBuilder();
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


class DiseaseStatusEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'active')
  static const DiseaseStatusEnum active = _$diseaseStatusEnum_active;
  @BuiltValueEnumConst(wireName: r'inactive')
  static const DiseaseStatusEnum inactive = _$diseaseStatusEnum_inactive;
  @BuiltValueEnumConst(wireName: r'deleted')
  static const DiseaseStatusEnum deleted = _$diseaseStatusEnum_deleted;
  @BuiltValueEnumConst(wireName: r'unknown_default_open_api', fallback: true)
  static const DiseaseStatusEnum unknownDefaultOpenApi = _$diseaseStatusEnum_unknownDefaultOpenApi;

  static Serializer<DiseaseStatusEnum> get serializer => _$diseaseStatusEnumSerializer;

  const DiseaseStatusEnum._(String name): super(name);

  static BuiltSet<DiseaseStatusEnum> get values => _$diseaseStatusEnumValues;
  static DiseaseStatusEnum valueOf(String name) => _$diseaseStatusEnumValueOf(name);
}

