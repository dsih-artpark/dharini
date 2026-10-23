//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'role_response.g.dart';

/// RoleResponse
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
abstract class RoleResponse implements Built<RoleResponse, RoleResponseBuilder> {
  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'name')
  String get name;

  @BuiltValueField(wireName: r'scope')
  String get scope;

  @BuiltValueField(wireName: r'type')
  String get type;

  @BuiltValueField(wireName: r'status')
  RoleResponseStatusEnum get status;
  // enum statusEnum {  active,  inactive,  deleted,  };

  @BuiltValueField(wireName: r'createdAt')
  DateTime get createdAt;

  @BuiltValueField(wireName: r'updatedAt')
  DateTime get updatedAt;

  RoleResponse._();

  factory RoleResponse([void updates(RoleResponseBuilder b)]) = _$RoleResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(RoleResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<RoleResponse> get serializer => _$RoleResponseSerializer();
}

class _$RoleResponseSerializer implements PrimitiveSerializer<RoleResponse> {
  @override
  final Iterable<Type> types = const [RoleResponse, _$RoleResponse];

  @override
  final String wireName = r'RoleResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    RoleResponse object, {
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
      specifiedType: const FullType(RoleResponseStatusEnum),
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
    RoleResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required RoleResponseBuilder result,
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
            specifiedType: const FullType(RoleResponseStatusEnum),
          ) as RoleResponseStatusEnum;
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
  RoleResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = RoleResponseBuilder();
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


class RoleResponseStatusEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'active')
  static const RoleResponseStatusEnum active = _$roleResponseStatusEnum_active;
  @BuiltValueEnumConst(wireName: r'inactive')
  static const RoleResponseStatusEnum inactive = _$roleResponseStatusEnum_inactive;
  @BuiltValueEnumConst(wireName: r'deleted')
  static const RoleResponseStatusEnum deleted = _$roleResponseStatusEnum_deleted;
  @BuiltValueEnumConst(wireName: r'unknown_default_open_api', fallback: true)
  static const RoleResponseStatusEnum unknownDefaultOpenApi = _$roleResponseStatusEnum_unknownDefaultOpenApi;

  static Serializer<RoleResponseStatusEnum> get serializer => _$roleResponseStatusEnumSerializer;

  const RoleResponseStatusEnum._(String name): super(name);

  static BuiltSet<RoleResponseStatusEnum> get values => _$roleResponseStatusEnumValues;
  static RoleResponseStatusEnum valueOf(String name) => _$roleResponseStatusEnumValueOf(name);
}

