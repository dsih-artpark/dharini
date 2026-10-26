//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:es_client/src/model/user_profile_response_data_role.dart';
import 'package:es_client/src/model/workspace.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'user_profile_response_data_user_role.g.dart';

/// UserProfileResponseDataUserRole
///
/// Properties:
/// * [role] 
/// * [workspace] 
/// * [id] 
/// * [team] 
/// * [project] 
/// * [status] 
@BuiltValue()
abstract class UserProfileResponseDataUserRole implements Built<UserProfileResponseDataUserRole, UserProfileResponseDataUserRoleBuilder> {
  @BuiltValueField(wireName: r'role')
  UserProfileResponseDataRole? get role;

  @BuiltValueField(wireName: r'workspace')
  Workspace? get workspace;

  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'team')
  String? get team;

  @BuiltValueField(wireName: r'project')
  String? get project;

  @BuiltValueField(wireName: r'status')
  UserProfileResponseDataUserRoleStatusEnum get status;
  // enum statusEnum {  active,  inactive,  deleted,  };

  UserProfileResponseDataUserRole._();

  factory UserProfileResponseDataUserRole([void updates(UserProfileResponseDataUserRoleBuilder b)]) = _$UserProfileResponseDataUserRole;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UserProfileResponseDataUserRoleBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<UserProfileResponseDataUserRole> get serializer => _$UserProfileResponseDataUserRoleSerializer();
}

class _$UserProfileResponseDataUserRoleSerializer implements PrimitiveSerializer<UserProfileResponseDataUserRole> {
  @override
  final Iterable<Type> types = const [UserProfileResponseDataUserRole, _$UserProfileResponseDataUserRole];

  @override
  final String wireName = r'UserProfileResponseDataUserRole';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    UserProfileResponseDataUserRole object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.role != null) {
      yield r'role';
      yield serializers.serialize(
        object.role,
        specifiedType: const FullType(UserProfileResponseDataRole),
      );
    }
    if (object.workspace != null) {
      yield r'workspace';
      yield serializers.serialize(
        object.workspace,
        specifiedType: const FullType.nullable(Workspace),
      );
    }
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(String),
    );
    if (object.team != null) {
      yield r'team';
      yield serializers.serialize(
        object.team,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.project != null) {
      yield r'project';
      yield serializers.serialize(
        object.project,
        specifiedType: const FullType.nullable(String),
      );
    }
    yield r'status';
    yield serializers.serialize(
      object.status,
      specifiedType: const FullType(UserProfileResponseDataUserRoleStatusEnum),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    UserProfileResponseDataUserRole object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UserProfileResponseDataUserRoleBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'role':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(UserProfileResponseDataRole),
          ) as UserProfileResponseDataRole?;
          if (valueDes == null) continue;
          result.role.replace(valueDes);
          break;
        case r'workspace':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(Workspace),
          ) as Workspace?;
          if (valueDes == null) continue;
          result.workspace.replace(valueDes);
          break;
        case r'id':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.id = valueDes;
          break;
        case r'team':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.team = valueDes;
          break;
        case r'project':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.project = valueDes;
          break;
        case r'status':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(UserProfileResponseDataUserRoleStatusEnum),
          ) as UserProfileResponseDataUserRoleStatusEnum;
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
  UserProfileResponseDataUserRole deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UserProfileResponseDataUserRoleBuilder();
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


class UserProfileResponseDataUserRoleStatusEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'active')
  static const UserProfileResponseDataUserRoleStatusEnum active = _$userProfileResponseDataUserRoleStatusEnum_active;
  @BuiltValueEnumConst(wireName: r'inactive')
  static const UserProfileResponseDataUserRoleStatusEnum inactive = _$userProfileResponseDataUserRoleStatusEnum_inactive;
  @BuiltValueEnumConst(wireName: r'deleted')
  static const UserProfileResponseDataUserRoleStatusEnum deleted = _$userProfileResponseDataUserRoleStatusEnum_deleted;
  @BuiltValueEnumConst(wireName: r'unknown_default_open_api', fallback: true)
  static const UserProfileResponseDataUserRoleStatusEnum unknownDefaultOpenApi = _$userProfileResponseDataUserRoleStatusEnum_unknownDefaultOpenApi;

  static Serializer<UserProfileResponseDataUserRoleStatusEnum> get serializer => _$userProfileResponseDataUserRoleStatusEnumSerializer;

  const UserProfileResponseDataUserRoleStatusEnum._(String name): super(name);

  static BuiltSet<UserProfileResponseDataUserRoleStatusEnum> get values => _$userProfileResponseDataUserRoleStatusEnumValues;
  static UserProfileResponseDataUserRoleStatusEnum valueOf(String name) => _$userProfileResponseDataUserRoleStatusEnumValueOf(name);
}

