//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:es_client/src/model/permission.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'user_profile_response_data_role.g.dart';

/// UserProfileResponseDataRole
///
/// Properties:
/// * [permissions] 
/// * [id] 
/// * [name] 
/// * [scope] 
/// * [type] 
/// * [status] 
/// * [createdAt] 
/// * [updatedAt] 
@BuiltValue()
abstract class UserProfileResponseDataRole implements Built<UserProfileResponseDataRole, UserProfileResponseDataRoleBuilder> {
  @BuiltValueField(wireName: r'permissions')
  BuiltList<Permission> get permissions;

  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'name')
  String get name;

  @BuiltValueField(wireName: r'scope')
  String get scope;

  @BuiltValueField(wireName: r'type')
  String get type;

  @BuiltValueField(wireName: r'status')
  UserProfileResponseDataRoleStatusEnum get status;
  // enum statusEnum {  active,  inactive,  deleted,  };

  @BuiltValueField(wireName: r'createdAt')
  DateTime get createdAt;

  @BuiltValueField(wireName: r'updatedAt')
  DateTime get updatedAt;

  UserProfileResponseDataRole._();

  factory UserProfileResponseDataRole([void updates(UserProfileResponseDataRoleBuilder b)]) = _$UserProfileResponseDataRole;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UserProfileResponseDataRoleBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<UserProfileResponseDataRole> get serializer => _$UserProfileResponseDataRoleSerializer();
}

class _$UserProfileResponseDataRoleSerializer implements PrimitiveSerializer<UserProfileResponseDataRole> {
  @override
  final Iterable<Type> types = const [UserProfileResponseDataRole, _$UserProfileResponseDataRole];

  @override
  final String wireName = r'UserProfileResponseDataRole';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    UserProfileResponseDataRole object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'permissions';
    yield serializers.serialize(
      object.permissions,
      specifiedType: const FullType(BuiltList, [FullType(Permission)]),
    );
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
      specifiedType: const FullType(UserProfileResponseDataRoleStatusEnum),
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
    UserProfileResponseDataRole object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UserProfileResponseDataRoleBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'permissions':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(Permission)]),
          ) as BuiltList<Permission>;
          result.permissions.replace(valueDes);
          break;
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
            specifiedType: const FullType(UserProfileResponseDataRoleStatusEnum),
          ) as UserProfileResponseDataRoleStatusEnum;
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
  UserProfileResponseDataRole deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UserProfileResponseDataRoleBuilder();
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


class UserProfileResponseDataRoleStatusEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'active')
  static const UserProfileResponseDataRoleStatusEnum active = _$userProfileResponseDataRoleStatusEnum_active;
  @BuiltValueEnumConst(wireName: r'inactive')
  static const UserProfileResponseDataRoleStatusEnum inactive = _$userProfileResponseDataRoleStatusEnum_inactive;
  @BuiltValueEnumConst(wireName: r'deleted')
  static const UserProfileResponseDataRoleStatusEnum deleted = _$userProfileResponseDataRoleStatusEnum_deleted;
  @BuiltValueEnumConst(wireName: r'unknown_default_open_api', fallback: true)
  static const UserProfileResponseDataRoleStatusEnum unknownDefaultOpenApi = _$userProfileResponseDataRoleStatusEnum_unknownDefaultOpenApi;

  static Serializer<UserProfileResponseDataRoleStatusEnum> get serializer => _$userProfileResponseDataRoleStatusEnumSerializer;

  const UserProfileResponseDataRoleStatusEnum._(String name): super(name);

  static BuiltSet<UserProfileResponseDataRoleStatusEnum> get values => _$userProfileResponseDataRoleStatusEnumValues;
  static UserProfileResponseDataRoleStatusEnum valueOf(String name) => _$userProfileResponseDataRoleStatusEnumValueOf(name);
}

