//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'role_response_data.g.dart';

/// RoleResponseData
///
/// Properties:
/// * [id] 
/// * [name] 
/// * [scope] 
/// * [type] 
/// * [status] 
/// * [createdAt] 
/// * [updatedAt] 
@BuiltValue()
abstract class RoleResponseData implements Built<RoleResponseData, RoleResponseDataBuilder> {
  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'name')
  String get name;

  @BuiltValueField(wireName: r'scope')
  String get scope;

  @BuiltValueField(wireName: r'type')
  String get type;

  @BuiltValueField(wireName: r'status')
  RoleResponseDataStatusEnum get status;
  // enum statusEnum {  active,  inactive,  deleted,  };

  @BuiltValueField(wireName: r'createdAt')
  DateTime get createdAt;

  @BuiltValueField(wireName: r'updatedAt')
  DateTime get updatedAt;

  RoleResponseData._();

  factory RoleResponseData([void updates(RoleResponseDataBuilder b)]) = _$RoleResponseData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(RoleResponseDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<RoleResponseData> get serializer => _$RoleResponseDataSerializer();
}

class _$RoleResponseDataSerializer implements PrimitiveSerializer<RoleResponseData> {
  @override
  final Iterable<Type> types = const [RoleResponseData, _$RoleResponseData];

  @override
  final String wireName = r'RoleResponseData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    RoleResponseData object, {
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
    yield r'scope';
    yield serializers.serialize(
      object.scope,
      specifiedType: const FullType(String),
    );
    yield r'type';
    yield serializers.serialize(
      object.type,
      specifiedType: const FullType(String),
    );
    yield r'status';
    yield serializers.serialize(
      object.status,
      specifiedType: const FullType(RoleResponseDataStatusEnum),
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
    RoleResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required RoleResponseDataBuilder result,
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
        case r'scope':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.scope = valueDes;
          break;
        case r'type':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.type = valueDes;
          break;
        case r'status':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(RoleResponseDataStatusEnum),
          ) as RoleResponseDataStatusEnum;
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
  RoleResponseData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = RoleResponseDataBuilder();
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


class RoleResponseDataStatusEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'active')
  static const RoleResponseDataStatusEnum active = _$roleResponseDataStatusEnum_active;
  @BuiltValueEnumConst(wireName: r'inactive')
  static const RoleResponseDataStatusEnum inactive = _$roleResponseDataStatusEnum_inactive;
  @BuiltValueEnumConst(wireName: r'deleted')
  static const RoleResponseDataStatusEnum deleted = _$roleResponseDataStatusEnum_deleted;
  @BuiltValueEnumConst(wireName: r'unknown_default_open_api', fallback: true)
  static const RoleResponseDataStatusEnum unknownDefaultOpenApi = _$roleResponseDataStatusEnum_unknownDefaultOpenApi;

  static Serializer<RoleResponseDataStatusEnum> get serializer => _$roleResponseDataStatusEnumSerializer;

  const RoleResponseDataStatusEnum._(String name): super(name);

  static BuiltSet<RoleResponseDataStatusEnum> get values => _$roleResponseDataStatusEnumValues;
  static RoleResponseDataStatusEnum valueOf(String name) => _$roleResponseDataStatusEnumValueOf(name);
}

