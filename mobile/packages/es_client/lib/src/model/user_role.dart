//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:es_client/src/model/workspace.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'user_role.g.dart';

/// UserRole
///
/// Properties:
/// * [workspace] 
/// * [id] 
/// * [team] 
/// * [project] 
/// * [status] 
@BuiltValue()
abstract class UserRole implements Built<UserRole, UserRoleBuilder> {
  @BuiltValueField(wireName: r'workspace')
  Workspace? get workspace;

  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'team')
  String? get team;

  @BuiltValueField(wireName: r'project')
  String? get project;

  @BuiltValueField(wireName: r'status')
  UserRoleStatusEnum get status;
  // enum statusEnum {  active,  inactive,  deleted,  };

  UserRole._();

  factory UserRole([void updates(UserRoleBuilder b)]) = _$UserRole;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UserRoleBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<UserRole> get serializer => _$UserRoleSerializer();
}

class _$UserRoleSerializer implements PrimitiveSerializer<UserRole> {
  @override
  final Iterable<Type> types = const [UserRole, _$UserRole];

  @override
  final String wireName = r'UserRole';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    UserRole object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
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
      specifiedType: const FullType(UserRoleStatusEnum),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    UserRole object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UserRoleBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
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
            specifiedType: const FullType(UserRoleStatusEnum),
          ) as UserRoleStatusEnum;
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
  UserRole deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UserRoleBuilder();
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


class UserRoleStatusEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'active')
  static const UserRoleStatusEnum active = _$userRoleStatusEnum_active;
  @BuiltValueEnumConst(wireName: r'inactive')
  static const UserRoleStatusEnum inactive = _$userRoleStatusEnum_inactive;
  @BuiltValueEnumConst(wireName: r'deleted')
  static const UserRoleStatusEnum deleted = _$userRoleStatusEnum_deleted;
  @BuiltValueEnumConst(wireName: r'unknown_default_open_api', fallback: true)
  static const UserRoleStatusEnum unknownDefaultOpenApi = _$userRoleStatusEnum_unknownDefaultOpenApi;

  static Serializer<UserRoleStatusEnum> get serializer => _$userRoleStatusEnumSerializer;

  const UserRoleStatusEnum._(String name): super(name);

  static BuiltSet<UserRoleStatusEnum> get values => _$userRoleStatusEnumValues;
  static UserRoleStatusEnum valueOf(String name) => _$userRoleStatusEnumValueOf(name);
}

