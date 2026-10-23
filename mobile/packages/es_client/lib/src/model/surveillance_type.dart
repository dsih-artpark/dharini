//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'surveillance_type.g.dart';

/// SurveillanceType
///
/// Properties:
/// * [id] 
/// * [name] 
/// * [status] 
/// * [createdAt] 
/// * [updatedAt] 
@BuiltValue()
abstract class SurveillanceType implements Built<SurveillanceType, SurveillanceTypeBuilder> {
  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'name')
  String get name;

  @BuiltValueField(wireName: r'status')
  SurveillanceTypeStatusEnum get status;
  // enum statusEnum {  active,  inactive,  deleted,  };

  @BuiltValueField(wireName: r'createdAt')
  DateTime get createdAt;

  @BuiltValueField(wireName: r'updatedAt')
  DateTime get updatedAt;

  SurveillanceType._();

  factory SurveillanceType([void updates(SurveillanceTypeBuilder b)]) = _$SurveillanceType;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(SurveillanceTypeBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<SurveillanceType> get serializer => _$SurveillanceTypeSerializer();
}

class _$SurveillanceTypeSerializer implements PrimitiveSerializer<SurveillanceType> {
  @override
  final Iterable<Type> types = const [SurveillanceType, _$SurveillanceType];

  @override
  final String wireName = r'SurveillanceType';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    SurveillanceType object, {
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
    yield r'status';
    yield serializers.serialize(
      object.status,
      specifiedType: const FullType(SurveillanceTypeStatusEnum),
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
    SurveillanceType object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required SurveillanceTypeBuilder result,
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
        case r'status':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(SurveillanceTypeStatusEnum),
          ) as SurveillanceTypeStatusEnum;
          result.status = valueDes;
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
  SurveillanceType deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = SurveillanceTypeBuilder();
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


class SurveillanceTypeStatusEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'active')
  static const SurveillanceTypeStatusEnum active = _$surveillanceTypeStatusEnum_active;
  @BuiltValueEnumConst(wireName: r'inactive')
  static const SurveillanceTypeStatusEnum inactive = _$surveillanceTypeStatusEnum_inactive;
  @BuiltValueEnumConst(wireName: r'deleted')
  static const SurveillanceTypeStatusEnum deleted = _$surveillanceTypeStatusEnum_deleted;
  @BuiltValueEnumConst(wireName: r'unknown_default_open_api', fallback: true)
  static const SurveillanceTypeStatusEnum unknownDefaultOpenApi = _$surveillanceTypeStatusEnum_unknownDefaultOpenApi;

  static Serializer<SurveillanceTypeStatusEnum> get serializer => _$surveillanceTypeStatusEnumSerializer;

  const SurveillanceTypeStatusEnum._(String name): super(name);

  static BuiltSet<SurveillanceTypeStatusEnum> get values => _$surveillanceTypeStatusEnumValues;
  static SurveillanceTypeStatusEnum valueOf(String name) => _$surveillanceTypeStatusEnumValueOf(name);
}

